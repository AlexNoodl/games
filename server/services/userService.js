import User from "../models/User.js";

export const findUserByEmail = async (email) => {
    return User.findOne({email});
}

export const findUserByUsername = async (username) => {
    return User.findOne({username});
}