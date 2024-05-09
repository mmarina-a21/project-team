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
    console.log('Attempting login for:', username); // Log the attempt to see if the endpoint is hit
    try {
        const result = await login(username, password);
        console.log('Login result:', result); // Log the result of the login function including posts
        if (result.success) {
            console.log('User logged in:', { username: result.username, email: result.email, bio: result.bio, posts: result.posts });
            res.send({ success: true, message: 'Logged in successfully', user: result.username, email: result.email, bio: result.bio, posts: result.posts });
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

app.post('/update-bio', async (req, res) => {
    const { username, bio } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('Username', sql.VarChar, username)
            .input('Bio', sql.VarChar, bio)
            .query('UPDATE Profile SET Bio = @Bio WHERE Username = @Username');

        res.json({ success: true, message: 'Bio updated successfully' });
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).send({ success: false, message: 'Failed to update bio' });
    }
});

app.post('/create-post', async (req, res) => {
    const { username, title, content } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('Username', sql.VarChar, username)
            .input('Title', sql.VarChar, title) // Make sure to handle title
            .input('Content', sql.VarChar, content)
            .query('INSERT INTO Posts (Username, Title, Content, PostedAt) VALUES (@Username, @Title, @Content, GETDATE())');

        res.json({ success: true, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send({ success: false, message: 'Failed to create post' });
    }
});

app.get('/get-posts', async (req, res) => {
    const username = req.query.username;  // Username passed as a query parameter
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Username', sql.VarChar, username)
            .query('SELECT * FROM Posts WHERE Username = @Username ORDER BY PostedAt DESC'); // Fetch posts by the user, newest first

        res.json({ success: true, posts: result.recordset });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/get-all-posts', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM Posts ORDER BY PostedAt DESC'); // Fetch all posts ordered by date

        res.json({ success: true, posts: result.recordset });
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).send({ success: false, message: 'Server error during fetching all posts' });
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