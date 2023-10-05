const scrapeRedditPosts = require('./redditScraper');
const checkForNewPosts = require('./redditScraper');
const { Client, IntentsBitField } = require('discord.js');
require('discord.js');
require("dotenv").config();

// title of introductory subreddit post to exclude
const announcementTitle = '/r/FloridaMan - Tips for high quality submissions';

//adds permissions for bot
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

// Define an array to keep track of posted articles
const postedArticles = [];

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

            // Filter out articles that have already been posted
            const newArticles = news.filter(
                item => !postedArticles.includes(item.title || announcementTitle)
            );

            // Take a single new article
            const randomNews = newArticles.slice(0, 1);

            // Add the titles of the new articles to the postedArticles array
            randomNews.forEach(item => {
                postedArticles.push(item.title);
            });

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
client.login(process.env.CLIENT_AUTH);