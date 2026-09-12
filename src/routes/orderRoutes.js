const express=require("express");

const{
    gerOrders,
    getOrderById,
}=require("../controllers/orderController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/",authenticateToken,gerOrders);

router.get("/:id",authenticateToken,getOrderById);

module.exports=router;