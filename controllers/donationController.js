const Donation = require('../models/Donation');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const dotenv = require('dotenv');
let tempDon = [];

exports.createCheckoutSession = async (req, res) => {
    const { donations } = req.body;
    try {
        const lineItems = await Promise.all(donations.map(async (donation) => {
            tempDon.push(donation);
            const candidate = await Candidate.findById(donation.candidateId);
            if (!candidate) {
                throw new Error('Candidate not found');
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: candidate.name,
                    },
                    unit_amount: donation.amount * 100, // amount in cents
                },
                quantity: 1,
            };
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success/?userId=${req.user.id}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                donations: JSON.stringify(donations.map(donation => ({
                    candidate: donation.candidate,
                    user: donation.username,
                    amount: donation.amount
                })))
            }
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error('Error creating checkout session:', err.message);
        res.status(500).json(err.message);
    }
};

exports.temporaryCheckout = async (req, res, next) => {
    const { userId } = req.query

    let user = await User.findById(userId);

    if (tempDon.length == 0) return next();

    try {
        tempDon.forEach(async function (temp) {
            const candidate = await Candidate.findById(temp.candidateId);
            if (candidate) {
                candidate.total_donations += temp.amount;
                await candidate.save();

                const newDonation = new Donation({
                    user: user.username,
                    candidate: candidate.name,
                    amount: temp.amount
                });
                await newDonation.save();
            }
        })
        tempDon = [];
    }
    catch (err) {
        console.error('Error saving donation:', err.message);
    }
    next();
}

exports.getDonations = async (req, res) => {
    // no reason to populate the user field
    try {
        const donations = await Donation.find().populate('candidate');
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// exports.handleStripeWebhook = async (req, res) => {
//     const sig = req.headers['stripe-signature'];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//       console.log('Event:', event);
//     } catch (err) {
//       console.error('Webhook error:', err.message);
//       return res.status(400).send(`Webhook error: ${err.message}`);
//     }

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       const donations = JSON.parse(session.metadata.donations);

//       try {
//         await Promise.all(donations.map(async (donation) => {
//           const candidate = await Candidate.findById(donation.candidateId);
//           if (candidate) {
//             candidate.total_donations += donation.amount;
//             await candidate.save();
//             .log('Updated Candidate:', candidate);

//             const newDonation = new Donation({
//               user: donation.userId,
//               candidate: donation.candidateId,
//               amount: donation.amount,
//             });

//             await newDonation.save();
//             console.log('New Donation:', newDonation);
//           }
//         }));
//       } catch (err) {
//         console.error('Error saving donation:', err.message);
//       }
//     }

//     res.json({ received: true });
//   };


