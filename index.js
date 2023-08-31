const express=require("express");
const mongo_uri="mongodb+srv://chawkatomar:i5gx55P6FCFqJYDs@cluster.s5gynwk.mongodb.net/gomycode"

const mongoose = require("mongoose");
const cors = require("cors");

const mailer= require("nodemailer");


mongoose.connect(mongo_uri)
.then(()=>console.log("success"))
.catch(err=>console.log("connection failed"))




const app=express();

app.use(cors({
    origin:"*",
    methods:["GET","POST"]
}));

const Schema=mongoose.Schema({
    username:String,
    age:Number,
    email:String,
    password:String
})




// node_mailer transport 
const transport=mailer.createTransport({
    service:"Gmail",
    auth:{
        user:"omar1chaoukat@gmail.com",
        pass:"uvwxbkeklywimlus"
    }
})



const UserModel = mongoose.model("user",Schema);


const Middleware=(req,res,next)=>{
    let right_key="omar123";
        let key=req.query.key;
        if(!key){
            res.status(401).json({"message":"unauthorized"})
        }else if(key!==right_key){
            res.status(401).json({"message":"Sorry Incorrect api key "})    
        }else{
            next();
        }
}

app.use("/api/users",Middleware);

app.get("/",(req,res)=>{
    res.json({message:"hello this is just a test dude ✍ "})
})


// APi get method 

app.get("/api/users",(req,res)=>{
    UserModel.find()
    .then(data=>res.status(200).json(data))
    .catch((err)=>res.status(404).json({message:"Sorry something went wrong try later ",error:err}))
})

app.get("/send_email",(req,res)=>{

    transport.sendMail({
        from:'omar1chaoukat@gmail.com', // sender address
        to:'chawkatomar@gmail.com', // list of receivers
        subject:"Test on online server",
        html:"<b style='color:red;'>Congrats that's should work</b>"

    }).then(()=>res.status(200).json({message:"Email sent successfully"}))
    .catch(err=>res.status(401).json({message:"Something went wron on sending email"}))

})


app.listen(3000,()=>{
    console.log("hello this is working");
})