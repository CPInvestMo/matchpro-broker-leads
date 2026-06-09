const cron = require("node-cron");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

// Define Excel generation logic
const generateLeadsReport = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Leads Insights");

  worksheet.columns = [
    { header: "Lead Type", key: "type", width: 20 },
    { header: "Phone Number", key: "phone", width: 25 },
    { header: "Message", key: "msg", width: 50 },
    { header: "Confidence (AI)", key: "confidence", width: 15 }
  ];

  // Mock lead data (replace with actual DB-query in production)
  worksheet.addRows([
    { type: "Demand", phone: "+201011234567", msg: "شقة في مدينتي", confidence: "87%" },
    { type: "Supply", phone: "+201098765432", msg: "شقة 3 غرف - مدينتي 4000 ج.م", confidence: "90%" }
  ]);

  const filePath = path.join(__dirname, "reports", `LeadsReport-${Date.now()}.xlsx`);
  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`✨ Leads Excel report saved to: ${filePath}`);
  } catch (error) {
    console.error("❌ Failed to save leads report!", error);
  }
};

// Schedule reports every 6 hours
cron.schedule("0 */6 * * *", generateLeadsReport);
console.log("⏰ Leads Excel report generation runs every 6 hours.");