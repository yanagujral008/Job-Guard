const fs = require("fs");
const csv = require("csvtojson");

csv()
  .fromFile("client/public/remoteok_companies.csv")
  .then((jsonArray) => {
    fs.writeFileSync("data/companies.json", JSON.stringify(jsonArray, null, 2));
    console.log("✅ Done! companies.json created.");
  });
