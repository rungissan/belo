import User from '../models/user';
import {createTransport} from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { hashSync } from 'bcrypt';
import passport from 'passport';
const AuthController = {};
import jwt from 'jsonwebtoken';
import { generateToken, respond } from '../middleware/authMiddleware';
import { secret, jwtExpire, mailerService, mailerEmail, mailerId, mailerPass } from '../config';

const smtpTransport = createTransport({
    service: mailerService,
    auth: {
        user: mailerId,
        pass: mailerPass
    }
});

const handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));


const checkAuthData = (email, password, name = '', profile = '') => {
    const MIN_PASSWORD_LENGTH = 6;
    const MAX_PASSWORD_LENGTH = 255;
    const MAX_PROFILE_LENGTH = 300;
    const passwordLength = password.length;
    const profileLength = profile.length;
    const regExpEmail = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
    const regExpName = /\s/;
    const isValidEmail = email.match(regExpEmail);
    const isNotValidName = name.match(regExpName);
    const isValidPassword = passwordLength >= MIN_PASSWORD_LENGTH && passwordLength <= MAX_PASSWORD_LENGTH;
    const isValidProfile = profileLength <= MAX_PROFILE_LENGTH;
    return {
        isValidEmail,
        isValidPassword,
        isNotValidName,
        isValidProfile
    };
};


AuthController.register = async (req, res) => {
    try{
        User.register(new User({ username: req.body.email,
            email: req.body.email,
            name: req.body.name
               }), req.body.password, function(err, account) {
            if (err) {
                return res.status(500).send('An error occurred: ' + err);
            }

            passport.authenticate(
                'local', {
                    session: false
                })(req, res, () => {
                res.status(200).send('Successfully created new account');
            });
        });
    }
    catch(err){
        return res.status(500).send('An error occurred: ' + err);
    }
};

AuthController.login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Something is not right with your input'
            });
        }
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user   : user
                });
            }
            req.login(user, {session: false}, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role
                }, secret);
                return res.json({email: user.email, token});
            });
        })(req, res);
    }
    catch(err){
        console.log(err);
    }
};



AuthController.logout = async (req, res) => {
    req.logout();
    res.status(200).send('Successfully logged out');
};

AuthController.profile = async (req, res) => {
    try{
        res.send(req.user);
    }
    catch(err){
        res.send("No user Returned");
    }
};

 const roleCheck = (req, res, next) => {
    Promise.resolve().then(() => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new Error();
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, secret);
        if (this.indexOf(req.user.role) === -1) throw new Error();
        next();
    }).catch(err => res.send(" Role check error"));
}

const handlers = {};

AuthController.requireRole = roles => {
    const key = roles.sort().join('|');
    if (!handlers[key]) {
        handlers[key] = roleCheck.bind(roles);
    }
    console.log(handlers[key]);
    return handlers[key];
};
AuthController.forgotPassword = (req, res, next) => {
    Promise.resolve().then(() => {
        return User.findOne({
            email: req.body.email
        });
    }).then(user => {
        if (!user) throw new Error();
        const buffer = crypto.randomBytes(20);
        const token = buffer.toString('hex');
        return {
            user,
            token
        };
    }).then(({
        user,
        token
    }) => {
        return User.findByIdAndUpdate({
            _id: user._id
        }, {
            reset_password_token: token,
            reset_password_expires: Date.now() + 86400000
        }, {
            upsert: true,
            new: true
        }).exec(function (newUser) {}).then(newUser => {
            const data = {
                to: newUser.email,
                from: mailerEmail,
                template: 'forgot-password-email',
                subject: 'Password help from Belocom!',
                context: {
                    url: `http://localhost:3005/auth/reset_password?token=${token}`,
                    name: newUser.name
                }
            };
            return smtpTransport.sendMail(data, err => {
                if (!err) {
                    return res.status(200);
                } else { return res.status(403); }
            });
        }).catch(err => console.error(err));
    });
};

AuthController.resetPassGetTemplate = (req, res, next) => {
    console.log('пртвет');
    console.log(req.query.token);
    Promise.resolve().then(() => {
        return User.findOne({
            reset_password_token: req.query.token,
            reset_password_expires: {
                $gt: Date.now()
            }
        }).exec((err, user) => {
            console.log(user);
            if (!user) return res.status(404).redirect('http://localhost:3005/password-reset-error');
            return res.render('reset_password', {
                title: 'Reset Password'
            });
        //    res.render(path.resolve('./public/views/change-password.html'));
        }).catch(err => console.error(err));
    });
};


AuthController.resetPassword = (req, res, next) => {
       Promise.resolve().then(() => {
        return User.findOne({
            reset_password_token: req.body.token,
            reset_password_expires: {
                $gt: Date.now()
            }
        }).exec((err, user) => {
            if (err) return res.status(404).send({
                message: 'Sorry, this password reset link is invalid'
            });
            if (!user) return res.status(404).send({
                message: 'Sorry, this password reset link is invalid'
            });
            if (req.body.newPassword !== req.body.verifyPassword) {
                return res.status(422).send({
                    message: 'Passwords do not match'
                });
            } else {
                user.hash = hashSync(req.body.newPassword, 10);
                user.reset_password_token = null;
                user.reset_password_expires = null;
                user.save();
                return user;
            }
        }).then(user => {
            if (user.reset_password_token) return;
            const data = {
                to: user.email,
                from: mailerEmail,
                template: 'reset-password-email',
                subject: 'Password Reset Confirmation',
                context: {
                    name: user.name
                }
            };
            return smtpTransport.sendMail(data, err => {
                if (!err) return res.json({
                    message: 'Your password was changed successfully'
                });
            });
        }).catch(err => console.log(err));
    });
};

export default AuthController;
