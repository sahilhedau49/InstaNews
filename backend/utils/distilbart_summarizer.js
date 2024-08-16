const axios = require("axios");

async function summarizeTextUsingDistilBart(data) {
  const response = await axios.request({
    url: "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    data: JSON.stringify(data),
  });
  return response.data[0].summary_text;
}

module.exports = summarizeTextUsingDistilBart;
