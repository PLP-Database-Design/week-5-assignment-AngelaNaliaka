//Initialise dependencies

// HTTP framework
const express = require('express'); // Corrected require statement
//Instance 
const app = express();
//DBMS Mysql
const mysql = require('mysql2'); // Corrected require statement
//Cross Origin Resources Sharing
const cors = require('cors'); // Corrected require statement
//Environment variable doc
const dotenv = require('dotenv'); // Corrected require statement


// Middleware setup
app.use(express.json());
app.use(cors());

// Load environment variables
dotenv.config(); // Moved dotenv.config() before using environment variables

// Connect to the database ***
const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
    });

// Check if db connection works
    db.connect((err) => {
        //If connect is unsuccessfull
if(err) {
    return console.log("Error connecting to MYSQL: ", err);  // Corrected the error message
}
        // If connect works successfully
        console.log("Connected to MYSQL successfully as id: " , db.threadId);
});

        //Your code goes here
        //GET METHOD example

        app.set('view engine', 'ejs');
        app.set('views', __dirname + '/views');
        
        app.get('/patients', (req, res) => {
            
            //1. retrieve data from patients
            db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error retrieving data');
                } else {
                    //Render the data in a template
                    res.render('data', {results: results });
                }
            });
        });

        //2. Retrieve all providers
        app.get('/providers', (req, res) => {
            
            //retrieve data from database
            db.query('SELECT providers_id, first_name, last_name, provider_specialty FROM providers', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error retrieving data');
                } else {
                    //Render the data in a template
                    res.render('data', {results: results });
                }
            });
        });
        
        // GET endpoint to retrieve patients by their first name
app.get('/first-name-patients', (req, res) => {
    const firstName = req.query.firstName;
    if (!firstName) {
        return res.status(400).send('Please provide a first name');
    }

    const query = 'SELECT * FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving patients');
        }
        if (results.length === 0) {
            return res.status(404).send('No patients found with that first name');
        }
        res.json(results);
    });
});

// GET endpoint to retrieve all providers or filter by specialty
app.get('/specialty-providers', (req, res) => {
    const specialty = req.query.specialty;
    
    let query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    let queryParams = [];

    if (specialty) {
        query += ' WHERE provider_specialty = ?';
        queryParams.push(specialty);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            res.render('data', { results: results });
        }
    });
});


      // Start the server  
app.listen(3300, () => {
    console.log(`Server listening on port 3300...`);

    // Retrieve all patients

// Send a message to the browser
console.log('sending message to browser...');
app.get('/', (req, res) => {
    res.send('server started successfully!');
});

});
