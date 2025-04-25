import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) =>{
    const { email, password} = req.body;
    console.log(email, password);

    try{

        // Check if the user exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user.password);
        if(!isMatch){
            console.log(isMatch);
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { 
                Fname:user.Fname,
                Lname:user.Lname,
                userId: user._id,
                role: user.role,
                gendre:user.gendre,
                username: user.username 
            },
            '4sUgd85m6mAr5DCH',
            { expiresIn: "24h" });

        let url;
        if(user.role === "Teacher"){
            url = `/teacher/home`;
        }else{
            url = `/student/home`;
        }
        return res.status(201).json({
            message: "Login successful",
            token,
            url,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        })

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default login;