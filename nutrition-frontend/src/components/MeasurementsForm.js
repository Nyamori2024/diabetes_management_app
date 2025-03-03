import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    MenuItem,
    Snackbar,
    Alert,
    Container,
    Typography,
    Paper,
    Grid,
    InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HeightIcon from "@mui/icons-material/Height";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { animateScroll as scroll } from "react-scroll";

const MeasurementsForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        weight: "", height: "", waistCircumference: "", gender: "",
        systolicBP: "", diastolicBP: "", bloodGlucose: "", totalCholesterol: "", hdlCholesterol: "", ldlCholesterol: "", timeAfterMeal: ""
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = () => {
        return Object.values(formData).every(value => value !== "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            setError(true);
            return;
        }

        // Convert height from cm to meters for BMI calculation
        const formDataWithConvertedHeight = {
            ...formData,
            height: formData.height / 100
        };

        try {
            const response = await fetch("/api/measurements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataWithConvertedHeight),
            });

            if (!response.ok) {
                throw new Error("Failed to save measurements");
            }

            const data = await response.json();
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate("/result", { state: { result: data } });
                scroll.scrollToTop({ duration: 500 }); // Scroll to top with animation
            }, 1500);
        } catch (error) {
            console.error("Error saving measurements", error);
        }
    };

    // Scroll to top on component mount
    useEffect(() => {
        scroll.scrollToTop({ duration: 500 });
    }, []);

    return (
        <Container
            maxWidth="md"
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
                <Typography
                    variant="h5"
                    textAlign="center"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1.8rem", sm: "2.2rem" },
                        fontWeight: "bold",
                        color: "primary.main",
                    }}
                    component={motion.h5}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Health Measurements
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Physical Measurements */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "primary.main" }}>
                                Physical Measurements
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FitnessCenterIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={error && !formData.weight}
                                helperText={error && !formData.weight ? "Required" : ""}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Height (cm)"
                                name="height"
                                type="number"
                                value={formData.height}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HeightIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={error && !formData.height}
                                helperText={error && !formData.height ? "Required" : ""}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Waist Circumference (cm)"
                                name="waistCircumference"
                                type="number"
                                value={formData.waistCircumference}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FavoriteIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={error && !formData.waistCircumference}
                                helperText={error && !formData.waistCircumference ? "Required" : ""}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            />
                        </Grid>

                        {/* Gender */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                error={error && !formData.gender}
                                helperText={error && !formData.gender ? "Required" : ""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {formData.gender === "male" ? <MaleIcon /> : <FemaleIcon />}
                                        </InputAdornment>
                                    ),
                                }}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Blood Pressure */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "primary.main" }}>
                                Blood Pressure
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Systolic BP (mmHg)"
                                name="systolicBP"
                                type="number"
                                value={formData.systolicBP}
                                onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><MonitorHeartIcon /></InputAdornment> }}
                                error={error && !formData.systolicBP}
                                helperText={error && !formData.systolicBP ? "Required" : ""}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Diastolic BP (mmHg)"
                                name="diastolicBP"
                                type="number"
                                value={formData.diastolicBP}
                                onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><BloodtypeIcon /></InputAdornment> }}
                                error={error && !formData.diastolicBP}
                                helperText={error && !formData.diastolicBP ? "Required" : ""}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            />
                        </Grid>

                        {/* Cholesterol & Glucose */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "primary.main" }}>
                                Blood & Cholesterol Levels
                            </Typography>
                        </Grid>
                        {["bloodGlucose", "totalCholesterol", "hdlCholesterol", "ldlCholesterol"].map((name, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <TextField
                                    fullWidth
                                    label={name.replace(/([A-Z])/g, " $1").trim()}
                                    name={name}
                                    type="number"
                                    value={formData[name]}
                                    onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><HealthAndSafetyIcon /></InputAdornment> }}
                                    error={error && !formData[name]}
                                    helperText={error && !formData[name] ? "Required" : ""}
                                    component={motion.div}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                />
                            </Grid>
                        ))}

                        {/* Time After Meal */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Time After Meal"
                                name="timeAfterMeal"
                                value={formData.timeAfterMeal}
                                onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon /></InputAdornment> }}
                                error={error && !formData.timeAfterMeal}
                                helperText={error && !formData.timeAfterMeal ? "Required" : ""}
                                component={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <MenuItem value="fasting">Fasting</MenuItem>
                                <MenuItem value="1 hour">1 hour</MenuItem>
                                <MenuItem value="2 hours">2 hours</MenuItem>
                                <MenuItem value="3 hours">3 hours</MenuItem>
                                <MenuItem value="4 hours">4 hours</MenuItem>
                                <MenuItem value="5 hours">5 hours</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ mt: 3, borderRadius: 3, py: 1.5 }}
                        disabled={!isFormValid()}
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Save Measurements
                    </Button>
                </form>
            </Paper>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Measurements saved successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MeasurementsForm;