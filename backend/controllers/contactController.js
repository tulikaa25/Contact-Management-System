import validator from "validator"     //for mail validation 

import userModel from '../models/userModel.js'
//api for adding 
const addUser=async(req,res)=>{
    try{

       const{name,phone}=req.body;
       let updatedPhone=phone;
       //checking for all data to be added
       if(!name || !phone)    //for null data 
       {
        return res.json({success:false,message:"Missing details"})
       }

       //validate phone format 
       if(!validator.isMobilePhone(updatedPhone,"en-IN"))
       {
           return res.status(400).json({success:false,message:"Invalid phone number"});
       }
       
    if (!updatedPhone.startsWith("+91")) {
       if (updatedPhone.startsWith("91")) {
         updatedPhone = `+${updatedPhone}`;
       }
       else {
         updatedPhone = `+91${updatedPhone}`;
      }
    }
   
        //duplicate phone check
        const existingUser=await userModel.findOne({phone:updatedPhone})
        if(existingUser)
        {
            return res.status(400).json({success:false,message:"Phone number already exists"});
        }
      
        //storing contact in db
      const userData={
        name,
        phone:updatedPhone
      }

      const newUser=new userModel(userData);
      await newUser.save()    //contact info stored in DB
      res.json({success:true,message:"Contact added successfully"})
    }
    catch(error){
  console.log(error);
  res.json({success:false,message:error.message})
    }
}




const getUsers=async(req,res)=>{
    try{
        const users=await userModel.find({})   //fetch all users from db
        res.json({success:true,users} )
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


//retrieves all contacts if nothing entered and none if matching not found 

const searchByPhone=async(phone)=>
{
    let updatedPhone=phone;
     if (!updatedPhone.startsWith("+91")) {
       if (updatedPhone.startsWith("91")) {
         updatedPhone = `+${updatedPhone}`;
       }
       else {
         updatedPhone = `+91${updatedPhone}`;
      }
    }
     const results = await userModel.find({ phone: updatedPhone });
    return { results, updatedPhone };
         //returns exact match 
}

const searchByName=async(name)=>
{
   const query={
       name: { $regex: name, $options: 'i' } 
   }
   return userModel.find(query);

}
const userSearch=async(req,res)=>{
     try{
        const{name,phone}=req.query;
         
        if(!name && !phone)
        {
            return res.json({success:false,message:"You must enter details to search"})
        }
            let results;
        if(phone)    //search by number if provided
        {
           results= await searchByPhone(phone.trim());    //trim only when the field is not null 
        }
        else if(name && name.trim()!=="")
        { 
           
           results= await searchByName(name.trim());
        }
        
        
       
       if (results.length > 0) {
       res.status(200).json({success:true,results})    
       } 
       else {
        res.status(200).json({success:true, message:"No contacts found"});
        }
    }
    catch(error){
         console.log(error);
        res.json({success:false,message:error.message})
    }
    }



//delete by name 
const delUser= async(req,res)=>{
    try{
        const{phone}=req.body;
         if(!phone || !phone.trim())
        {
            return res.json({success:false,message:"You must enter number to delete"})
        }
        const trimmedPhone=phone.trim();
        const {results,updatedPhone}= await searchByPhone(trimmedPhone);
    
       if (results.length > 0) {
        const deleteResult = await userModel.deleteMany({phone:updatedPhone});
        res.status(200).json({
        success: true,
        message: `${deleteResult.deletedCount} Contact(s) deleted successfully`
      });
       
       } 
       else {
        res.status(200).json({success:false, message:"No contacts found"});

        }


    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export { addUser, getUsers,userSearch,delUser};