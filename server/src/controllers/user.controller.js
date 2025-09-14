import { asyncHandler } from "../Utils/asyncHandler.js";
import { Apierror } from "../Utils/Apierror.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../Utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new Apierror(404, "User not found");
        }
    
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()
    
        user.refreshtoken = refreshtoken
        await user.save({validateBeforeSave: false})
        return {accesstoken, refreshtoken}
    } catch (error) {
        throw new Apierror(500, "Failed to generate access and refresh token.")
    }
}

const userRegister = asyncHandler(async (req, res) => {
    const { name, email, password, role, college } = req.body

    if ( [name, email, password, role, college].some((field) => field?.trim() === "")){
        throw new Apierror(400, "All fields are required")
    }

    const existeduser = await User.findone({
        $or: [{ email }, { name }]
    })

    if (existeduser) {
        throw new Apierror(409, "User already exists")
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role: role.touppercase(),
            college: college.touppercase()
        })
    
        const createduser = await User.findById(user._id)
    
        if(!createduser){
            throw new Apierror(500, "Failed to create user")
        }
    
        return res.status(201).json(new ApiResponse(200,createduser,"User registered successfully."))
        
    } catch (error) {
        throw new Apierror(500, "Failed to create user")
    }
})

export {
    userRegister
}