const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const ExcelJS = require('exceljs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for leads
let leadsData = {
  lastUpdate: null,
  leads: [],
  totalMatches: 0,
  brokerStats: {}
};

// Mock data generator (replace with real API calls)
function generateMockLeads() {
  return {
    lastUpdate: new Date().toISOString(),
    leads: [
      {
        id: 1,
        matchId: 25710009,
        confidence: 76,
        buyer: { name: 'Mohamed Mustafa', phone: '01055093822', budget: '5-7M' },
        seller: { name: 'Hussein', phone: '01234567890', price: '6.5M' },
        property: 'Villa in Madinaty',
        status: 'new',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        matchId: 25710010,
        confidence: 88,
        buyer: { name: 'Ahmed Ali', phone: '01123456789', budget: '3-4M' },
        seller: { name: 'Fatima', phone: '01098765432', price: '3.8M' },
        property: 'Apartment in Sheikh Zayed',
        status: 'contacted',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        matchId: 25710011,
        confidence: 92,
        buyer: { name: 'Sara Mohamed', phone: '01555555555', budget: '8-10M' },
        seller: { name: 'Karim', phone: '01666666666', price: '9.2M' },
        property: 'Luxury Villa in New Cairo',
        status: 'matched',
        createdAt: new Date().toISOString()
      }
    ],
    totalMatches: 65,
    brokerStats: {
      activeLeads: 45,
      closedDeals: 12,
      pendingContacts: 8
    }
  };
}

// Update leads data
async function updateLeads() {
  try {
    leadsData = generateMockLeads();
    console.log(`[${new Date().toISOString()}] Leads updated - ${leadsData.leads.length} leads`);
  } catch (error) {
    console.error('Error updating leads:', error);
  }
}

// Generate Excel report
async function generateExcelReport() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Leads');

  // Headers
  worksheet.columns = [
    { header: '#', key: 'id', width: 5 },
    { header: 'Match ID', key: 'matchId', width: 10 },
    { header: 'Confidence %', key: 'confidence', width: 12 },
    { header: 'Buyer Name', key: 'buyerName', width: 20 },
    { header: 'Buyer Phone', key: 'buyerPhone', width: 15 },
    { header: 'Seller Name', key: 'sellerName', width: 20 },
    { header: 'Seller Phone', key: 'sellerPhone', width: 15 },
    { header: 'Property', key: 'property', width: 30 },
    { header: 'Status', key: 'status', width: 12 }
  ];

  // Add data
  leadsData.leads.forEach((lead, index) => {
    worksheet.addRow({
      id: index + 1,
      matchId: lead.matchId,
      confidence: lead.confidence,
      buyerName: lead.buyer.name,
      buyerPhone: lead.buyer.phone,
      sellerName: lead.seller.name,
      sellerPhone: lead.seller.phone,
      property: lead.property,
      status: lead.status
    });
  });

  // Format headers
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };

  return workbook;
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/leads', (req, res) => {
  res.json(leadsData);
});

app.get('/api/leads/export', async (req, res) => {
  try {
    const workbook = await generateExcelReport();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="MatchPro_Leads_${new Date().toISOString().split('T')[0]}.xlsx"`);
    await workbook.xlsx.write(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalLeads: leadsData.leads.length,
    totalMatches: leadsData.totalMatches,
    brokerStats: leadsData.brokerStats,
    lastUpdate: leadsData.lastUpdate
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Schedule 12-hour updates
cron.schedule('0 */12 * * *', () => {
  console.log('Running 12-hour leads update...');
  updateLeads();
});

// Initial update on startup
updateLeads();

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ MatchPro Broker Leads System running on port ${PORT}`);
  console.log(`📊 API: http://0.0.0.0:${PORT}/api/leads`);
  console.log(`📥 Export: http://0.0.0.0:${PORT}/api/leads/export`);
  console.log(`⏰ Auto-updates every 12 hours`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
