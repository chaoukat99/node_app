const express=require("express");
const mongo_uri="mongodb+srv://chawkatomar:i5gx55P6FCFqJYDs@cluster.s5gynwk.mongodb.net/gomycode"

const body_parser=require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const mailer= require("nodemailer");
const fs=require("fs");

mongoose.connect(mongo_uri)
.then(()=>console.log("success"))
.catch(err=>console.log("connection failed"))




const app=express();

app.use(cors({
    origin:"*",
    methods:["GET","POST"]
}));


app.use(body_parser.json());

const Schema=mongoose.Schema({
    username:String,
    age:Number,
    email:String,
    password:String
})



const SchemeGreen=mongoose.Schema({
    nom_complet:String,
    email:String,
    sub:String,
    message:String

})



// node_mailer transport 
const transport=mailer.createTransport({
    service:"Gmail",
    auth:{
        user:"omar1chaoukat@gmail.com",
        pass:"uvwxbkeklywimlus"
    }
})

const GreenModel=mongoose.model("greencontact",SchemeGreen);

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
     fs.readFile("email.html",(err,data)=>{
        if(err){
            res.json({message:"cannot read the file"})
        }else{
            transport.sendMail({
                from:'omar1chaoukat@gmail.com',
                to:"chawkatomar@gmail.com",
                subject:"This is Test Sub",
                html:data.toString()
            }).then(()=>res.status(200).json({message:"Email sent successfully"}))
            .catch(err=>res.status(401).json({message:"Something went wron on sending email"}))
        }
     })
    

})




app.post("/api/add_user",(req,res)=>{

    // get request data
    const {username,age,email,password,}=req.body 
    
    UserModel.create({
        username:username,
        age:age,
        email:email,
        password:password,

    }).then(()=>res.status(200).json({message:"User Added Successfully"}))
    .catch(err=>res.status(400).json({message:"User Cannot Added Successfully"}))
})




// Post Green Index 

app.post("/greenindex/add-message",(req,res)=>{
    const {nom_complet,email,subject,message}=req.body
    
    GreenModel.create({
        nom_complet : nom_complet ,
        email      : email     ,
        sub    : subject   ,
        message  : message
        
    }).then(()=>{
         fs.readFile("welcome.html",(err,data)=>{
        if(err){
            res.json({message:"cannot read the file"})
        }else{
            transport.sendMail({
                from:'omar1chaoukat@gmail.com',
                to:email,
                subject:"This is welcome message ",
                html:data.toString()
            }).then(()=>res.status(200))
            .catch(err=>res.status(401))
        }
     })
        res.status(200).json({message:"Your message is added successfully check your email !"})
    })
    .catch(err=>res.status(404).json({message:"Something Went Wrong"}))
})

app.listen(5000,()=>{
    console.log("hello this is working");
})



