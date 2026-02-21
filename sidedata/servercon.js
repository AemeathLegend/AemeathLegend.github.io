const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8009;

app.use(express.json());
app.use(cors());

const config={
    user:'sa',
    password:'Zalan132724?',
    server:'localhost\\SQLServerForTest',
    database:'cardgame',
    options:{
        encrypt: true,
        trustServerCertificates: true
    }
};

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT username, userpassword FROM users WHERE username = @username');

        if (result.recordset.length === 0) {
            return res.json({ ok: false, message: 'User existiert nicht' });
        }

        const user = result.recordset[0];

        const match = await bcrypt.compare(password, user.userpassword);

        if (match) {
            return res.json({ ok: true, message: 'Login erfolgreich', username: user.username });
        } else {
            return res.json({ ok: false, message: 'Falsches Passwort' });
        }

    } catch (err) {
        console.error('Server/DB-Fehler:', err);
        return res.status(500).json({ ok: false, message: 'Serverfehler' });
    }
});
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config);
        const usernumbertwo = await pool.request()
            .query('SELECT * FROM users');
        const usernumber=usernumbertwo.recordset.length
        const existingUser = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT username FROM users WHERE username = @username');

        if (existingUser.recordset.length > 0) {
            return res.json({ ok: false, message: 'Doppelter Name' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input('userid',sql.int, usernumber+1)
            .input('username', sql.VarChar, username)
            .input('userpassword', sql.VarChar, hashedPassword)
            .query('INSERT INTO users (userid,username, userpassword, accountstage) VALUES (@userid, @username, @userpassword, 1)');

        return res.json({ ok: true, message: 'Register Successful', username });

    } catch (err) {
        console.error('Server/DB-Fehler:', err);
        return res.status(500).json({ ok: false, message: 'Serverfehler' });
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

