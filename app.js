import express from "express";

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("signup"));
app.post("/signup", (req, res) => res.send("post signup"));

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App running on port 3000");
});
