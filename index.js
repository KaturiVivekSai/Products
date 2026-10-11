const express = require("express");
const dotenv = require("dotenv");

// 1. MUST BE CALLED BEFORE ANY OTHER LOCAL CONFIGURATIONS
dotenv.config();

const connectDB = require("./config/db");   
const productsRoutes = require("./routes/Product");
const errHandler = require("./middleware/errHandler");
const authRoutes = require("./routes/auth");

const app = express();

// 2. This will fall back to 4000 if your .env isn't loading properly
const PORT = process.env.PORT || 4000; 

app.use(express.json());

app.use((req,res,next) => {
    console.log(req.url);
    console.log(req.method);
    next();
})

app.get("/", (req, res) => {
    res.status(200).json({ message: "working" });
});

app.use("/products", productsRoutes);
app.use("/auth", authRoutes);

app.use((req,res) => {
    res.status(404).json({
        message : "Page Not Found"
    })
})

app.use(errHandler);

app.listen(PORT, () => {
    connectDB();
    console.log("Server listening on port http://localhost:" + PORT);
});
