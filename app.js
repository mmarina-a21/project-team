const express = require('express');
const multer = require('multer');
const sql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

var config = {
    server: "DESKTOP-HRUD03R",
    authentication: {
        type: "default",
        options: {
            userName: "Kristian Pando",
            password: "1234",
            domain: "localhost"
        }
    },
    options: {
        database: "Team Project",
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

sql.connect(config).then(pool => {
    console.log("Connected to SQL");
}).catch(err => {
    console.error("Error connecting to SQL:", err);
});

const { getUserByUsername, createUser, login } = require('./users');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await login(username, password);
        if (result.success) {
            res.send({ success: true, message: 'Logged in successfully', user: result.username, email: result.email });
        } else {
            res.status(401).send({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ success: false, message: 'Server error during login' });
    }
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
      await createUser(username, email, password);
      res.send({ success: true, message: 'User created successfully' });
  } catch (error) {
      console.error('Signup error:', error);
      res.status(500).send({ success: false, message: 'Server error during signup' });
  }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

app.post('/upload-profile-picture', upload.single('profilePic'), async (req, res) => {
    const username = req.body.username;  // Ensure 'username' is being sent correctly
    const profilePicUrl = `uploads/${req.file.filename}`;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('Username', sql.VarChar, username)
            .input('ProfilePictureURL', sql.VarChar, profilePicUrl)
            .query('UPDATE Profile SET ProfilePictureURL = @ProfilePictureURL WHERE Username = @Username');

        res.json({ success: true, message: 'Profile picture uploaded successfully', url: profilePicUrl });
    } catch (error) {
        console.error('Failed to upload profile picture:', error);
        res.status(500).json({ success: false, message: 'Failed to upload profile picture' });
    }
});

app.get('/get-profile-picture', async (req, res) => {
    const username = req.query.username;  // Check this variable in debug

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Username', sql.VarChar, username)
            .query('SELECT ProfilePictureURL FROM Profile WHERE Username = @Username');

        if (result.recordset.length > 0) {
            const profilePicUrl = result.recordset[0].ProfilePictureURL;
            res.json({ success: true, url: profilePicUrl });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Failed to get profile picture:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
