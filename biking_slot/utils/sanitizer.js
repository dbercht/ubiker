/* global exports: false */
exports.INT = "INT";
exports.STRING = "STRING";
exports.STRING_ARRAY = "STRING_ARRAY";
exports.FLOAT = "FLOAT";

/**
 * Sanitizes a dictionary of parameters and sanititzes each according 
 * to its expected input type, as defined by the inputs dict
 */
exports.sanitizeReq = function(params, inputs, errors) {
  if (errors === null || errors === undefined) {
    errors = { 'size' : 0, 'message' : {}};
  }
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      if ((param in inputs) && !exports.isSanitized(params[param], inputs[param])) {
        if (params[param] === "") {
          delete params[param]; 
        } else {
          errors.message[param] = {"expected" : inputs[param], "received" : params[param]};
          errors.size++;
        }
      }
    }
  }
  if (errors.size === 0) {
    return null;
  } else {
    return errors;
  }
};

/**
 * Verify if a value is sanitized to the appropriate type
 */
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
