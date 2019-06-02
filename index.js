const Discord = require('discord.js');
const express = require('express');

const messageHandler = require('./modules/message');
const reactionHandler = require('./modules/reaction');

const {key, downloadChannelID} = require('./keys');
const Client = new Discord.Client();

const app = express();
const PORT = process.env.PORT;

global.context = {Client: Client, Discord: Discord};

Client.on('ready', () => {
    Client.guilds.forEach(guild => {
        guild.channels.forEach(channel => {
            console.log(channel.name + "-----" + channel.id);
        });
    });
}).on('error', e => {
    console.log(e);
});

Client.on('message', message => {
    if (message.content.startsWith("!")) {
        messageHandler.onMessage(message, Client);
    }
});

Client.on('raw', packet => {
    const eventType = packet.t;

    if (eventType === "MESSAGE_REACTION_ADD") {
        let channelID = packet.d.channel_id;
        if (channelID == downloadChannelID) {
            reactionHandler.onReact(packet, Client);
        }
    }

});

app.listen(PORT || 3000);
Client.login(key);


