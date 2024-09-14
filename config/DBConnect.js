const mongoose = require('mongoose');
require('dotenv').config();

const DBConnect = ()=>
{
    mongoose.connect(process.env.DB_URL_ALTAS).then(()=>{
        console.log("DB Connected Successfully!!");
    })
    .catch((error)=>{
        console.log("DB Connection Failed!!");
        console.log(error.message);
    })
}

module.exports = DBConnect;