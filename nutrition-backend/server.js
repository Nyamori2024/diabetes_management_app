const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const measurementRoutes = require('./routes/measurementRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/measurements', measurementRoutes);

const PORT = process.env.PORT || 5000;

// Ensure the database connects before starting the server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});