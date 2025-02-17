import { Turf } from "../models/turfModel.js";
import { uploadImage } from "../utils/uploadImage.js";
import mongoose from "mongoose";

//Get All Turf List
export const getAllTurf = async(req,res,next)=>{
    try {
        const turfList = await Turf.find({isActive : true});

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
      const turfDetails = await Turf.findById({ _id: turfId }).populate("managerId")

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

      // console.log(location)
        
      const available = JSON.parse(availability);
      // console.log("checking");
      // console.log(available)
      const locationInfo = JSON.parse(location)

        const managerObjectId = new mongoose.Types.ObjectId(managerId);

      if (!name || !location || !price || !available || !managerObjectId) {
          console.log(name, location, price, available, managerObjectId);
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
        


        const turfInfo = new Turf({
          name,
          location: locationInfo,
          image,
          price,
          facilities: facilities.split(","),
          sportsType: sportsType.split(","),
          availability: available,
          managerId: managerObjectId,
        });
      await turfInfo.save()
      // console.log(turfInfo)

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

   
        let {_id,name,location, price,facilities,sportsType,managerId} = req.body;
    let image
    

        // const available = JSON.parse(availability)
        const locationInfo = JSON.parse(location)
        managerId = new mongoose.Types.ObjectId(managerId);
        
        console.log("Checking.......",managerId)

      if (!name || !location || !price  || !managerId) {
          console.log(name, location, price, available);
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
    
    console.log(_id)
     if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid turf ID' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return res.status(400).json({ message: 'Invalid manager Id' });
     }

      const turf = await Turf.findById(_id);
      if (!turf) {
        return res.status(404).json({ message: 'Turf not found' });
      }

    turf.name = name || turf.name;
    turf.location = locationInfo || turf.location;
    turf.image = image || turf.image;
    turf.price = price || turf.price;
    turf.facilities = facilities.split(",") || turf.facilities;
    turf.sportsType = sportsType.split(",") || turf.sportsType;
    // turf.availability = available || turf.availability;
    turf.managerId = managerId || turf.managerId
    // turf.isActive = isActive !== undefined ? isActive : turf.isActive;
    
    await turf.save();
    res.status(200).json({data:turf, message: 'Turf updated successfully'});
        
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
     if (!mongoose.Types.ObjectId.isValid(turfId)) {
       return res.status(400).json({ error: "Invalid Turf ID" });
     }

    // const turfInfo = await Turf.findById(turfId);
    //     turfInfo.isActive = false
    //     await turfInfo.save()

    const deletedTurf = await Turf.findByIdAndDelete(turfId);

    if (!deletedTurf) {
      return res.status(404).json({ error: "Turf not found" });
    }

    res.status(200).json({ message: "Turf deleted successfully" });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

