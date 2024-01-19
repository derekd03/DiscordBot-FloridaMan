const { shuffleArray } = require('./helpers');

function filterArticle(articles, guildData, serverId, onlyAnnouncementCheck = false) {
    
    // Title of the introductory subreddit post to exclude
    const announcementTitle = '/r/FloridaMan - Tips for high quality submissions'.toLowerCase();

    // Get the articles for the current server
    const serverArticles = guildData[serverId]?.articles || [];

    // Filter out articles that have already been posted in the server
    const newArticles = articles.filter(article => {

        const title = article.title;

        // Check that the title is not the announcement title
        const notAnnouncement = title !== announcementTitle;

        if(onlyAnnouncementCheck) {
            return notAnnouncement;
        }
        
        // Check that the server articles array does not have the title indexed
        const notPostedBefore = !(serverArticles.indexOf(title) > -1);
        
        return notAnnouncement && notPostedBefore;
    });

    shuffleArray(newArticles);
    
    return newArticles.length > 0 ? newArticles[0] : null;    
}

module.exports = filterArticle;