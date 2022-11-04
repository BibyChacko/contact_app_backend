const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : [true,"First name is required"]
    },
    lastName : {
        type : String,
        required : [true,"Last name is required"]
    },
    
    phone : {
        type : String,
        required : [true,"Phone is required"],
        unique : true
    },
    middleName : {
        type : String,
    },
    dob : {
        type : Date,
        required : [true,"DOB is required"]
    },
    addressLine1 : {
        type : String,
        required : [true,"Address line 1 is required"]
    },
    addressLine2 : {
        type : String
    },
    addressLine3 : {
        type : String
    },
    city : {
        type : String,
        required : [true,"City is required"]
    },
    district : {
        type : String,
        required : [true,"District is required"]
    },
    state : {
        type : String,
        required : [true,"State is required"]
    },
    country : {
        type : String,
        required : [true,"Country is required"]
    },
    pincode : {
        type : String,
        required : [true,"Pincode is required"]
    },
    email : {
        type : String,
        unique : true,
        required : [true,"Email is required"]
    },
    contactCreatedAt : {
        type : Date,
    },

});


ContactSchema.pre("save", async function(next){
   this.contactCreatedAt = Date.now();
    next();
});

const ContactModel = mongoose.model("Contact",ContactSchema);

module.exports = ContactModel;