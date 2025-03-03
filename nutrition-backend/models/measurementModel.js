const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
    weight: Number,
    height: Number,
    waistCircumference: Number,
    gender: String,
    systolicBP: Number,
    diastolicBP: Number,
    bloodGlucose: Number,
    totalCholesterol: Number,
    hdlCholesterol: Number,
    ldlCholesterol: Number,
    timeAfterMeal: String, // New field for glucose monitoring
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Measurement", MeasurementSchema);
