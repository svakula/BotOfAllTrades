const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XU5zeA.CHES5tmHjiOAkp9vAAPd-bexcBE';

const client = new Discord.Client();

client.on('message', (msg) => {
    if (msg.content === 'word1' || msg.content === 'word2' || msg.content === 'word3') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('ready', () => {
    console.log('Its Online now Dumbass');
    
   // client.channels.find(x => x.name === 'test').send('hello i now exist');
});

client.login(token);