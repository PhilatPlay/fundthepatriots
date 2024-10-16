const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    picture: { type: String },
    total_donations: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
});

const Candidate = mongoose.model('Candidate', CandidateSchema);
module.exports = Candidate;

