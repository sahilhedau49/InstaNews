const axios = require("axios");

async function summarizeTextUsingBart(data) {
  const response = await axios.request({
    url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    data: JSON.stringify(data),
  });
  return response.data[0].summary_text;
}

module.exports = summarizeTextUsingBart;
