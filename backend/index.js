require("dotenv").config();
const express = require("express");
const cors = require("cors");
const summarizeTextUsingBart = require("./utils/bart_summarizer.js");
const summarizeTextUsingDistilBart = require("./utils/distilbart_summarizer.js");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

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
      console.log(error);
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

app.post("/getContent", (req, res) => {
  const news_url = req.body.news_url;

  axios
    .get(news_url)
    .then(function (result) {
      let dom = new JSDOM(result.data, {
        url: news_url,
      });
      let article = new Readability(dom.window.document).parse();

      res.send({
        news_url: news_url,
        content: article.textContent,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

// Checkout api
app.post("/create-checkout-session", async (req, res) => {
  const { product } = req.body;

  const lineItems = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Credit Purchase",
        },
        unit_amount: 1000,
      },
      quantity: product.credits,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.DOMAIN_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN_URL}/cancel`,
  });

  res.json({ id: session.id });
});

app.listen(PORT, () => {
  console.log("Connected to backend");
});
