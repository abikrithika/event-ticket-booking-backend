const express=require("express");

const{
    gerOrders,
}=require("../controllers/orderController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/",authenticateToken,gerOrders);

module.exports=router;