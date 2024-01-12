const fs = require('fs');

function readGuildData() {

    // Load saved posted articles from a JSON file (if it exists)
    try {
        const data = fs.readFileSync('guilds.json');
        guildData = JSON.parse(data);
    } catch (err) {
        guildData = {};
        console.error('(Ignore if this is your first time running this script)\n'
            + 'Error reading or parsing guilds.json:', err);
    }
    return guildData;
}

function writeGuildData(guildData) {
    try {
        fs.writeFileSync('guilds.json', JSON.stringify(guildData, null, 4));
    } catch (err) {
        console.error('Error writing guild data to guilds.json:', err);
    }
}

module.exports = { readGuildData, writeGuildData };