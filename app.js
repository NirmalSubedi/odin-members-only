import express from "express";

const app = express();

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App running on port 3000");
});
