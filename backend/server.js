const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port =   5000;

// MongoDB connection string
const uri = "mongodb+srv://mvarunmathi2004:4546@devforge.r6jxddm.mongodb.net/?retryWrites=true&w=majority&appName=devforge";
const client = new MongoClient(uri);

// Middleware - fix body parsing configuration
// Use ONLY express.json() for parsing JSON and remove bodyParser which causes conflicts
app.use(cors());
app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON in request body:', err);
    return res.status(400).json({ success: false, message: 'Invalid JSON format in request body' });
  }
  next(err);
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

// API endpoint for contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    // Log the received request
    console.log('Received contact form submission:', req.body);
    
    // Extract data from request body
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    
    // Get database and collection
    const database = client.db('devforge');
    const contacts = database.collection('contacts');
    
    // Create contact document with timestamp
    const newContact = {
      name,
      email,
      message,
      createdAt: new Date()
    };
    
    // Insert into database
    const result = await contacts.insertOne(newContact);
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Contact message saved successfully',
      contactId: result.insertedId
    });
    
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to save contact'
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('DevForge Hackathon API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});
