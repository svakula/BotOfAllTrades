const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XU5zeA.CHES5tmHjiOAkp9vAAPd-bexcBE';

const client = new Discord.Client();

client.on('message', (msg) => {
    if (msg.content === 'fuck ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('message', (msg) => {
    if (msg.content === 'shit ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('message', (msg) => {
    if (msg.content === 'ass ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});
client.on('message', (msg) => {
    if (msg.content === 'nigga ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('message', (msg) => {
    if (msg.content === 'fucking ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('message', (msg) => {
    if (msg.content === 'hell ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('message', (msg) => {
    if (msg.content === 'frick ') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('ready', () => {
    console.log('bot works somehow');
});

client.login(token);