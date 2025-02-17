import { Manager } from "../models/managerModel.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/token.js";
import { Turf } from "../models/turfModel.js";
import { uploadImage } from "../utils/uploadImage.js";

const NODE_ENV = process.env.NODE_ENV;

// Manager Login
export const managerLogin = async (req, res, next) => {
  try {
        const {email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
        }
        const managerExist = await Manager.findOne({ email });

        if (!managerExist || managerExist.role != "manager") {
          return res.status(404).json({ message: `Manager does not exist` });
        }

        const passwordMatch = bcrypt.compareSync(
          password,
          managerExist.password
        );
        if(!passwordMatch){
            return res.status(401).json({ message: "Password not matching" });
        }


        const token = generateToken(managerExist._id, managerExist.role);
        //res.cookie("token", token);
        res.cookie("token", token, {
          sameSite: NODE_ENV === "production" ? "None" : "Lax",
          secure: NODE_ENV === "production",
          httpOnly: NODE_ENV === "production",
        });
    
        const managerExistObject = managerExist.toObject();
        delete managerExistObject.password;

        return res.json({
          data: managerExistObject,
          message: `Manager login successful`,
        });
            
  } catch (error) {
    return res.status(error.statusCode || 500).json({message : error.message || "Internal server error"})

  }
};

//Manager Profile
export const managerProfile = async (req, res, next) => {
  try {
    const managerId = req.user.id;

    const managerInfo = await Manager.findById(managerId).select("-password");

    return res.json({
      data: managerInfo,
      message: `Manager details Fetched successfully`,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Manager Logout
export const managerLogout = async (req, res, next) => {
  try {
        res.clearCookie("token", {
          sameSite: NODE_ENV === "production" ? "None" : "Lax",
          secure: NODE_ENV === "production",
          httpOnly: NODE_ENV === "production",
        });

        return res.json({message: "Logged out successfully",});
        
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Update Manager Password
export const updateManagerPassword = async(req,res,next) =>{
    try {
        const managerId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
          return res
            .status(400)
            .json({ message: "Old password and new password are required." });
        }

        const managerInfo = await Manager.findById(managerId);
        if (!managerInfo) {
          return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, managerInfo.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Old password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        managerInfo.password = hashedNewPassword;
        await managerInfo.save();

        res.status(200).json({message: "Password updated successfully." });

    } catch (error) {
        return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
    }
 };

  //Update Manager Profile
 export const updateManagerProfile = async(req,res,next) =>{
     try {
 
         const managerId = req.user.id;
       const { fname, lname, email, mobile, dob } = req.body;
       
       let profilePic;
              
              if (req.file) {
                const profilePicPath = req.file.path;
                const result = await uploadImage(profilePicPath);
                profilePic = result.url;
              }
 
         if(!fname && !lname && !email && !mobile && !dob){
             return res
               .status(400)
               .json({ message : "No information provided to update" });
         }
 
         const updatedManager = await Manager.findByIdAndUpdate(
           managerId,
           { $set: { fname, lname, email, mobile, dob,profilePic } },
           { new: true, runValidators: true }
         ).select("-password");
 
         if (!updatedManager) {
           return res.status(404).json({ message: "User not found" });
         }
 
         return res
           .status(200)
           .json({ data : updatedManager ,message: "Profile updated successfully" });
         
     } catch (error) {
         return res
           .status(error.statusCode || 500)
           .json({ message: error.message || "Internal server error" });
     }
 }

 //Deactivate Manager Account
export const deactivateManager = async (req, res, next) => {
  try {
        const {managerId} = req.body

        const managerInfo = await Manager.findById(managerId).select("-password");
        if(!managerInfo || managerInfo.role != "manager"){
            return res.status(401).json({ message: "Manager not exist" });
        }
        managerInfo.isActive = false
        await managerInfo.save()

        return res.json({data: managerInfo,message: "Account deleted successfully",});

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


// Get All Manager Details
export const getAllManager = async(req,res,next)=>{
    try {
        const managerList = await Manager.find({role : "manager"});

        if(!managerList){
            return res.status(404).json({message : "No details found "})
        }
        return res.json({data : managerList , message : "Manager list fetched"})
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}


// Get all assigned turf of a purticular manager
export const getAssignedTurf = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const turfList = await Turf.find({ managerId, isActive:true })
    if (!turfList) {
      return res.status(404).json({ message: "No details found " });
    }
    return res.json({ data: turfList , message: "Assigned Turf Lists" });
    
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}

export const checkManager= async (req, res, next) => {
  try {
    return res.json({ message: "Manager Autherized" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};