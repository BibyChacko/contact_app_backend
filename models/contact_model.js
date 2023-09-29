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
 
    address : {
        type : String,
        required : [true,"Address line 1 is required"]
    },

    email : {
        type : String,
        unique : true,
        required : [true,"Email is required"]
    },
    contactCreatedAt : {
        type : Date,
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

});


ContactSchema.pre("save", async function(next){
   this.contactCreatedAt = Date.now();
    next();
});

const ContactModel = mongoose.model("Contact",ContactSchema);

module.exports = ContactModel;