const bcrypt=require("bcryptjs");
const pool=require("../config/db");

const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Name, Email and Password are required",
            });
        }
        const existingUser=await pool.query(
            "SELECT * FROM app_user WHERE email=$1",
            [email]
        );
        if(existingUser.rows.length>0){
            return res.status(409).json({
                message:"Email is already registered",
            });
        }
        const passwordHash=await bcrypt.hash(password,10);

        const result=await pool.query(
            `INSERT INTO app_user (name,email,password_hash)
            VALUES ($1, $2, $3)
            RETURNING id,name,email,created_at`,
            [name,email,passwordHash]
        );
        res.status(201).json({
            message:"User registered successfully",
            user: result.rows[0],
        });
    }catch(error){
        console.error("Failed to register user:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });
    }
};

module.exports={
    register,
};