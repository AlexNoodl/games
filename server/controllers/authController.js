import {findUserByEmail, findUserByUsername} from "../services/userService.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

export const forgotPassword = async (req, res) => {
    const {email} = req.body

    try {
        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        const token = crypto.randomBytes(20).toString('hex')

        await user.updateOne({resetPasswordToken: token, resetPasswordExpires: Date.now() + 15 * 60 * 1000})
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const resetLink = `${process.env.SITE_URL}/reset-password/${token}`

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `
                <p>Please click the following link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
    }
}

export const resetPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body
    console.log(token)

    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({message: 'Invalid or expired token'})
        }

        console.log(user)

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.json({message: 'Password reset successfully'})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
    }
}


