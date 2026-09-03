const pool=require("../config/db");

const getAllEvents= async(req,res)=>{
   try{
   
        const result=await pool.query("SELECT * FROM event");
        res.status(200).json(result.rows);
   }
   catch (error){
        console.error("Failed to fetch events:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
};
const getEventById= async(req,res)=>{
    try{
        const eventId= Number(req.params.id);
        if(!Number.isInteger(eventId)||eventId<=0){
            return res.status(400).json({
                message:"Invalid event ID",
            });
        }
        const result=await pool.query(
            "SELECT * FROM event WHERE id=$1",
            [eventId]
        );
        if(result.rows.length===0){
            return res.status(404).json({
                message:"Event not found",
            });
        }
        res.status(200).json(result.rows[0]);
    }
    catch(error){
        console.error("Failed to fetch event:",error.message);

        res.status(500).json({
            message:"Internal server error",
        });
    }
};

module.exports={
    getAllEvents,
    getEventById,
};