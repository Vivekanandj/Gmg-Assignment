
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const cors = require('cors');
const authenticationRoute = require('./Routes/Authentication')
const profileRoute = require('./Routes/Profile')
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;

const postgresUrl = process.env.POSTGRES_URL;

// Create a PostgreSQL pool
const pool = new Pool({
    connectionString: postgresUrl + "?sslmode=require",
});


app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
    }),
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
}));

// Enable CORS for all routes
app.use(cors());


app.get('/', async (req, res) => {
    res.send("User Profile Api")
});

app.use('/auth', authenticationRoute)
app.use('/profile', profileRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
