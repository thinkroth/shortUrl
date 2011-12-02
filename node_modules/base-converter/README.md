Base Converter 
==============

Current build status: [![Build Status](https://secure.travis-ci.org/naholyr/node-base-converter.png)](http://travis-ci.org/naholyr/node-base-converter)

Installation
------------

    npm install base-converter

Example
-------

    var base = require('base-converter');

    var n = 3598786;
    var b = base.decTo62(n);
    var n2 = base._62ToDec(b);
    console.log(n, b, n2);
    
    // Expected output : 3598786 'f6cW' 3598786

Methods
-------

Predefined bases (2, 8, 16, 36, 62):

* decToBin(n)
* decToHex(n)
* decToOct(n)
* decTo36(n)
* decTo62(n)
* binToDec(n)
* hexToDec(n)
* octToDec(n)
* _36ToDec(n)
* _62ToDec(n)

Using your own custom base:
    
* decToGeneric(n, alphabet)
* genericToDec(n, alphabet)

Where 'alphabet' can be:

* an integer between 2 and 36 (native conversion), or 62.
* a string, containing all your symbols (one symbol = one character). 

Example with custom base:

    var bc = require('base-converter')
    console.log(bc.decToGeneric(359461, 'AbcGHiuRSt'));
    
    // Expected output : 'GitHub'genericToDec('GitHub', base));

Performance
-----------

Since version `1.1.0`, when a base between 2 and 36 is used, we fallback to native Javascript way of converting bases:

* decimal to base: (number).toString(base)
* base to decimal: parseInt(string, base)

This should ensure best performance in any case.
