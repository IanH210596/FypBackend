const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    // middleware used to handle incoming requests to protected API endpoints and check requestor's authenticaiton details
    try{
        // checks the request authorisation header
        const token = req.headers.authorization.split(" ")[1];
        // uses jwt.vrify to decode the token in the header. From the decoded token,t he user's email and user Id are determined
        const decodedToken = jwt.verify(token, 'very_long_super_strong_afaskgakjhkjakjghalkjhgkajslkjaskjg_secret_string');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch (error){
        // if there is an error and a valid web token cannot be verified from the request, then a  401 status response is sent to the requestor with message of stating "Authentication Failed" 
        res.status(401).json({
            message: "Authentication Failed"
        });
    }
}