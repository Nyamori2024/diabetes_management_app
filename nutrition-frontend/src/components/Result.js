import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Grid, Button, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { animateScroll as scroll } from "react-scroll";

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || {};

    // Format result date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString(undefined, options);
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
                    sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem" }, fontWeight: "bold", color: "primary.main" }}
                >
                    Measurement Results
                </Typography>

                {result && result.results ? (
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Result Date: {formatDate(result.createdAt)}</Typography>
                        </Grid>

                        {/* BMI */}
                        <Grid item xs={12}>
                            <Alert severity="info">
                                <Typography variant="h6">BMI</Typography>
                                <Typography>BMI Value: {result.results.bmi?.value || "N/A"}</Typography>
                                <Typography>Category: {result.results.bmi?.category || "N/A"}</Typography>
                            </Alert>
                        </Grid>

                        {/* Waist Circumference */}
                        <Grid item xs={12}>
                            <Alert severity="info">
                                <Typography variant="h6">Waist Circumference</Typography>
                                <Typography>{result.results.waistCircumference || "N/A"}</Typography>
                            </Alert>
                        </Grid>

                        {/* Blood Pressure */}
                        <Grid item xs={12}>
                            <Alert severity="warning">
                                <Typography variant="h6">Blood Pressure</Typography>
                                <Typography>{result.results.bloodPressure || "N/A"}</Typography>
                            </Alert>
                        </Grid>

                        {/* Blood Glucose */}
                        <Grid item xs={12}>
                            <Alert severity={result.results.bloodGlucose === "Abnormal" ? "error" : "success"}>
                                <Typography variant="h6">Blood Glucose</Typography>
                                <Typography>{result.results.bloodGlucose || "N/A"}</Typography>
                            </Alert>
                        </Grid>

                        {/* Cholesterol */}
                        <Grid item xs={12}>
                            <Alert severity="info">
                                <Typography variant="h6">Cholesterol Levels</Typography>
                                <Typography>{result.results.cholesterol || "N/A"}</Typography>
                            </Alert>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="h6" textAlign="center" color="error">
                        No data available. Please try again.
                    </Typography>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, borderRadius: 3, py: 1.5 }}
                    onClick={() => navigate("/")} // Navigate to the measurements form page
                >
                    Go Back
                </Button>
            </Paper>
        </Container>
    );
};

export default Result;