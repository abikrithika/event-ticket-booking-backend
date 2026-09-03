require("dotenv").config();

const express=require("express");

const pool=require("./config/db");
const app=express();
const PORT=3000;

app.get('/',(req,res)=>{
    res.send(`Event Ticket Booking API is running`);
});

app.get("/api/events", async(req,res)=>{
   try{
   
        const result=await pool.query("SELECT * FROM event");
        res.status(200).json(result.rows);
   }
   catch (error){
        console.error("Failed to fetch events:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
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