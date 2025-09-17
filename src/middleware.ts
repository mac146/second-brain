import type {Response,Request, NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_PASSWORD=process.env.JWT_PASSWORD!;

export const userMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header=req.headers["authorization"];
    try{
        const decoded=jwt.verify(header as string,JWT_PASSWORD);
        if(decoded){
            if(typeof decoded==="string") {
                res.status(403).json({
                     message: "You are not logged in"
                })
                return;
            }
            req.userId = (decoded as JwtPayload).id;
        next()
        }else{
            res.status(403).json({
                     message: "You are not logged in"
                })
        }
    }catch(e){
        res.status(403).json({
                     message: "server went down"
                })
    }
}