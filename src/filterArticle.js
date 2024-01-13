const { shuffleArray } = require('./helpers');

function filterArticle(articles, guildData, serverId) {

    // Shuffle the news array randomly
    shuffleArray(articles);
    
    // Title of the introductory subreddit post to exclude
    const announcementTitle = '/r/FloridaMan - Tips for high quality submissions'.toLowerCase();

    // Filter out articles that have already been posted in specific guilds (servers)
    const newArticles = articles.filter(item => {

        const title = item.title.toLowerCase();

        return (
            !guildData[serverId].articles ||
            !guildData[serverId].articles.includes(title) && title !== announcementTitle)
    });

    return newArticles[0];
}

module.exports = filterArticle;