require("dotenv").config();

const express=require("express");

const pool=require("./config/db");
const app=express();
const PORT=3000;

app.get('/',(req,res)=>{
    res.send(`Event Ticket Booking API is running`);
});

pool
.query("SELECT NOW()")
.then((result)=>{
    console.log("Database connected:",result.rows[0].now);


app.listen(PORT,()=>{
    console.log(`Server running on this port ${PORT}`);
});

})
.catch((error)=>{
    console.error("Database Connection Failed:",error.message);
})