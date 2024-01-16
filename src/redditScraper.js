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

function scrapeHotPosts() {

    const posts = reddit.getSubreddit(subreddit).getHot({ limit: 25 });
    return posts;
}

function scrapeHottestPost() {

    const posts = reddit.getSubreddit(subreddit).getHot({ limit: 1 });
    return posts;
}

function scrapeNewPosts() {

    const posts = reddit.getSubreddit(subreddit).getNew({ limit: 25 });
    return posts;
}

function scrapeNewestPost() {

    const post = reddit.getSubreddit(subreddit).getNew({ limit: 1 });
    return post;
}

module.exports = { scrapeHotPosts, scrapeHottestPost, scrapeNewPosts, scrapeNewestPost };