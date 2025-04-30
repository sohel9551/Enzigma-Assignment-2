const express = require('express')
const mysql = require('mysql2')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const babyParser = require('body-parser')

app.use(cors())
app.use(babyParser.json())

db = mysql.createConnection({
    host: 'localhost',
    user: 'W2_86772_Sohel',
    password: 'manager',
    database: 'todo_app'
});

db.connect(err => {
    if (err) {
        console.error('error')
        return;
    }
    console.log('connected')
});

app.get('/api/task', (req, res) => {
    db.query('SELECT * FROM task', (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/task', (req, res) => {
    const { title, assigned_to, status, due_date, priority, comments } = req.body;
    db.query('INSERT INTO task (id, assigned_to, status, due_date, priority, comments) VALUES (?, ?, ?, ?, ?, ?)', [title, assigned_to, status, due_date, priority, comments], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: results.insertId, title, completed: false });
    });
});

app.put('/api/task/:id', (req, res) => {
    const { id } = req.params;
    const { status, due_date } = req.body;
    db.query('UPDATE task SET status = ?, due_date = ? WHERE id = ?', [status, due_date, id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ id, title, completed });
    });
});

app.delete('/api/task/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM task WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});