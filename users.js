const sql = require('mssql');
const bcrypt = require('bcrypt');

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

// Function to retrieve a user by their username
async function getUserByUsername(username) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username')
        return result.recordset[0];
    } catch (err) {
        console.error('Database operation failed:', err);
    } finally {
        await sql.close();
    }
}

// Function to create a user
async function createUser(username, email, password) {
    const hash = await bcrypt.hash(password, 10); // Hash the password with bcrypt
    try {
        const pool = await sql.connect(config);
        const request = pool.request();
        request.input('Username', sql.VarChar, username);
        request.input('Email', sql.VarChar, email);
        request.input('PasswordHash', sql.VarChar, hash);

        // Insert the user into the Users table
        await request.query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (@Username, @Email, @PasswordHash)');

        // Create a default profile for the new user
        const profileRequest = pool.request();
        profileRequest.input('Username', sql.VarChar, username);
        profileRequest.input('Email', sql.VarChar, email);
        profileRequest.input('Bio', sql.VarChar, ''); // Default or empty bio
        profileRequest.input('ProfilePictureURL', sql.VarChar, 'uploads/default_profile_picture.png'); // Path to a default profile picture

        // Insert the profile into the Profile table
        await profileRequest.query('INSERT INTO Profile (Username, Email, Bio, ProfilePictureURL) VALUES (@Username, @Email, @Bio, @ProfilePictureURL)');

        await sql.close(); // Properly close the connection
        return { success: true }; // Return success if insertion is successful
    } catch (error) {
        console.error('Error creating user and profile:', error);
        throw error;  // Rethrow to allow for centralized error handling
    }
}

// Function to authenticate a user based on username and password
async function login(username, password) {
    try {
        const pool = await sql.connect(config);
        // First, get the user and their profile
        const userResult = await pool.request()
            .input('Username', sql.VarChar, username)
            .query(`
                SELECT u.Username, u.PasswordHash, u.Email, p.Bio
                FROM Users u
                JOIN Profile p ON u.Username = p.Username
                WHERE u.Username = @Username
            `);

        if (userResult.recordset.length > 0) {
            const user = userResult.recordset[0];
            const match = await bcrypt.compare(password, user.PasswordHash);

            if (match) {
                // Fetch posts
                const postsResult = await pool.request()
                    .input('Username', sql.VarChar, username)
                    .query('SELECT Title, Content FROM Posts WHERE Username = @Username ORDER BY PostedAt DESC');
                
                const posts = postsResult.recordset;

                return { success: true, username: user.Username, email: user.Email, bio: user.Bio, posts: posts };
            } else {
                return { success: false, message: "Invalid credentials" };
            }
        }
        return { success: false, message: "User not found" };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: "Server error during login" };
    }
}

module.exports = { getUserByUsername, createUser, login };