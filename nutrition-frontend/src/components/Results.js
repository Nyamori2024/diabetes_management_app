import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, CircularProgress, Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Results = () => {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch results from the API
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch("https://diabetes-management-app-lxa7.onrender.com/api/measurements/history");
                if (!response.ok) throw new Error("Failed to fetch results");
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
                setError("Failed to load results. Please try again later.");
            }
        };
        fetchResults();
    }, []);

    
    // Navigate to detailed result view
    const handleViewDetails = (result) => {
        navigate("/result", { state: { result } });
    };

    if (error) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!results) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading Results...
                </Typography>
            </Container>
        );
    }

    if (results.length === 0) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6">
                    No results found. Please add some measurements.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
                History of Results
            </Typography>

            <Grid container spacing={3}>
                {results.map((result, index) => (
                    <Grid item xs={12} key={result._id}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: index === 0 ? "primary.light" : "background.paper",
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                Result #{index + 1} - {new Date(result.createdAt).toLocaleString()}
                            </Typography>

                            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                                <li><strong>Weight:</strong> {result.weight || "N/A"} kg</li>
                                <li><strong>Height:</strong> {result.height ? (result.height / 100).toFixed(2) : "N/A"} m</li>
                                <li><strong>Gender:</strong> {result.gender || "N/A"}</li>
                                <li><strong>Blood Glucose:</strong> {result.bloodGlucose || "N/A"} mmol/L</li>
                                <li><strong>Total Cholesterol:</strong> {result.totalCholesterol || "N/A"} mg/dL</li>
                                <li><strong>HDL Cholesterol:</strong> {result.hdlCholesterol || "N/A"} mg/dL</li>
                                <li><strong>LDL Cholesterol:</strong> {result.ldlCholesterol || "N/A"} mg/dL</li>
                                {/* Adding Blood Pressure */}
                                <li><strong>Blood Pressure:</strong> {result.results?.bloodPressure || "N/A"}</li>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ mt: 2, mr: 2 }}
                                onClick={() => handleViewDetails(result)}
                            >
                                View Details
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() => handleDelete(result._id)}
                            >
                                Delete
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Results;