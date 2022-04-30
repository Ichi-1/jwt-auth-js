const ApiError = require('../exceptions/api-error.js');

module.exports = function(err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, erros:err.errors})
  };
  return res.status(500).json({message:'Непредвиденнная ошибка'})
  
}