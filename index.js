
const express=require("express")
const {connection}=require("./config/db")
const { apirouter } = require("./routes/api.routes")
require("dotenv").config()


const app=express()

app.use(express.json())

app.use("/api",apirouter)



app.listen(process.env.port, async ()=>{
    try {
        await connection
        console.log("Connected to DB")
        
    } catch (error) {
        console.log("Error While connecting to DB")
        console.log(error)
    }
    console.log(`Server is running on ${process.env.port}`)
})