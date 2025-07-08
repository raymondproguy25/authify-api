import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello from Authify and It's really working.");
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
