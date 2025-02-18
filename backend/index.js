const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});