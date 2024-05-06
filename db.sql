    CREATE TABLE Users (
        Username NVARCHAR(50) PRIMARY KEY,
        PasswordHash NVARCHAR(255) NOT NULL, -- Storing hashed password
        Email NVARCHAR(100) UNIQUE NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE() -- Auto-set the current date and time
    );

    CREATE TABLE Profile (
        Username NVARCHAR(50) PRIMARY KEY,
        Email NVARCHAR(100) NOT NULL,
        Bio NVARCHAR(MAX),
        ProfilePictureURL NVARCHAR(255),
        FOREIGN KEY (Username) REFERENCES Users(Username)
    );

    CREATE TABLE Posts (
        PostID INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(50) NOT NULL, -- Foreign key that references Users
        Title NVARCHAR(255) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL, -- Using NVARCHAR(MAX) for potentially long posts
        PostedAt DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (Username) REFERENCES Users(Username),
        FOREIGN KEY (Email) REFERENCES Users(Email)
    );
