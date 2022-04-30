const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./mail-service.js');
const tokenService = require('./token-service.js');
const userDTO = require('../dtos/user-dtos.js');
const ApiError = require('../exceptions/api-error.js');
const UserDTO = require('../dtos/user-dtos.js');
const userModel = require('../models/user-model.js');

class UserService {
  async singIn(email, password) {
    const candidate = await userModel.findOne({email});
    if (candidate) {
      throw ApiError.badRequest(`${email} уже зарегестирован`)
    };
    //user data processing
    const hashPassword =  await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await userModel.create({email, password: hashPassword, activationLink});
    const userDto = new userDTO(user);

    // mailing
    await MailService.sendActivationLink(email, `${process.env.API_URL}/api/activate/${activationLink}`)

    //tokens processing
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }
  };

  async activate(activationLink){
    const user = await userModel.findOne({activationLink});
    if (!user) {
      throw ApiError.badRequest(`Invalid activation link`)
    };
    user.isActivated = true;
    await user.save()
  };

  async login(email, password){
    const user = await userModel.findOne({email});
    if (!user) {
      throw ApiError.badRequest(`User ${email} not found`)
    };
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.badRequest('Access denied: invalid password')
    };
    const userDto = new userDTO(user);
    const tokens = tokenService.generateToken({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto}
  };

  async logout(refreshToken){
    const token = await tokenService.removeToken(refreshToken);
    return token;
  };

  async refresh(refreshToken){
    if (!refreshToken) {
      throw ApiError.unathorizedError()
    };

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
        throw ApiError.unathorizedError()
    };

    const user = await userModel.findById(userData.id)
    const userDto = new UserDTO(user);
    const tokens = tokenService.generateToken({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto};
  };


  async getAllUsers(){
    const users = await userModel.find();
    return users
  };
}

module.exports = new UserService();