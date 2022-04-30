const Router = require('express');
const router = new Router();
const UserController = require('../controller/user-controller.js');
const { body } = require('express-validator');
const authMiddeware = require('../middleware/auth-middleware.js');
 
//post methods
router.post('/sign_in', 
  body('email').isEmail(), 
  body('password').isLength({min: 3, max:32}),
  UserController.sing_in,
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

//get methods
router.get('/refresh', UserController.refresh);
router.get('/activate/:link', UserController.activate);
router.get('/users', authMiddeware, UserController.users);


module.exports = router;