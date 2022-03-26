import express, { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';
import dotenv from 'dotenv';
import { create } from 'express-handlebars';
import pages from './routes/page.routes.js';
import register from './routes/register.routes.js';
import auth from './routes/auth.routes.js';
import hbsHelpers from './helpers/handlebars-helpers.js';

dotenv.config();

const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(express.static('public'));

// Templating engine
const hbs = create({ 
    extname: '.hbs',
    helpers: hbsHelpers
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.use(urlencoded({ extended: false }));

app.use(json());

app.use(cookieParser());

app.use('/', pages);
app.use('/register', register);
app.use('/auth', auth);

app.listen(3030, () => {
    console.log("Server started on port 3030");
    db.connect( (error) => {
        if(error) {
            console.log(error);
        } else {
            console.log("Connected to database");
        }
    });
});

export default db;