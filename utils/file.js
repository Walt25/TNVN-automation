const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

class File {
  getEmailFromCSV = async () => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(path.resolve(__dirname, "../assets/emails.csv"))
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", () => {
          if (results.length > 0) {
            const emails = results.map((item) => item.Email);
            resolve(emails);
          } else {
            reject(new Error("No emails found in CSV file"));
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  };

  writeAccountsToCSV = async (accountsArray) => {
    const csvData = accountsArray
      .map((item) => `${item.email},${item.password}`)
      .join("\n");

    return new Promise((resolve, reject) => {
      fs.appendFile(
        path.resolve(__dirname, "../assets/accounts.csv"),
        csvData + "\n",
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  };
}

module.exports = new File();
