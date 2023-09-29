const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : [true,"Email is required"]
    },
    password : {
        type : String,
        required : [true,"Password is required"],
        minlength:5,  
        select : false
    },
    isActive : {
        type : Boolean,
        default : true
    },
    userType: {
        type : String,
        enum : ["user","admin","clinic","doctor"],
        default : "user"
    },
    name : {
        type : String,
        required : [true,"Name is required"]
    },
    dob : {
        type : Date,
        required : [true,"DOB is required"]
    },
    phone : {
        type : String,
        unique : true,
        required : [true,"Phone is required"]
    },
   
    passwordChangedAt : {
        type : Date,
    },
    passwordResetToken : {
        type: String,
        select: false
    },
    passwordResetExpiresAt : {
        type: Date,
        select: false
    },
}, {
    timestamps : true
});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
});

UserSchema.methods.checkPasswords = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

UserSchema.methods.getFullAddress =  function(){
    return [this.addressLine1,this.addressLine2,this.addressLine3,this.city,this.district,this.state,this.country].join(",");
}

UserSchema.methods.hasPasswordChanged = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimeStamp;
    }
    return false;
}

UserSchema.methods.createResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

UserSchema.methods.changePassword = function(newPassword){
    this.password = newPassword;
    this.passwordChangedAt = Date.now();
}

const UserModel = mongoose.model("User",UserSchema);

module.exports = UserModel;