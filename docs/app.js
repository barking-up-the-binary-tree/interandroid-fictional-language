(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.0/optimize for better performance and smaller assets.');


var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (!x.$)
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




/**/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? elm$core$Result$Ok(value)
				: (value instanceof String)
					? elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var elm$core$Basics$True = {$: 'True'};
var author$project$App$defaultModel = {fromEng: true, hexa: '', text: ''};
var elm$core$Basics$False = {$: 'False'};
var elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var elm$core$Basics$EQ = {$: 'EQ'};
var elm$core$Basics$GT = {$: 'GT'};
var elm$core$Basics$LT = {$: 'LT'};
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$List$cons = _List_cons;
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0.a;
	return elm$core$Dict$keys(dict);
};
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var elm$core$Maybe$Nothing = {$: 'Nothing'};
var elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 'Nothing') {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$App$init = function (_n0) {
	return _Utils_Tuple2(author$project$App$defaultModel, elm$core$Platform$Cmd$none);
};
var elm$core$Platform$Sub$batch = _Platform_batch;
var elm$core$Platform$Sub$none = elm$core$Platform$Sub$batch(_List_Nil);
var author$project$App$subscriptions = function (model) {
	return elm$core$Platform$Sub$none;
};
var author$project$FictionalLanguage$C = function (a) {
	return {$: 'C', a: a};
};
var author$project$FictionalLanguage$N = function (a) {
	return {$: 'N', a: a};
};
var author$project$FictionalLanguage$Unknown = {$: 'Unknown'};
var author$project$FictionalLanguage$W = function (a) {
	return {$: 'W', a: a};
};
var author$project$FictionalLanguage$X = function (a) {
	return {$: 'X', a: a};
};
var author$project$FictionalLanguage$unknownWord = '????';
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var author$project$FictionalLanguage$getOrDefaultDict = F2(
	function (index, dict) {
		return A2(
			elm$core$Maybe$withDefault,
			author$project$FictionalLanguage$unknownWord,
			A2(elm$core$Dict$get, index, dict));
	});
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = elm$core$Array$bitMask & (index >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_n0.$ === 'SubTree') {
				var subTree = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _n0.a;
				return A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, values);
			}
		}
	});
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Basics$ge = _Utils_ge;
var elm$core$Array$get = F2(
	function (index, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? elm$core$Maybe$Just(
			A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, tail)) : elm$core$Maybe$Just(
			A3(elm$core$Array$getHelp, startShift, index, tree)));
	});
var elm$core$String$trim = _String_trim;
var author$project$FictionalLanguage$getOrDefaultArr = F2(
	function (index, arr) {
		return elm$core$String$trim(
			A2(
				elm$core$Maybe$withDefault,
				'???',
				A2(elm$core$Array$get, index, arr)));
	});
var author$project$FictionalLanguage$arrayToTuple = function (arr) {
	return _Utils_Tuple2(
		A2(author$project$FictionalLanguage$getOrDefaultArr, 0, arr),
		A2(author$project$FictionalLanguage$getOrDefaultArr, 1, arr));
};
var elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, list);
			var jsArray = _n0.a;
			var remainingItems = _n0.b;
			if (_Utils_cmp(
				elm$core$Elm$JsArray$length(jsArray),
				elm$core$Array$branchFactor) < 0) {
				return A2(
					elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					elm$core$List$cons,
					elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return elm$core$Array$empty;
	} else {
		return A3(elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var author$project$FictionalLanguage$csvToTuple = function (line) {
	return author$project$FictionalLanguage$arrayToTuple(
		elm$core$Array$fromList(
			A2(elm$core$String$split, ',', line)));
};
var author$project$FictionalWords$csvContent = '\nabout_page,6107\naccept,2901\naccept_action,2901224\naccepted_answer,2901549\naccepted_offer,290150\naccepted_payment_method,290150341305\naccepts_reservations,290173824\naccess_code,29925\naccess_mode,29935\naccess_mode_sufficient,2993590241\naccessibility_api,299661\naccessibility_control,29966124176\naccessibility_feature,299661012\naccessibility_hazard,29966135\naccessibility_summary,299661937\naccommodation,23524\naccount_id,2415\naccountable_person,24166094\naccounting_service,2414989\nachieve_action,128224\nacid_breaks,95672\nacid_house,959\nacid_jazz,9573\nacid_rock,9572\nacid_techno,95124\nacid_trance,951749\nacidic,952\nacorn_squash,249282\nacquired_from,28073\nacrylic,2762\nactinium,2143\naction,224\naction_application,22406224\naction_collab_class,224266269\naction_option,224024\naction_platform,22406103\naction_status,2249119\naction_status_type,224911910\nactivate_action,2181224\nactive_action_status,2182249119\nadditional_name,524643\nadditional_number_of_guests,5246436891\nadditional_property,52460701\nadditional_type,524610\naddress_country,5792417\naddress_locality,5796261\naddress_region,579774\nadministrative_area,534917187\nadult_entertainment,5614114341\nadvance_booking_requirement,5849624728341\nadvise,583\naffiliation,0624\naffirmative,0318\naggregate_offer,710\naggregate_rating,71714\nagree_action,7224\nagreement,7341\naircraft,2701\nalbum_production_type,66307522410\nalbum_release,663769\nalbum_release_type,66376910\nalcoholic,6262\nalfalfa_sprout,60609071\nalignment_object,643416721\nalignment_type,6434110\nall_wheel_drive_configuration,686578240724\nalligator_pepper,6100\nallocate_action,621224\nallspice,6909\nalpaca,602\nalso_known_as,69443\nalternate_name,614143\nalternative_dance,61418549\nalternative_headline,61418564\nalternative_metal,61418316\nalternative_rock,6141872\naluminum,6343\nalumni,6349\nalumni_of,63498\namaranth,3740\nambient,3641\nambient_dub,364156\nambient_house,36419\nambient_techno,3641124\namenity_feature,341012\namericium,37993\namount_of_this_good,3418995\namuse,393\namusement_park,39334102\nangelica,4762\nangular,496\nanimal_shelter,436261\nannounce,449\nannual_percentage_rate,4960941771\nanswer,49\nanswer_count,49241\nanthropoid,40705\nanti_folk,4102\napartment,01341\napartment_complex,01341230629\napologise,0673\napplication_category,06224217\napplication_suite,06224981\napplies_to_delivery_method,0615687305\napplies_to_payment_method,0610341305\napprove,078\napproximate,072931\napricot,0721\naquarium,2873\naromatic_ginger,7312747\narrest,791\narrival_airport,78601\narrival_bus_stop,78669910\narrival_gate,7861\narrival_platform,78606103\narrival_station,7869124\narrival_terminal,7861346\narrival_time,78613\narrive,78\narrive_action,78224\nart_edition,1524\nart_gallery,167\nart_medium,1353\nart_punk,1042\nartichoke,1122\narticle_body,12665\narticle_section,1269224\nartwork_surface,182909\nasafoetida,9015\nasbestos,36919\nasian_underground,4445745\nask_action,92224\nasparagus,9079\nasphalt,9061\nassembly_version,9366824\nassess_action,99224\nassign_action,94224\nassociated_article,9215126\nassociated_media,921535\nastringent,9174441\nat_present,107341\nat_that_time,19113\nattendee,145\naudience_type,54910\naudio_object,56721\naudiobook_format,562031\nauthorize_action,073224\nauto_body_shop,16520\nauto_dealer,156\nauto_parts_store,10191\nauto_rental,17416\nauto_wash,182\nautolytic,1699\nautomated_teller,13116\nautomotive_business,13186349\nautomotive_ontology_wgclass,13184167\navailability,86661\navailability_ends,8666145\navailability_starts,86661911\navailable_at_or_from,86661073\navailable_channel,86661246\navailable_delivery_method,86665687305\navailable_from,8666073\navailable_language,86666487\navailable_on_device,86664589\navailable_through,866607\navant_garde_jazz,873\navocado,825\naway_team,813\nbakery,627\nbalance,6649\nbalanced,66491\nbalearic_beat,667261\nballistic_nylon,66912464\nbaltimore_club,6613266\nbanana_ketchup,6442120\nbanana_squash,6449282\nbank_account,642241\nbank_or_credit_union,64227519494\nbar_or_pub,606\nbarathea,670\nbarbecue_sauce,662999\nbarnyard,6495\nbase_salary,69967\nbasil,636\nbassline,69646964\nbattle,616\nbe_visible,68366\nbean_sprout,649071\nbeat_music,613932\nbeau_monde_seasoning,69344\nbeauty_salon,691964\nbecause_of,6238\nbed_and_breakfast,6545672091\nbed_details,65516\nbedford_cord,650756507525\nbefore_long,6064\nbefriend_action,60745224\nbell_pepper,6600\nbenefits,6401\nbengaline_silk,6464962\nberkelium,6263\nberyllium,6763\nbest_rating,691714\nbeta_cloth,61260\nbib_ex_term,662913\nbilling_address,664579\nbilling_increment,664427341\nbilling_period,664075\nbirth_date,6051\nbirth_place,60069\nbismuth,6330\nbizarre_silk,63962\nblack_bean,66264\nblack_cardamom,6622533\nblack_eyed_pea,66250\nblack_metal,662316\nblack_mustard,6623915\nblack_peppercorn,6620024\nblack_vinegar,66284\nblackberry,66267\nblackcurrant,6622741\nbleach,6612\nbless,669\nblind,6645\nblink,6642\nblog_posting,660914\nblog_posts,66091\nblood_orange,665744\nblueberry,6667\nboarding_group,65470\nboarding_policy,654069\nboarding_policy_type,65406910\nbobbinet,6641\nbody_of_water,65881\nboiled_wool,6686\nboldo,665\nbolivian_coriander,66842745\nbolt,661\nbombazine,63634\nbook_edition,62524\nbook_format,62031\nbook_format_type,6203110\nbook_series,62973\nbooking_agent,624741\nbooking_time,62413\nbookmark_action,6232224\nboolean,664\nborrow_action,67224\nbossa_nova,48\nbounce,649\nbouncy_house,6499\nbouncy_techno,649124\nbowling_alley,6646\nboysenberry,63467\nbranch,6742\nbranch_code,674225\nbranch_of,67428\nbrand,6745\nbrazilian_pepper,6736400\nbreadcrumb,675273\nbreadcrumb_list,675273691\nbreadfruit,675071\nbreakbeat,67261\nbreathe,679\nbridge,677\nbright,671\nbrilliance,676949\nbrilliantine,6769414\nbritish_dance,6712549\nbritpop,67100\nbroad_beans,67564\nbroadcast_affiliate_of,6752910618\nbroadcast_channel,6752911246\nbroadcast_channel_id,67529112465\nbroadcast_display_name,675291590643\nbroadcast_event,675291841\nbroadcast_of_event,6752918841\nbroadcast_release,675291769\nbroadcast_service,675291989\nbroadcast_service_tier,6752919891\nbroadcaster,675291\nbroadcloth,675260\nbrocade,6725\nbroccoflower,672067672067\nbroccoli,6726\nbroken_beat,672461\nbrown_mustard,6743915\nbrowser_requirements,673728341\nbruise,673\nbrussels_sprout,679639071\nbubblegum_dance,6663549\nbuckram,6273\nbuddhist_temple,65911306\nbump,630\nbunting,6414\nburlap,660\nbus_name,6943\nbus_number,69436\nbus_reservation,6973824\nbus_station,699124\nbus_stop,69910\nbus_trip,69170\nbusiness_audience,6349549\nbusiness_entity_type,634941110\nbusiness_event,6349841\nbusiness_function,63490424\nbutternut_squash,61419282\nbuttery,617\nby_artist,6191\ncable_or_satellite_service,2669161989\ncafe_or_coffee_shop,202020\ncalabrese,26679\ncalcium,2693\ncalculate,262961\ncalico,262\ncalifornium,26043\ncalories,267\ncambric,23672\ncampground,230745\ncamping_pitch,2302304012\ncanary_melon,247364\ncancel,2496\ncancel_action,2496224\ncandidate,24551\ncantaloupe,24160\ncanterbury_scene,2416794\ncanvas,2489\ncape_jazz,2073\ncaption,2024\ncaraway,278\ncarbohydrate_content,2657124141\ncarbon_fiber,26406\ncardamom,2533\ncargo_volume,28693\ncarpet,201\ncarrier_requirements,27728341\ncashmere,223\ncasino,294\ncassette_format,291031\ncassis,299\ncat_pee,210\ncatalog,216\ncatalog_number,216436\ncategory,217\ncatholic_church,20621212\ncauliflower,2606\ncayenne_pepper,2400\ncedar_bark,9562\nceleriac,9672\ncelery,967\ncelery_powder,96705\ncelery_seed,96795\nceltic,2612\nceltic_metal,2612316\nceltic_punk,2612042\ncement,9341\ncemetery,9317\nceramic_tile,973216\nchaat_masala,121396\nchallenge,12644\nchamber_jazz,123673\nchambray,2367\nchamomile,2336\nchange,1244\nchar_cloth,12260\ncharacter_attribute,272117691\ncharacter_name,272143\ncharcoal,1226\ncheat_code,12125\ncheck_action,122224\ncheck_in_action,1224224\ncheck_out_action,1221224\ncheckin_time,122413\ncheckout_page,122107\ncheckout_time,122113\ncheesecloth,123260\nchenille,246\ncherimoya,1273\ncherry,127\nchervil,1286\nchicago_house,229\nchickpea,1220\nchiffon,204\nchild_care,12652\nchild_max_age,12653297\nchild_min_age,1265347\nchili_oil,1266\nchili_pepper,12600\nchili_powder,12605\nchili_sauce,12699\nchill_out,1261\nchimichurri,123127\nchinese_rock,124372\nchintz,1249\nchives,1283\nchocolaty,12261\nchoke,122\ncholesterol_content,26917624141\nchoose_action,123224\nchristian_metal,279124316\nchristian_punk,279124042\nchristian_rock,27912472\nchromium,2733\nchurch,1212\nchutney,1214\ncigar_box,9629\ncilantro,96417\ncinder_block,945662\ncinnamon,9434\ncitation,9124\ncivic_structure,982917212\nclaim,263\nclaim_reviewed,263789\nclassic_trance,26921749\nclean,264\nclementine,263414\nclip_number,260436\nclosed,2635\ncloth_of_gold,260865\ncloudberry,26567\nclove,268\ncoach,212\ncobalt,2661\ncocktail_sauce,221699\ncoconut,2241\ncode_repository,2570317\ncode_sample_type,25930610\ncoefficient,20241\ncollard_green,26574\ncollect,2621\ncollection,26224\ncollection_page,2622407\ncollege_or_university,26794891\ncomedy_club,235266\ncomedy_event,235841\ncommand,2345\ncomment,2341\ncomment_action,2341224\ncomment_count,2341241\ncomment_permission,23410324\ncomment_text,23411291\ncomment_time,234113\ncommunicate,239421\ncommunicate_action,239421224\ncompare,230\ncompete,2301\ncompetitor,23011\ncompilation_album,230624663\ncomplain,23064\ncomplete,23061\ncompleted_action_status,230612249119\ncomplex,230629\ncomposer,2303\ncompound_price_specification,230450799090224\ncomputer_language,230916487\ncomputer_store,2309191\nconcentrate,2494171\nconcentrated,24941715\nconcern,2494\nconcrete,24271\nconductive,245218\nconfess,2409\nconfirm_action,2403224\nconfirmation_number,240324436\nconfuse,24093\nconnected,2421\nconsider,2495\nconsidering,249574\nconsist,24991\nconsume_action,24993224\ncontact_option,24121024\ncontact_page,2412107\ncontact_point_option,24121041024\ncontact_points,24121041\ncontact_type,2412110\ncontain,2414\ncontained_in,24144\ncontained_in_place,24144069\ncontains_place,2414069\ncontains_season,2414934\ncontemporary_folk,241307702\ncontent_location,241416224\ncontent_rating,24141714\ncontent_size,2414193\ncontent_type,2414110\ncontent_url,24141976\ncontinent,241441\ncontinental_jazz,241441673\ncontinue,24149\ncontributor,2417691\ncontrol_action,24176224\nconvenience_store,24844991\nconversation,248924\ncook_action,22224\ncook_time,2213\ncooking_method,224305\ncool_jazz,2673\ncoolmax,26329\ncopyright_holder,207165\ncopyright_year,20719\ncordura,2597\ncorduroy,257\ncoriander_leaf,274560\ncoriander_seed,274595\ncorked,221\ncorn,24\ncorn_salad,24965\ncorporation,20724\ncorrect,2721\ncosmic_disco,2332592\ncotton,214\ncountries_not_supported,241741901\ncountries_supported,2417901\ncountry,2417\ncountry_of_origin,24178774\ncourgette,241\ncourse_code,2925\ncourse_instance,2949149\ncourse_mode,2935\ncourse_prerequisites,290772831\ncourthouse,219\ncoverage_end_time,28774513\ncoverage_start_time,287791113\ncowpunk,2022042\ncrab_boil,27666\ncranberry,27467\ncrape,270\ncrawl,276\ncreamy,273\ncreate_action,271224\ncreative_work,271882\ncreative_work_season,271882934\ncreative_work_series,271882973\ncreator,271\ncredit_card,275125\ncredited_to,27511\ncrematorium,273173\ncretonne,2714\ncrimplene,273064\ncrisp,2790\ncross,279\ncrossover_jazz,279873\ncrossover_thrash,2798072\ncrunk,2742\ncrush,272\ncrushed_red_pepper,2727500\ncrust_punk,2791042\ncubeb,2966\ncubic,2962\ncucumber,29236\ncurium,2973\ncurrant,2741\ncurrencies_accepted,274929015\ncurrency,2749\ncurrency_conversion_service,274924824989\ncurry_ketchup,272120\ncurry_leaf,2760\ncurry_powder,2705\ncustomer,2913\ndaikon,524\ndam,53\ndamage,537\ndamaged_condition,53724524\ndamask,5392\ndamson,5334\ndance_event,549841\ndance_group,54970\ndance_pop,54900\ndance_punk,549042\ndance_rock,54972\ndark_ambient,523641\ndark_cabaret,52267\ndark_electro,526217\ndark_wave,5288\ndarmstadtium,539113\ndata_catalog,51216\ndata_download,515465\ndata_feed,5105\ndata_feed_element,51056341\ndata_feed_item,510513\ndata_type,5110\ndataset_class,269\ndataset_time_interval,134186\ndate_created,51271\ndate_deleted,51561\ndate_issued,512\ndate_modified,51350\ndate_posted,51091\ndate_published,510662\ndate_read,5175\ndate_received,51798\ndate_sent,51941\ndate_time,5113\ndate_vehicle_first_registered,518260917791\ndated_money_specification,515349090224\ndateline,5164\nday_of_week,5882\ndazzle,536\ndeactivate_action,52181224\ndeath_date,5051\ndeath_industrial,50459176\ndeath_metal,50316\ndeath_place,50069\ndeceive,598\ndecide,595\ndecorate,5271\ndecrease,5279\ndeep_house,509\ndefault_value,5061869\ndefence_establishment,504991662341\ndelete_action,561224\ndeliver,568\ndelivery_address,5687579\ndelivery_charge_specification,56871279090224\ndelivery_event,5687841\ndelivery_lead_time,56876513\ndelivery_method,5687305\ndelivery_status,56879119\ndemand,5345\ndemo_album,53663\ndenim,543\ndense,549\ndentist,54191\ndepart_action,501224\ndepartment,501341\ndepartment_store,50134191\ndeparture_airport,501201\ndeparture_bus_stop,501269910\ndeparture_gate,50121\ndeparture_platform,501206103\ndeparture_station,50129124\ndeparture_terminal,50121346\ndeparture_time,501213\ndepend,5045\ndependencies,504549\ndeposit_account,5031241\ndepth,500\ndescribe,59276\ndescription,5927024\ndesert_rock,53172\ndeserve,538\ndestroy,5917\ndetect,5121\ndetroit_techno,5171124\ndevelop,5860\ndiabetic_diet,561251\ndigital_audio_tape_format,5716510031\ndigital_document,5716529341\ndigital_document_permission,57165293410324\ndigital_document_permission_type,5716529341032410\ndigital_format,5716031\ndigital_hardcore,5716\ndijon_ketchup,72120\ndijon_mustard,73915\ndill_seed,5695\ndimensional_lumber,534246636\ndimity,531\ndip,50\ndirectors,5721\ndisagree,597\ndisagree_action,597224\ndisambiguating_description,5936915927024\ndisappear,590\ndisapprove,59078\ndisarm,593\ndisco,592\ndisco_polo,59206\ndiscontinued,59241495\ndiscount,59241\ndiscount_code,5924125\ndiscount_currency,592412749\ndiscover,5928\ndiscover_action,5928224\ndiscusses,5929\ndiscussion_forum_posting,592240730914\ndiscussion_url,59224976\ndislike,5962\ndislike_action,5962224\ndissolution_date,5962451\ndistance,59149\ndistribution,59176924\ndiva_house,589\ndivide,585\ndixieland,529645\ndjmix_album,663\ndonate_action,541224\ndonegal_tweed,546185\ndoom_metal,53316\ndouble,566\ndownload_action,5465224\ndownload_url,5465976\ndownvote_count,5481241\ndraw_action,57224\ndream_house,5739\ndream_pop,57300\ndream_trance,5731749\ndress,579\ndried_lime,57563\ndrill,576\ndrink_action,5742224\ndrive_wheel_configuration,57886240724\ndrive_wheel_configuration_value,57886240724869\ndrone_metal,574316\ndrop,570\ndropoff_location,57006224\ndropoff_time,570013\ndrugget,571\ndrum,573\ndrum_and_bass,5734569\ndry,57\ndry_cleaning_or_laundry,572646457\ndubstep,56910\nduck,52\ndunedin_sound,5454945\nduration,59724\nduration_of_warranty,5972488741\ndurian,574\ndust,591\ndutch_house,5129\ndysprosium,590733\ne_textiles,12916\neast_asian_pepper,914400\neducate,5921\neducation_event,59224841\neducation_requirements,59224728341\neducational_alignment,59224664341\neducational_audience,592246549\neducational_framework,59224607382\neducational_organization,5922464324\neducational_role,59224676\neducational_use,59224693\neight_bits,161\neinsteinium,49143\nelderberry,6567\nelectrician,621724\nelectro,6217\nelectro_backbeat,62176261\nelectro_grime,621773\nelectro_house,62179\nelectro_industrial,6217459176\nelectroacoustic,62172912\nelectronic_art_music,62174213932\nelectronic_rock,62174272\nelectronica,621742\nelectronics_store,621742991\nelectropop,621700\nelementary_school,63417926\nelevation,6824\neligible_customer_type,6766291310\neligible_duration,676659724\neligible_quantity,676628411\neligible_region,6766774\neligible_transaction_volume,676617432248693\nemail_message,36397\nembarrass,3679\nembassy,369\nembed_url,365976\nemergency_service,3749989\nemployee_role,30676\nemployees,306\nemployment_agency,306341749\nemployment_type,30634110\nencodes_creative_work,425271882\nencoding_format,425031\nencoding_type,42510\nencodings,425\nencourage,4277\nend_time,4513\nendive,458\nendorse_action,459224\nengine_specification,4749090224\nentertain,4114\nentertainment_business,41143416349\nentry_point,417041\nenumeration,493724\nepazote,031031\nepic_doom,0253\nepisode_number,095436\nepisodes,095\nestimated_flight_duration,913106159724\nethereal_wave,07688\nethnic_electronica,042621742\neuro_disco,97592\neuropean_free_jazz,97040773\neuropium,9703\nevent_cancelled,8412496\nevent_postponed,8410904\nevent_rescheduled,84172596\nevent_reservation,84173824\nevent_scheduled,84125965\nevent_status,8419119\nevent_status_type,841911910\nevent_venue,841849\nevery_of,878\nexample_of_work,3306882\nexcuse,29293\nexecutable_library_name,329166667743\nexercise,2993\nexercise_action,2993224\nexercise_course,299329\nexercise_gym,299373\nexhibition_event,29624841\nexif_data,51\nexpand,29045\nexpect,29021\nexpected_arrival_from,29021786073\nexpected_arrival_until,29021786416\nexpects_acceptance_of,290212901498\nexperience_requirements,290749728341\nexperimental_rock,2907341672\nexpires,290\nexplain,29064\nexplode,29065\nexponent,290441\nexpressive,290798\nextend,29145\nextracted,291721\nfade,05\nfailed_action_status,0652249119\nfallen_over,0648\nfamily_name,03643\nfast_food_restaurant,09105791741\nfat_content,0124141\nfax_number,029436\nfeature_list,012691\nfees_and_commissions_specification,04523249090224\nfence,049\nfennel,046\nfenugreek,04972\nfermium,033\nfestival,09186\nfiber_content,0624141\nfibonacci,06412\nfile_format,06031\nfilm_action,063224\nfinancial_product,0442607521\nfinancial_service,04426989\nfind_action,045224\nfire_station,09124\nfirst_performance,09100349\nfish_paste,02091\nfish_sauce,0299\nfive_spice_powder,0890905\nflabby,066\nflamboyant,063641\nflannel,0646\nflight_distance,06159149\nflight_number,061436\nflight_reservation,06173824\nfloat,061\nfloor_size,0693\nflops,060\nflorida_breaks,0675672\nflorist,06791\nfold,065\nfolk_punk,02042\nfolktronica,021742\nfood_establishment,0591662341\nfood_establishment_reservation,059166234173824\nfood_event,05841\nfood_friendly,050746\nfood_service,05989\nfounding_date,04551\nfounding_location,0456224\nfour_wheel_drive_configuration,086578240724\nfoxy,029\nfraction,07224\nfrancium,07493\nfreak_folk,07202\nfreestyle,07916\nfreestyle_house,079169\nfrench_house,07429\nfrighten,0714\nfrom_location,0736224\nfront_wheel_drive_configuration,074186578240724\nfruit_ketchup,0712120\nfruit_preserves,0710738\nfry_sauce,0799\nfuel_consumption,096249324\nfuel_efficiency,0960249\nfuel_type,09610\nfuneral_doom,0947653\nfunk_metal,042316\nfunky_house,0429\nfurniture_store,041291\nfustian,0914\ngadolinium,5643\ngame_platform,306103\ngame_play_mode,30635\ngame_server,398\ngame_server_status,3989119\ngame_tip,310\ngarage_punk,74042\ngarage_rock,7472\ngaram_masala,396\ngarden_store,5491\ngarlic_chives,621283\ngarlic_powder,6205\ngarlic_salt,62961\ngas_station,99124\ngated_residence_community,157354923941\ngem_squash,739282\ngender_type,74510\ngeneral_contractor,7476241721\ngeo_circle,9926\ngeo_coordinates,92541\ngeo_midpoint,935041\ngeo_radius,9759\ngeographic_area,770267\nginger,747\ngiven_name,8443\nglam_metal,63316\nglam_rock,6372\nglass_brick,69672\nglass_fiber,6906\nglass_wool,6986\nglobal_location_number,6666224436\nglue_laminate,66341\ngluten_free_diet,6140751\ngoji_berry,67\ngolf_course,6029\ngood_relations_class,57624269\ngood_relations_terms,5762413\ngooseberry,367\ngothic_metal,02316\ngothic_rock,0272\ngovernment_building,843416654\ngovernment_office,8434109\ngovernment_organization,843414324\ngovernment_permit,84341031\ngovernment_service,84341989\ngrains_of_paradise,7480759\ngrains_of_selim,748\ngrapefruit,70071\ngravel,786\ngreater_galangal,71646\ngreater_or_equal,71286\ngreen_pepper,7400\ngreen_peppercorn,740024\ngrenadine,7454\ngrenfell_cloth,7406260\ngrocery_store,79791\ngroove_metal,78316\ngrosgrain,774\ngroup_boarding_policy,70654069\nguacamole,8236\nguarantee,741\ngypsum_board,709365\nhabanero,647\nhaircloth,260\nhalal_diet,6651\nhard_bop,560\nhard_dance,5549\nhard_rock,572\nhard_trance,51749\nhardcover,528\nhardware_store,5891\nharris_tweed,79185\nhas_course_instance,82949149\nhas_delivery_method,85687305\nhas_digital_document_permission,857165293410324\nhas_map,830\nhas_menu,8349\nhas_menu_item,834913\nhas_menu_section,83499224\nhas_offer_catalog,80216\nhas_part,801\nheadline,564\nhealth_and_beauty_business,60456916349\nhealth_club,60266\nhearing_impaired_supported,74305901\nheavy_metal,8316\nherbaceous,629\nherbal,66\nherbes_de_provence,50789\nherbs_and_spice,645909\nhertz,19\nhigh_ranking,7424\nhindu_diet,4551\nhindu_temple,451306\nhobby_shop,620\nhodden,54\nhoja_santa,941263\nholmium,633\nholy_basil,6636\nhome_and_construction_business,345249172246349\nhome_goods_store,3591\nhome_location,36224\nhome_team,313\nhoney_dill,456\nhoneydew,459\nhonorific_prefix,470207029\nhonorific_suffix,47029029\nhorror_punk,7042\nhorseradish,9752\nhospital,9016\nhosting_organization,914324\nhot_mustard,13915\nhot_sauce,199\nhotel_room,1673\nhoundstooth,4310\nhours_available,8666\nhouse_painter,9047047\nhttp_method,12110305\nhuckleberry,2667\niata_code,125\nice_cream_shop,927320\nidentify,5410\nidli_podi,56\nignore_action,4224\nillustrator,69171\nimage_gallery,3767\nimage_object,376721\nimagine,374\nimpress,3079\nimprove,3078\nin_broadcast_lineup,4675291640\nin_language,46487\nin_playlist,406691\nin_stock,4912\nin_store_only,49146\nincentive_compensation,494182304924\nincentives,49418\ninclude,4265\nincluded_composition,42655230324\nincluded_data_catalog,4265551216\nincluded_in_data_catalog,42655451216\nincludes_object,42656721\nincrease,4279\nindian_bay_leaf,454660\nindie_folk,4502\nindie_pop,4500\nindie_rock,4572\nindium,453\nindividual_product,4587607521\nindustrial,459176\nindustrial_folk,45917602\nindustrial_metal,459176316\nindustrial_rock,45917672\nindustry,45917\nineligible_region,46766774\ninfluence,40649\ninform,403\ninform_action,403224\ningredients,47541\ninject,4721\ninsert_action,491224\ninstall_action,4916224\ninstall_url,4916976\ninstructor,491721\ninstrument,4917341\ninsurance_agency,42749749\nintangible,414466\nintellectually_satisfying,416212691904\nintelligent_drum_and_bass,4167415734569\nintend,4145\ninteract_action,41721224\ninteraction_counter,417224241\ninteraction_service,417224989\ninteraction_statistic,417224911912\ninteraction_type,41722410\ninteractivity_type,417218110\ninterest,41791\ninterest_rate,4179171\ninterfere,410\ninternet_cafe,414120\ninterrupt,41701\nintroduce,417599\ninvent,4841\ninventory_level,48417686\ninvestment_or_deposit,4893415031\ninvite,481\ninvite_action,481224\ninvoice,489\nirish_linen,72644\nirritate,711\nis_accessible_for_free,329966007\nis_accessory_or_spare_part_for,3299790010\nis_based_on,3694\nis_based_on_url,3694976\nis_consumable_for,324993660\nis_family_friendly,30360746\nis_gift,301\nis_live_broadcast,368675291\nis_part_of,3018\nis_related_to,376151\nis_similar_to,39361\nis_variant_of,387418\nissue_number,2436\nissued_through,207\nitalo_dance,16549\nitalo_disco,16592\nitalo_house,169\nitem_availability,1386661\nitem_condition,1324524\nitem_list,13691\nitem_list_element,136916341\nitem_list_order,136915\nitem_list_order_ascending,1369159459454\nitem_list_order_descending,1369155945\nitem_list_order_type,13691510\nitem_list_unordered,13691455\nitem_offered,130\nitem_page,1307\nitem_reviewed,13789\nitem_shipped,1320\njackfruit,72071\njalapeno,6049\njamaican_jerk_spice,732472909\njazz_blues,73663\njazz_funk,73042\njazz_fusion,730944\njazz_rap,7370\njazz_rock,7372\njerusalem_artichoke,779631122\njewelry_store,76791\njicama,23\njob_benefits,766401\njob_location,766224\njob_posting,760914\njob_title,76116\njoin_action,74224\njudge,77\njujube,776\njump_up,7300\njuniper_berry,74067\nkente_cloth,241260\nkerseymere,233\nketchup,2120\nkevlar,286\nkeywords,285\nkhaki_drill,22576\nkidney_bean,25464\nkill,26\nkimchi,2312\nkiwi_fruit,28071\nknock,42\nknown_vehicle_damages,44826537\nkohlrabi,2676\nkosher_diet,2251\nkrautrock,27172\nkumquat,23281\nlabel,666\nlake_body_of_water,6265881\nlampas,6309\nlandform,6403\nlandlord,6465\nlandmarks_or_historical_buildings,6432917266654\nlanguage,6487\nlanthanum,64043\nlaser_disc_format,63592031\nlaser_like,6362\nlast_reviewed,691789\nlatin_house,6149\nlatin_jazz,61473\nlatitude,61195\nlaugh,60\nlaunch,642\nlavender,6845\nlawrencium,67493\nlearning_resource_type,64479910\nleathery,697\nleave_action,68224\nleft_hand_driving,601455784\nlegal_name,6643\nlegal_service,66989\nlegislative_building,6796186654\nlegume,693\nlei_code,625\nlemon,634\nlemon_balm,63463\nlemon_grass,63479\nlemon_myrtle,634316\nlemon_pepper,63400\nlemon_verbena,634864\nlend_action,645224\nlender,645\nlentils,6416\nlesser,69\nlesser_galangal,69646\nlesser_or_equal,69286\nlettuce,619\nlibrary,6677\nlicense,6949\nlike_action,62224\nlikely,626\nlima_bean,6364\nlimited_availability,631586661\nlinen,644\nliquid_funk,6285042\nliquor_store,6291\nliquorice,6272\nlist,691\nlist_item,69113\nlisten,694\nlisten_action,694224\nliter,61\nliterary_event,6177841\nlithium,603\nlive_album,68663\nlive_blog_posting,68660914\nlive_blog_update,6866051\nload,65\nloan_or_credit,642751\nloan_term,6413\nlocal_business,6266349\nlocate,621\nlocation,6224\nlocation_created,6224271\nlocation_feature_specification,62240129090224\nlocker_delivery,625687\nlocksmith,62930\nloden,654\nlodging_business,6746349\nlodging_reservation,67473824\nlodging_unit_description,6749415927024\nlodging_unit_type,67494110\nlong_pepper,6400\nlongitude,64195\nlook,62\nloquat,6281\nlose_action,63224\nloser,63\nlovage,687\nlow_calorie_diet,626751\nlow_fat_diet,60151\nlow_lactose_diet,6621351\nlow_price,6079\nlow_ranking,67424\nlow_salt_diet,696151\nlutetium,6123\nlychee,612\nlyricist,67991\nlyrics,672\nmachine_knitting,324414\nmadras,3579\nmagnesium,3433\nmain_content_of_page,3424141807\nmain_entity,34411\nmain_entity_of_page,34411807\nmainstream_jazz,34917373\nmakes_offer,320\nmale,36\nmanage,347\nmandarine,34574\nmanganese,3443\nmango_ginger,34747\nmango_pickle,34026\nmanufacturer,34902127\nmap_category_type,3021710\nmap_type,3010\nmarjoram,3773\nmarry_action,37224\nmastic,3912\nmatch,312\nmaterial,3176\nmath_rock,3072\nmatter,31\nmax_price,329079\nmax_value,329869\nmaximum_attendee_capacity,329331452091\nmayonnaise,343\nmeal_service,36989\nmedia_object,356721\nmedical_organization,35264324\nmedieval_metal,3586316\nmedium,353\nmedium_ranking,3537424\nmeitnerium,31473\nmelodic_death_metal,365250316\nmelt,361\nmember_of,3368\nmembers,336\nmembership_number,33620436\nmemorise,3373\nmemory_requirements,337728341\nmendeleev,34560\nmendelevium,345683\nmens_clothing_store,269491\nmentions,3424\nmenu_item,34913\nmenu_section,3499224\nmerchant,31241\nmercury,3297\nmesh,32\nmess_up,390\nmessage,397\nmessage_attachment,397112341\nmicrofiber,32706\nmicrohouse,3436\nmiddle_school,356926\nmignonette_sauce,3494199\nmileage_from_odometer,367073531\nmilk,362\nmin_price,34079\nmin_value,34869\nminimum_payment_due,3433034159\nminus,349\nminute,341\nmiss,39\nmix,329\nmixed_spice,3291909\nmixtape_album,32910663\nmobile_application,36606224\nmobile_phone_store,3660491\nmodal_jazz,35673\nmodified_time,35013\nmoleskin,36924\nmolybdenum,366543\nmonday,345\nmonetary_amount,3417341\nmonkey_gland_sauce,34264599\nmontreal_steak_seasoning,341769129344\nmoquette,321\nmosque,392\nmost_of,3918\nmotel,316\nmotorcycle_dealer,3192656\nmotorcycle_repair,3192670\nmountain,3414\nmourn,34\nmove_action,38224\nmovie,38\nmovie_clip,38260\nmovie_rental_store,38741691\nmovie_series,38973\nmovie_theater,3801\nmoving_company,3842304\nmuddle,356\nmugwort,381\nmulberry,3667\nmulling_spices,36909\nmultiple_values,36106869\nmultiply,36106\nmung_bean,3464\nmurder,35\nmuseum,3933\nmushroom,3273\nmushroom_ketchup,32732120\nmusic_album,3932663\nmusic_album_production_type,393266307522410\nmusic_album_release_type,393266376910\nmusic_arrangement,3932744341\nmusic_by,39326\nmusic_composition,3932230324\nmusic_composition_form,393223032403\nmusic_event,3932841\nmusic_group,393270\nmusic_group_member,393270336\nmusic_playlist,393206691\nmusic_recording,39327254\nmusic_release,3932769\nmusic_release_format,3932769031\nmusic_release_format_type,393276903110\nmusic_store,393291\nmusic_venue,3932849\nmusic_video_object,3932856721\nmusical_key,393262\nmuslin,3364\nmustard_green,391574\nmustard_oil,39156\nnail_salon,46964\nnainsook,4492\nnamed_position,430324\nnankeen,4424\nnationality,42461\nnavy_bean,4864\nnectarine,42174\nnegative,418\nneo_bop_jazz,46073\nneo_psychedelia,49256\nneo_swing,4984\nneodymium,4533\nneptunium,401943\nnest,491\nnet_worth,4180\nnew_age,497\nnew_beat,4961\nnew_condition,4924524\nnew_prog,4907\nnew_rave,4978\nnew_wave,4988\nnew_zealand_spinach,4936459047\nnews_article,493126\nnewton,4914\nnext,4291\nnext_item,429113\nngo,47\nnickel,426\nnigella,476\nnight_club,41266\nniobium,463\nnobelium,4663\nnoise_pop,4300\nnoise_rock,4372\nnon_equal,44286\nnone_of,448\nnot_at_all,4116\nnotary,417\nnote_digital_document,415716529341\nnotice,419\nnovelty_ragtime,4861713\nnu_disco,49592\nnu_jazz,4973\nnu_metal,49316\nnu_skool_breaks,49672\nnull,46\nnum_adults,561\nnum_children,126574\nnumber,436\nnumber_of_airbags,43686\nnumber_of_axles,4368296\nnumber_of_beds,436865\nnumber_of_doors,436853\nnumber_of_employees,4368306\nnumber_of_episodes,4368095\nnumber_of_forward_gears,4368085\nnumber_of_items,436813\nnumber_of_pages,436807\nnumber_of_players,436806\nnumber_of_previous_owners,436807894\nnumber_of_rooms,436873\nnumber_of_seasons,4368934\nnumbered_position,4360324\nnut,41\nnutmeg,413\nnutrition,491724\nnutrition_information,49172440324\nnutritional_yeast,4917246991\noaked,21\nobject,6721\nobserve,638\nobtain,614\noccupancy,29049\noccupational_category,290246217\nocean_body_of_water,2465881\noffer_catalog,0216\noffer_count,0241\noffer_item_condition,01324524\noffice_equipment_store,0928034191\noffline_permanently,064034416\noffline_temporarily,064130776\noilskin,6924\nold_bay_seasoning,6569344\noldschool_jungle,746\nolefin,604\nolive,68\nolive_oil,686\non_demand_event,45345841\non_site_pickup,491020\none_of,848\nonion,494\nonion_powder,49405\nonline,464\nonline_full,46406\nonline_only,46446\nopening_hours,044\nopening_hours_specification,0449090224\noperating_system,0719913\nopponent,0441\noption,024\nopulent,09641\norange,744\norchestral_jazz,2917673\norchestral_uplifting,2917606014\norder_action,5224\norder_cancelled,52496\norder_date,551\norder_delivered,5568\norder_delivery,55687\norder_in_transit,5417491\norder_item_number,513436\norder_item_status,5139119\norder_number,5436\norder_payment_due,5034159\norder_pickup_available,50208666\norder_problem,507663\norder_processing,50799\norder_quantity,528411\norder_returned,5714\norder_status,59119\nordered_item,513\norgandy,45\norganization,4324\norganization_role,432476\norganize_action,43224\noriented_strand_board,7419174565\norigin_address,774579\nosmium,333\nosnaburg,346\nottoman,134\nout_of_stock,18912\noutlet_store,16191\noverflow,806\nowned_from,4073\nowned_through,407\nownership_info,42040\noxford,2905\noxidized,2953\npaduasoy,0599\npage_end,0745\npage_start,07911\npagination,07424\npaint_action,041224\npainting,0414\npaisley_underground,03645745\npalladium,0653\npaperback,0062\nparallel_strand_lumber,076691745636\nparcel_delivery,0965687\nparcel_service,096989\nparent_audience,0741549\nparent_item,074113\nparent_organization,07414324\nparent_service,0741989\nparking_facility,020961\nparking_map,0230\nparsley,096\nparsnip,0940\npart_of_episode,018095\npart_of_invoice,018489\npart_of_order,0185\npart_of_season,018934\npart_of_series,018973\npart_of_tvseries,018\nparticipant,019041\npascal,0926\npashmina,0234\npass,09\npassenger_priority_status,094707719119\npassenger_sequence_number,094792849436\npatty_pan,0104\npause,03\npawn_shop,0420\npay_action,0224\npayment_accepted,034129015\npayment_automatically_applied,034113126065\npayment_card,034125\npayment_charge_specification,03411279090224\npayment_complete,034123061\npayment_declined,03415264\npayment_due,034159\npayment_due_date,03415951\npayment_method,0341305\npayment_method_id,03413055\npayment_past_due,034109159\npayment_service,0341989\npayment_status,03419119\npayment_status_type,0341911910\npayment_url,0341976\npeach,012\npedal,056\npeople_audience,006549\npepper_jelly,0076\npercale,026\npercent,0941\nperform_action,003224\nperformance_role,0034976\nperformer_in,0034\nperformers,003\nperforming_arts_theater,003101\nperforming_group,00370\nperhaps,009\nperilla,076076\nperiodical,07526\npermission_type,032410\npermit,031\npermit_audience,031549\npermitted_usage,031997\npersimmon,0934\nperson,094\nperuvian_pepper,078400\npet_store,0191\npets_allowed,016\nphotograph_action,0170224\nphotos,01\nphysalis,0969\npiccalilli,0266\npickled_cucumber,026529236\npickled_fruit,0265071\npickled_onion,0265494\npickled_pepper,026500\npickup_location,0206224\npickup_time,02013\npico_de_gallo,0256\npin_stripes,049170\npineapple,0406\npinto_bean,04164\npixel,0296\nplace,069\nplace_of_worship,0698820\nplan_action,064224\nplant,0641\nplastic,06912\nplastic_laminate,069126341\nplay_action,06224\nplay_mode,0635\nplayer_type,0610\nplayers_online,06464\nplayground,06745\nplutonium,06143\nplywood,0685\npoint,041\npolar_fleece,06069\npolice_station,0699124\npolish,062\npolonium,0643\npolyester,0691\npolygon,064\npolystyrene,069174\npolyurethane,069704\npomegranate,03741\npomegranate_seed,0374195\npomelo,036\npond,045\npongee,047\npop,00\npop_punk,00042\npop_rock,0072\npopcorn_seasoning,00249344\npoplin,0064\npoppy_seed,0095\npossess,039\npossibly,0966\npost,091\npost_bop,09160\npost_britpop,09167100\npost_disco,091592\npost_grunge,091744\npost_metal,091316\npost_office,09109\npost_office_box_number,09109629436\npost_punk,091042\npost_punk_revival,0910427886\npost_rock,09172\npostal_address,0916579\npostal_code,091625\npotassium,0193\npotato,011\npotential_action,01426224\npotential_action_status,014262249119\npowder_douce,0559\npower_electronics,06217429\npower_metal,0316\npower_noise,043\npower_pop,000\npowerful,006\npractise,07219\npraseodymium,073533\npray,07\npre_order,075\npre_sale,0796\npreach,0712\nprecede,0795\npredecessor_of,075998\nprep_time,07013\nprepare,070\nprepend_action,07045224\npreschool,07926\npresent,07341\npresentation_digital_document,07341245716529341\npreserve,0738\npretend,07145\nprevent,07841\nprevious,0789\nprevious_item,078913\nprevious_start_date,078991151\nprice,079\nprice_component,079230441\nprice_currency,0792749\nprice_range,079744\nprice_specification,0799090224\nprice_type,07910\nprice_valid_until,079865416\nprick,072\nprimary_image_of_page,073737807\nprint,0741\nprint_column,0741263\nprint_edition,0741524\nprint_page,074107\nprint_section,07419224\nprivate,0781\nprocessing_time,079913\nprocessor_requirements,0799728341\nproduces,07599\nproduct,07521\nproduct_id,075215\nproduct_model,07521356\nproduct_supported,07521901\nproduction_company,0752242304\nproduction_date,07522451\nprofessional_service,070246989\nproficiency_level,070249686\nprofile_page,070607\nprogram_membership,33620\nprogram_membership_used,33620935\nprogram_name,43\nprogramming_language,077346487\nprogramming_model,07734356\nprogressive,07798\nprogressive_breaks,07798672\nprogressive_drum_bass,0779857369\nprogressive_folk,0779802\nprogressive_house,077989\nprogressive_metal,07798316\nprogressive_rock,0779872\nprogressive_techno,07798124\npromethium,07303\npromise,0739\nproperty_id,07015\nproperty_value,0701869\nproperty_value_specification,07018699090224\nprotactinium,0712143\nprotect,07121\nprotein_content,071424141\nprovider,0785\nprovider_mobility,07853661\nprovides_broadcast_service,0785675291989\nprovides_service,0785989\npsychedelic_folk,9256202\npsychedelic_rock,9256272\npsychedelic_trance,925621749\npublic_holidays,066265\npublic_swimming_pool,0662983406\npublication,066224\npublication_event,066224841\npublication_issue,0662242\npublication_volume,0662248693\npublished_on,06624\npublisher,0662\npublishing_principles,06624074906\npull,06\npump,030\npumpkin,0324\npumpkin_pie_spice,03240909\npuncture,0412\npunk_jazz,04273\npunk_rock,04272\npurchase_date,012951\npurple_mangosteen,00634914\npush,02\nqualifications,2860224\nqualitative_value,286118869\nquantitative_value,2841118869\nquantity,28411\nquery,287\nquest,2891\nquestion,289124\nquince,2849\nquote_action,281224\nr_news,493\nrace,79\nradiate,751\nradio_channel,751246\nradio_clip,75260\nradio_episode,75095\nradio_season,75934\nradio_series,75973\nradio_station,759124\nradish,752\nraga_rock,772\nragtime,713\nrambutan,73614\nrammed_earth,730\nrank,742\nrap_metal,70316\nrap_rock,7072\nraspberry,7367\nrating_count,714241\nrating_value,714869\nreact_action,721224\nread_action,75224\nread_permission,750324\nreal_estate_agent,76911741\nrealise,763\nrear_wheel_drive_configuration,786578240724\nreceive,798\nreceive_action,798224\nrecently,79416\nrecipe,790\nrecipe_category,790217\nrecipe_cuisine,7902834\nrecipe_ingredient,79047541\nrecipe_instructions,7904917224\nrecipe_yield,790965\nrecipient,79041\nrecognise,7243\nrecord,725\nrecord_label,725666\nrecorded_as,7253\nrecorded_at,7251\nrecorded_in,7254\nrecording_of,72548\nrecycling_center,7926941\nredcurrant,752741\nreduce,7599\nreference_quantity,7074928411\nreferences_order,707495\nrefined,7045\nreflect,70621\nrefurbished_condition,706224524\nrefuse,7093\nregions_allowed,7746\nregister_action,7791224\nregret,771\nreject,7721\nreject_action,7721224\nrejoice,779\nrelated_link,7615642\nrelated_to,76151\nrelax,7629\nrelease,769\nrelease_date,76951\nrelease_notes,76941\nrelease_of,7698\nreleased_event,769841\nrelish,762\nremain,734\nremaining_attendee_capacity,73441452091\nremember,7336\nremind,7345\nremix_album,7329663\nremoulade,7365\nremove,738\nrent_action,741224\nrental_car_reservation,7416273824\nreplace_action,7069224\nreplacer,7069\nreply,706\nreply_action,706224\nreply_to_url,7061976\nreport,701\nreport_number,701436\nrepresentative_of_page,70734118807\nreproduce,707599\nrequest,72891\nrequire,728\nrequired_collateral,728526176\nrequired_gender,7285745\nrequired_max_age,72853297\nrequired_min_age,7285347\nrequirements,728341\nrequires_subscription,72896927024\nrescue,7929\nresearcher,7912\nreservation,73824\nreservation_cancelled,738242496\nreservation_confirmed,7382424035\nreservation_for,738240\nreservation_hold,7382465\nreservation_id,738245\nreservation_package,73824027\nreservation_pending,738240454\nreservation_status,738249119\nreservation_status_type,73824911910\nreserve_action,738224\nreserved_ticket,7385121\nreservoir,7388\nresidence,73549\nresort,731\nresponsibilities,79049661\nrestaurant,791741\nrestricted_diet,791721551\nresult,7361\nresult_comment,73612341\nresult_review,7361789\nresume_action,7393224\nreticent,71941\nreturn,714\nreturn_action,714224\nreview_action,789224\nreview_body,78965\nreview_count,789241\nreview_rating,789714\nreviewed_by,7896\nreviews,789\nrhenium,743\nrhodium,753\nrhubarb,766\nrich,712\nright_hand_driving,71455784\nrinse,749\nriot_grrrl,71776\nripstop,70910\nrisk,792\nriver_body_of_water,7865881\nrobot,761\nrock_and_roll,724576\nrock_in_opposition,7240324\nrock_melon,72364\nroentgenium,74143\nrole_name,7643\nroofing_contractor,704241721\nrose,73\nrosemary,7337\nrot,71\nround,745\nrsvp_action,7980224\nrsvp_response,798079049\nrsvp_response_maybe,79807904936\nrsvp_response_no,7980790494\nrsvp_response_type,79807904910\nrsvp_response_yes,79807904999\nrubidium,7653\nruin,74\nrunner_bean,7464\nruntime,7413\nruntime_platform,741306103\nrussell_cord,79625\nrutabaga,716\nruthenium,7043\nrutherfordium,79053\nsaffron,9074\nsalad_cream,965273\nsalad_dressing,9655794\nsalal_berry,96667\nsalary_currency,9672749\nsalsa,969\nsalsa_golf,96960\nsalt,961\nsalt_and_pepper,9614500\nsamarium,9373\nsambal,9366\nsame_as,933\nsamite,931\nsample_type,930610\nsarsaparilla,99076\nsassafras,99079\nsatisfactory,9190217\nsatisfy,9190\nsatsuma,9193\nsaturated_fat_content,9127150124141\nsaturday,915\nsavory,987\nscallion,9264\nscandium,92453\nscarce,929\nscarlet,9261\nscatter,921\nschedule_action,2596224\nscheduled_payment_date,25965034151\nscheduled_time,2596513\nschema_version,923824\nscholarly_article,9266126\nscold,9265\nscorch,9212\nscrape,9270\nscratch,92712\nscreen_count,9274241\nscreening_event,92744841\nscreenshot,927421\nscrew,927\nscribble,92766\nscrub,9276\nsculpture,926012\nsea_body_of_water,965881\nsea_silk,9962\nseaborgium,963\nsearch_action,912224\nsearch_results_page,912736107\nseason_number,934436\nseasons,934\nseat_number,91436\nseat_row,917\nseat_section,919224\nseating_map,91430\nseating_type,91410\nsecond,9245\nsecurity_screening,9297192744\nseersucker,992\nself_storage,9609177\nsell_action,96224\nsend_action,945224\nserge,97\nserial_number,976436\nseries,973\nserve,98\nserver_status,989119\nserves_cuisine,982834\nservice,989\nservice_area,9897\nservice_audience,989549\nservice_channel,9891246\nservice_location,9896224\nservice_operator,989071\nservice_output,989101\nservice_phone,98904\nservice_postal_address,9890916579\nservice_sms_number,989939436\nservice_type,98910\nservice_url,989976\nserving_size,98493\nsesame,993\nsesame_oil,9936\nshade,25\nshare_action,2224\nsharena_sol,9696\nshelter,261\nshiplap,2060\nshiso,29\nshiver,28\nshock,22\nshoe_store,291\nshoegaze,234\nshop,20\nshopping_center,204941\nshot_silk,21962\nshrug,27\nsiblings,9664\nsichuan_pepper,9128400\nsignal,946\nsignificant_link,940241642\nsignificant_links,9402416429\nsilky,962\nsilver,968\nsingle_family_residence,94603673549\nsingle_player,94606\nsingle_release,946769\nsisal,996\nsite_navigation_element,9148246341\nsixty_minutes,9291341\nska_jazz,9273\nska_punk,92042\nskate_punk,921042\nski_resort,92731\nskills,926\nskip,920\nskirret,9271\nsku,92929\nslip,960\nsludge_metal,967316\nsmile,936\nsmoking_allowed,93246\nsmooth,939\nsmooth_jazz,93973\nsnap_pea,9400\nsnatch,9412\nsneeze,943\nsniff,940\nsocial_event,926841\nsocial_media_posting,926350914\nsodium,953\nsodium_content,95324141\nsoft_rock,90172\nsoftware_add_on,90854\nsoftware_application,90806224\nsoftware_help,90860\nsoftware_requirements,908728341\nsoftware_source_code,9089925\nsoftware_version,908824\nsold_out,9651\nsome_of,938\nsome_products,9307521\nsoul_jazz,9673\nsound_art,9451\nsoundtrack_album,94172663\nsource_organization,994324\nsouthern_rock,99472\nsoy_bean,964\nsoy_sauce,999\nspace_disco,909592\nspace_house,9099\nspace_rock,90972\nspaghetti_squash,9019282\nspandex,904529\nspatial,9026\nspatial_coverage,90262877\nspecial_commitments,9026231341\nspecial_opening_hours_specification,90260449090224\nspecialty,90261\nspeed_garage,90574\nspeed_metal,905316\nspider_silk,905962\nspinach,9047\nspoken_word_album,902485663\nsponsor,9049\nsporting_goods_store,9014591\nsports_activity_location,90121816224\nsports_club,901266\nsports_event,901841\nsports_organization,9014324\nsports_team,90113\nspray,907\nspreadsheet_digital_document,9075215716529341\nsprout,9071\nsquare,928\nsqueak,9282\nsqueal,9286\nsqueeze,9283\nsriracha,9712\nstack_exchange,912291247\nstadium_or_arena,915374\nstamp,9130\nstar_anise,9149\nstar_fruit,91071\nstar_rating,91714\nstart_date,91151\nstart_time,91113\nstate,911\nstatus,9119\nsteak_sauce,91299\nsteering_position,91740324\nsteering_position_value,91740324869\nstep_value,910869\nsti_accommodation_ontology,235244167\nsticker,912\nstitch,9112\nstone,914\nstoner_rock,91472\nstorage_requirements,9177728341\nstraight_ahead_jazz,9171573\nstrawberry,91767\nstreet_address,9171579\nstreet_punk,9171042\nstrengthen,917404\nstretch,91712\nstride_jazz,917573\nstrip,9170\nstrontium,917413\nstructured,917212\nstructured_value,917212869\nstub_tex,916\nstudio_album,9195663\nstuff,910\nstyrofoam,91703\nsub_events,96841\nsub_organization,964324\nsub_reservation,9673824\nsubscribe_action,969276224\nsubtitle_language,961166487\nsubtract,961721\nsubway_station,9689124\nsucceed,9295\nsuccessor_of,92998\nsuck,92\nsugar_content,224141\nsuggest,9791\nsuggested_answer,979149\nsuggested_gender,9791745\nsuggested_max_age,97913297\nsuggested_min_age,9791347\nsuit,91\nsuitable_for_diet,9166051\nsumac,932\nsunday,945\nsung_poetry,94017\nsuper_event,90841\nsupply,906\nsupport,901\nsupporting_data,90151\nsuppose,903\nsurf_rock,9072\nsurface,909\nsurprise,9073\nsurround,9745\nsuspect,99021\nsuspend,99045\nsuspend_action,99045224\nsweet,981\nsweet_chilli_sauce,98112699\nsweet_potato,981011\nswing,984\nswing_house,9849\nswitch,9812\nsymphonic_metal,93042316\nsyrup,970\ntabasco_pepper,169200\ntable,166\ntaffeta,101\ntake_action,12224\ntamarillo,1376\ntamarind,13745\ntandoori_masala,1457396\ntangerine,14474\ntannic,142\ntantalum,14163\ntarget_collection,1126224\ntarget_description,115927024\ntarget_platform,1106103\ntarget_product,1107521\ntarget_url,11976\ntartan,114\ntartar_sauce,1199\ntasmanian_pepper,1334400\ntattersall,1196\ntattoo_parlor,1106\ntax_id,1295\ntaxi_reservation,12973824\ntaxi_service,129989\ntaxi_stand,1299145\ntech_article,12126\ntech_house,129\ntech_trance,121749\ntechnetium,12423\ntechnical_death_metal,1242650316\ntechno_dnb,124\ntechno_folk,12402\ntelephone,1604\ntelevision_channel,168441246\ntelevision_station,168449124\ntemporal,13076\ntemporal_coverage,130762877\ntennis_complex,149230629\nteriyaki_sauce,179299\nterra_cotta,1721\nterrazzo,1719\ntewkesbury_mustard,3915\ntext,1291\ntext_digital_document,12915716529341\nthai_basil,1636\nthank,042\ntheater_event,01841\ntheater_group,0170\ntherefore,90\nthese_folks,9302\nthing,04\nthird_stream,059173\nthorium,073\nthrash_metal,072316\nthulium,063\nthumbnail,0346\nthumbnail_url,0346976\nthursday,035\ntick,12\nticker_symbol,129366\nticket,121\nticket_number,121436\nticket_token,121124\nticketed_seat,12191\ntickle,126\ntie_action,1224\ntight,11\ntimber,136\ntime,13\ntime_required,137285\ntip_action,10224\ntire_shop,120\ntitanium,1143\ntitle,116\nto_location,16224\ntoll_free,1607\ntomato,131\ntonka_bean,64\ntotal_payment_due,116034159\ntotal_price,116079\ntotal_time,11613\ntouch,112\ntourist_attraction,179117224\ntourist_information_center,179140324941\ntoy_store,191\ntoytown_techno,114124\ntrace,179\ntrack_action,172224\ntracking_number,1724436\ntracking_url,1724976\ntrad_jazz,17573\ntrade,175\ntrade_action,175224\ntraditional_doom,17524653\ntrailer,176\ntrain,174\ntrain_name,17443\ntrain_number,174436\ntrain_reservation,17473824\ntrain_station,1749124\ntrain_trip,174170\ntrance,1749\ntrans_fat_content,17430124141\ntranscript,17492701\ntransfer_action,17490224\ntransit_map,1749130\ntranslator,174961\ntransparent,17490741\ntransport,174901\ntravel,1786\ntravel_action,1786224\ntravel_agency,1786749\ntremble,17366\ntribal_house,17669\ntrick,172\ntrip,170\ntrip_hop,1700\ntrot,171\ntrouble,1766\ntrust,1791\ntry,17\ntubers,196\ntuesday,1935\ntulle,16\ntumble,1366\ntungsten,14914\nturmeric,1372\nturn,14\nturnip,140\ntwee_pop,1800\ntweed,185\ntwenty_four_hour,18410\ntwill,186\ntwist,1891\ntype,10\ntype_and_quantity_node,10452841145\ntype_of_bed,10865\ntype_of_good,1085\ntypical_age_range,10267744\nugli_fruit,071\nun_register_action,47791224\nunblemished,466321\nunctuous,4199\nunder_name,4543\nundress,4579\nunfasten,4094\nunicode,9425\nunit_code,94125\nunit_price_specification,9410799090224\nunit_text,9411291\nunite,941\nunknown,444\nunlikely,4626\nunlock,462\nunlocked,4621\nunpack,402\nunsatisfactory,49190217\nunsaturated_fat_content,49127150124141\nuntidy,415\nupdate_action,051224\nuplifting_trance,060141749\nupload_date,06551\nupvote_count,081241\nuranium,9743\nurbanite,641\nurl,976\nurl_template,97613061\nuse_action,93224\nused_condition,93524524\nuser_blocks,93662\nuser_checkins,931224\nuser_comments,932341\nuser_downloads,935465\nuser_interaction,93417224\nuser_interaction_count,93417224241\nuser_likes,9362\nuser_page_visits,9307831\nuser_plays,9306\nuser_plus_ones,9306984\nuser_tweets,93181\nvalid_for,8650\nvalid_from,865073\nvalid_in,8654\nvalid_through,86507\nvalid_until,865416\nvalue,869\nvalue_added_tax_included,869512942655\nvalue_max_length,869329640\nvalue_min_length,86934640\nvalue_name,86943\nvalue_pattern,869014\nvalue_reference,86970749\nvalue_required,8697285\nvanadium,8453\nvanilla,846\nvanillin,8464\nvat_id,815\nvegan_diet,8451\nvegetable_flannel,871660646\nvegetal,8716\nvegetarian_diet,8717451\nvehicle,826\nvehicle_configuration,826240724\nvehicle_engine,826474\nvehicle_identification_number,8265410224436\nvehicle_interior_color,82641726\nvehicle_interior_type,82641710\nvehicle_model_date,82635651\nvehicle_seating_capacity,8269142091\nvehicle_special_usage,8269026997\nvehicle_transmission,8261743324\nvelveteen,86814\nvelvety,8681\nvenue_map,84930\nversion,824\nvideo_format,85031\nvideo_frame_size,8507393\nvideo_gallery,8567\nvideo_game,853\nvideo_game_clip,853260\nvideo_game_series,853973\nvideo_object,856721\nvideo_quality,852861\nvietnamese_coriander,814332745\nview_action,89224\nviking_metal,824316\nvino_cotto,8484\nvinyl_coated_polyester,846210691\nvinyl_format,846031\nvisit,831\nvisual_arts_event,8461841\nvisual_artwork,846182\nvocal_house,8269\nvocal_jazz,82673\nvocal_trance,8261749\nvolcano,8624\nvolt,861\nvolume_number,8693436\nvote_action,81224\nwallpaper,8600\nwant,841\nwant_action,841224\nwarm,83\nwarranty,8741\nwarranty_promise,87410739\nwarranty_scope,8741920\nwatch,812\nwatch_action,812224\nwater_chestnut,8112941\nwatercress,81279\nwaterfall,8106\nwatermelon,81364\nwatermelon_rind_preserves,813647450738\nwave,88\nwear_action,8224\nweb_application,8606224\nweb_checkin_time,86122413\nweb_page,8607\nweb_page_element,86076341\nweb_site,8691\nwednesday,8435\nweight,81\nwelcome,8623\nwest_coast_jazz,89129173\nwestern,8914\nwhipcord,8025\nwhisper,890\nwhistle,896\nwhite_mustard,813915\nwhite_peppercorn,810024\nwhite_radish,81752\nwholesale_store,69691\nwidth,810\nwiki_doc,8252\nwin_action,84224\nwinery,847\nwink,842\nwinner,84\nwipe,80\nwire_rope,870\nwitch_house,81257\nwith,89\nwithout,891\nwobble,866\nwonder,845\nwood,85\nwoodruff,8570\nwool,86\nword_count,85241\nwork_example,823306\nwork_featured,820125\nwork_hours,82\nwork_location,826224\nwork_performed,82003\nwork_presented,8207341\nworks_for,820\nworld_fusion,8650944\nworry,87\nworst_rating,891714\nwpad_block,662\nwrap,70\nwreck,72\nwrestle,796\nwriggle,76\nwrite_action,71224\nwrite_permission,710324\nx_ray,37\nxo_sauce,99\nyacht_rock,9172\nyawn,94\nyearly_revenue,967849\nyears_in_operation,940724\nyell,96\nyorkshire_bleeps_and_bass,9226604569\nyour_folks,902\nytterbium,163\nyttrium,173\nyuzu,93\nzedoary,357\nzest,391\nzibeline,3664\nzinc,342\nzip,30\nzirconium,3243\nzone_boarding_policy,34654069\nzoom,33\nzoom_in,334\nzoom_out,331\nzucchini,324\n  ';
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var elm$core$String$lines = _String_lines;
var author$project$FictionalLanguage$wordList = A2(
	elm$core$List$map,
	author$project$FictionalLanguage$csvToTuple,
	elm$core$String$lines(author$project$FictionalWords$csvContent));
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$FictionalLanguage$swapWordList = A2(
	elm$core$List$map,
	function (t) {
		return _Utils_Tuple2(t.b, t.a);
	},
	author$project$FictionalLanguage$wordList);
var elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Dict$Black = {$: 'Black'};
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Dict$Red = {$: 'Red'};
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1.$) {
				case 'LT':
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var author$project$FictionalLanguage$swapWordDict = elm$core$Dict$fromList(author$project$FictionalLanguage$swapWordList);
var elm$core$String$contains = _String_contains;
var elm$core$String$length = _String_length;
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var author$project$FictionalLanguage$hexaToWord = function (s) {
	return A2(elm$core$String$startsWith, 'A', s) ? author$project$FictionalLanguage$N(
		A2(elm$core$String$dropLeft, 1, s)) : (A2(elm$core$String$contains, 'C', s) ? author$project$FictionalLanguage$toComposedHexaC(
		A2(elm$core$String$split, 'C', s)) : (A2(elm$core$String$contains, 'D', s) ? author$project$FictionalLanguage$toComposedHexaD(
		A2(elm$core$String$split, 'D', s)) : (_Utils_eq(s, author$project$FictionalLanguage$unknownWord) ? author$project$FictionalLanguage$Unknown : author$project$FictionalLanguage$W(
		A2(author$project$FictionalLanguage$getOrDefaultDict, s, author$project$FictionalLanguage$swapWordDict)))));
};
var author$project$FictionalLanguage$toComposedHexaC = function (list) {
	return author$project$FictionalLanguage$X(
		A2(elm$core$List$map, author$project$FictionalLanguage$hexaToWord, list));
};
var author$project$FictionalLanguage$toComposedHexaD = function (list) {
	return author$project$FictionalLanguage$C(
		A2(elm$core$List$map, author$project$FictionalLanguage$hexaToWord, list));
};
var author$project$FictionalLanguage$unknownHexa = '??';
var elm$core$String$cons = _String_cons;
var author$project$FictionalLanguage$toEng = function (s) {
	return A2(elm$core$List$map, author$project$FictionalLanguage$wordToEng, s);
};
var author$project$FictionalLanguage$wordToEng = function (s) {
	switch (s.$) {
		case 'X':
			var w = s.a;
			return A2(
				elm$core$String$join,
				'/',
				author$project$FictionalLanguage$toEng(w));
		case 'C':
			var w = s.a;
			return A2(
				elm$core$String$join,
				':',
				author$project$FictionalLanguage$toEng(w));
		case 'N':
			var n = s.a;
			return A2(
				elm$core$String$cons,
				_Utils_chr('#'),
				n);
		case 'Unknown':
			return author$project$FictionalLanguage$unknownHexa;
		default:
			var w = s.a;
			return w;
	}
};
var elm$core$String$words = _String_words;
var author$project$FictionalLanguage$hexaToEng = function (s) {
	return A2(
		elm$core$String$join,
		' ',
		author$project$FictionalLanguage$toEng(
			A2(
				elm$core$List$map,
				author$project$FictionalLanguage$hexaToWord,
				elm$core$String$words(s))));
};
var author$project$FictionalLanguage$hexaToVisual = function (s) {
	return A2(
		elm$core$String$join,
		'◌',
		A2(
			elm$core$String$split,
			' ',
			A2(
				elm$core$String$join,
				'◌',
				A2(
					elm$core$String$split,
					'F',
					A2(
						elm$core$String$join,
						'╈',
						A2(
							elm$core$String$split,
							'E',
							A2(
								elm$core$String$join,
								'╉',
								A2(
									elm$core$String$split,
									'D',
									A2(
										elm$core$String$join,
										'╅',
										A2(
											elm$core$String$split,
											'C',
											A2(
												elm$core$String$join,
												'╇',
												A2(
													elm$core$String$split,
													'B',
													A2(
														elm$core$String$join,
														'┿',
														A2(
															elm$core$String$split,
															'A',
															A2(
																elm$core$String$join,
																'┹',
																A2(
																	elm$core$String$split,
																	'9',
																	A2(
																		elm$core$String$join,
																		'┽',
																		A2(
																			elm$core$String$split,
																			'8',
																			A2(
																				elm$core$String$join,
																				'╊',
																				A2(
																					elm$core$String$split,
																					'7',
																					A2(
																						elm$core$String$join,
																						'╆',
																						A2(
																							elm$core$String$split,
																							'6',
																							A2(
																								elm$core$String$join,
																								'╂',
																								A2(
																									elm$core$String$split,
																									'5',
																									A2(
																										elm$core$String$join,
																										'╁',
																										A2(
																											elm$core$String$split,
																											'4',
																											A2(
																												elm$core$String$join,
																												'╄',
																												A2(
																													elm$core$String$split,
																													'3',
																													A2(
																														elm$core$String$join,
																														'┾',
																														A2(
																															elm$core$String$split,
																															'2',
																															A2(
																																elm$core$String$join,
																																'╀',
																																A2(
																																	elm$core$String$split,
																																	'1',
																																	A2(
																																		elm$core$String$join,
																																		'┼',
																																		A2(elm$core$String$split, '0', s))))))))))))))))))))))))))))))))));
};
var author$project$App$hexaToText = F2(
	function (fromEng, hexa) {
		return fromEng ? author$project$FictionalLanguage$hexaToVisual(hexa) : author$project$FictionalLanguage$hexaToEng(hexa);
	});
var author$project$FictionalLanguage$engToWord = function (s) {
	return A2(elm$core$String$startsWith, '#', s) ? author$project$FictionalLanguage$N(
		A2(elm$core$String$dropLeft, 1, s)) : (A2(elm$core$String$contains, '/', s) ? author$project$FictionalLanguage$toComposedWordsX(
		A2(elm$core$String$split, '/', s)) : (A2(elm$core$String$contains, ':', s) ? author$project$FictionalLanguage$toComposedWordsC(
		A2(elm$core$String$split, ':', s)) : (_Utils_eq(s, author$project$FictionalLanguage$unknownWord) ? author$project$FictionalLanguage$Unknown : author$project$FictionalLanguage$W(s))));
};
var author$project$FictionalLanguage$toComposedWordsC = function (list) {
	return author$project$FictionalLanguage$C(
		A2(elm$core$List$map, author$project$FictionalLanguage$engToWord, list));
};
var author$project$FictionalLanguage$toComposedWordsX = function (list) {
	return author$project$FictionalLanguage$X(
		A2(elm$core$List$map, author$project$FictionalLanguage$engToWord, list));
};
var author$project$FictionalLanguage$wordDict = elm$core$Dict$fromList(author$project$FictionalLanguage$wordList);
var author$project$FictionalLanguage$toHexa = function (s) {
	return A2(elm$core$List$map, author$project$FictionalLanguage$wordToHexa, s);
};
var author$project$FictionalLanguage$wordToHexa = function (s) {
	switch (s.$) {
		case 'X':
			var w = s.a;
			return A2(
				elm$core$String$join,
				'C',
				author$project$FictionalLanguage$toHexa(w));
		case 'C':
			var w = s.a;
			return A2(
				elm$core$String$join,
				'D',
				author$project$FictionalLanguage$toHexa(w));
		case 'N':
			var n = s.a;
			return A2(
				elm$core$String$cons,
				_Utils_chr('A'),
				n);
		case 'Unknown':
			return author$project$FictionalLanguage$unknownHexa;
		default:
			var w = s.a;
			return A2(author$project$FictionalLanguage$getOrDefaultDict, w, author$project$FictionalLanguage$wordDict);
	}
};
var author$project$FictionalLanguage$engToHexa = function (s) {
	return A2(
		elm$core$String$join,
		' ',
		author$project$FictionalLanguage$toHexa(
			A2(
				elm$core$List$map,
				author$project$FictionalLanguage$engToWord,
				elm$core$String$words(s))));
};
var author$project$FictionalLanguage$visualToHexa = function (s) {
	return A2(
		elm$core$String$join,
		' ',
		A2(
			elm$core$String$split,
			'◌',
			A2(
				elm$core$String$join,
				'E',
				A2(
					elm$core$String$split,
					'╈',
					A2(
						elm$core$String$join,
						'D',
						A2(
							elm$core$String$split,
							'╉',
							A2(
								elm$core$String$join,
								'C',
								A2(
									elm$core$String$split,
									'╅',
									A2(
										elm$core$String$join,
										'B',
										A2(
											elm$core$String$split,
											'╇',
											A2(
												elm$core$String$join,
												'A',
												A2(
													elm$core$String$split,
													'┿',
													A2(
														elm$core$String$join,
														'9',
														A2(
															elm$core$String$split,
															'┹',
															A2(
																elm$core$String$join,
																'8',
																A2(
																	elm$core$String$split,
																	'┽',
																	A2(
																		elm$core$String$join,
																		'7',
																		A2(
																			elm$core$String$split,
																			'╊',
																			A2(
																				elm$core$String$join,
																				'6',
																				A2(
																					elm$core$String$split,
																					'╆',
																					A2(
																						elm$core$String$join,
																						'5',
																						A2(
																							elm$core$String$split,
																							'╂',
																							A2(
																								elm$core$String$join,
																								'4',
																								A2(
																									elm$core$String$split,
																									'╁',
																									A2(
																										elm$core$String$join,
																										'3',
																										A2(
																											elm$core$String$split,
																											'╄',
																											A2(
																												elm$core$String$join,
																												'2',
																												A2(
																													elm$core$String$split,
																													'┾',
																													A2(
																														elm$core$String$join,
																														'1',
																														A2(
																															elm$core$String$split,
																															'╀',
																															A2(
																																elm$core$String$join,
																																'0',
																																A2(elm$core$String$split, '┼', s))))))))))))))))))))))))))))))));
};
var author$project$App$textToHexa = F2(
	function (fromEng, text) {
		return fromEng ? author$project$FictionalLanguage$engToHexa(text) : author$project$FictionalLanguage$visualToHexa(text);
	});
var elm$core$Basics$not = _Basics_not;
var author$project$App$update = F2(
	function (msg, model) {
		if (msg.$ === 'NewContent') {
			var text = msg.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						hexa: A2(author$project$App$textToHexa, model.fromEng, text),
						text: text
					}),
				elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						fromEng: !model.fromEng,
						text: A2(author$project$App$hexaToText, model.fromEng, model.hexa)
					}),
				elm$core$Platform$Cmd$none);
		}
	});
var author$project$App$NewContent = function (a) {
	return {$: 'NewContent', a: a};
};
var author$project$App$ToggleLanguage = {$: 'ToggleLanguage'};
var author$project$App$eCol = 'amber';
var author$project$App$iCol = 'blue';
var author$project$App$colorSection = function (fromEng) {
	return fromEng ? A2(
		elm$core$String$join,
		' ',
		_List_fromArray(
			[author$project$App$eCol, 'lighten-2'])) : A2(
		elm$core$String$join,
		' ',
		_List_fromArray(
			[author$project$App$iCol, 'lighten-2']));
};
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$map2 = _Json_map2;
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$h5 = _VirtualDom_node('h5');
var elm$html$Html$p = _VirtualDom_node('p');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$json$Json$Encode$string = _Json_wrap;
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var author$project$App$area = F2(
	function (str, meta) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('col s1')
						]),
					_List_Nil),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('col s11')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h5,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class(
									author$project$App$colorSection(meta.fromEng))
								]),
							_List_fromArray(
								[
									elm$html$Html$text(meta.title)
								])),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('flow-text validate'),
									elm$html$Html$Attributes$id(meta.id)
								]),
							_List_fromArray(
								[
									elm$html$Html$text(str)
								]))
						]))
				]));
	});
var author$project$App$colorInput = function (fromEng) {
	return fromEng ? A2(
		elm$core$String$join,
		' ',
		_List_fromArray(
			['materialize-textarea', author$project$App$eCol, 'lighten-4'])) : A2(
		elm$core$String$join,
		' ',
		_List_fromArray(
			['materialize-textarea', author$project$App$iCol, 'lighten-4']));
};
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$label = _VirtualDom_node('label');
var elm$html$Html$span = _VirtualDom_node('span');
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$App$switchBox = F3(
	function (msg, name1, name2) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('switch')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(name1),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$type_('checkbox'),
									elm$html$Html$Events$onClick(msg)
								]),
							_List_Nil),
							A2(
							elm$html$Html$span,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('lever')
								]),
							_List_Nil),
							elm$html$Html$text(name2)
						]))
				]));
	});
var author$project$FictionalLanguage$hexaToCons = function (s) {
	switch (s) {
		case '0':
			return 'p';
		case '1':
			return 't';
		case '2':
			return 'k';
		case '3':
			return 'm';
		case '4':
			return 'n';
		case '5':
			return 'd';
		case '6':
			return 'b';
		case '7':
			return 'g';
		case '8':
			return 'w';
		case '9':
			return 'j';
		case 'A':
			return 'sɑː';
		case 'B':
			return 'goʊ';
		case 'C':
			return 'fʊ';
		case 'D':
			return 'zaɪ';
		case 'E':
			return 'yɛ';
		case 'F':
			return ' ';
		case ' ':
			return ' ';
		case 'G':
			return '!';
		default:
			return '?';
	}
};
var author$project$FictionalLanguage$hexaToVowels = function (s) {
	switch (s) {
		case '0':
			return 'ɑː';
		case '1':
			return 'ɛ';
		case '2':
			return 'iː';
		case '3':
			return 'oʊ';
		case '4':
			return 'ʊ';
		case '5':
			return 'aɪ';
		case '6':
			return 'eɪ';
		case '7':
			return 'ɪʃ';
		case '8':
			return 'ɔɪ';
		case '9':
			return 'juː';
		case 'A':
			return 'sɑː';
		case 'B':
			return 'goʊ';
		case 'C':
			return 'fʊ';
		case 'D':
			return 'zaɪ';
		case 'E':
			return 'yɛ';
		case 'F':
			return ' ';
		case ' ':
			return ' ';
		case 'G':
			return 'ʌ';
		default:
			return '?';
	}
};
var author$project$FictionalLanguage$hexaToConsOrVowel = function (tuple) {
	var _n0 = tuple;
	var _char = _n0.a;
	var isVowel = _n0.b;
	return isVowel ? author$project$FictionalLanguage$hexaToVowels(_char) : author$project$FictionalLanguage$hexaToCons(_char);
};
var elm$core$Basics$modBy = _Basics_modBy;
var author$project$FictionalLanguage$isEven = function (n) {
	return !A2(elm$core$Basics$modBy, 2, n);
};
var author$project$FictionalLanguage$zip = F2(
	function (xs, ys) {
		var _n0 = _Utils_Tuple2(xs, ys);
		if (_n0.a.b && _n0.b.b) {
			var _n1 = _n0.a;
			var x = _n1.a;
			var xBack = _n1.b;
			var _n2 = _n0.b;
			var y = _n2.a;
			var yBack = _n2.b;
			return A2(
				elm$core$List$cons,
				_Utils_Tuple2(x, y),
				A2(author$project$FictionalLanguage$zip, xBack, yBack));
		} else {
			return _List_Nil;
		}
	});
var author$project$FictionalLanguage$wordToPhonetic = function (s) {
	var w = A2(elm$core$String$split, '', s);
	var evenWord = author$project$FictionalLanguage$isEven(
		elm$core$List$length(w)) ? w : _Utils_ap(
		w,
		_List_fromArray(
			['G']));
	var index = A2(
		elm$core$List$range,
		1,
		elm$core$List$length(evenWord));
	var isVowel = A2(elm$core$List$map, author$project$FictionalLanguage$isEven, index);
	var pairs = A2(author$project$FictionalLanguage$zip, evenWord, isVowel);
	return A2(
		elm$core$String$join,
		'',
		A2(elm$core$List$map, author$project$FictionalLanguage$hexaToConsOrVowel, pairs));
};
var author$project$FictionalLanguage$composedToPhonetic = function (s) {
	return A2(elm$core$String$startsWith, 'A', s) ? ('sɑː' + author$project$FictionalLanguage$wordToPhonetic(
		A2(elm$core$String$dropLeft, 1, s))) : (A2(elm$core$String$startsWith, 'B', s) ? ('goʊ' + author$project$FictionalLanguage$wordToPhonetic(
		A2(elm$core$String$dropLeft, 1, s))) : (A2(elm$core$String$contains, 'C', s) ? A2(
		elm$core$String$join,
		'fʊ',
		A2(
			elm$core$List$map,
			author$project$FictionalLanguage$wordToPhonetic,
			A2(elm$core$String$split, 'C', s))) : (A2(elm$core$String$contains, 'D', s) ? A2(
		elm$core$String$join,
		'zaɪ',
		A2(
			elm$core$List$map,
			author$project$FictionalLanguage$wordToPhonetic,
			A2(elm$core$String$split, 'D', s))) : author$project$FictionalLanguage$wordToPhonetic(s))));
};
var author$project$FictionalLanguage$hexaToPhonetic = function (s) {
	return A2(
		elm$core$String$join,
		' ',
		A2(
			elm$core$List$map,
			author$project$FictionalLanguage$composedToPhonetic,
			elm$core$String$words(s)));
};
var elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var elm$html$Html$form = _VirtualDom_node('form');
var elm$html$Html$h2 = _VirtualDom_node('h2');
var elm$html$Html$textarea = _VirtualDom_node('textarea');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$json$Json$Decode$string = _Json_decodeString;
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var author$project$App$view = function (model) {
	var asHexa = A2(author$project$App$textToHexa, model.fromEng, model.text);
	var asPhonetic = author$project$FictionalLanguage$hexaToPhonetic(asHexa);
	var asVisual = author$project$FictionalLanguage$hexaToVisual(asHexa);
	var asEng = author$project$FictionalLanguage$hexaToEng(asHexa);
	return {
		body: _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$h2,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('orange-text text-accent-4')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('Translate')
							])),
						A2(
						elm$html$Html$form,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('col s12')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$class('row')
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$textarea,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class(
												author$project$App$colorInput(model.fromEng)),
												elm$html$Html$Attributes$id('textarea1'),
												elm$html$Html$Events$onInput(author$project$App$NewContent),
												elm$html$Html$Attributes$value(model.text)
											]),
										_List_Nil),
										A2(
										elm$html$Html$fieldset,
										_List_Nil,
										_List_fromArray(
											[
												A3(author$project$App$switchBox, author$project$App$ToggleLanguage, 'English', 'Interandroid')
											])),
										A2(
										author$project$App$area,
										asHexa,
										{fromEng: model.fromEng, id: 'disabled', title: 'Hexa'}),
										A2(
										author$project$App$area,
										asVisual,
										{fromEng: model.fromEng, id: 'disabled', title: 'Visual'}),
										A2(
										author$project$App$area,
										asPhonetic,
										{fromEng: model.fromEng, id: 'disabled', title: 'Phonetic'}),
										A2(
										author$project$App$area,
										asEng,
										{fromEng: model.fromEng, id: 'disabled', title: 'English'})
									]))
							]))
					]))
			]),
		title: 'Interandroid-fictional-language'
	};
};
var elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0.a;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(_Utils_Tuple0);
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0.a;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return _Utils_Tuple0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(_Utils_Tuple0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0.a;
		return elm$core$Task$Perform(
			A2(elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(elm$core$Task$map, toMessage, task)));
	});
var elm$url$Url$Http = {$: 'Http'};
var elm$url$Url$Https = {$: 'Https'};
var elm$core$String$indexes = _String_indexes;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$toInt = _String_toInt;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Http,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Https,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$document = _Browser_document;
var author$project$App$main = elm$browser$Browser$document(
	{init: author$project$App$init, subscriptions: author$project$App$subscriptions, update: author$project$App$update, view: author$project$App$view});
_Platform_export({'App':{'init':author$project$App$main(
	elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));