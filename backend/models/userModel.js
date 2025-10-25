import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,
        required:true,
         trim:true,},
    phone:{type:String,
        required:true,
        unique:true,
        trim:true,},


})

  const userModel=mongoose.models.user || mongoose.model('user',userSchema)
  export default userModel
  