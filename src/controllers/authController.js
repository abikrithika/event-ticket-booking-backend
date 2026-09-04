const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
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

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and Password are required",
            });
        }
        const result=await pool.query(
            "SELECT * FROM app_user WHERE email=$1",
            [email]
        );
        if(result.rows.length===0){
            return res.status(401).json({
                message: "Invalid Email or Password",
            });
        }
        const user=result.rows[0];
        const passwordMatches=await bcrypt.compare(password,
            user.password_hash
        );
        if(!passwordMatches){
            return res.status(401).json({
                message:"Invalid email or password",
            });
        }
         const token=jwt.sign({
            userId:user.id,
            email:user.email,
        },
    process.env.JWT_SECRET,
    {
        expiresIn:"1h",
    });
        res.status(200).json({
            message:"Login Successsfull",
            token:token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }catch(error){
        console.error("Failed to login:",error.message);
        res.status(500).json({
            message:"Internal server error",
        });

    }
};
module.exports={
    register,
    login,
};