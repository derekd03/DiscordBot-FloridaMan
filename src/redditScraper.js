const puppeteer = require('puppeteer');

// Default scrape function
const scrapeRedditPosts = async (urlExtension = '') => {

    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {

        var url;

        // if an extension like '/new' was passed through, include it in the url
        if (urlExtension) {
            url = `https://old.reddit.com/r/FloridaMan/${urlExtension}`;
        }
        // otherwise default to the subreddit's front page
        url = `https://old.reddit.com/r/FloridaMan/`;

        // Navigate to r/FloridaMan
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract post information
        const posts = await page.evaluate(() => {

            const titles = Array.from(document.querySelectorAll('.thing'));
            return titles.map((postElement) => {
                const titleElement = postElement.querySelector('.title > a');
                const title = titleElement.textContent.trim();
                const link = titleElement.href;
                return { title, link };
            });
        });

        // Return the scraped posts
        return posts;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the browser instance
        await browser.close();
    }
};

// Function to continuously check for new posts at an interval
const checkForNewPosts = async (intervalMs) => {
    while (true) {
        const latestPost = await scrapeRedditPosts('new/');
        console.log('Latest Post:', latestPost);

        // Adjust the interval as needed (e.g., check every 5 minutes)
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
};

// Export the function for use in other files.
module.exports = scrapeRedditPosts, checkForNewPosts;