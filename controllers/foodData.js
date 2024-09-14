const mongoose = require('mongoose');
const Food = require('../models/Food'); // Ensure the path to the Food model is correct

const addFoodData = async (req, res) => {
    try {
        const { categoryName, name, img, options, description } = req.body;

        if (!categoryName || !name || !img || !options || !description) {
            return res.status(400).json({ message: "Missing required fields in the request." });
        }

        // Create new Food document
        const newFoodItem = new Food({
            categoryName,
            name,
            img,
            options, // Pass options directly as an object
            description
        });

        const result = await newFoodItem.save();

        res.status(201).json({
            message: "Food item added successfully!",
            foodItem: result
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Internal Server Error"
        });
    }
}

const getFoodData = async (req, res) => {
    try {
        // Check if the database connection is established
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                message: "Database connection not established",
            });
        }

        // Fetch data from the first collection
        const fetchData = mongoose.connection.db.collection("foods");
        const data1 = await fetchData.find({}).toArray();

        // Fetch data from the second collection
        const fetchData2 = mongoose.connection.db.collection("categories");
        const data2 = await fetchData2.find({}).toArray();

        return res.status(200).json({
            message: "Data Fetched!!",
            data:[data1,data2]
        });
    } catch (error) {
        return res.status(500).json({
            message: "Data Fetch Failed!!",
            error: error.message
        });
    }
}

module.exports = {getFoodData, addFoodData}