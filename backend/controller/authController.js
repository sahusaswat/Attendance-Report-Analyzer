const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

exports.signup = async(req,res) => {
    try {
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email});
        if(userExist) {
            return res.status(400).json("User Already Exist");
        };
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: "member"
        });

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(201).json({message: "SignUp Successful!",token,user});
    } catch (error) {
        console.log(`There is an error : ${error}`);
        res.status(500).json({message: error.message});
    }
};

exports.login = async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
             return res.status(400).json("Account Not Found")
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json("Invalid credentials!");
        };

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(200).json({message: "Login Successful! :)",token});
    } catch (error) {
        console.log(`There is an error : ${error}`);
        res.status(500).json({message: error.message});
    }
};