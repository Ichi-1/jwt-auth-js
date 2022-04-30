const ApiError = require('../exceptions/api-error.js');
const tokenService = require('../services/token-service.js');

module.exports = function(req, res, next){
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unathorizedError())
    };
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.unathorizedError())
    };
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.unathorizedError());
    };
    req.user = userData;
    next()
  } catch (error) {
    return next(ApiError.unathorizedError())
  }
}