const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const donationRoutes = require('./routes/donationRoutes');
const { temporaryCheckout } = require('./controllers/donationController'); // Import the webhook handler directly
const jwt = require('jsonwebtoken');
const { auth } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const compression = require('compression');

dotenv.config();
connectDB();

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));


app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/donations', donationRoutes);

// Serving static ejs files from the views directory
app.get('/success', temporaryCheckout, (req, res) => {
    res.render(path.join(__dirname, 'views/success.ejs'));
});
app.get('/cancel', (req, res) => {
    res.render(path.join(__dirname, 'views/cancel.ejs'));
});
app.get('/register', (req, res) => {
    res.render(path.join(__dirname, 'views/register.ejs'));
});
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views/login.ejs'));
});
app.get('/index', (req, res) => {
    res.render(path.join(__dirname, 'views/index.ejs'), { user: "I am the user" });
});
app.get('/admin', temporaryCheckout, (req, res) => {
    res.render(path.join(__dirname, 'views/admin.ejs'));
});


// Stripe webhook endpoint
// app.post('/api/donations/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});

