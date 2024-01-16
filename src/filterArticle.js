const { shuffleArray } = require('./helpers');

function filterArticle(articles, guildData, serverId, onlyTitle = false) {

    // Shuffle the news array randomly
    shuffleArray(articles);
    
    // Title of the introductory subreddit post to exclude
    const announcementTitle = '/r/FloridaMan - Tips for high quality submissions'.toLowerCase();

    const newArticles = articles.filter(article => {

        const title = article.title.toLowerCase();

        if(onlyTitle) {
            // Only filter out the subreddit's tips announcement
            return (guildData[serverId].articles.title != announcementTitle);
        } else {
            // Also filter out articles that have already been posted in specific guilds (servers)
            return ((!guildData[serverId].articles.includes(title) && (guildData[serverId].articles.title != announcementTitle)));
        }
    });

    return newArticles[0] || null;
}

module.exports = filterArticle;