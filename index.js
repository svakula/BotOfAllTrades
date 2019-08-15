const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XVDV5w.2OdpsqjkR7DYrm2GIxi2iY8fbpY';

const client = new Discord.Client();

const swords = ['fuck' , 'shit' , 'ass' , 'fucx' , 'fucxing' , 'fucking' , 'dumb' , 'study' , 'frick' , 'uck'];
const lmaos = ['lmao' , 'lmfao' , 'lnao' , 'Imao' , 'Imfao' , 'Inao'];

const cheerio = require("cheerio"); /* Used to extract html content, based on jQuery || install with npm install cheerio */
const request = require("request"); /* Used to make requests to URLs and fetch response  || install with npm install request */
//replace words with actual words that you want to send warning to
//replace warning with any warning but I think the current warning is pretty good
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

client.login(token);