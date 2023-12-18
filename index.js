// import { fun } from "./dictionaries/academic_calendar.js";

// Require the necessary discord.js classes
import pkg from 'discord.js';
const { Client, GatewayIntentBits, discord } = pkg;
// import { Client, GatewayIntentBits, Discord } from 'discord.js';
import { config } from 'dotenv';
config();
// import { token } from './config.json' assert { type: "json" };
import { fall_2023 } from "./academic_calendars.js";
import { parse_calendar, todaysEventsList, thisWeeksEventsList } from "./parse_calendar.js";
// import { times_places_are_open } from "./questions_dict.js";
import howYaDoing from "./friendlies.js";
import { runPythonScript, ping } from "./chatbot.js";
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import fs from 'node:fs';
import {spawn} from "child_process"; 
import { execFile } from 'child_process';
import { createInterface } from 'readline';
import { channel } from 'diagnostics_channel';
// import output from 'image-output';

function runPythonFunction(scriptPath, args1, args2) {
	console.log(args1, "     ", args2);
	const command = `/bin/python3 ${scriptPath} ${[args1]}`;
    execFile('/bin/python3', [scriptPath, args1, args2], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        console.log(`Python function output: ${stdout}`);
    });
	console.log('Start');
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once('ready', (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

var acaCal2023 = fall_2023();
// times_places_are_open("acro");

// var todayEvents = parse_calendar.todaysEventsList(acaCal2023);

client.on('messageCreate', (message) => {
	if (message.content === 'ping') {
		message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	}
});

async function runPythonScript2(scriptPath, args) {
  console.log(args);
  // Use child_process.spawn method from 
  // child_process module and assign it to variable
  const pyProg = spawn('/bin/python3', [scriptPath].concat(args));
  console.log("1");

  // Collect data from script and print to console
  let data = '';
  pyProg.stdout.on('data', (stdout) => {
    data += stdout.toString();
  });
  console.log("2");
  

  // Print errors to console, if any
  pyProg.stderr.on('data', (stderr) => {
    console.log(`stderr: ${stderr}`);
  });
  console.log("3");

  // When script is finished, print collected data
  pyProg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(data);
  });
  console.log("4");

  console.log(ping());
  return data;
}

async function read_csv(){
	// await runPythonFunction('./algorithms.py', [String(message.content)]);
	let results = []
	// createReadStream('./save.csv')
	// 	.pipe(csv.parse({ headers: true }))
	// 	.on('data', (data) => {
	// 		console.log(data);
	// 		results.push(data);
	// 		return data;
	// 	})
	// 	.on('end', () => {
	// 		console.log('CSV file successfully processed.');
	// 		console.log(results);
	// 	})
	let data = "";
	try {
		data = fs.readFileSync('./ham_answers.csv', 'utf8');
		console.log("this is:", data);
	  } catch (err) {
		console.error(err);
	  }
	return data;
};


//respond to messages
client.on('messageCreate', (message) => {
	if(message.author.username != 'The Four Winds Bot'){
		message.channel.send("thinking...")
		// console.log(message);
		console.log(ping());
		let results = "";
		// const read_csv = async () => {
		// 	await runPythonScript('./algorithms.py', [String(message.content)]).then(read_csv());
		// 	// do something else here after firstFunction completes
		// 	results = read_csv()
		//   }
		// Using setTimeout to wait for 2 seconds (2000 milliseconds)
		runPythonFunction('./algorithms.py', [String(message.content)], ['data_best_copy.csv']);
		setTimeout(() => {
			try {
				results = fs.readFileSync('./save.txt', 'utf8');
				console.log("this is:", results);
			  } catch (err) {
				console.error(err);
			  }
		}, 3500);
		setTimeout(() => {
			console.log("END: ",typeof results, results);
				
			message.channel.send("I am thinking this category is... "+results);
			message.channel.send("Working on accurate response...")

			if(results === "ham"){
				message.channel.send("The Hamilton Center Hours are located on this website: https://www.metznewcollege.com/cafe.html");
			}
			if(results === "ceo"){
				message.channel.send("The CEO is the campus career center known as the Career Engagement & Opportunity Center. They are open from 8-5 on MON-FRI. You can make an appointment through Handshake on the myNCF portal.");
			}
			if(results === "library"){
				message.channel.send("The Jane Bancroft Library currently has off hours that can be found at this website: https://www.ncf.edu/library/");
			}
			if(results === "wrc"){
				message.channel.send("The Writing Resource Center is a place to gain writing support from peer students on campus. It is located in the Library in room 103. to make an appointment follow this link: https://ncf.mywconline.com/");
			}
			if(results === "maintenance"){
				message.channel.send("Maintenence can be requested the myNCF Website through the maintence portal. the password to submit is `NCF`");
			}
			if(results === "ra"){
				message.channel.send("The Residantial Assistant phone number is (941)780-8441.");
			}
			if(results === "campus_police"){
				message.channel.send("The Campus Police phone number is (941)487-4210");
			}
			if(results === "aca_cal"){
				var weeksEvents = thisWeeksEventsList(acaCal2023);
				for(let i = 0; i<weeksEvents.length; i++){
					message.channel.send(weeksEvents[i]);
				}
			}
			if(results === "sca"){
				message.channel.send("SCA's are Student Career Assistants. You can meet with them at select times through the CEO.");
			}
			if(results === "professor_roy"){
				message.channel.send("Professor Roy is located in Heiser Office E157 and her you can make an appointment by emailing her at troy@ncf.edu");
			}
			if(results === "professor_hamid"){
				message.channel.send("Professor Hamid is located in Heiser Office E153 and you can email her to make an email at fhamid@ncf.edu");
			}
			if(results === "professor_page"){
				message.channel.send("Professor Page is located in Heiser Office E155, and you can email him to make an appointment at dpage@ncf.edu");
			}
			if(results === "ssc"){
				message.channel.send("the ssc is the Student Success Center. it is located in the jane banecroft library.");
			}
			if(results === "greeting"){
				message.channel.send(howYaDoing());
			}
			if((results === "four_winds_bot") || (results === "help")){
				message.channel.send("Hello, I am a robot, although I am not able to feel the same way you do, I am always happy to help you!")
			}
			if(results === "registration"){
				message.channel.send("To access registration: first email your advisor for a pin, then enter the pin on Banner 9 app on myNCF, then finally select the classes you want, and select add.")
			}

			if(results === "location"){
				let results2 = "";
				runPythonFunction('./algorithms.py', [String(message.content)], ['location_q_n_a.csv']);
				setTimeout(() => {
					try {
						// results = fs.readFileSync('./save.txt', 'utf8');
						// console.log("this is:", results2);
						// } catch (err) {
						// console.error(err);
						// }
						
						const filePath = './save.txt'; // Replace 'yourfile.txt' with the path to your text file

						const readInterface = createInterface({
						input: createReadStream(filePath),
						output: process.stdout,
						console: false
						});

						readInterface.on('line', (line) => {
							console.log(line); // This will print each line of the file
							setTimeout(() => {

								message.channel.send(line);
								// const embed = new Discord.MessageEmbed.setTitle('Attachments'); //   MessageEmbed().setTitle('Attachments');
								// channel.send({ embeds: [embed], files: ['./campusMap.jpg'] });
								// export interface EmbedAssetData extends Omit<APIEmbedImage, 'https://www.ncf.edu/wp-content/uploads/2021/10/CampusMap-UpdatedOct2020-1024x791.jpg'> 
								// e = .Embed().set_image(url="https://www.ncf.edu/wp-content/uploads/2021/10/CampusMap-UpdatedOct2020-1024x791.jpg");
								// var pixels = require('image-pixels')
								// output(pixels('campusMap.jpg'), 'campusMap.jpg')
								// can't find how to upload an image to discord );
								// {
								// 	files: [
								// 		"./campusMap.png"
								// 	]
								// }
							}, 1000);
						});

						readInterface.on('close', () => {
							console.log('End of file.');
						// results2=line;
						});
					} catch (err) {
						console.error(err);
					}
				}, 7500);
				// setTimeout(() => {
				// 	message.channel.send([results2]);
				// }, 11500);
			}

			console.log('End');
		}, 4500);
		//if asking about location then find corrosponding location answer
	}
	// results = runPythonScript('./algorithms.py', [String(message.content)]).then(read_csv());
	// run script fron chatbot.js that runs the algorithms.py script
	//algorithms.py saves results to a csv file, so we must now read that file


	// if (message.content.toLowerCase().includes('how are you')) {
	// 	message.channel.send(friendlies.howYaDoing());
	// }
	// if (message.content.toLowerCase().includes('what is the name of the school')) {
	// 	message.channel.send(`this school is called the New College of Florida, but can also be refered to as NCF, or new college.`);
	// }
	// if (message.content.toLowerCase().includes('todays events')) {
	// 	var todaysEvents = parse_calendar.todaysEventsList(acaCal2023);
	// 	for(let i = 0; i<todaysEvents.length; i++){
	// 		message.channel.send(todaysEvents[i]);
	// 	}
	// }
	// if (message.content.toLowerCase().includes('weeks events')) {
	// 	var weeksEvents = parse_calendar.thisWeeksEventsList(acaCal2023);
	// 	for(let i = 0; i<weeksEvents.length; i++){
	// 		message.channel.send(weeksEvents[i]);
	// 	}
	// }
	// var message_sent = false;
	// // add time break between answering question again
	// if (message.content.toLowerCase().includes('ham') && (message.content.toLowerCase().includes('hours') || message.content.toLowerCase().includes('menu'))){
	// 	message_sent = true;
	// 	message.channel.send('The Hamilton Center hours and menu can both be found here: https://www.metznewcollege.com/cafe.html');
	// 	setTimeout(function (){console.log("waiting...")}, 5000);
	// 	message_sent = false;
	// }
}); 

//slash commands
client.on('interactionCreate', (interaction) => {
	if(!interaction.isChatInputCommand()) return;
	console.log(interaction.commandName);
	if(interaction.commandName === 'hey'){
		interaction.reply('hey!');
	}
	// if(interaction.commandName === 'today_events'){
	// 	var todaysEvents = todaysEventsList(acaCal2023);
	// 	for(let i = 0; i<todaysEvents.length; i++){
	// 		interaction.reply(todaysEvents[i])
	// 	}
	// }
	// if(interaction.commandName === 'weeks_events'){
	// 	var weeksEvents = thisWeeksEventsList(acaCal2023);
	// 	var stringy =  "";
	// 	for(let i = 0; i<weeksEvents.length; i++){
	// 		stringy+=weeksEvents[i]+"\n";
	// 	}
	// 	interaction.reply(stringy);
	// }
}); 

// console.log(process.env.TOKEN);
client.login(process.env.TOKEN);