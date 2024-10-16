const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    user: { type: String, required: true },
    candidate: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;
