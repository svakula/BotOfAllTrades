const Discord = require('discord.js');
const token = 'NjA5NjE0Nzc1OTMyMDI2OTAy.XVDV5w.2OdpsqjkR7DYrm2GIxi2iY8fbpY';

const client = new Discord.Client();

const swords = ['word1' , 'word2' , 'word3'];
const lmaos = ['lmao' , 'lmfao' , 'lnao' , 'Imao' , 'Imfao' , 'Inao'];
//replace words with actual words that you want to send warning to
//replace warning with any warning but I think the current warning is pretty good
client.on('message', (msg) => {
    console.log(' Am I here ? '+swords[0]);
    for (i=0; i<swords.length; i++) {
        if (msg.content.indexOf(swords[i]) > -1) {
            msg.channel.send(`Not On My Christian Discord Server ${msg.author}`);
            break;
        }
    }
});

client.on('message', (msg) => {
    console.log(' Am I here ? '+lmaos[0]);
    for (i=0; i<lmaos.length; i++) {
        if (msg.content.indexOf(lmaos[i]) > -1) {
            msg.channel.send(`Take Yo DUMB Ass Back ${msg.author}`);
            break;
        }
    }
});

client.on('ready', () => {
    console.log('Bot Is Officially Online');
});

client.login(token);