import { fall_2023 } from "./academic_calendars.js";
import { todaysEventsList, thisWeeksEventsList  } from "./parse_calendar.js";

function getQnA(){
    var qNa = [
        {
            Question: "What events are going on today?",
            Answer: todaysEventsList(fall_2023)
        },
        {
            Question: "What events are going on this week?",
            Answer: thisWeeksEventsList(fall_2023)
        }
    ];
    return qNa;
};

function translate_acronyms(acro){
    var acronyms = [
        {
            acronym: "ncf",
            definition: "New College of Florida"
        },
        {
            acronym: "ceo",
            definition: "Career Engagement & Opportunity"
        },
        {
            acronym: "sca",
            definition: "Student Career Assistant"
        },
        {
            acronym: "cwc",
            definition: "Counceling and Wellness Center"
        },
        {
            acronym: "ssc",
            definition: "Student Success Center"
        },
        {
            acronym: "wrc",
            definition: "Writing Resource Center"
        }
    ]
    for(let i = 0; i<acronyms.length; i++){
        if(acronyms[i].acronym == acro){
            return acronyms[i].definition;
        }
    }
    return "no acronym definition was found";
};

export function times_places_are_open(acro){
    var timesNplaces = [
        {
            place: "ceo",
            times: {
                mon: "8-5",
                tue: "8-5",
                wed: "8-5",
                thu: "8-5",
                fri: "8-5",
                sat: "closed",
                sun: "closed",
            },
            location: "Attached to the Library, through the side, near the overpass."
        },
        {
            place: "wrc",
            alternate_needed: true,
            times: {
                mon: "8-5",
                tue: "8-5",
                wed: "8-5",
                thu: "8-5",
                fri: "8-5",
                sat: "closed",
                sun: "closed",
            },
            alternate_times: "https://ncf.mywconline.com/",
            location: "Jane Bancroft Cook Library, room 103."
        },
        {
            place: "ham",
            alternate_needed: true,
            times: {
                mon: "8-5",
                tue: "8-5",
                wed: "8-5",
                thu: "8-5",
                fri: "8-5",
                sat: "8-5",
                sun: "8-5",
            },
            alternate_times: "https://www.metznewcollege.com/cafe.html",
            location: ""
        },
    ];
    const dateArray = new Date().toString();
    console.log(dateArray);
    const dateList = dateArray[0].split(' ');
    const hour = dateList[4].split(':')[0];
    const day_of_week = dateList[0].toLowerCase();
    console.log(hour);

    for(let i = 0 ; i<timesNplaces.length ; i++){
        if(timesNplaces[i].place === acro){
            let times_open_today = [];
            let last_hour = "";
            if(timesNplaces.alternate_needed){
                return timesNplaces.alternate_times;
            }else{
                if(day_of_week === 'mon'){
                    times_open_today = timesNplaces.times.mon.split("-");
                }
                else if(day_of_week === 'tue'){
                    times_open_today = timesNplaces.times.tue.split("-");
                }
                else if(day_of_week === 'wed'){
                    times_open_today = timesNplaces.times.wed.split("-");
                }
                else if(day_of_week === 'thu'){
                    times_open_today = timesNplaces.times.thu.split("-");
                }
                else if(day_of_week === 'fri'){
                    times_open_today = timesNplaces.times.fri.split("-");
                }
                else if(day_of_week === 'sat'){
                    times_open_today = timesNplaces.times.sat.split("-");
                }
                else if(day_of_week === 'sun'){
                    times_open_today = timesNplaces.times.sun.split("-");
                }



                if(times_open_today[1]>12){
                    last_hour = Number(times_open_today[1]+12);
                }
                var open = false;
                for(let j = Number(times_open_today[0]); j<last_hour;j++){
                    if(j == Number(hour)){
                        open = true;
                    }
                }
                if (open){
                    return "The " + translate_acronyms(timesNplaces.place) + " is open now."
                } else{
                    return "The " + translate_acronyms(timesNplaces.place) + " is not open now."
                }
            }
        }
    }
    

};


// module.exports = { getQnA, translate_acronyms, times_places_are_open };
