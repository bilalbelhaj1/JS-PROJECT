import User from "../models/user.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    const { Fname,Lname,gender, email, password, role } = req.body;
    const username = Fname+Lname+Date.now();
    console.log(username);
    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            Fname,
            Lname,
            username,
            email,
            password: hashedPassword,
            role,
            gendre:gender
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

export default registerUser;

