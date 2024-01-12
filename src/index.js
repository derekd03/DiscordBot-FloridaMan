const { Client, IntentsBitField } = require('discord.js');
require('discord.js');
require("dotenv").config();
const { readGuildData } = require('./fsOperations');
const command = require('./commands');

// Adds permissions for bot
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

var guildData = readGuildData();

client.on('messageCreate', async (message) => {

    command(message, guildData);
});

// Console message to signal that the bot is ready
client.on('ready', (c) => {
    console.log("Florida Man has joined the game.");
});

// Logs the bot on Discord
// Install dotenv by NPM and create a .env file to store your bot's token
// Only store your token here at your own risk!
client.login(process.env.CLIENT_AUTH);