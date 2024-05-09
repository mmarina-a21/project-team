var Connection = require('tedious').Connection;

var config = {
    server: "DESKTOP-HRUD03R",  // Ensure this is the correct server name
    authentication: {
        type: "default",
        options: {
            userName: "Kristian Pando",
            password: "1234",
            domain: "localhost"
        }
    },
    options: {
        database: "Team Project",  // Ensure this is the correct database name
        encrypt: true,  // This should be true if SSL is enabled on your SQL Server
        trustServerCertificate: true,  // This should be true only in development environments
        enableArithAbort: true
    }
};


var connection = new Connection(config);

connection.on('connect', function(err) {
    console.log('Connection attempt fired.');
    if (err) {
        console.error('Connection Failed!', err);
    } else {
        console.log('Connected successfully!');
        connection.close();
    }
});

connection.connect();  // Explicitly call connect
module.exports = { connection };
