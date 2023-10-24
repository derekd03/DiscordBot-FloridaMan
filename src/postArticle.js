const scrapeRedditPosts = require('./redditScraper');
const fs = require('fs');
require('discord.js');

// isEmpty helper function
function isEmpty(obj) {

    for (var i in obj) { return false; }
    return true;
}

// Define a dictionary to keep track of posted articles
var postedArticles = {};

// Load saved posted articles from a JSON file (if it exists)
try {
    const data = fs.readFileSync('guilds.json');
    postedArticles = JSON.parse(data);
} catch (err) {
    postedArticles = {};
    console.error('(Ignore if this is your first time running this script)\n'
        + 'Error reading or parsing guilds.json:', err);
}

function postArticle(channel) {

    scrapeRedditPosts().then(news => {

        // Shuffle the news array randomly
        shuffleArray(news);

        const serverID = channel.guild.id;

        // Title of the introductory subreddit post to exclude
        const announcementTitle = '/r/FloridaMan - Tips for high quality submissions'.toLowerCase();

        // Filter out articles that have already been posted in specific guilds (servers)
        const newArticles = news.filter(item => {

            const title = item.title.toLowerCase();

            return (!postedArticles[serverID] ||
                !postedArticles[serverID].includes(title) && title !== announcementTitle)
        });

        if (isEmpty(newArticles)) {

            channel.send(`No new articles scraped!`);
            return;
        }

        // Take a single new article
        const randomNews = newArticles[0];

        const title = randomNews.title.toLowerCase();

        // If this is the first time an article is being posted to a particular server
        if (!postedArticles[serverID]) {
            // Create the array of titles for the server
            postedArticles[serverID] = [title];
        } else {
            // If not, push to the existing array for that server
            postedArticles[serverID].push(title);
        }

        // Save the updated postedArticles object to the JSON file
        fs.writeFileSync('guilds.json', JSON.stringify(postedArticles, null, 4));

        channel.send(`${randomNews.title}\n${randomNews.url}`);
    });
}

// Function to shuffle an array randomly
function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Export the function for use in other files.
module.exports = postArticle;