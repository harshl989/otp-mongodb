const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const User = require('../models/userModel');
const mailSender = require('../utils/mailSender');

exports.sendOTP = async (req,res) => {
    const {email} = req.body;
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already exists",
        });
    }
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    let result = await OTP.findOne({otp: otp});
    while(result){
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
        });
        result = await OTP.findOne({otp: otp});
    }
    const otpPayload = {email,otp};
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp,
    });
    await mailSender(email, "OTP", `Your OTP is ${otp}`)
        
};