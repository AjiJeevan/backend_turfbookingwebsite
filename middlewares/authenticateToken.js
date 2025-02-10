import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    // const token = req.header("Authorization")?.split(" ")[1];
    const { token } = req.cookies;
    console.log(token)
    if (!token)
        return res.status(401).json({ message: "No Token, Access Denied" , success : false });

  try {
      const verified = jwt.verify(token, process.env.JWT_KEY);
      if (! verified) {
          return res
            .status(401)
            .json({ message: "User Autherization failed", success: false });
      }
      if (verified.role == "user") {
          req.user = verified; // Add user info to request
          return res.json({message : "Valid token", success : true})
      }
  } catch (err) {
    res
      .status(403)
      .json({ message: "Invalid or expired token", success: false });
  }
};
