const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    spoiler_id: { type: String },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who upvoted
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who downvoted
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { 
    id: true 
});

// Method to upvote a review
reviewSchema.methods.upvote = function(user_id) {
    if (!this.upvotes.includes(user_id)) {
        this.upvotes.push(user_id);
        this.downvotes = this.downvotes.filter(id => id.toString() !== user_id.toString()); // Remove from downvotes if exists
    }
    return this.save();
};

// Method to downvote a review
reviewSchema.methods.downvote = function(user_id) {
    if (!this.downvotes.includes(user_id)) {
        this.downvotes.push(user_id);
        this.upvotes = this.upvotes.filter(id => id.toString() !== user_id.toString()); // Remove from upvotes if exists
    }
    return this.save();
};

module.exports = mongoose.model("Review", reviewSchema);
