const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req,res,next) => {
    console.log(req.method);
    console.log(req.url);
    next();
})

app.get("/", (req,res) => {
    res.send("Home Page!!!!");
})

app.get("/about", (req,res) => {
    res.send("About Page");
})

app.get("/", (req,res) => {
    res.send("Hello World!!");
})
app.get("/api/hello", (req,res) => {
    res.json({
        message: "Hi User",
        status:"OK"
    })
})
app.get("/api/hi", (req,res) => {
    res.status(200).send("Page says hi");
})

app.get("/products/:id", (req,res) => {
    const productId=req.params.id;
    res.status(200).json({
        id:productId
    })
})

app.get("/users/:userId/orders/:orderId", (req,res) => {
    const userid=req.params.userId;
    const orderid=req.params.orderId;
    res.send(`userid: ${userid} and orderid: ${orderid}`);
    res.json(req.params);
})

app.get("/search", (req,res) => {
    res.json(req.query);
})

app.get("/", (req,res) => {
    res.send("Home Page!!!!");
})

app.post("/productspost", (req,res) => {
    console.log(req.body);
    res.json(req.body)
})
app.use((req,res) => {
    res.send("Page Not Found");

})
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})