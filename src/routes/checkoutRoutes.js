const express=require("express");

const{
checkOut,
}=require("../controllers/checkoutController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.post("/",authenticateToken,checkOut);

module.exports=router;