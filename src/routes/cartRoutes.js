const express=require("express");
const {
    getCart,
    addCartItem
}=require("../controllers/cartController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/", authenticateToken,getCart);
router.post("/items",authenticateToken,addCartItem);

module.exports=router;