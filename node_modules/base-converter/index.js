
var util = require("util");

function ConversionError(msg) {
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(ConversionError, Error);

exports.ConversionError = ConversionError;

function getAlphabet(b) {
  if (typeof b == 'string') {
    if (b.length == 0) {
      throw new ConversionError("Empty alphabet");
    }
    return b;
  } else if (b <= 36) {
    // This case does not exist, we should have used native conversion
    throw new ConversionError("Unexpected call to getAlphabet(" + n + ")");
  } else if (b == 62) {
    b = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  } else if (typeof b == 'number') {
    throw new ConversionError("Unknown numeric base, provide alphabet");
  }

  return b;
}

exports.decToGeneric = function(n, b) {
  if (typeof n != 'number') {
    throw new ConversionError("Expected valid number");
  }
  if (typeof b == 'number' && b > 1 && b <= 36) {
    // Fallback to native base conversion
    return n.toString(b);
  }
  b = getAlphabet(b);
  var result = '';
  var bLen = b.length;
  while (n != 0) {
    var q = n % bLen;
    result = b[q] + result;
    n = (n - q) / bLen;
  }

  return result;
}

exports.decToBin = function(n) {
  return this.decToGeneric(n, 2);
}

exports.decToHex = function(n) {
  return this.decToGeneric(n, 16);
}

exports.decToOct = function(n) {
  return this.decToGeneric(n, 8);
}

exports.decTo36 = function(n) {
  return this.decToGeneric(n, 36);
}

exports.decTo62 = function(n) {
  return this.decToGeneric(n, 62);
}

exports.genericToDec = function(n, b) {
  n = n.toString();
  if (typeof b == 'number' && b > 1 && b <= 36) {
    // Fallback to native base conversion
    return parseInt(n, b);
  }
  b = getAlphabet(b);
  var cache_pos = {};
  var bLen = b.length;
  var result = 0;
  var pow = 1;
  for (var i = n.length-1; i >= 0; i--) {
    var c = n[i];
    if (typeof cache_pos[c] == 'undefined') {
      cache_pos[c] = b.indexOf(c);
    }
    result += pow * cache_pos[c];
    pow *= bLen;
  }
  return result;
}

exports.binToDec = function(n) {
  return this.genericToDec(n, 2);
}

exports.hexToDec = function(n) {
  return this.genericToDec(n, 16);
}

exports.octToDec = function(n) {
  return this.genericToDec(n, 8);
}

exports._36ToDec = function(n) {
  return this.genericToDec(n, 36);
}

exports._62ToDec = function(n) {
  return this.genericToDec(n, 62);
}
