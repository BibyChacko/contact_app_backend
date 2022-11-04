// TODO User info controller

const UserModel = require("../models/user_model");
const jwt = require("jsonwebtoken");

const filterObj = (obj,...allowedFields)=>{
    const filteredFields = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            filteredFields[el]=  obj[el];
        }
    });

    return filteredFields;
}

exports.createUser = async (req,res)=>{
    try{
        const User = await UserModel.create({
            email : req.body.email,
            password : req.body.password,
            name : req.body.name,
            dob: req.body.dob,
            addressLine1 : req.body.addressLine1,
            addressLine2 : req.body.addressLine,
            addressLine3 : req.body.addressLine3,
            city : req.body.city,
            district : req.body.district,
            state : req.body.state,
            country : req.body.country,
            pincode : req.body.pincode,
            location: req.body.location
        });
        const token = jwt.sign({uid:User.id,type:"user"},process.env.JWT_SECRET_KEY,
                {expiresIn:process.env.JWT_EXPIRES_IN});
        res.status(200).json({status:true,data: User,token: token,msg: "User created successfully"});
    }catch(err){
        res.status(500).json({status:false,error:err.message});
    }
}


exports.loginUser = async function(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).json({status:false,error:"Email and password is required"});
        return;
    }

   const userData = await UserModel.findOne({email:email}).select("+password");

   if(!userData){
    res.status(401).json({status:false,error:"User not found"});
    return;
   }

   const isPasswordsSame = await userData.checkPasswords(password,userData.password);
   if(!isPasswordsSame){
    res.status(401).json({status:false,error:"Incorrect password"});
    return;
   }


   const token = await jwt.sign(
    {
        uid : userData.id,
        type:userData.userType
    },
    process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN});

   res.status(200).json({status:true,data:userData,token:token});

}

exports.getUserInfo = function(req,res){
    
}

exports.updateUser = async function(req,res){
    if(req.body.password){
        res.status(404).json({status:false,error:"Password can`t be updated on this route"});
        return;
    }

    const filteredBody = filterObj(req.body,"name","dob","address");
    const updatedUser = await UserModel.findByIdAndUpdate(req.headers.user.id,filteredBody,{new:true,runValidators:true});
    res.status(200).json({status:true,data:updatedUser,msg:"User updated successfully"});
}

exports.updatePassword = async function(req,res){

    if(!req.body.currentPassword || !req.body.newPassword){
        res.status(404).json({status:false,error:"Current password and new password is required"});
        return;
    }
    const userData = await UserModel.findById(req.headers.user._id).select("+password");;
    const isPasswordsSame = await userData.checkPasswords(req.body.currentPassword,userData.password);
    if(!isPasswordsSame){
            res.status(401).json({status:false,error:"Incorrect password"});
            return;
    }
    userData.changePassword(req.body.newPassword);
    await userData.save();
    const token = await jwt.sign(
        {
        uid : userData.id,
        type:"user"
        },
    process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN});
 
    res.status(200).json({status:true,data:userData,token:token,forceLogin:true,msg:"Password changed successfully,Please login again"});
}

exports.forgotPassword = async function(req,res){
    try{
        const user = await UserModel.findOne({email:req.body.email});
        if(!user){
            res.status(404).json({status:false,error:"No user associated with the provided email"});
            return;
        }
    
        const resetToken = user.createResetPasswordToken();
        // TODO : Complete the functionality
        await user.save({validateBeforeSave:false});
    }catch(ex){
        res.status(500).json({status:false,error:ex.message});
        return;
    }
    

}

exports.resetPassword = function(req,res){
    
}


exports.blockUser = function(req,res){

}