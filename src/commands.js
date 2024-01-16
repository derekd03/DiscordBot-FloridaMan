const postArticle = require('./postArticle');
require('discord.js');
require("dotenv").config();
const { scrapeHotPosts, scrapeHottestPost, scrapeNewPosts, scrapeNewestPost } = require('./redditScraper');
const { writeGuildData } = require('./fsOperations');
const filterArticle = require('./filterArticle.js');

function command(message, guildData) {

    const serverId = message.guild.id;
    // Check is guildData[serverId] is initialized
    if (!guildData[serverId]) {
        guildData[serverId] = { articles: [], auto: [] };
    }

    // Check if the message is from a guild (server)
    if (message.guild && message.content.toLowerCase() === "/floridaman") {

        message.reply('Loading...');

        scrapeHotPosts().then(articles => {

            // Take a single new article
            const article = filterArticle(articles, guildData, serverId);

            if (article) {
                guildData[serverId].articles.push(article.title);
                postArticle(article, message.channel);
            } else {
                message.reply("No new articles found.");
            }
        });
    }

    if (message.guild && message.content.toLowerCase() === "/floridaman new") {

        message.reply('Loading...');

        scrapeNewPosts().then(articles => {

            // Take a single new article
            const article = filterArticle(articles, guildData, serverId);

            if (article) {
                guildData[serverId].articles.push(article.title);
                postArticle(article, message.channel);
            } else {
                message.reply("No new articles found.");
            }
        });
    }

    if (message.guild && message.content.toLowerCase() === "/floridaman hottest") {

        message.reply('Loading...');

        scrapeHottestPost().then(articles => {

            // Take a single new article
            const article = filterArticle(articles, guildData, serverId, true);

            if (article) {
                guildData[serverId].articles.push(article.title);
                postArticle(article, message.channel);
            } else {
                message.reply("No new articles found.");
            }
        });
    }

    if (message.guild && message.content.toLowerCase() === "/floridaman newest") {

        message.reply('Loading...');

        scrapeNewestPost().then(articles => {

            // Take a single new article
            const article = filterArticle(articles, guildData, serverId, true);

            if (article) {
                guildData[serverId].articles.push(article.title);
                postArticle(article, message.channel);
            } else {
                message.reply("No new articles found.");
            }
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

    // To check the current status of automatic posting in a channel
    if (message.guild && message.content.toLowerCase() === "/floridaman auto") {
        
        const channelId = message.channel.id;
    
        if (guildData[serverId].auto.includes(channelId)) {
            message.reply("Automatic posting in this channel is enabled.");
        } else {
            message.reply("Automatic posting in this channel is disabled.");
        }
    }

    // Save the updated postedArticles object to the JSON file
    writeGuildData(guildData);
}

module.exports = command;