export default class Validator {
    static isEmailValid(email) {
       let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       return reg.test(email);
  }
  static isNameValidate(name) {
    //var reg = /^[A-Za-z_]+$/;
    var reg = /^[a-zA-Z_ ]*$/;
    return reg.test(name);
}  static isMobileValidate(mobile) {
  const reg = /^[0-9\b]+$/;
    return reg.test(mobile);
} static isDecimal(mobile) {
  const reg = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
    return reg.test(mobile);
}
static isSpecialCharValidate(str) {
  const reg = /^[a-zA-Z0-9]+$/;
    return reg.test(str);
}
static isSpecialCharValidateNotes(str) {
  const reg = /^[a-zA-Z0-9 .]+$/;
    return reg.test(str);
}
static isDecimalCharValidate(str) {
  //const reg = /^[0-9.]+$/;
  //const reg = /^(\/d+(\/.\d{0,2})?|\.?\d{1,2})$/;
  const reg = /^[a-zA-Z0-9]+$/;
    return reg.test(str);
}
static isStrongPassword(str) {
  const regex = new RegExp (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_%*?&.])[A-Za-z\d@$!_%*?&.]{8,}$/);
    return regex.test(str);
}
static isNumberWithComma(mobile) {
 const reg = /^[0-9,\b]+$/; 
   return reg.test(mobile);
}
static isDoseValidate(mobile) {
  const reg = /^[0-9\.\-]+$/;
    return reg.test(mobile);
}
static isNameValidateAss(name) {
  var reg = /^[a-zA-Z ]*$/;
  return reg.test(name);
}
static isUrlValidate(url) {
  var reg = /http(s)?|Http(s)?|HTTP(S)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return reg.test(url);
}
static isDecimalYear(mobile) {
  const reg = /^[+-]?([1-9]+\.?[0-9]*|\.[0-9]+)$/;
  return reg.test(mobile);
}
static isNumberHyphanDotSlashValidate(mobile) {
  const reg = /^[0-9./-]+$/;
  return reg.test(mobile);
}
}