const postArticle = require('./postArticle');
require('dotenv').config();
const { scrapeHotPosts } = require('./redditScraper');
const { isEmpty } = require('./helpers.js');
const filterArticle = require('./filterArticle.js')
const { writeGuildData } = require('./fsOperations');

async function autoPost(guildData, channelsCache) {

    for (const serverId in guildData) {

        const autoChannels = guildData[serverId].auto;

        if(autoChannels) {

            scrapeHotPosts().then(news => {

                const article = filterArticle(news, guildData, serverId);
    
                if (isEmpty(article)) {
    
                    channel.send(`No new article scraped!`);
                    return;
                }
    
                if (!isEmpty(article)) {
                    
                    guildData[serverId].articles.push(article.title);
    
                    // Post the new article to each auto-enabled channel
                    for (const channelId of autoChannels) {
                        const channel = channelsCache.get(channelId);
                        if (channel) {
                            postArticle(article, channel);
                        }
                    }
                }
            });
        }
    }
    writeGuildData(guildData);
}

module.exports = autoPost;