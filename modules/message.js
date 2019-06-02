const Discord = require("discord.js");
const request = require('request');
const {downloadChannelID} = require('../keys');

const commandPattern = `!download+(ing|Req|req) .*?%.*?%.*?%https?:\\/\\/((www\\..*?\\..*?\\/)|([0-9]*.[0-9]*.[0-9]*.[0-9]*\\/))?.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)`;

let Client;

onMessage = (message,ClientIn) => {
    Client = ClientIn;
    const author = message.author;
    if (message.content.toString().match(commandPattern)) {
        if (message.content.startsWith("!downloadreq")) {
            let content = message.content.toString().split("!downloadreq");
            sendEmbedMessage(message, content, author, true);
        } else if (message.content.startsWith("!downloadReq")) {
            let content = message.content.toString().split("!downloadReq");
            sendEmbedMessage(message, content, author, true);
        } else {
            let content = message.content.toString().split("!downloading");
            sendEmbedMessage(message, content, author, false);
        }
    } else {
        sendErrorMessage(message);
    }
};


sendEmbedMessage = (message, messageString, author, isRequest) => {
    const content = messageString.toString().split("%");
    const file = content[1];
    const size = content[2];
    const link = content[3];

    getFavicon(link).then((faviconLink) => {

        const iconLink = faviconLink.split("%%&%%")[1];
        const iconDomain = faviconLink.split("%%&%%")[0];
        const embMsg = new Discord.RichEmbed()
            .setTitle(file)
            .setURL(link)
            .setDescription("Download Size " + size)


        if (isRequest) {
            const emoji = message.guild.emojis.find(
                emoji => emoji.name === "DownloadRequest"
            );
            embMsg.setAuthor(author.username + " wants someone to Download");
            embMsg.setColor(15844367);
            embMsg.setThumbnail(emoji.url);

        } else {
            const emoji = message.guild.emojis.find(
                emoji => emoji.name === "Downloading"
            );
            embMsg.setAuthor(author.username + " is Downloading");
            embMsg.setColor(3066993);
            embMsg.setThumbnail(emoji.url);
        }

        const downloadChannel = Client.channels.get(downloadChannelID);

        downloadChannel.send(embMsg);
        message.delete();
    });


}

sendErrorMessage = (message) => {
    if (message.content.startsWith("!downloading")) {
        const channel = message.channel;
        const errorMessage = new Discord.RichEmbed()
            .setDescription("\`\`\`" + message.content + "\`\`\`" + "\noops! WRONG Syntax !!")
            .setColor(10038562);

        channel.send(errorMessage);
        message.delete();
    } else {
        const channel = message.channel;
        const errorMessage = new Discord.RichEmbed()
            .setAuthor("Hay " + message.author.username)
            .setDescription("\`\`\`" + message.content + "\`\`\`" + "\nWhat the fuck is that even suppose to mean ?")
            .setColor(10038562);

        channel.send(errorMessage);
        message.delete();
    }
};

getFavicon = (url) => {
    return new Promise((iconLink) => {
        const regexFilter = /(https?:\/\/.*?\/)/g;
        const match = regexFilter.exec(url);
        const domain = match[0];
        const link = domain + "favicon.ico"

        request(link, {}, (error, response, body) => {
            iconLink((match + "%%&%%" + response.request.uri.href));
        });
    });
};

module.exports.onMessage = onMessage;
