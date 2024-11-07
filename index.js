const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb"); // Ensure this connects to your MongoDB collection

const templatePath = path.join(__dirname, "./templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await collection.findOne({ name: req.body.name });

        if (checking) {
            return res.render("signup");
            // return res.status(400).send("User already exists. Please log in.");
        }

        await collection.insertMany([data]);
        res.render("home");
        // res.status(201).send("Signup successful! Please log in.");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup.");
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({
            name: req.body.name,
            password: req.body.password
        });

        if (user) {
            return res.render("home");
        }
        // res.status(401).send("Invalid credentials. Please try again.");
        return res.render("login");


    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
