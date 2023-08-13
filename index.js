const express=require("express");



const app=express();



app.get("/",(req,res)=>{
    res.send("<h1>This is an express app</h1>")
})



app.listen(3000,()=>{
    console.log("hello this is working");
})