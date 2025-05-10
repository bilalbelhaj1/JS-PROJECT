import User from '../models/user.js'
import bcrypt from 'bcrypt';

const updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { username, email } = req.body;
    console.log(username, email);

    const user = await User.findOne({ _id: userId });
    if (!user) {
        res.status(400).json({ message: "Nom d'utilisateur introuvable", type: 'danger' });
    } else {
        const usersTockeck = await User.find({ _id: { $ne: userId } });
        const usernameExists = usersTockeck.some(user => user.username === username);
        const emailExists = usersTockeck.some(user => user.email === email);

        if (usernameExists) {
            res.status(400).json({ message: "Ce nom d'utilisateur est déjà pris", type: 'danger' });
        } else if (emailExists) {
            res.status(400).json({ message: "Cet e-mail existe déjà", type: 'danger' });
        } else {
            await User.updateOne({ _id: userId }, { $set: { username: username, email: email } });
            res.status(201).json({ message: "Nom d'utilisateur mis à jour avec succès", type: 'success' });
        }
    }
}

const changePassword = async (req, res) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        res.status(400).json({ message: "Aucun utilisateur trouvé", type: "danger" });
        return;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        res.status(400).json({ message: "Votre mot de passe actuel est invalide", type: "danger" });
        return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
    res.status(201).json({ message: "Mot de passe mis à jour avec succès", type: 'success' });
}

export { changePassword, updateProfile };
