const fs = require('fs');
require('discord.js');

// Define a dictionary to keep track of posted articles
var guildData = {};

// Load saved posted articles from a JSON file (if it exists)
try {
    const data = fs.readFileSync('guilds.json');
    guildData = JSON.parse(data);
} catch (err) {
    guildData = {};
    console.error('(Ignore if this is your first time running this script)\n'
        + 'Error reading or parsing guilds.json:', err);
}

function postArticle(article, channel) {

    const title = article.title.toLowerCase();
    const url = article.url;

    channel.send(`${title}\n${url}`);
}

// Export the function for use in other files.
module.exports = postArticle;