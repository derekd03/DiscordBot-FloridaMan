const postArticle = require('./postArticle');
require('discord.js');
require("dotenv").config();
const scrapeHotPosts = require('./redditScraper');
const { channel } = require('diagnostics_channel');
const { isEmpty, shuffleArray } = require('./helpers.js');
const { writeGuildData } = require('./fsOperations');

function command(message, guildData) {

    const serverID = message.guild.id;
    // Check is guildData[serverID] is initialized
    if (!guildData[serverID]) {
        guildData[serverID] = { articles: [], auto: [] };
    }

    // Check if the message is from a guild (server)
    if (message.guild && message.content.toLowerCase() === "/floridaman") {

        message.reply('Loading...');

        scrapeHotPosts().then(news => {

            // Shuffle the news array randomly
            shuffleArray(news);

            // Title of the introductory subreddit post to exclude
            const announcementTitle = '/r/FloridaMan - Tips for high quality submissions'.toLowerCase();

            // Filter out articles that have already been posted in specific guilds (servers)
            const newArticles = news.filter(item => {

                const title = item.title.toLowerCase();

                return (
                    !guildData[serverID].articles ||
                    !guildData[serverID].articles.includes(title) && title !== announcementTitle)
            });

            if (isEmpty(newArticles)) {

                channel.send(`No new articles scraped!`);
                return;
            }

            // Take a single new article
            const randomNews = newArticles[0];

            guildData[serverID].articles.push(randomNews.title);

            postArticle(randomNews, message.channel);
        });
    }

    if (message.guild && message.content === "/floridaman auto on") {

        const channelID = message.channel.id;

        if (!guildData[serverID].auto.includes(channelID)) {

            // add the channel id to the auto array
            guildData[serverID].auto.push(channelID);
            message.reply("Automatic posting in this channel has been enabled.");
        } else {
            message.reply("Automatic posting in this channel is already enabled");
        }
    }

    if (message.guild && message.content.toLowerCase() === "/floridaman auto off") {
        
        const channelID = message.channel.id;
    
        if (guildData[serverID].auto.includes(channelID)) {

            // filter the channel id out off the auto array
            guildData[serverID].auto = guildData[serverID].auto.filter(id => id !== channelID);
            message.reply("Automatic posting in this channel has been disabled.");
        } else {
            message.reply("Automatic posting in this channel is already disabled.");
        }
    }

    // Save the updated postedArticles object to the JSON file
    writeGuildData(guildData);
}

module.exports = command;