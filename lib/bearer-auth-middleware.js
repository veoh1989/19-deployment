'use strict';

const errorHandler = require('./error-handler');
const Auth = require('../model/auth');
const jsonWebToken = require('jsonwebtoken');

// making the name capitalized since it's a constant string
const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(request,response,next){

  let authHeader = request.headers.authorization;

  if(!authHeader)
    return errorHandler(new Error(ERROR_MESSAGE),response);

  let token = authHeader.split('Bearer ')[1];

  if(!token)
    return errorHandler(new Error(ERROR_MESSAGE),response);

  // at this point, we have a TOKEN
  // verify === decrypt
  return jsonWebToken.verify(token,process.env.APP_SECRET,(error,decodedValue) => {
    if(error){
      error.message = ERROR_MESSAGE;
      return errorHandler(error,response);
    }
    // at this point, we have the tokenSeed / compareHash i.e. {token: mario}

    return Auth.findOne({compareHash: decodedValue.token})
      .then(user => {
        if(!user)
          return errorHandler(new Error(ERROR_MESSAGE),response);
        // we are mutating the request with a user
        // at this point, we are logged in
        request.user = user;
        next();
      })
      .catch(error => errorHandler(error,response));
  });
};