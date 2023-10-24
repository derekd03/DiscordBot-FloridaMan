const fs = require('fs');
const postArticle = require('./postArticle');
const { Client, IntentsBitField } = require('discord.js');
require('discord.js');
require("dotenv").config();

// Adds permissions for bot
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

// Load saved posted articles from a JSON file (if it exists)
try {
    const data = fs.readFileSync('guilds.json');
    postedArticles = JSON.parse(data);
} catch (err) {
    postedArticles = {};
    console.error('(Ignore if this is your first time running this script)\n'
        + 'Error reading or parsing guilds.json:', err);
}

client.on('messageCreate', async (message) => {

    // Check if the message is from a guild (server)
    if (message.guild && message.content === "/floridaman") {

        message.reply('Loading...');

        postArticle(message.channel);
    }
});

const CHECK_FREQUENCY_MINUTES = 5;

// Console message to signal that the bot is ready
client.on('ready', (c) => {

    console.log("Florida Man has joined the game.");
});

// Logs the bot on Discord
// Install dotenv by NPM and create a .env file to store your bot's token
// Only store your token here at your own risk!
client.login(process.env.CLIENT_AUTH);