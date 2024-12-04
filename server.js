const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'root', 
    database: 'my_database'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.post('/add', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, name, email });
        }
    });
});

app.get('/records', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/record/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else if (results.length === 0) {
            res.status(404).send('Record not found.');
        } else {
            res.status(200).json(results[0]);
        }
    });
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [name, email, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send('Record not found.');
        } else {
            res.status(200).send({ id, name, email });
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send('Record not found.');
        } else {
            res.status(200).send(`Record with id ${id} deleted.`);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
