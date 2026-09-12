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
module.exports={
    gerOrders,
};