const postArticle = require('./postArticle');
require('dotenv').config();
const { scrapeNewestPost } = require('./redditScraper');
const { isEmpty } = require('./helpers.js');
const filterArticle = require('./filterArticle.js')
const { writeGuildData } = require('./fsOperations');

async function autoPost(guildData, channelsCache) {

    for (const serverId in guildData) {

        // Channels in guilds where automatic posting is enabled
        const autoChannels = guildData[serverId].auto;

        // If not empty
        if(autoChannels) {

            scrapeNewestPost().then(news => {

                const article = filterArticle(news, guildData, serverId);
    
                if (article) {
                    
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