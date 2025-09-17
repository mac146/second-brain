import express from "express";
import { userModel,contentModel } from "./db.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { userMiddleware } from "./middleware.js";
dotenv.config();
const Jwt_PASSWORD = process.env.JWT_PASSWORD!;

const app=express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup",async (req,res)=>{
    const {username,password}=req.body;
    try{
        await userModel.create({
            username,
            password
        })
        res.json({
            message:"signed up succesfully"
        })
    } catch(e){
        res.status(411).json({
            message:"user already existed"
        })
    }
})

app.post ("/api/v1/signin",async (req,res)=>{
    const {username,password}=req.body;

    const existinguser=await userModel.findOne({
        username,
        password
    })
    if(existinguser){
        const token=jwt.sign({
            id:existinguser._id
        },Jwt_PASSWORD)
     res.json({
            token
        })

    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }  
})

app.post("/api/v1/content",userMiddleware,async(req,res)=>{
    const {link,type,title}=req.body;

    await contentModel.create({
        link,
        type,
        title,
        userId:req.userId
    })
    res.json({
        message:"content created"
    })
})

app.get("/api/v1/content",userMiddleware,async(req,res,next)=>{
    const userId=req.userId;

    const content=await contentModel.find({
        userId
    }).populate("userId","username")
    res.json({
        content
    })
})

app.delete("/api/v1/content",userMiddleware,async(req,res,next)=>{
    const contentId=req.body.contentId

     await contentModel.deleteMany({
        contentId,
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })
})

app.listen(3000);