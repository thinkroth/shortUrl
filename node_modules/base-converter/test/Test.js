
var assert = require("assert");

var max_length = 80;

function cut(msg) {
	if (msg.length > max_length) {
		var len = Math.floor((max_length-5)/2);
		msg = msg.substring(0, len) + ' ... ' + msg.substring(msg.length - len);
	}
	return msg;
}

function info(msg, color) {
	msg = cut(msg);
	if (color) {
		msg = "\x1B[0;37m" + msg + "\x1B[0m";
	}
	console.log(msg);
}
function err(msg, color) {
	msg = cut(msg);
	if (color) {
		msg = "\x1B[1;31m" + msg + "\x1B[0m";
	}
	console.log(msg);
}
function success(msg, color) {
	msg = cut(msg);
	if (color) {
		msg = "\x1B[1;32m" + msg + "\x1B[0m";
	}
	console.log(msg);
}

function pad(str, len) {
	if (str.length < len) {
		str = Array(len-str.length+1).join(' ') + str;
	}
	return str;
}

function Test(total, verbose) {
	this.nb_fails = 0;
	this.nb_tests = 0;
	this.nb_expected = total;
	this.prefix_len = total.toString().length;
	this.verbose = verbose || false;
	this.colorize = true;
}

Test.prototype.test = function(test, a, b, comment) {
	this.nb_tests ++;
	var prefix = pad(this.nb_tests.toString(), this.prefix_len) + '. ';
	try {
		assert[test](a, b, comment);
	} catch (e) {
		this.nb_fails ++;
		if (e instanceof assert.AssertionError) {
			err(prefix + 'FAIL ' + comment, this.colorize);
		} else {
			err(prefix + 'ERR  Unexpected error !', this.colorize);
			this.finish();
			throw e;
		}
	}
	if (this.verbose) {
		if (this.colorize) {
			info(prefix + "\x1B[1;32mOK\x1B[0m   " + comment, this.colorize);
		} else {
			info(prefix + 'OK   ' + comment, this.colorize);
		}
	}
}

Test.prototype.finish = function() {
	var result = true;
	if (this.nb_tests != this.nb_expected) {
		err('Error: ' + this.nb_tests + ' tests ran (' + (this.nb_tests - this.nb_fails) + ' successfully), while ' + this.nb_expected + ' were expected.', this.colorize);
		result = false;
	} else if (this.nb_fails == 0) {
		success('All ' + this.nb_expected + ' tests ran successfully.', this.colorize);
	}
	if (this.nb_fails > 0) {
		err(this.nb_fails + ' on ' + this.nb_tests + ' failed.', this.colorize);
		result = false;
	}
	return result;
}

module.exports = Test;
