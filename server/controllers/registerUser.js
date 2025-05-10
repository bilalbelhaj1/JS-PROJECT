import User from "../models/user.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    const { Fname, Lname, gender, email, password, role, birthdate, establishment, field } = req.body;
    
    const username = Fname + Lname + Date.now();
    console.log(username);

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "L'adresse e-mail existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            Fname,
            Lname,
            username,
            email,
            password: hashedPassword,
            gender,
            birthdate,
            establishment,
            field,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "Inscription réussie." });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
};

export default registerUser;
