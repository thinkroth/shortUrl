var base = require('..'), Test = require('./Test');;

if (process.argv[1] == __filename && process.argv.indexOf('--run') == -1) {
	console.info('Usage: node test/index.js --run [--verbose] [--no-color]');
	process.exit(1);
}

var t = new Test(116);
if (process.argv.indexOf('--verbose') != -1) {
	t.verbose = true;
}
t.colorize = (process.argv.indexOf('--no-color') == -1);

function test_conversion(n, s, b, decToBase, baseToDec) {
	if (typeof b == 'number' && b >= 2 && b <= 36) {
		t.test('equal', n.toString(b), s, '[Base '+b+'] Reference: native conversion ('+n+').toString('+b+') = "'+n.toString(b)+'" (expected "'+s+'")');
		t.test('equal', parseInt(s,b), n, '[Base '+b+'] Reference: native conversion parseInt("'+s+'", '+b+') = '+parseInt(s,b)+' (expected '+n+')');
	}
	if (typeof decToBase != 'undefined') {
		t.test('equal', base[decToBase](n), s, '[Base '+b+'] '+decToBase+'('+n+') = "'+base[decToBase](n)+'" (expected "'+s+'")');
	}
	if (typeof baseToDec != 'undefined') {
		t.test('equal', base[baseToDec](s), n, '[Base '+b+'] '+baseToDec+'("'+s+'") = '+base[baseToDec](s)+' (expected '+n+')');
	}
	t.test('equal', base.decToGeneric(n, b), s, '[Base '+b+'] decToGeneric('+n+', '+b+') = "'+base.decToGeneric(n,b)+'" (expected "'+s+'")');
	t.test('equal', base.genericToDec(s, b), n, '[Base '+b+'] genericToDec("'+s+'", '+b+') = '+base.genericToDec(s,b)+' (expected '+n+')');
}



// -- Standard bases 2, 8, 16, 36: tested against system native conversion


function random_number() {
	return Math.floor(Math.random()*Math.pow(10, Math.floor(Math.random()*10)));
}
for (var i=1; i<=3; i++) {
	var n = random_number();
	test_conversion(n, n.toString(2),  2,  'decToBin', 'binToDec');
	test_conversion(n, n.toString(8),  8,  'decToOct', 'octToDec');
	test_conversion(n, n.toString(16), 16, 'decToHex', 'hexToDec');
	test_conversion(n, n.toString(36), 36, 'decTo36',  '_36ToDec');
}



// -- Base 4


test_conversion(3,   '3',     4);
test_conversion(27,  '123',   4);
test_conversion(493, '13231', 4);
// Same using alphabet
test_conversion(3,   '3',     '0123');
test_conversion(27,  '123',   '0123');
test_conversion(493, '13231', '0123');



// -- Base 62


test_conversion(59,       'X',    62, 'decTo62', '_62ToDec');
test_conversion(1981,     'vX',   62, 'decTo62', '_62ToDec');
test_conversion(12876366, 'S1Jk', 62, 'decTo62', '_62ToDec');
// Same using alphabet
test_conversion(59,       'X',    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 'decTo62', '_62ToDec');
test_conversion(1981,     'vX',   '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 'decTo62', '_62ToDec');
test_conversion(12876366, 'S1Jk', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 'decTo62', '_62ToDec');



// -- Invalid conversions


t.test('throws', function() { base.decToGeneric(37, 37); }, base.ConversionError, 'Unknown base 37');
t.test('throws', function() { base.decToGeneric(37, ''); }, base.ConversionError, 'Empty alphabet');



// -- Finished tests


t.finish() && process.exit(0) || process.exit(1);
