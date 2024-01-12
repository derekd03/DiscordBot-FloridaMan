const postArticle = require('./postArticle');
require('discord.js');
require("dotenv").config();
const scrapeHotPosts = require('./redditScraper');
const { channel } = require('diagnostics_channel');
const { getNewArticles } = require('./helpers.js');
const { writeGuildData } = require('./fsOperations');

function command(message, guildData) {

    const serverId = message.guild.id;
    // Check is guildData[serverId] is initialized
    if (!guildData[serverId]) {
        guildData[serverId] = { articles: [], auto: [] };
    }

    // Check if the message is from a guild (server)
    if (message.guild && message.content.toLowerCase() === "/floridaman") {

        message.reply('Loading...');

        scrapeHotPosts().then(news => {

            const newArticles = getNewArticles(news, guildData, serverId);

            // Take a single new article
            const randomNews = newArticles[0];

            guildData[serverId].articles.push(randomNews.title);

            postArticle(randomNews, message.channel);
        });
    }

    if (message.guild && message.content === "/floridaman auto on") {

        const channelId = message.channel.id;

        if (!guildData[serverId].auto.includes(channelId)) {

            // add the channel id to the auto array
            guildData[serverId].auto.push(channelId);
            message.reply("Automatic posting in this channel has been enabled.");
        } else {
            message.reply("Automatic posting in this channel is already enabled");
        }
    }

    if (message.guild && message.content.toLowerCase() === "/floridaman auto off") {
        
        const channelId = message.channel.id;
    
        if (guildData[serverId].auto.includes(channelId)) {

            // filter the channel id out off the auto array
            guildData[serverId].auto = guildData[serverId].auto.filter(id => id !== channelId);
            message.reply("Automatic posting in this channel has been disabled.");
        } else {
            message.reply("Automatic posting in this channel is already disabled.");
        }
    }

    // Save the updated postedArticles object to the JSON file
    writeGuildData(guildData);
}

module.exports = command;