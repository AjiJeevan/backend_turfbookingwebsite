import { Manager } from "../models/managerModel.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/token.js";


// Manager Login
export const managerLogin = async (req, res, next) => {
  try {
        const {email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: "All filed are required" });
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
        res.cookie("token", token);

        const managerExistObject = managerExist.toObject();
        delete managerExistObject._id;
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
        res.clearCookie("token")

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