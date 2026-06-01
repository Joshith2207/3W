const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

async function seedDatabase() {
  try {
    // Check if posts already exist
    const postCount = await Post.countDocuments();
    if (postCount > 0) {
      console.log('🌱 Database already contains data. Skipping auto-seeding.');
      return;
    }

    console.log('🌱 Database is empty. Starting smart auto-seeding...');

    // 1. Clear any existing records to avoid conflicts
    await User.deleteMany({});
    await Post.deleteMany({});

    // 2. Hash password for mock users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 3. Create mock users
    const user1 = new User({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword
    });
    const user2 = new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword
    });
    const user3 = new User({
      username: 'alex_walker',
      email: 'alex@example.com',
      password: hashedPassword
    });

    await user1.save();
    await user2.save();
    await user3.save();

    console.log('👤 Created 3 Mock Users: jane_smith, john_doe, alex_walker');

    // 4. Create mock posts
    const post1 = new Post({
      author: user1._id,
      username: user1.username,
      text: 'Beautiful sunset from my evening walk! 🌅 Fresh air and positive vibes only. #peace #nature',
      imageUrl: 'https://images.unsplash.com/photo-1472214222541-d510753a49f8?auto=format&fit=crop&w=1200&q=80',
      likes: ['john_doe', 'alex_walker'],
      comments: [
        {
          username: 'john_doe',
          text: 'Wow, that looks stunning! Where was this taken?',
          createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago
        },
        {
          username: 'alex_walker',
          text: 'Gorgeous colors! I need to go for a walk outside tomorrow.',
          createdAt: new Date(Date.now() - 3600000) // 1 hour ago
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5) // 5 hours ago
    });

    const post2 = new Post({
      author: user2._id,
      username: user2.username,
      text: 'Just finished setting up my new desk space! Super excited to start working on the TaskPlanet MERN project today. Let\'s build something epic! 💻🚀',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      likes: ['jane_smith'],
      comments: [
        {
          username: 'jane_smith',
          text: 'Clean setup, John! Good luck with the coding!',
          createdAt: new Date(Date.now() - 1800000) // 30 mins ago
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3) // 3 hours ago
    });

    const post3 = new Post({
      author: user3._id,
      username: user3.username,
      text: 'A delicious Sunday brunch! Best blueberry pancakes in town. 🥞🍓 Super fluffy and perfect start to the week.',
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago
    });

    const post4 = new Post({
      author: user2._id,
      username: user2.username,
      text: 'Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill. Keep pushing your limits, guys! 💪 #MotivationMonday',
      imageUrl: '', // Text-only post to verify responsiveness
      likes: ['alex_walker'],
      comments: [
        {
          username: 'alex_walker',
          text: 'Needed this today, John. Thanks for sharing!',
          createdAt: new Date(Date.now() - 600000) // 10 mins ago
        }
      ],
      createdAt: new Date(Date.now() - 1800000) // 30 mins ago
    });

    await post1.save();
    await post2.save();
    await post3.save();
    await post4.save();

    console.log('📝 Created 4 Beautiful Mock Posts (including likes and comments)');
    console.log('🌱 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error during auto-seeding:', err.message);
  }
}

module.exports = seedDatabase;
