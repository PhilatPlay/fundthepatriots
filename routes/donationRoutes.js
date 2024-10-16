const express = require('express');
const { createCheckoutSession, handleStripeWebhook, getDonations } = require('../controllers/donationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create-checkout-session', auth, createCheckoutSession);
// router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.get('/', getDonations);

module.exports = router;



