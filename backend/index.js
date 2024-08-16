require("dotenv").config();
const express = require("express");
const cors = require("cors");
const summarizeTextUsingBart = require("./utils/bart_summarizer.js");
const summarizeTextUsingDistilBart = require("./utils/distilbart_summarizer.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Welcome to InstaNews Backend.");
});

app.post("/summarize/bart-large-cnn", (req, res) => {
  const text = req.body.text_to_summarize;

  summarizeTextUsingBart(text)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/summarize/distilbart-cnn-12-6", (req, res) => {
  const text = req.body.text_to_summarize;

  summarizeTextUsingDistilBart(text)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.listen(PORT, () => {
  console.log("Connected to backend");
});
