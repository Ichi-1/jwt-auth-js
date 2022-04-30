const UserService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error.js')

class UserController {

  //-------post funcs
  async sing_in(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Validation error', errors.array()))
      }
      const { email, password } = req.body;
      const userData = await UserService.singIn(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true })
      return res.json(userData)
    } catch (err) {
      next(err)
    };
  };

  async login(req, res, next) {
    try {
      const { email, password} = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true })
      return res.json(userData)
    } catch (err) {
      next(err)
    };
  };

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token)
    } catch (err) {
      next(err)
    };
  };


  //-----get funcs
  async users(req, res, next) {
    try {
      const users = await UserService.getAllUsers()
      return res.json(users);
    } catch (err) {
      next(err)
    };
  };

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL)
    } catch (err) {
      next(err)
    };
  };

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true });
      return res.json(userData)
    } catch (err) {
      next(err)
    };
  };

};


module.exports = new UserController();