const express=require("express");
const {
    getCart,
    addCartItem,
    updateCartItem,
    deleteCartItem
}=require("../controllers/cartController");

const authenticateToken=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/", authenticateToken,getCart);
router.post("/items",authenticateToken,addCartItem);

router.put("/items/:itemId",
    authenticateToken,
    updateCartItem
);

router.delete("/items/:itemId",
    authenticateToken,
    deleteCartItem
);

module.exports=router;