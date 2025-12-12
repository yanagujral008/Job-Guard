const fs = require("fs");
const csv = require("csvtojson");

// Path to your CSV file (adjust path if necessary)
const csvFilePath = "client/public/gfg_courses.csv";
const jsonFilePath = "client/public/gfg_courses.json";

csv()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
    console.log("✅ Done! gfg_courses.json created.");
  })
  .catch((error) => {
    console.error("❌ Error during CSV to JSON conversion:", error);
  });
