import { User } from "../models/userModel.js";

export const checkUserValid = async (req, res, next) => {
  try {
    const { email } = req.body;

    
    if (!email) {
      return res.status(400).json({ message: "Email is required" , success : false});
    }

    
    const userInfo = await User.findOne({ email });


    if (!userInfo || !userInfo.isActive){
      return res.status(404).json({ message: "User Not Exist", success: false });
    }


    
    next();
  } catch (error) {
     return res.status(401).json({message: error.message || "Internal server error", success: false,});
  }
};
