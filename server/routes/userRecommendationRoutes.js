const express = require("express");

const UserRecommendation = require("../models/recommendationModel");

const User = require("../models/userModel");
const Book = require("../models/bookModel");

const router = express.Router();

router.post("/recommend", async (req, res) => {

    const { from_user, to_user, book_id } = req.body;

    if (!from_user || !to_user || !book_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Verify if users and book exist
        const sender = await User.findById(from_user);
        const recipient = await User.findById(to_user);
        const book = await Book.findById(book_id);

        if (!sender || !recipient || !book) {
            return res.status(404).json({ message: "User or book not found" });
        }

        // Save recommendation
        const recommendation = new UserRecommendation({
            recommended_by: from_user,
            recommended_to: to_user,
            book_id,
        });

        await recommendation.save();
        res.status(201).json({ message: "Book recommended successfully!", recommendation });
    } catch (error) {
        console.error("Error recommending book:", error);
        res.status(500).json({ message: "Server error", error });
    }

});

router.get("/recommendations/:user_id", async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const recommendations = await UserRecommendation.find({ recommended_to: user_id })
            .populate("book_id")
            .populate("recommended_by");

        res.status(200).json({
            message: "Recommendations fetched successfully",
            recommendations: recommendations.map((rec) => ({ 
                id: rec._id,
                book: rec.book_id,
                recommended_by: rec.recommended_by,
            }))
        })
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


router.delete("/recommendations/:recommendation_id", async (req, res) => {
    const  recommendation_id  = req.params.recommendation_id;

    if (!recommendation_id) {
        return res.status(400).json({ message: "Recommendation ID is required" });
    }

    try {
        const recommendation = await UserRecommendation.findByIdAndDelete(recommendation_id);

        if (!recommendation) {
            return res.status(404).json({ message: "Recommendation not found" });
        }

        res.status(200).json({ message: "Recommendation deleted successfully" });
    } catch (error) {
        console.error("Error deleting recommendation:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
module.exports = router;

