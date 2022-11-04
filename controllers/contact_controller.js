const ContactModel = require("../models/contact_model");

exports.createContact = function (req,res){
    const contactData = {...req.body};
    doctorData["clinicId"] = clinicData._id;
    ContactModel.create(req.body,(err,Contact)=>{
        if(err){
            res.status(500).json({status:false,error:err.message});
        }else{
            res.status(200).json({status:true,data:Contact,
                msg:"Contact model created successfully"});
        }
    });
}

exports.getAllContacts = function(req,res){
    SubscriptionModel.find().exec((err,response)=>{
        if(err){
            res.status(404).json({status:false,error:err.message});
        }else{
            res.status(200).json({status:true,data:response,
                msg:"Subscription data fetched successfully"}); 
        }
    });
}
