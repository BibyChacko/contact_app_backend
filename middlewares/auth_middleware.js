const {promisify} = require("util");
const jwt = require("jsonwebtoken");

exports.checkIfTokenIsPresent = async function(req,res,next){
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        res.status(401).json({status:false,error:"Token not found. Please login again",forceLogin:true});
        return;
    }
    
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY);
    
        const freshUser = await UserModel.findById(decoded.uid);
        if(!freshUser){
            res.status(401).json({status:false,error:"Token missing. Please login again",forceLogin:true}); 
            return;
        }
        const isPasswordChanged = await freshUser.hasPasswordChanged(decoded.iat);
        if(isPasswordChanged){
            res.status(401).json({status:false,error:"Password changed. Please login again",forceLogin:true}); 
            return;
        }
        req.headers.user = freshUser;
        next();
    }catch(ex){
        res.status(401).json({status:false,error: ex.message,forceLogin:true}); 
        return;
    } 
    
}