const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    categoryName: [
        {
            type: String,
            required: true
        }
    ],
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    options: {
        type: [mongoose.Schema.Types.Mixed], // Accepts any type of data
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Food", foodSchema);
