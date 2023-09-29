const ContactModel = require("../models/contact_model");

exports.createContact = function (req,res){

    const contactData = {...req.body};
    const uId = req.headers.user._id; 
    contactData["createdBy"] = uId;

    ContactModel.create(contactData,(err,Contact)=>{
        if(err){
            res.status(500).json({status:false,error:err.message});
        }else{
            res.status(200).json({status:true,data:Contact,
                msg:"Contact created successfully"});
        }
    });
}

exports.getAllContacts = function(req,res){
    const uId = req.headers.user._id; 
    ContactModel.find({createdBy:uId}).exec((err,response)=>{
        if(err){
            res.status(404).json({status:false,error:err.message});
        }else{
            res.status(200).json({status:true,data:response,
                msg:"Contacts fetched successfully"}); 
        }
    });
}


exports.updateAContact = function(req,res){
    const uId = req.headers.user._id; 
    const contactId = req.params.id;
    ContactModel.findByIdAndUpdate(contactId,req.body,{new:true}).exec((err,response)=>{
        if(err){
            res.status(404).json({status:false,error:err.message});
        }else{
            res.status(200).json({status:true,data:response,
                msg:"Contact updated successfully"}); 
        }
    });
}

exports.deleteAContact = function(req,res){
    const uId = req.headers.user._id; 
    const contactId = req.params.id;
    ContactModel.findByIdAndDelete(contactId).exec((err,response)=>{
        if(err){
            res.status(404).json({status:false,error:err.message});
        }else{
            res.status(200).json({status:true,data:response,
                msg:"Contact removed successfully"}); 
        }
    });
}


exports.checkIfIDExists = async function(req,res,next){
    const contactCount = await ContactModel.countDocuments({"_id":req.params.id});
    if(contactCount<1){
        res.status(404).json({status:false,error:"Contact not found"});
    }else{
        next();
    }
}