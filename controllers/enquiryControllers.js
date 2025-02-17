import { Enquiry } from "../models/enquiryModel.js"
import mongoose from 'mongoose'

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

// Get All Enquiry
export const getAllEnquiry = async (req,res,next) => {
  try {
    const enquiryList = await Enquiry.find().sort({date : 1});
    
            if(!enquiryList){
                return res.status(404).json({message : "No enquiries found "})
            }
            return res.json({data : enquiryList , message : "Enquiry list fetched"})
    
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}


// Delete Enquiry
export const deleteEnquiry = async (req, res, next) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid enquiry ID' });
    }

    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.status(200).json({ data : enquiry, message: 'Enquiry deleted successfully' });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}


// Update Enquiry
export const sendReply = async (req, res, next) => {
  try {
    
    const id = req.params.id
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ message: 'No message to send' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid enquiry ID' });
    }

    const enquiry = await Enquiry.findById(id)
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    //Code to send mail

    enquiry.replyMessage = message || enquiry.replyMessage;
    enquiry.status = "replied"

    await enquiry.save();
    res.status(200).json({ data : enquiry, message: 'Replay sent successfully' });
    
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}