var dict = new Object();
var cal = new Object();

cal = {
	date: "Fri, Aug 18",
	event: "Baccalaureate Exam Report Due (for August Degree Conferral)"
};

dict = {
	Question: "What events are going on this week?"
};


function fun(cal){
    console.log(cal[1].event);
};

/**
 * 
 * @param {Number} year 
 * @returns true if leap year, false if not
 */
function is_leap_year(year){
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

/**
 * finds the number of days given the month and year
 * @param {Number} month 
 * @param {String} year 
 * @returns number of days in given month
 */
function get_num_days_in_month(month, year){
    if(month % 2 == 0){
        if(month == 2){
            if (is_leap_year(Number(year))){
                return 29;
            }else{
                return 28;
            }
        }else{
            return 30;
        }
    }else{
        return 31;
    }
}

/** 
 * returns all events starting on a given date found in given calendar
 * @param {Array} calendar this is a list of dictionaries, each dict will include a start date, an end date, and an event title
 * @param {String} date the given date to search for
 * @return {Array} all events that are happening on given date, returns empty if none.
*/
export function parse_calendar(calendar, month, day, year){
    // console.log("scanning calendar...");
    const dateWOyear = month + "-" + day;
    // console.log(dateWOyear);
    var allEvents = [];

    //loop through each event in the calendar to check and see if given date matches event dates
    for(let index=0; index<calendar.length; index++){
        let current = calendar[index];
        if(current.dateStart == dateWOyear){//check if something starts today
            // console.log(current.event);
            allEvents.push(current);
        }
        else if(current.dateEnd == dateWOyear){//check if something ends today
            // console.log(current.event);
            allEvents.push(current);
        }
        else if(current.dateStart != current.dateEnd){
            const startit = current.dateStart.split("-");
            const endit = current.dateEnd.split("-");
            var startNum = Number(startit[1]);//start day w/o month as an int
            var endNum = Number(endit[1]);//end day w/o month as an int
            if(startit[0] == endit[0]){//check if dates in between start and end match current date
                for(let jndex = startNum+1; jndex < endNum; jndex++){
                    const newCurrent = startit[0]+"-"+jndex;
                    if(newCurrent == dateWOyear){
                        // console.log(current.event);
                        allEvents.push(current);
                    }
                }
            }
            else{//if starts in one month and ends in next
                var startMonth = Number(startit[0]);
                var startMonthTotal = get_num_days_in_month(startMonth, year);
                var found = false;
                for(let jndex = startNum+1; jndex <= startMonthTotal; jndex++){
                    const newCurrent = startit[0]+"-"+jndex;
                    if(newCurrent == dateWOyear){
                        // console.log(current.event);
                        allEvents.push(current);
                        found = true;
                    }
                }
                if(!found){
                    for(let jndex = 1; jndex <= endNum; jndex++){
                        const newCurrent = startit[0]+"-"+jndex;
                        if(newCurrent == dateWOyear){
                            // console.log(current.event);
                            allEvents.push(current);
                        }
                    }
                }
            }
        }
    }
    // console.log("scan complete.");
    return allEvents;
}

// const dateArray = new Date().toLocaleDateString().split("/");
// console.log(date);
// const removeTime = date.split("T");
// const dateArray = date.split("/");
// console.log(dateArray);

export function todaysEventsList(calendar){
    const dateArray = new Date().toLocaleDateString().split("/");
    var todaysSchedule = parse_calendar(calendar, dateArray[0], dateArray[1], dateArray[2]);
    var schedule = [];
    for(let i = 0; i<todaysSchedule.length; i++){
        const each = "Event " + (i+1) + ", '" + todaysSchedule[i].event + "' started on " + todaysSchedule[i].dateStart + " and will end on " + todaysSchedule[i].dateEnd;
        schedule.push(each);
    }
    return schedule
}

export function thisWeeksEventsList(calendar){
    const dateArray = new Date().toLocaleDateString().split("/");
    const today = Number(dateArray[1]);
    const daysInCurrentMonth = get_num_days_in_month(Number(dateArray[0]), dateArray[2]);
    var events = [];
    var schedule = [];
    if((today+7)<=daysInCurrentMonth){
        for(let day = today; day<(today+7); day++){
            var eventsOnDay = parse_calendar(calendar, dateArray[0], day.toString(), dateArray[2]);
            for(let index = 0; index < eventsOnDay.length; index++){
                events.push(eventsOnDay[index])
            }
        }
    }else{
        count = 1;
        for(let day = today; day<daysInCurrentMonth; day++){
            var eventsOnDay = parse_calendar(calendar, dateArray[0], day.toString(), dateArray[2]);
            for(let index = 0; index < eventsOnDay.length; index++){
                events.push(eventsOnDay[index])
            }
            count++;
        }
        for(let day = 1; count<7; day++){
            var eventsOnDay = parse_calendar(calendar, (Number(dateArray[0])+1).toString(), day.toString(), dateArray[2]);
            for(let index = 0; index < eventsOnDay.length; index++){
                events.push(eventsOnDay[index])
            }
            count++;
        }
        
    }
    for(let i = 0; i<events.length; i++){
        const eachy = "Event " + (i+1) + ", '" + events[i].event + "' started on " + events[i].dateStart + " and will end on " + events[i].dateEnd;
        schedule.push(eachy);
    }
    return schedule
}


// var o823Schedule = parse_calendar(acaCal2023, "08", "23", dateArray[2]);
// // console.log();
// for(let i = 0; i<o823Schedule.length; i++){
//     // console.log("Event " + (i+1) + ", '" + o823Schedule[i].event + "' started on " + o823Schedule[i].dateStart + " and will end on " + o823Schedule[i].dateEnd);
// }


// console.log(is_leap_year(2023))//test leapyear

// module.exports = { parse_calendar, todaysEventsList, thisWeeksEventsList };