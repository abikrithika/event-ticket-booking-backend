const pool=require("../config/db");

const gerOrders=async(req,res)=>{
    try{
        const userId=req.user.userId;

        const result=await pool.query(
            `SELECT id,status,total_amount,created_at
            FROM orders
            WHERE user_id=$1
            ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            orders:result.rows,
        });

    }catch(error){
        console.error("Failed to fetch orders",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
};
const getOrderById=async (req,res)=>{
    try{
        const userId=req.user.userId;
        const orderId=Number(req.params.id);

        if(!Number.isInteger(orderId) || orderId<=0){
            return res.status(400).json({
                message:"Invalid order ID",
            });
        }

        const orderResult=await pool.query(
            `SELECT id,status,total_amount,created_at
            FROM orders WHERE id=$1 AND user_id=$2`,
            [orderId,userId]
        );

        if(orderResult.rows.length===0){
            return res.status(404).json({
                message:"Order not found",
            });
        }

        const itemsResult=await pool.query(
            `SELECT oi.event_id,
            e.title,
            oi.quantity,
            oi.ticket_price,
            oi.quantity * oi.ticket_price AS subtotal
            FROM order_item oi 
            JOIN event e ON oi.event_id=e.id
            WHERE oi.order_id=$1
            ORDER BY oi.id`,
            [orderId]
        );
        res.status(200).json({
            order:{
                ...orderResult.rows[0],
                items:itemsResult.rows,
            },
        });
    }catch(error){
        console.error("Failed to fetch order:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
};

module.exports={
    gerOrders,
    getOrderById,
};