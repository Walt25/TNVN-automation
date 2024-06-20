const axios = require("axios");
const qs = require("qs");
const { JSDOM } = require("jsdom");

class GmailAPI {
  getAccessToken = async () => {
    let data = qs.stringify({
      client_id:
        "395454807-lfb3ab17a97s769ob6bpi7ir7qhhf24h.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token:
        "1//0er0d5O9Bb84NCgYIARAAGA4SNwF-L9Ir5k3io-2lAN10OQOFgrdHOpboYmg5UjDy3sU6uxe3g9i88siFsQa2ZDKNhQXv4RRzbn8",
      grant_type: "refresh_token",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://accounts.google.com/o/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    var accessToken = "";

    await axios(config)
      .then(async (response) => {
        accessToken = await response.data.access_token;
      })
      .catch((error) => {
        console.log(error);
      });
    return accessToken;
  };

  searchEmail = async (searchItem) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=" +
        searchItem,
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    };
    var threadId = "";
    await axios(config)
      .then(async (response) => {
        threadId = await response.data["messages"][0].id;
      })
      .catch((error) => {
        console.log(error);
      });
    return threadId;
  };

  readEmailContent = async (messageId) => {
    var config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    };

    var data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return data;
  };

  readInboxContent = async (searchText) => {
    const threadId = await this.searchEmail(searchText);
    const message = await this.readEmailContent(threadId);
    const encodedMessage = await message.payload["parts"][0].body.data;
    const decodeStr = Buffer.from(encodedMessage, "base64").toString("utf8");
    return decodeStr;
  };

  getOTP = async (searchText) => {
    const decodeStr = await this.readInboxContent(searchText);
    const dom = new JSDOM(decodeStr);
    const doc = dom.window.document;
    // console.log(doc.documentElement.outerHTML);
    const otpElement = doc.querySelector(
      "span[style*=\"font-size:24px;color:#f27d00;font-family:'arial' , 'helvetica' , sans-serif;font-weight:bold\"]"
    );
    console.log(otpElement);
    let otpCode = "";

    if (otpElement) {
      otpCode = otpElement.textContent.trim();
      console.log(`Mã OTP là: ${otpCode}`);
      return otpCode;
    } else {
      console.log("Không tìm thấy mã OTP.");
      return "";
    }
  };
}

module.exports = new GmailAPI();
