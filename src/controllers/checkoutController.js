const pool=require("../config/db");

const checkOut=async(req,res)=>{
    let client;
    try{
        const userId=req.user.userId;
        client=await pool.connect();
        await client.query("BEGIN");

        const cartResult=await client.query(
            `SELECT id FROM cart WHERE user_id=$1
            LIMIT 1`,
            [userId]
        );
        if(cartResult.rows.length===0){
            await client.query("ROLLBACK");
            return res.status(400).json({
                message:"Cart is empty",
            });
        }
        const cartId=cartResult.rows[0].id;

        const itemsResult=await client.query(
            `SELECT ci.event_id,
            ci.quantity,
            e.ticket_price,
            ci.quantity * e.ticket_price AS subtotal
            FROM cart_item ci
            JOIN event e ON ci.event_id=e.id
            WHERE ci.cart_id=$1`,
            [cartId]
        );
        if(itemsResult.rows.length===0){
            await client.query("ROLLBACK");
            return res.status(400).json({
                message:"Cart is empty",
            });
        }
        const totalAmount=itemsResult.rows.reduce((sum,item)=>
            sum+Number(item.subtotal),
        0
    ).toFixed(2);
   const orderResult=await client.query(
    `INSERT into orders(user_id,total_amount)
    VALUES($1,$2)
    RETURNING id,user_id,status,total_amount,created_at`,
    [userId,totalAmount]
   );
   const order=orderResult.rows[0];
   for(const item of itemsResult.rows){
    await client.query(
        `INSERT INTO order_item
        (order_id,event_id,quantity,ticket_price)
        VALUES($1,$2,$3,$4)`,
        [
            order.id,
            item.event_id,
            item.quantity,
            item.ticket_price,
        ]
    );
   }

   await client.query(
    `DELETE FROM cart_item
    WHERE cart_id=$1`,
    [cartId]
   );

   await client.query(
    `UPDATE cart
    SET updated_at=CURRENT_TIMESTAMP
    WHERE id=$1`,
    [cartId]
   );
   await client.query("COMMIT");
   res.status(201).json({
    message:"Checkout completed successfully",
    order,
   });

    }catch(error){
        if(client){
            await client.query("ROLLBACK");
        }
        console.error("Checkout failed:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }finally{
        if(client){
            client.release();
        }
    }

};
module.exports={
    checkOut,
};