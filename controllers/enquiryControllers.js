import { Enquiry } from "../models/enquiryModel.js";

export const newEnquiry = async (req, res, next) => {
    try {
        const { email,enquiry } = req.body;
        
                if(!email && !enquiry){
                    return res.status(400).json({
                      message: "All fields are required.",
                    });
                }
        
                const newEnquiry = new Enquiry({email,enquiry})
                await newEnquiry.save()
                return res.json({data : newEnquiry,"message": "Enquiry sent successfully."})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}