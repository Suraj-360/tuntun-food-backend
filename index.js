const express = require('express');
require('dotenv').config();
const app = express();
const DBConnect = require('./config/DBConnect');
const router = require('./routes/route');
//const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // For preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    
    next();
});

// JSON Middleware
app.use(express.json());

// Route Handling
app.use("/app/v1/", router);

// Root Route
app.get("/", (req, res) => {
    res.send("Hello from server!!");
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server started at port number ${process.env.PORT}`);
});

// Connect to Database
DBConnect();
