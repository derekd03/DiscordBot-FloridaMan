const postArticle = require('./postArticle');
const discord = require('discord.js');
require('dotenv').config();
const scrapeHotPosts = require('./redditScraper');
const { isEmpty, getNewArticles } = require('./helpers.js');
const { writeGuildData } = require('./fsOperations');

async function autoPost(guildData, channelsCache) {

    for (const serverId in guildData) {

        const autoChannels = guildData[serverId].auto;

        if(autoChannels) {

            scrapeHotPosts().then(news => {

                const newArticles = getNewArticles(news, guildData, serverId);
    
                if (isEmpty(newArticles)) {
    
                    channel.send(`No new articles scraped!`);
                    return;
                }
    
                if (!isEmpty(newArticles)) {
                    const randomNews = newArticles[0];
                    guildData[serverId].articles.push(randomNews.title);
    
                    // Post the new article to each auto-enabled channel
                    for (const channelId of autoChannels) {
                        const channel = channelsCache.get(channelId);
                        if (channel) {
                            postArticle(randomNews, channel);
                        }
                    }
                }
            });
        }
    }
    writeGuildData(guildData);
}

module.exports = autoPost;