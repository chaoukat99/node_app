const express=require("express");



const app=express();



app.get("/",(req,res)=>{
    res.json({message:"hello this is just a test "})
})



app.listen(3000,()=>{
    console.log("hello this is working");
})
