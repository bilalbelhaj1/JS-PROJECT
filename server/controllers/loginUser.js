import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email invalide" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user.password);
        if (!isMatch) {
            console.log(isMatch);
            return res.status(400).json({ message: "Mot de passe invalide" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { 
                Fname: user.Fname,
                Lname: user.Lname,
                userId: user._id,
                role: user.role,
                gender: user.gender,
                username: user.username 
            },
            process.env.JWT_SECRET || '4sUgd85m6mAr5DCH',
            { expiresIn: "24h" }
        );

        let url;
        if (user.role === "Teacher") {
            url = `/teacher/home`;
        } else {
            url = `/student/home`;
        }

        return res.status(201).json({
            message: "Connexion réussie",
            token,
            url,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export default login;
