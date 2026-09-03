const express=require("express");

const {
    getAllEvents,
    getEventById,
}=require("../controllers/eventController");

const router=express.Router();

router.get("/",getAllEvents);

router.get("/:id",getEventById);

module.exports=router;
