import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    CssBaseline,
    IconButton,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DarkMode, LightMode, Menu as MenuIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

// Lazy load components
const MeasurementsForm = lazy(() => import("./components/MeasurementsForm"));
const Result = lazy(() => import("./components/Result"));

const App = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark"; // Load theme from localStorage
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Theme Configurations
    const darkTheme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: { main: darkMode ? "#00d4ff" : "#1976d2" },
            background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
            text: { primary: darkMode ? "#ffffff" : "#000000" },
        },
    });

    // Toggle Dark Mode & Save to LocalStorage
    const handleThemeToggle = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* Normalizes styles & applies theme globally */}
            <Router>
                <Container>
                    {/* Sticky Header */}
                    <AppBar
                        position="sticky" // Makes the header sticky
                        sx={{
                            borderRadius: 2,
                            background: darkMode
                                ? "linear-gradient(90deg, #1e3c72, #2a5298)"
                                : "linear-gradient(90deg, #1976d2, #42a5f5)",
                            mb: 3,
                            zIndex: 1100, // Ensures it stays above other content
                        }}
                        component={motion.div}
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                        <Toolbar
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Logo or Title */}
                            <motion.div
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 5,
                                    color: darkMode ? "#00d4ff" : "#42a5f5",
                                    transition: { duration: 0.3 },
                                }}
                                whileTap={{ scale: 0.9, rotate: -5 }}
                            >
                                <Typography
                                    variant="h6"
                                    component={Link}
                                    to="/"
                                    sx={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        fontWeight: "bold",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    Health Tracker
                                </Typography>
                            </motion.div>

                            {/* Navigation Buttons for Desktop */}
                            <Box
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/"
                                        color="inherit"
                                        sx={{
                                            mx: 1,
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: darkMode
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "rgba(0, 0, 0, 0.1)",
                                            },
                                        }}
                                    >
                                        Measurements
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/result"
                                        color="inherit"
                                        sx={{
                                            mx: 1,
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: darkMode
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "rgba(0, 0, 0, 0.1)",
                                            },
                                        }}
                                    >
                                        Results
                                    </Button>
                                </motion.div>
                            </Box>

                            {/* Mobile Menu Icon */}
                            <IconButton
                                sx={{ display: { xs: "flex", md: "none" } }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                color="inherit"
                                component={motion.div}
                                whileHover={{ rotate: 90 }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Dark Mode Toggle */}
                            <IconButton
                                onClick={handleThemeToggle}
                                color="inherit"
                                component={motion.div}
                                whileHover={{ scale: 1.2 }}
                            >
                                {darkMode ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Toolbar>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <Box
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    flexDirection: "column",
                                    alignItems: "center",
                                    backgroundColor: darkMode
                                        ? "#333"
                                        : "#fff",
                                    color: darkMode ? "#fff" : "#000",
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                }}
                                component={motion.div}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/"
                                        color="inherit"
                                        sx={{
                                            my: 1,
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: darkMode
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "rgba(0, 0, 0, 0.1)",
                                            },
                                        }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Measurements
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/result"
                                        color="inherit"
                                        sx={{
                                            my: 1,
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: darkMode
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "rgba(0, 0, 0, 0.1)",
                                            },
                                        }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Results
                                    </Button>
                                </motion.div>
                            </Box>
                        )}
                    </AppBar>

                    {/* Routes */}
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            <Route path="/" element={<MeasurementsForm />} />
                            <Route path="/result" element={<Result />} />
                        </Routes>
                    </Suspense>
                </Container>
            </Router>
        </ThemeProvider>
    );
};

// Loading component
const Loading = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <CircularProgress size={60} thickness={4} />
    </Box>
);

export default App;