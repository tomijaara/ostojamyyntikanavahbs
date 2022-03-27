import express from 'express';
import { isLoggedIn } from '../controllers/auth.controller.js';
import newAdvert, {
    listAdverts,
    listUserAdverts,
    getAdvert,
    updateAdvert,
    deleteAdvert
} from '../controllers/advert.controller.js';
import { listUsers } from '../controllers/user.controller.js';

const routes = express.Router();

routes.get('/', [isLoggedIn, listAdverts, listUsers], (req, res) => {
    res.render('index', {
        user: req.user,
        users: req.users,
        list: req.list,
        searchAdvert: req.searchAdvert
    });
});

routes.post('/', [isLoggedIn, listAdverts, listUsers], (req, res) => {
    res.render('index', {
        user: req.user,
        users: req.users,
        list: req.list,
        searchAdvert: req.searchAdvert
    });
});


routes.get('/register', (req, res) => {
    res.render('register');
});

routes.get('/login', (req, res) => {
    res.render('login');
});

routes.get('/newAdvert', isLoggedIn, (req, res) => {
    res.render('new-advert', {
        user: req.user
    });
});

routes.post('/newAdvert', [isLoggedIn, newAdvert], (req, res) => {
    let sampleFile;
    let uploadPath;
    console.log("hello" + req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/' + sampleFile.name;

    console.log(sampleFile);

    // Use mv() to place file on the server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
    }),





        res.render('new-advert', {
            user: req.user
        });
    });

    routes.get('/profile', [isLoggedIn, listUserAdverts], (req, res) => {
        if (req.list) {
            res.render('profile', {
                list: req.list,
                user: req.user
            });
        } else {
            res.redirect('/login');
        }
    }
    );

    routes.get('/editAdvert/:id', [isLoggedIn, getAdvert], (req, res) => {
        const user = req.user;
        const advert = req.advert
        if (advert) {
            res.render('edit-advert', {
                user,
                advert
            });
        } else {
            res.redirect('/login');
        }
    });

    routes.post('/editAdvert/:id', [isLoggedIn, updateAdvert], (req, res) => {
        const user = req.user;
        const advert = req.advert
        if (advert) {
            res.render('edit-advert', {
                user,
                advert
            });
        } else {
            res.redirect('/login');
        }
    });

    routes.get('/deleteAdvert/:id', deleteAdvert);


    export default routes;
