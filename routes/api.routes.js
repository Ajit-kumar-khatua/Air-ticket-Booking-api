
const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { UserModel } = require("../models/user.model")
const { FlightModel } = require("../models/flight.model")
const { BookingModel } = require("../models/booking.model")

const apirouter=express.Router()

apirouter.get("/",(req,res)=>{
    res.send("all Good")
})

apirouter.post("/register", async (req,res)=>{
     const {name,email,password}=req.body
     try {
        const user= await UserModel.find({email})
        if(user.length==0){
            bcrypt.hash(password,5,async (err,hash_password) => {
                if(err){
                   console.log(err)
                }else{
                   let user=new UserModel({name,email,password:hash_password})
                   await user.save()
                   res.status(201).send({"msg":"User Register Sucessfully"})
                }
           })
        }else{
            res.send({"msg":"Email id is already registered"})
        }   
     } catch (error) {
         console.log("Error while registering")
         res.send({"msg":error})
     }
})

apirouter.post("/login",async (req,res)=>{
     const {email,password}=req.body
     try {
        const user=await UserModel.find({email})
        if(user.length!=0){
            let hash_password=user[0].password
            bcrypt.compare(password,hash_password,(err,result)=>{
                if(result){
                     var token= jwt.sign({userID:user[0]._id},process.env.key)
                     res.status(201).send({"msg":"Login Successful",token})
                }else{
                   console.log(err)
                   res.send({"msg":"Wrong Credentials"})
                }
           })
        }else{
            res.send({"msg":"Wrong Credentials"})
        }
        
        
     } catch (error) {
        console.log("Error While Login")
        res.send({"msg":error})
     }
})

apirouter.get("/flights", async (req,res)=>{
    try {
        let flights=await FlightModel.find()
        res.status(200).send(flights)
        
    } catch (error) {
       console.log(error)
       console.log("Error while getting Flight details") 
    }

})

apirouter.get("/flights/:id",async (req,res)=>{
     let id=req.params.id
     try {
        let flight= await FlightModel.find({_id:id})
        if(flight.length!=0){
            res.status(200).send(flight)
        }else{
            res.send("No such Flight with this id")
        }
        
     } catch (error) {
        console.log(error)
        res.send("Flight id is not valid")
     }
})

apirouter.post("/flights",async (req,res)=>{
    let payload=req.body
    try {
        let flight= await FlightModel.insertMany(payload)
        res.status(201).send("Flights added to Database sucessfully.")
        
    } catch (error) {
        console.log("Error While adding flights to DB")
        console.log(error)
    }
})

apirouter.patch("/flights/:id",async (req,res)=>{
      let id=req.params.id
      let payload=req.body
      try {
        let flight=await FlightModel.findByIdAndUpdate({_id:id},payload)
        res.send({"msg":"Data updated Sucessfully."})
        
      } catch (error) {
          console.log(error)
          res.send("Error while update the flight details")
      }
})

apirouter.delete("/flights/:id",async (req,res)=>{
    let id=req.params.id
    try {
      let flight=await FlightModel.findByIdAndDelete({_id:id})
      res.send({"msg":"Data Deleted Sucessfully."})
      
    } catch (error) {
        console.log(error)
        res.send("Error while update the flight details")
    }
})

apirouter.post("/booking", async (req,res)=>{
    const {user,flight}=req.body
    let userDetails=await UserModel.findById({_id:user})
    let {name,email}=userDetails
    let flightdetails= await FlightModel.findById({_id:flight})
    let {airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price}=flightdetails
    // console.log(userDetails,flightdetails)
    try {
        let booking= new BookingModel({user:{name,email},flight:{airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price}})

        await booking.save()
        res.status(201).send("Booking Confirmed")
        
    } catch (error) {
        console.log(error)
        res.send("Error While Booking the flight")
    }
})

apirouter.get("/dashboard",async (req,res)=>{
    try {
        let bookings= await BookingModel.find()
        res.send(bookings)
        
    } catch (error) {
        console.log(error)
        res.send("Error while getting bookings")
    }
})



module.exports={
     apirouter
}