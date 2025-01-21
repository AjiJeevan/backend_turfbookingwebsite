import jwt from "jsonwebtoken"

export const managerAuth = (req,res,next) =>{
    try {
        const {token} = req.cookies;
        
        if(!token){
            return res.status(401).json({message: "Autherization failed",success: false});
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_KEY);
        if(!tokenVerified){
            return res.status(401).json({ message: "Autherization failed", success: false });
        }

        if(tokenVerified.role != "manager"){
            return res.status(401).json({message: `manager Autherization failed`,success: false});
        }

        req.user = tokenVerified
        next()

    } catch (error) {
        return res.status(401).json({message : error.message || "Manager Autherization failed", success : false})
    }
}