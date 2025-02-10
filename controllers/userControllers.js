import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/token.js";
import { uploadImage } from "../utils/uploadImage.js";

const NODE_ENV = process.env.NODE_ENV;

// New user signin 
export const userSignup = async (req, res, next) => {
  try {
    const { fname, lname, email, password, mobile, dob } = req.body;
    let profilePic

    if(req.file){
      const profilePicPath = req.file.path;

      const result = await uploadImage(profilePicPath);
      const profilePic = result.url;
    }
    else {
      profilePic = "https://i.pinimg.com/originals/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg"
    }
    

    if (!fname || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userInfo = new User({fname,lname,email,password: hashedPassword,mobile,profilePic,dob,});
    await userInfo.save();

    const token = generateToken(userInfo._id)
    // res.cookie("token", token)
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    const userInfoObject = userInfo.toObject()
    
    delete userInfoObject.password

    return res.json({data : userInfoObject, message : "Account created successfully" , token : token})

  } catch (error) {
    return res.status(error.statusCode || 500).json({message : error.message || "Internal server error"})

  }
};


// User Login
export const userLogin = async (req, res, next) => {
  try {
        const {email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
        }
        const userExist = await User.findOne({ email });

        if (!userExist) {
        return res.status(404).json({ message: "User does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);
        if(!passwordMatch){
            return res.status(401).json({ message: "Password not matching" });
        }


        const token = generateToken(userExist._id);
    // res.cookie("token", token);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

        // const userExistObject = userExist.toObject();
        // delete userExistObject._id;
        delete userExist._doc.password;

        return res.json({
        data: userExist,
        message: "User login successful",
        token : token
        });
            
  } catch (error) {
    return res.status(error.statusCode || 500).json({message : error.message || "Internal server error"})

  }
};


//User Profile
export const userProfile = async (req, res, next) => {
  try {
        const userId = req.user.id

        const userInfo = await User.findById(userId).select("-password");

        return res.json({data: userInfo,message: "User details Fetched successfully",});

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


//User Logout
export const userLogout = async (req, res, next) => {
  try {
        res.clearCookie("token", {
          sameSite: NODE_ENV === "production" ? "None" : "Lax",
          secure: NODE_ENV === "production",
          httpOnly: NODE_ENV === "production",
        });

        return res.json({message: "User logged out successfully",});
        
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Deactivate User Account
export const deactivateUser = async (req, res, next) => {
  try {
        const userId = req.user.id

        const userInfo = await User.findById(userId).select("-password");
        userInfo.isActive = false
        await userInfo.save()

        return res.json({data: userInfo,message: "Account deleted successfully",});

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Update Password
export const updateUserPassword = async(req,res,next) =>{
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
          return res
            .status(400)
            .json({ message: "Old password and new password are required." });
        }

        const userInfo = await User.findById(userId);
        if (!userInfo) {
          return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, userInfo.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Old password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        userInfo.password = hashedNewPassword;
        await userInfo.save();

        res.status(200).json({message: "Password updated successfully." });

    } catch (error) {
        return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
    }
 };

//Update User Profile
export const updateUserProfile = async(req,res,next) =>{
    try {

        const userId = req.user.id;
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

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: { fname, lname, email, mobile, dob ,profilePic} },
          { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        return res
          .status(200)
          .json({ data : updatedUser ,message: "Profile updated successfully" });
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

export const checkUser = async (req, res, next) => {
  try {
    return res.json({ message: "user autherized" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};