const mongoose = require("mongoose");
const Measurement = require("../models/measurementModel");

// Compute BMI
const calculateBMI = (weight, height) => {
    if (weight <= 0 || height <= 0 || height > 3) { // height in meters
        return { value: "N/A", category: "Invalid input for weight or height" };
    }

    const bmi = (weight / (height ** 2)).toFixed(1); // height in meters
    if (bmi < 18.5) return { value: bmi, category: "Underweight - Clinical complications" };
    if (bmi >= 18.5 && bmi <= 24.9) return { value: bmi, category: "Normal - Average" };
    if (bmi >= 25 && bmi <= 29.9) return { value: bmi, category: "Pre-obese - Increased" };
    if (bmi >= 30 && bmi <= 34.9) return { value: bmi, category: "Obese class 1 - Moderate" };
    if (bmi >= 35 && bmi <= 39.9) return { value: bmi, category: "Obese class 2 - Severe" };
    if (bmi >= 40) return { value: bmi, category: "Obese class 3 - Very Severe" };
    return { value: bmi, category: "Invalid BMI range" };
};

// Waist Circumference Analysis
const analyzeWaistCircumference = (gender, waistCircumference) => {
    if (!waistCircumference || waistCircumference <= 0) {
        return "Invalid waist circumference. It must be a positive number.";
    }

    if (gender === "male" || gender === "Male") {
        if (waistCircumference < 94) return "Desired weight";
        if (waistCircumference >= 94 && waistCircumference <= 102) return "Health risk - Aim to lose weight";
        return "High health risk - Must lose weight";
    } else if (gender === "female" || gender === "Female") {
        if (waistCircumference < 80) return "Desired weight";
        if (waistCircumference >= 80 && waistCircumference <= 88) return "Health risk - Aim to lose weight";
        return "High health risk - Must lose weight";
    } else {
        return "Invalid gender. Please provide 'male' or 'female'.";
    }
};

// Blood Pressure Analysis
const analyzeBloodPressure = (systolic, diastolic) => {
    if (systolic <= 0 || diastolic <= 0) {
        return "Invalid blood pressure values. Both must be positive numbers.";
    }

    if (systolic < 120 && diastolic < 80) return "Normal blood pressure - Maintain or adopt a healthy lifestyle.";
    if ((systolic >= 120 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        return "Prehypertension - Adopt a healthy lifestyle to reduce to normal blood pressure.";
    }
    if ((systolic >= 140 && systolic <= 159) || (diastolic >= 90 && diastolic <= 99)) {
        return "Stage 1 hypertension - Maintain or adopt a healthy lifestyle. If blood pressure goal isn't reached in about six months, talk to your doctor about taking one or more medications.";
    }
    if (systolic >= 160 || diastolic >= 100) {
        return "Stage 2 hypertension - Maintain or adopt a healthy lifestyle. Talk to your doctor about taking more than one medication.";
    }
    return "Invalid blood pressure range.";
};

// Blood Glucose Analysis
const analyzeBloodGlucose = (glucose, timeAfterMeal) => {
    if (glucose <= 0) {
        return "Invalid blood glucose value. It must be a positive number.";
    }

    const validTimes = ["fasting", "1 hour", "2 hours", "3 hours", "4 hours", "5 hours"];
    if (!validTimes.includes(timeAfterMeal)) {
        return "Invalid time after meal. Please provide a valid option.";
    }

    const ranges = {
        fasting: [3.5, 5],
        "1 hour": [6, 9],
        "2 hours": [7, 10],
        "3 hours": [6, 9],
        "4 hours": [4.5, 8],
        "5 hours": [3.5, 5],
    };

    const [min, max] = ranges[timeAfterMeal];
    return glucose >= min && glucose <= max ? "Normal" : "Abnormal";
};

// Cholesterol Analysis
const analyzeCholesterol = (totalCholesterol, hdlCholesterol, ldlCholesterol) => {
    if (totalCholesterol <= 0 || hdlCholesterol <= 0 || ldlCholesterol <= 0) {
        return "Invalid cholesterol values. All must be positive numbers.";
    }

    const totalStatus = totalCholesterol < 200 ? "Desirable total cholesterol" : "High total cholesterol";
    const hdlStatus = hdlCholesterol >= 40 ? "Normal HDL cholesterol" : "Low HDL cholesterol";
    const ldlStatus = ldlCholesterol < 100 ? "Optimal LDL cholesterol" : "High LDL cholesterol";

    return `${totalStatus}. ${ldlStatus}. ${hdlStatus}.`;
};

// Save Measurements & Return Analysis
exports.saveMeasurements = async (req, res) => {
    try {
        const { weight, height, gender, waistCircumference, systolicBP, diastolicBP, bloodGlucose, timeAfterMeal, totalCholesterol, hdlCholesterol, ldlCholesterol } = req.body;

        // Input validation
        if (!weight || !height || !gender || !waistCircumference || !systolicBP || !diastolicBP || !bloodGlucose || !timeAfterMeal || !totalCholesterol || !hdlCholesterol || !ldlCholesterol) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log(`Received data: Weight=${weight}, Height=${height}, Gender=${gender}, Waist Circumference=${waistCircumference}, Systolic BP=${systolicBP}, Diastolic BP=${diastolicBP}, Blood Glucose=${bloodGlucose}, Time After Meal=${timeAfterMeal}, Total Cholesterol=${totalCholesterol}, HDL Cholesterol=${hdlCholesterol}, LDL Cholesterol=${ldlCholesterol}`);

        const results = {
            bmi: calculateBMI(weight, height),
            waistCircumference: analyzeWaistCircumference(gender, waistCircumference),
            bloodPressure: analyzeBloodPressure(systolicBP, diastolicBP),
            bloodGlucose: analyzeBloodGlucose(bloodGlucose, timeAfterMeal),
            cholesterol: analyzeCholesterol(totalCholesterol, hdlCholesterol, ldlCholesterol),
        };

        const measurement = new Measurement({
            ...req.body,
            results,
            createdAt: new Date() // Ensure createdAt is set
        });
        await measurement.save();

        res.status(201).json({ message: "Measurements saved successfully", results, createdAt: measurement.createdAt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Measurement (Fixed ID Validation)
exports.deleteMeasurement = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const deletedMeasurement = await Measurement.findByIdAndDelete(id);
        if (!deletedMeasurement) {
            return res.status(404).json({ message: "Measurement not found" });
        }

        res.json({ message: "Measurement deleted successfully" });
    } catch (error) {
        console.error("Error deleting measurement:", error);
        res.status(500).json({ message: "Server error while deleting measurement" });
    }
};

// Fetch History of Measurements
exports.getHistoryOfResults = async (req, res) => {
    try {
        const measurements = await Measurement.find().sort({ createdAt: -1 });
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch Latest Analysis Results
exports.getLatestResults = async (req, res) => {
    try {
        const latestMeasurement = await Measurement.findOne().sort({ createdAt: -1 });
        if (!latestMeasurement) return res.status(404).json({ message: "No measurements found" });

        const results = {
            bmi: calculateBMI(latestMeasurement.weight, latestMeasurement.height),
            waistCircumference: analyzeWaistCircumference(latestMeasurement.gender, latestMeasurement.waistCircumference),
            bloodPressure: analyzeBloodPressure(latestMeasurement.systolicBP, latestMeasurement.diastolicBP),
            bloodGlucose: analyzeBloodGlucose(latestMeasurement.bloodGlucose, latestMeasurement.timeAfterMeal),
            cholesterol: analyzeCholesterol(latestMeasurement.totalCholesterol, latestMeasurement.hdlCholesterol, latestMeasurement.ldlCholesterol),
        };

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};