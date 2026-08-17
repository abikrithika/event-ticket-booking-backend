const express=require("express");
const app=express();
const PORT=3000;

app.get('/',(req,res)=>{
    res.send(`Event Ticket Booking API is running`);
});

app.listen(PORT,()=>{
    console.log(`Server running on this port ${PORT}`);
});

