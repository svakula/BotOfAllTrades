const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XU-m2g.NqQm794kHqAmTX44mHrkUyAMDnY';

const client = new Discord.Client();
//replace words with actual words that you want to send warning to
//replace warning with any warning but I think the current warning is pretty good
client.on('message', (msg) => {
    if (msg.content === 'word1' || msg.content === 'word2' || msg.content === 'word3') {
        msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
    }
});

client.on('message', (msg) => {
    if (msg.content === 'lmao' || msg.content === 'lmfao' || msg.content === 'lnao' || msg.content === 'Inao' || msg.content === 'Imao') {
        msg.channel.send(`Take Yo DUMB Ass Back ${msg.author}`);
    }
});

client.on('ready', () => {
    console.log('Bot Is Officially Online');
});

client.login(token);