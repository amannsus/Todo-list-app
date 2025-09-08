const { mongoose, connectDB } = require('../backend/config/database');

// Define the Task model (should match the one in your application)
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

// Connect to MongoDB
connectDB();

// Sample data
const sampleTasks = [
  {
    title: 'Learn Node.js',
    description: 'Complete Node.js tutorial and build projects',
    completed: false
  },
  {
    title: 'Setup MongoDB',
    description: 'Install and configure MongoDB database',
    completed: true
  },
  {
    title: 'Create Todo App',
    description: 'Build a full-stack todo application',
    completed: false
  }
];

// Insert sample data
const seedDB = async () => {
  try {
    // Clear existing data
    await Task.deleteMany({});
    
    // Insert new data
    await Task.insertMany(sampleTasks);
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();