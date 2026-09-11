const express=require("express");
const {
    getCart,
    addCartItem,
    updateCartItem
}=require("../controllers/cartController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/", authenticateToken,getCart);
router.post("/items",authenticateToken,addCartItem);

router.put("/items/:itemId",
    authenticateToken,
    updateCartItem
);

module.exports=router;