const express=require("express");
const {
    getCart,
}=require("../controllers/cartController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/", authenticateToken,getCart);

module.exports=router;