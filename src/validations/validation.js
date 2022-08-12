const mongoose = require('mongoose')

// for Object Id validation for futher use
const isValidObjectId = function (value) {
  return mongoose.Types.ObjectId.isValid(value)
};

//-----------------------blank body-------------------
const isValidRequestBody = function (body) {
    return Object.keys(body).length > 0;
};
  

/* ----------------------------------type/input value--------------------------------------- */
const isValidInputValue = function (data) {
    if (typeof (data) === 'undefined' || data === null) return false
    if (typeof (data) === 'string' && data.trim().length > 0) return true
    if (typeof (data) === 'object'|| Object.values(data) > 0 ) return true
    return false
  }

  //-------------------------string-------------------------
  const isValidOnlyCharacters = function (data) {
    return /^[A-Za-z ]+$/.test(data)
  }

  //------------------------countrycode------------------------
  const isValidCountryCode = function (value) {
    return ["+91", "+92", "+93", "+61", "+86", "+1", "+44"].indexOf(value) !== -1;
  };

  //------------------------gender------------------------
  const isValidGender = function (value) {
    return ["Male", "Female", "other"].indexOf(value) !== -1;
  };

  //-----------------------phone---------------------------
  const isValidPhone = function (data) {
    if (/^[6-9][0-9]{9}$/.test(data))
      return true
    else return false
  }

  /* --------------------------------------email format---------------------------------------- */
const isValidEmail = function (data) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data))
      return false
    else return true
}
  
/* ------------------------------------------password format--------------------------------- */
const isValidPassword = function (data) {
    if (!/^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data))
      return false
    else return true
}
  
//------------------------status------------------------
const isValidStatus = function (value) {
    return ["Public", "Private"].indexOf(value) !== -1;
};
  
/* --------------------------------------file should be image---------------------------------- */

const isValidImageType = function (data) {
    const reg = /(audio|image|video|x-(?:[0-9A-Za-z!#$%&'*+.^_`|~-]+))\/([0-9A-Za-z!#$%&'*+.^_`|~-]+)/
    return reg.test(data)
  }

  module.exports = { isValidObjectId, isValidImageType, isValidStatus, isValidPassword, isValidEmail, isValidInputValue, isValidCountryCode, isValidRequestBody, isValidGender, isValidOnlyCharacters, isValidPhone }