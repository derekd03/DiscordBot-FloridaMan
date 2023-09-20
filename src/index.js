const {Client, IntentsBitField} = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const puppeteer = require('puppeteer');

//adds permissions for bot
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const scrapeHackerNews = async() => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
  // Navigate to Hacker News
    await page.goto('https://news.ycombinator.com/');
  // Extract news information
    const news = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.titleline > a'));
      const scores = Array.from(document.querySelectorAll('.score'));
      const links = Array.from(document.querySelectorAll('.titleline > a'));
      return titles.map((title, index) => ({
        title: title.innerText,
        score: scores[index] ? parseInt(scores[index].innerText) : 0,
        link: links[index].href,
      }));
    });
    // Close the browser instance
    await browser.close();
    // Return the scraped news
    return news;
  }

// Define an array to keep track of posted articles
const postedArticles = [];

client.on('messageCreate', async (message) => {
    // Check if the message is from a guild (server)
    if (message.guild && message.content === "/news") {
        // Fetch the member object to access their permissions
        const member = await message.guild.members.fetch(message.author.id);

        // Check if the member has the "ADMINISTRATOR" permission
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            scrapeHackerNews().then(news => {
                // Shuffle the news array randomly
                shuffleArray(news);
                
                // Filter out articles that have already been posted
                const newArticles = news.filter(item => !postedArticles.includes(item.title));
                
                // Take up to 3 new articles
                const randomNews = newArticles.slice(0, 5);
                
                // Add the titles of the new articles to the postedArticles array
                randomNews.forEach(item => {
                    postedArticles.push(item.title);
                });

                randomNews.forEach((item, index) => {
                    message.reply(`Title: ${item.title}\nLink: ${item.link}`);
                });
            });
        } else {
            // If the author doesn't have admin permissions, you can reply with a message
            message.reply("You don't have the necessary permissions to use this command.");
        }
    }
});


// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


client.login(
    "MTE1MzA3NzI0MTE3ODIyNjcyOA.GRsbFv.MMnH6YLy8mVJGn5b6lkiLAGy1YDMuY7nCpfT8g"
);
