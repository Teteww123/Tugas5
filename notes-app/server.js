const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup database connection
const db = mysql.createConnection({
  host: '34.134.131.194',
  user: 'root',
  password: '', // Password kosong
  database: 'notes_db'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// CRUD Routes
// Create Note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
  db.query(query, [title, content], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Failed to add note' });
      return;
    }
    res.status(201).send({ message: 'Note added successfully' });
  });
});

// Get All Notes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Failed to fetch notes' });
      return;
    }
    res.status(200).json(results);
  });
});

// Get Single Note
app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.query('SELECT * FROM notes WHERE id = ?', [noteId], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Failed to fetch note' });
      return;
    }
    if (result.length === 0) {
      res.status(404).send({ message: 'Note not found' });
      return;
    }
    res.status(200).json(result[0]);
  });
});

// Update Note
app.put('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, noteId], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Failed to update note' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send({ message: 'Note not found' });
      return;
    }
    res.status(200).send({ message: 'Note updated successfully' });
  });
});

// Delete Note
app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.query('DELETE FROM notes WHERE id = ?', [noteId], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Failed to delete note' });
      return;
    }
    res.status(200).send({ message: 'Note deleted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
