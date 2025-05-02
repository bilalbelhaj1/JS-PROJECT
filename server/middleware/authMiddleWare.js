import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const secretToken = process.env.JWT_SECRET || '4sUgd85m6mAr5DCH';
        const decoded = jwt.verify(token, secretToken);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
};

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.redirect(`/${req.user.role.toLowerCase()}/home`);
        }
        next();
    };
};
