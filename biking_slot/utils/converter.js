/* global exports: false */

var MILES_TO_DEGREES = 68.69;
/**
 * Converts degrees to mi
 */
exports.degreesToMiles = function(degrees) {
  return degrees * MILES_TO_DEGREES;
};
/**
 * And vice versa
 */
exports.milesToDegrees = function(miles) {
  return miles * (1/MILES_TO_DEGREES);
};
