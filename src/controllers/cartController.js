const pool=require("../config/db");

const getCart=async(req,res)=>{
 try{
    const userId=req.user.userId;
    const cartResult=await pool.query(
        `SELECT id,user_id,created_at,updated_at
        FROM cart
        WHERE user_id=$1
        LIMIT 1`,
        [userId]
    );
    if(cartResult.rows.length===0){
        return res.status(200).json({
            cart: null,
            items:[],
            total:"0.00",
        });
    }
    const cart=cartResult.rows[0];

    const itemsResult=await pool.query(
    `SELECT ci.id AS item_id,
    ci.event_id,
    e.title,
    ci.quantity,
    e.ticket_price,
    ci.quantity * e.ticket_price AS subtotal
    FROM cart_item ci
    JOIN event e ON ci.event_id=e.id
    WHERE ci.cart_id=$1
    ORDER BY ci.id`,
    [cart.id]
    );
    const total= itemsResult.rows.reduce(
        (sum,item)=>sum+Number(item.subtotal),
    0
);

res.status(200).json({
    cart,
    items:itemsResult.rows,
    total:total.toFixed(2),

});
} catch(error){
    console.error("Failed to fetch cart:",error.message);

    res.status(500).json({
        message:"Internal server error",
    });

 }

};
module.exports={
    getCart,
};

