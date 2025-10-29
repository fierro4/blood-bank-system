const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'blood_bank_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// ============= DONOR ROUTES =============

// Get all donors
app.get('/api/donors', (req, res) => {
  const query = 'SELECT * FROM donor ORDER BY Created_At DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get single donor
app.get('/api/donors/:id', (req, res) => {
  const query = 'SELECT * FROM donor WHERE Donor_ID = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json(results[0]);
  });
});

// Add new donor
app.post('/api/donors', (req, res) => {
  const { name, dob, gender, bloodGroup, contact, address } = req.body;
  const query = 'CALL sp_add_donor(?, ?, ?, ?, ?, ?)';
  
  db.query(query, [name, dob, gender, bloodGroup, contact, address], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Donor added successfully', id: results.insertId });
  });
});

// Update donor
app.put('/api/donors/:id', (req, res) => {
  const { name, dob, gender, bloodGroup, contact, address } = req.body;
  const query = 'CALL sp_update_donor(?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [req.params.id, name, dob, gender, bloodGroup, contact, address], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Donor updated successfully' });
  });
});

// Delete donor
app.delete('/api/donors/:id', (req, res) => {
  const query = 'CALL sp_delete_donor(?)';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Donor deleted successfully' });
  });
});

// ============= RECIPIENT ROUTES =============

// Get all recipients
app.get('/api/recipients', (req, res) => {
  const query = 'SELECT * FROM recipient ORDER BY Created_At DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add new recipient
app.post('/api/recipients', (req, res) => {
  const { name, age, bloodGroup, hospital, contact } = req.body;
  const query = 'CALL sp_add_recipient(?, ?, ?, ?, ?)';
  
  db.query(query, [name, age, bloodGroup, hospital, contact], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Recipient added successfully' });
  });
});

// Update recipient
app.put('/api/recipients/:id', (req, res) => {
  const { name, age, bloodGroup, hospital, contact } = req.body;
  const query = 'CALL sp_update_recipient(?, ?, ?, ?, ?, ?)';
  
  db.query(query, [req.params.id, name, age, bloodGroup, hospital, contact], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Recipient updated successfully' });
  });
});

// Delete recipient
app.delete('/api/recipients/:id', (req, res) => {
  const query = 'CALL sp_delete_recipient(?)';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Recipient deleted successfully' });
  });
});

// ============= BLOOD STOCK ROUTES =============

// Get current blood stock
app.get('/api/blood-stock', (req, res) => {
  const query = `
    SELECT Blood_Group, SUM(Quantity) as Quantity, 
           MIN(Expiry_Date) as Expiry_Date
    FROM blood_stock 
    WHERE Expiry_Date >= CURDATE() AND Quantity > 0
    GROUP BY Blood_Group
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get detailed stock
app.get('/api/blood-stock/detailed', (req, res) => {
  const query = `
    SELECT * FROM blood_stock 
    WHERE Expiry_Date >= CURDATE() AND Quantity > 0
    ORDER BY Blood_Group, Expiry_Date
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============= DONATION ROUTES =============

// Get all donations
app.get('/api/donations', (req, res) => {
  const query = `
    SELECT dr.*, d.Name as Donor_Name, d.Blood_Group
    FROM donation_record dr
    JOIN donor d ON dr.Donor_ID = d.Donor_ID
    ORDER BY dr.Donation_Date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Record new donation
app.post('/api/donations', (req, res) => {
  const { donorId, quantity, date } = req.body;
  const query = 'CALL sp_add_donation(?, ?, ?)';
  
  db.query(query, [donorId, quantity, date], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Donation recorded successfully' });
  });
});

// ============= BLOOD ISSUE ROUTES =============

// Get all blood issues
app.get('/api/issues', (req, res) => {
  const query = `
    SELECT bi.*, r.Name as Recipient_Name, r.Blood_Group, r.Hospital
    FROM blood_issue bi
    JOIN recipient r ON bi.Recipient_ID = r.Recipient_ID
    ORDER BY bi.Issue_Date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Issue blood
app.post('/api/issues', (req, res) => {
  const { recipientId, quantity, staffId } = req.body;
  const query = 'CALL sp_issue_blood(?, ?, ?)';
  
  db.query(query, [recipientId, quantity, staffId || 1], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Blood issued successfully' });
  });
});

// ============= STAFF ROUTES =============

// Get all staff
app.get('/api/staff', (req, res) => {
  const query = 'SELECT Staff_ID, Name, Role, Email, Contact, Created_At FROM staff';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============= DASHBOARD STATS =============

// Get dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  const queries = {
    totalDonors: 'SELECT COUNT(*) as count FROM donor',
    totalRecipients: 'SELECT COUNT(*) as count FROM recipient',
    totalUnits: 'SELECT IFNULL(SUM(Quantity), 0) as count FROM blood_stock WHERE Expiry_Date >= CURDATE()',
    recentDonations: 'SELECT COUNT(*) as count FROM donation_record WHERE Donation_Date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
  };

  const stats = {};
  let completed = 0;

  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, results) => {
      if (!err) {
        stats[key] = results[0].count;
      }
      completed++;
      if (completed === Object.keys(queries).length) {
        res.json(stats);
      }
    });
  });
});

// ============= START SERVER =============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});