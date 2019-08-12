const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XVDV5w.2OdpsqjkR7DYrm2GIxi2iY8fbpY';

const client = new Discord.Client();

const words = ['word1' , 'word2' , 'word3'];
//replace words with actual words that you want to send warning to
//replace warning with any warning but I think the current warning is pretty good
client.on('message', (msg) => {
    //if (msg.content === 'word1' || msg.content === 'word2' || msg.content === 'word3') {
    console.log(' Am I here ? '+words[0]);
    for (i=0; i<words.length; i++) {
    if (msg.content.indexOf(words[i]) > -1) {
        msg.channel.send(`Statement* ${msg.author}`);
    }
    }
});

client.on('message', (msg) => {
    if (msg.content === 'Word4' || msg.content === 'Word5' || msg.content === 'Word6' || msg.content === 'Word7' || msg.content === 'Word8') {
        msg.channel.send(`Statement** ${msg.author}`);
    }
});

client.on('ready', () => {
    console.log('Bot Is Officially Online');
});

client.login(token);