require("dotenv").config();

const express=require("express");

const pool=require("./config/db");

const eventRoutes=require("./routes/eventRoutes");
const authRoutes=require("./routes/authRoutes");
const cartRoutes=require("./routes/cartRoutes");
const checkoutRoutes=require("./routes/checkoutRoutes");
const orderRoutes=require("./routes/orderRoutes");

const app=express();
app.use(express.json());
const PORT=3000;

app.get('/',(req,res)=>{
    res.send(`Event Ticket Booking API is running`);
});

app.use("/api/events",eventRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);

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