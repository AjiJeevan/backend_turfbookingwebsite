import { Turf } from "../models/turfModel.js";
import { uploadImage } from "../utils/uploadImage.js";
import mongoose from "mongoose";

//Get All Turf List
export const getAllTurf = async(req,res,next)=>{
    try {
        const turfList = await Turf.find().select("-availability");

        if(!turfList){
            return res.status(404).json({message : "No details found "})
        }
        return res.json({data : turfList , message : "Turf list fetched"})
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

//Get details of a Turf
export const getTurfDetails = async(req,res,next)=>{
    try {

        const turfId = req.params.id
        
        const turfDetails = await Turf.findById(turfId)

        if(!turfDetails){
            return res.status(404).json({message : "Turf not found"})
        }
        return res.json({data : turfDetails , message : "Turf Details fetched"})

    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}


//Add a turf to the list
export const createTurf = async(req,res,next)=>{
    try {

        const {name,location, price,facilities,sportsType,availability,managerId} = req.body;
        let image

        
      // const available = JSON.parse(availability);
      console.log("checking");
        // console.log(available)

        const managerObjectId = new mongoose.Types.ObjectId(managerId);

        if (!name || !location || !price || !availability || !managerObjectId) {
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        if(req.file){
          const imagePath = req.file.path;

          // upload file to cloudinary
          const result = await uploadImage(imagePath);
          image = result.url;
        }
        


        const turfInfo = new Turf({name,location,image,price,facilities,sportsType,availability,managerId :managerObjectId,});
        await turfInfo.save()

        return res.json({data : turfInfo , message : "Turf details added to the database"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

//Update a turf details
export const updateTurf = async(req,res,next)=>{
    try {

        const {turfId,name,location,image,price,facilities,sportsType,availability,managerId,} = req.body;
        if (!turfId && !name && !location && !price && !availability && !managerId) {
          return res.status(204).json({
            message: "Data is not provided",
          });
        }

        const updatedTurf = await Turf.findByIdAndUpdate(
            turfId,
            { $set: {name,location,image,price,facilities,sportsType,availability,managerId,}},
            { new: true, runValidators: true })

        if (!updatedTurf) {
          return res.status(404).json({ message: "Turf not found" });
        }    

        return res.json({data : updatedTurf , message : "Turf details updated successfully"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

// Delete Turf
export const deleteTurf = async (req, res, next) => {
  try {
        const turfId = req.params.id;

        const turfInfo = await Turf.findById(turfId);
        turfInfo.isActive = false
        await turfInfo.save()

        return res.json({data: turfInfo,message: "Turf deleted successfully",});

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};