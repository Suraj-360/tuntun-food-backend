const Category = require("../models/category");


const insertCategoryName = async (req,res)=>{
    try{
        const categoryName = req.body;

        if(!categoryName)
        {
            res.status(404).json({
                message:"Category Name is not found!!"
            })
        }

        const result = await Category.create(categoryName);

        res.status(200).json({
            message:"Data inserted successfully!!"
        });

    }catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}

module.exports = insertCategoryName;