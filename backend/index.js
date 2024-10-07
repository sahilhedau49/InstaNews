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
// app.post("/create-checkout-session", async (req, res) => {
//   const { credit_count } = req.body;

//   const orderData = {
//     credit_count: credit_count,
//   };

//   const lineItems = [
//     {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           Credit_Count: credit_count,
//         },
//         unit_amount: 50 * 100,
//       },
//       quantity: credit_count,
//     },
//   ];

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     shipping_address_collection: {
//       allowed_countries: ["IN"],
//     },
//     metadata: {
//       data: JSON.stringify(orderData),
//     },
//     phone_number_collection: {
//       enabled: true,
//     },
//     success_url: `${process.env.DOMAIN_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.DOMAIN_URL}/cancel`,
//   });

//   res.json({ id: session.id });
// });

app.listen(PORT, () => {
  console.log("Connected to backend");
});
