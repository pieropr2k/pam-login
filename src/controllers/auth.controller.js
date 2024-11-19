import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { createAccessToken } from '../libs/jwt.js';
import { findUserByEmail, createUser , findUserById } from '../models/user.model.js';

export const register = async (req, res) => {
    //console.log(req.body);
    const { username, email, password } = req.body;

    try {
        const userFound = await findUserByEmail(email);
        if (userFound) return res.status(400).json({ message: "The email is already in use" });

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = await createUser ({ username, email, password: passwordHash });

        const token = await createAccessToken({ id: userId });
        //console.log(token);
        res.cookie("token", token, {
            //httpOnly: true,
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            //sameSite: "strict",
            sameSite: "none",
        });
        res.json({ id: userId, username, email });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await findUserByEmail(email);
        if (!userFound) return res.status(400).json({ message: "The email does not exist" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "The password is incorrect" });

        const token = await createAccessToken({ id: userFound.id });

        res.cookie("token", token, {
            //httpOnly: true,  
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            //sameSite: "strict",
            sameSite: "none",
        });

        res.json({ id: userFound.id, username: userFound.username, email: userFound.email });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const userFound = await findUserById(decoded.id);
        if (!userFound) return res.sendStatus(401);

        res.json({ id: userFound.id, username: userFound.username, email: userFound.email });
    } catch (err) {
        return res.sendStatus(401);
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
};