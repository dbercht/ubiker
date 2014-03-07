/* global exports: false */
exports.INT = "INT";
exports.STRING = "STRING";
exports.STRING_ARRAY = "STRING_ARRAY";
exports.FLOAT = "FLOAT";

exports.sanitizeReq = function(params, inputs, errors) {
  if (!errors) {
    errors = { 'size' : 0, 'message' : {}};
  }
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      if ((param in inputs) && !exports.isSanitized(params[param], inputs[param])) {
        errors.message[param] = {"expected" : inputs[param], "received" : params[param]};
        errors.size++;
      }
    }
  }
  if (errors.size === 0) {
    return null;
  } else {
    return errors;
  }
};
exports.isSanitized = function(param, type) {
  if (param === "") return false;
  switch (type) {
    case exports.INT:
      return (/^\d+$/).test(param);
    case exports.FLOAT:
      return (/^(-)?\d+.\d+$/).test(param);
    case exports.STRING:
      return (/^[a-zA-Z_]+$/).test(param);
    case exports.STRING_ARRAY:
      return (/^[a-zA-Z_]+(,[a-zA-Z_]+)*$/).test(param);
    default:
      throw "Invalid param type";
  }
};
