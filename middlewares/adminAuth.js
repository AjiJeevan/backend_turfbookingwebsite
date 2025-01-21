import jwt from "jsonwebtoken"

export const adminAuth = (req,res,next) =>{
    try {
        const {token} = req.cookies;
        
        if(!token){
            return res.status(401).json({message: "Autherization failed",success: false});
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_KEY);
        if(!tokenVerified){
            return res.status(401).json({ message: "Autherization failed", success: false });
        }

        if(tokenVerified.role != "admin"){
            return res.status(401).json({message: `Admin Autherization failed`,success: false});
        }

        req.user = tokenVerified
        next()

    } catch (error) {
        return res.status(401).json({message : error.message || "Admin Autherization failed", success : false})
    }
}