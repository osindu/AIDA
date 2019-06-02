const Discord = require('discord.js');

async function onReact(packet, Client) {
    console.log(packet);
    const channel = await Client.channels.get(packet.d.channel_id);
    const reactedMessage = await channel.fetchMessage(packet.d.message_id);
    const reactedUser = await Client.fetchUser(packet.d.user_id);
    const reactedEmoji = await Client.emojis.get(packet.d.emoji.id);
    const reactedEmojiName = reactedEmoji.name;
    const warningEmoji = await Client.emojis.find(warningEmoji =>
        warningEmoji.name == "DuplicateDownload"
    );


    reactedMessage.embeds.forEach(embed => {
        const embAuthor = embed.author;
        const embAuthorName = embAuthor.name.split(" ")[0];
        const embTitle = embed.title;
        const embURL = embed.url;
        const embDesc = embed.description;

        if (embAuthor.name.includes("wants") && reactedEmojiName === "Downloading") {
            const newAuthor = reactedUser.username + " is Downloading";
            const newDesc = embDesc + "\nRequested by : " + embAuthorName;
            sendEmbedMessageReact(newAuthor, embTitle, embURL, newDesc, reactedEmoji.url, channel, 3066993);
            reactedMessage.delete(5);
        } else if (embAuthor.name.includes("wants") && reactedEmojiName === "DownloadDone") {
            const newAuthor = reactedUser.username + " has Downloaded";
            const newDesc = "Requested by : " + embAuthorName;
            sendEmbedMessageReact(newAuthor, embTitle, embURL, newDesc, reactedEmoji.url, channel, 3066993);
            reactedMessage.delete(5);
        } else if (embAuthor.name.includes("Downloading") && reactedEmojiName === "DownloadDone") {
            if (reactedUser.username == embAuthorName) {
                const newAuthor = reactedUser.username + " has Downloaded";
                const newDesc = "Requested by : " + embAuthorName;
                sendEmbedMessageReact(newAuthor, embTitle, embURL, newDesc, reactedEmoji.url, channel, 3066993);
                reactedMessage.delete(5);
            } else {
                const newAuthor = reactedUser.username + " has Downloaded";
                const newDesc = "Requested by : " + embAuthorName;
                sendEmbedMessageReact(newAuthor, embTitle, embURL, newDesc, reactedEmoji.url, channel, 3066993);
                reactedMessage.delete(5);

                //Duplicate Download Warning
                const newAuthor2 = "Duplicate Download Warning"
                const newDesc2 = "Hay @" + embAuthorName + " @" + reactedUser.username + " has Marked this File as Downloaded \n According to my Intelligence Service You are also Downloading the Same File ";
                sendEmbedMessageReact(newAuthor2, embTitle, embURL, newDesc2, warningEmoji.url, channel, 15158332);

            }
        }


    });

};


sendEmbedMessageReact = (author, title, url, desc, image, channel, color) => {

    const embMsg = new Discord.RichEmbed()
        .setAuthor(author)
        .setTitle(title)
        .setURL(url)
        .setDescription(desc)
        .setThumbnail(image)
        .setTimestamp()
        .setColor(color);

    channel.send(embMsg);
};

module.exports.onReact = onReact;