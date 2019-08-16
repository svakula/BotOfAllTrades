const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XVXepg.hQvfW6GEcMujSAw7Ysc0e0C23eo';

const client = new Discord.Client();

const botSettings = require("./config.json");
const axios = require("axios");
const yt = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const fs = require("fs");
const getYTID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const prefix = botSettings.prefix;
const ytApiKey = botSettings.ytApiKey;
const youtube = new YouTube(ytApiKey);

const bot = new Discord.Client({
	disableEveryone: true
});

const swords = ['fuck' , 'shit' , 'ass' , 'fucx' , 'fucxing' , 'fucking' , 'dumb' , 'study' , 'frick' , 'uck', 'nigg', 'cunt', 'bitch'];
const lmaos = ['lmao' , 'lmfao' , 'lnao' , 'Imao' , 'Imfao' , 'Inao'];

const cheerio = require("cheerio");
const request = require("request");

client.on('message', msg => {
  if (msg.content === '!help') {
    msg.reply('Welcome to SpigsBot - a Bot created by Shrijith Vakula.    Useful Commands for Images: to start an image search, type: !<your search query here>');
  }
});

client.on('message', (msg) => {
    for (i=0; i<swords.length; i++) {
        if (msg.content.indexOf(swords[i]) > -1) {
            msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
            break;
        }
    }
});

client.on('message', (msg) => {
    for (i=0; i<lmaos.length; i++) {
        if (msg.content.indexOf(lmaos[i]) > -1) {
            msg.channel.send(`Take Yo DUMB Ass Back ${msg.author}`);
            break;
        }
    }
});

client.on("message", function(message) {

	var parts = message.content.split(" "); // Splits message into an array for every space, our layout: "<command> [search query]" will become ["<command>", "search query"]

	/* Simple command manager */
	if (parts[0] === "!image") { // Check if first part of message is image command

		// call the image function
		image(message, parts); // Pass requester message to image function

	}

});

function image(message, parts) {

	/* extract search query from message */

	var search = parts.slice(1).join(" "); // Slices of the command part of the array ["!image", "cute", "dog"] ---> ["cute", "dog"] ---> "cute dog"

	var options = {
	    url: "http://results.dogpile.com/serp?qc=images&q=" + search,
	    method: "GET",
	    headers: {
	        "Accept": "text/html",
	        "User-Agent": "Chrome"
	    }
	};
	request(options, function(error, response, responseBody) {
		if (error) {
			// handle error
			return;
		}

		/* Extract image URLs from responseBody using cheerio */

		$ = cheerio.load(responseBody); // load responseBody into cheerio (jQuery)

		// In this search engine they use ".image a.link" as their css selector for image links
		var links = $(".image a.link");

		// We want to fetch the URLs not the DOM nodes, we do this with jQuery's .attr() function
		// this line might be hard to understand but it goes thru all the links (DOM) and stores each url in an array called urls
		var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
		console.log(urls);
		if (!urls.length) {
			// Handle no results
			return;
		}

		// Send result
		message.channel.send( urls[0] );
	});

}

client.on('ready', () => {
    console.log('Shard Running');
});

let commandsList = fs.readFileSync('commands.md', 'utf8');

/* MUSIC VARIABLES */
let queue = []; // Songs queue
let songsQueue = []; // Song names stored for queue command
let isPlaying = false; // Is music playing
let dispatcher = null;
let voiceChannel = null;
let skipRequest = 0; // Stores the number of skip requests 
let skippers = []; // Usernames of people who voted to skip the song
let ytResultList = []; // Video names results from yt command
let ytResultAdd = []; // For storing !add command choice
/* MUSIC VARIABLES END */
let re = /^(?:[1-5]|0[1-5]|10)$/; // RegEx for allowing only 1-5 while selecting song from yt results
let regVol = /^(?:([1][0-9][0-9])|200|([1-9][0-9])|([0-9]))$/; // RegEx for volume control
let youtubeSearched = false; // If youtube has been searched (for !add command)
let selectUser; // Selecting user from sssss

bot.on("ready", async () => {
	console.log(`Bot is ready! ${bot.user.username}`);

	/*try {
		let link = await bot.generateInvite(["ADMINISTRATOR"]);
		console.log(link);
	} catch (e) {
		console.log(e.stack);
	}*/

});

bot.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	let messageContent = message.content.split(" ");
	let command = messageContent[0];
	let args = messageContent.slice(1);

	if (!command.startsWith(prefix)) return;

	switch (command.slice(1).toLowerCase()) {
		case "userinfo":
			if (args.length == 0) { // Displays the message author info if args are empty
				let embed = new Discord.RichEmbed()
					.setThumbnail(message.author.avatarURL)
					.setColor("#8A2BE2")
					.setDescription(`User info for: **${message.author.username}**`)
					.addField("Avatar:", `[Link](${message.author.avatarURL})`, true)
					.addField("Status:", message.author.presence.status, true)
					.addField("Bot: ", message.author.bot, true)
					.addField("In game: ", message.author.presence.game ? message.author.presence.game : "Not in game", true)
					.addField("Tag: ", message.author.tag, true)
					.addField("Discriminator:", message.author.discriminator, true)
					.addBlankField()
					.setFooter(`Profile created at: ${message.author.createdAt}`);

				message.channel.send(embed);
			} else { // Else displays info of user from args
				if (message.guild.available) {
					let selectUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
					let embed = new Discord.RichEmbed()
						.setThumbnail(selectUser.user.displayAvatarURL)
						.setColor("#8A2BE2")
						.setDescription(`User info for: **${selectUser.user.username}**`)
						.addField("Avatar:", `[Link](${selectUser.user.displayAvatarURL})`, true)
						.addField("Status:", selectUser.user.presence.status, true)
						.addField("Bot: ", selectUser.user.bot, true)
						.addField("In game: ", selectUser.user.presence.game ? selectUser.user.presence.game : "Not in game", true)
						.addField("Tag: ", selectUser.user.tag, true)
						.addField("Discriminator:", selectUser.user.discriminator, true)
						.addBlankField()
						.setFooter(`Profile created at: ${selectUser.user.createdAt}`);

					message.channel.send(embed);
				}
			}
			break;

		case "play":
			if (args.length == 0 && queue.length > 0) {
				if (!message.member.voiceChannel) {
					message.reply("you need to be in a voice channel to play music. Please, join one and try again.");
				} else {
					isPlaying = true;
					playMusic(queue[0], message);
					message.reply(`now playing **${songsQueue[0]}**`);
				}
			} else if (args.length == 0 && queue.length == 0) {
				message.reply("queue is empty now, type !play [song name] or !yt [song name] to play/search new songs!");
			} else if (queue.length > 0 || isPlaying) {
				getID(args).then(id => {
					if (id) {
						queue.push(id);
						getYouTubeResultsId(args, 1).then(ytResults => {
							message.reply(`added to queue **${ytResults[0]}**`);
							songsQueue.push(ytResults[0]);
						}).catch(error => console.log(error));
					} else {
						message.reply("sorry, couldn't find the song.");
					}
				}).catch(error => console.log(error));
			} else {
				isPlaying = true;
				getID(args).then(id => {
					if (id) {
						queue.push(id);
						playMusic(id, message);
						getYouTubeResultsId(args, 1).then(ytResults => {
							message.reply(`now playing **${ytResults[0]}**`);
							songsQueue.push(ytResults[0]);
						}).catch(error => console.log(error));
					} else {
						message.reply("sorry, couldn't find the song.");
					}
				}).catch(error => console.log(error));
			}
			break;

		case "skip":
			console.log(queue);
			if (queue.length === 1) {
				message.reply("queue is empty now, type !play [song name] or !yt [song name] to play/search new songs!");
				dispatcher.end();
    
				setTimeout(() => message.member.voiceChannel.leave(), 1000);
			} else {
				if (skippers.indexOf(message.author.id) === -1) {
					skippers.push(message.author.id);
					skipRequest++;

					if (skipRequest >= Math.ceil((message.member.voiceChannel.members.size - 1) / 2)) {
						skipSong(message);
						message.reply("your skip has been added to the list. Skipping!");
					} else {
						message.reply(`your skip has been added to the list. You need **${Math.ceil((message.member.voiceChannel.members.size - 1) / 2) - skipRequest}** more to skip current song!`);
					}
				} else {
					message.reply("you already voted to skip!");
				}
			}
			break;

		case "queue":
			if (queue.length === 0) { // if there are no songs in the queue, send message that queue is empty
				message.reply("queue is empty, type !play or !yt to play/search new songs!");
			} else if (args.length > 0 && args[0] == 'remove') { // if arguments are provided and first one is remove
				if (args.length == 2 && args[1] <= queue.length) { // check if there are no more than 2 arguments and that second one is in range of songs number in queue
					// then remove selected song from the queue
					message.reply(`**${songsQueue[args[1] - 1]}** has been removed from the queue. Type !queue to see the current queue.`);
					queue.splice(args[1] - 1, 1);
					songsQueue.splice(args[1] - 1, 1);
				} else { // if there are more than 2 arguments and the second one is not in the range of songs number in queue, send message
					message.reply(`you need to enter valid queued song number (1-${queue.length}).`);
				}
			} else if (args.length > 0 && args[0] == 'clear') { // same as remove, only clears queue if clear is first argument
				if (args.length == 1) {
					// reseting queue and songsQueue, but leaving current song
					message.reply("all upcoming songs have been removed from the queue. type !play or !yt to play/search new songs!");
					queue.splice(1);
					songsQueue.splice(1);
				} else {
					message.reply("you need to type !queue clear without following arguments.");
				}
			} else if (args.length > 0 && args[0] == 'shuffle') {
				let tempA = [songsQueue[0]];
				let tempB = songsQueue.slice(1);
				songsQueue = tempA.concat(shuffle(tempB));
				message.channel.send("Queue has been shuffled. Type !queue to see the new queue!");
			} else { // if there are songs in the queue and queue commands is without arguments display current queue
				let format = "```"
				for (const songName in songsQueue) {
					if (songsQueue.hasOwnProperty(songName)) {
						let temp = `${parseInt(songName) + 1}: ${songsQueue[songName]} ${songName == 0 ? "**(Current Song)**" : ""}\n`;
						if ((format + temp).length <= 2000 - 3) {
							format += temp;
						} else {
							format += "```";
							message.channel.send(format);
							format = "```";
						}
					}
				}
				format += "```";
				message.channel.send(format);
			}
			break;

		case "repeat":
			if (isPlaying) {
				queue.splice(1, 0, queue[0]);
				songsQueue.splice(1, 0, songsQueue[0]);
				message.reply(`**${songsQueue[0]}** will be played again.`);
			}
			break;

		case "stop":
			dispatcher.end();
			setTimeout(() => message.member.voiceChannel.leave(), 1000);
			break;

		case "yt":
			if (args.length == 0) {
				message.reply("you need to enter search term (!yt [search term]).");
			} else {
				message.channel.send("```Searching youtube...```");
				getYouTubeResultsId(args, 5).then(ytResults => {
					ytResultAdd = ytResults;
					let ytEmbed = new Discord.RichEmbed()
						.setColor("#FF0000")
						.setAuthor("Youtube search results: ", icon_url = "https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png")
						.addField("1:", "```" + ytResults[0] + "```")
						.addField("2:", "```" + ytResults[1] + "```")
						.addField("3:", "```" + ytResults[2] + "```")
						.addField("4:", "```" + ytResults[3] + "```")
						.addField("5:", "```" + ytResults[4] + "```")
						.addBlankField()
						.setFooter("Send !add [result number] to queue the song.");
					message.channel.send(ytEmbed);
					youtubeSearched = true;
				}).catch(err => console.log(err));
			}
			break;

		case "add":
			if (youtubeSearched === true) {
				if (!re.test(args)) {
					message.reply("you entered the wrong song number or character. Please only enter 1-5 for song number to be queued.");
				} else {
					let choice = ytResultAdd[args - 1];
					getID(choice).then(id => {
						if (id) {
							queue.push(id);
							getYouTubeResultsId(choice, 1).then(ytResults => {
								message.reply(`added to queue **${ytResults[0]}**`);
								songsQueue.push(ytResults[0]);
							}).catch(error => console.log(error));
						}
					}).catch(error => console.log(error));
					youtubeSearched = false;
				}
			} else {
				message.reply("you need to use !yt [search term] command first to add song from the list to the queue.");
			}
			break;

		case "vol":
			if (args.length == 0 && dispatcher) {
				message.reply(`current volume is ${dispatcher.volume}. Type !vol [percentage - 0 to 200] to set music volume.`);
			} else if (args.length > 0 && regVol.test(args) == true && dispatcher) {
				dispatcher.setVolume(args * 0.01);
				message.reply(`music volume has been set to ${args}%.`);
				console.log(dispatcher.volume);
			} else if (!regVol.test(args) && dispatcher) {
				message.reply("you need to enter a number in 0-200 range.");
			} else {
				message.reply("you can only set music volume if music is playing.");
			}
			break;

		case "help":
			message.channel.send("```cs\n" + commandsList + "\n```");
			break;

		case "commands":
			message.channel.send("```cs\n" + commandsList + "\n```");
			break;


	}
});

/*--------------------------------*/
/* MUSIC CONTROL FUNCTIONS START */
/*------------------------------*/
function playMusic(id, message) {
    
	message.member.voiceChannel.join()
		.then(connection => {
			console.log("Connected...");
			stream = yt(`https://www.youtube.com/watch?v=${id}`, {
				filter: 'audioonly'
			})

			skipRequest = 0;
			skippers = [];

			dispatcher = connection.playStream(stream);
			dispatcher.setVolume(0.25);
			dispatcher.on('end', () => {
				skipRequest = 0;
				skippers = [];
				queue.shift();
				songsQueue.shift();
				if (queue.length === 0) {
					console.log("Disconnected...");
					queue = [];
					songsQueue = [];
					isPlaying = false;
				} else {
					setTimeout(() => playMusic(queue[0], message), 500);
				}
			});
		})
		.catch(error => console.log(error));
}

async function getID(str) {
	if (str.indexOf("youtube.com") > -1) {
		return getYTID(str);
	} else {
		let body = await axios(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(str)}&key=${ytApiKey}`);
		if (body.data.items[0] === undefined) {
			return null;
		} else {
			return body.data.items[0].id.videoId;
		}
	}
}

function addToQueue(strID) {
	if (strID.indexOf("youtube.com")) {
		queue.push(getYTID(strID));
	} else {
		queue.push(strID);
		songsQueue.push(strID);
	}
}

function skipSong(message) {
	dispatcher.end();
}
/*------------------------------*/
/* MUSIC CONTROL FUNCTIONS END */
/*----------------------------*/

/*----------------------------------*/
/* YOUTUBE CONTROL FUNCTIONS START */
/*--------------------------------*/
async function searchYouTube(str) {
	let search = await axios(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(str)}&key=${ytApiKey}`);
	if (search.data.items[0] === undefined) {
		return null;
	} else {
		return search.data.items;
	}
}

async function getYouTubeResultsId(ytResult, numOfResults) {
	let resultsID = [];
	await youtube.searchVideos(ytResult, numOfResults)
		.then(results => {
			for (const resultId of results) {
				resultsID.push(resultId.title);
			}
		})
		.catch(err => console.log(err));
	return resultsID;
}
/*--------------------------------*/
/* YOUTUBE CONTROL FUNCTIONS END */
/*------------------------------*/

/*-----------------------*/
/* MISC FUNCTIONS START */
/*---------------------*/
function shuffle(queue) {
	for (let i = queue.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[queue[i], queue[j]] = [queue[j], queue[i]];
	}
	return queue;
}
/*---------------------*/
/* MISC FUNCTIONS END */
/*-------------------*/

bot.login(botSettings.token);


client.login(token);