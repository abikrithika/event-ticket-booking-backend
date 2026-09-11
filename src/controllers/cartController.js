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

const addCartItem= async(req,res)=>{
    try{
        const userId=req.user.userId;
        const {eventId, quantity}=req.body;

        if(!Number.isInteger(eventId) || 
        eventId<=0 ||
        !Number.isInteger(quantity) ||
        quantity<=0)
        {
            return res.status(400).json({
                message:"Valid eventId and quantity are required",
            });
        }
        const eventResult=await pool.query(
            "SELECT id FROM event WHERE id=$1",
            [eventId]
        );
        if(eventResult.rows.length===0){
            return res.status(404).json({
                message:"Event not found",
            });
        }
        let cartResult=await pool.query(
            "SELECT id FROM cart WHERE user_id=$1 LIMIT 1",
            [userId]
        );
        let cartId;
        if(cartResult.rows.length===0){
            cartResult=await pool.query(
                `INSERT INTO cart (user_id)
                VALUES ($1)
               RETURNING id `,
               [userId]
            );

            cartId=cartResult.rows[0].id;

        }else{
            cartId=cartResult.rows[0].id;
        }
        const existingItem=await pool.query(
            `SELECT id,quantity FROM cart_item WHERE cart_id=$1 AND event_id=$2`,
            [cartId,eventId]
        );
        let result;
        if(existingItem.rows.length>0){
            result=await pool.query(
                `UPDATE cart_item SET quantity=quantity+$1
                WHERE id=$2
                RETURNING id,cart_id,event_id,quantity`,
                [quantity,existingItem.rows[0].id]
            );
        }else{
            result=await pool.query(
                `INSERT INTO cart_item(cart_id,event_id,quantity)
                VALUES($1,$2,$3)
                RETURNING id,cart_id,event_id,quantity`,
                [cartId,eventId,quantity]
            );
        }
        await pool.query(
            `UPDATE cart SET updated_at=CURRENT_TIMESTAMP
            WHERE id=$1`,
            [cartId]
        );
        res.status(201).json({
            message:"Item added to cart",
            item:result.rows[0],
        });
    }
    catch(error){

        console.error("Failed to add cart item:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
};

const updateCartItem = async (req,res)=>{
try{
    const userId=req.user.userId;
    const itemId=Number(req.params.itemId);
    const{quantity}=req.body;

    if(!Number.isInteger(itemId) || itemId<=0){
        return res.status(400).json({
            message:"Invalid cart item ID",
        });
    }

    if(!Number.isInteger(quantity) || quantity<=0){
        return res.status(400).json({
            message:"Quantity must be a positive integer",
        });
    }
    const itemResult=await pool.query(
        `SELECT ci.id,ci.cart_id
        FROM cart_item ci
        JOIN cart c ON ci.cart_id=c.id
        WHERE ci.id=$1 AND c.user_id=$2`,
        [itemId,userId]
    );
    if(itemResult.rows.length===0){
        return res.status(400).json({
            message:"Cart item not found",
        });
    }
    const cartId=itemResult.rows[0].cart_id;
const result=await pool.query(
    `UPDATE cart_item SET quantity=$1
    WHERE id=$2
    RETURNING id,cart_id,event_id,quantity`,
    [quantity,itemId]
);
await pool.query(
    `UPDATE cart
    SET updated_at=CURRENT_TIMESTAMP
    WHERE id=$1`,
    [cartId]
);
return res.status(200).json({
    message:"Cart item updated successfully",
    item:result.rows[0],
});

}catch(error){
    console.error("Failed to update cart item:",error.message);
    res.status(500).json({
        message:"Internal server error",
    });

}
};
const deleteCartItem=async(req,res)=>{
    try{
        const userId=req.user.userId;
        const itemId=Number(req.params.itemId);

        if(!Number.isInteger(itemId)||itemId<=0){
            return res.status(400).json({
                message:"Invalid cart item id",
            });
        }
        const itemResult=await pool.query(
            `SELECT ci.id,ci.cart_id
            FROM cart_item ci
            JOIN cart c ON ci.cart_id=c.id
            WHERE ci.id=$1 AND c.user_id=$2`,
            [itemId,userId]
        );

        if(itemResult.rows.length===0){
            return res.status(404).json({
                message:"Cart item not found",
            });
        }
        const cartId=itemResult.rows[0].cartId;
        await pool.query(
            `DELETE FROM cart_item
            WHERE id=$1`,
            [itemId]
        );
await pool.query(`UPDATE cart SET updated_at=CURRENT_TIMESTAMP
    WHERE id=$1`,
[cartId]
);
res.status(200).json({
    message:"Cart item deleted successfully",
});
    }
    catch(error){
        console.error("Failed to delete cart item:",error.message);

        res.status(500).json({
            message:"Internal server error",
        });
    }
};
module.exports={
    getCart,
    addCartItem,
    updateCartItem,
    deleteCartItem,
};

