import {findUserByEmail, findUserByUsername} from "../services/userService.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

export const register = async (req, res) => {
    const {username, email, password} = req.body

    try {
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            return res.status(409).json({message: 'User already exists'})
        }

        const user = new User({username, email, password})
        await user.save()

        const token = createToken(user._id)
        res.status(201).json({token, userId: user._id})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const login = async (req, res) => {
    const {login, password} = req.body

    try {
        let user

        if (login.includes('@')) {
            user = await findUserByEmail(login)
        } else {
            user = await findUserByUsername(login)
        }


        if (!user) {
            return res.status(401).json({message: 'User not found'})
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'})
        }

        const token = createToken(user._id)
        res.status(200).json({token, userId: user._id})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


