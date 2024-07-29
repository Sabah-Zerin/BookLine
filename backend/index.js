// backend/index.js
const express = require('express');
const connect_db = require('./connect/connect_db');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const PasswordResetRouter = require('./routes/PasswordResetRouter'); 

require('dotenv').config();
require('./models/db'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', AuthRouter);
app.use('/password-reset', PasswordResetRouter); // Add this line
app.get("/", (req, res) => res.json({ message: "Hello world" }));

// Connect to MongoDB
connect_db()
  .then(() => {
    console.log('MongoDB connected successfully');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit process if MongoDB connection fails
  });
