const scrapeRedditPosts = require('./redditScraper');
const checkForNewPosts = require('./redditScraper');
const { Client, IntentsBitField } = require('discord.js');
require('discord.js');
require("dotenv").config();
const fs = require('fs');

// Adds permissions for bot
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

// Define a dictionary to keep track of posted articles
var postedArticles = {};

// Load saved posted articles from a JSON file (if it exists)
try {
    const data = fs.readFileSync('posted_articles.json');
    postedArticles = JSON.parse(data);
} catch (err) {
    postedArticles = {};
    console.error('(Ignore if this is your first time running this script)\n'
        + 'Error reading or parsing posted_articles.json:', err);
}

/*
// Specify the interval in milliseconds (e.g., 5 minutes)
const intervalMs = 5 * 60 * 1000; // 5 minutes
*/

client.on('messageCreate', async (message) => {

    // Check if the message is from a guild (server)
    if (message.guild && message.content === "/floridaman") {

        message.reply('Loading...');
        // Fetch the member object to access their permissions

        scrapeRedditPosts().then(news => {
            // Shuffle the news array randomly
            shuffleArray(news);

            // Title of the introductory subreddit post to exclude
            const announcementTitle = '/r/FloridaMan - Tips for high quality submissions';

            // Filter out articles that have already been posted in specific guilds (servers)
            const newArticles = news.filter(item => {

                const title = item.title.toLowerCase();

                return !postedArticles[message.guild.id] ||
                    !postedArticles[message.guild.id].includes(title) &&
                    title !== announcementTitle.toLowerCase();
            });

            // Take a single new article
            const randomNews = newArticles.slice(0, 1);

            // Add the titles of the new articles to the postedArticles array
            randomNews.forEach(item => {

                const title = item.title.toLowerCase();

                // If this is the first time an article is being posted to a particular server
                if (!postedArticles[message.guild.id]) {
                    // Create the array of titles for the server
                    postedArticles[message.guild.id] = [title];
                } else {
                    // If not, push to the existing array for that server
                    postedArticles[message.guild.id].push(title);
                }
            });

            // Save the updated postedArticles object to the JSON file
            fs.writeFileSync('posted_articles.json', JSON.stringify(postedArticles, null, 4));

            randomNews.forEach((item, index) => {
                message.reply(`${item.title}\n${item.link}`);
            });
        });
    }
});

// Function to shuffle an array randomly
function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/*
// Start checking for new posts
checkForNewPosts(intervalMs);
*/

// Console message to signal that the bot is ready
client.on('ready', (c) => {
    console.log("Florida Man has joined the game.");
});

// Logs the bot on Discord
// Install dotenv by NPM and create a .env file to store your bot's token
// Only store your token here at your own risk!
client.login(process.env.CLIENT_AUTH);