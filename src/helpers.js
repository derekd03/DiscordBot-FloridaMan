const isEmpty = () => {
    return Object.keys(this) != 0
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getNewArticles(news, guildData, serverId) {

    // Shuffle the news array randomly
    shuffleArray(news);
    
    // Title of the introductory subreddit post to exclude
    const announcementTitle = '/r/FloridaMan - Tips for high quality submissions'.toLowerCase();

    // Filter out articles that have already been posted in specific guilds (servers)
    const newArticles = news.filter(item => {

        const title = item.title.toLowerCase();

        return (
            !guildData[serverId].articles ||
            !guildData[serverId].articles.includes(title) && title !== announcementTitle)
    });

    return newArticles;
}

module.exports = { isEmpty, shuffleArray, getNewArticles };