const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorization = async(req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided!" });
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET,(err,res)=>{
            if(err){
                return "token expired";
            }
            return res;
        });

        if(verify=="token expired"){
            return res.status(401).json({
                error:"Token Error",
                message: "Token Expired!"
            });
        }

        req.body.userId = verify.id;
        next();
    } catch (error) {
        res.status(401).json({
            error: error.message,
            message: "Unauthorized access! Invalid token."
        });
    }
}

module.exports = authorization;
