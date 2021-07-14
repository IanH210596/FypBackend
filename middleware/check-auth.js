const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'very_long_super_strong_afaskgakjhkjakjghalkjhgkajslkjaskjg_secret_string');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch (error){
        res.status(401).json({
            message: "Authentication Failed"
        });
    }
}