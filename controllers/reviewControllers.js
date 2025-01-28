import { Review } from "../models/reviewModel.js";
import { Turf } from "../models/turfModel.js";

// create review
export const createReview = async(req,res,next)=>{
    try {

        const { turfId,rating,comment } = req.body;
        const userId = req.user.id;

        if(!turfId || !userId ||!rating){
            console.log(slot.endtTime);
            return res.status(400).json({
              message: "All fileds are required.",
            });
        }
        
        const turf = await Turf.findById(turfId)
        if(!turf){
            return res.status(404).json({ message: "Turf not found." });
        }

        const newReview = new Review({turfId,userId,rating,comment})
        await newReview.save()
        return res.json({data : newReview,"message": "Review added successfully."})

    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

// update review
export const updateReview = async (req, res, next) => {
  try {
    const { reviewId, turfId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!reviewId && !turfId && !userId && !rating) {
      console.log(slot.endtTime);
      return res.status(400).json({
        message: "All fileds are empty.",
      });
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          turfId,
          userId,
          rating,
          comment
        },
      },
      { new: true, runValidators: true }
    );
    return res.json({
      data: updatedReview,
      message: "Review updated successfully.",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// delete review
export const deleteReview = async (req, res, next) => {
  try {
    const reviewId= req.params.id;
    const userId = req.user.id;

    if (!reviewId) {
      console.log(slot.endtTime);
      return res.status(400).json({
        message: "Review Id is Empty",
      });
    }

    const deletedReview = await Review.findById(reviewId)
    deletedReview.isActive = false
    await deletedReview.save();

    return res.json({
      data: deletedReview,
      message: "Review deletd successfully.",
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


// get reviews of a turf
export const getTurfReview = async (req, res, next) => {
  try {
    const turfId = req.params.id

    if (!turfId) {
      console.log(slot.endtTime);
      return res.status(400).json({
        message: "Please provide Turf Id.",
      });
    }

    const reviewLists = await Review.find({turfId, isActive : true});
    if (!reviewLists) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.json({ data: reviewLists, message: "Reviews of Turf fetched successfully" });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};



