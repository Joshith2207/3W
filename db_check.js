const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');

async function checkDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI is missing in .env!');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();

    console.log(`\n--- Database Status ---`);
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Posts: ${postCount}`);

    if (postCount > 0) {
      const posts = await Post.find().limit(5);
      console.log(`\n--- First ${posts.length} Posts ---`);
      posts.forEach((post, i) => {
        console.log(`[Post ${i + 1}]`);
        console.log(`- ID: ${post._id}`);
        console.log(`- Author: ${post.username} (${post.author})`);
        console.log(`- Text: "${post.text || '(empty)'}"`);
        console.log(`- Image URL: "${post.imageUrl || '(empty)'}"`);
        console.log(`- Likes Count: ${post.likes ? post.likes.length : 0}`);
        console.log(`- Comments Count: ${post.comments ? post.comments.length : 0}`);
        console.log(`---------------------`);
      });
    } else {
      console.log('\n❌ No posts found in the database!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Database Diagnostic Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();
