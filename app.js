import express, { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';
import dotenv from 'dotenv';
import { create } from 'express-handlebars';
import pages from './routes/page.routes.js';
import register from './routes/register.routes.js';
import auth from './routes/auth.routes.js';
import hbsHelpers from './helpers/handlebars-helpers.js';
import fileUpload from 'express-fileupload';
import multer from 'multer'
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({ storage: storage });

dotenv.config();

const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


app.use(express.static('upload'));
app.use(express.static('public'));


const hbs = create({ 
    extname: '.hbs',
    helpers: hbsHelpers
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.use(urlencoded({ extended: false }));

app.use(json());

app.use(cookieParser());

app.use(fileUpload());

app.use('/', upload.single('sampleFile'), pages);
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