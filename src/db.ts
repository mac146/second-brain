import mongoose, { model,Schema } from "mongoose";

const userSchema= new Schema({
    username:{type: String ,unique:true},
    password:String
})

export const userModel= model("users",userSchema);

const contentSchema=new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'tag'}],
    userId:[{type:mongoose.Types.ObjectId,ref:'tag',required:'true'}]
})

export const contentModel= model("contents",contentSchema);