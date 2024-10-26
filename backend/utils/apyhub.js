const axios = require("axios");

async function summarizeUsingApyhub(data) {
  const response = await axios.request({
    url: "https://api.apyhub.com/ai/summarize-text",
    headers: {
      "apy-token":
        "APY0mJXX8aeChBPPZub6aMM6gm1onLOcXqmyoPvV0Vz5Yafs5CsABRuaD9UCUYJXHwm",
      "Content-Type": "application/json",
    },
    method: "POST",
    data: {
      text: data,
      summary_length: "long",
    },
  });
  return response.data.data.summary;
}

module.exports = summarizeUsingApyhub;
