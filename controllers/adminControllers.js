import { Manager } from "../models/managerModel.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/token.js";

// Register new admin or manager
export const adminSignin = async (req, res, next) => {
  try {
    const { fname, lname, email, password, mobile, role, profilePic, dob } = req.body;
    if (!fname || !email || !password || !mobile ) {
      return res.status(400).json({ message: "All filed are required" });
    }
    const isAdminExist = await Manager.findOne({ email });

    if (isAdminExist) {
      return res.status(400).json({ message: `${isAdminExist.role} already exist` });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const adminInfo = new Manager({fname,lname,email,password: hashedPassword,mobile,role,profilePic,dob});
    await adminInfo.save();

    const token = generateToken(adminInfo._id,adminInfo.role)
    res.cookie("token",token)

    const adminInfoObject = adminInfo.toObject()
    delete adminInfoObject._id
    delete adminInfoObject.password

    return res.json({data : adminInfoObject, message : "Account created successfully"})

  } catch (error) {
    return res.status(error.statusCode || 500).json({message : error.message || "Internal server error"})

  }
};

// Admin Login
export const adminLogin = async (req, res, next) => {
  try {
        const {email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: "All filed are required" });
        }
        const adminExist = await Manager.findOne({ email });

        if (!adminExist || adminExist.role != "admin") {
        return res.status(404).json({ message: `Admin does not exist` });
        }

        const passwordMatch = bcrypt.compareSync(password, adminExist.password);
        if(!passwordMatch){
            return res.status(401).json({ message: "Password not matching" });
        }


        const token = generateToken(adminExist._id,adminExist.role);
        res.cookie("token", token);

        const adminExistObject = adminExist.toObject();
        delete adminExistObject._id;
        delete adminExistObject.password;

        return res.json({
          data: adminExistObject,
          message: `Admin login successful`,
        });
            
  } catch (error) {
    return res.status(error.statusCode || 500).json({message : error.message || "Internal server error"})

  }
};

//Admin Profile
export const adminProfile = async (req, res, next) => {
  try {
        const adminId = req.user.id

        const adminInfo = await Manager.findById(adminId).select("-password");

        return res.json({data: adminInfo,message: `Admin details Fetched successfully`});

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Admin Logout
export const adminLogout = async (req, res, next) => {
  try {
        res.clearCookie("token")

        return res.json({message: "Logged out successfully",});
        
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Deactivate Admin Account
export const deactivateAdmin = async (req, res, next) => {
  try {
        const adminId = req.user.id

        const adminInfo = await Manager.findById(adminId).select("-password");
        adminInfo.isActive = false
        await adminInfo.save()

        return res.json({data: adminInfo,message: "Account deleted successfully",});

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

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

//Update Admin Password
export const updateAdminPassword = async(req,res,next) =>{
    try {
        const adminId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
          return res
            .status(400)
            .json({ message: "Old password and new password are required." });
        }

        const adminInfo = await Manager.findById(adminId);
        if (!adminInfo) {
          return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, adminInfo.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Old password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        adminInfo.password = hashedNewPassword;
        await adminInfo.save();

        res.status(200).json({message: "Password updated successfully." });

    } catch (error) {
        return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
    }
 };