const fs = require("fs");
const csv = require("csvtojson");

csv()
  .fromFile("data/remoteok_jobs.csv")
  .then((jsonArray) => {
    fs.writeFileSync("data/jobs.json", JSON.stringify(jsonArray, null, 2));
    console.log("✅ Done! jobs.json created.");
  });