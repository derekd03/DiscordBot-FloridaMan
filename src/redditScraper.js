const snoowrap = require('snoowrap');
require("dotenv").config();

const reddit = new snoowrap({
    userAgent: 'Sample Text',
    clientId: process.env.CLIENT_ID, // YOUR CLIENT ID
    clientSecret: process.env.CLIENT_SECRET, // YOUR CLIENT SECRET
    username: process.env.CLIENT_USERNAME, // YOUR CLIENT USERNAME
    password: process.env.CLIENT_PASSWORD, // YOUR CLIENT PASSWORD
});

const subreddit = 'FloridaMan';

function scrapeRedditPosts() {

    // Fetch a list of posts from the specified subreddit
    const posts = reddit.getSubreddit(subreddit).getHot({ limit: 100 });
    // Return the scraped posts
    return posts;
}

module.exports = scrapeRedditPosts;