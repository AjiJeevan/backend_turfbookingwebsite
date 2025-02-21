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
              message: "All fields are required.",
            });
        }
        
        const turf = await Turf.findById(turfId)
        if(!turf){
            return res.status(404).json({ message: "Turf not found." });
        }

        const newReview = new Review({turfId,userId,rating,comment})
        await newReview.save()
      
        const reviews = await Review.find({ turfId });

      const averageRating = reviews.length > 0 ?
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      turf.rating = averageRating;
      await turf.save()

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
        message: "All fields are empty.",
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

    const reviews = await Review.find({ turfId });
    const averageRating = reviews.length > 0 ?
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      turf.rating = averageRating;
    await turf.save()
    
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
    const {reviewId, turfId} = req.body;
    const userId = req.user.id;

    if (!reviewId) {
      console.log(slot.endtTime);
      return res.status(400).json({
        message: "Review Id is Empty",
      });
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found." });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId)
    if (!deleteReview) {
        return res.status(404).json({ message: "Error in deleting review." });
    }

    const reviews = await Review.find({ turfId });
    const averageRating = reviews.length > 0 ?
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    turf.rating = averageRating;
    await turf.save()

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


// get reviews of a turf for user
export const getTurfReview = async (req, res, next) => {
  try {
    const turfId = req.params.id
    const userId = req.user.id

    if (!turfId) {
      return res.status(400).json({
        message: "Please provide Turf Id.",
      });
    }

    const review = await Review.findOne({turfId,userId ,isActive : true});
    // if (!review) {
    //   return res.status(404).json({ message: "No reviews found" });
    // }

    return res.json({ data: review, message: "Reviews of Turf fetched successfully" });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Avarage rating of a turf
export const getTurfRating = async (req, res,next) => {
  try {
    const turfId = req.params.id;

    const reviews = await Review.find({ turfId });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return res.json({
      data: {
        reviews,
        averageRating: averageRating.toFixed(1),
        reviewCount: reviews.length,
      }, message: "Rating fetched"
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




