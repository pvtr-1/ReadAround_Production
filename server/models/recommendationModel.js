const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
    recommended_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recommended_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    created_at: { type: Date, default: Date.now }
  });

module.exports = mongoose.model("recommendation", recommendationSchema);