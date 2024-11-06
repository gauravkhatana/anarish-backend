const cors = require("cors");
const express = require("express");
const usersRoutes = require("./api/routes/users");
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file
const app = express();
connectDB();

// const corsOptions = {
//   origin: 'https://www.anarish.com', // Allow only this origin
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
//   allowedHeaders: 'Content-Type,Authorization', // Allowed headers
//   credentials: true, // Allow cookies to be sent
// };


// CORS options to allow all origins
const corsOptions = {
  origin: '*',  // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
  credentials: true,  // Allow credentials like cookies
  preflightContinue: false,  // Automatically handle OPTIONS requests
  optionsSuccessStatus: 204,  // Status code for successful OPTIONS requests
}

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded payloads
app.use(cors(corsOptions));// Enable Cross-Origin Resource Sharing (CORS)

// API Routes
app.use("/users", usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});



const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{console.log(`Server running on http://localhost:${PORT}`)});

// Export the app object for Vercel to use
module.exports = app;

