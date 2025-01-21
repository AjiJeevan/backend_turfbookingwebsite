import { Manager} from "../models/managerModel.js";

export const checkManager = async (req, res, next) => {
  try {
    const { email } = req.body;

    
    if (!email) {
      return res.status(400).json({ message: "Email is required" , success : false});
    }

    
    const userInfo = await Manager.findOne({ email });
    

    if (!userInfo || !userInfo.isActive || userInfo.role != "manager"){
      return res.status(404).json({ message: "User Autherization failed", success: false });
    }


    
    next();
  } catch (error) {
     return res.status(401).json({message: error.message || "Internal server error", success: false,});
  }
};
