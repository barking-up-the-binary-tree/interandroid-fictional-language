
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
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


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		return '<function>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
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


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$singleton = function (value) {
	return {
		ctor: '::',
		_0: value,
		_1: {ctor: '[]'}
	};
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

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

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(value)
	{
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		currentSend(result._0);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _elm_lang$core$Native_List.fromArray(is);
}


function toInt(s)
{
	var len = s.length;

	// if empty
	if (len === 0)
	{
		return intErr(s);
	}

	// if hex
	var c = s[0];
	if (c === '0' && s[1] === 'x')
	{
		for (var i = 2; i < len; ++i)
		{
			var c = s[i];
			if (('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f'))
			{
				continue;
			}
			return intErr(s);
		}
		return _elm_lang$core$Result$Ok(parseInt(s, 16));
	}

	// is decimal
	if (c > '9' || (c < '0' && c !== '-' && c !== '+'))
	{
		return intErr(s);
	}
	for (var i = 1; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return intErr(s);
		}
	}

	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function intErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
}


function toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return floatErr(s);
	}
	var n = +s;
	// faster isNaN check
	return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
}

function floatErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
}


function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';

var localDoc = typeof document !== 'undefined' ? document : {};


////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function keyedNode(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid._1.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'keyed-node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: undefined
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else if (key === 'className')
		{
			var classes = facts[key];
			facts[key] = typeof classes === 'undefined'
				? entry.value
				: classes + ' ' + entry.value;
		}
 		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (a.options !== b.options)
	{
		if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}


function mapProperty(func, property)
{
	if (property.key !== EVENT_KEY)
	{
		return property;
	}
	return on(
		property.realKey,
		property.value.options,
		A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder)
	);
}


////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;

			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}

			var subEventRoot = { tagger: tagger, parent: eventNode };
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return localDoc.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'keyed-node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i]._1, eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
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
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: undefined,
		eventNode: undefined
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'keyed-node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffKeyedChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
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


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  KEYED DIFF  ////////////


function diffKeyedChildren(aParent, bParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var aChildren = aParent.children;
	var bChildren = bParent.children;
	var aLen = aChildren.length;
	var bLen = bChildren.length;
	var aIndex = 0;
	var bIndex = 0;

	var index = rootIndex;

	while (aIndex < aLen && bIndex < bLen)
	{
		var a = aChildren[aIndex];
		var b = bChildren[bIndex];

		var aKey = a._0;
		var bKey = b._0;
		var aNode = a._1;
		var bNode = b._1;

		// check if keys match

		if (aKey === bKey)
		{
			index++;
			diffHelp(aNode, bNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex++;
			bIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var aLookAhead = aIndex + 1 < aLen;
		var bLookAhead = bIndex + 1 < bLen;

		if (aLookAhead)
		{
			var aNext = aChildren[aIndex + 1];
			var aNextKey = aNext._0;
			var aNextNode = aNext._1;
			var oldMatch = bKey === aNextKey;
		}

		if (bLookAhead)
		{
			var bNext = bChildren[bIndex + 1];
			var bNextKey = bNext._0;
			var bNextNode = bNext._1;
			var newMatch = aKey === bNextKey;
		}


		// swap a and b
		if (aLookAhead && bLookAhead && newMatch && oldMatch)
		{
			index++;
			diffHelp(aNode, bNextNode, localPatches, index);
			insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			removeNode(changes, localPatches, aKey, aNextNode, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		// insert b
		if (bLookAhead && newMatch)
		{
			index++;
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			diffHelp(aNode, bNextNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex += 1;
			bIndex += 2;
			continue;
		}

		// remove a
		if (aLookAhead && oldMatch)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 1;
			continue;
		}

		// remove a, insert b
		if (aLookAhead && bLookAhead && aNextKey === bNextKey)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNextNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (aIndex < aLen)
	{
		index++;
		var a = aChildren[aIndex];
		var aNode = a._1;
		removeNode(changes, localPatches, a._0, aNode, index);
		index += aNode.descendantsCount || 0;
		aIndex++;
	}

	var endInserts;
	while (bIndex < bLen)
	{
		endInserts = endInserts || [];
		var b = bChildren[bIndex];
		insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
		bIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined')
	{
		patches.push(makePatch('p-reorder', rootIndex, {
			patches: localPatches,
			inserts: inserts,
			endInserts: endInserts
		}));
	}
}



////////////  CHANGES FROM KEYED DIFF  ////////////


var POSTFIX = '_elmW6BL';


function insertNode(changes, localPatches, key, vnode, bIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		entry = {
			tag: 'insert',
			vnode: vnode,
			index: bIndex,
			data: undefined
		};

		inserts.push({ index: bIndex, entry: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.tag === 'remove')
	{
		inserts.push({ index: bIndex, entry: entry });

		entry.tag = 'move';
		var subPatches = [];
		diffHelp(entry.vnode, vnode, subPatches, entry.index);
		entry.index = bIndex;
		entry.data.data = {
			patches: subPatches,
			entry: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
}


function removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		var patch = makePatch('p-remove', index, undefined);
		localPatches.push(patch);

		changes[key] = {
			tag: 'remove',
			vnode: vnode,
			index: index,
			data: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.tag === 'insert')
	{
		entry.tag = 'move';
		var subPatches = [];
		diffHelp(vnode, entry.vnode, subPatches, index);

		var patch = makePatch('p-remove', index, {
			patches: subPatches,
			entry: entry
		});
		localPatches.push(patch);

		return;
	}

	// this key has already been removed or moved, a duplicate!
	removeNode(changes, localPatches, key + POSTFIX, vnode, index);
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else if (patchType === 'p-reorder')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var subPatches = patch.data.patches;
			if (subPatches.length > 0)
			{
				addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 'p-remove')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var data = patch.data;
			if (typeof data !== 'undefined')
			{
				data.entry.data = domNode;
				var subPatches = data.patches;
				if (subPatches.length > 0)
				{
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;

			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}

			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'keyed-node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j]._1;
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return applyPatchRedraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			if (typeof domNode.elm_event_node_ref !== 'undefined')
			{
				domNode.elm_event_node_ref.tagger = patch.data;
			}
			else
			{
				domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
			}
			return domNode;

		case 'p-remove-last':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-append':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-remove':
			var data = patch.data;
			if (typeof data === 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.entry;
			if (typeof entry.index !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.data = applyPatchesHelp(domNode, data.patches);
			return domNode;

		case 'p-reorder':
			return applyPatchReorder(domNode, patch);

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function applyPatchReorder(domNode, patch)
{
	var data = patch.data;

	// remove end inserts
	var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

	// removals
	domNode = applyPatchesHelp(domNode, data.patches);

	// inserts
	var inserts = data.inserts;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.entry;
		var node = entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode);
		domNode.insertBefore(node, domNode.childNodes[insert.index]);
	}

	// add end inserts
	if (typeof frag !== 'undefined')
	{
		domNode.appendChild(frag);
	}

	return domNode;
}


function applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (typeof endInserts === 'undefined')
	{
		return;
	}

	var frag = localDoc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.entry;
		frag.appendChild(entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode)
		);
	}
	return frag;
}


// PROGRAMS

var program = makeProgram(checkNoFlags);
var programWithFlags = makeProgram(checkYesFlags);

function makeProgram(flagChecker)
{
	return F2(function(debugWrap, impl)
	{
		return function(flagDecoder)
		{
			return function(object, moduleName, debugMetadata)
			{
				var checker = flagChecker(flagDecoder, moduleName);
				if (typeof debugMetadata === 'undefined')
				{
					normalSetup(impl, object, moduleName, checker);
				}
				else
				{
					debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
				}
			};
		};
	});
}

function staticProgram(vNode)
{
	var nothing = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		_elm_lang$core$Platform_Cmd$none
	);
	return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
		init: nothing,
		view: function() { return vNode; },
		update: F2(function() { return nothing; }),
		subscriptions: function() { return _elm_lang$core$Platform_Sub$none; }
	})();
}


// FLAG CHECKERS

function checkNoFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flags === 'undefined')
		{
			return init;
		}

		var errorMessage =
			'The `' + moduleName + '` module does not need flags.\n'
			+ 'Initialize it with no arguments and you should be all set!';

		crash(errorMessage, domNode);
	};
}

function checkYesFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flagDecoder === 'undefined')
		{
			var errorMessage =
				'Are you trying to sneak a Never value into Elm? Trickster!\n'
				+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
				+ 'Use `program` instead if you do not want flags.'

			crash(errorMessage, domNode);
		}

		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Ok')
		{
			return init(result._0);
		}

		var errorMessage =
			'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n'
			+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
			+ result._0;

		crash(errorMessage, domNode);
	};
}

function crash(errorMessage, domNode)
{
	if (domNode)
	{
		domNode.innerHTML =
			'<div style="padding-left:1em;">'
			+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
			+ '<pre style="padding-left:1em;">' + errorMessage + '</pre>'
			+ '</div>';
	}

	throw new Error(errorMessage);
}


//  NORMAL SETUP

function normalSetup(impl, object, moduleName, flagChecker)
{
	object['embed'] = function embed(node, flags)
	{
		while (node.lastChild)
		{
			node.removeChild(node.lastChild);
		}

		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update,
			impl.subscriptions,
			normalRenderer(node, impl.view)
		);
	};

	object['fullscreen'] = function fullscreen(flags)
	{
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update,
			impl.subscriptions,
			normalRenderer(document.body, impl.view)
		);
	};
}

function normalRenderer(parentNode, view)
{
	return function(tagger, initialModel)
	{
		var eventNode = { tagger: tagger, parent: undefined };
		var initialVirtualNode = view(initialModel);
		var domNode = render(initialVirtualNode, eventNode);
		parentNode.appendChild(domNode);
		return makeStepper(domNode, view, initialVirtualNode, eventNode);
	};
}


// STEPPER

var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };

function makeStepper(domNode, view, initialVirtualNode, eventNode)
{
	var state = 'NO_REQUEST';
	var currNode = initialVirtualNode;
	var nextModel;

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var nextNode = view(nextModel);
				var patches = diff(currNode, nextNode);
				domNode = applyPatches(domNode, currNode, patches, eventNode);
				currNode = nextNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return function stepper(model)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextModel = model;
	};
}


// DEBUG SETUP

function debugSetup(impl, object, moduleName, flagChecker)
{
	object['fullscreen'] = function fullscreen(flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};

	object['embed'] = function fullscreen(node, flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};
}

function scrollTask(popoutRef)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var doc = popoutRef.doc;
		if (doc)
		{
			var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
			if (msgs)
			{
				msgs.scrollTop = msgs.scrollHeight;
			}
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut)
{
	return function(tagger, initialModel)
	{
		var appEventNode = { tagger: tagger, parent: undefined };
		var eventNode = { tagger: tagger, parent: undefined };

		// make normal stepper
		var appVirtualNode = view(initialModel);
		var appNode = render(appVirtualNode, appEventNode);
		parentNode.appendChild(appNode);
		var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

		// make overlay stepper
		var overVirtualNode = viewIn(initialModel)._1;
		var overNode = render(overVirtualNode, eventNode);
		parentNode.appendChild(overNode);
		var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
		var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

		// make debugger stepper
		var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

		return function stepper(model)
		{
			appStepper(model);
			overStepper(model);
			debugStepper(model);
		}
	};
}

function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef)
{
	var curr;
	var domNode;

	return function stepper(model)
	{
		if (!model.isDebuggerOpen)
		{
			return;
		}

		if (!popoutRef.doc)
		{
			curr = view(model);
			domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
			return;
		}

		// switch to document of popout
		localDoc = popoutRef.doc;

		var next = view(model);
		var patches = diff(curr, next);
		domNode = applyPatches(domNode, curr, patches, eventNode);
		curr = next;

		// switch back to normal document
		localDoc = document;
	};
}

function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode)
{
	var w = 900;
	var h = 360;
	var x = screen.width - w;
	var y = screen.height - h;
	var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

	// switch to window document
	localDoc = debugWindow.document;

	popoutRef.doc = localDoc;
	localDoc.title = 'Debugger - ' + moduleName;
	localDoc.body.style.margin = '0';
	localDoc.body.style.padding = '0';
	var domNode = render(virtualNode, eventNode);
	localDoc.body.appendChild(domNode);

	localDoc.addEventListener('keydown', function(event) {
		if (event.metaKey && event.which === 82)
		{
			window.location.reload();
		}
		if (event.which === 38)
		{
			eventNode.tagger({ ctor: 'Up' });
			event.preventDefault();
		}
		if (event.which === 40)
		{
			eventNode.tagger({ ctor: 'Down' });
			event.preventDefault();
		}
	});

	function close()
	{
		popoutRef.doc = undefined;
		debugWindow.close();
	}
	window.addEventListener('unload', close);
	debugWindow.addEventListener('unload', function() {
		popoutRef.doc = undefined;
		window.removeEventListener('unload', close);
		eventNode.tagger({ ctor: 'Close' });
	});

	// switch back to the normal document
	localDoc = document;

	return domNode;
}


// BLOCK EVENTS

function wrapViewIn(appEventNode, overlayNode, viewIn)
{
	var ignorer = makeIgnorer(overlayNode);
	var blocking = 'Normal';
	var overflow;

	var normalTagger = appEventNode.tagger;
	var blockTagger = function() {};

	return function(model)
	{
		var tuple = viewIn(model);
		var newBlocking = tuple._0.ctor;
		appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
		if (blocking !== newBlocking)
		{
			traverse('removeEventListener', ignorer, blocking);
			traverse('addEventListener', ignorer, newBlocking);

			if (blocking === 'Normal')
			{
				overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}

			if (newBlocking === 'Normal')
			{
				document.body.style.overflow = overflow;
			}

			blocking = newBlocking;
		}
		return tuple._1;
	}
}

function traverse(verbEventListener, ignorer, blocking)
{
	switch(blocking)
	{
		case 'Normal':
			return;

		case 'Pause':
			return traverseHelp(verbEventListener, ignorer, mostEvents);

		case 'Message':
			return traverseHelp(verbEventListener, ignorer, allEvents);
	}
}

function traverseHelp(verbEventListener, handler, eventNames)
{
	for (var i = 0; i < eventNames.length; i++)
	{
		document.body[verbEventListener](eventNames[i], handler, true);
	}
}

function makeIgnorer(overlayNode)
{
	return function(event)
	{
		if (event.type === 'keydown' && event.metaKey && event.which === 82)
		{
			return;
		}

		var isScroll = event.type === 'scroll' || event.type === 'wheel';

		var node = event.target;
		while (node !== null)
		{
			if (node.className === 'elm-overlay-message-details' && isScroll)
			{
				return;
			}

			if (node === overlayNode && !isScroll)
			{
				return;
			}
			node = node.parentNode;
		}

		event.stopPropagation();
		event.preventDefault();
	}
}

var mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var allEvents = mostEvents.concat('wheel', 'scroll');


return {
	node: node,
	text: text,
	custom: custom,
	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),
	mapProperty: F2(mapProperty),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),
	keyedNode: F3(keyedNode),

	program: program,
	programWithFlags: programWithFlags,
	staticProgram: staticProgram
};

}();

var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
};
var _elm_lang$virtual_dom$VirtualDom$program = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
};
var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
var _elm_lang$html$Html$beginnerProgram = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$program(
		{
			init: A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_p1.model,
				{ctor: '[]'}),
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p1.update, msg, model),
						{ctor: '[]'});
				}),
			view: _p1.view,
			subscriptions: function (_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'maxlength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'colspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rowspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type_ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _user$project$FromEnglish$hexaToVowels = function (s) {
	var _p0 = s;
	switch (_p0) {
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
var _user$project$FromEnglish$hexaToCons = function (s) {
	var _p1 = s;
	switch (_p1) {
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
var _user$project$FromEnglish$hexaToVisual = function (s) {
	return A2(
		_elm_lang$core$String$join,
		'◌',
		A2(
			_elm_lang$core$String$split,
			' ',
			A2(
				_elm_lang$core$String$join,
				'◌',
				A2(
					_elm_lang$core$String$split,
					'F',
					A2(
						_elm_lang$core$String$join,
						'╈',
						A2(
							_elm_lang$core$String$split,
							'E',
							A2(
								_elm_lang$core$String$join,
								'╉',
								A2(
									_elm_lang$core$String$split,
									'D',
									A2(
										_elm_lang$core$String$join,
										'╅',
										A2(
											_elm_lang$core$String$split,
											'C',
											A2(
												_elm_lang$core$String$join,
												'╇',
												A2(
													_elm_lang$core$String$split,
													'B',
													A2(
														_elm_lang$core$String$join,
														'┿',
														A2(
															_elm_lang$core$String$split,
															'A',
															A2(
																_elm_lang$core$String$join,
																'┹',
																A2(
																	_elm_lang$core$String$split,
																	'9',
																	A2(
																		_elm_lang$core$String$join,
																		'┽',
																		A2(
																			_elm_lang$core$String$split,
																			'8',
																			A2(
																				_elm_lang$core$String$join,
																				'╊',
																				A2(
																					_elm_lang$core$String$split,
																					'7',
																					A2(
																						_elm_lang$core$String$join,
																						'╆',
																						A2(
																							_elm_lang$core$String$split,
																							'6',
																							A2(
																								_elm_lang$core$String$join,
																								'╂',
																								A2(
																									_elm_lang$core$String$split,
																									'5',
																									A2(
																										_elm_lang$core$String$join,
																										'╁',
																										A2(
																											_elm_lang$core$String$split,
																											'4',
																											A2(
																												_elm_lang$core$String$join,
																												'╄',
																												A2(
																													_elm_lang$core$String$split,
																													'3',
																													A2(
																														_elm_lang$core$String$join,
																														'┾',
																														A2(
																															_elm_lang$core$String$split,
																															'2',
																															A2(
																																_elm_lang$core$String$join,
																																'╀',
																																A2(
																																	_elm_lang$core$String$split,
																																	'1',
																																	A2(
																																		_elm_lang$core$String$join,
																																		'┼',
																																		A2(_elm_lang$core$String$split, '0', s))))))))))))))))))))))))))))))))));
};
var _user$project$FromEnglish$hexaToConsOrVowel = function (tuple) {
	var _p2 = tuple;
	var $char = _p2._0;
	var isVowel = _p2._1;
	return isVowel ? _user$project$FromEnglish$hexaToVowels($char) : _user$project$FromEnglish$hexaToCons($char);
};
var _user$project$FromEnglish$isEven = function (n) {
	return _elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], n, 2),
		0);
};
var _user$project$FromEnglish$wordJoinX = function (list) {
	return A2(
		_elm_lang$core$String$join,
		'C',
		_user$project$FromEnglish$toHexa(list));
};
var _user$project$FromEnglish$toHexa = function (s) {
	return A2(_elm_lang$core$List$map, _user$project$FromEnglish$wordToHexa, s);
};
var _user$project$FromEnglish$wordToHexa = function (s) {
	var _p3 = s;
	switch (_p3.ctor) {
		case 'X':
			return _user$project$FromEnglish$wordJoinX(_p3._0);
		case 'C':
			return _user$project$FromEnglish$wordJoinC(_p3._0);
		case 'N':
			return A2(
				_elm_lang$core$String$cons,
				_elm_lang$core$Native_Utils.chr('A'),
				_p3._0);
		case 'Unknown':
			return '??';
		case 'FictLang':
			return '0123';
		case 'Yes':
			return '99';
		case 'No':
			return '4';
		case 'AboutPage':
			return ' 6107';
		case 'Accept':
			return ' 2901';
		case 'AcceptAction':
			return '2901224';
		case 'AcceptedAnswer':
			return '2901549';
		case 'AcceptedOffer':
			return ' 290150';
		case 'AcceptedPaymentMethod':
			return '290150341305';
		case 'AcceptsReservations':
			return ' 290173824';
		case 'AccessCode':
			return '29925';
		case 'AccessMode':
			return '29935';
		case 'AccessModeSufficient':
			return ' 2993590241';
		case 'AccessibilityApi':
			return '299661';
		case 'AccessibilityControl':
			return '29966124176';
		case 'AccessibilityFeature':
			return '299661012';
		case 'AccessibilityHazard':
			return ' 29966135';
		case 'AccessibilitySummary':
			return '299661937';
		case 'Accommodation':
			return '23524';
		case 'AccountId':
			return ' 2415';
		case 'AccountablePerson':
			return ' 24166094';
		case 'AccountingService':
			return ' 2414989';
		case 'AchieveAction':
			return ' 128224';
		case 'AcidBreaks':
			return '95672';
		case 'AcidHouse':
			return ' 959';
		case 'AcidJazz':
			return '9573';
		case 'AcidRock':
			return '9572';
		case 'AcidTechno':
			return '95124';
		case 'AcidTrance':
			return '951749';
		case 'Acidic':
			return ' 952';
		case 'AcornSquash':
			return ' 249282';
		case 'AcquiredFrom':
			return '28073';
		case 'Acrylic':
			return '2762';
		case 'Actinium':
			return ' 2143';
		case 'Action':
			return ' 224';
		case 'ActionApplication':
			return ' 22406224';
		case 'ActionCollabClass':
			return '224266269';
		case 'ActionOption':
			return '224024';
		case 'ActionPlatform':
			return '22406103';
		case 'ActionStatus':
			return '2249119';
		case 'ActionStatusType':
			return ' 224911910';
		case 'ActivateAction':
			return '2181224';
		case 'ActiveActionStatus':
			return ' 2182249119';
		case 'Actors':
			return ' 21';
		case 'AdditionalName':
			return '524643';
		case 'AdditionalNumberOfGuests':
			return '5246436891';
		case 'AdditionalProperty':
			return '52460701';
		case 'AdditionalType':
			return '524610';
		case 'AddressCountry':
			return '5792417';
		case 'AddressLocality':
			return ' 5796261';
		case 'AddressRegion':
			return ' 579774';
		case 'AdministrativeArea':
			return '534917187';
		case 'Admire':
			return ' 53';
		case 'Admit':
			return '531';
		case 'AdultEntertainment':
			return '5614114341';
		case 'AdvanceBookingRequirement':
			return '5849624728341';
		case 'Advise':
			return ' 583';
		case 'Affiliation':
			return '0624';
		case 'AggregateOffer':
			return '710';
		case 'AggregateRating':
			return ' 71714';
		case 'AgreeAction':
			return ' 7224';
		case 'Aircraft':
			return ' 2701';
		case 'AlbumProductionType':
			return '66307522410';
		case 'AlbumRelease':
			return '663769';
		case 'AlbumReleaseType':
			return ' 66376910';
		case 'Albums':
			return ' 663';
		case 'Alcoholic':
			return '6262';
		case 'AlfalfaSprout':
			return ' 60609071';
		case 'AlignmentObject':
			return ' 643416721';
		case 'AlignmentType':
			return ' 6434110';
		case 'AllWheelDriveConfiguration':
			return '686578240724';
		case 'AlligatorPepper':
			return ' 6100';
		case 'AllocateAction':
			return '621224';
		case 'Allspice':
			return ' 6909';
		case 'Alpaca':
			return ' 602';
		case 'AlternateName':
			return ' 614143';
		case 'AlternativeDance':
			return '61418549';
		case 'AlternativeHeadline':
			return ' 61418564';
		case 'AlternativeMetal':
			return '61418316';
		case 'AlternativeRock':
			return ' 6141872';
		case 'Aluminium':
			return '6343';
		case 'Aluminum':
			return ' 6343';
		case 'Alumni':
			return ' 6349';
		case 'AlumniOf':
			return '63498';
		case 'Amaranth':
			return ' 3740';
		case 'Ambient':
			return '3641';
		case 'AmbientDub':
			return '364156';
		case 'AmbientHouse':
			return '36419';
		case 'AmbientTechno':
			return ' 3641124';
		case 'AmenityFeature':
			return '341012';
		case 'Americium':
			return '37993';
		case 'AmountOfThisGood':
			return '3418995';
		case 'Amuse':
			return '393';
		case 'AmusementPark':
			return ' 39334102';
		case 'Angelica':
			return ' 4762';
		case 'Angular':
			return '496';
		case 'AnimalShelter':
			return ' 436261';
		case 'Anise':
			return '49';
		case 'Announce':
			return ' 449';
		case 'AnnualPercentageRate':
			return ' 4960941771';
		case 'Answer':
			return ' 49';
		case 'AnswerCount':
			return ' 49241';
		case 'AntiFolk':
			return '4102';
		case 'Apartment':
			return '01341';
		case 'ApartmentComplex':
			return '01341230629';
		case 'Apologise':
			return '0673';
		case 'ApplicationCategory':
			return ' 06224217';
		case 'ApplicationSubCategory':
			return ' 0622496217';
		case 'ApplicationSuite':
			return '06224981';
		case 'AppliesToDeliveryMethod':
			return ' 0615687305';
		case 'AppliesToPaymentMethod':
			return '0610341305';
		case 'ApplyAction':
			return ' 06224';
		case 'Appreciate':
			return ' 0721';
		case 'Approve':
			return '078';
		case 'Apricot':
			return '0721';
		case 'Aquarium':
			return ' 2873';
		case 'AromaticGinger':
			return '7312747';
		case 'Arrange':
			return '744';
		case 'Arrest':
			return ' 791';
		case 'ArrivalAirport':
			return '78601';
		case 'ArrivalBusStop':
			return ' 78669910';
		case 'ArrivalGate':
			return ' 7861';
		case 'ArrivalPlatform':
			return ' 78606103';
		case 'ArrivalStation':
			return '7869124';
		case 'ArrivalTerminal':
			return ' 7861346';
		case 'ArrivalTime':
			return ' 78613';
		case 'Arrive':
			return ' 78';
		case 'ArriveAction':
			return '78224';
		case 'ArtEdition':
			return '1524';
		case 'ArtGallery':
			return '167';
		case 'ArtMedium':
			return ' 1353';
		case 'ArtPunk':
			return ' 1042';
		case 'Artichoke':
			return '1122';
		case 'Article':
			return '126';
		case 'ArticleBody':
			return ' 12665';
		case 'ArticleSection':
			return '1269224';
		case 'ArtworkSurface':
			return '182909';
		case 'Asafoetida':
			return ' 9015';
		case 'Asbestos':
			return ' 36919';
		case 'AsianUnderground':
			return '4445745';
		case 'AskAction':
			return ' 92224';
		case 'Asparagus':
			return '9079';
		case 'Asphalt':
			return '9061';
		case 'AssemblyVersion':
			return ' 9366824';
		case 'AssessAction':
			return '99224';
		case 'AssignAction':
			return '94224';
		case 'AssociatedArticle':
			return ' 9215126';
		case 'AssociatedMedia':
			return ' 921535';
		case 'Astringent':
			return ' 9174441';
		case 'Attach':
			return ' 112';
		case 'Attendee':
			return ' 145';
		case 'Attendees':
			return '145';
		case 'Audience':
			return ' 549';
		case 'AudienceType':
			return '54910';
		case 'AudioObject':
			return ' 56721';
		case 'AudiobookFormat':
			return ' 562031';
		case 'AuthorizeAction':
			return ' 073224';
		case 'AutoBodyShop':
			return ' 16520';
		case 'AutoDealer':
			return '156';
		case 'AutoPartsStore':
			return ' 10191';
		case 'AutoRental':
			return '17416';
		case 'AutoWash':
			return '182';
		case 'Autolytic':
			return '1699';
		case 'AutomatedTeller':
			return ' 13116';
		case 'AutomotiveBusiness':
			return '13186349';
		case 'AutomotiveOntologyWgclass':
			return '13184167';
		case 'Availability':
			return ' 86661';
		case 'AvailabilityEnds':
			return '8666145';
		case 'AvailabilityStarts':
			return '86661911';
		case 'AvailableAtOrFrom':
			return ' 86661073';
		case 'AvailableChannel':
			return '86661246';
		case 'AvailableDeliveryMethod':
			return '86665687305';
		case 'AvailableFrom':
			return ' 8666073';
		case 'AvailableLanguage':
			return ' 86666487';
		case 'AvailableOnDevice':
			return '86664589';
		case 'AvailableThrough':
			return '866607';
		case 'AvantGardeJazz':
			return ' 873';
		case 'Avocado':
			return '825';
		case 'AwayTeam':
			return '813';
		case 'Baked':
			return '621';
		case 'Bakery':
			return ' 627';
		case 'Balance':
			return '6649';
		case 'Balanced':
			return ' 66491';
		case 'BalearicBeat':
			return '667261';
		case 'BallisticNylon':
			return '66912464';
		case 'BaltimoreClub':
			return ' 6613266';
		case 'Banana':
			return ' 644';
		case 'BananaKetchup':
			return ' 6442120';
		case 'BananaSquash':
			return '6449282';
		case 'BankAccount':
			return ' 642241';
		case 'BankOrCreditUnion':
			return ' 64227519494';
		case 'BarOrPub':
			return ' 606';
		case 'Barathea':
			return ' 670';
		case 'BarbecueSauce':
			return ' 662999';
		case 'Barcode':
			return '625';
		case 'Barnyard':
			return ' 6495';
		case 'BaseSalary':
			return '69967';
		case 'Basil':
			return '636';
		case 'Bassline':
			return ' 69646964';
		case 'Bat':
			return '61';
		case 'Battle':
			return ' 616';
		case 'Beach':
			return '612';
		case 'BeanSprout':
			return '649071';
		case 'BeatMusic':
			return ' 613932';
		case 'BeauMondeSeasoning':
			return ' 69344';
		case 'BeautySalon':
			return ' 691964';
		case 'Bebop':
			return '660';
		case 'Bed':
			return '65';
		case 'BedAndBreakfast':
			return '6545672091';
		case 'BedDetails':
			return '65516';
		case 'BedfordCord':
			return ' 650756507525';
		case 'BefriendAction':
			return '60745224';
		case 'BellPepper':
			return '6600';
		case 'Belong':
			return ' 664';
		case 'Benefits':
			return ' 6401';
		case 'BengalineSilk':
			return ' 6464962';
		case 'Berkelium':
			return '6263';
		case 'Beryllium':
			return '6763';
		case 'BestRating':
			return '691714';
		case 'BetaCloth':
			return ' 61260';
		case 'BibExTerm':
			return '662913';
		case 'Bilberry':
			return ' 6667';
		case 'BillingAddress':
			return '664579';
		case 'BillingIncrement':
			return '664427341';
		case 'BillingPeriod':
			return ' 664075';
		case 'BirthDate':
			return ' 6051';
		case 'BirthPlace':
			return '60069';
		case 'Bismuth':
			return '6330';
		case 'Bitter':
			return ' 61';
		case 'BizarreSilk':
			return ' 63962';
		case 'BlackBean':
			return ' 66264';
		case 'BlackCardamom':
			return ' 6622533';
		case 'BlackEyedPea':
			return ' 66250';
		case 'BlackMetal':
			return '662316';
		case 'BlackMustard':
			return '6623915';
		case 'BlackPeppercorn':
			return ' 6620024';
		case 'BlackVinegar':
			return '66284';
		case 'Blackberry':
			return ' 66267';
		case 'Blackcurrant':
			return ' 6622741';
		case 'Bleach':
			return ' 6612';
		case 'Bless':
			return '669';
		case 'Blind':
			return '6645';
		case 'Blink':
			return '6642';
		case 'BlogPost':
			return '66091';
		case 'BlogPosting':
			return ' 660914';
		case 'BlogPosts':
			return ' 66091';
		case 'BloodOrange':
			return ' 665744';
		case 'Blueberry':
			return '6667';
		case 'Blush':
			return '662';
		case 'BoardingGroup':
			return ' 65470';
		case 'BoardingPolicy':
			return '654069';
		case 'BoardingPolicyType':
			return ' 65406910';
		case 'Boast':
			return '691';
		case 'Bobbinet':
			return ' 6641';
		case 'BodyOfWater':
			return '65881';
		case 'Bohrium':
			return '673';
		case 'BoiledWool':
			return '6686';
		case 'Boldo':
			return '665';
		case 'BolivianCoriander':
			return ' 66842745';
		case 'Bolt':
			return ' 661';
		case 'Bombazine':
			return '63634';
		case 'BookEdition':
			return ' 62524';
		case 'BookFormat':
			return '62031';
		case 'BookFormatType':
			return ' 6203110';
		case 'BookSeries':
			return '62973';
		case 'BookingAgent':
			return '624741';
		case 'BookingTime':
			return ' 62413';
		case 'BookmarkAction':
			return '6232224';
		case 'Boolean':
			return '664';
		case 'BorrowAction':
			return '67224';
		case 'BossaNova':
			return ' 48';
		case 'Bounce':
			return ' 649';
		case 'BouncyHouse':
			return ' 6499';
		case 'BouncyTechno':
			return '649124';
		case 'BowlingAlley':
			return '6646';
		case 'Box':
			return '629';
		case 'Boysenberry':
			return '63467';
		case 'Branch':
			return ' 6742';
		case 'BranchCode':
			return '674225';
		case 'BranchOf':
			return '67428';
		case 'Brand':
			return '6745';
		case 'BrazilianPepper':
			return ' 6736400';
		case 'Breadcrumb':
			return ' 675273';
		case 'BreadcrumbList':
			return '675273691';
		case 'Breadfruit':
			return ' 675071';
		case 'Breakbeat':
			return '67261';
		case 'BreakbeatHardcore':
			return ' 67261';
		case 'Breathe':
			return '679';
		case 'Brewery':
			return '677';
		case 'Bridge':
			return ' 677';
		case 'Bright':
			return ' 671';
		case 'Brilliance':
			return ' 676949';
		case 'Brilliantine':
			return ' 6769414';
		case 'BritishDance':
			return '6712549';
		case 'Britpop':
			return '67100';
		case 'BroadBeans':
			return '67564';
		case 'BroadcastAffiliateOf':
			return ' 6752910618';
		case 'BroadcastChannel':
			return '6752911246';
		case 'BroadcastChannelId':
			return ' 67529112465';
		case 'BroadcastDisplayName':
			return ' 675291590643';
		case 'BroadcastEvent':
			return '675291841';
		case 'BroadcastOfEvent':
			return ' 6752918841';
		case 'BroadcastRelease':
			return '675291769';
		case 'BroadcastService':
			return '675291989';
		case 'BroadcastServiceTier':
			return ' 6752919891';
		case 'BroadcastTimezone':
			return ' 675291';
		case 'Broadcaster':
			return '675291';
		case 'Broadcloth':
			return ' 675260';
		case 'Brocade':
			return '6725';
		case 'Broccoflower':
			return ' 672067672067';
		case 'Broccoli':
			return ' 6726';
		case 'BrokenBeat':
			return '672461';
		case 'BrownMustard':
			return '6743915';
		case 'BrowserRequirements':
			return ' 673728341';
		case 'Bruise':
			return ' 673';
		case 'Brush':
			return '672';
		case 'BrusselsSprout':
			return '679639071';
		case 'Bubble':
			return ' 666';
		case 'BubblegumDance':
			return '6663549';
		case 'Buckram':
			return '6273';
		case 'BuddhistTemple':
			return '65911306';
		case 'Bump':
			return ' 630';
		case 'Bunting':
			return '6414';
		case 'Burlap':
			return ' 660';
		case 'BusName':
			return ' 6943';
		case 'BusNumber':
			return ' 69436';
		case 'BusReservation':
			return '6973824';
		case 'BusStation':
			return '699124';
		case 'BusStop':
			return ' 69910';
		case 'BusTrip':
			return ' 69170';
		case 'BusinessAudience':
			return '6349549';
		case 'BusinessEntityType':
			return ' 634941110';
		case 'BusinessEvent':
			return ' 6349841';
		case 'BusinessFunction':
			return '63490424';
		case 'ButternutSquash':
			return ' 61419282';
		case 'Buttery':
			return '617';
		case 'ByArtist':
			return '6191';
		case 'Cabbage':
			return '267';
		case 'CableOrSatelliteService':
			return ' 2669161989';
		case 'Cadmium':
			return '2533';
		case 'CafeOrCoffeeShop':
			return '202020';
		case 'Calabrese':
			return '26679';
		case 'Calcium':
			return '2693';
		case 'Calculate':
			return '262961';
		case 'Calico':
			return ' 262';
		case 'Californium':
			return '26043';
		case 'Calories':
			return ' 267';
		case 'Cambric':
			return '23672';
		case 'Camp':
			return ' 230';
		case 'Campground':
			return ' 230745';
		case 'CampingPitch':
			return '2302304012';
		case 'Canal':
			return '246';
		case 'CanaryMelon':
			return ' 247364';
		case 'CancelAction':
			return '2496224';
		case 'Candidate':
			return '24551';
		case 'Cantaloupe':
			return ' 24160';
		case 'CanterburyScene':
			return ' 2416794';
		case 'Canvas':
			return ' 2489';
		case 'CapeJazz':
			return '2073';
		case 'Caption':
			return '2024';
		case 'Caraway':
			return '278';
		case 'CarbohydrateContent':
			return ' 2657124141';
		case 'CarbonFiber':
			return ' 26406';
		case 'Cardamom':
			return ' 2533';
		case 'CargoVolume':
			return ' 28693';
		case 'Carpet':
			return ' 201';
		case 'CarrierRequirements':
			return ' 27728341';
		case 'Carrot':
			return ' 271';
		case 'Cashmere':
			return ' 223';
		case 'Casino':
			return ' 294';
		case 'CassetteFormat':
			return '291031';
		case 'Cassis':
			return ' 299';
		case 'CatPee':
			return '210';
		case 'Catalog':
			return '216';
		case 'CatalogNumber':
			return ' 216436';
		case 'Category':
			return ' 217';
		case 'CatholicChurch':
			return '20621212';
		case 'Cauliflower':
			return '2606';
		case 'Cause':
			return '23';
		case 'CayennePepper':
			return ' 2400';
		case 'CedarBark':
			return ' 9562';
		case 'Celeriac':
			return ' 9672';
		case 'Celery':
			return ' 967';
		case 'CeleryPowder':
			return '96705';
		case 'CelerySeed':
			return '96795';
		case 'Celtic':
			return ' 2612';
		case 'CelticMetal':
			return ' 2612316';
		case 'CelticPunk':
			return '2612042';
		case 'Cement':
			return ' 9341';
		case 'Cemetery':
			return ' 9317';
		case 'CeramicTile':
			return ' 973216';
		case 'Cesium':
			return ' 933';
		case 'ChaatMasala':
			return ' 121396';
		case 'Challenge':
			return '12644';
		case 'ChamberJazz':
			return ' 123673';
		case 'Chambray':
			return ' 2367';
		case 'Chamomile':
			return '2336';
		case 'Change':
			return ' 1244';
		case 'CharCloth':
			return ' 12260';
		case 'CharacterAttribute':
			return '272117691';
		case 'CharacterName':
			return ' 272143';
		case 'Charcoal':
			return ' 1226';
		case 'Charmeuse':
			return '233';
		case 'Chase':
			return '129';
		case 'Cheat':
			return '121';
		case 'CheatCode':
			return ' 12125';
		case 'CheckAction':
			return ' 122224';
		case 'CheckInAction':
			return '1224224';
		case 'CheckOutAction':
			return ' 1221224';
		case 'CheckinTime':
			return ' 122413';
		case 'CheckoutPage':
			return '122107';
		case 'CheckoutTime':
			return '122113';
		case 'Cheesecloth':
			return '123260';
		case 'Chenille':
			return ' 246';
		case 'Cherimoya':
			return '1273';
		case 'Cherry':
			return ' 127';
		case 'Chervil':
			return '1286';
		case 'Chewy':
			return '12';
		case 'ChicagoHouse':
			return '229';
		case 'Chickpea':
			return ' 1220';
		case 'Chiffon':
			return '204';
		case 'ChildCare':
			return ' 12652';
		case 'ChildMaxAge':
			return '12653297';
		case 'ChildMinAge':
			return '1265347';
		case 'ChiliOil':
			return '1266';
		case 'ChiliPepper':
			return ' 12600';
		case 'ChiliPeppers':
			return '12600';
		case 'ChiliPowder':
			return ' 12605';
		case 'ChiliSauce':
			return '12699';
		case 'ChillOut':
			return '1261';
		case 'Chimichurri':
			return '123127';
		case 'ChineseRock':
			return ' 124372';
		case 'Chino':
			return '124';
		case 'Chintz':
			return ' 1249';
		case 'Chives':
			return ' 1283';
		case 'Chocolaty':
			return '12261';
		case 'Choke':
			return '122';
		case 'CholesterolContent':
			return '26917624141';
		case 'ChooseAction':
			return '123224';
		case 'Chop':
			return ' 120';
		case 'ChristianMetal':
			return '279124316';
		case 'ChristianPunk':
			return ' 279124042';
		case 'ChristianRock':
			return ' 27912472';
		case 'Chromium':
			return ' 2733';
		case 'Church':
			return ' 1212';
		case 'Chutney':
			return '1214';
		case 'Cicely':
			return ' 996';
		case 'CigarBox':
			return '9629';
		case 'Cilantro':
			return ' 96417';
		case 'CinderBlock':
			return ' 945662';
		case 'Cinnamon':
			return ' 9434';
		case 'Citation':
			return ' 9124';
		case 'CityHall':
			return '916';
		case 'CivicStructure':
			return '982917212';
		case 'Claim':
			return '263';
		case 'ClaimReviewed':
			return ' 263789';
		case 'ClassicTrance':
			return ' 26921749';
		case 'Clean':
			return '264';
		case 'Clementine':
			return ' 263414';
		case 'Clip':
			return ' 260';
		case 'ClipNumber':
			return '260436';
		case 'Closed':
			return ' 2635';
		case 'Closes':
			return ' 269';
		case 'ClothOfGold':
			return '260865';
		case 'ClothingStore':
			return ' 269491';
		case 'Cloudberry':
			return ' 26567';
		case 'Clove':
			return '268';
		case 'Coach':
			return '212';
		case 'Cobalt':
			return ' 2661';
		case 'CocktailSauce':
			return ' 221699';
		case 'Coconut':
			return '2241';
		case 'Code':
			return ' 25';
		case 'CodeRepository':
			return '2570317';
		case 'CodeSampleType':
			return ' 25930610';
		case 'CollardGreen':
			return '26574';
		case 'Collect':
			return '2621';
		case 'Collection':
			return ' 26224';
		case 'CollectionPage':
			return '2622407';
		case 'CollegeOrUniversity':
			return '26794891';
		case 'ComedyClub':
			return '235266';
		case 'ComedyEvent':
			return ' 235841';
		case 'Command':
			return '2345';
		case 'Comment':
			return '2341';
		case 'CommentAction':
			return ' 2341224';
		case 'CommentCount':
			return '2341241';
		case 'CommentPermission':
			return ' 23410324';
		case 'CommentText':
			return ' 23411291';
		case 'CommentTime':
			return ' 234113';
		case 'Communicate':
			return '239421';
		case 'CommunicateAction':
			return ' 239421224';
		case 'Compare':
			return '230';
		case 'Compete':
			return '2301';
		case 'Competitor':
			return ' 23011';
		case 'CompilationAlbum':
			return '230624663';
		case 'Complain':
			return ' 23064';
		case 'Complete':
			return ' 23061';
		case 'CompletedActionStatus':
			return '230612249119';
		case 'Complex':
			return '230629';
		case 'Composer':
			return ' 2303';
		case 'CompoundPriceSpecification':
			return ' 230450799090224';
		case 'ComputerLanguage':
			return '230916487';
		case 'ComputerStore':
			return ' 2309191';
		case 'Concentrate':
			return '2494171';
		case 'Concentrated':
			return ' 24941715';
		case 'Concern':
			return '2494';
		case 'Concrete':
			return ' 24271';
		case 'Conductive':
			return ' 245218';
		case 'Confess':
			return '2409';
		case 'ConfirmAction':
			return ' 2403224';
		case 'ConfirmationNumber':
			return '240324436';
		case 'Confuse':
			return '24093';
		case 'Connected':
			return '2421';
		case 'Consider':
			return ' 2495';
		case 'Consist':
			return '24991';
		case 'ConsumeAction':
			return ' 24993224';
		case 'ContactOption':
			return ' 24121024';
		case 'ContactPage':
			return ' 2412107';
		case 'ContactPoint':
			return '24121041';
		case 'ContactPointOption':
			return ' 24121041024';
		case 'ContactPoints':
			return ' 24121041';
		case 'ContactType':
			return ' 2412110';
		case 'Contain':
			return '2414';
		case 'ContainedIn':
			return ' 24144';
		case 'ContainedInPlace':
			return ' 24144069';
		case 'ContainsPlace':
			return ' 2414069';
		case 'ContainsSeason':
			return '2414934';
		case 'ContemporaryFolk':
			return '241307702';
		case 'ContentLocation':
			return ' 241416224';
		case 'ContentRating':
			return ' 24141714';
		case 'ContentSize':
			return ' 2414193';
		case 'ContentType':
			return ' 2414110';
		case 'ContentUrl':
			return '24141976';
		case 'Continent':
			return '241441';
		case 'ContinentalJazz':
			return ' 241441673';
		case 'Continue':
			return ' 24149';
		case 'Contributor':
			return '2417691';
		case 'ControlAction':
			return ' 24176224';
		case 'ConvenienceStore':
			return '24844991';
		case 'Conversation':
			return ' 248924';
		case 'CookAction':
			return '22224';
		case 'CookTime':
			return '2213';
		case 'CookingMethod':
			return ' 224305';
		case 'CoolJazz':
			return '2673';
		case 'Coolmax':
			return '26329';
		case 'CopyrightHolder':
			return ' 207165';
		case 'CopyrightYear':
			return ' 20719';
		case 'Cordura':
			return '2597';
		case 'Corduroy':
			return ' 257';
		case 'CorianderLeaf':
			return ' 274560';
		case 'CorianderSeed':
			return ' 274595';
		case 'Corked':
			return ' 221';
		case 'Corn':
			return ' 24';
		case 'CornSalad':
			return ' 24965';
		case 'Corporation':
			return '20724';
		case 'Correct':
			return '2721';
		case 'CosmicDisco':
			return ' 2332592';
		case 'Cotton':
			return ' 214';
		case 'Cough':
			return '20';
		case 'CountriesNotSupported':
			return '241741901';
		case 'CountriesSupported':
			return '2417901';
		case 'Country':
			return '2417';
		case 'CountryOfOrigin':
			return '24178774';
		case 'Courgette':
			return '241';
		case 'CourseCode':
			return '2925';
		case 'CourseInstance':
			return '2949149';
		case 'CourseMode':
			return '2935';
		case 'CoursePrerequisites':
			return ' 290772831';
		case 'Courthouse':
			return ' 219';
		case 'CoverageEndTime':
			return '28774513';
		case 'CoverageStartTime':
			return '287791113';
		case 'Cowpunk':
			return '2022042';
		case 'CrabBoil':
			return '27666';
		case 'Cranberry':
			return '27467';
		case 'Crape':
			return '270';
		case 'Crawl':
			return '276';
		case 'Creamy':
			return ' 273';
		case 'CreateAction':
			return '271224';
		case 'CreativeWork':
			return '271882';
		case 'CreativeWorkSeason':
			return ' 271882934';
		case 'CreativeWorkSeries':
			return ' 271882973';
		case 'Creator':
			return '271';
		case 'CreditCard':
			return '275125';
		case 'CreditedTo':
			return '27511';
		case 'Crematorium':
			return '273173';
		case 'Cretonne':
			return ' 2714';
		case 'Crimplene':
			return '273064';
		case 'Crisp':
			return '2790';
		case 'Cross':
			return '279';
		case 'CrossoverJazz':
			return ' 279873';
		case 'CrossoverThrash':
			return ' 2798072';
		case 'Crunk':
			return '2742';
		case 'Crush':
			return '272';
		case 'CrushedRedPepper':
			return ' 2727500';
		case 'CrustPunk':
			return ' 2791042';
		case 'Cubeb':
			return '2966';
		case 'Cucumber':
			return ' 29236';
		case 'Cumin':
			return '234';
		case 'Curium':
			return ' 2973';
		case 'Currant':
			return '2741';
		case 'CurrenciesAccepted':
			return '274929015';
		case 'Currency':
			return ' 2749';
		case 'CurrencyConversionService':
			return '274924824989';
		case 'CurryKetchup':
			return '272120';
		case 'CurryLeaf':
			return ' 2760';
		case 'CurryPowder':
			return ' 2705';
		case 'Customer':
			return ' 2913';
		case 'Daikon':
			return ' 524';
		case 'Dam':
			return '53';
		case 'Damage':
			return ' 537';
		case 'DamagedCondition':
			return '53724524';
		case 'Damask':
			return ' 5392';
		case 'Damson':
			return ' 5334';
		case 'DanceEvent':
			return '549841';
		case 'DanceGroup':
			return '54970';
		case 'DancePop':
			return '54900';
		case 'DancePunk':
			return ' 549042';
		case 'DanceRock':
			return ' 54972';
		case 'DarkAmbient':
			return ' 523641';
		case 'DarkCabaret':
			return ' 52267';
		case 'DarkElectro':
			return ' 526217';
		case 'DarkWave':
			return '5288';
		case 'DarksideJungle':
			return '746';
		case 'Darmstadtium':
			return ' 539113';
		case 'DataCatalog':
			return ' 51216';
		case 'DataDownload':
			return '515465';
		case 'DataFeed':
			return '5105';
		case 'DataFeedElement':
			return '51056341';
		case 'DataFeedItem':
			return ' 510513';
		case 'DataType':
			return '5110';
		case 'DatasetClass':
			return '269';
		case 'DatasetTimeInterval':
			return '134186';
		case 'DateCreated':
			return ' 51271';
		case 'DateDeleted':
			return ' 51561';
		case 'DateIssued':
			return '512';
		case 'DateModified':
			return '51350';
		case 'DatePosted':
			return '51091';
		case 'DatePublished':
			return ' 510662';
		case 'DateRead':
			return '5175';
		case 'DateReceived':
			return '51798';
		case 'DateSent':
			return '51941';
		case 'DateTime':
			return '5113';
		case 'DateVehicleFirstRegistered':
			return '518260917791';
		case 'DatedMoneySpecification':
			return '515349090224';
		case 'Dateline':
			return ' 5164';
		case 'DayOfWeek':
			return '5882';
		case 'Dazzle':
			return ' 536';
		case 'DeactivateAction':
			return '52181224';
		case 'DeathDate':
			return ' 5051';
		case 'DeathIndustrial':
			return ' 50459176';
		case 'DeathMetal':
			return '50316';
		case 'DeathPlace':
			return '50069';
		case 'Decay':
			return '52';
		case 'Deceive':
			return '598';
		case 'Decide':
			return ' 595';
		case 'Decorate':
			return ' 5271';
		case 'DeepHouse':
			return ' 509';
		case 'DefaultValue':
			return '5061869';
		case 'DefenceEstablishment':
			return '504991662341';
		case 'DeleteAction':
			return '561224';
		case 'Delight':
			return '561';
		case 'Deliver':
			return '568';
		case 'DeliveryAddress':
			return ' 5687579';
		case 'DeliveryChargeSpecification':
			return '56871279090224';
		case 'DeliveryEvent':
			return ' 5687841';
		case 'DeliveryLeadTime':
			return ' 56876513';
		case 'DeliveryMethod':
			return '5687305';
		case 'DeliveryStatus':
			return '56879119';
		case 'Demand':
			return ' 5345';
		case 'DemoAlbum':
			return ' 53663';
		case 'Denim':
			return '543';
		case 'Dense':
			return '549';
		case 'Dentist':
			return '54191';
		case 'DepartAction':
			return '501224';
		case 'Department':
			return ' 501341';
		case 'DepartmentStore':
			return ' 50134191';
		case 'DepartureAirport':
			return '501201';
		case 'DepartureBusStop':
			return ' 501269910';
		case 'DepartureGate':
			return ' 50121';
		case 'DeparturePlatform':
			return ' 501206103';
		case 'DepartureStation':
			return '50129124';
		case 'DepartureTerminal':
			return ' 50121346';
		case 'DepartureTime':
			return ' 501213';
		case 'Depend':
			return ' 5045';
		case 'Dependencies':
			return ' 504549';
		case 'DepositAccount':
			return '5031241';
		case 'Depth':
			return '500';
		case 'Describe':
			return ' 59276';
		case 'Description':
			return '5927024';
		case 'DesertRock':
			return '53172';
		case 'Deserve':
			return '538';
		case 'Destroy':
			return '5917';
		case 'Detect':
			return ' 5121';
		case 'DetroitTechno':
			return ' 5171124';
		case 'Develop':
			return '5860';
		case 'DiabeticDiet':
			return '561251';
		case 'DigitalAudioTapeFormat':
			return '5716510031';
		case 'DigitalDocument':
			return ' 5716529341';
		case 'DigitalDocumentPermission':
			return '57165293410324';
		case 'DigitalDocumentPermissionType':
			return ' 5716529341032410';
		case 'DigitalFormat':
			return ' 5716031';
		case 'DigitalHardcore':
			return ' 5716';
		case 'DijonKetchup':
			return '72120';
		case 'DijonMustard':
			return '73915';
		case 'Dill':
			return ' 56';
		case 'DillSeed':
			return '5695';
		case 'DimensionalLumber':
			return ' 534246636';
		case 'Dimity':
			return ' 531';
		case 'Dip':
			return '50';
		case 'Director':
			return ' 5721';
		case 'Directors':
			return '5721';
		case 'Disagree':
			return ' 597';
		case 'DisagreeAction':
			return '597224';
		case 'DisambiguatingDescription':
			return ' 5936915927024';
		case 'Disappear':
			return '590';
		case 'Disapprove':
			return ' 59078';
		case 'Disarm':
			return ' 593';
		case 'Disco':
			return '592';
		case 'DiscoPolo':
			return ' 59206';
		case 'Discontinued':
			return ' 59241495';
		case 'Discount':
			return ' 59241';
		case 'DiscountCode':
			return '5924125';
		case 'DiscountCurrency':
			return '592412749';
		case 'Discover':
			return ' 5928';
		case 'DiscoverAction':
			return '5928224';
		case 'Discusses':
			return '5929';
		case 'DiscussionForumPosting':
			return ' 592240730914';
		case 'DiscussionUrl':
			return ' 59224976';
		case 'Dislike':
			return '5962';
		case 'DislikeAction':
			return ' 5962224';
		case 'DissolutionDate':
			return ' 5962451';
		case 'Distance':
			return ' 59149';
		case 'Distribution':
			return ' 59176924';
		case 'DivaHouse':
			return ' 589';
		case 'Divide':
			return ' 585';
		case 'Dixieland':
			return '529645';
		case 'DjmixAlbum':
			return '663';
		case 'DonateAction':
			return '541224';
		case 'DonegalTweed':
			return '546185';
		case 'DoomMetal':
			return ' 53316';
		case 'DoorTime':
			return '513';
		case 'Double':
			return ' 566';
		case 'DownloadAction':
			return '5465224';
		case 'DownloadUrl':
			return ' 5465976';
		case 'DownvoteCount':
			return ' 5481241';
		case 'Drag':
			return ' 57';
		case 'DrawAction':
			return '57224';
		case 'Dream':
			return '573';
		case 'DreamHouse':
			return '5739';
		case 'DreamPop':
			return '57300';
		case 'DreamTrance':
			return ' 5731749';
		case 'Dress':
			return '579';
		case 'DriedLime':
			return ' 57563';
		case 'Drill':
			return '576';
		case 'DrinkAction':
			return ' 5742224';
		case 'DriveWheelConfiguration':
			return '57886240724';
		case 'DriveWheelConfigurationValue':
			return '57886240724869';
		case 'DroneMetal':
			return '574316';
		case 'Drop':
			return ' 570';
		case 'DropoffLocation':
			return ' 57006224';
		case 'DropoffTime':
			return ' 570013';
		case 'Drown':
			return '574';
		case 'Drugget':
			return '571';
		case 'Drum':
			return ' 573';
		case 'DrumAndBass':
			return '5734569';
		case 'Dry':
			return '57';
		case 'DryCleaningOrLaundry':
			return '572646457';
		case 'Dubnium':
			return '5643';
		case 'Dubstep':
			return '56910';
		case 'Duck':
			return ' 52';
		case 'DunedinSound':
			return '5454945';
		case 'Duration':
			return ' 59724';
		case 'DurationOfWarranty':
			return ' 5972488741';
		case 'Durian':
			return ' 574';
		case 'Dust':
			return ' 591';
		case 'DutchHouse':
			return '5129';
		case 'Dysprosium':
			return ' 590733';
		case 'ETextiles':
			return ' 12916';
		case 'EastAsianPepper':
			return '914400';
		case 'Ebook':
			return '62';
		case 'Editor':
			return ' 51';
		case 'Educate':
			return '5921';
		case 'EducationEvent':
			return '59224841';
		case 'EducationRequirements':
			return ' 59224728341';
		case 'EducationalAlignment':
			return '59224664341';
		case 'EducationalAudience':
			return ' 592246549';
		case 'EducationalFramework':
			return '59224607382';
		case 'EducationalOrganization':
			return ' 5922464324';
		case 'EducationalRole':
			return ' 59224676';
		case 'EducationalUse':
			return '59224693';
		case 'Eggplant':
			return ' 0641';
		case 'Einsteinium':
			return '49143';
		case 'Elderberry':
			return ' 6567';
		case 'Electrician':
			return '621724';
		case 'Electro':
			return '6217';
		case 'ElectroBackbeat':
			return ' 62176261';
		case 'ElectroGrime':
			return '621773';
		case 'ElectroHouse':
			return '62179';
		case 'ElectroIndustrial':
			return ' 6217459176';
		case 'Electroacoustic':
			return '62172912';
		case 'ElectronicArtMusic':
			return ' 62174213932';
		case 'ElectronicRock':
			return '62174272';
		case 'Electronica':
			return '621742';
		case 'ElectronicsStore':
			return '621742991';
		case 'Electropop':
			return ' 621700';
		case 'Elegant':
			return '641';
		case 'ElementarySchool':
			return '63417926';
		case 'Elevation':
			return '6824';
		case 'EligibleCustomerType':
			return ' 6766291310';
		case 'EligibleDuration':
			return '676659724';
		case 'EligibleQuantity':
			return '676628411';
		case 'EligibleRegion':
			return '6766774';
		case 'EligibleTransactionVolume':
			return '676617432248693';
		case 'Email':
			return '36';
		case 'EmailMessage':
			return '36397';
		case 'Embarrass':
			return '3679';
		case 'Embassy':
			return '369';
		case 'EmbedUrl':
			return '365976';
		case 'EmergencyService':
			return '3749989';
		case 'Employee':
			return ' 306';
		case 'EmployeeRole':
			return '30676';
		case 'Employees':
			return '306';
		case 'EmploymentAgency':
			return '306341749';
		case 'EmploymentType':
			return '30634110';
		case 'Empty':
			return '31';
		case 'EncodesCreativeWork':
			return '425271882';
		case 'Encoding':
			return ' 425';
		case 'EncodingFormat':
			return '425031';
		case 'EncodingType':
			return '42510';
		case 'Encodings':
			return '425';
		case 'Encourage':
			return '4277';
		case 'EndTime':
			return ' 4513';
		case 'Endive':
			return ' 458';
		case 'EndorseAction':
			return ' 459224';
		case 'EngineSpecification':
			return ' 4749090224';
		case 'Entertain':
			return '4114';
		case 'EntertainmentBusiness':
			return ' 41143416349';
		case 'EntryPoint':
			return '417041';
		case 'Enumeration':
			return '493724';
		case 'Epazote':
			return '031031';
		case 'EpicDoom':
			return '0253';
		case 'Episode':
			return '095';
		case 'EpisodeNumber':
			return ' 095436';
		case 'Episodes':
			return ' 095';
		case 'Equal':
			return '286';
		case 'EstimatedFlightDuration':
			return '913106159724';
		case 'EtherealWave':
			return '07688';
		case 'EthnicElectronica':
			return ' 042621742';
		case 'EuroDisco':
			return ' 97592';
		case 'EuropeanFreeJazz':
			return ' 97040773';
		case 'Europium':
			return ' 9703';
		case 'Event':
			return '841';
		case 'EventCancelled':
			return '8412496';
		case 'EventPostponed':
			return '8410904';
		case 'EventRescheduled':
			return '84172596';
		case 'EventReservation':
			return '84173824';
		case 'EventScheduled':
			return '84125965';
		case 'EventStatus':
			return ' 8419119';
		case 'EventStatusType':
			return '841911910';
		case 'EventVenue':
			return '841849';
		case 'Examine':
			return '334';
		case 'ExampleOfWork':
			return '3306882';
		case 'Excuse':
			return ' 29293';
		case 'ExecutableLibraryName':
			return '329166667743';
		case 'Exercise':
			return ' 2993';
		case 'ExerciseAction':
			return '2993224';
		case 'ExerciseCourse':
			return '299329';
		case 'ExerciseGym':
			return ' 299373';
		case 'ExhibitionEvent':
			return ' 29624841';
		case 'ExifData':
			return '51';
		case 'Expand':
			return ' 29045';
		case 'Expect':
			return ' 29021';
		case 'ExpectedArrivalFrom':
			return '29021786073';
		case 'ExpectedArrivalUntil':
			return ' 29021786416';
		case 'ExpectsAcceptanceOf':
			return '290212901498';
		case 'ExperienceRequirements':
			return '290749728341';
		case 'ExperimentalRock':
			return '2907341672';
		case 'Expires':
			return '290';
		case 'Explain':
			return '29064';
		case 'Explode':
			return '29065';
		case 'Expressive':
			return ' 290798';
		case 'Extend':
			return ' 29145';
		case 'Extracted':
			return '291721';
		case 'Fade':
			return ' 05';
		case 'FailedActionStatus':
			return ' 0652249119';
		case 'FallenOver':
			return '0648';
		case 'FamilyName':
			return '03643';
		case 'FastFoodRestaurant':
			return ' 09105791741';
		case 'FatContent':
			return '0124141';
		case 'FaxNumber':
			return ' 029436';
		case 'FeatureList':
			return ' 012691';
		case 'FeesAndCommissionsSpecification':
			return ' 04523249090224';
		case 'Fence':
			return '049';
		case 'Fennel':
			return ' 046';
		case 'Fenugreek':
			return '04972';
		case 'Fermium':
			return '033';
		case 'Festival':
			return ' 09186';
		case 'FiberContent':
			return '0624141';
		case 'FileFormat':
			return '06031';
		case 'FileSize':
			return '0693';
		case 'FilmAction':
			return '063224';
		case 'FinancialProduct':
			return '0442607521';
		case 'FinancialService':
			return '04426989';
		case 'FindAction':
			return '045224';
		case 'FireStation':
			return ' 09124';
		case 'FirstPerformance':
			return '09100349';
		case 'FishPaste':
			return ' 02091';
		case 'FishSauce':
			return ' 0299';
		case 'FiveSpicePowder':
			return '0890905';
		case 'Fix':
			return '029';
		case 'Flabby':
			return ' 066';
		case 'Flamboyant':
			return ' 063641';
		case 'Flannel':
			return '0646';
		case 'Flap':
			return ' 060';
		case 'Flight':
			return ' 061';
		case 'FlightDistance':
			return '06159149';
		case 'FlightNumber':
			return '061436';
		case 'FlightReservation':
			return ' 06173824';
		case 'Float':
			return '061';
		case 'Flood':
			return '065';
		case 'FloorSize':
			return ' 0693';
		case 'FloridaBreaks':
			return ' 0675672';
		case 'Florist':
			return '06791';
		case 'Fold':
			return ' 065';
		case 'FolkPunk':
			return '02042';
		case 'Folktronica':
			return '021742';
		case 'FoodEstablishment':
			return ' 0591662341';
		case 'FoodEstablishmentReservation':
			return ' 059166234173824';
		case 'FoodEvent':
			return ' 05841';
		case 'FoodFriendly':
			return '050746';
		case 'FoodService':
			return ' 05989';
		case 'Form':
			return ' 03';
		case 'Foulard':
			return '06';
		case 'Founder':
			return '045';
		case 'FoundingDate':
			return '04551';
		case 'FoundingLocation':
			return '0456224';
		case 'FourWheelDriveConfiguration':
			return ' 086578240724';
		case 'Foxy':
			return ' 029';
		case 'Francium':
			return ' 07493';
		case 'FreakFolk':
			return ' 07202';
		case 'Freestyle':
			return '07916';
		case 'FreestyleHouse':
			return '079169';
		case 'FrenchHouse':
			return ' 07429';
		case 'Friday':
			return ' 075';
		case 'Frighten':
			return ' 0714';
		case 'Frisee':
			return ' 073';
		case 'FromLocation':
			return '0736224';
		case 'FrontWheelDriveConfiguration':
			return '074186578240724';
		case 'FruitKetchup':
			return '0712120';
		case 'FruitPreserves':
			return '0710738';
		case 'Fry':
			return '07';
		case 'FrySauce':
			return '0799';
		case 'FuelConsumption':
			return ' 096249324';
		case 'FuelEfficiency':
			return '0960249';
		case 'FuelType':
			return '09610';
		case 'FuneralDoom':
			return ' 0947653';
		case 'FunkMetal':
			return ' 042316';
		case 'FunkyHouse':
			return '0429';
		case 'FurnitureStore':
			return '041291';
		case 'Fustian':
			return '0914';
		case 'Gadolinium':
			return ' 5643';
		case 'GamePlatform':
			return '306103';
		case 'GamePlayMode':
			return ' 30635';
		case 'GameServer':
			return '398';
		case 'GameServerStatus':
			return ' 3989119';
		case 'GameTip':
			return ' 310';
		case 'GaragePunk':
			return '74042';
		case 'GarageRock':
			return '7472';
		case 'GaramMasala':
			return ' 396';
		case 'GardenStore':
			return ' 5491';
		case 'GarlicChives':
			return '621283';
		case 'GarlicPowder':
			return '6205';
		case 'GarlicSalt':
			return '62961';
		case 'GasStation':
			return '99124';
		case 'GatedResidenceCommunity':
			return '157354923941';
		case 'GemSquash':
			return ' 739282';
		case 'Gender':
			return ' 745';
		case 'GenderType':
			return '74510';
		case 'GeneralContractor':
			return ' 7476241721';
		case 'GeoCircle':
			return ' 9926';
		case 'GeoCoordinates':
			return '92541';
		case 'GeoMidpoint':
			return ' 935041';
		case 'GeoRadius':
			return ' 9759';
		case 'GeoShape':
			return '920';
		case 'GeographicArea':
			return '770267';
		case 'Georgette':
			return '771';
		case 'GhettoHouse':
			return ' 19';
		case 'Ginger':
			return ' 747';
		case 'GivenName':
			return ' 8443';
		case 'GlamMetal':
			return ' 63316';
		case 'GlamRock':
			return '6372';
		case 'Glass':
			return '69';
		case 'GlassBrick':
			return '69672';
		case 'GlassFiber':
			return '6906';
		case 'GlassWool':
			return ' 6986';
		case 'GlobalLocationNumber':
			return ' 6666224436';
		case 'GlueLaminate':
			return '66341';
		case 'GlutenFreeDiet':
			return ' 6140751';
		case 'GojiBerry':
			return ' 67';
		case 'GolfCourse':
			return '6029';
		case 'GoodRelationsClass':
			return ' 57624269';
		case 'GoodRelationsTerms':
			return ' 5762413';
		case 'Gooseberry':
			return ' 367';
		case 'GothicMetal':
			return ' 02316';
		case 'GothicRock':
			return '0272';
		case 'GovernmentBuilding':
			return '843416654';
		case 'GovernmentOffice':
			return '8434109';
		case 'GovernmentOrganization':
			return '843414324';
		case 'GovernmentPermit':
			return '84341031';
		case 'GovernmentService':
			return ' 84341989';
		case 'GrainsOfParadise':
			return ' 7480759';
		case 'GrainsOfSelim':
			return '748';
		case 'Grapefruit':
			return ' 70071';
		case 'Gravel':
			return ' 786';
		case 'GreaterGalangal':
			return ' 71646';
		case 'GreaterOrEqual':
			return ' 71286';
		case 'GreenBean':
			return ' 7464';
		case 'GreenPepper':
			return ' 7400';
		case 'GreenPeppercorn':
			return ' 740024';
		case 'Grenadine':
			return '7454';
		case 'GrenfellCloth':
			return ' 7406260';
		case 'GroceryStore':
			return '79791';
		case 'GrooveMetal':
			return ' 78316';
		case 'Grosgrain':
			return '774';
		case 'GroupBoardingPolicy':
			return '70654069';
		case 'Guacamole':
			return '8236';
		case 'Guarantee':
			return '741';
		case 'Guava':
			return '88';
		case 'GypsumBoard':
			return ' 709365';
		case 'Habanero':
			return ' 647';
		case 'Haircloth':
			return '260';
		case 'HalalDiet':
			return ' 6651';
		case 'HardBop':
			return ' 560';
		case 'HardDance':
			return ' 5549';
		case 'HardRock':
			return '572';
		case 'HardTrance':
			return '51749';
		case 'Hardcover':
			return '528';
		case 'HardwareStore':
			return ' 5891';
		case 'HarrisTweed':
			return ' 79185';
		case 'HasCourseInstance':
			return '82949149';
		case 'HasDeliveryMethod':
			return '85687305';
		case 'HasDigitalDocumentPermission':
			return '857165293410324';
		case 'HasMap':
			return '830';
		case 'HasMenu':
			return ' 8349';
		case 'HasMenuItem':
			return '834913';
		case 'HasMenuSection':
			return ' 83499224';
		case 'HasOfferCatalog':
			return '80216';
		case 'HasPart':
			return ' 801';
		case 'Headline':
			return ' 564';
		case 'HealthAndBeautyBusiness':
			return ' 60456916349';
		case 'HealthClub':
			return '60266';
		case 'HearingImpairedSupported':
			return ' 74305901';
		case 'HeavyMetal':
			return '8316';
		case 'Help':
			return ' 60';
		case 'Herbaceous':
			return ' 629';
		case 'Herbal':
			return ' 66';
		case 'HerbesDeProvence':
			return ' 50789';
		case 'HerbsAndSpice':
			return '645909';
		case 'HighPrice':
			return ' 079';
		case 'HighSchool':
			return '926';
		case 'HinduDiet':
			return ' 4551';
		case 'HinduTemple':
			return ' 451306';
		case 'HipHouse':
			return '09';
		case 'HiringOrganization':
			return '4324';
		case 'HobbyShop':
			return ' 620';
		case 'Hodden':
			return ' 54';
		case 'HojaSanta':
			return ' 941263';
		case 'Holmium':
			return '633';
		case 'HolyBasil':
			return ' 6636';
		case 'HomeAndConstructionBusiness':
			return ' 345249172246349';
		case 'HomeGoodsStore':
			return ' 3591';
		case 'HomeLocation':
			return '36224';
		case 'HomeTeam':
			return '313';
		case 'HoneyDill':
			return ' 456';
		case 'Honeydew':
			return ' 459';
		case 'HonorificPrefix':
			return ' 470207029';
		case 'HonorificSuffix':
			return ' 47029029';
		case 'HorrorPunk':
			return '7042';
		case 'Horseradish':
			return '9752';
		case 'Hospital':
			return ' 9016';
		case 'HostingOrganization':
			return ' 914324';
		case 'HotMustard':
			return '13915';
		case 'HotSauce':
			return '199';
		case 'HotelRoom':
			return ' 1673';
		case 'Houndstooth':
			return '4310';
		case 'HoursAvailable':
			return '8666';
		case 'HousePainter':
			return '9047047';
		case 'HttpMethod':
			return '12110305';
		case 'Huckleberry':
			return '2667';
		case 'IataCode':
			return '125';
		case 'IceCreamShop':
			return ' 927320';
		case 'Identify':
			return ' 5410';
		case 'IdliPodi':
			return '56';
		case 'IgnoreAction':
			return '4224';
		case 'Illustrator':
			return '69171';
		case 'ImageGallery':
			return '3767';
		case 'ImageObject':
			return ' 376721';
		case 'Imagine':
			return '374';
		case 'Impress':
			return '3079';
		case 'Improve':
			return '3078';
		case 'InBroadcastLineup':
			return '4675291640';
		case 'InLanguage':
			return '46487';
		case 'InPlaylist':
			return '406691';
		case 'InStock':
			return ' 4912';
		case 'InStoreOnly':
			return '49146';
		case 'IncentiveCompensation':
			return ' 494182304924';
		case 'Incentives':
			return ' 49418';
		case 'Include':
			return '4265';
		case 'IncludedComposition':
			return ' 42655230324';
		case 'IncludedDataCatalog':
			return '4265551216';
		case 'IncludedInDataCatalog':
			return ' 42655451216';
		case 'IncludesObject':
			return '42656721';
		case 'Increase':
			return ' 4279';
		case 'IndianBayLeaf':
			return '454660';
		case 'IndieFolk':
			return ' 4502';
		case 'IndiePop':
			return '4500';
		case 'IndieRock':
			return ' 4572';
		case 'Indium':
			return ' 453';
		case 'IndividualProduct':
			return ' 4587607521';
		case 'Industrial':
			return ' 459176';
		case 'IndustrialFolk':
			return '45917602';
		case 'IndustrialMetal':
			return ' 459176316';
		case 'IndustrialRock':
			return '45917672';
		case 'Industry':
			return ' 45917';
		case 'IneligibleRegion':
			return '46766774';
		case 'Influence':
			return '40649';
		case 'Inform':
			return ' 403';
		case 'InformAction':
			return '403224';
		case 'Ingredients':
			return '47541';
		case 'Inject':
			return ' 4721';
		case 'Injure':
			return ' 47';
		case 'InsertAction':
			return '491224';
		case 'InstallAction':
			return ' 4916224';
		case 'InstallUrl':
			return '4916976';
		case 'Instructor':
			return ' 491721';
		case 'Instrument':
			return ' 4917341';
		case 'InsuranceAgency':
			return ' 42749749';
		case 'Intangible':
			return ' 414466';
		case 'Integer':
			return '417';
		case 'IntellectuallySatisfying':
			return '416212691904';
		case 'IntelligentDrumAndBass':
			return '4167415734569';
		case 'Intend':
			return ' 4145';
		case 'InteractAction':
			return '41721224';
		case 'InteractionCounter':
			return '417224241';
		case 'InteractionService':
			return '417224989';
		case 'InteractionStatistic':
			return '417224911912';
		case 'InteractionType':
			return ' 41722410';
		case 'InteractivityType':
			return ' 417218110';
		case 'Interest':
			return ' 41791';
		case 'InterestRate':
			return '4179171';
		case 'Interfere':
			return '410';
		case 'InternetCafe':
			return '414120';
		case 'Interrupt':
			return '41701';
		case 'Introduce':
			return '417599';
		case 'Invent':
			return ' 4841';
		case 'InventoryLevel':
			return '48417686';
		case 'InvestmentOrDeposit':
			return '4893415031';
		case 'Invite':
			return ' 481';
		case 'InviteAction':
			return '481224';
		case 'Invoice':
			return '489';
		case 'IrishLinen':
			return '72644';
		case 'Irritate':
			return ' 711';
		case 'IsAccessibleForFree':
			return ' 329966007';
		case 'IsAccessoryOrSparePartFor':
			return ' 3299790010';
		case 'IsBasedOn':
			return '3694';
		case 'IsBasedOnUrl':
			return '3694976';
		case 'IsConsumableFor':
			return '324993660';
		case 'IsFamilyFriendly':
			return ' 30360746';
		case 'IsGift':
			return '301';
		case 'IsLiveBroadcast':
			return '368675291';
		case 'IsPartOf':
			return ' 3018';
		case 'IsRelatedTo':
			return '376151';
		case 'IsSimilarTo':
			return '39361';
		case 'IsVariantOf':
			return '387418';
		case 'IssueNumber':
			return ' 2436';
		case 'IssuedBy':
			return '26';
		case 'IssuedThrough':
			return ' 207';
		case 'ItaloDance':
			return '16549';
		case 'ItaloDisco':
			return '16592';
		case 'ItaloHouse':
			return '169';
		case 'ItemAvailability':
			return '1386661';
		case 'ItemCondition':
			return ' 1324524';
		case 'ItemList':
			return '13691';
		case 'ItemListElement':
			return '136916341';
		case 'ItemListOrder':
			return '136915';
		case 'ItemListOrderAscending':
			return '1369159459454';
		case 'ItemListOrderDescending':
			return ' 1369155945';
		case 'ItemListOrderType':
			return ' 13691510';
		case 'ItemListUnordered':
			return '13691455';
		case 'ItemOffered':
			return ' 130';
		case 'ItemPage':
			return '1307';
		case 'ItemReviewed':
			return '13789';
		case 'ItemShipped':
			return ' 1320';
		case 'Jackfruit':
			return '72071';
		case 'Jalapeno':
			return ' 6049';
		case 'JamaicanJerkSpice':
			return '732472909';
		case 'JazzBlues':
			return ' 73663';
		case 'JazzFunk':
			return '73042';
		case 'JazzFusion':
			return '730944';
		case 'JazzRap':
			return ' 7370';
		case 'JazzRock':
			return '7372';
		case 'JerusalemArtichoke':
			return '779631122';
		case 'JewelryStore':
			return '76791';
		case 'Jicama':
			return ' 23';
		case 'JobBenefits':
			return ' 766401';
		case 'JobLocation':
			return ' 766224';
		case 'JobPosting':
			return '760914';
		case 'JobTitle':
			return '76116';
		case 'JoinAction':
			return '74224';
		case 'Judge':
			return '77';
		case 'Juicy':
			return '79';
		case 'Jujube':
			return ' 776';
		case 'JumpUp':
			return '7300';
		case 'JuniperBerry':
			return '74067';
		case 'KenteCloth':
			return '241260';
		case 'Kerseymere':
			return ' 233';
		case 'Ketchup':
			return '2120';
		case 'Kevlar':
			return ' 286';
		case 'Keywords':
			return ' 285';
		case 'KhakiDrill':
			return '22576';
		case 'Kick':
			return ' 22';
		case 'KidneyBean':
			return '25464';
		case 'Kill':
			return ' 26';
		case 'Kimchi':
			return ' 2312';
		case 'Kiss':
			return ' 29';
		case 'KiwiFruit':
			return ' 28071';
		case 'Kneel':
			return '46';
		case 'Knock':
			return '42';
		case 'KnownVehicleDamages':
			return '44826537';
		case 'Kohlrabi':
			return ' 2676';
		case 'KosherDiet':
			return '2251';
		case 'Krautrock':
			return '27172';
		case 'Kumquat':
			return '23281';
		case 'Label':
			return '666';
		case 'LakeBodyOfWater':
			return ' 6265881';
		case 'Lampas':
			return ' 6309';
		case 'Landform':
			return ' 6403';
		case 'Landlord':
			return ' 6465';
		case 'LandmarksOrHistoricalBuildings':
			return '6432917266654';
		case 'Language':
			return ' 6487';
		case 'Lanthanum':
			return '64043';
		case 'LaserDiscFormat':
			return '63592031';
		case 'LaserLike':
			return ' 6362';
		case 'LastReviewed':
			return '691789';
		case 'LatinHouse':
			return '6149';
		case 'LatinJazz':
			return ' 61473';
		case 'Latitude':
			return ' 61195';
		case 'Laugh':
			return '60';
		case 'Launch':
			return ' 642';
		case 'Lavender':
			return ' 6845';
		case 'Lawrencium':
			return ' 67493';
		case 'Learn':
			return '64';
		case 'LearningResourceType':
			return ' 64479910';
		case 'Leathery':
			return ' 697';
		case 'LeaveAction':
			return ' 68224';
		case 'LeftHandDriving':
			return '601455784';
		case 'LegalName':
			return ' 6643';
		case 'LegalService':
			return '66989';
		case 'LegislativeBuilding':
			return ' 6796186654';
		case 'Legume':
			return ' 693';
		case 'LeiCode':
			return ' 625';
		case 'Lemon':
			return '634';
		case 'LemonBalm':
			return ' 63463';
		case 'LemonGrass':
			return '63479';
		case 'LemonMyrtle':
			return ' 634316';
		case 'LemonPepper':
			return ' 63400';
		case 'LemonVerbena':
			return '634864';
		case 'LendAction':
			return '645224';
		case 'Lender':
			return ' 645';
		case 'Lentils':
			return '6416';
		case 'Lesser':
			return ' 69';
		case 'LesserGalangal':
			return '69646';
		case 'LesserOrEqual':
			return '69286';
		case 'Lettuce':
			return '619';
		case 'Library':
			return '6677';
		case 'License':
			return '6949';
		case 'Lighten':
			return '614';
		case 'LikeAction':
			return '62224';
		case 'LimaBean':
			return '6364';
		case 'Lime':
			return ' 63';
		case 'LimitedAvailability':
			return ' 631586661';
		case 'Linen':
			return '644';
		case 'LiquidFunk':
			return '6285042';
		case 'LiquorStore':
			return ' 6291';
		case 'Liquorice':
			return '6272';
		case 'List':
			return ' 691';
		case 'ListItem':
			return '69113';
		case 'Listen':
			return ' 694';
		case 'ListenAction':
			return '694224';
		case 'LiteraryEvent':
			return ' 6177841';
		case 'Lithium':
			return '603';
		case 'LiveAlbum':
			return ' 68663';
		case 'LiveBlogPosting':
			return '68660914';
		case 'LiveBlogUpdate':
			return ' 6866051';
		case 'Load':
			return ' 65';
		case 'LoanOrCredit':
			return ' 642751';
		case 'LoanTerm':
			return '6413';
		case 'LocalBusiness':
			return ' 6266349';
		case 'Location':
			return ' 6224';
		case 'LocationCreated':
			return ' 6224271';
		case 'LocationFeatureSpecification':
			return ' 62240129090224';
		case 'LockerDelivery':
			return '625687';
		case 'Locksmith':
			return '62930';
		case 'Loden':
			return '654';
		case 'LodgingBusiness':
			return ' 6746349';
		case 'LodgingReservation':
			return '67473824';
		case 'LodgingUnitDescription':
			return ' 6749415927024';
		case 'LodgingUnitType':
			return '67494110';
		case 'LongPepper':
			return '6400';
		case 'Longitude':
			return '64195';
		case 'Look':
			return ' 62';
		case 'Loquat':
			return ' 6281';
		case 'LoseAction':
			return '63224';
		case 'Loser':
			return '63';
		case 'Lovage':
			return ' 687';
		case 'Love':
			return ' 68';
		case 'LowCalorieDiet':
			return ' 626751';
		case 'LowFatDiet':
			return ' 60151';
		case 'LowLactoseDiet':
			return ' 6621351';
		case 'LowPrice':
			return '6079';
		case 'LowSaltDiet':
			return '696151';
		case 'Lutetium':
			return ' 6123';
		case 'Lychee':
			return ' 612';
		case 'Lyricist':
			return ' 67991';
		case 'Lyrics':
			return ' 672';
		case 'MachineKnitting':
			return ' 324414';
		case 'Madras':
			return ' 3579';
		case 'Magnesium':
			return '3433';
		case 'MainContentOfPage':
			return ' 3424141807';
		case 'MainEntity':
			return '34411';
		case 'MainEntityOfPage':
			return '34411807';
		case 'MainstreamJazz':
			return '34917373';
		case 'MakesOffer':
			return '320';
		case 'Male':
			return ' 36';
		case 'Mamey':
			return '33';
		case 'Manage':
			return ' 347';
		case 'Mandarine':
			return '34574';
		case 'Manganese':
			return '3443';
		case 'Mangetout':
			return '341';
		case 'MangoGinger':
			return ' 34747';
		case 'MangoPickle':
			return ' 34026';
		case 'Manufacturer':
			return ' 34902127';
		case 'MapCategoryType':
			return '3021710';
		case 'MapType':
			return ' 3010';
		case 'Marjoram':
			return ' 3773';
		case 'MarryAction':
			return ' 37224';
		case 'Mastic':
			return ' 3912';
		case 'Match':
			return '312';
		case 'Material':
			return ' 3176';
		case 'MathRock':
			return '3072';
		case 'Matter':
			return ' 31';
		case 'MaxPrice':
			return '329079';
		case 'MaxValue':
			return '329869';
		case 'MaximumAttendeeCapacity':
			return '329331452091';
		case 'Mayonnaise':
			return ' 343';
		case 'MealService':
			return ' 36989';
		case 'MediaObject':
			return ' 356721';
		case 'MedicalOrganization':
			return ' 35264324';
		case 'MedievalMetal':
			return ' 3586316';
		case 'Meitnerium':
			return ' 31473';
		case 'MelodicDeathMetal':
			return '365250316';
		case 'Melt':
			return ' 361';
		case 'Member':
			return ' 336';
		case 'MemberOf':
			return '3368';
		case 'Members':
			return '336';
		case 'MembershipNumber':
			return '33620436';
		case 'Memorise':
			return ' 3373';
		case 'MemoryRequirements':
			return '337728341';
		case 'Mendelevium':
			return '345683';
		case 'MensClothingStore':
			return '269491';
		case 'Mentions':
			return ' 3424';
		case 'Menu':
			return ' 349';
		case 'MenuItem':
			return '34913';
		case 'MenuSection':
			return ' 3499224';
		case 'Merchant':
			return ' 31241';
		case 'Mercury':
			return '3297';
		case 'Mesh':
			return ' 32';
		case 'MessUp':
			return '390';
		case 'Message':
			return '397';
		case 'MessageAttachment':
			return ' 397112341';
		case 'Microfiber':
			return ' 32706';
		case 'Microhouse':
			return '3436';
		case 'MiddleSchool':
			return '356926';
		case 'MignonetteSauce':
			return ' 3494199';
		case 'MileageFromOdometer':
			return '367073531';
		case 'Milk':
			return ' 362';
		case 'MinPrice':
			return '34079';
		case 'MinValue':
			return '34869';
		case 'MinimumPaymentDue':
			return '3433034159';
		case 'Mint':
			return ' 341';
		case 'Miss':
			return ' 39';
		case 'Mix':
			return '329';
		case 'MixedSpice':
			return '3291909';
		case 'MixtapeAlbum':
			return '32910663';
		case 'Moan':
			return ' 34';
		case 'MobileApplication':
			return ' 36606224';
		case 'MobilePhoneStore':
			return ' 3660491';
		case 'ModalJazz':
			return ' 35673';
		case 'Model':
			return '356';
		case 'ModifiedTime':
			return '35013';
		case 'Moleskin':
			return ' 36924';
		case 'Molybdenum':
			return ' 366543';
		case 'Monday':
			return ' 345';
		case 'MonetaryAmount':
			return '3417341';
		case 'MonkeyGlandSauce':
			return ' 34264599';
		case 'MontrealSteakSeasoning':
			return ' 341769129344';
		case 'Moquette':
			return ' 321';
		case 'Mosque':
			return ' 392';
		case 'Motel':
			return '316';
		case 'MotorcycleDealer':
			return '3192656';
		case 'MotorcycleRepair':
			return '3192670';
		case 'Mountain':
			return ' 3414';
		case 'Mourn':
			return '34';
		case 'Move':
			return ' 38';
		case 'MoveAction':
			return '38224';
		case 'Movie':
			return '38';
		case 'MovieClip':
			return ' 38260';
		case 'MovieRentalStore':
			return ' 38741691';
		case 'MovieSeries':
			return ' 38973';
		case 'MovieTheater':
			return '3801';
		case 'MovingCompany':
			return ' 3842304';
		case 'Mud':
			return '35';
		case 'Muddle':
			return ' 356';
		case 'Mugwort':
			return '381';
		case 'Mulberry':
			return ' 3667';
		case 'MullingSpices':
			return ' 36909';
		case 'MultipleValues':
			return '36106869';
		case 'Multiply':
			return ' 36106';
		case 'MumboSauce':
			return '99';
		case 'MungBean':
			return '3464';
		case 'Murder':
			return ' 35';
		case 'Museum':
			return ' 3933';
		case 'Mushroom':
			return ' 3273';
		case 'MushroomKetchup':
			return ' 32732120';
		case 'MusicAlbum':
			return '3932663';
		case 'MusicAlbumProductionType':
			return '393266307522410';
		case 'MusicAlbumReleaseType':
			return ' 393266376910';
		case 'MusicArrangement':
			return '3932744341';
		case 'MusicBy':
			return ' 39326';
		case 'MusicComposition':
			return '3932230324';
		case 'MusicCompositionForm':
			return ' 393223032403';
		case 'MusicEvent':
			return '3932841';
		case 'MusicGroup':
			return '393270';
		case 'MusicGroupMember':
			return ' 393270336';
		case 'MusicPlaylist':
			return ' 393206691';
		case 'MusicRecording':
			return '39327254';
		case 'MusicRelease':
			return '3932769';
		case 'MusicReleaseFormat':
			return ' 3932769031';
		case 'MusicReleaseFormatType':
			return '393276903110';
		case 'MusicStore':
			return '393291';
		case 'MusicVenue':
			return '3932849';
		case 'MusicVideoObject':
			return ' 3932856721';
		case 'MusicalKey':
			return '393262';
		case 'Muslin':
			return ' 3364';
		case 'Mustard':
			return '3915';
		case 'MustardGreen':
			return '391574';
		case 'MustardOil':
			return '39156';
		case 'Musty':
			return '391';
		case 'NailSalon':
			return ' 46964';
		case 'Nainsook':
			return ' 4492';
		case 'NamedPosition':
			return ' 430324';
		case 'Nankeen':
			return '4424';
		case 'Nationality':
			return '42461';
		case 'NavyBean':
			return '4864';
		case 'Nectarine':
			return '42174';
		case 'Need':
			return ' 45';
		case 'NeoBopJazz':
			return ' 46073';
		case 'NeoPsychedelia':
			return '49256';
		case 'NeoSwing':
			return '4984';
		case 'Neodymium':
			return '4533';
		case 'Neptunium':
			return '401943';
		case 'Nest':
			return ' 491';
		case 'NetWorth':
			return '4180';
		case 'NewAge':
			return '497';
		case 'NewBeat':
			return ' 4961';
		case 'NewCondition':
			return '4924524';
		case 'NewProg':
			return ' 4907';
		case 'NewRave':
			return ' 4978';
		case 'NewWave':
			return ' 4988';
		case 'NewZealandSpinach':
			return '4936459047';
		case 'NewsArticle':
			return ' 493126';
		case 'NextItem':
			return '429113';
		case 'Ngo':
			return '47';
		case 'Nickel':
			return ' 426';
		case 'Nigella':
			return '476';
		case 'NigellaSativa':
			return ' 476';
		case 'NightClub':
			return ' 41266';
		case 'Ninon':
			return '444';
		case 'Niobium':
			return '463';
		case 'Nobelium':
			return ' 4663';
		case 'NoisePop':
			return '4300';
		case 'NoiseRock':
			return ' 4372';
		case 'NonEqual':
			return '44286';
		case 'Notary':
			return ' 417';
		case 'Note':
			return ' 41';
		case 'NoteDigitalDocument':
			return '415716529341';
		case 'Notice':
			return ' 419';
		case 'NoveltyRagtime':
			return '4861713';
		case 'NuDisco':
			return ' 49592';
		case 'NuJazz':
			return '4973';
		case 'NuMetal':
			return ' 49316';
		case 'NuSkoolBreaks':
			return '49672';
		case 'Null':
			return ' 46';
		case 'NumAdults':
			return ' 561';
		case 'NumChildren':
			return ' 126574';
		case 'Number':
			return ' 436';
		case 'NumberOfAirbags':
			return '43686';
		case 'NumberOfAxles':
			return '4368296';
		case 'NumberOfBeds':
			return ' 436865';
		case 'NumberOfDoors':
			return '436853';
		case 'NumberOfEmployees':
			return '4368306';
		case 'NumberOfEpisodes':
			return ' 4368095';
		case 'NumberOfForwardGears':
			return '4368085';
		case 'NumberOfItems':
			return '436813';
		case 'NumberOfPages':
			return '436807';
		case 'NumberOfPlayers':
			return '436806';
		case 'NumberOfPreviousOwners':
			return '436807894';
		case 'NumberOfRooms':
			return '436873';
		case 'NumberOfSeasons':
			return '4368934';
		case 'NumberedPosition':
			return '4360324';
		case 'Nut':
			return '41';
		case 'Nutmeg':
			return ' 413';
		case 'Nutrition':
			return '491724';
		case 'NutritionInformation':
			return '49172440324';
		case 'NutritionalYeast':
			return '4917246991';
		case 'Nylon':
			return '464';
		case 'Oaked':
			return '21';
		case 'Object':
			return ' 6721';
		case 'Observe':
			return '638';
		case 'Obtain':
			return ' 614';
		case 'Occupancy':
			return '29049';
		case 'OccupationalCategory':
			return '290246217';
		case 'OceanBodyOfWater':
			return '2465881';
		case 'OfferCatalog':
			return '0216';
		case 'OfferCount':
			return '0241';
		case 'OfferItemCondition':
			return ' 01324524';
		case 'OfficeEquipmentStore':
			return ' 0928034191';
		case 'OfflinePermanently':
			return '064034416';
		case 'OfflineTemporarily':
			return '064130776';
		case 'Oilskin':
			return '6924';
		case 'Okra':
			return ' 27';
		case 'OldBaySeasoning':
			return '6569344';
		case 'OldschoolJungle':
			return ' 746';
		case 'Olefin':
			return ' 604';
		case 'Olive':
			return '68';
		case 'OliveOil':
			return '686';
		case 'OnDemandEvent':
			return '45345841';
		case 'OnSitePickup':
			return ' 491020';
		case 'Onion':
			return '494';
		case 'OnionPowder':
			return ' 49405';
		case 'Online':
			return ' 464';
		case 'OnlineFull':
			return '46406';
		case 'OnlineOnly':
			return '46446';
		case 'OpeningHours':
			return '044';
		case 'OpeningHoursSpecification':
			return '0449090224';
		case 'OperatingSystem':
			return ' 0719913';
		case 'Opponent':
			return ' 0441';
		case 'Option':
			return ' 024';
		case 'Opulent':
			return '09641';
		case 'Orange':
			return ' 744';
		case 'OrchestralJazz':
			return '2917673';
		case 'OrchestralUplifting':
			return ' 2917606014';
		case 'OrderAction':
			return ' 5224';
		case 'OrderCancelled':
			return '52496';
		case 'OrderDate':
			return ' 551';
		case 'OrderDelivered':
			return '5568';
		case 'OrderDelivery':
			return ' 55687';
		case 'OrderInTransit':
			return ' 5417491';
		case 'OrderItemNumber':
			return '513436';
		case 'OrderItemStatus':
			return '5139119';
		case 'OrderNumber':
			return ' 5436';
		case 'OrderPaymentDue':
			return '5034159';
		case 'OrderPickupAvailable':
			return ' 50208666';
		case 'OrderProblem':
			return '507663';
		case 'OrderProcessing':
			return ' 50799';
		case 'OrderQuantity':
			return ' 528411';
		case 'OrderReturned':
			return ' 5714';
		case 'OrderStatus':
			return ' 59119';
		case 'OrderedItem':
			return ' 513';
		case 'Organdy':
			return '45';
		case 'Organization':
			return ' 4324';
		case 'OrganizationRole':
			return '432476';
		case 'OrganizeAction':
			return '43224';
		case 'Organza':
			return '43';
		case 'OrientedStrandBoard':
			return '7419174565';
		case 'OriginAddress':
			return ' 774579';
		case 'Osmium':
			return ' 333';
		case 'Osnaburg':
			return ' 346';
		case 'Ottoman':
			return '134';
		case 'OutOfStock':
			return ' 18912';
		case 'OutletStore':
			return ' 16191';
		case 'Overflow':
			return ' 806';
		case 'OwnedFrom':
			return ' 4073';
		case 'OwnedThrough':
			return '407';
		case 'OwnershipInfo':
			return ' 42040';
		case 'Oxford':
			return ' 2905';
		case 'Oxidized':
			return ' 2953';
		case 'Paddle':
			return ' 056';
		case 'Paduasoy':
			return ' 0599';
		case 'PageEnd':
			return ' 0745';
		case 'PageStart':
			return ' 07911';
		case 'Pagination':
			return ' 07424';
		case 'PaintAction':
			return ' 041224';
		case 'Painting':
			return ' 0414';
		case 'Paisley':
			return '036';
		case 'PaisleyUnderground':
			return '03645745';
		case 'Palladium':
			return '0653';
		case 'Paperback':
			return '0062';
		case 'Paprika':
			return '0072';
		case 'ParallelStrandLumber':
			return ' 076691745636';
		case 'ParcelDelivery':
			return '0965687';
		case 'ParcelService':
			return ' 096989';
		case 'Parent':
			return ' 0741';
		case 'ParentAudience':
			return '0741549';
		case 'ParentItem':
			return '074113';
		case 'ParentOrganization':
			return '07414324';
		case 'ParentService':
			return ' 0741989';
		case 'ParkingFacility':
			return ' 020961';
		case 'ParkingMap':
			return '0230';
		case 'Parsley':
			return '096';
		case 'Parsnip':
			return '0940';
		case 'PartOfEpisode':
			return '018095';
		case 'PartOfInvoice':
			return '018489';
		case 'PartOfOrder':
			return '0185';
		case 'PartOfSeason':
			return ' 018934';
		case 'PartOfSeries':
			return ' 018973';
		case 'PartOfTvseries':
			return ' 018';
		case 'Participant':
			return '019041';
		case 'PartySize':
			return ' 0193';
		case 'Pashmina':
			return ' 0234';
		case 'Pass':
			return ' 09';
		case 'PassengerPriorityStatus':
			return '094707719119';
		case 'PassengerSequenceNumber':
			return '094792849436';
		case 'PattyPan':
			return '0104';
		case 'Pause':
			return '03';
		case 'PawnShop':
			return '0420';
		case 'PayAction':
			return ' 0224';
		case 'PaymentAccepted':
			return ' 034129015';
		case 'PaymentAutomaticallyApplied':
			return '034113126065';
		case 'PaymentCard':
			return ' 034125';
		case 'PaymentChargeSpecification':
			return ' 03411279090224';
		case 'PaymentComplete':
			return ' 034123061';
		case 'PaymentDeclined':
			return ' 03415264';
		case 'PaymentDue':
			return '034159';
		case 'PaymentDueDate':
			return ' 03415951';
		case 'PaymentMethod':
			return ' 0341305';
		case 'PaymentMethodId':
			return '03413055';
		case 'PaymentPastDue':
			return ' 034109159';
		case 'PaymentService':
			return '0341989';
		case 'PaymentStatus':
			return ' 03419119';
		case 'PaymentStatusType':
			return '0341911910';
		case 'PaymentUrl':
			return '0341976';
		case 'Peach':
			return '012';
		case 'Pedal':
			return '056';
		case 'Peep':
			return ' 00';
		case 'PeopleAudience':
			return '006549';
		case 'PepperJelly':
			return ' 0076';
		case 'Percale':
			return '026';
		case 'PerformAction':
			return ' 003224';
		case 'PerformanceRole':
			return ' 0034976';
		case 'Performer':
			return '003';
		case 'PerformerIn':
			return ' 0034';
		case 'Performers':
			return ' 003';
		case 'PerformingArtsTheater':
			return '003101';
		case 'PerformingGroup':
			return ' 00370';
		case 'Perilla':
			return '076076';
		case 'Periodical':
			return ' 07526';
		case 'PermissionType':
			return '032410';
		case 'Permit':
			return ' 031';
		case 'PermitAudience':
			return '031549';
		case 'PermittedUsage':
			return '031997';
		case 'Persimmon':
			return '0934';
		case 'Person':
			return ' 094';
		case 'PeruvianPepper':
			return '078400';
		case 'PetStore':
			return '0191';
		case 'PetsAllowed':
			return ' 016';
		case 'Pharmacy':
			return ' 039';
		case 'Photo':
			return '01';
		case 'Photograph':
			return ' 0170';
		case 'PhotographAction':
			return '0170224';
		case 'Photos':
			return ' 01';
		case 'Physalis':
			return ' 0969';
		case 'Piccalilli':
			return ' 0266';
		case 'PickledCucumber':
			return ' 026529236';
		case 'PickledFruit':
			return '0265071';
		case 'PickledOnion':
			return '0265494';
		case 'PickledPepper':
			return ' 026500';
		case 'PickupLocation':
			return '0206224';
		case 'PickupTime':
			return '02013';
		case 'PicoDeGallo':
			return '0256';
		case 'PinStripes':
			return '049170';
		case 'Pine':
			return ' 04';
		case 'Pineapple':
			return '0406';
		case 'PintoBean':
			return ' 04164';
		case 'Place':
			return '069';
		case 'PlaceOfWorship':
			return ' 0698820';
		case 'Plan':
			return ' 064';
		case 'PlanAction':
			return '064224';
		case 'Plant':
			return '0641';
		case 'Plastic':
			return '06912';
		case 'PlasticLaminate':
			return ' 069126341';
		case 'Platinum':
			return ' 06143';
		case 'PlayAction':
			return '06224';
		case 'PlayMode':
			return '0635';
		case 'PlayerType':
			return '0610';
		case 'PlayersOnline':
			return ' 06464';
		case 'Playground':
			return ' 06745';
		case 'Plush':
			return '062';
		case 'Plutonium':
			return '06143';
		case 'Plywood':
			return '0685';
		case 'Point':
			return '041';
		case 'PolarFleece':
			return ' 06069';
		case 'PoliceStation':
			return ' 0699124';
		case 'Polish':
			return ' 062';
		case 'Polonium':
			return ' 0643';
		case 'Polyester':
			return '0691';
		case 'Polygon':
			return '064';
		case 'Polystyrene':
			return '069174';
		case 'Polyurethane':
			return ' 069704';
		case 'Pomegranate':
			return '03741';
		case 'PomegranateSeed':
			return ' 0374195';
		case 'Pomelo':
			return ' 036';
		case 'Pond':
			return ' 045';
		case 'Pongee':
			return ' 047';
		case 'Pop':
			return '00';
		case 'PopPunk':
			return ' 00042';
		case 'PopRock':
			return ' 0072';
		case 'PopcornSeasoning':
			return '00249344';
		case 'Poplin':
			return ' 0064';
		case 'PoppySeed':
			return ' 0095';
		case 'Position':
			return ' 0324';
		case 'Possess':
			return '039';
		case 'Post':
			return ' 091';
		case 'PostBop':
			return ' 09160';
		case 'PostBritpop':
			return ' 09167100';
		case 'PostDisco':
			return ' 091592';
		case 'PostGrunge':
			return '091744';
		case 'PostHardcore':
			return '091';
		case 'PostMetal':
			return ' 091316';
		case 'PostOffice':
			return '09109';
		case 'PostOfficeBoxNumber':
			return ' 09109629436';
		case 'PostPunk':
			return '091042';
		case 'PostPunkRevival':
			return '0910427886';
		case 'PostRock':
			return '09172';
		case 'PostalAddress':
			return ' 0916579';
		case 'PostalCode':
			return '091625';
		case 'Potassium':
			return '0193';
		case 'Potato':
			return ' 011';
		case 'PotentialAction':
			return ' 01426224';
		case 'PotentialActionStatus':
			return '014262249119';
		case 'PowderDouce':
			return ' 0559';
		case 'PowerElectronics':
			return '06217429';
		case 'PowerMetal':
			return '0316';
		case 'PowerNoise':
			return '043';
		case 'PowerPop':
			return '000';
		case 'Powerful':
			return ' 006';
		case 'Practise':
			return ' 07219';
		case 'Praseodymium':
			return ' 073533';
		case 'Pray':
			return ' 07';
		case 'PreOrder':
			return '075';
		case 'PreSale':
			return ' 0796';
		case 'Preach':
			return ' 0712';
		case 'Precede':
			return '0795';
		case 'PredecessorOf':
			return ' 075998';
		case 'Prefer':
			return ' 070';
		case 'PrepTime':
			return '07013';
		case 'Prepare':
			return '070';
		case 'PrependAction':
			return ' 07045224';
		case 'Preschool':
			return '07926';
		case 'Present':
			return '07341';
		case 'PresentationDigitalDocument':
			return '07341245716529341';
		case 'Preserve':
			return ' 0738';
		case 'Pretend':
			return '07145';
		case 'Prevent':
			return '07841';
		case 'PreviousItem':
			return '078913';
		case 'PreviousStartDate':
			return '078991151';
		case 'Price':
			return '079';
		case 'PriceComponent':
			return '079230441';
		case 'PriceCurrency':
			return ' 0792749';
		case 'PriceRange':
			return '079744';
		case 'PriceSpecification':
			return '0799090224';
		case 'PriceType':
			return ' 07910';
		case 'PriceValidUntil':
			return '079865416';
		case 'Prick':
			return '072';
		case 'PrimaryImageOfPage':
			return '073737807';
		case 'Print':
			return '0741';
		case 'PrintColumn':
			return ' 0741263';
		case 'PrintEdition':
			return '0741524';
		case 'PrintPage':
			return ' 074107';
		case 'PrintSection':
			return '07419224';
		case 'ProcessingTime':
			return '079913';
		case 'ProcessorRequirements':
			return ' 0799728341';
		case 'Produce':
			return '07599';
		case 'Produces':
			return ' 07599';
		case 'Product':
			return '07521';
		case 'ProductId':
			return ' 075215';
		case 'ProductModel':
			return '07521356';
		case 'ProductSupported':
			return '07521901';
		case 'ProductionCompany':
			return ' 0752242304';
		case 'ProductionDate':
			return '07522451';
		case 'ProfessionalService':
			return ' 070246989';
		case 'ProficiencyLevel':
			return '070249686';
		case 'ProfilePage':
			return ' 070607';
		case 'ProgramMembership':
			return ' 33620';
		case 'ProgramMembershipUsed':
			return '33620935';
		case 'ProgramName':
			return ' 43';
		case 'ProgrammingLanguage':
			return ' 077346487';
		case 'ProgrammingModel':
			return '07734356';
		case 'Progressive':
			return '07798';
		case 'ProgressiveBreaks':
			return ' 07798672';
		case 'ProgressiveDrumBass':
			return '0779857369';
		case 'ProgressiveFolk':
			return ' 0779802';
		case 'ProgressiveHouse':
			return '077989';
		case 'ProgressiveMetal':
			return '07798316';
		case 'ProgressiveRock':
			return ' 0779872';
		case 'ProgressiveTechno':
			return ' 07798124';
		case 'Promethium':
			return ' 07303';
		case 'Promise':
			return '0739';
		case 'PropertyId':
			return '07015';
		case 'PropertyValue':
			return ' 0701869';
		case 'PropertyValueSpecification':
			return ' 07018699090224';
		case 'Protactinium':
			return ' 0712143';
		case 'Protect':
			return '07121';
		case 'ProteinContent':
			return '071424141';
		case 'Provide':
			return '0785';
		case 'Provider':
			return ' 0785';
		case 'ProviderMobility':
			return '07853661';
		case 'ProvidesBroadcastService':
			return ' 0785675291989';
		case 'ProvidesService':
			return ' 0785989';
		case 'PsychedelicFolk':
			return ' 9256202';
		case 'PsychedelicRock':
			return ' 9256272';
		case 'PsychedelicTrance':
			return ' 925621749';
		case 'PublicHolidays':
			return '066265';
		case 'PublicSwimmingPool':
			return ' 0662983406';
		case 'Publication':
			return '066224';
		case 'PublicationEvent':
			return '066224841';
		case 'PublicationIssue':
			return '0662242';
		case 'PublicationVolume':
			return ' 0662248693';
		case 'PublishedOn':
			return ' 06624';
		case 'Publisher':
			return '0662';
		case 'PublishingPrinciples':
			return '06624074906';
		case 'Pull':
			return ' 06';
		case 'Pump':
			return ' 030';
		case 'Pumpkin':
			return '0324';
		case 'PumpkinPieSpice':
			return '03240909';
		case 'Puncture':
			return ' 0412';
		case 'Punish':
			return ' 042';
		case 'PunkJazz':
			return '04273';
		case 'PunkRock':
			return '04272';
		case 'PurchaseDate':
			return '012951';
		case 'PurpleMangosteen':
			return '00634914';
		case 'Push':
			return ' 02';
		case 'Qualifications':
			return ' 2860224';
		case 'QualitativeValue':
			return '286118869';
		case 'QuantitativeValue':
			return ' 2841118869';
		case 'Quantity':
			return ' 28411';
		case 'Query':
			return '287';
		case 'Quest':
			return '2891';
		case 'Question':
			return ' 289124';
		case 'Quince':
			return ' 2849';
		case 'QuoteAction':
			return ' 281224';
		case 'RNews':
			return ' 493';
		case 'Race':
			return ' 79';
		case 'Radiate':
			return '751';
		case 'Radicchio':
			return '752';
		case 'RadioChannel':
			return '751246';
		case 'RadioClip':
			return ' 75260';
		case 'RadioEpisode':
			return '75095';
		case 'RadioSeason':
			return ' 75934';
		case 'RadioSeries':
			return ' 75973';
		case 'RadioStation':
			return '759124';
		case 'Radish':
			return ' 752';
		case 'Radium':
			return ' 753';
		case 'RagaRock':
			return '772';
		case 'RaggaJungle':
			return ' 7746';
		case 'Ragtime':
			return '713';
		case 'Raisiny':
			return '734';
		case 'Rambutan':
			return ' 73614';
		case 'RammedEarth':
			return ' 730';
		case 'RapMetal':
			return '70316';
		case 'RapRock':
			return ' 7072';
		case 'Raspberry':
			return '7367';
		case 'RatingCount':
			return ' 714241';
		case 'RatingValue':
			return ' 714869';
		case 'Reach':
			return '712';
		case 'ReactAction':
			return ' 721224';
		case 'ReadAction':
			return '75224';
		case 'ReadPermission':
			return '750324';
		case 'ReadonlyValue':
			return ' 869';
		case 'RealEstateAgent':
			return '76911741';
		case 'Realise':
			return '763';
		case 'RearWheelDriveConfiguration':
			return ' 786578240724';
		case 'Receive':
			return '798';
		case 'ReceiveAction':
			return ' 798224';
		case 'Recipe':
			return ' 790';
		case 'RecipeCategory':
			return '790217';
		case 'RecipeCuisine':
			return ' 7902834';
		case 'RecipeIngredient':
			return '79047541';
		case 'RecipeInstructions':
			return '7904917224';
		case 'RecipeYield':
			return ' 790965';
		case 'Recipient':
			return '79041';
		case 'Recognise':
			return '7243';
		case 'Record':
			return ' 725';
		case 'RecordLabel':
			return ' 725666';
		case 'RecordedAs':
			return '7253';
		case 'RecordedAt':
			return '7251';
		case 'RecordedIn':
			return '7254';
		case 'RecordingOf':
			return ' 72548';
		case 'RecyclingCenter':
			return ' 7926941';
		case 'Redcurrant':
			return ' 752741';
		case 'Reduce':
			return ' 7599';
		case 'ReferenceQuantity':
			return ' 7074928411';
		case 'ReferencesOrder':
			return ' 707495';
		case 'Refined':
			return '7045';
		case 'Reflect':
			return '70621';
		case 'RefurbishedCondition':
			return '706224524';
		case 'Refuse':
			return ' 7093';
		case 'RegionsAllowed':
			return '7746';
		case 'RegisterAction':
			return '7791224';
		case 'Regret':
			return ' 771';
		case 'Reign':
			return '74';
		case 'Reject':
			return ' 7721';
		case 'RejectAction':
			return '7721224';
		case 'Rejoice':
			return '779';
		case 'RelatedLink':
			return ' 7615642';
		case 'RelatedTo':
			return ' 76151';
		case 'Relax':
			return '7629';
		case 'Release':
			return '769';
		case 'ReleaseDate':
			return ' 76951';
		case 'ReleaseNotes':
			return '76941';
		case 'ReleaseOf':
			return ' 7698';
		case 'ReleasedEvent':
			return ' 769841';
		case 'Relish':
			return ' 762';
		case 'Remain':
			return ' 734';
		case 'RemainingAttendeeCapacity':
			return '73441452091';
		case 'Remember':
			return ' 7336';
		case 'Remind':
			return ' 7345';
		case 'RemixAlbum':
			return '7329663';
		case 'Remoulade':
			return '7365';
		case 'Remove':
			return ' 738';
		case 'RentAction':
			return '741224';
		case 'RentalCarReservation':
			return ' 7416273824';
		case 'Replace':
			return '7069';
		case 'ReplaceAction':
			return ' 7069224';
		case 'Replacer':
			return ' 7069';
		case 'Reply':
			return '706';
		case 'ReplyAction':
			return ' 706224';
		case 'ReplyToUrl':
			return ' 7061976';
		case 'Report':
			return ' 701';
		case 'ReportNumber':
			return '701436';
		case 'RepresentativeOfPage':
			return ' 70734118807';
		case 'Reproduce':
			return '707599';
		case 'Request':
			return '72891';
		case 'RequiredCollateral':
			return '728526176';
		case 'RequiredGender':
			return '7285745';
		case 'RequiredMaxAge':
			return ' 72853297';
		case 'RequiredMinAge':
			return ' 7285347';
		case 'Requirements':
			return ' 728341';
		case 'RequiresSubscription':
			return '72896927024';
		case 'Rescue':
			return ' 7929';
		case 'Researcher':
			return ' 7912';
		case 'Reservation':
			return '73824';
		case 'ReservationCancelled':
			return '738242496';
		case 'ReservationConfirmed':
			return '7382424035';
		case 'ReservationFor':
			return '738240';
		case 'ReservationHold':
			return ' 7382465';
		case 'ReservationId':
			return ' 738245';
		case 'ReservationPackage':
			return '73824027';
		case 'ReservationPending':
			return '738240454';
		case 'ReservationStatus':
			return ' 738249119';
		case 'ReservationStatusType':
			return '73824911910';
		case 'ReserveAction':
			return ' 738224';
		case 'ReservedTicket':
			return '7385121';
		case 'Reservoir':
			return '7388';
		case 'Residence':
			return '73549';
		case 'Resort':
			return ' 731';
		case 'Responsibilities':
			return ' 79049661';
		case 'Restaurant':
			return ' 791741';
		case 'RestrictedDiet':
			return '791721551';
		case 'Result':
			return ' 7361';
		case 'ResultComment':
			return ' 73612341';
		case 'ResultReview':
			return '7361789';
		case 'ResumeAction':
			return '7393224';
		case 'Reticent':
			return ' 71941';
		case 'Retire':
			return ' 71';
		case 'Return':
			return ' 714';
		case 'ReturnAction':
			return '714224';
		case 'Review':
			return ' 789';
		case 'ReviewAction':
			return '789224';
		case 'ReviewBody':
			return '78965';
		case 'ReviewCount':
			return ' 789241';
		case 'ReviewRating':
			return '789714';
		case 'ReviewedBy':
			return '7896';
		case 'Reviews':
			return '789';
		case 'Rhenium':
			return '743';
		case 'Rhodium':
			return '753';
		case 'Rhubarb':
			return '766';
		case 'Rhyme':
			return '73';
		case 'Rich':
			return ' 712';
		case 'RightHandDriving':
			return ' 71455784';
		case 'Rinse':
			return '749';
		case 'RiotGrrrl':
			return ' 71776';
		case 'Ripstop':
			return '70910';
		case 'Risk':
			return ' 792';
		case 'RiverBodyOfWater':
			return '7865881';
		case 'RockAndRoll':
			return '724576';
		case 'RockInOpposition':
			return ' 7240324';
		case 'RockMelon':
			return ' 72364';
		case 'Roentgenium':
			return '74143';
		case 'RoleName':
			return '7643';
		case 'RoofingContractor':
			return ' 704241721';
		case 'Rose':
			return ' 73';
		case 'Rosemary':
			return ' 7337';
		case 'Rot':
			return '71';
		case 'Rough':
			return '70';
		case 'Round':
			return '745';
		case 'RsvpAction':
			return '7980224';
		case 'RsvpResponse':
			return '798079049';
		case 'RsvpResponseMaybe':
			return '79807904936';
		case 'RsvpResponseNo':
			return ' 7980790494';
		case 'RsvpResponseType':
			return ' 79807904910';
		case 'RsvpResponseYes':
			return '79807904999';
		case 'Rubidium':
			return ' 7653';
		case 'Ruin':
			return ' 74';
		case 'Rule':
			return ' 76';
		case 'RunnerBean':
			return '7464';
		case 'Runtime':
			return '7413';
		case 'RuntimePlatform':
			return ' 741306103';
		case 'Rush':
			return ' 72';
		case 'RussellCord':
			return ' 79625';
		case 'Rutabaga':
			return ' 716';
		case 'Ruthenium':
			return '7043';
		case 'Rutherfordium':
			return '79053';
		case 'Saffron':
			return '9074';
		case 'Sage':
			return ' 97';
		case 'SaladCream':
			return '965273';
		case 'SaladDressing':
			return ' 9655794';
		case 'SalalBerry':
			return '96667';
		case 'SalaryCurrency':
			return '9672749';
		case 'Salsa':
			return '969';
		case 'SalsaGolf':
			return ' 96960';
		case 'Salt':
			return ' 961';
		case 'SaltAndPepper':
			return '9614500';
		case 'Samarium':
			return ' 9373';
		case 'Sambal':
			return ' 9366';
		case 'SameAs':
			return '933';
		case 'Samite':
			return ' 931';
		case 'SampleType':
			return '930610';
		case 'Sarsaparilla':
			return ' 99076';
		case 'Sassafras':
			return '99079';
		case 'Sateen':
			return ' 914';
		case 'Satisfy':
			return '9190';
		case 'Satsuma':
			return '9193';
		case 'SaturatedFatContent':
			return '9127150124141';
		case 'Saturday':
			return ' 915';
		case 'Sauerkraut':
			return ' 9271';
		case 'Save':
			return ' 98';
		case 'Savory':
			return ' 987';
		case 'Scallion':
			return ' 9264';
		case 'Scandium':
			return ' 92453';
		case 'Scarlet':
			return '9261';
		case 'Scatter':
			return '921';
		case 'ScheduleAction':
			return '2596224';
		case 'ScheduledPaymentDate':
			return ' 25965034151';
		case 'ScheduledTime':
			return ' 2596513';
		case 'SchemaVersion':
			return ' 923824';
		case 'ScholarlyArticle':
			return '9266126';
		case 'Scold':
			return '9265';
		case 'Scorch':
			return ' 9212';
		case 'Scrape':
			return ' 9270';
		case 'Scratch':
			return '92712';
		case 'ScreenCount':
			return ' 9274241';
		case 'ScreeningEvent':
			return '92744841';
		case 'Screenshot':
			return ' 927421';
		case 'Screw':
			return '927';
		case 'Scribble':
			return ' 92766';
		case 'Scrim':
			return '9273';
		case 'Scrub':
			return '9276';
		case 'Sculpture':
			return '926012';
		case 'SeaBodyOfWater':
			return '965881';
		case 'SeaSilk':
			return ' 9962';
		case 'Seaborgium':
			return ' 963';
		case 'Search':
			return ' 912';
		case 'SearchAction':
			return '912224';
		case 'SearchResultsPage':
			return '912736107';
		case 'Season':
			return ' 934';
		case 'SeasonNumber':
			return '934436';
		case 'Seasons':
			return '934';
		case 'SeatNumber':
			return '91436';
		case 'SeatRow':
			return ' 917';
		case 'SeatSection':
			return ' 919224';
		case 'SeatingMap':
			return '91430';
		case 'SeatingType':
			return ' 91410';
		case 'SecurityScreening':
			return ' 9297192744';
		case 'Seersucker':
			return ' 992';
		case 'SelfStorage':
			return ' 9609177';
		case 'SellAction':
			return '96224';
		case 'SendAction':
			return '945224';
		case 'Serge':
			return '97';
		case 'SerialNumber':
			return '976436';
		case 'Series':
			return ' 973';
		case 'Serve':
			return '98';
		case 'ServerStatus':
			return '989119';
		case 'ServesCuisine':
			return ' 982834';
		case 'Service':
			return '989';
		case 'ServiceArea':
			return ' 9897';
		case 'ServiceAudience':
			return ' 989549';
		case 'ServiceChannel':
			return '9891246';
		case 'ServiceLocation':
			return ' 9896224';
		case 'ServiceOperator':
			return ' 989071';
		case 'ServiceOutput':
			return ' 989101';
		case 'ServicePhone':
			return '98904';
		case 'ServicePostalAddress':
			return ' 9890916579';
		case 'ServiceSmsNumber':
			return ' 989939436';
		case 'ServiceType':
			return ' 98910';
		case 'ServiceUrl':
			return '989976';
		case 'ServingSize':
			return ' 98493';
		case 'Sesame':
			return ' 993';
		case 'SesameOil':
			return ' 9936';
		case 'Shade':
			return '25';
		case 'ShareAction':
			return ' 2224';
		case 'SharedContent':
			return ' 224141';
		case 'SharenaSol':
			return '9696';
		case 'Shave':
			return '28';
		case 'Shelter':
			return '261';
		case 'Shiplap':
			return '2060';
		case 'Shiso':
			return '29';
		case 'Shiver':
			return ' 28';
		case 'Shock':
			return '22';
		case 'ShoeStore':
			return ' 291';
		case 'Shoegaze':
			return ' 234';
		case 'Shop':
			return ' 20';
		case 'ShoppingCenter':
			return '204941';
		case 'ShotSilk':
			return '21962';
		case 'Shrug':
			return '27';
		case 'Sibling':
			return '9664';
		case 'Siblings':
			return ' 9664';
		case 'SichuanPepper':
			return ' 9128400';
		case 'Signal':
			return ' 946';
		case 'SignificantLink':
			return ' 940241642';
		case 'SignificantLinks':
			return '9402416429';
		case 'Silk':
			return ' 962';
		case 'Silky':
			return '962';
		case 'Silver':
			return ' 968';
		case 'SingleFamilyResidence':
			return '94603673549';
		case 'SinglePlayer':
			return '94606';
		case 'SingleRelease':
			return ' 946769';
		case 'Sisal':
			return '996';
		case 'SiteNavigationElement':
			return '9148246341';
		case 'SkaJazz':
			return ' 9273';
		case 'SkaPunk':
			return ' 92042';
		case 'SkatePunk':
			return ' 921042';
		case 'Ski':
			return '92';
		case 'SkiResort':
			return ' 92731';
		case 'Skills':
			return ' 926';
		case 'Skip':
			return ' 920';
		case 'Skirret':
			return '9271';
		case 'Sku':
			return '92929';
		case 'Slip':
			return ' 960';
		case 'SludgeMetal':
			return ' 967316';
		case 'Smile':
			return '936';
		case 'Smokey':
			return ' 932';
		case 'SmokingAllowed':
			return '93246';
		case 'Smooth':
			return ' 939';
		case 'SmoothJazz':
			return '93973';
		case 'SnapPea':
			return ' 9400';
		case 'Snatch':
			return ' 9412';
		case 'Sneeze':
			return ' 943';
		case 'Sniff':
			return '940';
		case 'SocialEvent':
			return ' 926841';
		case 'SocialMediaPosting':
			return ' 926350914';
		case 'Sodium':
			return ' 953';
		case 'SodiumContent':
			return ' 95324141';
		case 'SoftRock':
			return '90172';
		case 'SoftwareAddOn':
			return '90854';
		case 'SoftwareApplication':
			return ' 90806224';
		case 'SoftwareHelp':
			return '90860';
		case 'SoftwareRequirements':
			return '908728341';
		case 'SoftwareSourceCode':
			return ' 9089925';
		case 'SoftwareVersion':
			return ' 908824';
		case 'SoldOut':
			return ' 9651';
		case 'SomeProducts':
			return '9307521';
		case 'Sorrel':
			return ' 976';
		case 'SoulJazz':
			return '9673';
		case 'Sound':
			return '945';
		case 'SoundArt':
			return '9451';
		case 'SoundtrackAlbum':
			return ' 94172663';
		case 'SourceOrganization':
			return '994324';
		case 'SouthernRock':
			return '99472';
		case 'SoyBean':
			return ' 964';
		case 'SoySauce':
			return '999';
		case 'SpaceDisco':
			return '909592';
		case 'SpaceHouse':
			return '9099';
		case 'SpaceRock':
			return ' 90972';
		case 'SpaghettiSquash':
			return ' 9019282';
		case 'Spandex':
			return '904529';
		case 'Spare':
			return '90';
		case 'Spark':
			return '902';
		case 'Spatial':
			return '9026';
		case 'SpatialCoverage':
			return ' 90262877';
		case 'SpecialCommitments':
			return '9026231341';
		case 'SpecialOpeningHoursSpecification':
			return '90260449090224';
		case 'Specialty':
			return '90261';
		case 'SpeedGarage':
			return ' 90574';
		case 'SpeedMetal':
			return '905316';
		case 'SpiderSilk':
			return '905962';
		case 'Spinach':
			return '9047';
		case 'Spoil':
			return '906';
		case 'SpokenWordAlbum':
			return '902485663';
		case 'Sponsor':
			return '9049';
		case 'SportingGoodsStore':
			return ' 9014591';
		case 'SportsActivityLocation':
			return ' 90121816224';
		case 'SportsClub':
			return '901266';
		case 'SportsEvent':
			return ' 901841';
		case 'SportsOrganization':
			return '9014324';
		case 'SportsTeam':
			return '90113';
		case 'Spot':
			return ' 901';
		case 'Spouse':
			return ' 903';
		case 'Spray':
			return '907';
		case 'SpreadsheetDigitalDocument':
			return ' 9075215716529341';
		case 'Sprout':
			return ' 9071';
		case 'Squeak':
			return ' 9282';
		case 'Squeal':
			return ' 9286';
		case 'Squeeze':
			return '9283';
		case 'Sriracha':
			return ' 9712';
		case 'StackExchange':
			return ' 912291247';
		case 'StadiumOrArena':
			return ' 915374';
		case 'Stamp':
			return '9130';
		case 'StarAnise':
			return ' 9149';
		case 'StarFruit':
			return ' 91071';
		case 'StarRating':
			return '91714';
		case 'StartDate':
			return ' 91151';
		case 'StartTime':
			return ' 91113';
		case 'State':
			return '911';
		case 'SteakSauce':
			return '91299';
		case 'SteeringPosition':
			return '91740324';
		case 'SteeringPositionValue':
			return '91740324869';
		case 'StepValue':
			return ' 910869';
		case 'StiAccommodationOntology':
			return ' 235244167';
		case 'Stitch':
			return ' 9112';
		case 'Stone':
			return '914';
		case 'StonerRock':
			return '91472';
		case 'Stop':
			return ' 910';
		case 'StorageRequirements':
			return ' 9177728341';
		case 'Store':
			return '91';
		case 'StraightAheadJazz':
			return '9171573';
		case 'Strawberry':
			return ' 91767';
		case 'StreetAddress':
			return ' 9171579';
		case 'StreetPunk':
			return '9171042';
		case 'Strengthen':
			return ' 917404';
		case 'Stretch':
			return '91712';
		case 'StrideJazz':
			return '917573';
		case 'Strip':
			return '9170';
		case 'Strontium':
			return '917413';
		case 'Structured':
			return ' 917212';
		case 'StructuredValue':
			return ' 917212869';
		case 'StubTex':
			return ' 916';
		case 'StudioAlbum':
			return ' 9195663';
		case 'Stuff':
			return '910';
		case 'Styrofoam':
			return '91703';
		case 'SubEvent':
			return '96841';
		case 'SubEvents':
			return ' 96841';
		case 'SubOrganization':
			return ' 964324';
		case 'SubReservation':
			return '9673824';
		case 'SubscribeAction':
			return ' 969276224';
		case 'SubtitleLanguage':
			return '961166487';
		case 'Subtract':
			return ' 961721';
		case 'SubwayStation':
			return ' 9689124';
		case 'Succeed':
			return '9295';
		case 'SuccessorOf':
			return ' 92998';
		case 'Suck':
			return ' 92';
		case 'Suffer':
			return ' 90';
		case 'SugarContent':
			return '224141';
		case 'Suggest':
			return '9791';
		case 'SuggestedAnswer':
			return ' 979149';
		case 'SuggestedGender':
			return ' 9791745';
		case 'SuggestedMaxAge':
			return '97913297';
		case 'SuggestedMinAge':
			return '9791347';
		case 'Suit':
			return ' 91';
		case 'SuitableForDiet':
			return '9166051';
		case 'Sumac':
			return '932';
		case 'Sunday':
			return ' 945';
		case 'SungPoetry':
			return '94017';
		case 'SuperEvent':
			return '90841';
		case 'Supply':
			return ' 906';
		case 'Support':
			return '901';
		case 'SupportingData':
			return '90151';
		case 'Suppose':
			return '903';
		case 'SurfRock':
			return '9072';
		case 'Surface':
			return '909';
		case 'Surprise':
			return ' 9073';
		case 'Surround':
			return ' 9745';
		case 'Suspect':
			return '99021';
		case 'Suspend':
			return '99045';
		case 'SuspendAction':
			return ' 99045224';
		case 'Sweet':
			return '981';
		case 'SweetChilliSauce':
			return ' 98112699';
		case 'SweetPotato':
			return ' 981011';
		case 'Swing':
			return '984';
		case 'SwingHouse':
			return '9849';
		case 'Switch':
			return ' 9812';
		case 'SymphonicMetal':
			return '93042316';
		case 'Synagogue':
			return '94';
		case 'Syrup':
			return '970';
		case 'TabascoPepper':
			return ' 169200';
		case 'Table':
			return '166';
		case 'Taffeta':
			return '101';
		case 'TakeAction':
			return '12224';
		case 'Tamarillo':
			return '1376';
		case 'Tamarind':
			return ' 13745';
		case 'TandooriMasala':
			return '1457396';
		case 'Tangerine':
			return '14474';
		case 'Tannic':
			return ' 142';
		case 'Tantalum':
			return ' 14163';
		case 'TargetCollection':
			return '1126224';
		case 'TargetDescription':
			return ' 115927024';
		case 'TargetName':
			return '1143';
		case 'TargetPlatform':
			return '1106103';
		case 'TargetProduct':
			return ' 1107521';
		case 'TargetUrl':
			return ' 11976';
		case 'Taro':
			return ' 17';
		case 'Tarragon':
			return ' 174';
		case 'Tart':
			return ' 11';
		case 'Tartan':
			return ' 114';
		case 'TartarSauce':
			return ' 1199';
		case 'TasmanianPepper':
			return ' 1334400';
		case 'Tattersall':
			return ' 1196';
		case 'TattooParlor':
			return '1106';
		case 'TaxId':
			return ' 1295';
		case 'TaxiReservation':
			return ' 12973824';
		case 'TaxiService':
			return ' 129989';
		case 'TaxiStand':
			return ' 1299145';
		case 'TechArticle':
			return ' 12126';
		case 'TechHouse':
			return ' 129';
		case 'TechTrance':
			return '121749';
		case 'Technetium':
			return ' 12423';
		case 'TechnicalDeathMetal':
			return '1242650316';
		case 'TechnoDnb':
			return ' 124';
		case 'TechnoFolk':
			return '12402';
		case 'Telephone':
			return '1604';
		case 'TelevisionChannel':
			return ' 168441246';
		case 'TelevisionStation':
			return ' 168449124';
		case 'Temporal':
			return ' 13076';
		case 'TemporalCoverage':
			return '130762877';
		case 'Tempt':
			return '131';
		case 'TennisComplex':
			return ' 149230629';
		case 'TeriyakiSauce':
			return ' 179299';
		case 'TerraCotta':
			return '1721';
		case 'Terrazzo':
			return ' 1719';
		case 'Terrify':
			return '170';
		case 'TewkesburyMustard':
			return ' 3915';
		case 'Text':
			return ' 1291';
		case 'TextDigitalDocument':
			return '12915716529341';
		case 'ThaiBasil':
			return ' 1636';
		case 'Thallium':
			return ' 063';
		case 'Thank':
			return '042';
		case 'TheaterEvent':
			return '01841';
		case 'TheaterGroup':
			return '0170';
		case 'Thing':
			return '04';
		case 'ThirdStream':
			return ' 059173';
		case 'Thorium':
			return '073';
		case 'ThrashMetal':
			return ' 072316';
		case 'Thulium':
			return '063';
		case 'Thumbnail':
			return '0346';
		case 'ThumbnailUrl':
			return '0346976';
		case 'Thursday':
			return ' 035';
		case 'Thyme':
			return '13';
		case 'Tick':
			return ' 12';
		case 'TickerSymbol':
			return '129366';
		case 'Ticket':
			return ' 121';
		case 'TicketNumber':
			return '121436';
		case 'TicketToken':
			return ' 121124';
		case 'TicketedSeat':
			return '12191';
		case 'Tickle':
			return ' 126';
		case 'TieAction':
			return ' 1224';
		case 'Tight':
			return '11';
		case 'Timber':
			return ' 136';
		case 'Time':
			return ' 13';
		case 'TimeRequired':
			return '137285';
		case 'Tin':
			return '14';
		case 'Tip':
			return '10';
		case 'TipAction':
			return ' 10224';
		case 'TireShop':
			return '120';
		case 'Titanium':
			return ' 1143';
		case 'Title':
			return '116';
		case 'ToLocation':
			return '16224';
		case 'Toasty':
			return ' 191';
		case 'TollFree':
			return '1607';
		case 'Tomato':
			return ' 131';
		case 'TonkaBean':
			return ' 64';
		case 'TotalPaymentDue':
			return '116034159';
		case 'TotalPrice':
			return '116079';
		case 'TotalTime':
			return ' 11613';
		case 'Touch':
			return '112';
		case 'TouristAttraction':
			return ' 179117224';
		case 'TouristInformationCenter':
			return ' 179140324941';
		case 'ToyStore':
			return '191';
		case 'ToytownTechno':
			return ' 114124';
		case 'Trace':
			return '179';
		case 'TrackAction':
			return ' 172224';
		case 'TrackingNumber':
			return '1724436';
		case 'TrackingUrl':
			return ' 1724976';
		case 'Tracks':
			return ' 172';
		case 'TradJazz':
			return '17573';
		case 'Trade':
			return '175';
		case 'TradeAction':
			return ' 175224';
		case 'TraditionalDoom':
			return ' 17524653';
		case 'Trailer':
			return '176';
		case 'Train':
			return '174';
		case 'TrainName':
			return ' 17443';
		case 'TrainNumber':
			return ' 174436';
		case 'TrainReservation':
			return '17473824';
		case 'TrainStation':
			return '1749124';
		case 'TrainTrip':
			return ' 174170';
		case 'Trance':
			return ' 1749';
		case 'TransFatContent':
			return '17430124141';
		case 'Transcript':
			return ' 17492701';
		case 'TransferAction':
			return '17490224';
		case 'TransitMap':
			return '1749130';
		case 'Translator':
			return ' 174961';
		case 'Transparent':
			return '17490741';
		case 'Transport':
			return '174901';
		case 'Travel':
			return ' 1786';
		case 'TravelAction':
			return '1786224';
		case 'TravelAgency':
			return '1786749';
		case 'Treat':
			return '171';
		case 'Tremble':
			return '17366';
		case 'TribalHouse':
			return ' 17669';
		case 'Trick':
			return '172';
		case 'Trip':
			return ' 170';
		case 'TripHop':
			return ' 1700';
		case 'Trot':
			return ' 171';
		case 'Trouble':
			return '1766';
		case 'Trust':
			return '1791';
		case 'Try':
			return '17';
		case 'Tubers':
			return ' 196';
		case 'Tuesday':
			return '1935';
		case 'Tulle':
			return '16';
		case 'Tumble':
			return ' 1366';
		case 'Tungsten':
			return ' 14914';
		case 'Turmeric':
			return ' 1372';
		case 'Turn':
			return ' 14';
		case 'Turnip':
			return ' 140';
		case 'TweePop':
			return ' 1800';
		case 'Tweed':
			return '185';
		case 'Twill':
			return '186';
		case 'Twist':
			return '1891';
		case 'Type':
			return ' 10';
		case 'TypeAndQuantityNode':
			return ' 10452841145';
		case 'TypeOfBed':
			return '10865';
		case 'TypeOfGood':
			return ' 1085';
		case 'TypicalAgeRange':
			return '10267744';
		case 'UgliFruit':
			return ' 071';
		case 'UnRegisterAction':
			return ' 47791224';
		case 'Unctuous':
			return ' 4199';
		case 'UnderName':
			return ' 4543';
		case 'Undress':
			return '4579';
		case 'Unfasten':
			return ' 4094';
		case 'UnitCode':
			return '94125';
		case 'UnitPriceSpecification':
			return ' 9410799090224';
		case 'UnitText':
			return '9411291';
		case 'Unite':
			return '941';
		case 'Unlock':
			return ' 462';
		case 'Unpack':
			return ' 402';
		case 'UnsaturatedFatContent':
			return '49127150124141';
		case 'Untidy':
			return ' 415';
		case 'UpdateAction':
			return '051224';
		case 'UpliftingTrance':
			return ' 060141749';
		case 'UploadDate':
			return '06551';
		case 'UpvoteCount':
			return ' 081241';
		case 'Uranium':
			return '9743';
		case 'Urbanite':
			return ' 641';
		case 'Url':
			return '976';
		case 'UrlTemplate':
			return ' 97613061';
		case 'UseAction':
			return ' 93224';
		case 'UsedCondition':
			return ' 93524524';
		case 'UserBlocks':
			return '93662';
		case 'UserCheckins':
			return '931224';
		case 'UserComments':
			return '932341';
		case 'UserDownloads':
			return ' 935465';
		case 'UserInteraction':
			return ' 93417224';
		case 'UserInteractionCount':
			return ' 93417224241';
		case 'UserLikes':
			return ' 9362';
		case 'UserPageVisits':
			return ' 9307831';
		case 'UserPlays':
			return ' 9306';
		case 'UserPlusOnes':
			return ' 9306984';
		case 'UserTweets':
			return '93181';
		case 'ValidFor':
			return '8650';
		case 'ValidFrom':
			return ' 865073';
		case 'ValidIn':
			return ' 8654';
		case 'ValidThrough':
			return '86507';
		case 'ValidUntil':
			return '865416';
		case 'Value':
			return '869';
		case 'ValueAddedTaxIncluded':
			return ' 869512942655';
		case 'ValueMaxLength':
			return ' 869329640';
		case 'ValueMinLength':
			return ' 86934640';
		case 'ValueName':
			return ' 86943';
		case 'ValuePattern':
			return '869014';
		case 'ValueReference':
			return '86970749';
		case 'ValueRequired':
			return ' 8697285';
		case 'Vanadium':
			return ' 8453';
		case 'Vanilla':
			return '846';
		case 'Vanillin':
			return ' 8464';
		case 'VatId':
			return ' 815';
		case 'VeganDiet':
			return ' 8451';
		case 'VegetableFlannel':
			return '871660646';
		case 'Vegetal':
			return '8716';
		case 'VegetarianDiet':
			return '8717451';
		case 'Vehicle':
			return '826';
		case 'VehicleConfiguration':
			return '826240724';
		case 'VehicleEngine':
			return ' 826474';
		case 'VehicleIdentificationNumber':
			return '8265410224436';
		case 'VehicleInteriorColor':
			return ' 82641726';
		case 'VehicleInteriorType':
			return '82641710';
		case 'VehicleModelDate':
			return ' 82635651';
		case 'VehicleSeatingCapacity':
			return ' 8269142091';
		case 'VehicleSpecialUsage':
			return '8269026997';
		case 'VehicleTransmission':
			return ' 8261743324';
		case 'Velvet':
			return ' 8681';
		case 'Velveteen':
			return '86814';
		case 'Velvety':
			return '8681';
		case 'VenueMap':
			return '84930';
		case 'Version':
			return '824';
		case 'Video':
			return '85';
		case 'VideoFormat':
			return ' 85031';
		case 'VideoFrameSize':
			return ' 8507393';
		case 'VideoGallery':
			return '8567';
		case 'VideoGame':
			return ' 853';
		case 'VideoGameClip':
			return '853260';
		case 'VideoGameSeries':
			return '853973';
		case 'VideoObject':
			return ' 856721';
		case 'VideoQuality':
			return '852861';
		case 'VietnameseCoriander':
			return ' 814332745';
		case 'ViewAction':
			return '89224';
		case 'VikingMetal':
			return ' 824316';
		case 'VinoCotto':
			return ' 8484';
		case 'VinylCoatedPolyester':
			return ' 846210691';
		case 'VinylFormat':
			return ' 846031';
		case 'Visit':
			return '831';
		case 'VisualArtsEvent':
			return '8461841';
		case 'VisualArtwork':
			return ' 846182';
		case 'VocalHouse':
			return '8269';
		case 'VocalJazz':
			return ' 82673';
		case 'VocalTrance':
			return ' 8261749';
		case 'Volcano':
			return '8624';
		case 'VolumeNumber':
			return '8693436';
		case 'VoteAction':
			return '81224';
		case 'Wallpaper':
			return '8600';
		case 'Want':
			return ' 841';
		case 'WantAction':
			return '841224';
		case 'Warm':
			return ' 83';
		case 'Warranty':
			return ' 8741';
		case 'WarrantyPromise':
			return ' 87410739';
		case 'WarrantyScope':
			return ' 8741920';
		case 'Wasabi':
			return ' 896';
		case 'Waste':
			return '891';
		case 'Watch':
			return '812';
		case 'WatchAction':
			return ' 812224';
		case 'Water':
			return '81';
		case 'WaterChestnut':
			return ' 8112941';
		case 'Watercress':
			return ' 81279';
		case 'Waterfall':
			return '8106';
		case 'Watermelon':
			return ' 81364';
		case 'WatermelonRindPreserves':
			return '813647450738';
		case 'Wave':
			return ' 88';
		case 'WearAction':
			return '8224';
		case 'WebApplication':
			return '8606224';
		case 'WebCheckinTime':
			return ' 86122413';
		case 'WebPage':
			return ' 8607';
		case 'WebPageElement':
			return ' 86076341';
		case 'WebSite':
			return ' 8691';
		case 'Wednesday':
			return '8435';
		case 'Weight':
			return ' 81';
		case 'Welcome':
			return '8623';
		case 'WestCoastJazz':
			return '89129173';
		case 'Western':
			return '8914';
		case 'Whipcord':
			return ' 8025';
		case 'Whirl':
			return '86';
		case 'Whisper':
			return '890';
		case 'Whistle':
			return '896';
		case 'WhiteMustard':
			return '813915';
		case 'WhitePeppercorn':
			return ' 810024';
		case 'WhiteRadish':
			return ' 81752';
		case 'WholesaleStore':
			return '69691';
		case 'Width':
			return '810';
		case 'Wigan':
			return '84';
		case 'WikiDoc':
			return ' 8252';
		case 'WinAction':
			return ' 84224';
		case 'Winery':
			return ' 847';
		case 'Wink':
			return ' 842';
		case 'Winner':
			return ' 84';
		case 'Wipe':
			return ' 80';
		case 'WireRope':
			return '870';
		case 'WitchHouse':
			return '81257';
		case 'Wobble':
			return ' 866';
		case 'Wonder':
			return ' 845';
		case 'Wood':
			return ' 85';
		case 'Woodruff':
			return ' 8570';
		case 'Wool':
			return ' 86';
		case 'WordCount':
			return ' 85241';
		case 'WorkExample':
			return ' 823306';
		case 'WorkFeatured':
			return '820125';
		case 'WorkHours':
			return ' 82';
		case 'WorkLocation':
			return '826224';
		case 'WorkPerformed':
			return ' 82003';
		case 'WorkPresented':
			return ' 8207341';
		case 'WorksFor':
			return '820';
		case 'WorldFusion':
			return ' 8650944';
		case 'Worry':
			return '87';
		case 'WorstRating':
			return ' 891714';
		case 'WpadBlock':
			return ' 662';
		case 'Wrap':
			return ' 70';
		case 'Wreck':
			return '72';
		case 'Wrestle':
			return '796';
		case 'Wriggle':
			return '76';
		case 'WriteAction':
			return ' 71224';
		case 'WritePermission':
			return ' 710324';
		case 'XRay':
			return '37';
		case 'XoSauce':
			return ' 99';
		case 'YachtRock':
			return ' 9172';
		case 'Yam':
			return '93';
		case 'Yawn':
			return ' 94';
		case 'YearlyRevenue':
			return ' 967849';
		case 'YearsInOperation':
			return ' 940724';
		case 'Yell':
			return ' 96';
		case 'YorkshireBleepsAndBass':
			return '9226604569';
		case 'Ytterbium':
			return '163';
		case 'Yttrium':
			return '173';
		case 'Yuzu':
			return ' 93';
		case 'Zedoary':
			return '357';
		case 'Zephyr':
			return ' 30';
		case 'Zest':
			return ' 391';
		case 'Zibeline':
			return ' 3664';
		case 'Zinc':
			return ' 342';
		case 'Zip':
			return '30';
		case 'Zirconium':
			return '3243';
		case 'ZoneBoardingPolicy':
			return ' 34654069';
		case 'Zoom':
			return ' 33';
		default:
			return ' 324';
	}
};
var _user$project$FromEnglish$wordJoinC = function (list) {
	return A2(
		_elm_lang$core$String$join,
		'D',
		_user$project$FromEnglish$toHexa(list));
};
var _user$project$FromEnglish$zip = F2(
	function (xs, ys) {
		var _p4 = {ctor: '_Tuple2', _0: xs, _1: ys};
		if ((_p4._0.ctor === '::') && (_p4._1.ctor === '::')) {
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p4._0._0, _1: _p4._1._0},
				_1: A2(_user$project$FromEnglish$zip, _p4._0._1, _p4._1._1)
			};
		} else {
			return {ctor: '[]'};
		}
	});
var _user$project$FromEnglish$wordToPhonetic = function (s) {
	var w = A2(_elm_lang$core$String$split, '', s);
	var evenWord = _user$project$FromEnglish$isEven(
		_elm_lang$core$List$length(w)) ? w : A2(
		_elm_lang$core$Basics_ops['++'],
		w,
		{
			ctor: '::',
			_0: 'G',
			_1: {ctor: '[]'}
		});
	var index = A2(
		_elm_lang$core$List$range,
		1,
		_elm_lang$core$List$length(evenWord));
	var isVowel = A2(_elm_lang$core$List$map, _user$project$FromEnglish$isEven, index);
	var pairs = A2(_user$project$FromEnglish$zip, evenWord, isVowel);
	return A2(
		_elm_lang$core$String$join,
		'',
		A2(_elm_lang$core$List$map, _user$project$FromEnglish$hexaToConsOrVowel, pairs));
};
var _user$project$FromEnglish$composedToPhonetic = function (s) {
	return A2(_elm_lang$core$String$startsWith, 'A', s) ? A2(
		_elm_lang$core$Basics_ops['++'],
		'sɑː',
		_user$project$FromEnglish$wordToPhonetic(
			A2(_elm_lang$core$String$dropLeft, 1, s))) : (A2(_elm_lang$core$String$startsWith, 'B', s) ? A2(
		_elm_lang$core$Basics_ops['++'],
		'goʊ',
		_user$project$FromEnglish$wordToPhonetic(
			A2(_elm_lang$core$String$dropLeft, 1, s))) : (A2(_elm_lang$core$String$contains, 'C', s) ? A2(
		_elm_lang$core$String$join,
		'fʊ',
		A2(
			_elm_lang$core$List$map,
			_user$project$FromEnglish$wordToPhonetic,
			A2(_elm_lang$core$String$split, 'C', s))) : (A2(_elm_lang$core$String$contains, 'D', s) ? A2(
		_elm_lang$core$String$join,
		'zaɪ',
		A2(
			_elm_lang$core$List$map,
			_user$project$FromEnglish$wordToPhonetic,
			A2(_elm_lang$core$String$split, 'D', s))) : _user$project$FromEnglish$wordToPhonetic(s))));
};
var _user$project$FromEnglish$hexaToPhonetic = function (s) {
	return A2(
		_elm_lang$core$String$join,
		' ',
		A2(
			_elm_lang$core$List$map,
			_user$project$FromEnglish$composedToPhonetic,
			_elm_lang$core$String$words(s)));
};
var _user$project$FromEnglish$Zucchini = {ctor: 'Zucchini'};
var _user$project$FromEnglish$Zoom = {ctor: 'Zoom'};
var _user$project$FromEnglish$ZoneBoardingPolicy = {ctor: 'ZoneBoardingPolicy'};
var _user$project$FromEnglish$Zirconium = {ctor: 'Zirconium'};
var _user$project$FromEnglish$Zip = {ctor: 'Zip'};
var _user$project$FromEnglish$Zinc = {ctor: 'Zinc'};
var _user$project$FromEnglish$Zibeline = {ctor: 'Zibeline'};
var _user$project$FromEnglish$Zest = {ctor: 'Zest'};
var _user$project$FromEnglish$Zephyr = {ctor: 'Zephyr'};
var _user$project$FromEnglish$Zedoary = {ctor: 'Zedoary'};
var _user$project$FromEnglish$Yuzu = {ctor: 'Yuzu'};
var _user$project$FromEnglish$Yttrium = {ctor: 'Yttrium'};
var _user$project$FromEnglish$Ytterbium = {ctor: 'Ytterbium'};
var _user$project$FromEnglish$YorkshireBleepsAndBass = {ctor: 'YorkshireBleepsAndBass'};
var _user$project$FromEnglish$Yell = {ctor: 'Yell'};
var _user$project$FromEnglish$YearsInOperation = {ctor: 'YearsInOperation'};
var _user$project$FromEnglish$YearlyRevenue = {ctor: 'YearlyRevenue'};
var _user$project$FromEnglish$Yawn = {ctor: 'Yawn'};
var _user$project$FromEnglish$Yam = {ctor: 'Yam'};
var _user$project$FromEnglish$YachtRock = {ctor: 'YachtRock'};
var _user$project$FromEnglish$XoSauce = {ctor: 'XoSauce'};
var _user$project$FromEnglish$XRay = {ctor: 'XRay'};
var _user$project$FromEnglish$WritePermission = {ctor: 'WritePermission'};
var _user$project$FromEnglish$WriteAction = {ctor: 'WriteAction'};
var _user$project$FromEnglish$Wriggle = {ctor: 'Wriggle'};
var _user$project$FromEnglish$Wrestle = {ctor: 'Wrestle'};
var _user$project$FromEnglish$Wreck = {ctor: 'Wreck'};
var _user$project$FromEnglish$Wrap = {ctor: 'Wrap'};
var _user$project$FromEnglish$WpadBlock = {ctor: 'WpadBlock'};
var _user$project$FromEnglish$WorstRating = {ctor: 'WorstRating'};
var _user$project$FromEnglish$Worry = {ctor: 'Worry'};
var _user$project$FromEnglish$WorldFusion = {ctor: 'WorldFusion'};
var _user$project$FromEnglish$WorksFor = {ctor: 'WorksFor'};
var _user$project$FromEnglish$WorkPresented = {ctor: 'WorkPresented'};
var _user$project$FromEnglish$WorkPerformed = {ctor: 'WorkPerformed'};
var _user$project$FromEnglish$WorkLocation = {ctor: 'WorkLocation'};
var _user$project$FromEnglish$WorkHours = {ctor: 'WorkHours'};
var _user$project$FromEnglish$WorkFeatured = {ctor: 'WorkFeatured'};
var _user$project$FromEnglish$WorkExample = {ctor: 'WorkExample'};
var _user$project$FromEnglish$WordCount = {ctor: 'WordCount'};
var _user$project$FromEnglish$Wool = {ctor: 'Wool'};
var _user$project$FromEnglish$Woodruff = {ctor: 'Woodruff'};
var _user$project$FromEnglish$Wood = {ctor: 'Wood'};
var _user$project$FromEnglish$Wonder = {ctor: 'Wonder'};
var _user$project$FromEnglish$Wobble = {ctor: 'Wobble'};
var _user$project$FromEnglish$WitchHouse = {ctor: 'WitchHouse'};
var _user$project$FromEnglish$WireRope = {ctor: 'WireRope'};
var _user$project$FromEnglish$Wipe = {ctor: 'Wipe'};
var _user$project$FromEnglish$Winner = {ctor: 'Winner'};
var _user$project$FromEnglish$Wink = {ctor: 'Wink'};
var _user$project$FromEnglish$Winery = {ctor: 'Winery'};
var _user$project$FromEnglish$WinAction = {ctor: 'WinAction'};
var _user$project$FromEnglish$WikiDoc = {ctor: 'WikiDoc'};
var _user$project$FromEnglish$Wigan = {ctor: 'Wigan'};
var _user$project$FromEnglish$Width = {ctor: 'Width'};
var _user$project$FromEnglish$WholesaleStore = {ctor: 'WholesaleStore'};
var _user$project$FromEnglish$WhiteRadish = {ctor: 'WhiteRadish'};
var _user$project$FromEnglish$WhitePeppercorn = {ctor: 'WhitePeppercorn'};
var _user$project$FromEnglish$WhiteMustard = {ctor: 'WhiteMustard'};
var _user$project$FromEnglish$Whistle = {ctor: 'Whistle'};
var _user$project$FromEnglish$Whisper = {ctor: 'Whisper'};
var _user$project$FromEnglish$Whirl = {ctor: 'Whirl'};
var _user$project$FromEnglish$Whipcord = {ctor: 'Whipcord'};
var _user$project$FromEnglish$Western = {ctor: 'Western'};
var _user$project$FromEnglish$WestCoastJazz = {ctor: 'WestCoastJazz'};
var _user$project$FromEnglish$Welcome = {ctor: 'Welcome'};
var _user$project$FromEnglish$Weight = {ctor: 'Weight'};
var _user$project$FromEnglish$Wednesday = {ctor: 'Wednesday'};
var _user$project$FromEnglish$WebSite = {ctor: 'WebSite'};
var _user$project$FromEnglish$WebPageElement = {ctor: 'WebPageElement'};
var _user$project$FromEnglish$WebPage = {ctor: 'WebPage'};
var _user$project$FromEnglish$WebCheckinTime = {ctor: 'WebCheckinTime'};
var _user$project$FromEnglish$WebApplication = {ctor: 'WebApplication'};
var _user$project$FromEnglish$WearAction = {ctor: 'WearAction'};
var _user$project$FromEnglish$Wave = {ctor: 'Wave'};
var _user$project$FromEnglish$WatermelonRindPreserves = {ctor: 'WatermelonRindPreserves'};
var _user$project$FromEnglish$Watermelon = {ctor: 'Watermelon'};
var _user$project$FromEnglish$Waterfall = {ctor: 'Waterfall'};
var _user$project$FromEnglish$Watercress = {ctor: 'Watercress'};
var _user$project$FromEnglish$WaterChestnut = {ctor: 'WaterChestnut'};
var _user$project$FromEnglish$Water = {ctor: 'Water'};
var _user$project$FromEnglish$WatchAction = {ctor: 'WatchAction'};
var _user$project$FromEnglish$Watch = {ctor: 'Watch'};
var _user$project$FromEnglish$Waste = {ctor: 'Waste'};
var _user$project$FromEnglish$Wasabi = {ctor: 'Wasabi'};
var _user$project$FromEnglish$WarrantyScope = {ctor: 'WarrantyScope'};
var _user$project$FromEnglish$WarrantyPromise = {ctor: 'WarrantyPromise'};
var _user$project$FromEnglish$Warranty = {ctor: 'Warranty'};
var _user$project$FromEnglish$Warm = {ctor: 'Warm'};
var _user$project$FromEnglish$WantAction = {ctor: 'WantAction'};
var _user$project$FromEnglish$Want = {ctor: 'Want'};
var _user$project$FromEnglish$Wallpaper = {ctor: 'Wallpaper'};
var _user$project$FromEnglish$VoteAction = {ctor: 'VoteAction'};
var _user$project$FromEnglish$VolumeNumber = {ctor: 'VolumeNumber'};
var _user$project$FromEnglish$Volcano = {ctor: 'Volcano'};
var _user$project$FromEnglish$VocalTrance = {ctor: 'VocalTrance'};
var _user$project$FromEnglish$VocalJazz = {ctor: 'VocalJazz'};
var _user$project$FromEnglish$VocalHouse = {ctor: 'VocalHouse'};
var _user$project$FromEnglish$VisualArtwork = {ctor: 'VisualArtwork'};
var _user$project$FromEnglish$VisualArtsEvent = {ctor: 'VisualArtsEvent'};
var _user$project$FromEnglish$Visit = {ctor: 'Visit'};
var _user$project$FromEnglish$VinylFormat = {ctor: 'VinylFormat'};
var _user$project$FromEnglish$VinylCoatedPolyester = {ctor: 'VinylCoatedPolyester'};
var _user$project$FromEnglish$VinoCotto = {ctor: 'VinoCotto'};
var _user$project$FromEnglish$VikingMetal = {ctor: 'VikingMetal'};
var _user$project$FromEnglish$ViewAction = {ctor: 'ViewAction'};
var _user$project$FromEnglish$VietnameseCoriander = {ctor: 'VietnameseCoriander'};
var _user$project$FromEnglish$VideoQuality = {ctor: 'VideoQuality'};
var _user$project$FromEnglish$VideoObject = {ctor: 'VideoObject'};
var _user$project$FromEnglish$VideoGameSeries = {ctor: 'VideoGameSeries'};
var _user$project$FromEnglish$VideoGameClip = {ctor: 'VideoGameClip'};
var _user$project$FromEnglish$VideoGame = {ctor: 'VideoGame'};
var _user$project$FromEnglish$VideoGallery = {ctor: 'VideoGallery'};
var _user$project$FromEnglish$VideoFrameSize = {ctor: 'VideoFrameSize'};
var _user$project$FromEnglish$VideoFormat = {ctor: 'VideoFormat'};
var _user$project$FromEnglish$Video = {ctor: 'Video'};
var _user$project$FromEnglish$Version = {ctor: 'Version'};
var _user$project$FromEnglish$VenueMap = {ctor: 'VenueMap'};
var _user$project$FromEnglish$Velvety = {ctor: 'Velvety'};
var _user$project$FromEnglish$Velveteen = {ctor: 'Velveteen'};
var _user$project$FromEnglish$Velvet = {ctor: 'Velvet'};
var _user$project$FromEnglish$VehicleTransmission = {ctor: 'VehicleTransmission'};
var _user$project$FromEnglish$VehicleSpecialUsage = {ctor: 'VehicleSpecialUsage'};
var _user$project$FromEnglish$VehicleSeatingCapacity = {ctor: 'VehicleSeatingCapacity'};
var _user$project$FromEnglish$VehicleModelDate = {ctor: 'VehicleModelDate'};
var _user$project$FromEnglish$VehicleInteriorType = {ctor: 'VehicleInteriorType'};
var _user$project$FromEnglish$VehicleInteriorColor = {ctor: 'VehicleInteriorColor'};
var _user$project$FromEnglish$VehicleIdentificationNumber = {ctor: 'VehicleIdentificationNumber'};
var _user$project$FromEnglish$VehicleEngine = {ctor: 'VehicleEngine'};
var _user$project$FromEnglish$VehicleConfiguration = {ctor: 'VehicleConfiguration'};
var _user$project$FromEnglish$Vehicle = {ctor: 'Vehicle'};
var _user$project$FromEnglish$VegetarianDiet = {ctor: 'VegetarianDiet'};
var _user$project$FromEnglish$Vegetal = {ctor: 'Vegetal'};
var _user$project$FromEnglish$VegetableFlannel = {ctor: 'VegetableFlannel'};
var _user$project$FromEnglish$VeganDiet = {ctor: 'VeganDiet'};
var _user$project$FromEnglish$VatId = {ctor: 'VatId'};
var _user$project$FromEnglish$Vanillin = {ctor: 'Vanillin'};
var _user$project$FromEnglish$Vanilla = {ctor: 'Vanilla'};
var _user$project$FromEnglish$Vanadium = {ctor: 'Vanadium'};
var _user$project$FromEnglish$ValueRequired = {ctor: 'ValueRequired'};
var _user$project$FromEnglish$ValueReference = {ctor: 'ValueReference'};
var _user$project$FromEnglish$ValuePattern = {ctor: 'ValuePattern'};
var _user$project$FromEnglish$ValueName = {ctor: 'ValueName'};
var _user$project$FromEnglish$ValueMinLength = {ctor: 'ValueMinLength'};
var _user$project$FromEnglish$ValueMaxLength = {ctor: 'ValueMaxLength'};
var _user$project$FromEnglish$ValueAddedTaxIncluded = {ctor: 'ValueAddedTaxIncluded'};
var _user$project$FromEnglish$Value = {ctor: 'Value'};
var _user$project$FromEnglish$ValidUntil = {ctor: 'ValidUntil'};
var _user$project$FromEnglish$ValidThrough = {ctor: 'ValidThrough'};
var _user$project$FromEnglish$ValidIn = {ctor: 'ValidIn'};
var _user$project$FromEnglish$ValidFrom = {ctor: 'ValidFrom'};
var _user$project$FromEnglish$ValidFor = {ctor: 'ValidFor'};
var _user$project$FromEnglish$UserTweets = {ctor: 'UserTweets'};
var _user$project$FromEnglish$UserPlusOnes = {ctor: 'UserPlusOnes'};
var _user$project$FromEnglish$UserPlays = {ctor: 'UserPlays'};
var _user$project$FromEnglish$UserPageVisits = {ctor: 'UserPageVisits'};
var _user$project$FromEnglish$UserLikes = {ctor: 'UserLikes'};
var _user$project$FromEnglish$UserInteractionCount = {ctor: 'UserInteractionCount'};
var _user$project$FromEnglish$UserInteraction = {ctor: 'UserInteraction'};
var _user$project$FromEnglish$UserDownloads = {ctor: 'UserDownloads'};
var _user$project$FromEnglish$UserComments = {ctor: 'UserComments'};
var _user$project$FromEnglish$UserCheckins = {ctor: 'UserCheckins'};
var _user$project$FromEnglish$UserBlocks = {ctor: 'UserBlocks'};
var _user$project$FromEnglish$UsedCondition = {ctor: 'UsedCondition'};
var _user$project$FromEnglish$UseAction = {ctor: 'UseAction'};
var _user$project$FromEnglish$UrlTemplate = {ctor: 'UrlTemplate'};
var _user$project$FromEnglish$Url = {ctor: 'Url'};
var _user$project$FromEnglish$Urbanite = {ctor: 'Urbanite'};
var _user$project$FromEnglish$Uranium = {ctor: 'Uranium'};
var _user$project$FromEnglish$UpvoteCount = {ctor: 'UpvoteCount'};
var _user$project$FromEnglish$UploadDate = {ctor: 'UploadDate'};
var _user$project$FromEnglish$UpliftingTrance = {ctor: 'UpliftingTrance'};
var _user$project$FromEnglish$UpdateAction = {ctor: 'UpdateAction'};
var _user$project$FromEnglish$Untidy = {ctor: 'Untidy'};
var _user$project$FromEnglish$UnsaturatedFatContent = {ctor: 'UnsaturatedFatContent'};
var _user$project$FromEnglish$Unpack = {ctor: 'Unpack'};
var _user$project$FromEnglish$Unlock = {ctor: 'Unlock'};
var _user$project$FromEnglish$Unite = {ctor: 'Unite'};
var _user$project$FromEnglish$UnitText = {ctor: 'UnitText'};
var _user$project$FromEnglish$UnitPriceSpecification = {ctor: 'UnitPriceSpecification'};
var _user$project$FromEnglish$UnitCode = {ctor: 'UnitCode'};
var _user$project$FromEnglish$Unfasten = {ctor: 'Unfasten'};
var _user$project$FromEnglish$Undress = {ctor: 'Undress'};
var _user$project$FromEnglish$UnderName = {ctor: 'UnderName'};
var _user$project$FromEnglish$Unctuous = {ctor: 'Unctuous'};
var _user$project$FromEnglish$UnRegisterAction = {ctor: 'UnRegisterAction'};
var _user$project$FromEnglish$UgliFruit = {ctor: 'UgliFruit'};
var _user$project$FromEnglish$TypicalAgeRange = {ctor: 'TypicalAgeRange'};
var _user$project$FromEnglish$TypeOfGood = {ctor: 'TypeOfGood'};
var _user$project$FromEnglish$TypeOfBed = {ctor: 'TypeOfBed'};
var _user$project$FromEnglish$TypeAndQuantityNode = {ctor: 'TypeAndQuantityNode'};
var _user$project$FromEnglish$Type = {ctor: 'Type'};
var _user$project$FromEnglish$Twist = {ctor: 'Twist'};
var _user$project$FromEnglish$Twill = {ctor: 'Twill'};
var _user$project$FromEnglish$Tweed = {ctor: 'Tweed'};
var _user$project$FromEnglish$TweePop = {ctor: 'TweePop'};
var _user$project$FromEnglish$Turnip = {ctor: 'Turnip'};
var _user$project$FromEnglish$Turn = {ctor: 'Turn'};
var _user$project$FromEnglish$Turmeric = {ctor: 'Turmeric'};
var _user$project$FromEnglish$Tungsten = {ctor: 'Tungsten'};
var _user$project$FromEnglish$Tumble = {ctor: 'Tumble'};
var _user$project$FromEnglish$Tulle = {ctor: 'Tulle'};
var _user$project$FromEnglish$Tuesday = {ctor: 'Tuesday'};
var _user$project$FromEnglish$Tubers = {ctor: 'Tubers'};
var _user$project$FromEnglish$Try = {ctor: 'Try'};
var _user$project$FromEnglish$Trust = {ctor: 'Trust'};
var _user$project$FromEnglish$Trouble = {ctor: 'Trouble'};
var _user$project$FromEnglish$Trot = {ctor: 'Trot'};
var _user$project$FromEnglish$TripHop = {ctor: 'TripHop'};
var _user$project$FromEnglish$Trip = {ctor: 'Trip'};
var _user$project$FromEnglish$Trick = {ctor: 'Trick'};
var _user$project$FromEnglish$TribalHouse = {ctor: 'TribalHouse'};
var _user$project$FromEnglish$Tremble = {ctor: 'Tremble'};
var _user$project$FromEnglish$Treat = {ctor: 'Treat'};
var _user$project$FromEnglish$TravelAgency = {ctor: 'TravelAgency'};
var _user$project$FromEnglish$TravelAction = {ctor: 'TravelAction'};
var _user$project$FromEnglish$Travel = {ctor: 'Travel'};
var _user$project$FromEnglish$Transport = {ctor: 'Transport'};
var _user$project$FromEnglish$Transparent = {ctor: 'Transparent'};
var _user$project$FromEnglish$Translator = {ctor: 'Translator'};
var _user$project$FromEnglish$TransitMap = {ctor: 'TransitMap'};
var _user$project$FromEnglish$TransferAction = {ctor: 'TransferAction'};
var _user$project$FromEnglish$Transcript = {ctor: 'Transcript'};
var _user$project$FromEnglish$TransFatContent = {ctor: 'TransFatContent'};
var _user$project$FromEnglish$Trance = {ctor: 'Trance'};
var _user$project$FromEnglish$TrainTrip = {ctor: 'TrainTrip'};
var _user$project$FromEnglish$TrainStation = {ctor: 'TrainStation'};
var _user$project$FromEnglish$TrainReservation = {ctor: 'TrainReservation'};
var _user$project$FromEnglish$TrainNumber = {ctor: 'TrainNumber'};
var _user$project$FromEnglish$TrainName = {ctor: 'TrainName'};
var _user$project$FromEnglish$Train = {ctor: 'Train'};
var _user$project$FromEnglish$Trailer = {ctor: 'Trailer'};
var _user$project$FromEnglish$TraditionalDoom = {ctor: 'TraditionalDoom'};
var _user$project$FromEnglish$TradeAction = {ctor: 'TradeAction'};
var _user$project$FromEnglish$Trade = {ctor: 'Trade'};
var _user$project$FromEnglish$TradJazz = {ctor: 'TradJazz'};
var _user$project$FromEnglish$Tracks = {ctor: 'Tracks'};
var _user$project$FromEnglish$TrackingUrl = {ctor: 'TrackingUrl'};
var _user$project$FromEnglish$TrackingNumber = {ctor: 'TrackingNumber'};
var _user$project$FromEnglish$TrackAction = {ctor: 'TrackAction'};
var _user$project$FromEnglish$Trace = {ctor: 'Trace'};
var _user$project$FromEnglish$ToytownTechno = {ctor: 'ToytownTechno'};
var _user$project$FromEnglish$ToyStore = {ctor: 'ToyStore'};
var _user$project$FromEnglish$TouristInformationCenter = {ctor: 'TouristInformationCenter'};
var _user$project$FromEnglish$TouristAttraction = {ctor: 'TouristAttraction'};
var _user$project$FromEnglish$Touch = {ctor: 'Touch'};
var _user$project$FromEnglish$TotalTime = {ctor: 'TotalTime'};
var _user$project$FromEnglish$TotalPrice = {ctor: 'TotalPrice'};
var _user$project$FromEnglish$TotalPaymentDue = {ctor: 'TotalPaymentDue'};
var _user$project$FromEnglish$TonkaBean = {ctor: 'TonkaBean'};
var _user$project$FromEnglish$Tomato = {ctor: 'Tomato'};
var _user$project$FromEnglish$TollFree = {ctor: 'TollFree'};
var _user$project$FromEnglish$Toasty = {ctor: 'Toasty'};
var _user$project$FromEnglish$ToLocation = {ctor: 'ToLocation'};
var _user$project$FromEnglish$Title = {ctor: 'Title'};
var _user$project$FromEnglish$Titanium = {ctor: 'Titanium'};
var _user$project$FromEnglish$TireShop = {ctor: 'TireShop'};
var _user$project$FromEnglish$TipAction = {ctor: 'TipAction'};
var _user$project$FromEnglish$Tip = {ctor: 'Tip'};
var _user$project$FromEnglish$Tin = {ctor: 'Tin'};
var _user$project$FromEnglish$TimeRequired = {ctor: 'TimeRequired'};
var _user$project$FromEnglish$Time = {ctor: 'Time'};
var _user$project$FromEnglish$Timber = {ctor: 'Timber'};
var _user$project$FromEnglish$Tight = {ctor: 'Tight'};
var _user$project$FromEnglish$TieAction = {ctor: 'TieAction'};
var _user$project$FromEnglish$Tickle = {ctor: 'Tickle'};
var _user$project$FromEnglish$TicketedSeat = {ctor: 'TicketedSeat'};
var _user$project$FromEnglish$TicketToken = {ctor: 'TicketToken'};
var _user$project$FromEnglish$TicketNumber = {ctor: 'TicketNumber'};
var _user$project$FromEnglish$Ticket = {ctor: 'Ticket'};
var _user$project$FromEnglish$TickerSymbol = {ctor: 'TickerSymbol'};
var _user$project$FromEnglish$Tick = {ctor: 'Tick'};
var _user$project$FromEnglish$Thyme = {ctor: 'Thyme'};
var _user$project$FromEnglish$Thursday = {ctor: 'Thursday'};
var _user$project$FromEnglish$ThumbnailUrl = {ctor: 'ThumbnailUrl'};
var _user$project$FromEnglish$Thumbnail = {ctor: 'Thumbnail'};
var _user$project$FromEnglish$Thulium = {ctor: 'Thulium'};
var _user$project$FromEnglish$ThrashMetal = {ctor: 'ThrashMetal'};
var _user$project$FromEnglish$Thorium = {ctor: 'Thorium'};
var _user$project$FromEnglish$ThirdStream = {ctor: 'ThirdStream'};
var _user$project$FromEnglish$Thing = {ctor: 'Thing'};
var _user$project$FromEnglish$TheaterGroup = {ctor: 'TheaterGroup'};
var _user$project$FromEnglish$TheaterEvent = {ctor: 'TheaterEvent'};
var _user$project$FromEnglish$Thank = {ctor: 'Thank'};
var _user$project$FromEnglish$Thallium = {ctor: 'Thallium'};
var _user$project$FromEnglish$ThaiBasil = {ctor: 'ThaiBasil'};
var _user$project$FromEnglish$TextDigitalDocument = {ctor: 'TextDigitalDocument'};
var _user$project$FromEnglish$Text = {ctor: 'Text'};
var _user$project$FromEnglish$TewkesburyMustard = {ctor: 'TewkesburyMustard'};
var _user$project$FromEnglish$Terrify = {ctor: 'Terrify'};
var _user$project$FromEnglish$Terrazzo = {ctor: 'Terrazzo'};
var _user$project$FromEnglish$TerraCotta = {ctor: 'TerraCotta'};
var _user$project$FromEnglish$TeriyakiSauce = {ctor: 'TeriyakiSauce'};
var _user$project$FromEnglish$TennisComplex = {ctor: 'TennisComplex'};
var _user$project$FromEnglish$Tempt = {ctor: 'Tempt'};
var _user$project$FromEnglish$TemporalCoverage = {ctor: 'TemporalCoverage'};
var _user$project$FromEnglish$Temporal = {ctor: 'Temporal'};
var _user$project$FromEnglish$TelevisionStation = {ctor: 'TelevisionStation'};
var _user$project$FromEnglish$TelevisionChannel = {ctor: 'TelevisionChannel'};
var _user$project$FromEnglish$Telephone = {ctor: 'Telephone'};
var _user$project$FromEnglish$TechnoFolk = {ctor: 'TechnoFolk'};
var _user$project$FromEnglish$TechnoDnb = {ctor: 'TechnoDnb'};
var _user$project$FromEnglish$TechnicalDeathMetal = {ctor: 'TechnicalDeathMetal'};
var _user$project$FromEnglish$Technetium = {ctor: 'Technetium'};
var _user$project$FromEnglish$TechTrance = {ctor: 'TechTrance'};
var _user$project$FromEnglish$TechHouse = {ctor: 'TechHouse'};
var _user$project$FromEnglish$TechArticle = {ctor: 'TechArticle'};
var _user$project$FromEnglish$TaxiStand = {ctor: 'TaxiStand'};
var _user$project$FromEnglish$TaxiService = {ctor: 'TaxiService'};
var _user$project$FromEnglish$TaxiReservation = {ctor: 'TaxiReservation'};
var _user$project$FromEnglish$TaxId = {ctor: 'TaxId'};
var _user$project$FromEnglish$TattooParlor = {ctor: 'TattooParlor'};
var _user$project$FromEnglish$Tattersall = {ctor: 'Tattersall'};
var _user$project$FromEnglish$TasmanianPepper = {ctor: 'TasmanianPepper'};
var _user$project$FromEnglish$TartarSauce = {ctor: 'TartarSauce'};
var _user$project$FromEnglish$Tartan = {ctor: 'Tartan'};
var _user$project$FromEnglish$Tart = {ctor: 'Tart'};
var _user$project$FromEnglish$Tarragon = {ctor: 'Tarragon'};
var _user$project$FromEnglish$Taro = {ctor: 'Taro'};
var _user$project$FromEnglish$TargetUrl = {ctor: 'TargetUrl'};
var _user$project$FromEnglish$TargetProduct = {ctor: 'TargetProduct'};
var _user$project$FromEnglish$TargetPlatform = {ctor: 'TargetPlatform'};
var _user$project$FromEnglish$TargetName = {ctor: 'TargetName'};
var _user$project$FromEnglish$TargetDescription = {ctor: 'TargetDescription'};
var _user$project$FromEnglish$TargetCollection = {ctor: 'TargetCollection'};
var _user$project$FromEnglish$Tantalum = {ctor: 'Tantalum'};
var _user$project$FromEnglish$Tannic = {ctor: 'Tannic'};
var _user$project$FromEnglish$Tangerine = {ctor: 'Tangerine'};
var _user$project$FromEnglish$TandooriMasala = {ctor: 'TandooriMasala'};
var _user$project$FromEnglish$Tamarind = {ctor: 'Tamarind'};
var _user$project$FromEnglish$Tamarillo = {ctor: 'Tamarillo'};
var _user$project$FromEnglish$TakeAction = {ctor: 'TakeAction'};
var _user$project$FromEnglish$Taffeta = {ctor: 'Taffeta'};
var _user$project$FromEnglish$Table = {ctor: 'Table'};
var _user$project$FromEnglish$TabascoPepper = {ctor: 'TabascoPepper'};
var _user$project$FromEnglish$Syrup = {ctor: 'Syrup'};
var _user$project$FromEnglish$Synagogue = {ctor: 'Synagogue'};
var _user$project$FromEnglish$SymphonicMetal = {ctor: 'SymphonicMetal'};
var _user$project$FromEnglish$Switch = {ctor: 'Switch'};
var _user$project$FromEnglish$SwingHouse = {ctor: 'SwingHouse'};
var _user$project$FromEnglish$Swing = {ctor: 'Swing'};
var _user$project$FromEnglish$SweetPotato = {ctor: 'SweetPotato'};
var _user$project$FromEnglish$SweetChilliSauce = {ctor: 'SweetChilliSauce'};
var _user$project$FromEnglish$Sweet = {ctor: 'Sweet'};
var _user$project$FromEnglish$SuspendAction = {ctor: 'SuspendAction'};
var _user$project$FromEnglish$Suspend = {ctor: 'Suspend'};
var _user$project$FromEnglish$Suspect = {ctor: 'Suspect'};
var _user$project$FromEnglish$Surround = {ctor: 'Surround'};
var _user$project$FromEnglish$Surprise = {ctor: 'Surprise'};
var _user$project$FromEnglish$Surface = {ctor: 'Surface'};
var _user$project$FromEnglish$SurfRock = {ctor: 'SurfRock'};
var _user$project$FromEnglish$Suppose = {ctor: 'Suppose'};
var _user$project$FromEnglish$SupportingData = {ctor: 'SupportingData'};
var _user$project$FromEnglish$Support = {ctor: 'Support'};
var _user$project$FromEnglish$Supply = {ctor: 'Supply'};
var _user$project$FromEnglish$SuperEvent = {ctor: 'SuperEvent'};
var _user$project$FromEnglish$SungPoetry = {ctor: 'SungPoetry'};
var _user$project$FromEnglish$Sunday = {ctor: 'Sunday'};
var _user$project$FromEnglish$Sumac = {ctor: 'Sumac'};
var _user$project$FromEnglish$SuitableForDiet = {ctor: 'SuitableForDiet'};
var _user$project$FromEnglish$Suit = {ctor: 'Suit'};
var _user$project$FromEnglish$SuggestedMinAge = {ctor: 'SuggestedMinAge'};
var _user$project$FromEnglish$SuggestedMaxAge = {ctor: 'SuggestedMaxAge'};
var _user$project$FromEnglish$SuggestedGender = {ctor: 'SuggestedGender'};
var _user$project$FromEnglish$SuggestedAnswer = {ctor: 'SuggestedAnswer'};
var _user$project$FromEnglish$Suggest = {ctor: 'Suggest'};
var _user$project$FromEnglish$SugarContent = {ctor: 'SugarContent'};
var _user$project$FromEnglish$Suffer = {ctor: 'Suffer'};
var _user$project$FromEnglish$Suck = {ctor: 'Suck'};
var _user$project$FromEnglish$SuccessorOf = {ctor: 'SuccessorOf'};
var _user$project$FromEnglish$Succeed = {ctor: 'Succeed'};
var _user$project$FromEnglish$SubwayStation = {ctor: 'SubwayStation'};
var _user$project$FromEnglish$Subtract = {ctor: 'Subtract'};
var _user$project$FromEnglish$SubtitleLanguage = {ctor: 'SubtitleLanguage'};
var _user$project$FromEnglish$SubscribeAction = {ctor: 'SubscribeAction'};
var _user$project$FromEnglish$SubReservation = {ctor: 'SubReservation'};
var _user$project$FromEnglish$SubOrganization = {ctor: 'SubOrganization'};
var _user$project$FromEnglish$SubEvents = {ctor: 'SubEvents'};
var _user$project$FromEnglish$SubEvent = {ctor: 'SubEvent'};
var _user$project$FromEnglish$Styrofoam = {ctor: 'Styrofoam'};
var _user$project$FromEnglish$Stuff = {ctor: 'Stuff'};
var _user$project$FromEnglish$StudioAlbum = {ctor: 'StudioAlbum'};
var _user$project$FromEnglish$StubTex = {ctor: 'StubTex'};
var _user$project$FromEnglish$StructuredValue = {ctor: 'StructuredValue'};
var _user$project$FromEnglish$Structured = {ctor: 'Structured'};
var _user$project$FromEnglish$Strontium = {ctor: 'Strontium'};
var _user$project$FromEnglish$Strip = {ctor: 'Strip'};
var _user$project$FromEnglish$StrideJazz = {ctor: 'StrideJazz'};
var _user$project$FromEnglish$Stretch = {ctor: 'Stretch'};
var _user$project$FromEnglish$Strengthen = {ctor: 'Strengthen'};
var _user$project$FromEnglish$StreetPunk = {ctor: 'StreetPunk'};
var _user$project$FromEnglish$StreetAddress = {ctor: 'StreetAddress'};
var _user$project$FromEnglish$Strawberry = {ctor: 'Strawberry'};
var _user$project$FromEnglish$StraightAheadJazz = {ctor: 'StraightAheadJazz'};
var _user$project$FromEnglish$Store = {ctor: 'Store'};
var _user$project$FromEnglish$StorageRequirements = {ctor: 'StorageRequirements'};
var _user$project$FromEnglish$Stop = {ctor: 'Stop'};
var _user$project$FromEnglish$StonerRock = {ctor: 'StonerRock'};
var _user$project$FromEnglish$Stone = {ctor: 'Stone'};
var _user$project$FromEnglish$Stitch = {ctor: 'Stitch'};
var _user$project$FromEnglish$StiAccommodationOntology = {ctor: 'StiAccommodationOntology'};
var _user$project$FromEnglish$StepValue = {ctor: 'StepValue'};
var _user$project$FromEnglish$SteeringPositionValue = {ctor: 'SteeringPositionValue'};
var _user$project$FromEnglish$SteeringPosition = {ctor: 'SteeringPosition'};
var _user$project$FromEnglish$SteakSauce = {ctor: 'SteakSauce'};
var _user$project$FromEnglish$State = {ctor: 'State'};
var _user$project$FromEnglish$StartTime = {ctor: 'StartTime'};
var _user$project$FromEnglish$StartDate = {ctor: 'StartDate'};
var _user$project$FromEnglish$StarRating = {ctor: 'StarRating'};
var _user$project$FromEnglish$StarFruit = {ctor: 'StarFruit'};
var _user$project$FromEnglish$StarAnise = {ctor: 'StarAnise'};
var _user$project$FromEnglish$Stamp = {ctor: 'Stamp'};
var _user$project$FromEnglish$StadiumOrArena = {ctor: 'StadiumOrArena'};
var _user$project$FromEnglish$StackExchange = {ctor: 'StackExchange'};
var _user$project$FromEnglish$Sriracha = {ctor: 'Sriracha'};
var _user$project$FromEnglish$Squeeze = {ctor: 'Squeeze'};
var _user$project$FromEnglish$Squeal = {ctor: 'Squeal'};
var _user$project$FromEnglish$Squeak = {ctor: 'Squeak'};
var _user$project$FromEnglish$Sprout = {ctor: 'Sprout'};
var _user$project$FromEnglish$SpreadsheetDigitalDocument = {ctor: 'SpreadsheetDigitalDocument'};
var _user$project$FromEnglish$Spray = {ctor: 'Spray'};
var _user$project$FromEnglish$Spouse = {ctor: 'Spouse'};
var _user$project$FromEnglish$Spot = {ctor: 'Spot'};
var _user$project$FromEnglish$SportsTeam = {ctor: 'SportsTeam'};
var _user$project$FromEnglish$SportsOrganization = {ctor: 'SportsOrganization'};
var _user$project$FromEnglish$SportsEvent = {ctor: 'SportsEvent'};
var _user$project$FromEnglish$SportsClub = {ctor: 'SportsClub'};
var _user$project$FromEnglish$SportsActivityLocation = {ctor: 'SportsActivityLocation'};
var _user$project$FromEnglish$SportingGoodsStore = {ctor: 'SportingGoodsStore'};
var _user$project$FromEnglish$Sponsor = {ctor: 'Sponsor'};
var _user$project$FromEnglish$SpokenWordAlbum = {ctor: 'SpokenWordAlbum'};
var _user$project$FromEnglish$Spoil = {ctor: 'Spoil'};
var _user$project$FromEnglish$Spinach = {ctor: 'Spinach'};
var _user$project$FromEnglish$SpiderSilk = {ctor: 'SpiderSilk'};
var _user$project$FromEnglish$SpeedMetal = {ctor: 'SpeedMetal'};
var _user$project$FromEnglish$SpeedGarage = {ctor: 'SpeedGarage'};
var _user$project$FromEnglish$Specialty = {ctor: 'Specialty'};
var _user$project$FromEnglish$SpecialOpeningHoursSpecification = {ctor: 'SpecialOpeningHoursSpecification'};
var _user$project$FromEnglish$SpecialCommitments = {ctor: 'SpecialCommitments'};
var _user$project$FromEnglish$SpatialCoverage = {ctor: 'SpatialCoverage'};
var _user$project$FromEnglish$Spatial = {ctor: 'Spatial'};
var _user$project$FromEnglish$Spark = {ctor: 'Spark'};
var _user$project$FromEnglish$Spare = {ctor: 'Spare'};
var _user$project$FromEnglish$Spandex = {ctor: 'Spandex'};
var _user$project$FromEnglish$SpaghettiSquash = {ctor: 'SpaghettiSquash'};
var _user$project$FromEnglish$SpaceRock = {ctor: 'SpaceRock'};
var _user$project$FromEnglish$SpaceHouse = {ctor: 'SpaceHouse'};
var _user$project$FromEnglish$SpaceDisco = {ctor: 'SpaceDisco'};
var _user$project$FromEnglish$SoySauce = {ctor: 'SoySauce'};
var _user$project$FromEnglish$SoyBean = {ctor: 'SoyBean'};
var _user$project$FromEnglish$SouthernRock = {ctor: 'SouthernRock'};
var _user$project$FromEnglish$SourceOrganization = {ctor: 'SourceOrganization'};
var _user$project$FromEnglish$SoundtrackAlbum = {ctor: 'SoundtrackAlbum'};
var _user$project$FromEnglish$SoundArt = {ctor: 'SoundArt'};
var _user$project$FromEnglish$Sound = {ctor: 'Sound'};
var _user$project$FromEnglish$SoulJazz = {ctor: 'SoulJazz'};
var _user$project$FromEnglish$Sorrel = {ctor: 'Sorrel'};
var _user$project$FromEnglish$SomeProducts = {ctor: 'SomeProducts'};
var _user$project$FromEnglish$SoldOut = {ctor: 'SoldOut'};
var _user$project$FromEnglish$SoftwareVersion = {ctor: 'SoftwareVersion'};
var _user$project$FromEnglish$SoftwareSourceCode = {ctor: 'SoftwareSourceCode'};
var _user$project$FromEnglish$SoftwareRequirements = {ctor: 'SoftwareRequirements'};
var _user$project$FromEnglish$SoftwareHelp = {ctor: 'SoftwareHelp'};
var _user$project$FromEnglish$SoftwareApplication = {ctor: 'SoftwareApplication'};
var _user$project$FromEnglish$SoftwareAddOn = {ctor: 'SoftwareAddOn'};
var _user$project$FromEnglish$SoftRock = {ctor: 'SoftRock'};
var _user$project$FromEnglish$SodiumContent = {ctor: 'SodiumContent'};
var _user$project$FromEnglish$Sodium = {ctor: 'Sodium'};
var _user$project$FromEnglish$SocialMediaPosting = {ctor: 'SocialMediaPosting'};
var _user$project$FromEnglish$SocialEvent = {ctor: 'SocialEvent'};
var _user$project$FromEnglish$Sniff = {ctor: 'Sniff'};
var _user$project$FromEnglish$Sneeze = {ctor: 'Sneeze'};
var _user$project$FromEnglish$Snatch = {ctor: 'Snatch'};
var _user$project$FromEnglish$SnapPea = {ctor: 'SnapPea'};
var _user$project$FromEnglish$SmoothJazz = {ctor: 'SmoothJazz'};
var _user$project$FromEnglish$Smooth = {ctor: 'Smooth'};
var _user$project$FromEnglish$SmokingAllowed = {ctor: 'SmokingAllowed'};
var _user$project$FromEnglish$Smokey = {ctor: 'Smokey'};
var _user$project$FromEnglish$Smile = {ctor: 'Smile'};
var _user$project$FromEnglish$SludgeMetal = {ctor: 'SludgeMetal'};
var _user$project$FromEnglish$Slip = {ctor: 'Slip'};
var _user$project$FromEnglish$Sku = {ctor: 'Sku'};
var _user$project$FromEnglish$Skirret = {ctor: 'Skirret'};
var _user$project$FromEnglish$Skip = {ctor: 'Skip'};
var _user$project$FromEnglish$Skills = {ctor: 'Skills'};
var _user$project$FromEnglish$SkiResort = {ctor: 'SkiResort'};
var _user$project$FromEnglish$Ski = {ctor: 'Ski'};
var _user$project$FromEnglish$SkatePunk = {ctor: 'SkatePunk'};
var _user$project$FromEnglish$SkaPunk = {ctor: 'SkaPunk'};
var _user$project$FromEnglish$SkaJazz = {ctor: 'SkaJazz'};
var _user$project$FromEnglish$SiteNavigationElement = {ctor: 'SiteNavigationElement'};
var _user$project$FromEnglish$Sisal = {ctor: 'Sisal'};
var _user$project$FromEnglish$SingleRelease = {ctor: 'SingleRelease'};
var _user$project$FromEnglish$SinglePlayer = {ctor: 'SinglePlayer'};
var _user$project$FromEnglish$SingleFamilyResidence = {ctor: 'SingleFamilyResidence'};
var _user$project$FromEnglish$Silver = {ctor: 'Silver'};
var _user$project$FromEnglish$Silky = {ctor: 'Silky'};
var _user$project$FromEnglish$Silk = {ctor: 'Silk'};
var _user$project$FromEnglish$SignificantLinks = {ctor: 'SignificantLinks'};
var _user$project$FromEnglish$SignificantLink = {ctor: 'SignificantLink'};
var _user$project$FromEnglish$Signal = {ctor: 'Signal'};
var _user$project$FromEnglish$SichuanPepper = {ctor: 'SichuanPepper'};
var _user$project$FromEnglish$Siblings = {ctor: 'Siblings'};
var _user$project$FromEnglish$Sibling = {ctor: 'Sibling'};
var _user$project$FromEnglish$Shrug = {ctor: 'Shrug'};
var _user$project$FromEnglish$ShotSilk = {ctor: 'ShotSilk'};
var _user$project$FromEnglish$ShoppingCenter = {ctor: 'ShoppingCenter'};
var _user$project$FromEnglish$Shop = {ctor: 'Shop'};
var _user$project$FromEnglish$Shoegaze = {ctor: 'Shoegaze'};
var _user$project$FromEnglish$ShoeStore = {ctor: 'ShoeStore'};
var _user$project$FromEnglish$Shock = {ctor: 'Shock'};
var _user$project$FromEnglish$Shiver = {ctor: 'Shiver'};
var _user$project$FromEnglish$Shiso = {ctor: 'Shiso'};
var _user$project$FromEnglish$Shiplap = {ctor: 'Shiplap'};
var _user$project$FromEnglish$Shelter = {ctor: 'Shelter'};
var _user$project$FromEnglish$Shave = {ctor: 'Shave'};
var _user$project$FromEnglish$SharenaSol = {ctor: 'SharenaSol'};
var _user$project$FromEnglish$SharedContent = {ctor: 'SharedContent'};
var _user$project$FromEnglish$ShareAction = {ctor: 'ShareAction'};
var _user$project$FromEnglish$Shade = {ctor: 'Shade'};
var _user$project$FromEnglish$SesameOil = {ctor: 'SesameOil'};
var _user$project$FromEnglish$Sesame = {ctor: 'Sesame'};
var _user$project$FromEnglish$ServingSize = {ctor: 'ServingSize'};
var _user$project$FromEnglish$ServiceUrl = {ctor: 'ServiceUrl'};
var _user$project$FromEnglish$ServiceType = {ctor: 'ServiceType'};
var _user$project$FromEnglish$ServiceSmsNumber = {ctor: 'ServiceSmsNumber'};
var _user$project$FromEnglish$ServicePostalAddress = {ctor: 'ServicePostalAddress'};
var _user$project$FromEnglish$ServicePhone = {ctor: 'ServicePhone'};
var _user$project$FromEnglish$ServiceOutput = {ctor: 'ServiceOutput'};
var _user$project$FromEnglish$ServiceOperator = {ctor: 'ServiceOperator'};
var _user$project$FromEnglish$ServiceLocation = {ctor: 'ServiceLocation'};
var _user$project$FromEnglish$ServiceChannel = {ctor: 'ServiceChannel'};
var _user$project$FromEnglish$ServiceAudience = {ctor: 'ServiceAudience'};
var _user$project$FromEnglish$ServiceArea = {ctor: 'ServiceArea'};
var _user$project$FromEnglish$Service = {ctor: 'Service'};
var _user$project$FromEnglish$ServesCuisine = {ctor: 'ServesCuisine'};
var _user$project$FromEnglish$ServerStatus = {ctor: 'ServerStatus'};
var _user$project$FromEnglish$Serve = {ctor: 'Serve'};
var _user$project$FromEnglish$Series = {ctor: 'Series'};
var _user$project$FromEnglish$SerialNumber = {ctor: 'SerialNumber'};
var _user$project$FromEnglish$Serge = {ctor: 'Serge'};
var _user$project$FromEnglish$SendAction = {ctor: 'SendAction'};
var _user$project$FromEnglish$SellAction = {ctor: 'SellAction'};
var _user$project$FromEnglish$SelfStorage = {ctor: 'SelfStorage'};
var _user$project$FromEnglish$Seersucker = {ctor: 'Seersucker'};
var _user$project$FromEnglish$SecurityScreening = {ctor: 'SecurityScreening'};
var _user$project$FromEnglish$SeatingType = {ctor: 'SeatingType'};
var _user$project$FromEnglish$SeatingMap = {ctor: 'SeatingMap'};
var _user$project$FromEnglish$SeatSection = {ctor: 'SeatSection'};
var _user$project$FromEnglish$SeatRow = {ctor: 'SeatRow'};
var _user$project$FromEnglish$SeatNumber = {ctor: 'SeatNumber'};
var _user$project$FromEnglish$Seasons = {ctor: 'Seasons'};
var _user$project$FromEnglish$SeasonNumber = {ctor: 'SeasonNumber'};
var _user$project$FromEnglish$Season = {ctor: 'Season'};
var _user$project$FromEnglish$SearchResultsPage = {ctor: 'SearchResultsPage'};
var _user$project$FromEnglish$SearchAction = {ctor: 'SearchAction'};
var _user$project$FromEnglish$Search = {ctor: 'Search'};
var _user$project$FromEnglish$Seaborgium = {ctor: 'Seaborgium'};
var _user$project$FromEnglish$SeaSilk = {ctor: 'SeaSilk'};
var _user$project$FromEnglish$SeaBodyOfWater = {ctor: 'SeaBodyOfWater'};
var _user$project$FromEnglish$Sculpture = {ctor: 'Sculpture'};
var _user$project$FromEnglish$Scrub = {ctor: 'Scrub'};
var _user$project$FromEnglish$Scrim = {ctor: 'Scrim'};
var _user$project$FromEnglish$Scribble = {ctor: 'Scribble'};
var _user$project$FromEnglish$Screw = {ctor: 'Screw'};
var _user$project$FromEnglish$Screenshot = {ctor: 'Screenshot'};
var _user$project$FromEnglish$ScreeningEvent = {ctor: 'ScreeningEvent'};
var _user$project$FromEnglish$ScreenCount = {ctor: 'ScreenCount'};
var _user$project$FromEnglish$Scratch = {ctor: 'Scratch'};
var _user$project$FromEnglish$Scrape = {ctor: 'Scrape'};
var _user$project$FromEnglish$Scorch = {ctor: 'Scorch'};
var _user$project$FromEnglish$Scold = {ctor: 'Scold'};
var _user$project$FromEnglish$ScholarlyArticle = {ctor: 'ScholarlyArticle'};
var _user$project$FromEnglish$SchemaVersion = {ctor: 'SchemaVersion'};
var _user$project$FromEnglish$ScheduledTime = {ctor: 'ScheduledTime'};
var _user$project$FromEnglish$ScheduledPaymentDate = {ctor: 'ScheduledPaymentDate'};
var _user$project$FromEnglish$ScheduleAction = {ctor: 'ScheduleAction'};
var _user$project$FromEnglish$Scatter = {ctor: 'Scatter'};
var _user$project$FromEnglish$Scarlet = {ctor: 'Scarlet'};
var _user$project$FromEnglish$Scandium = {ctor: 'Scandium'};
var _user$project$FromEnglish$Scallion = {ctor: 'Scallion'};
var _user$project$FromEnglish$Savory = {ctor: 'Savory'};
var _user$project$FromEnglish$Save = {ctor: 'Save'};
var _user$project$FromEnglish$Sauerkraut = {ctor: 'Sauerkraut'};
var _user$project$FromEnglish$Saturday = {ctor: 'Saturday'};
var _user$project$FromEnglish$SaturatedFatContent = {ctor: 'SaturatedFatContent'};
var _user$project$FromEnglish$Satsuma = {ctor: 'Satsuma'};
var _user$project$FromEnglish$Satisfy = {ctor: 'Satisfy'};
var _user$project$FromEnglish$Sateen = {ctor: 'Sateen'};
var _user$project$FromEnglish$Sassafras = {ctor: 'Sassafras'};
var _user$project$FromEnglish$Sarsaparilla = {ctor: 'Sarsaparilla'};
var _user$project$FromEnglish$SampleType = {ctor: 'SampleType'};
var _user$project$FromEnglish$Samite = {ctor: 'Samite'};
var _user$project$FromEnglish$SameAs = {ctor: 'SameAs'};
var _user$project$FromEnglish$Sambal = {ctor: 'Sambal'};
var _user$project$FromEnglish$Samarium = {ctor: 'Samarium'};
var _user$project$FromEnglish$SaltAndPepper = {ctor: 'SaltAndPepper'};
var _user$project$FromEnglish$Salt = {ctor: 'Salt'};
var _user$project$FromEnglish$SalsaGolf = {ctor: 'SalsaGolf'};
var _user$project$FromEnglish$Salsa = {ctor: 'Salsa'};
var _user$project$FromEnglish$SalaryCurrency = {ctor: 'SalaryCurrency'};
var _user$project$FromEnglish$SalalBerry = {ctor: 'SalalBerry'};
var _user$project$FromEnglish$SaladDressing = {ctor: 'SaladDressing'};
var _user$project$FromEnglish$SaladCream = {ctor: 'SaladCream'};
var _user$project$FromEnglish$Sage = {ctor: 'Sage'};
var _user$project$FromEnglish$Saffron = {ctor: 'Saffron'};
var _user$project$FromEnglish$Rutherfordium = {ctor: 'Rutherfordium'};
var _user$project$FromEnglish$Ruthenium = {ctor: 'Ruthenium'};
var _user$project$FromEnglish$Rutabaga = {ctor: 'Rutabaga'};
var _user$project$FromEnglish$RussellCord = {ctor: 'RussellCord'};
var _user$project$FromEnglish$Rush = {ctor: 'Rush'};
var _user$project$FromEnglish$RuntimePlatform = {ctor: 'RuntimePlatform'};
var _user$project$FromEnglish$Runtime = {ctor: 'Runtime'};
var _user$project$FromEnglish$RunnerBean = {ctor: 'RunnerBean'};
var _user$project$FromEnglish$Rule = {ctor: 'Rule'};
var _user$project$FromEnglish$Ruin = {ctor: 'Ruin'};
var _user$project$FromEnglish$Rubidium = {ctor: 'Rubidium'};
var _user$project$FromEnglish$RsvpResponseYes = {ctor: 'RsvpResponseYes'};
var _user$project$FromEnglish$RsvpResponseType = {ctor: 'RsvpResponseType'};
var _user$project$FromEnglish$RsvpResponseNo = {ctor: 'RsvpResponseNo'};
var _user$project$FromEnglish$RsvpResponseMaybe = {ctor: 'RsvpResponseMaybe'};
var _user$project$FromEnglish$RsvpResponse = {ctor: 'RsvpResponse'};
var _user$project$FromEnglish$RsvpAction = {ctor: 'RsvpAction'};
var _user$project$FromEnglish$Round = {ctor: 'Round'};
var _user$project$FromEnglish$Rough = {ctor: 'Rough'};
var _user$project$FromEnglish$Rot = {ctor: 'Rot'};
var _user$project$FromEnglish$Rosemary = {ctor: 'Rosemary'};
var _user$project$FromEnglish$Rose = {ctor: 'Rose'};
var _user$project$FromEnglish$RoofingContractor = {ctor: 'RoofingContractor'};
var _user$project$FromEnglish$RoleName = {ctor: 'RoleName'};
var _user$project$FromEnglish$Roentgenium = {ctor: 'Roentgenium'};
var _user$project$FromEnglish$RockMelon = {ctor: 'RockMelon'};
var _user$project$FromEnglish$RockInOpposition = {ctor: 'RockInOpposition'};
var _user$project$FromEnglish$RockAndRoll = {ctor: 'RockAndRoll'};
var _user$project$FromEnglish$RiverBodyOfWater = {ctor: 'RiverBodyOfWater'};
var _user$project$FromEnglish$Risk = {ctor: 'Risk'};
var _user$project$FromEnglish$Ripstop = {ctor: 'Ripstop'};
var _user$project$FromEnglish$RiotGrrrl = {ctor: 'RiotGrrrl'};
var _user$project$FromEnglish$Rinse = {ctor: 'Rinse'};
var _user$project$FromEnglish$RightHandDriving = {ctor: 'RightHandDriving'};
var _user$project$FromEnglish$Rich = {ctor: 'Rich'};
var _user$project$FromEnglish$Rhyme = {ctor: 'Rhyme'};
var _user$project$FromEnglish$Rhubarb = {ctor: 'Rhubarb'};
var _user$project$FromEnglish$Rhodium = {ctor: 'Rhodium'};
var _user$project$FromEnglish$Rhenium = {ctor: 'Rhenium'};
var _user$project$FromEnglish$Reviews = {ctor: 'Reviews'};
var _user$project$FromEnglish$ReviewedBy = {ctor: 'ReviewedBy'};
var _user$project$FromEnglish$ReviewRating = {ctor: 'ReviewRating'};
var _user$project$FromEnglish$ReviewCount = {ctor: 'ReviewCount'};
var _user$project$FromEnglish$ReviewBody = {ctor: 'ReviewBody'};
var _user$project$FromEnglish$ReviewAction = {ctor: 'ReviewAction'};
var _user$project$FromEnglish$Review = {ctor: 'Review'};
var _user$project$FromEnglish$ReturnAction = {ctor: 'ReturnAction'};
var _user$project$FromEnglish$Return = {ctor: 'Return'};
var _user$project$FromEnglish$Retire = {ctor: 'Retire'};
var _user$project$FromEnglish$Reticent = {ctor: 'Reticent'};
var _user$project$FromEnglish$ResumeAction = {ctor: 'ResumeAction'};
var _user$project$FromEnglish$ResultReview = {ctor: 'ResultReview'};
var _user$project$FromEnglish$ResultComment = {ctor: 'ResultComment'};
var _user$project$FromEnglish$Result = {ctor: 'Result'};
var _user$project$FromEnglish$RestrictedDiet = {ctor: 'RestrictedDiet'};
var _user$project$FromEnglish$Restaurant = {ctor: 'Restaurant'};
var _user$project$FromEnglish$Responsibilities = {ctor: 'Responsibilities'};
var _user$project$FromEnglish$Resort = {ctor: 'Resort'};
var _user$project$FromEnglish$Residence = {ctor: 'Residence'};
var _user$project$FromEnglish$Reservoir = {ctor: 'Reservoir'};
var _user$project$FromEnglish$ReservedTicket = {ctor: 'ReservedTicket'};
var _user$project$FromEnglish$ReserveAction = {ctor: 'ReserveAction'};
var _user$project$FromEnglish$ReservationStatusType = {ctor: 'ReservationStatusType'};
var _user$project$FromEnglish$ReservationStatus = {ctor: 'ReservationStatus'};
var _user$project$FromEnglish$ReservationPending = {ctor: 'ReservationPending'};
var _user$project$FromEnglish$ReservationPackage = {ctor: 'ReservationPackage'};
var _user$project$FromEnglish$ReservationId = {ctor: 'ReservationId'};
var _user$project$FromEnglish$ReservationHold = {ctor: 'ReservationHold'};
var _user$project$FromEnglish$ReservationFor = {ctor: 'ReservationFor'};
var _user$project$FromEnglish$ReservationConfirmed = {ctor: 'ReservationConfirmed'};
var _user$project$FromEnglish$ReservationCancelled = {ctor: 'ReservationCancelled'};
var _user$project$FromEnglish$Reservation = {ctor: 'Reservation'};
var _user$project$FromEnglish$Researcher = {ctor: 'Researcher'};
var _user$project$FromEnglish$Rescue = {ctor: 'Rescue'};
var _user$project$FromEnglish$RequiresSubscription = {ctor: 'RequiresSubscription'};
var _user$project$FromEnglish$Requirements = {ctor: 'Requirements'};
var _user$project$FromEnglish$RequiredMinAge = {ctor: 'RequiredMinAge'};
var _user$project$FromEnglish$RequiredMaxAge = {ctor: 'RequiredMaxAge'};
var _user$project$FromEnglish$RequiredGender = {ctor: 'RequiredGender'};
var _user$project$FromEnglish$RequiredCollateral = {ctor: 'RequiredCollateral'};
var _user$project$FromEnglish$Request = {ctor: 'Request'};
var _user$project$FromEnglish$Reproduce = {ctor: 'Reproduce'};
var _user$project$FromEnglish$RepresentativeOfPage = {ctor: 'RepresentativeOfPage'};
var _user$project$FromEnglish$ReportNumber = {ctor: 'ReportNumber'};
var _user$project$FromEnglish$Report = {ctor: 'Report'};
var _user$project$FromEnglish$ReplyToUrl = {ctor: 'ReplyToUrl'};
var _user$project$FromEnglish$ReplyAction = {ctor: 'ReplyAction'};
var _user$project$FromEnglish$Reply = {ctor: 'Reply'};
var _user$project$FromEnglish$Replacer = {ctor: 'Replacer'};
var _user$project$FromEnglish$ReplaceAction = {ctor: 'ReplaceAction'};
var _user$project$FromEnglish$Replace = {ctor: 'Replace'};
var _user$project$FromEnglish$RentalCarReservation = {ctor: 'RentalCarReservation'};
var _user$project$FromEnglish$RentAction = {ctor: 'RentAction'};
var _user$project$FromEnglish$Remove = {ctor: 'Remove'};
var _user$project$FromEnglish$Remoulade = {ctor: 'Remoulade'};
var _user$project$FromEnglish$RemixAlbum = {ctor: 'RemixAlbum'};
var _user$project$FromEnglish$Remind = {ctor: 'Remind'};
var _user$project$FromEnglish$Remember = {ctor: 'Remember'};
var _user$project$FromEnglish$RemainingAttendeeCapacity = {ctor: 'RemainingAttendeeCapacity'};
var _user$project$FromEnglish$Remain = {ctor: 'Remain'};
var _user$project$FromEnglish$Relish = {ctor: 'Relish'};
var _user$project$FromEnglish$ReleasedEvent = {ctor: 'ReleasedEvent'};
var _user$project$FromEnglish$ReleaseOf = {ctor: 'ReleaseOf'};
var _user$project$FromEnglish$ReleaseNotes = {ctor: 'ReleaseNotes'};
var _user$project$FromEnglish$ReleaseDate = {ctor: 'ReleaseDate'};
var _user$project$FromEnglish$Release = {ctor: 'Release'};
var _user$project$FromEnglish$Relax = {ctor: 'Relax'};
var _user$project$FromEnglish$RelatedTo = {ctor: 'RelatedTo'};
var _user$project$FromEnglish$RelatedLink = {ctor: 'RelatedLink'};
var _user$project$FromEnglish$Rejoice = {ctor: 'Rejoice'};
var _user$project$FromEnglish$RejectAction = {ctor: 'RejectAction'};
var _user$project$FromEnglish$Reject = {ctor: 'Reject'};
var _user$project$FromEnglish$Reign = {ctor: 'Reign'};
var _user$project$FromEnglish$Regret = {ctor: 'Regret'};
var _user$project$FromEnglish$RegisterAction = {ctor: 'RegisterAction'};
var _user$project$FromEnglish$RegionsAllowed = {ctor: 'RegionsAllowed'};
var _user$project$FromEnglish$Refuse = {ctor: 'Refuse'};
var _user$project$FromEnglish$RefurbishedCondition = {ctor: 'RefurbishedCondition'};
var _user$project$FromEnglish$Reflect = {ctor: 'Reflect'};
var _user$project$FromEnglish$Refined = {ctor: 'Refined'};
var _user$project$FromEnglish$ReferencesOrder = {ctor: 'ReferencesOrder'};
var _user$project$FromEnglish$ReferenceQuantity = {ctor: 'ReferenceQuantity'};
var _user$project$FromEnglish$Reduce = {ctor: 'Reduce'};
var _user$project$FromEnglish$Redcurrant = {ctor: 'Redcurrant'};
var _user$project$FromEnglish$RecyclingCenter = {ctor: 'RecyclingCenter'};
var _user$project$FromEnglish$RecordingOf = {ctor: 'RecordingOf'};
var _user$project$FromEnglish$RecordedIn = {ctor: 'RecordedIn'};
var _user$project$FromEnglish$RecordedAt = {ctor: 'RecordedAt'};
var _user$project$FromEnglish$RecordedAs = {ctor: 'RecordedAs'};
var _user$project$FromEnglish$RecordLabel = {ctor: 'RecordLabel'};
var _user$project$FromEnglish$Record = {ctor: 'Record'};
var _user$project$FromEnglish$Recognise = {ctor: 'Recognise'};
var _user$project$FromEnglish$Recipient = {ctor: 'Recipient'};
var _user$project$FromEnglish$RecipeYield = {ctor: 'RecipeYield'};
var _user$project$FromEnglish$RecipeInstructions = {ctor: 'RecipeInstructions'};
var _user$project$FromEnglish$RecipeIngredient = {ctor: 'RecipeIngredient'};
var _user$project$FromEnglish$RecipeCuisine = {ctor: 'RecipeCuisine'};
var _user$project$FromEnglish$RecipeCategory = {ctor: 'RecipeCategory'};
var _user$project$FromEnglish$Recipe = {ctor: 'Recipe'};
var _user$project$FromEnglish$ReceiveAction = {ctor: 'ReceiveAction'};
var _user$project$FromEnglish$Receive = {ctor: 'Receive'};
var _user$project$FromEnglish$RearWheelDriveConfiguration = {ctor: 'RearWheelDriveConfiguration'};
var _user$project$FromEnglish$Realise = {ctor: 'Realise'};
var _user$project$FromEnglish$RealEstateAgent = {ctor: 'RealEstateAgent'};
var _user$project$FromEnglish$ReadonlyValue = {ctor: 'ReadonlyValue'};
var _user$project$FromEnglish$ReadPermission = {ctor: 'ReadPermission'};
var _user$project$FromEnglish$ReadAction = {ctor: 'ReadAction'};
var _user$project$FromEnglish$ReactAction = {ctor: 'ReactAction'};
var _user$project$FromEnglish$Reach = {ctor: 'Reach'};
var _user$project$FromEnglish$RatingValue = {ctor: 'RatingValue'};
var _user$project$FromEnglish$RatingCount = {ctor: 'RatingCount'};
var _user$project$FromEnglish$Raspberry = {ctor: 'Raspberry'};
var _user$project$FromEnglish$RapRock = {ctor: 'RapRock'};
var _user$project$FromEnglish$RapMetal = {ctor: 'RapMetal'};
var _user$project$FromEnglish$RammedEarth = {ctor: 'RammedEarth'};
var _user$project$FromEnglish$Rambutan = {ctor: 'Rambutan'};
var _user$project$FromEnglish$Raisiny = {ctor: 'Raisiny'};
var _user$project$FromEnglish$Ragtime = {ctor: 'Ragtime'};
var _user$project$FromEnglish$RaggaJungle = {ctor: 'RaggaJungle'};
var _user$project$FromEnglish$RagaRock = {ctor: 'RagaRock'};
var _user$project$FromEnglish$Radium = {ctor: 'Radium'};
var _user$project$FromEnglish$Radish = {ctor: 'Radish'};
var _user$project$FromEnglish$RadioStation = {ctor: 'RadioStation'};
var _user$project$FromEnglish$RadioSeries = {ctor: 'RadioSeries'};
var _user$project$FromEnglish$RadioSeason = {ctor: 'RadioSeason'};
var _user$project$FromEnglish$RadioEpisode = {ctor: 'RadioEpisode'};
var _user$project$FromEnglish$RadioClip = {ctor: 'RadioClip'};
var _user$project$FromEnglish$RadioChannel = {ctor: 'RadioChannel'};
var _user$project$FromEnglish$Radicchio = {ctor: 'Radicchio'};
var _user$project$FromEnglish$Radiate = {ctor: 'Radiate'};
var _user$project$FromEnglish$Race = {ctor: 'Race'};
var _user$project$FromEnglish$RNews = {ctor: 'RNews'};
var _user$project$FromEnglish$QuoteAction = {ctor: 'QuoteAction'};
var _user$project$FromEnglish$Quince = {ctor: 'Quince'};
var _user$project$FromEnglish$Question = {ctor: 'Question'};
var _user$project$FromEnglish$Quest = {ctor: 'Quest'};
var _user$project$FromEnglish$Query = {ctor: 'Query'};
var _user$project$FromEnglish$Quantity = {ctor: 'Quantity'};
var _user$project$FromEnglish$QuantitativeValue = {ctor: 'QuantitativeValue'};
var _user$project$FromEnglish$QualitativeValue = {ctor: 'QualitativeValue'};
var _user$project$FromEnglish$Qualifications = {ctor: 'Qualifications'};
var _user$project$FromEnglish$Push = {ctor: 'Push'};
var _user$project$FromEnglish$PurpleMangosteen = {ctor: 'PurpleMangosteen'};
var _user$project$FromEnglish$PurchaseDate = {ctor: 'PurchaseDate'};
var _user$project$FromEnglish$PunkRock = {ctor: 'PunkRock'};
var _user$project$FromEnglish$PunkJazz = {ctor: 'PunkJazz'};
var _user$project$FromEnglish$Punish = {ctor: 'Punish'};
var _user$project$FromEnglish$Puncture = {ctor: 'Puncture'};
var _user$project$FromEnglish$PumpkinPieSpice = {ctor: 'PumpkinPieSpice'};
var _user$project$FromEnglish$Pumpkin = {ctor: 'Pumpkin'};
var _user$project$FromEnglish$Pump = {ctor: 'Pump'};
var _user$project$FromEnglish$Pull = {ctor: 'Pull'};
var _user$project$FromEnglish$PublishingPrinciples = {ctor: 'PublishingPrinciples'};
var _user$project$FromEnglish$Publisher = {ctor: 'Publisher'};
var _user$project$FromEnglish$PublishedOn = {ctor: 'PublishedOn'};
var _user$project$FromEnglish$PublicationVolume = {ctor: 'PublicationVolume'};
var _user$project$FromEnglish$PublicationIssue = {ctor: 'PublicationIssue'};
var _user$project$FromEnglish$PublicationEvent = {ctor: 'PublicationEvent'};
var _user$project$FromEnglish$Publication = {ctor: 'Publication'};
var _user$project$FromEnglish$PublicSwimmingPool = {ctor: 'PublicSwimmingPool'};
var _user$project$FromEnglish$PublicHolidays = {ctor: 'PublicHolidays'};
var _user$project$FromEnglish$PsychedelicTrance = {ctor: 'PsychedelicTrance'};
var _user$project$FromEnglish$PsychedelicRock = {ctor: 'PsychedelicRock'};
var _user$project$FromEnglish$PsychedelicFolk = {ctor: 'PsychedelicFolk'};
var _user$project$FromEnglish$ProvidesService = {ctor: 'ProvidesService'};
var _user$project$FromEnglish$ProvidesBroadcastService = {ctor: 'ProvidesBroadcastService'};
var _user$project$FromEnglish$ProviderMobility = {ctor: 'ProviderMobility'};
var _user$project$FromEnglish$Provider = {ctor: 'Provider'};
var _user$project$FromEnglish$Provide = {ctor: 'Provide'};
var _user$project$FromEnglish$ProteinContent = {ctor: 'ProteinContent'};
var _user$project$FromEnglish$Protect = {ctor: 'Protect'};
var _user$project$FromEnglish$Protactinium = {ctor: 'Protactinium'};
var _user$project$FromEnglish$PropertyValueSpecification = {ctor: 'PropertyValueSpecification'};
var _user$project$FromEnglish$PropertyValue = {ctor: 'PropertyValue'};
var _user$project$FromEnglish$PropertyId = {ctor: 'PropertyId'};
var _user$project$FromEnglish$Promise = {ctor: 'Promise'};
var _user$project$FromEnglish$Promethium = {ctor: 'Promethium'};
var _user$project$FromEnglish$ProgressiveTechno = {ctor: 'ProgressiveTechno'};
var _user$project$FromEnglish$ProgressiveRock = {ctor: 'ProgressiveRock'};
var _user$project$FromEnglish$ProgressiveMetal = {ctor: 'ProgressiveMetal'};
var _user$project$FromEnglish$ProgressiveHouse = {ctor: 'ProgressiveHouse'};
var _user$project$FromEnglish$ProgressiveFolk = {ctor: 'ProgressiveFolk'};
var _user$project$FromEnglish$ProgressiveDrumBass = {ctor: 'ProgressiveDrumBass'};
var _user$project$FromEnglish$ProgressiveBreaks = {ctor: 'ProgressiveBreaks'};
var _user$project$FromEnglish$Progressive = {ctor: 'Progressive'};
var _user$project$FromEnglish$ProgrammingModel = {ctor: 'ProgrammingModel'};
var _user$project$FromEnglish$ProgrammingLanguage = {ctor: 'ProgrammingLanguage'};
var _user$project$FromEnglish$ProgramName = {ctor: 'ProgramName'};
var _user$project$FromEnglish$ProgramMembershipUsed = {ctor: 'ProgramMembershipUsed'};
var _user$project$FromEnglish$ProgramMembership = {ctor: 'ProgramMembership'};
var _user$project$FromEnglish$ProfilePage = {ctor: 'ProfilePage'};
var _user$project$FromEnglish$ProficiencyLevel = {ctor: 'ProficiencyLevel'};
var _user$project$FromEnglish$ProfessionalService = {ctor: 'ProfessionalService'};
var _user$project$FromEnglish$ProductionDate = {ctor: 'ProductionDate'};
var _user$project$FromEnglish$ProductionCompany = {ctor: 'ProductionCompany'};
var _user$project$FromEnglish$ProductSupported = {ctor: 'ProductSupported'};
var _user$project$FromEnglish$ProductModel = {ctor: 'ProductModel'};
var _user$project$FromEnglish$ProductId = {ctor: 'ProductId'};
var _user$project$FromEnglish$Product = {ctor: 'Product'};
var _user$project$FromEnglish$Produces = {ctor: 'Produces'};
var _user$project$FromEnglish$Produce = {ctor: 'Produce'};
var _user$project$FromEnglish$ProcessorRequirements = {ctor: 'ProcessorRequirements'};
var _user$project$FromEnglish$ProcessingTime = {ctor: 'ProcessingTime'};
var _user$project$FromEnglish$PrintSection = {ctor: 'PrintSection'};
var _user$project$FromEnglish$PrintPage = {ctor: 'PrintPage'};
var _user$project$FromEnglish$PrintEdition = {ctor: 'PrintEdition'};
var _user$project$FromEnglish$PrintColumn = {ctor: 'PrintColumn'};
var _user$project$FromEnglish$Print = {ctor: 'Print'};
var _user$project$FromEnglish$PrimaryImageOfPage = {ctor: 'PrimaryImageOfPage'};
var _user$project$FromEnglish$Prick = {ctor: 'Prick'};
var _user$project$FromEnglish$PriceValidUntil = {ctor: 'PriceValidUntil'};
var _user$project$FromEnglish$PriceType = {ctor: 'PriceType'};
var _user$project$FromEnglish$PriceSpecification = {ctor: 'PriceSpecification'};
var _user$project$FromEnglish$PriceRange = {ctor: 'PriceRange'};
var _user$project$FromEnglish$PriceCurrency = {ctor: 'PriceCurrency'};
var _user$project$FromEnglish$PriceComponent = {ctor: 'PriceComponent'};
var _user$project$FromEnglish$Price = {ctor: 'Price'};
var _user$project$FromEnglish$PreviousStartDate = {ctor: 'PreviousStartDate'};
var _user$project$FromEnglish$PreviousItem = {ctor: 'PreviousItem'};
var _user$project$FromEnglish$Prevent = {ctor: 'Prevent'};
var _user$project$FromEnglish$Pretend = {ctor: 'Pretend'};
var _user$project$FromEnglish$Preserve = {ctor: 'Preserve'};
var _user$project$FromEnglish$PresentationDigitalDocument = {ctor: 'PresentationDigitalDocument'};
var _user$project$FromEnglish$Present = {ctor: 'Present'};
var _user$project$FromEnglish$Preschool = {ctor: 'Preschool'};
var _user$project$FromEnglish$PrependAction = {ctor: 'PrependAction'};
var _user$project$FromEnglish$Prepare = {ctor: 'Prepare'};
var _user$project$FromEnglish$PrepTime = {ctor: 'PrepTime'};
var _user$project$FromEnglish$Prefer = {ctor: 'Prefer'};
var _user$project$FromEnglish$PredecessorOf = {ctor: 'PredecessorOf'};
var _user$project$FromEnglish$Precede = {ctor: 'Precede'};
var _user$project$FromEnglish$Preach = {ctor: 'Preach'};
var _user$project$FromEnglish$PreSale = {ctor: 'PreSale'};
var _user$project$FromEnglish$PreOrder = {ctor: 'PreOrder'};
var _user$project$FromEnglish$Pray = {ctor: 'Pray'};
var _user$project$FromEnglish$Praseodymium = {ctor: 'Praseodymium'};
var _user$project$FromEnglish$Practise = {ctor: 'Practise'};
var _user$project$FromEnglish$Powerful = {ctor: 'Powerful'};
var _user$project$FromEnglish$PowerPop = {ctor: 'PowerPop'};
var _user$project$FromEnglish$PowerNoise = {ctor: 'PowerNoise'};
var _user$project$FromEnglish$PowerMetal = {ctor: 'PowerMetal'};
var _user$project$FromEnglish$PowerElectronics = {ctor: 'PowerElectronics'};
var _user$project$FromEnglish$PowderDouce = {ctor: 'PowderDouce'};
var _user$project$FromEnglish$PotentialActionStatus = {ctor: 'PotentialActionStatus'};
var _user$project$FromEnglish$PotentialAction = {ctor: 'PotentialAction'};
var _user$project$FromEnglish$Potato = {ctor: 'Potato'};
var _user$project$FromEnglish$Potassium = {ctor: 'Potassium'};
var _user$project$FromEnglish$PostalCode = {ctor: 'PostalCode'};
var _user$project$FromEnglish$PostalAddress = {ctor: 'PostalAddress'};
var _user$project$FromEnglish$PostRock = {ctor: 'PostRock'};
var _user$project$FromEnglish$PostPunkRevival = {ctor: 'PostPunkRevival'};
var _user$project$FromEnglish$PostPunk = {ctor: 'PostPunk'};
var _user$project$FromEnglish$PostOfficeBoxNumber = {ctor: 'PostOfficeBoxNumber'};
var _user$project$FromEnglish$PostOffice = {ctor: 'PostOffice'};
var _user$project$FromEnglish$PostMetal = {ctor: 'PostMetal'};
var _user$project$FromEnglish$PostHardcore = {ctor: 'PostHardcore'};
var _user$project$FromEnglish$PostGrunge = {ctor: 'PostGrunge'};
var _user$project$FromEnglish$PostDisco = {ctor: 'PostDisco'};
var _user$project$FromEnglish$PostBritpop = {ctor: 'PostBritpop'};
var _user$project$FromEnglish$PostBop = {ctor: 'PostBop'};
var _user$project$FromEnglish$Post = {ctor: 'Post'};
var _user$project$FromEnglish$Possess = {ctor: 'Possess'};
var _user$project$FromEnglish$Position = {ctor: 'Position'};
var _user$project$FromEnglish$PoppySeed = {ctor: 'PoppySeed'};
var _user$project$FromEnglish$Poplin = {ctor: 'Poplin'};
var _user$project$FromEnglish$PopcornSeasoning = {ctor: 'PopcornSeasoning'};
var _user$project$FromEnglish$PopRock = {ctor: 'PopRock'};
var _user$project$FromEnglish$PopPunk = {ctor: 'PopPunk'};
var _user$project$FromEnglish$Pop = {ctor: 'Pop'};
var _user$project$FromEnglish$Pongee = {ctor: 'Pongee'};
var _user$project$FromEnglish$Pond = {ctor: 'Pond'};
var _user$project$FromEnglish$Pomelo = {ctor: 'Pomelo'};
var _user$project$FromEnglish$PomegranateSeed = {ctor: 'PomegranateSeed'};
var _user$project$FromEnglish$Pomegranate = {ctor: 'Pomegranate'};
var _user$project$FromEnglish$Polyurethane = {ctor: 'Polyurethane'};
var _user$project$FromEnglish$Polystyrene = {ctor: 'Polystyrene'};
var _user$project$FromEnglish$Polygon = {ctor: 'Polygon'};
var _user$project$FromEnglish$Polyester = {ctor: 'Polyester'};
var _user$project$FromEnglish$Polonium = {ctor: 'Polonium'};
var _user$project$FromEnglish$Polish = {ctor: 'Polish'};
var _user$project$FromEnglish$PoliceStation = {ctor: 'PoliceStation'};
var _user$project$FromEnglish$PolarFleece = {ctor: 'PolarFleece'};
var _user$project$FromEnglish$Point = {ctor: 'Point'};
var _user$project$FromEnglish$Plywood = {ctor: 'Plywood'};
var _user$project$FromEnglish$Plutonium = {ctor: 'Plutonium'};
var _user$project$FromEnglish$Plush = {ctor: 'Plush'};
var _user$project$FromEnglish$Playground = {ctor: 'Playground'};
var _user$project$FromEnglish$PlayersOnline = {ctor: 'PlayersOnline'};
var _user$project$FromEnglish$PlayerType = {ctor: 'PlayerType'};
var _user$project$FromEnglish$PlayMode = {ctor: 'PlayMode'};
var _user$project$FromEnglish$PlayAction = {ctor: 'PlayAction'};
var _user$project$FromEnglish$Platinum = {ctor: 'Platinum'};
var _user$project$FromEnglish$PlasticLaminate = {ctor: 'PlasticLaminate'};
var _user$project$FromEnglish$Plastic = {ctor: 'Plastic'};
var _user$project$FromEnglish$Plant = {ctor: 'Plant'};
var _user$project$FromEnglish$PlanAction = {ctor: 'PlanAction'};
var _user$project$FromEnglish$Plan = {ctor: 'Plan'};
var _user$project$FromEnglish$PlaceOfWorship = {ctor: 'PlaceOfWorship'};
var _user$project$FromEnglish$Place = {ctor: 'Place'};
var _user$project$FromEnglish$PintoBean = {ctor: 'PintoBean'};
var _user$project$FromEnglish$Pineapple = {ctor: 'Pineapple'};
var _user$project$FromEnglish$Pine = {ctor: 'Pine'};
var _user$project$FromEnglish$PinStripes = {ctor: 'PinStripes'};
var _user$project$FromEnglish$PicoDeGallo = {ctor: 'PicoDeGallo'};
var _user$project$FromEnglish$PickupTime = {ctor: 'PickupTime'};
var _user$project$FromEnglish$PickupLocation = {ctor: 'PickupLocation'};
var _user$project$FromEnglish$PickledPepper = {ctor: 'PickledPepper'};
var _user$project$FromEnglish$PickledOnion = {ctor: 'PickledOnion'};
var _user$project$FromEnglish$PickledFruit = {ctor: 'PickledFruit'};
var _user$project$FromEnglish$PickledCucumber = {ctor: 'PickledCucumber'};
var _user$project$FromEnglish$Piccalilli = {ctor: 'Piccalilli'};
var _user$project$FromEnglish$Physalis = {ctor: 'Physalis'};
var _user$project$FromEnglish$Photos = {ctor: 'Photos'};
var _user$project$FromEnglish$PhotographAction = {ctor: 'PhotographAction'};
var _user$project$FromEnglish$Photograph = {ctor: 'Photograph'};
var _user$project$FromEnglish$Photo = {ctor: 'Photo'};
var _user$project$FromEnglish$Pharmacy = {ctor: 'Pharmacy'};
var _user$project$FromEnglish$PetsAllowed = {ctor: 'PetsAllowed'};
var _user$project$FromEnglish$PetStore = {ctor: 'PetStore'};
var _user$project$FromEnglish$PeruvianPepper = {ctor: 'PeruvianPepper'};
var _user$project$FromEnglish$Person = {ctor: 'Person'};
var _user$project$FromEnglish$Persimmon = {ctor: 'Persimmon'};
var _user$project$FromEnglish$PermittedUsage = {ctor: 'PermittedUsage'};
var _user$project$FromEnglish$PermitAudience = {ctor: 'PermitAudience'};
var _user$project$FromEnglish$Permit = {ctor: 'Permit'};
var _user$project$FromEnglish$PermissionType = {ctor: 'PermissionType'};
var _user$project$FromEnglish$Periodical = {ctor: 'Periodical'};
var _user$project$FromEnglish$Perilla = {ctor: 'Perilla'};
var _user$project$FromEnglish$PerformingGroup = {ctor: 'PerformingGroup'};
var _user$project$FromEnglish$PerformingArtsTheater = {ctor: 'PerformingArtsTheater'};
var _user$project$FromEnglish$Performers = {ctor: 'Performers'};
var _user$project$FromEnglish$PerformerIn = {ctor: 'PerformerIn'};
var _user$project$FromEnglish$Performer = {ctor: 'Performer'};
var _user$project$FromEnglish$PerformanceRole = {ctor: 'PerformanceRole'};
var _user$project$FromEnglish$PerformAction = {ctor: 'PerformAction'};
var _user$project$FromEnglish$Percale = {ctor: 'Percale'};
var _user$project$FromEnglish$PepperJelly = {ctor: 'PepperJelly'};
var _user$project$FromEnglish$PeopleAudience = {ctor: 'PeopleAudience'};
var _user$project$FromEnglish$Peep = {ctor: 'Peep'};
var _user$project$FromEnglish$Pedal = {ctor: 'Pedal'};
var _user$project$FromEnglish$Peach = {ctor: 'Peach'};
var _user$project$FromEnglish$PaymentUrl = {ctor: 'PaymentUrl'};
var _user$project$FromEnglish$PaymentStatusType = {ctor: 'PaymentStatusType'};
var _user$project$FromEnglish$PaymentStatus = {ctor: 'PaymentStatus'};
var _user$project$FromEnglish$PaymentService = {ctor: 'PaymentService'};
var _user$project$FromEnglish$PaymentPastDue = {ctor: 'PaymentPastDue'};
var _user$project$FromEnglish$PaymentMethodId = {ctor: 'PaymentMethodId'};
var _user$project$FromEnglish$PaymentMethod = {ctor: 'PaymentMethod'};
var _user$project$FromEnglish$PaymentDueDate = {ctor: 'PaymentDueDate'};
var _user$project$FromEnglish$PaymentDue = {ctor: 'PaymentDue'};
var _user$project$FromEnglish$PaymentDeclined = {ctor: 'PaymentDeclined'};
var _user$project$FromEnglish$PaymentComplete = {ctor: 'PaymentComplete'};
var _user$project$FromEnglish$PaymentChargeSpecification = {ctor: 'PaymentChargeSpecification'};
var _user$project$FromEnglish$PaymentCard = {ctor: 'PaymentCard'};
var _user$project$FromEnglish$PaymentAutomaticallyApplied = {ctor: 'PaymentAutomaticallyApplied'};
var _user$project$FromEnglish$PaymentAccepted = {ctor: 'PaymentAccepted'};
var _user$project$FromEnglish$PayAction = {ctor: 'PayAction'};
var _user$project$FromEnglish$PawnShop = {ctor: 'PawnShop'};
var _user$project$FromEnglish$Pause = {ctor: 'Pause'};
var _user$project$FromEnglish$PattyPan = {ctor: 'PattyPan'};
var _user$project$FromEnglish$PassengerSequenceNumber = {ctor: 'PassengerSequenceNumber'};
var _user$project$FromEnglish$PassengerPriorityStatus = {ctor: 'PassengerPriorityStatus'};
var _user$project$FromEnglish$Pass = {ctor: 'Pass'};
var _user$project$FromEnglish$Pashmina = {ctor: 'Pashmina'};
var _user$project$FromEnglish$PartySize = {ctor: 'PartySize'};
var _user$project$FromEnglish$Participant = {ctor: 'Participant'};
var _user$project$FromEnglish$PartOfTvseries = {ctor: 'PartOfTvseries'};
var _user$project$FromEnglish$PartOfSeries = {ctor: 'PartOfSeries'};
var _user$project$FromEnglish$PartOfSeason = {ctor: 'PartOfSeason'};
var _user$project$FromEnglish$PartOfOrder = {ctor: 'PartOfOrder'};
var _user$project$FromEnglish$PartOfInvoice = {ctor: 'PartOfInvoice'};
var _user$project$FromEnglish$PartOfEpisode = {ctor: 'PartOfEpisode'};
var _user$project$FromEnglish$Parsnip = {ctor: 'Parsnip'};
var _user$project$FromEnglish$Parsley = {ctor: 'Parsley'};
var _user$project$FromEnglish$ParkingMap = {ctor: 'ParkingMap'};
var _user$project$FromEnglish$ParkingFacility = {ctor: 'ParkingFacility'};
var _user$project$FromEnglish$ParentService = {ctor: 'ParentService'};
var _user$project$FromEnglish$ParentOrganization = {ctor: 'ParentOrganization'};
var _user$project$FromEnglish$ParentItem = {ctor: 'ParentItem'};
var _user$project$FromEnglish$ParentAudience = {ctor: 'ParentAudience'};
var _user$project$FromEnglish$Parent = {ctor: 'Parent'};
var _user$project$FromEnglish$ParcelService = {ctor: 'ParcelService'};
var _user$project$FromEnglish$ParcelDelivery = {ctor: 'ParcelDelivery'};
var _user$project$FromEnglish$ParallelStrandLumber = {ctor: 'ParallelStrandLumber'};
var _user$project$FromEnglish$Paprika = {ctor: 'Paprika'};
var _user$project$FromEnglish$Paperback = {ctor: 'Paperback'};
var _user$project$FromEnglish$Palladium = {ctor: 'Palladium'};
var _user$project$FromEnglish$PaisleyUnderground = {ctor: 'PaisleyUnderground'};
var _user$project$FromEnglish$Paisley = {ctor: 'Paisley'};
var _user$project$FromEnglish$Painting = {ctor: 'Painting'};
var _user$project$FromEnglish$PaintAction = {ctor: 'PaintAction'};
var _user$project$FromEnglish$Pagination = {ctor: 'Pagination'};
var _user$project$FromEnglish$PageStart = {ctor: 'PageStart'};
var _user$project$FromEnglish$PageEnd = {ctor: 'PageEnd'};
var _user$project$FromEnglish$Paduasoy = {ctor: 'Paduasoy'};
var _user$project$FromEnglish$Paddle = {ctor: 'Paddle'};
var _user$project$FromEnglish$Oxidized = {ctor: 'Oxidized'};
var _user$project$FromEnglish$Oxford = {ctor: 'Oxford'};
var _user$project$FromEnglish$OwnershipInfo = {ctor: 'OwnershipInfo'};
var _user$project$FromEnglish$OwnedThrough = {ctor: 'OwnedThrough'};
var _user$project$FromEnglish$OwnedFrom = {ctor: 'OwnedFrom'};
var _user$project$FromEnglish$Overflow = {ctor: 'Overflow'};
var _user$project$FromEnglish$OutletStore = {ctor: 'OutletStore'};
var _user$project$FromEnglish$OutOfStock = {ctor: 'OutOfStock'};
var _user$project$FromEnglish$Ottoman = {ctor: 'Ottoman'};
var _user$project$FromEnglish$Osnaburg = {ctor: 'Osnaburg'};
var _user$project$FromEnglish$Osmium = {ctor: 'Osmium'};
var _user$project$FromEnglish$OriginAddress = {ctor: 'OriginAddress'};
var _user$project$FromEnglish$OrientedStrandBoard = {ctor: 'OrientedStrandBoard'};
var _user$project$FromEnglish$Organza = {ctor: 'Organza'};
var _user$project$FromEnglish$OrganizeAction = {ctor: 'OrganizeAction'};
var _user$project$FromEnglish$OrganizationRole = {ctor: 'OrganizationRole'};
var _user$project$FromEnglish$Organization = {ctor: 'Organization'};
var _user$project$FromEnglish$Organdy = {ctor: 'Organdy'};
var _user$project$FromEnglish$OrderedItem = {ctor: 'OrderedItem'};
var _user$project$FromEnglish$OrderStatus = {ctor: 'OrderStatus'};
var _user$project$FromEnglish$OrderReturned = {ctor: 'OrderReturned'};
var _user$project$FromEnglish$OrderQuantity = {ctor: 'OrderQuantity'};
var _user$project$FromEnglish$OrderProcessing = {ctor: 'OrderProcessing'};
var _user$project$FromEnglish$OrderProblem = {ctor: 'OrderProblem'};
var _user$project$FromEnglish$OrderPickupAvailable = {ctor: 'OrderPickupAvailable'};
var _user$project$FromEnglish$OrderPaymentDue = {ctor: 'OrderPaymentDue'};
var _user$project$FromEnglish$OrderNumber = {ctor: 'OrderNumber'};
var _user$project$FromEnglish$OrderItemStatus = {ctor: 'OrderItemStatus'};
var _user$project$FromEnglish$OrderItemNumber = {ctor: 'OrderItemNumber'};
var _user$project$FromEnglish$OrderInTransit = {ctor: 'OrderInTransit'};
var _user$project$FromEnglish$OrderDelivery = {ctor: 'OrderDelivery'};
var _user$project$FromEnglish$OrderDelivered = {ctor: 'OrderDelivered'};
var _user$project$FromEnglish$OrderDate = {ctor: 'OrderDate'};
var _user$project$FromEnglish$OrderCancelled = {ctor: 'OrderCancelled'};
var _user$project$FromEnglish$OrderAction = {ctor: 'OrderAction'};
var _user$project$FromEnglish$OrchestralUplifting = {ctor: 'OrchestralUplifting'};
var _user$project$FromEnglish$OrchestralJazz = {ctor: 'OrchestralJazz'};
var _user$project$FromEnglish$Orange = {ctor: 'Orange'};
var _user$project$FromEnglish$Opulent = {ctor: 'Opulent'};
var _user$project$FromEnglish$Option = {ctor: 'Option'};
var _user$project$FromEnglish$Opponent = {ctor: 'Opponent'};
var _user$project$FromEnglish$OperatingSystem = {ctor: 'OperatingSystem'};
var _user$project$FromEnglish$OpeningHoursSpecification = {ctor: 'OpeningHoursSpecification'};
var _user$project$FromEnglish$OpeningHours = {ctor: 'OpeningHours'};
var _user$project$FromEnglish$OnlineOnly = {ctor: 'OnlineOnly'};
var _user$project$FromEnglish$OnlineFull = {ctor: 'OnlineFull'};
var _user$project$FromEnglish$Online = {ctor: 'Online'};
var _user$project$FromEnglish$OnionPowder = {ctor: 'OnionPowder'};
var _user$project$FromEnglish$Onion = {ctor: 'Onion'};
var _user$project$FromEnglish$OnSitePickup = {ctor: 'OnSitePickup'};
var _user$project$FromEnglish$OnDemandEvent = {ctor: 'OnDemandEvent'};
var _user$project$FromEnglish$OliveOil = {ctor: 'OliveOil'};
var _user$project$FromEnglish$Olive = {ctor: 'Olive'};
var _user$project$FromEnglish$Olefin = {ctor: 'Olefin'};
var _user$project$FromEnglish$OldschoolJungle = {ctor: 'OldschoolJungle'};
var _user$project$FromEnglish$OldBaySeasoning = {ctor: 'OldBaySeasoning'};
var _user$project$FromEnglish$Okra = {ctor: 'Okra'};
var _user$project$FromEnglish$Oilskin = {ctor: 'Oilskin'};
var _user$project$FromEnglish$OfflineTemporarily = {ctor: 'OfflineTemporarily'};
var _user$project$FromEnglish$OfflinePermanently = {ctor: 'OfflinePermanently'};
var _user$project$FromEnglish$OfficeEquipmentStore = {ctor: 'OfficeEquipmentStore'};
var _user$project$FromEnglish$OfferItemCondition = {ctor: 'OfferItemCondition'};
var _user$project$FromEnglish$OfferCount = {ctor: 'OfferCount'};
var _user$project$FromEnglish$OfferCatalog = {ctor: 'OfferCatalog'};
var _user$project$FromEnglish$OceanBodyOfWater = {ctor: 'OceanBodyOfWater'};
var _user$project$FromEnglish$OccupationalCategory = {ctor: 'OccupationalCategory'};
var _user$project$FromEnglish$Occupancy = {ctor: 'Occupancy'};
var _user$project$FromEnglish$Obtain = {ctor: 'Obtain'};
var _user$project$FromEnglish$Observe = {ctor: 'Observe'};
var _user$project$FromEnglish$Object = {ctor: 'Object'};
var _user$project$FromEnglish$Oaked = {ctor: 'Oaked'};
var _user$project$FromEnglish$Nylon = {ctor: 'Nylon'};
var _user$project$FromEnglish$NutritionalYeast = {ctor: 'NutritionalYeast'};
var _user$project$FromEnglish$NutritionInformation = {ctor: 'NutritionInformation'};
var _user$project$FromEnglish$Nutrition = {ctor: 'Nutrition'};
var _user$project$FromEnglish$Nutmeg = {ctor: 'Nutmeg'};
var _user$project$FromEnglish$Nut = {ctor: 'Nut'};
var _user$project$FromEnglish$NumberedPosition = {ctor: 'NumberedPosition'};
var _user$project$FromEnglish$NumberOfSeasons = {ctor: 'NumberOfSeasons'};
var _user$project$FromEnglish$NumberOfRooms = {ctor: 'NumberOfRooms'};
var _user$project$FromEnglish$NumberOfPreviousOwners = {ctor: 'NumberOfPreviousOwners'};
var _user$project$FromEnglish$NumberOfPlayers = {ctor: 'NumberOfPlayers'};
var _user$project$FromEnglish$NumberOfPages = {ctor: 'NumberOfPages'};
var _user$project$FromEnglish$NumberOfItems = {ctor: 'NumberOfItems'};
var _user$project$FromEnglish$NumberOfForwardGears = {ctor: 'NumberOfForwardGears'};
var _user$project$FromEnglish$NumberOfEpisodes = {ctor: 'NumberOfEpisodes'};
var _user$project$FromEnglish$NumberOfEmployees = {ctor: 'NumberOfEmployees'};
var _user$project$FromEnglish$NumberOfDoors = {ctor: 'NumberOfDoors'};
var _user$project$FromEnglish$NumberOfBeds = {ctor: 'NumberOfBeds'};
var _user$project$FromEnglish$NumberOfAxles = {ctor: 'NumberOfAxles'};
var _user$project$FromEnglish$NumberOfAirbags = {ctor: 'NumberOfAirbags'};
var _user$project$FromEnglish$Number = {ctor: 'Number'};
var _user$project$FromEnglish$NumChildren = {ctor: 'NumChildren'};
var _user$project$FromEnglish$NumAdults = {ctor: 'NumAdults'};
var _user$project$FromEnglish$Null = {ctor: 'Null'};
var _user$project$FromEnglish$NuSkoolBreaks = {ctor: 'NuSkoolBreaks'};
var _user$project$FromEnglish$NuMetal = {ctor: 'NuMetal'};
var _user$project$FromEnglish$NuJazz = {ctor: 'NuJazz'};
var _user$project$FromEnglish$NuDisco = {ctor: 'NuDisco'};
var _user$project$FromEnglish$NoveltyRagtime = {ctor: 'NoveltyRagtime'};
var _user$project$FromEnglish$Notice = {ctor: 'Notice'};
var _user$project$FromEnglish$NoteDigitalDocument = {ctor: 'NoteDigitalDocument'};
var _user$project$FromEnglish$Note = {ctor: 'Note'};
var _user$project$FromEnglish$Notary = {ctor: 'Notary'};
var _user$project$FromEnglish$NonEqual = {ctor: 'NonEqual'};
var _user$project$FromEnglish$NoiseRock = {ctor: 'NoiseRock'};
var _user$project$FromEnglish$NoisePop = {ctor: 'NoisePop'};
var _user$project$FromEnglish$Nobelium = {ctor: 'Nobelium'};
var _user$project$FromEnglish$Niobium = {ctor: 'Niobium'};
var _user$project$FromEnglish$Ninon = {ctor: 'Ninon'};
var _user$project$FromEnglish$NightClub = {ctor: 'NightClub'};
var _user$project$FromEnglish$NigellaSativa = {ctor: 'NigellaSativa'};
var _user$project$FromEnglish$Nigella = {ctor: 'Nigella'};
var _user$project$FromEnglish$Nickel = {ctor: 'Nickel'};
var _user$project$FromEnglish$Ngo = {ctor: 'Ngo'};
var _user$project$FromEnglish$NextItem = {ctor: 'NextItem'};
var _user$project$FromEnglish$NewsArticle = {ctor: 'NewsArticle'};
var _user$project$FromEnglish$NewZealandSpinach = {ctor: 'NewZealandSpinach'};
var _user$project$FromEnglish$NewWave = {ctor: 'NewWave'};
var _user$project$FromEnglish$NewRave = {ctor: 'NewRave'};
var _user$project$FromEnglish$NewProg = {ctor: 'NewProg'};
var _user$project$FromEnglish$NewCondition = {ctor: 'NewCondition'};
var _user$project$FromEnglish$NewBeat = {ctor: 'NewBeat'};
var _user$project$FromEnglish$NewAge = {ctor: 'NewAge'};
var _user$project$FromEnglish$NetWorth = {ctor: 'NetWorth'};
var _user$project$FromEnglish$Nest = {ctor: 'Nest'};
var _user$project$FromEnglish$Neptunium = {ctor: 'Neptunium'};
var _user$project$FromEnglish$Neodymium = {ctor: 'Neodymium'};
var _user$project$FromEnglish$NeoSwing = {ctor: 'NeoSwing'};
var _user$project$FromEnglish$NeoPsychedelia = {ctor: 'NeoPsychedelia'};
var _user$project$FromEnglish$NeoBopJazz = {ctor: 'NeoBopJazz'};
var _user$project$FromEnglish$Need = {ctor: 'Need'};
var _user$project$FromEnglish$Nectarine = {ctor: 'Nectarine'};
var _user$project$FromEnglish$NavyBean = {ctor: 'NavyBean'};
var _user$project$FromEnglish$Nationality = {ctor: 'Nationality'};
var _user$project$FromEnglish$Nankeen = {ctor: 'Nankeen'};
var _user$project$FromEnglish$NamedPosition = {ctor: 'NamedPosition'};
var _user$project$FromEnglish$Nainsook = {ctor: 'Nainsook'};
var _user$project$FromEnglish$NailSalon = {ctor: 'NailSalon'};
var _user$project$FromEnglish$Musty = {ctor: 'Musty'};
var _user$project$FromEnglish$MustardOil = {ctor: 'MustardOil'};
var _user$project$FromEnglish$MustardGreen = {ctor: 'MustardGreen'};
var _user$project$FromEnglish$Mustard = {ctor: 'Mustard'};
var _user$project$FromEnglish$Muslin = {ctor: 'Muslin'};
var _user$project$FromEnglish$MusicalKey = {ctor: 'MusicalKey'};
var _user$project$FromEnglish$MusicVideoObject = {ctor: 'MusicVideoObject'};
var _user$project$FromEnglish$MusicVenue = {ctor: 'MusicVenue'};
var _user$project$FromEnglish$MusicStore = {ctor: 'MusicStore'};
var _user$project$FromEnglish$MusicReleaseFormatType = {ctor: 'MusicReleaseFormatType'};
var _user$project$FromEnglish$MusicReleaseFormat = {ctor: 'MusicReleaseFormat'};
var _user$project$FromEnglish$MusicRelease = {ctor: 'MusicRelease'};
var _user$project$FromEnglish$MusicRecording = {ctor: 'MusicRecording'};
var _user$project$FromEnglish$MusicPlaylist = {ctor: 'MusicPlaylist'};
var _user$project$FromEnglish$MusicGroupMember = {ctor: 'MusicGroupMember'};
var _user$project$FromEnglish$MusicGroup = {ctor: 'MusicGroup'};
var _user$project$FromEnglish$MusicEvent = {ctor: 'MusicEvent'};
var _user$project$FromEnglish$MusicCompositionForm = {ctor: 'MusicCompositionForm'};
var _user$project$FromEnglish$MusicComposition = {ctor: 'MusicComposition'};
var _user$project$FromEnglish$MusicBy = {ctor: 'MusicBy'};
var _user$project$FromEnglish$MusicArrangement = {ctor: 'MusicArrangement'};
var _user$project$FromEnglish$MusicAlbumReleaseType = {ctor: 'MusicAlbumReleaseType'};
var _user$project$FromEnglish$MusicAlbumProductionType = {ctor: 'MusicAlbumProductionType'};
var _user$project$FromEnglish$MusicAlbum = {ctor: 'MusicAlbum'};
var _user$project$FromEnglish$MushroomKetchup = {ctor: 'MushroomKetchup'};
var _user$project$FromEnglish$Mushroom = {ctor: 'Mushroom'};
var _user$project$FromEnglish$Museum = {ctor: 'Museum'};
var _user$project$FromEnglish$Murder = {ctor: 'Murder'};
var _user$project$FromEnglish$MungBean = {ctor: 'MungBean'};
var _user$project$FromEnglish$MumboSauce = {ctor: 'MumboSauce'};
var _user$project$FromEnglish$Multiply = {ctor: 'Multiply'};
var _user$project$FromEnglish$MultipleValues = {ctor: 'MultipleValues'};
var _user$project$FromEnglish$MullingSpices = {ctor: 'MullingSpices'};
var _user$project$FromEnglish$Mulberry = {ctor: 'Mulberry'};
var _user$project$FromEnglish$Mugwort = {ctor: 'Mugwort'};
var _user$project$FromEnglish$Muddle = {ctor: 'Muddle'};
var _user$project$FromEnglish$Mud = {ctor: 'Mud'};
var _user$project$FromEnglish$MovingCompany = {ctor: 'MovingCompany'};
var _user$project$FromEnglish$MovieTheater = {ctor: 'MovieTheater'};
var _user$project$FromEnglish$MovieSeries = {ctor: 'MovieSeries'};
var _user$project$FromEnglish$MovieRentalStore = {ctor: 'MovieRentalStore'};
var _user$project$FromEnglish$MovieClip = {ctor: 'MovieClip'};
var _user$project$FromEnglish$Movie = {ctor: 'Movie'};
var _user$project$FromEnglish$MoveAction = {ctor: 'MoveAction'};
var _user$project$FromEnglish$Move = {ctor: 'Move'};
var _user$project$FromEnglish$Mourn = {ctor: 'Mourn'};
var _user$project$FromEnglish$Mountain = {ctor: 'Mountain'};
var _user$project$FromEnglish$MotorcycleRepair = {ctor: 'MotorcycleRepair'};
var _user$project$FromEnglish$MotorcycleDealer = {ctor: 'MotorcycleDealer'};
var _user$project$FromEnglish$Motel = {ctor: 'Motel'};
var _user$project$FromEnglish$Mosque = {ctor: 'Mosque'};
var _user$project$FromEnglish$Moquette = {ctor: 'Moquette'};
var _user$project$FromEnglish$MontrealSteakSeasoning = {ctor: 'MontrealSteakSeasoning'};
var _user$project$FromEnglish$MonkeyGlandSauce = {ctor: 'MonkeyGlandSauce'};
var _user$project$FromEnglish$MonetaryAmount = {ctor: 'MonetaryAmount'};
var _user$project$FromEnglish$Monday = {ctor: 'Monday'};
var _user$project$FromEnglish$Molybdenum = {ctor: 'Molybdenum'};
var _user$project$FromEnglish$Moleskin = {ctor: 'Moleskin'};
var _user$project$FromEnglish$ModifiedTime = {ctor: 'ModifiedTime'};
var _user$project$FromEnglish$Model = {ctor: 'Model'};
var _user$project$FromEnglish$ModalJazz = {ctor: 'ModalJazz'};
var _user$project$FromEnglish$MobilePhoneStore = {ctor: 'MobilePhoneStore'};
var _user$project$FromEnglish$MobileApplication = {ctor: 'MobileApplication'};
var _user$project$FromEnglish$Moan = {ctor: 'Moan'};
var _user$project$FromEnglish$MixtapeAlbum = {ctor: 'MixtapeAlbum'};
var _user$project$FromEnglish$MixedSpice = {ctor: 'MixedSpice'};
var _user$project$FromEnglish$Mix = {ctor: 'Mix'};
var _user$project$FromEnglish$Miss = {ctor: 'Miss'};
var _user$project$FromEnglish$Mint = {ctor: 'Mint'};
var _user$project$FromEnglish$MinimumPaymentDue = {ctor: 'MinimumPaymentDue'};
var _user$project$FromEnglish$MinValue = {ctor: 'MinValue'};
var _user$project$FromEnglish$MinPrice = {ctor: 'MinPrice'};
var _user$project$FromEnglish$Milk = {ctor: 'Milk'};
var _user$project$FromEnglish$MileageFromOdometer = {ctor: 'MileageFromOdometer'};
var _user$project$FromEnglish$MignonetteSauce = {ctor: 'MignonetteSauce'};
var _user$project$FromEnglish$MiddleSchool = {ctor: 'MiddleSchool'};
var _user$project$FromEnglish$Microhouse = {ctor: 'Microhouse'};
var _user$project$FromEnglish$Microfiber = {ctor: 'Microfiber'};
var _user$project$FromEnglish$MessageAttachment = {ctor: 'MessageAttachment'};
var _user$project$FromEnglish$Message = {ctor: 'Message'};
var _user$project$FromEnglish$MessUp = {ctor: 'MessUp'};
var _user$project$FromEnglish$Mesh = {ctor: 'Mesh'};
var _user$project$FromEnglish$Mercury = {ctor: 'Mercury'};
var _user$project$FromEnglish$Merchant = {ctor: 'Merchant'};
var _user$project$FromEnglish$MenuSection = {ctor: 'MenuSection'};
var _user$project$FromEnglish$MenuItem = {ctor: 'MenuItem'};
var _user$project$FromEnglish$Menu = {ctor: 'Menu'};
var _user$project$FromEnglish$Mentions = {ctor: 'Mentions'};
var _user$project$FromEnglish$MensClothingStore = {ctor: 'MensClothingStore'};
var _user$project$FromEnglish$Mendelevium = {ctor: 'Mendelevium'};
var _user$project$FromEnglish$MemoryRequirements = {ctor: 'MemoryRequirements'};
var _user$project$FromEnglish$Memorise = {ctor: 'Memorise'};
var _user$project$FromEnglish$MembershipNumber = {ctor: 'MembershipNumber'};
var _user$project$FromEnglish$Members = {ctor: 'Members'};
var _user$project$FromEnglish$MemberOf = {ctor: 'MemberOf'};
var _user$project$FromEnglish$Member = {ctor: 'Member'};
var _user$project$FromEnglish$Melt = {ctor: 'Melt'};
var _user$project$FromEnglish$MelodicDeathMetal = {ctor: 'MelodicDeathMetal'};
var _user$project$FromEnglish$Meitnerium = {ctor: 'Meitnerium'};
var _user$project$FromEnglish$MedievalMetal = {ctor: 'MedievalMetal'};
var _user$project$FromEnglish$MedicalOrganization = {ctor: 'MedicalOrganization'};
var _user$project$FromEnglish$MediaObject = {ctor: 'MediaObject'};
var _user$project$FromEnglish$MealService = {ctor: 'MealService'};
var _user$project$FromEnglish$Mayonnaise = {ctor: 'Mayonnaise'};
var _user$project$FromEnglish$MaximumAttendeeCapacity = {ctor: 'MaximumAttendeeCapacity'};
var _user$project$FromEnglish$MaxValue = {ctor: 'MaxValue'};
var _user$project$FromEnglish$MaxPrice = {ctor: 'MaxPrice'};
var _user$project$FromEnglish$Matter = {ctor: 'Matter'};
var _user$project$FromEnglish$MathRock = {ctor: 'MathRock'};
var _user$project$FromEnglish$Material = {ctor: 'Material'};
var _user$project$FromEnglish$Match = {ctor: 'Match'};
var _user$project$FromEnglish$Mastic = {ctor: 'Mastic'};
var _user$project$FromEnglish$MarryAction = {ctor: 'MarryAction'};
var _user$project$FromEnglish$Marjoram = {ctor: 'Marjoram'};
var _user$project$FromEnglish$MapType = {ctor: 'MapType'};
var _user$project$FromEnglish$MapCategoryType = {ctor: 'MapCategoryType'};
var _user$project$FromEnglish$Manufacturer = {ctor: 'Manufacturer'};
var _user$project$FromEnglish$MangoPickle = {ctor: 'MangoPickle'};
var _user$project$FromEnglish$MangoGinger = {ctor: 'MangoGinger'};
var _user$project$FromEnglish$Mangetout = {ctor: 'Mangetout'};
var _user$project$FromEnglish$Manganese = {ctor: 'Manganese'};
var _user$project$FromEnglish$Mandarine = {ctor: 'Mandarine'};
var _user$project$FromEnglish$Manage = {ctor: 'Manage'};
var _user$project$FromEnglish$Mamey = {ctor: 'Mamey'};
var _user$project$FromEnglish$Male = {ctor: 'Male'};
var _user$project$FromEnglish$MakesOffer = {ctor: 'MakesOffer'};
var _user$project$FromEnglish$MainstreamJazz = {ctor: 'MainstreamJazz'};
var _user$project$FromEnglish$MainEntityOfPage = {ctor: 'MainEntityOfPage'};
var _user$project$FromEnglish$MainEntity = {ctor: 'MainEntity'};
var _user$project$FromEnglish$MainContentOfPage = {ctor: 'MainContentOfPage'};
var _user$project$FromEnglish$Magnesium = {ctor: 'Magnesium'};
var _user$project$FromEnglish$Madras = {ctor: 'Madras'};
var _user$project$FromEnglish$MachineKnitting = {ctor: 'MachineKnitting'};
var _user$project$FromEnglish$Lyrics = {ctor: 'Lyrics'};
var _user$project$FromEnglish$Lyricist = {ctor: 'Lyricist'};
var _user$project$FromEnglish$Lychee = {ctor: 'Lychee'};
var _user$project$FromEnglish$Lutetium = {ctor: 'Lutetium'};
var _user$project$FromEnglish$LowSaltDiet = {ctor: 'LowSaltDiet'};
var _user$project$FromEnglish$LowPrice = {ctor: 'LowPrice'};
var _user$project$FromEnglish$LowLactoseDiet = {ctor: 'LowLactoseDiet'};
var _user$project$FromEnglish$LowFatDiet = {ctor: 'LowFatDiet'};
var _user$project$FromEnglish$LowCalorieDiet = {ctor: 'LowCalorieDiet'};
var _user$project$FromEnglish$Love = {ctor: 'Love'};
var _user$project$FromEnglish$Lovage = {ctor: 'Lovage'};
var _user$project$FromEnglish$Loser = {ctor: 'Loser'};
var _user$project$FromEnglish$LoseAction = {ctor: 'LoseAction'};
var _user$project$FromEnglish$Loquat = {ctor: 'Loquat'};
var _user$project$FromEnglish$Look = {ctor: 'Look'};
var _user$project$FromEnglish$Longitude = {ctor: 'Longitude'};
var _user$project$FromEnglish$LongPepper = {ctor: 'LongPepper'};
var _user$project$FromEnglish$LodgingUnitType = {ctor: 'LodgingUnitType'};
var _user$project$FromEnglish$LodgingUnitDescription = {ctor: 'LodgingUnitDescription'};
var _user$project$FromEnglish$LodgingReservation = {ctor: 'LodgingReservation'};
var _user$project$FromEnglish$LodgingBusiness = {ctor: 'LodgingBusiness'};
var _user$project$FromEnglish$Loden = {ctor: 'Loden'};
var _user$project$FromEnglish$Locksmith = {ctor: 'Locksmith'};
var _user$project$FromEnglish$LockerDelivery = {ctor: 'LockerDelivery'};
var _user$project$FromEnglish$LocationFeatureSpecification = {ctor: 'LocationFeatureSpecification'};
var _user$project$FromEnglish$LocationCreated = {ctor: 'LocationCreated'};
var _user$project$FromEnglish$Location = {ctor: 'Location'};
var _user$project$FromEnglish$LocalBusiness = {ctor: 'LocalBusiness'};
var _user$project$FromEnglish$LoanTerm = {ctor: 'LoanTerm'};
var _user$project$FromEnglish$LoanOrCredit = {ctor: 'LoanOrCredit'};
var _user$project$FromEnglish$Load = {ctor: 'Load'};
var _user$project$FromEnglish$LiveBlogUpdate = {ctor: 'LiveBlogUpdate'};
var _user$project$FromEnglish$LiveBlogPosting = {ctor: 'LiveBlogPosting'};
var _user$project$FromEnglish$LiveAlbum = {ctor: 'LiveAlbum'};
var _user$project$FromEnglish$Lithium = {ctor: 'Lithium'};
var _user$project$FromEnglish$LiteraryEvent = {ctor: 'LiteraryEvent'};
var _user$project$FromEnglish$ListenAction = {ctor: 'ListenAction'};
var _user$project$FromEnglish$Listen = {ctor: 'Listen'};
var _user$project$FromEnglish$ListItem = {ctor: 'ListItem'};
var _user$project$FromEnglish$List = {ctor: 'List'};
var _user$project$FromEnglish$Liquorice = {ctor: 'Liquorice'};
var _user$project$FromEnglish$LiquorStore = {ctor: 'LiquorStore'};
var _user$project$FromEnglish$LiquidFunk = {ctor: 'LiquidFunk'};
var _user$project$FromEnglish$Linen = {ctor: 'Linen'};
var _user$project$FromEnglish$LimitedAvailability = {ctor: 'LimitedAvailability'};
var _user$project$FromEnglish$Lime = {ctor: 'Lime'};
var _user$project$FromEnglish$LimaBean = {ctor: 'LimaBean'};
var _user$project$FromEnglish$LikeAction = {ctor: 'LikeAction'};
var _user$project$FromEnglish$Lighten = {ctor: 'Lighten'};
var _user$project$FromEnglish$License = {ctor: 'License'};
var _user$project$FromEnglish$Library = {ctor: 'Library'};
var _user$project$FromEnglish$Lettuce = {ctor: 'Lettuce'};
var _user$project$FromEnglish$LesserOrEqual = {ctor: 'LesserOrEqual'};
var _user$project$FromEnglish$LesserGalangal = {ctor: 'LesserGalangal'};
var _user$project$FromEnglish$Lesser = {ctor: 'Lesser'};
var _user$project$FromEnglish$Lentils = {ctor: 'Lentils'};
var _user$project$FromEnglish$Lender = {ctor: 'Lender'};
var _user$project$FromEnglish$LendAction = {ctor: 'LendAction'};
var _user$project$FromEnglish$LemonVerbena = {ctor: 'LemonVerbena'};
var _user$project$FromEnglish$LemonPepper = {ctor: 'LemonPepper'};
var _user$project$FromEnglish$LemonMyrtle = {ctor: 'LemonMyrtle'};
var _user$project$FromEnglish$LemonGrass = {ctor: 'LemonGrass'};
var _user$project$FromEnglish$LemonBalm = {ctor: 'LemonBalm'};
var _user$project$FromEnglish$Lemon = {ctor: 'Lemon'};
var _user$project$FromEnglish$LeiCode = {ctor: 'LeiCode'};
var _user$project$FromEnglish$Legume = {ctor: 'Legume'};
var _user$project$FromEnglish$LegislativeBuilding = {ctor: 'LegislativeBuilding'};
var _user$project$FromEnglish$LegalService = {ctor: 'LegalService'};
var _user$project$FromEnglish$LegalName = {ctor: 'LegalName'};
var _user$project$FromEnglish$LeftHandDriving = {ctor: 'LeftHandDriving'};
var _user$project$FromEnglish$LeaveAction = {ctor: 'LeaveAction'};
var _user$project$FromEnglish$Leathery = {ctor: 'Leathery'};
var _user$project$FromEnglish$LearningResourceType = {ctor: 'LearningResourceType'};
var _user$project$FromEnglish$Learn = {ctor: 'Learn'};
var _user$project$FromEnglish$Lawrencium = {ctor: 'Lawrencium'};
var _user$project$FromEnglish$Lavender = {ctor: 'Lavender'};
var _user$project$FromEnglish$Launch = {ctor: 'Launch'};
var _user$project$FromEnglish$Laugh = {ctor: 'Laugh'};
var _user$project$FromEnglish$Latitude = {ctor: 'Latitude'};
var _user$project$FromEnglish$LatinJazz = {ctor: 'LatinJazz'};
var _user$project$FromEnglish$LatinHouse = {ctor: 'LatinHouse'};
var _user$project$FromEnglish$LastReviewed = {ctor: 'LastReviewed'};
var _user$project$FromEnglish$LaserLike = {ctor: 'LaserLike'};
var _user$project$FromEnglish$LaserDiscFormat = {ctor: 'LaserDiscFormat'};
var _user$project$FromEnglish$Lanthanum = {ctor: 'Lanthanum'};
var _user$project$FromEnglish$Language = {ctor: 'Language'};
var _user$project$FromEnglish$LandmarksOrHistoricalBuildings = {ctor: 'LandmarksOrHistoricalBuildings'};
var _user$project$FromEnglish$Landlord = {ctor: 'Landlord'};
var _user$project$FromEnglish$Landform = {ctor: 'Landform'};
var _user$project$FromEnglish$Lampas = {ctor: 'Lampas'};
var _user$project$FromEnglish$LakeBodyOfWater = {ctor: 'LakeBodyOfWater'};
var _user$project$FromEnglish$Label = {ctor: 'Label'};
var _user$project$FromEnglish$Kumquat = {ctor: 'Kumquat'};
var _user$project$FromEnglish$Krautrock = {ctor: 'Krautrock'};
var _user$project$FromEnglish$KosherDiet = {ctor: 'KosherDiet'};
var _user$project$FromEnglish$Kohlrabi = {ctor: 'Kohlrabi'};
var _user$project$FromEnglish$KnownVehicleDamages = {ctor: 'KnownVehicleDamages'};
var _user$project$FromEnglish$Knock = {ctor: 'Knock'};
var _user$project$FromEnglish$Kneel = {ctor: 'Kneel'};
var _user$project$FromEnglish$KiwiFruit = {ctor: 'KiwiFruit'};
var _user$project$FromEnglish$Kiss = {ctor: 'Kiss'};
var _user$project$FromEnglish$Kimchi = {ctor: 'Kimchi'};
var _user$project$FromEnglish$Kill = {ctor: 'Kill'};
var _user$project$FromEnglish$KidneyBean = {ctor: 'KidneyBean'};
var _user$project$FromEnglish$Kick = {ctor: 'Kick'};
var _user$project$FromEnglish$KhakiDrill = {ctor: 'KhakiDrill'};
var _user$project$FromEnglish$Keywords = {ctor: 'Keywords'};
var _user$project$FromEnglish$Kevlar = {ctor: 'Kevlar'};
var _user$project$FromEnglish$Ketchup = {ctor: 'Ketchup'};
var _user$project$FromEnglish$Kerseymere = {ctor: 'Kerseymere'};
var _user$project$FromEnglish$KenteCloth = {ctor: 'KenteCloth'};
var _user$project$FromEnglish$JuniperBerry = {ctor: 'JuniperBerry'};
var _user$project$FromEnglish$JumpUp = {ctor: 'JumpUp'};
var _user$project$FromEnglish$Jujube = {ctor: 'Jujube'};
var _user$project$FromEnglish$Juicy = {ctor: 'Juicy'};
var _user$project$FromEnglish$Judge = {ctor: 'Judge'};
var _user$project$FromEnglish$JoinAction = {ctor: 'JoinAction'};
var _user$project$FromEnglish$JobTitle = {ctor: 'JobTitle'};
var _user$project$FromEnglish$JobPosting = {ctor: 'JobPosting'};
var _user$project$FromEnglish$JobLocation = {ctor: 'JobLocation'};
var _user$project$FromEnglish$JobBenefits = {ctor: 'JobBenefits'};
var _user$project$FromEnglish$Jicama = {ctor: 'Jicama'};
var _user$project$FromEnglish$JewelryStore = {ctor: 'JewelryStore'};
var _user$project$FromEnglish$JerusalemArtichoke = {ctor: 'JerusalemArtichoke'};
var _user$project$FromEnglish$JazzRock = {ctor: 'JazzRock'};
var _user$project$FromEnglish$JazzRap = {ctor: 'JazzRap'};
var _user$project$FromEnglish$JazzFusion = {ctor: 'JazzFusion'};
var _user$project$FromEnglish$JazzFunk = {ctor: 'JazzFunk'};
var _user$project$FromEnglish$JazzBlues = {ctor: 'JazzBlues'};
var _user$project$FromEnglish$JamaicanJerkSpice = {ctor: 'JamaicanJerkSpice'};
var _user$project$FromEnglish$Jalapeno = {ctor: 'Jalapeno'};
var _user$project$FromEnglish$Jackfruit = {ctor: 'Jackfruit'};
var _user$project$FromEnglish$ItemShipped = {ctor: 'ItemShipped'};
var _user$project$FromEnglish$ItemReviewed = {ctor: 'ItemReviewed'};
var _user$project$FromEnglish$ItemPage = {ctor: 'ItemPage'};
var _user$project$FromEnglish$ItemOffered = {ctor: 'ItemOffered'};
var _user$project$FromEnglish$ItemListUnordered = {ctor: 'ItemListUnordered'};
var _user$project$FromEnglish$ItemListOrderType = {ctor: 'ItemListOrderType'};
var _user$project$FromEnglish$ItemListOrderDescending = {ctor: 'ItemListOrderDescending'};
var _user$project$FromEnglish$ItemListOrderAscending = {ctor: 'ItemListOrderAscending'};
var _user$project$FromEnglish$ItemListOrder = {ctor: 'ItemListOrder'};
var _user$project$FromEnglish$ItemListElement = {ctor: 'ItemListElement'};
var _user$project$FromEnglish$ItemList = {ctor: 'ItemList'};
var _user$project$FromEnglish$ItemCondition = {ctor: 'ItemCondition'};
var _user$project$FromEnglish$ItemAvailability = {ctor: 'ItemAvailability'};
var _user$project$FromEnglish$ItaloHouse = {ctor: 'ItaloHouse'};
var _user$project$FromEnglish$ItaloDisco = {ctor: 'ItaloDisco'};
var _user$project$FromEnglish$ItaloDance = {ctor: 'ItaloDance'};
var _user$project$FromEnglish$IssuedThrough = {ctor: 'IssuedThrough'};
var _user$project$FromEnglish$IssuedBy = {ctor: 'IssuedBy'};
var _user$project$FromEnglish$IssueNumber = {ctor: 'IssueNumber'};
var _user$project$FromEnglish$IsVariantOf = {ctor: 'IsVariantOf'};
var _user$project$FromEnglish$IsSimilarTo = {ctor: 'IsSimilarTo'};
var _user$project$FromEnglish$IsRelatedTo = {ctor: 'IsRelatedTo'};
var _user$project$FromEnglish$IsPartOf = {ctor: 'IsPartOf'};
var _user$project$FromEnglish$IsLiveBroadcast = {ctor: 'IsLiveBroadcast'};
var _user$project$FromEnglish$IsGift = {ctor: 'IsGift'};
var _user$project$FromEnglish$IsFamilyFriendly = {ctor: 'IsFamilyFriendly'};
var _user$project$FromEnglish$IsConsumableFor = {ctor: 'IsConsumableFor'};
var _user$project$FromEnglish$IsBasedOnUrl = {ctor: 'IsBasedOnUrl'};
var _user$project$FromEnglish$IsBasedOn = {ctor: 'IsBasedOn'};
var _user$project$FromEnglish$IsAccessoryOrSparePartFor = {ctor: 'IsAccessoryOrSparePartFor'};
var _user$project$FromEnglish$IsAccessibleForFree = {ctor: 'IsAccessibleForFree'};
var _user$project$FromEnglish$Irritate = {ctor: 'Irritate'};
var _user$project$FromEnglish$IrishLinen = {ctor: 'IrishLinen'};
var _user$project$FromEnglish$Invoice = {ctor: 'Invoice'};
var _user$project$FromEnglish$InviteAction = {ctor: 'InviteAction'};
var _user$project$FromEnglish$Invite = {ctor: 'Invite'};
var _user$project$FromEnglish$InvestmentOrDeposit = {ctor: 'InvestmentOrDeposit'};
var _user$project$FromEnglish$InventoryLevel = {ctor: 'InventoryLevel'};
var _user$project$FromEnglish$Invent = {ctor: 'Invent'};
var _user$project$FromEnglish$Introduce = {ctor: 'Introduce'};
var _user$project$FromEnglish$Interrupt = {ctor: 'Interrupt'};
var _user$project$FromEnglish$InternetCafe = {ctor: 'InternetCafe'};
var _user$project$FromEnglish$Interfere = {ctor: 'Interfere'};
var _user$project$FromEnglish$InterestRate = {ctor: 'InterestRate'};
var _user$project$FromEnglish$Interest = {ctor: 'Interest'};
var _user$project$FromEnglish$InteractivityType = {ctor: 'InteractivityType'};
var _user$project$FromEnglish$InteractionType = {ctor: 'InteractionType'};
var _user$project$FromEnglish$InteractionStatistic = {ctor: 'InteractionStatistic'};
var _user$project$FromEnglish$InteractionService = {ctor: 'InteractionService'};
var _user$project$FromEnglish$InteractionCounter = {ctor: 'InteractionCounter'};
var _user$project$FromEnglish$InteractAction = {ctor: 'InteractAction'};
var _user$project$FromEnglish$Intend = {ctor: 'Intend'};
var _user$project$FromEnglish$IntelligentDrumAndBass = {ctor: 'IntelligentDrumAndBass'};
var _user$project$FromEnglish$IntellectuallySatisfying = {ctor: 'IntellectuallySatisfying'};
var _user$project$FromEnglish$Integer = {ctor: 'Integer'};
var _user$project$FromEnglish$Intangible = {ctor: 'Intangible'};
var _user$project$FromEnglish$InsuranceAgency = {ctor: 'InsuranceAgency'};
var _user$project$FromEnglish$Instrument = {ctor: 'Instrument'};
var _user$project$FromEnglish$Instructor = {ctor: 'Instructor'};
var _user$project$FromEnglish$InstallUrl = {ctor: 'InstallUrl'};
var _user$project$FromEnglish$InstallAction = {ctor: 'InstallAction'};
var _user$project$FromEnglish$InsertAction = {ctor: 'InsertAction'};
var _user$project$FromEnglish$Injure = {ctor: 'Injure'};
var _user$project$FromEnglish$Inject = {ctor: 'Inject'};
var _user$project$FromEnglish$Ingredients = {ctor: 'Ingredients'};
var _user$project$FromEnglish$InformAction = {ctor: 'InformAction'};
var _user$project$FromEnglish$Inform = {ctor: 'Inform'};
var _user$project$FromEnglish$Influence = {ctor: 'Influence'};
var _user$project$FromEnglish$IneligibleRegion = {ctor: 'IneligibleRegion'};
var _user$project$FromEnglish$Industry = {ctor: 'Industry'};
var _user$project$FromEnglish$IndustrialRock = {ctor: 'IndustrialRock'};
var _user$project$FromEnglish$IndustrialMetal = {ctor: 'IndustrialMetal'};
var _user$project$FromEnglish$IndustrialFolk = {ctor: 'IndustrialFolk'};
var _user$project$FromEnglish$Industrial = {ctor: 'Industrial'};
var _user$project$FromEnglish$IndividualProduct = {ctor: 'IndividualProduct'};
var _user$project$FromEnglish$Indium = {ctor: 'Indium'};
var _user$project$FromEnglish$IndieRock = {ctor: 'IndieRock'};
var _user$project$FromEnglish$IndiePop = {ctor: 'IndiePop'};
var _user$project$FromEnglish$IndieFolk = {ctor: 'IndieFolk'};
var _user$project$FromEnglish$IndianBayLeaf = {ctor: 'IndianBayLeaf'};
var _user$project$FromEnglish$Increase = {ctor: 'Increase'};
var _user$project$FromEnglish$IncludesObject = {ctor: 'IncludesObject'};
var _user$project$FromEnglish$IncludedInDataCatalog = {ctor: 'IncludedInDataCatalog'};
var _user$project$FromEnglish$IncludedDataCatalog = {ctor: 'IncludedDataCatalog'};
var _user$project$FromEnglish$IncludedComposition = {ctor: 'IncludedComposition'};
var _user$project$FromEnglish$Include = {ctor: 'Include'};
var _user$project$FromEnglish$Incentives = {ctor: 'Incentives'};
var _user$project$FromEnglish$IncentiveCompensation = {ctor: 'IncentiveCompensation'};
var _user$project$FromEnglish$InStoreOnly = {ctor: 'InStoreOnly'};
var _user$project$FromEnglish$InStock = {ctor: 'InStock'};
var _user$project$FromEnglish$InPlaylist = {ctor: 'InPlaylist'};
var _user$project$FromEnglish$InLanguage = {ctor: 'InLanguage'};
var _user$project$FromEnglish$InBroadcastLineup = {ctor: 'InBroadcastLineup'};
var _user$project$FromEnglish$Improve = {ctor: 'Improve'};
var _user$project$FromEnglish$Impress = {ctor: 'Impress'};
var _user$project$FromEnglish$Imagine = {ctor: 'Imagine'};
var _user$project$FromEnglish$ImageObject = {ctor: 'ImageObject'};
var _user$project$FromEnglish$ImageGallery = {ctor: 'ImageGallery'};
var _user$project$FromEnglish$Illustrator = {ctor: 'Illustrator'};
var _user$project$FromEnglish$IgnoreAction = {ctor: 'IgnoreAction'};
var _user$project$FromEnglish$IdliPodi = {ctor: 'IdliPodi'};
var _user$project$FromEnglish$Identify = {ctor: 'Identify'};
var _user$project$FromEnglish$IceCreamShop = {ctor: 'IceCreamShop'};
var _user$project$FromEnglish$IataCode = {ctor: 'IataCode'};
var _user$project$FromEnglish$Huckleberry = {ctor: 'Huckleberry'};
var _user$project$FromEnglish$HttpMethod = {ctor: 'HttpMethod'};
var _user$project$FromEnglish$HousePainter = {ctor: 'HousePainter'};
var _user$project$FromEnglish$HoursAvailable = {ctor: 'HoursAvailable'};
var _user$project$FromEnglish$Houndstooth = {ctor: 'Houndstooth'};
var _user$project$FromEnglish$HotelRoom = {ctor: 'HotelRoom'};
var _user$project$FromEnglish$HotSauce = {ctor: 'HotSauce'};
var _user$project$FromEnglish$HotMustard = {ctor: 'HotMustard'};
var _user$project$FromEnglish$HostingOrganization = {ctor: 'HostingOrganization'};
var _user$project$FromEnglish$Hospital = {ctor: 'Hospital'};
var _user$project$FromEnglish$Horseradish = {ctor: 'Horseradish'};
var _user$project$FromEnglish$HorrorPunk = {ctor: 'HorrorPunk'};
var _user$project$FromEnglish$HonorificSuffix = {ctor: 'HonorificSuffix'};
var _user$project$FromEnglish$HonorificPrefix = {ctor: 'HonorificPrefix'};
var _user$project$FromEnglish$Honeydew = {ctor: 'Honeydew'};
var _user$project$FromEnglish$HoneyDill = {ctor: 'HoneyDill'};
var _user$project$FromEnglish$HomeTeam = {ctor: 'HomeTeam'};
var _user$project$FromEnglish$HomeLocation = {ctor: 'HomeLocation'};
var _user$project$FromEnglish$HomeGoodsStore = {ctor: 'HomeGoodsStore'};
var _user$project$FromEnglish$HomeAndConstructionBusiness = {ctor: 'HomeAndConstructionBusiness'};
var _user$project$FromEnglish$HolyBasil = {ctor: 'HolyBasil'};
var _user$project$FromEnglish$Holmium = {ctor: 'Holmium'};
var _user$project$FromEnglish$HojaSanta = {ctor: 'HojaSanta'};
var _user$project$FromEnglish$Hodden = {ctor: 'Hodden'};
var _user$project$FromEnglish$HobbyShop = {ctor: 'HobbyShop'};
var _user$project$FromEnglish$HiringOrganization = {ctor: 'HiringOrganization'};
var _user$project$FromEnglish$HipHouse = {ctor: 'HipHouse'};
var _user$project$FromEnglish$HinduTemple = {ctor: 'HinduTemple'};
var _user$project$FromEnglish$HinduDiet = {ctor: 'HinduDiet'};
var _user$project$FromEnglish$HighSchool = {ctor: 'HighSchool'};
var _user$project$FromEnglish$HighPrice = {ctor: 'HighPrice'};
var _user$project$FromEnglish$HerbsAndSpice = {ctor: 'HerbsAndSpice'};
var _user$project$FromEnglish$HerbesDeProvence = {ctor: 'HerbesDeProvence'};
var _user$project$FromEnglish$Herbal = {ctor: 'Herbal'};
var _user$project$FromEnglish$Herbaceous = {ctor: 'Herbaceous'};
var _user$project$FromEnglish$Help = {ctor: 'Help'};
var _user$project$FromEnglish$HeavyMetal = {ctor: 'HeavyMetal'};
var _user$project$FromEnglish$HearingImpairedSupported = {ctor: 'HearingImpairedSupported'};
var _user$project$FromEnglish$HealthClub = {ctor: 'HealthClub'};
var _user$project$FromEnglish$HealthAndBeautyBusiness = {ctor: 'HealthAndBeautyBusiness'};
var _user$project$FromEnglish$Headline = {ctor: 'Headline'};
var _user$project$FromEnglish$HasPart = {ctor: 'HasPart'};
var _user$project$FromEnglish$HasOfferCatalog = {ctor: 'HasOfferCatalog'};
var _user$project$FromEnglish$HasMenuSection = {ctor: 'HasMenuSection'};
var _user$project$FromEnglish$HasMenuItem = {ctor: 'HasMenuItem'};
var _user$project$FromEnglish$HasMenu = {ctor: 'HasMenu'};
var _user$project$FromEnglish$HasMap = {ctor: 'HasMap'};
var _user$project$FromEnglish$HasDigitalDocumentPermission = {ctor: 'HasDigitalDocumentPermission'};
var _user$project$FromEnglish$HasDeliveryMethod = {ctor: 'HasDeliveryMethod'};
var _user$project$FromEnglish$HasCourseInstance = {ctor: 'HasCourseInstance'};
var _user$project$FromEnglish$HarrisTweed = {ctor: 'HarrisTweed'};
var _user$project$FromEnglish$HardwareStore = {ctor: 'HardwareStore'};
var _user$project$FromEnglish$Hardcover = {ctor: 'Hardcover'};
var _user$project$FromEnglish$HardTrance = {ctor: 'HardTrance'};
var _user$project$FromEnglish$HardRock = {ctor: 'HardRock'};
var _user$project$FromEnglish$HardDance = {ctor: 'HardDance'};
var _user$project$FromEnglish$HardBop = {ctor: 'HardBop'};
var _user$project$FromEnglish$HalalDiet = {ctor: 'HalalDiet'};
var _user$project$FromEnglish$Haircloth = {ctor: 'Haircloth'};
var _user$project$FromEnglish$Habanero = {ctor: 'Habanero'};
var _user$project$FromEnglish$GypsumBoard = {ctor: 'GypsumBoard'};
var _user$project$FromEnglish$Guava = {ctor: 'Guava'};
var _user$project$FromEnglish$Guarantee = {ctor: 'Guarantee'};
var _user$project$FromEnglish$Guacamole = {ctor: 'Guacamole'};
var _user$project$FromEnglish$GroupBoardingPolicy = {ctor: 'GroupBoardingPolicy'};
var _user$project$FromEnglish$Grosgrain = {ctor: 'Grosgrain'};
var _user$project$FromEnglish$GrooveMetal = {ctor: 'GrooveMetal'};
var _user$project$FromEnglish$GroceryStore = {ctor: 'GroceryStore'};
var _user$project$FromEnglish$GrenfellCloth = {ctor: 'GrenfellCloth'};
var _user$project$FromEnglish$Grenadine = {ctor: 'Grenadine'};
var _user$project$FromEnglish$GreenPeppercorn = {ctor: 'GreenPeppercorn'};
var _user$project$FromEnglish$GreenPepper = {ctor: 'GreenPepper'};
var _user$project$FromEnglish$GreenBean = {ctor: 'GreenBean'};
var _user$project$FromEnglish$GreaterOrEqual = {ctor: 'GreaterOrEqual'};
var _user$project$FromEnglish$GreaterGalangal = {ctor: 'GreaterGalangal'};
var _user$project$FromEnglish$Gravel = {ctor: 'Gravel'};
var _user$project$FromEnglish$Grapefruit = {ctor: 'Grapefruit'};
var _user$project$FromEnglish$GrainsOfSelim = {ctor: 'GrainsOfSelim'};
var _user$project$FromEnglish$GrainsOfParadise = {ctor: 'GrainsOfParadise'};
var _user$project$FromEnglish$GovernmentService = {ctor: 'GovernmentService'};
var _user$project$FromEnglish$GovernmentPermit = {ctor: 'GovernmentPermit'};
var _user$project$FromEnglish$GovernmentOrganization = {ctor: 'GovernmentOrganization'};
var _user$project$FromEnglish$GovernmentOffice = {ctor: 'GovernmentOffice'};
var _user$project$FromEnglish$GovernmentBuilding = {ctor: 'GovernmentBuilding'};
var _user$project$FromEnglish$GothicRock = {ctor: 'GothicRock'};
var _user$project$FromEnglish$GothicMetal = {ctor: 'GothicMetal'};
var _user$project$FromEnglish$Gooseberry = {ctor: 'Gooseberry'};
var _user$project$FromEnglish$GoodRelationsTerms = {ctor: 'GoodRelationsTerms'};
var _user$project$FromEnglish$GoodRelationsClass = {ctor: 'GoodRelationsClass'};
var _user$project$FromEnglish$GolfCourse = {ctor: 'GolfCourse'};
var _user$project$FromEnglish$GojiBerry = {ctor: 'GojiBerry'};
var _user$project$FromEnglish$GlutenFreeDiet = {ctor: 'GlutenFreeDiet'};
var _user$project$FromEnglish$GlueLaminate = {ctor: 'GlueLaminate'};
var _user$project$FromEnglish$GlobalLocationNumber = {ctor: 'GlobalLocationNumber'};
var _user$project$FromEnglish$GlassWool = {ctor: 'GlassWool'};
var _user$project$FromEnglish$GlassFiber = {ctor: 'GlassFiber'};
var _user$project$FromEnglish$GlassBrick = {ctor: 'GlassBrick'};
var _user$project$FromEnglish$Glass = {ctor: 'Glass'};
var _user$project$FromEnglish$GlamRock = {ctor: 'GlamRock'};
var _user$project$FromEnglish$GlamMetal = {ctor: 'GlamMetal'};
var _user$project$FromEnglish$GivenName = {ctor: 'GivenName'};
var _user$project$FromEnglish$Ginger = {ctor: 'Ginger'};
var _user$project$FromEnglish$GhettoHouse = {ctor: 'GhettoHouse'};
var _user$project$FromEnglish$Georgette = {ctor: 'Georgette'};
var _user$project$FromEnglish$GeographicArea = {ctor: 'GeographicArea'};
var _user$project$FromEnglish$GeoShape = {ctor: 'GeoShape'};
var _user$project$FromEnglish$GeoRadius = {ctor: 'GeoRadius'};
var _user$project$FromEnglish$GeoMidpoint = {ctor: 'GeoMidpoint'};
var _user$project$FromEnglish$GeoCoordinates = {ctor: 'GeoCoordinates'};
var _user$project$FromEnglish$GeoCircle = {ctor: 'GeoCircle'};
var _user$project$FromEnglish$GeneralContractor = {ctor: 'GeneralContractor'};
var _user$project$FromEnglish$GenderType = {ctor: 'GenderType'};
var _user$project$FromEnglish$Gender = {ctor: 'Gender'};
var _user$project$FromEnglish$GemSquash = {ctor: 'GemSquash'};
var _user$project$FromEnglish$GatedResidenceCommunity = {ctor: 'GatedResidenceCommunity'};
var _user$project$FromEnglish$GasStation = {ctor: 'GasStation'};
var _user$project$FromEnglish$GarlicSalt = {ctor: 'GarlicSalt'};
var _user$project$FromEnglish$GarlicPowder = {ctor: 'GarlicPowder'};
var _user$project$FromEnglish$GarlicChives = {ctor: 'GarlicChives'};
var _user$project$FromEnglish$GardenStore = {ctor: 'GardenStore'};
var _user$project$FromEnglish$GaramMasala = {ctor: 'GaramMasala'};
var _user$project$FromEnglish$GarageRock = {ctor: 'GarageRock'};
var _user$project$FromEnglish$GaragePunk = {ctor: 'GaragePunk'};
var _user$project$FromEnglish$GameTip = {ctor: 'GameTip'};
var _user$project$FromEnglish$GameServerStatus = {ctor: 'GameServerStatus'};
var _user$project$FromEnglish$GameServer = {ctor: 'GameServer'};
var _user$project$FromEnglish$GamePlayMode = {ctor: 'GamePlayMode'};
var _user$project$FromEnglish$GamePlatform = {ctor: 'GamePlatform'};
var _user$project$FromEnglish$Gadolinium = {ctor: 'Gadolinium'};
var _user$project$FromEnglish$Fustian = {ctor: 'Fustian'};
var _user$project$FromEnglish$FurnitureStore = {ctor: 'FurnitureStore'};
var _user$project$FromEnglish$FunkyHouse = {ctor: 'FunkyHouse'};
var _user$project$FromEnglish$FunkMetal = {ctor: 'FunkMetal'};
var _user$project$FromEnglish$FuneralDoom = {ctor: 'FuneralDoom'};
var _user$project$FromEnglish$FuelType = {ctor: 'FuelType'};
var _user$project$FromEnglish$FuelEfficiency = {ctor: 'FuelEfficiency'};
var _user$project$FromEnglish$FuelConsumption = {ctor: 'FuelConsumption'};
var _user$project$FromEnglish$FrySauce = {ctor: 'FrySauce'};
var _user$project$FromEnglish$Fry = {ctor: 'Fry'};
var _user$project$FromEnglish$FruitPreserves = {ctor: 'FruitPreserves'};
var _user$project$FromEnglish$FruitKetchup = {ctor: 'FruitKetchup'};
var _user$project$FromEnglish$FrontWheelDriveConfiguration = {ctor: 'FrontWheelDriveConfiguration'};
var _user$project$FromEnglish$FromLocation = {ctor: 'FromLocation'};
var _user$project$FromEnglish$Frisee = {ctor: 'Frisee'};
var _user$project$FromEnglish$Frighten = {ctor: 'Frighten'};
var _user$project$FromEnglish$Friday = {ctor: 'Friday'};
var _user$project$FromEnglish$FrenchHouse = {ctor: 'FrenchHouse'};
var _user$project$FromEnglish$FreestyleHouse = {ctor: 'FreestyleHouse'};
var _user$project$FromEnglish$Freestyle = {ctor: 'Freestyle'};
var _user$project$FromEnglish$FreakFolk = {ctor: 'FreakFolk'};
var _user$project$FromEnglish$Francium = {ctor: 'Francium'};
var _user$project$FromEnglish$Foxy = {ctor: 'Foxy'};
var _user$project$FromEnglish$FourWheelDriveConfiguration = {ctor: 'FourWheelDriveConfiguration'};
var _user$project$FromEnglish$FoundingLocation = {ctor: 'FoundingLocation'};
var _user$project$FromEnglish$FoundingDate = {ctor: 'FoundingDate'};
var _user$project$FromEnglish$Founder = {ctor: 'Founder'};
var _user$project$FromEnglish$Foulard = {ctor: 'Foulard'};
var _user$project$FromEnglish$Form = {ctor: 'Form'};
var _user$project$FromEnglish$FoodService = {ctor: 'FoodService'};
var _user$project$FromEnglish$FoodFriendly = {ctor: 'FoodFriendly'};
var _user$project$FromEnglish$FoodEvent = {ctor: 'FoodEvent'};
var _user$project$FromEnglish$FoodEstablishmentReservation = {ctor: 'FoodEstablishmentReservation'};
var _user$project$FromEnglish$FoodEstablishment = {ctor: 'FoodEstablishment'};
var _user$project$FromEnglish$Folktronica = {ctor: 'Folktronica'};
var _user$project$FromEnglish$FolkPunk = {ctor: 'FolkPunk'};
var _user$project$FromEnglish$Fold = {ctor: 'Fold'};
var _user$project$FromEnglish$Florist = {ctor: 'Florist'};
var _user$project$FromEnglish$FloridaBreaks = {ctor: 'FloridaBreaks'};
var _user$project$FromEnglish$FloorSize = {ctor: 'FloorSize'};
var _user$project$FromEnglish$Flood = {ctor: 'Flood'};
var _user$project$FromEnglish$Float = {ctor: 'Float'};
var _user$project$FromEnglish$FlightReservation = {ctor: 'FlightReservation'};
var _user$project$FromEnglish$FlightNumber = {ctor: 'FlightNumber'};
var _user$project$FromEnglish$FlightDistance = {ctor: 'FlightDistance'};
var _user$project$FromEnglish$Flight = {ctor: 'Flight'};
var _user$project$FromEnglish$Flap = {ctor: 'Flap'};
var _user$project$FromEnglish$Flannel = {ctor: 'Flannel'};
var _user$project$FromEnglish$Flamboyant = {ctor: 'Flamboyant'};
var _user$project$FromEnglish$Flabby = {ctor: 'Flabby'};
var _user$project$FromEnglish$Fix = {ctor: 'Fix'};
var _user$project$FromEnglish$FiveSpicePowder = {ctor: 'FiveSpicePowder'};
var _user$project$FromEnglish$FishSauce = {ctor: 'FishSauce'};
var _user$project$FromEnglish$FishPaste = {ctor: 'FishPaste'};
var _user$project$FromEnglish$FirstPerformance = {ctor: 'FirstPerformance'};
var _user$project$FromEnglish$FireStation = {ctor: 'FireStation'};
var _user$project$FromEnglish$FindAction = {ctor: 'FindAction'};
var _user$project$FromEnglish$FinancialService = {ctor: 'FinancialService'};
var _user$project$FromEnglish$FinancialProduct = {ctor: 'FinancialProduct'};
var _user$project$FromEnglish$FilmAction = {ctor: 'FilmAction'};
var _user$project$FromEnglish$FileSize = {ctor: 'FileSize'};
var _user$project$FromEnglish$FileFormat = {ctor: 'FileFormat'};
var _user$project$FromEnglish$FiberContent = {ctor: 'FiberContent'};
var _user$project$FromEnglish$Festival = {ctor: 'Festival'};
var _user$project$FromEnglish$Fermium = {ctor: 'Fermium'};
var _user$project$FromEnglish$Fenugreek = {ctor: 'Fenugreek'};
var _user$project$FromEnglish$Fennel = {ctor: 'Fennel'};
var _user$project$FromEnglish$Fence = {ctor: 'Fence'};
var _user$project$FromEnglish$FeesAndCommissionsSpecification = {ctor: 'FeesAndCommissionsSpecification'};
var _user$project$FromEnglish$FeatureList = {ctor: 'FeatureList'};
var _user$project$FromEnglish$FaxNumber = {ctor: 'FaxNumber'};
var _user$project$FromEnglish$FatContent = {ctor: 'FatContent'};
var _user$project$FromEnglish$FastFoodRestaurant = {ctor: 'FastFoodRestaurant'};
var _user$project$FromEnglish$FamilyName = {ctor: 'FamilyName'};
var _user$project$FromEnglish$FallenOver = {ctor: 'FallenOver'};
var _user$project$FromEnglish$FailedActionStatus = {ctor: 'FailedActionStatus'};
var _user$project$FromEnglish$Fade = {ctor: 'Fade'};
var _user$project$FromEnglish$Extracted = {ctor: 'Extracted'};
var _user$project$FromEnglish$Extend = {ctor: 'Extend'};
var _user$project$FromEnglish$Expressive = {ctor: 'Expressive'};
var _user$project$FromEnglish$Explode = {ctor: 'Explode'};
var _user$project$FromEnglish$Explain = {ctor: 'Explain'};
var _user$project$FromEnglish$Expires = {ctor: 'Expires'};
var _user$project$FromEnglish$ExperimentalRock = {ctor: 'ExperimentalRock'};
var _user$project$FromEnglish$ExperienceRequirements = {ctor: 'ExperienceRequirements'};
var _user$project$FromEnglish$ExpectsAcceptanceOf = {ctor: 'ExpectsAcceptanceOf'};
var _user$project$FromEnglish$ExpectedArrivalUntil = {ctor: 'ExpectedArrivalUntil'};
var _user$project$FromEnglish$ExpectedArrivalFrom = {ctor: 'ExpectedArrivalFrom'};
var _user$project$FromEnglish$Expect = {ctor: 'Expect'};
var _user$project$FromEnglish$Expand = {ctor: 'Expand'};
var _user$project$FromEnglish$ExifData = {ctor: 'ExifData'};
var _user$project$FromEnglish$ExhibitionEvent = {ctor: 'ExhibitionEvent'};
var _user$project$FromEnglish$ExerciseGym = {ctor: 'ExerciseGym'};
var _user$project$FromEnglish$ExerciseCourse = {ctor: 'ExerciseCourse'};
var _user$project$FromEnglish$ExerciseAction = {ctor: 'ExerciseAction'};
var _user$project$FromEnglish$Exercise = {ctor: 'Exercise'};
var _user$project$FromEnglish$ExecutableLibraryName = {ctor: 'ExecutableLibraryName'};
var _user$project$FromEnglish$Excuse = {ctor: 'Excuse'};
var _user$project$FromEnglish$ExampleOfWork = {ctor: 'ExampleOfWork'};
var _user$project$FromEnglish$Examine = {ctor: 'Examine'};
var _user$project$FromEnglish$EventVenue = {ctor: 'EventVenue'};
var _user$project$FromEnglish$EventStatusType = {ctor: 'EventStatusType'};
var _user$project$FromEnglish$EventStatus = {ctor: 'EventStatus'};
var _user$project$FromEnglish$EventScheduled = {ctor: 'EventScheduled'};
var _user$project$FromEnglish$EventReservation = {ctor: 'EventReservation'};
var _user$project$FromEnglish$EventRescheduled = {ctor: 'EventRescheduled'};
var _user$project$FromEnglish$EventPostponed = {ctor: 'EventPostponed'};
var _user$project$FromEnglish$EventCancelled = {ctor: 'EventCancelled'};
var _user$project$FromEnglish$Event = {ctor: 'Event'};
var _user$project$FromEnglish$Europium = {ctor: 'Europium'};
var _user$project$FromEnglish$EuropeanFreeJazz = {ctor: 'EuropeanFreeJazz'};
var _user$project$FromEnglish$EuroDisco = {ctor: 'EuroDisco'};
var _user$project$FromEnglish$EthnicElectronica = {ctor: 'EthnicElectronica'};
var _user$project$FromEnglish$EtherealWave = {ctor: 'EtherealWave'};
var _user$project$FromEnglish$EstimatedFlightDuration = {ctor: 'EstimatedFlightDuration'};
var _user$project$FromEnglish$Equal = {ctor: 'Equal'};
var _user$project$FromEnglish$Episodes = {ctor: 'Episodes'};
var _user$project$FromEnglish$EpisodeNumber = {ctor: 'EpisodeNumber'};
var _user$project$FromEnglish$Episode = {ctor: 'Episode'};
var _user$project$FromEnglish$EpicDoom = {ctor: 'EpicDoom'};
var _user$project$FromEnglish$Epazote = {ctor: 'Epazote'};
var _user$project$FromEnglish$Enumeration = {ctor: 'Enumeration'};
var _user$project$FromEnglish$EntryPoint = {ctor: 'EntryPoint'};
var _user$project$FromEnglish$EntertainmentBusiness = {ctor: 'EntertainmentBusiness'};
var _user$project$FromEnglish$Entertain = {ctor: 'Entertain'};
var _user$project$FromEnglish$EngineSpecification = {ctor: 'EngineSpecification'};
var _user$project$FromEnglish$EndorseAction = {ctor: 'EndorseAction'};
var _user$project$FromEnglish$Endive = {ctor: 'Endive'};
var _user$project$FromEnglish$EndTime = {ctor: 'EndTime'};
var _user$project$FromEnglish$Encourage = {ctor: 'Encourage'};
var _user$project$FromEnglish$Encodings = {ctor: 'Encodings'};
var _user$project$FromEnglish$EncodingType = {ctor: 'EncodingType'};
var _user$project$FromEnglish$EncodingFormat = {ctor: 'EncodingFormat'};
var _user$project$FromEnglish$Encoding = {ctor: 'Encoding'};
var _user$project$FromEnglish$EncodesCreativeWork = {ctor: 'EncodesCreativeWork'};
var _user$project$FromEnglish$Empty = {ctor: 'Empty'};
var _user$project$FromEnglish$EmploymentType = {ctor: 'EmploymentType'};
var _user$project$FromEnglish$EmploymentAgency = {ctor: 'EmploymentAgency'};
var _user$project$FromEnglish$Employees = {ctor: 'Employees'};
var _user$project$FromEnglish$EmployeeRole = {ctor: 'EmployeeRole'};
var _user$project$FromEnglish$Employee = {ctor: 'Employee'};
var _user$project$FromEnglish$EmergencyService = {ctor: 'EmergencyService'};
var _user$project$FromEnglish$EmbedUrl = {ctor: 'EmbedUrl'};
var _user$project$FromEnglish$Embassy = {ctor: 'Embassy'};
var _user$project$FromEnglish$Embarrass = {ctor: 'Embarrass'};
var _user$project$FromEnglish$EmailMessage = {ctor: 'EmailMessage'};
var _user$project$FromEnglish$Email = {ctor: 'Email'};
var _user$project$FromEnglish$EligibleTransactionVolume = {ctor: 'EligibleTransactionVolume'};
var _user$project$FromEnglish$EligibleRegion = {ctor: 'EligibleRegion'};
var _user$project$FromEnglish$EligibleQuantity = {ctor: 'EligibleQuantity'};
var _user$project$FromEnglish$EligibleDuration = {ctor: 'EligibleDuration'};
var _user$project$FromEnglish$EligibleCustomerType = {ctor: 'EligibleCustomerType'};
var _user$project$FromEnglish$Elevation = {ctor: 'Elevation'};
var _user$project$FromEnglish$ElementarySchool = {ctor: 'ElementarySchool'};
var _user$project$FromEnglish$Elegant = {ctor: 'Elegant'};
var _user$project$FromEnglish$Electropop = {ctor: 'Electropop'};
var _user$project$FromEnglish$ElectronicsStore = {ctor: 'ElectronicsStore'};
var _user$project$FromEnglish$Electronica = {ctor: 'Electronica'};
var _user$project$FromEnglish$ElectronicRock = {ctor: 'ElectronicRock'};
var _user$project$FromEnglish$ElectronicArtMusic = {ctor: 'ElectronicArtMusic'};
var _user$project$FromEnglish$Electroacoustic = {ctor: 'Electroacoustic'};
var _user$project$FromEnglish$ElectroIndustrial = {ctor: 'ElectroIndustrial'};
var _user$project$FromEnglish$ElectroHouse = {ctor: 'ElectroHouse'};
var _user$project$FromEnglish$ElectroGrime = {ctor: 'ElectroGrime'};
var _user$project$FromEnglish$ElectroBackbeat = {ctor: 'ElectroBackbeat'};
var _user$project$FromEnglish$Electro = {ctor: 'Electro'};
var _user$project$FromEnglish$Electrician = {ctor: 'Electrician'};
var _user$project$FromEnglish$Elderberry = {ctor: 'Elderberry'};
var _user$project$FromEnglish$Einsteinium = {ctor: 'Einsteinium'};
var _user$project$FromEnglish$Eggplant = {ctor: 'Eggplant'};
var _user$project$FromEnglish$EducationalUse = {ctor: 'EducationalUse'};
var _user$project$FromEnglish$EducationalRole = {ctor: 'EducationalRole'};
var _user$project$FromEnglish$EducationalOrganization = {ctor: 'EducationalOrganization'};
var _user$project$FromEnglish$EducationalFramework = {ctor: 'EducationalFramework'};
var _user$project$FromEnglish$EducationalAudience = {ctor: 'EducationalAudience'};
var _user$project$FromEnglish$EducationalAlignment = {ctor: 'EducationalAlignment'};
var _user$project$FromEnglish$EducationRequirements = {ctor: 'EducationRequirements'};
var _user$project$FromEnglish$EducationEvent = {ctor: 'EducationEvent'};
var _user$project$FromEnglish$Educate = {ctor: 'Educate'};
var _user$project$FromEnglish$Editor = {ctor: 'Editor'};
var _user$project$FromEnglish$Ebook = {ctor: 'Ebook'};
var _user$project$FromEnglish$EastAsianPepper = {ctor: 'EastAsianPepper'};
var _user$project$FromEnglish$ETextiles = {ctor: 'ETextiles'};
var _user$project$FromEnglish$Dysprosium = {ctor: 'Dysprosium'};
var _user$project$FromEnglish$DutchHouse = {ctor: 'DutchHouse'};
var _user$project$FromEnglish$Dust = {ctor: 'Dust'};
var _user$project$FromEnglish$Durian = {ctor: 'Durian'};
var _user$project$FromEnglish$DurationOfWarranty = {ctor: 'DurationOfWarranty'};
var _user$project$FromEnglish$Duration = {ctor: 'Duration'};
var _user$project$FromEnglish$DunedinSound = {ctor: 'DunedinSound'};
var _user$project$FromEnglish$Duck = {ctor: 'Duck'};
var _user$project$FromEnglish$Dubstep = {ctor: 'Dubstep'};
var _user$project$FromEnglish$Dubnium = {ctor: 'Dubnium'};
var _user$project$FromEnglish$DryCleaningOrLaundry = {ctor: 'DryCleaningOrLaundry'};
var _user$project$FromEnglish$Dry = {ctor: 'Dry'};
var _user$project$FromEnglish$DrumAndBass = {ctor: 'DrumAndBass'};
var _user$project$FromEnglish$Drum = {ctor: 'Drum'};
var _user$project$FromEnglish$Drugget = {ctor: 'Drugget'};
var _user$project$FromEnglish$Drown = {ctor: 'Drown'};
var _user$project$FromEnglish$DropoffTime = {ctor: 'DropoffTime'};
var _user$project$FromEnglish$DropoffLocation = {ctor: 'DropoffLocation'};
var _user$project$FromEnglish$Drop = {ctor: 'Drop'};
var _user$project$FromEnglish$DroneMetal = {ctor: 'DroneMetal'};
var _user$project$FromEnglish$DriveWheelConfigurationValue = {ctor: 'DriveWheelConfigurationValue'};
var _user$project$FromEnglish$DriveWheelConfiguration = {ctor: 'DriveWheelConfiguration'};
var _user$project$FromEnglish$DrinkAction = {ctor: 'DrinkAction'};
var _user$project$FromEnglish$Drill = {ctor: 'Drill'};
var _user$project$FromEnglish$DriedLime = {ctor: 'DriedLime'};
var _user$project$FromEnglish$Dress = {ctor: 'Dress'};
var _user$project$FromEnglish$DreamTrance = {ctor: 'DreamTrance'};
var _user$project$FromEnglish$DreamPop = {ctor: 'DreamPop'};
var _user$project$FromEnglish$DreamHouse = {ctor: 'DreamHouse'};
var _user$project$FromEnglish$Dream = {ctor: 'Dream'};
var _user$project$FromEnglish$DrawAction = {ctor: 'DrawAction'};
var _user$project$FromEnglish$Drag = {ctor: 'Drag'};
var _user$project$FromEnglish$DownvoteCount = {ctor: 'DownvoteCount'};
var _user$project$FromEnglish$DownloadUrl = {ctor: 'DownloadUrl'};
var _user$project$FromEnglish$DownloadAction = {ctor: 'DownloadAction'};
var _user$project$FromEnglish$Double = {ctor: 'Double'};
var _user$project$FromEnglish$DoorTime = {ctor: 'DoorTime'};
var _user$project$FromEnglish$DoomMetal = {ctor: 'DoomMetal'};
var _user$project$FromEnglish$DonegalTweed = {ctor: 'DonegalTweed'};
var _user$project$FromEnglish$DonateAction = {ctor: 'DonateAction'};
var _user$project$FromEnglish$DjmixAlbum = {ctor: 'DjmixAlbum'};
var _user$project$FromEnglish$Dixieland = {ctor: 'Dixieland'};
var _user$project$FromEnglish$Divide = {ctor: 'Divide'};
var _user$project$FromEnglish$DivaHouse = {ctor: 'DivaHouse'};
var _user$project$FromEnglish$Distribution = {ctor: 'Distribution'};
var _user$project$FromEnglish$Distance = {ctor: 'Distance'};
var _user$project$FromEnglish$DissolutionDate = {ctor: 'DissolutionDate'};
var _user$project$FromEnglish$DislikeAction = {ctor: 'DislikeAction'};
var _user$project$FromEnglish$Dislike = {ctor: 'Dislike'};
var _user$project$FromEnglish$DiscussionUrl = {ctor: 'DiscussionUrl'};
var _user$project$FromEnglish$DiscussionForumPosting = {ctor: 'DiscussionForumPosting'};
var _user$project$FromEnglish$Discusses = {ctor: 'Discusses'};
var _user$project$FromEnglish$DiscoverAction = {ctor: 'DiscoverAction'};
var _user$project$FromEnglish$Discover = {ctor: 'Discover'};
var _user$project$FromEnglish$DiscountCurrency = {ctor: 'DiscountCurrency'};
var _user$project$FromEnglish$DiscountCode = {ctor: 'DiscountCode'};
var _user$project$FromEnglish$Discount = {ctor: 'Discount'};
var _user$project$FromEnglish$Discontinued = {ctor: 'Discontinued'};
var _user$project$FromEnglish$DiscoPolo = {ctor: 'DiscoPolo'};
var _user$project$FromEnglish$Disco = {ctor: 'Disco'};
var _user$project$FromEnglish$Disarm = {ctor: 'Disarm'};
var _user$project$FromEnglish$Disapprove = {ctor: 'Disapprove'};
var _user$project$FromEnglish$Disappear = {ctor: 'Disappear'};
var _user$project$FromEnglish$DisambiguatingDescription = {ctor: 'DisambiguatingDescription'};
var _user$project$FromEnglish$DisagreeAction = {ctor: 'DisagreeAction'};
var _user$project$FromEnglish$Disagree = {ctor: 'Disagree'};
var _user$project$FromEnglish$Directors = {ctor: 'Directors'};
var _user$project$FromEnglish$Director = {ctor: 'Director'};
var _user$project$FromEnglish$Dip = {ctor: 'Dip'};
var _user$project$FromEnglish$Dimity = {ctor: 'Dimity'};
var _user$project$FromEnglish$DimensionalLumber = {ctor: 'DimensionalLumber'};
var _user$project$FromEnglish$DillSeed = {ctor: 'DillSeed'};
var _user$project$FromEnglish$Dill = {ctor: 'Dill'};
var _user$project$FromEnglish$DijonMustard = {ctor: 'DijonMustard'};
var _user$project$FromEnglish$DijonKetchup = {ctor: 'DijonKetchup'};
var _user$project$FromEnglish$DigitalHardcore = {ctor: 'DigitalHardcore'};
var _user$project$FromEnglish$DigitalFormat = {ctor: 'DigitalFormat'};
var _user$project$FromEnglish$DigitalDocumentPermissionType = {ctor: 'DigitalDocumentPermissionType'};
var _user$project$FromEnglish$DigitalDocumentPermission = {ctor: 'DigitalDocumentPermission'};
var _user$project$FromEnglish$DigitalDocument = {ctor: 'DigitalDocument'};
var _user$project$FromEnglish$DigitalAudioTapeFormat = {ctor: 'DigitalAudioTapeFormat'};
var _user$project$FromEnglish$DiabeticDiet = {ctor: 'DiabeticDiet'};
var _user$project$FromEnglish$Develop = {ctor: 'Develop'};
var _user$project$FromEnglish$DetroitTechno = {ctor: 'DetroitTechno'};
var _user$project$FromEnglish$Detect = {ctor: 'Detect'};
var _user$project$FromEnglish$Destroy = {ctor: 'Destroy'};
var _user$project$FromEnglish$Deserve = {ctor: 'Deserve'};
var _user$project$FromEnglish$DesertRock = {ctor: 'DesertRock'};
var _user$project$FromEnglish$Description = {ctor: 'Description'};
var _user$project$FromEnglish$Describe = {ctor: 'Describe'};
var _user$project$FromEnglish$Depth = {ctor: 'Depth'};
var _user$project$FromEnglish$DepositAccount = {ctor: 'DepositAccount'};
var _user$project$FromEnglish$Dependencies = {ctor: 'Dependencies'};
var _user$project$FromEnglish$Depend = {ctor: 'Depend'};
var _user$project$FromEnglish$DepartureTime = {ctor: 'DepartureTime'};
var _user$project$FromEnglish$DepartureTerminal = {ctor: 'DepartureTerminal'};
var _user$project$FromEnglish$DepartureStation = {ctor: 'DepartureStation'};
var _user$project$FromEnglish$DeparturePlatform = {ctor: 'DeparturePlatform'};
var _user$project$FromEnglish$DepartureGate = {ctor: 'DepartureGate'};
var _user$project$FromEnglish$DepartureBusStop = {ctor: 'DepartureBusStop'};
var _user$project$FromEnglish$DepartureAirport = {ctor: 'DepartureAirport'};
var _user$project$FromEnglish$DepartmentStore = {ctor: 'DepartmentStore'};
var _user$project$FromEnglish$Department = {ctor: 'Department'};
var _user$project$FromEnglish$DepartAction = {ctor: 'DepartAction'};
var _user$project$FromEnglish$Dentist = {ctor: 'Dentist'};
var _user$project$FromEnglish$Dense = {ctor: 'Dense'};
var _user$project$FromEnglish$Denim = {ctor: 'Denim'};
var _user$project$FromEnglish$DemoAlbum = {ctor: 'DemoAlbum'};
var _user$project$FromEnglish$Demand = {ctor: 'Demand'};
var _user$project$FromEnglish$DeliveryStatus = {ctor: 'DeliveryStatus'};
var _user$project$FromEnglish$DeliveryMethod = {ctor: 'DeliveryMethod'};
var _user$project$FromEnglish$DeliveryLeadTime = {ctor: 'DeliveryLeadTime'};
var _user$project$FromEnglish$DeliveryEvent = {ctor: 'DeliveryEvent'};
var _user$project$FromEnglish$DeliveryChargeSpecification = {ctor: 'DeliveryChargeSpecification'};
var _user$project$FromEnglish$DeliveryAddress = {ctor: 'DeliveryAddress'};
var _user$project$FromEnglish$Deliver = {ctor: 'Deliver'};
var _user$project$FromEnglish$Delight = {ctor: 'Delight'};
var _user$project$FromEnglish$DeleteAction = {ctor: 'DeleteAction'};
var _user$project$FromEnglish$DefenceEstablishment = {ctor: 'DefenceEstablishment'};
var _user$project$FromEnglish$DefaultValue = {ctor: 'DefaultValue'};
var _user$project$FromEnglish$DeepHouse = {ctor: 'DeepHouse'};
var _user$project$FromEnglish$Decorate = {ctor: 'Decorate'};
var _user$project$FromEnglish$Decide = {ctor: 'Decide'};
var _user$project$FromEnglish$Deceive = {ctor: 'Deceive'};
var _user$project$FromEnglish$Decay = {ctor: 'Decay'};
var _user$project$FromEnglish$DeathPlace = {ctor: 'DeathPlace'};
var _user$project$FromEnglish$DeathMetal = {ctor: 'DeathMetal'};
var _user$project$FromEnglish$DeathIndustrial = {ctor: 'DeathIndustrial'};
var _user$project$FromEnglish$DeathDate = {ctor: 'DeathDate'};
var _user$project$FromEnglish$DeactivateAction = {ctor: 'DeactivateAction'};
var _user$project$FromEnglish$Dazzle = {ctor: 'Dazzle'};
var _user$project$FromEnglish$DayOfWeek = {ctor: 'DayOfWeek'};
var _user$project$FromEnglish$Dateline = {ctor: 'Dateline'};
var _user$project$FromEnglish$DatedMoneySpecification = {ctor: 'DatedMoneySpecification'};
var _user$project$FromEnglish$DateVehicleFirstRegistered = {ctor: 'DateVehicleFirstRegistered'};
var _user$project$FromEnglish$DateTime = {ctor: 'DateTime'};
var _user$project$FromEnglish$DateSent = {ctor: 'DateSent'};
var _user$project$FromEnglish$DateReceived = {ctor: 'DateReceived'};
var _user$project$FromEnglish$DateRead = {ctor: 'DateRead'};
var _user$project$FromEnglish$DatePublished = {ctor: 'DatePublished'};
var _user$project$FromEnglish$DatePosted = {ctor: 'DatePosted'};
var _user$project$FromEnglish$DateModified = {ctor: 'DateModified'};
var _user$project$FromEnglish$DateIssued = {ctor: 'DateIssued'};
var _user$project$FromEnglish$DateDeleted = {ctor: 'DateDeleted'};
var _user$project$FromEnglish$DateCreated = {ctor: 'DateCreated'};
var _user$project$FromEnglish$DatasetTimeInterval = {ctor: 'DatasetTimeInterval'};
var _user$project$FromEnglish$DatasetClass = {ctor: 'DatasetClass'};
var _user$project$FromEnglish$DataType = {ctor: 'DataType'};
var _user$project$FromEnglish$DataFeedItem = {ctor: 'DataFeedItem'};
var _user$project$FromEnglish$DataFeedElement = {ctor: 'DataFeedElement'};
var _user$project$FromEnglish$DataFeed = {ctor: 'DataFeed'};
var _user$project$FromEnglish$DataDownload = {ctor: 'DataDownload'};
var _user$project$FromEnglish$DataCatalog = {ctor: 'DataCatalog'};
var _user$project$FromEnglish$Darmstadtium = {ctor: 'Darmstadtium'};
var _user$project$FromEnglish$DarksideJungle = {ctor: 'DarksideJungle'};
var _user$project$FromEnglish$DarkWave = {ctor: 'DarkWave'};
var _user$project$FromEnglish$DarkElectro = {ctor: 'DarkElectro'};
var _user$project$FromEnglish$DarkCabaret = {ctor: 'DarkCabaret'};
var _user$project$FromEnglish$DarkAmbient = {ctor: 'DarkAmbient'};
var _user$project$FromEnglish$DanceRock = {ctor: 'DanceRock'};
var _user$project$FromEnglish$DancePunk = {ctor: 'DancePunk'};
var _user$project$FromEnglish$DancePop = {ctor: 'DancePop'};
var _user$project$FromEnglish$DanceGroup = {ctor: 'DanceGroup'};
var _user$project$FromEnglish$DanceEvent = {ctor: 'DanceEvent'};
var _user$project$FromEnglish$Damson = {ctor: 'Damson'};
var _user$project$FromEnglish$Damask = {ctor: 'Damask'};
var _user$project$FromEnglish$DamagedCondition = {ctor: 'DamagedCondition'};
var _user$project$FromEnglish$Damage = {ctor: 'Damage'};
var _user$project$FromEnglish$Dam = {ctor: 'Dam'};
var _user$project$FromEnglish$Daikon = {ctor: 'Daikon'};
var _user$project$FromEnglish$Customer = {ctor: 'Customer'};
var _user$project$FromEnglish$CurryPowder = {ctor: 'CurryPowder'};
var _user$project$FromEnglish$CurryLeaf = {ctor: 'CurryLeaf'};
var _user$project$FromEnglish$CurryKetchup = {ctor: 'CurryKetchup'};
var _user$project$FromEnglish$CurrencyConversionService = {ctor: 'CurrencyConversionService'};
var _user$project$FromEnglish$Currency = {ctor: 'Currency'};
var _user$project$FromEnglish$CurrenciesAccepted = {ctor: 'CurrenciesAccepted'};
var _user$project$FromEnglish$Currant = {ctor: 'Currant'};
var _user$project$FromEnglish$Curium = {ctor: 'Curium'};
var _user$project$FromEnglish$Cumin = {ctor: 'Cumin'};
var _user$project$FromEnglish$Cucumber = {ctor: 'Cucumber'};
var _user$project$FromEnglish$Cubeb = {ctor: 'Cubeb'};
var _user$project$FromEnglish$CrustPunk = {ctor: 'CrustPunk'};
var _user$project$FromEnglish$CrushedRedPepper = {ctor: 'CrushedRedPepper'};
var _user$project$FromEnglish$Crush = {ctor: 'Crush'};
var _user$project$FromEnglish$Crunk = {ctor: 'Crunk'};
var _user$project$FromEnglish$CrossoverThrash = {ctor: 'CrossoverThrash'};
var _user$project$FromEnglish$CrossoverJazz = {ctor: 'CrossoverJazz'};
var _user$project$FromEnglish$Cross = {ctor: 'Cross'};
var _user$project$FromEnglish$Crisp = {ctor: 'Crisp'};
var _user$project$FromEnglish$Crimplene = {ctor: 'Crimplene'};
var _user$project$FromEnglish$Cretonne = {ctor: 'Cretonne'};
var _user$project$FromEnglish$Crematorium = {ctor: 'Crematorium'};
var _user$project$FromEnglish$CreditedTo = {ctor: 'CreditedTo'};
var _user$project$FromEnglish$CreditCard = {ctor: 'CreditCard'};
var _user$project$FromEnglish$Creator = {ctor: 'Creator'};
var _user$project$FromEnglish$CreativeWorkSeries = {ctor: 'CreativeWorkSeries'};
var _user$project$FromEnglish$CreativeWorkSeason = {ctor: 'CreativeWorkSeason'};
var _user$project$FromEnglish$CreativeWork = {ctor: 'CreativeWork'};
var _user$project$FromEnglish$CreateAction = {ctor: 'CreateAction'};
var _user$project$FromEnglish$Creamy = {ctor: 'Creamy'};
var _user$project$FromEnglish$Crawl = {ctor: 'Crawl'};
var _user$project$FromEnglish$Crape = {ctor: 'Crape'};
var _user$project$FromEnglish$Cranberry = {ctor: 'Cranberry'};
var _user$project$FromEnglish$CrabBoil = {ctor: 'CrabBoil'};
var _user$project$FromEnglish$Cowpunk = {ctor: 'Cowpunk'};
var _user$project$FromEnglish$CoverageStartTime = {ctor: 'CoverageStartTime'};
var _user$project$FromEnglish$CoverageEndTime = {ctor: 'CoverageEndTime'};
var _user$project$FromEnglish$Courthouse = {ctor: 'Courthouse'};
var _user$project$FromEnglish$CoursePrerequisites = {ctor: 'CoursePrerequisites'};
var _user$project$FromEnglish$CourseMode = {ctor: 'CourseMode'};
var _user$project$FromEnglish$CourseInstance = {ctor: 'CourseInstance'};
var _user$project$FromEnglish$CourseCode = {ctor: 'CourseCode'};
var _user$project$FromEnglish$Courgette = {ctor: 'Courgette'};
var _user$project$FromEnglish$CountryOfOrigin = {ctor: 'CountryOfOrigin'};
var _user$project$FromEnglish$Country = {ctor: 'Country'};
var _user$project$FromEnglish$CountriesSupported = {ctor: 'CountriesSupported'};
var _user$project$FromEnglish$CountriesNotSupported = {ctor: 'CountriesNotSupported'};
var _user$project$FromEnglish$Cough = {ctor: 'Cough'};
var _user$project$FromEnglish$Cotton = {ctor: 'Cotton'};
var _user$project$FromEnglish$CosmicDisco = {ctor: 'CosmicDisco'};
var _user$project$FromEnglish$Correct = {ctor: 'Correct'};
var _user$project$FromEnglish$Corporation = {ctor: 'Corporation'};
var _user$project$FromEnglish$CornSalad = {ctor: 'CornSalad'};
var _user$project$FromEnglish$Corn = {ctor: 'Corn'};
var _user$project$FromEnglish$Corked = {ctor: 'Corked'};
var _user$project$FromEnglish$CorianderSeed = {ctor: 'CorianderSeed'};
var _user$project$FromEnglish$CorianderLeaf = {ctor: 'CorianderLeaf'};
var _user$project$FromEnglish$Corduroy = {ctor: 'Corduroy'};
var _user$project$FromEnglish$Cordura = {ctor: 'Cordura'};
var _user$project$FromEnglish$CopyrightYear = {ctor: 'CopyrightYear'};
var _user$project$FromEnglish$CopyrightHolder = {ctor: 'CopyrightHolder'};
var _user$project$FromEnglish$Coolmax = {ctor: 'Coolmax'};
var _user$project$FromEnglish$CoolJazz = {ctor: 'CoolJazz'};
var _user$project$FromEnglish$CookingMethod = {ctor: 'CookingMethod'};
var _user$project$FromEnglish$CookTime = {ctor: 'CookTime'};
var _user$project$FromEnglish$CookAction = {ctor: 'CookAction'};
var _user$project$FromEnglish$Conversation = {ctor: 'Conversation'};
var _user$project$FromEnglish$ConvenienceStore = {ctor: 'ConvenienceStore'};
var _user$project$FromEnglish$ControlAction = {ctor: 'ControlAction'};
var _user$project$FromEnglish$Contributor = {ctor: 'Contributor'};
var _user$project$FromEnglish$Continue = {ctor: 'Continue'};
var _user$project$FromEnglish$ContinentalJazz = {ctor: 'ContinentalJazz'};
var _user$project$FromEnglish$Continent = {ctor: 'Continent'};
var _user$project$FromEnglish$ContentUrl = {ctor: 'ContentUrl'};
var _user$project$FromEnglish$ContentType = {ctor: 'ContentType'};
var _user$project$FromEnglish$ContentSize = {ctor: 'ContentSize'};
var _user$project$FromEnglish$ContentRating = {ctor: 'ContentRating'};
var _user$project$FromEnglish$ContentLocation = {ctor: 'ContentLocation'};
var _user$project$FromEnglish$ContemporaryFolk = {ctor: 'ContemporaryFolk'};
var _user$project$FromEnglish$ContainsSeason = {ctor: 'ContainsSeason'};
var _user$project$FromEnglish$ContainsPlace = {ctor: 'ContainsPlace'};
var _user$project$FromEnglish$ContainedInPlace = {ctor: 'ContainedInPlace'};
var _user$project$FromEnglish$ContainedIn = {ctor: 'ContainedIn'};
var _user$project$FromEnglish$Contain = {ctor: 'Contain'};
var _user$project$FromEnglish$ContactType = {ctor: 'ContactType'};
var _user$project$FromEnglish$ContactPoints = {ctor: 'ContactPoints'};
var _user$project$FromEnglish$ContactPointOption = {ctor: 'ContactPointOption'};
var _user$project$FromEnglish$ContactPoint = {ctor: 'ContactPoint'};
var _user$project$FromEnglish$ContactPage = {ctor: 'ContactPage'};
var _user$project$FromEnglish$ContactOption = {ctor: 'ContactOption'};
var _user$project$FromEnglish$ConsumeAction = {ctor: 'ConsumeAction'};
var _user$project$FromEnglish$Consist = {ctor: 'Consist'};
var _user$project$FromEnglish$Consider = {ctor: 'Consider'};
var _user$project$FromEnglish$Connected = {ctor: 'Connected'};
var _user$project$FromEnglish$Confuse = {ctor: 'Confuse'};
var _user$project$FromEnglish$ConfirmationNumber = {ctor: 'ConfirmationNumber'};
var _user$project$FromEnglish$ConfirmAction = {ctor: 'ConfirmAction'};
var _user$project$FromEnglish$Confess = {ctor: 'Confess'};
var _user$project$FromEnglish$Conductive = {ctor: 'Conductive'};
var _user$project$FromEnglish$Concrete = {ctor: 'Concrete'};
var _user$project$FromEnglish$Concern = {ctor: 'Concern'};
var _user$project$FromEnglish$Concentrated = {ctor: 'Concentrated'};
var _user$project$FromEnglish$Concentrate = {ctor: 'Concentrate'};
var _user$project$FromEnglish$ComputerStore = {ctor: 'ComputerStore'};
var _user$project$FromEnglish$ComputerLanguage = {ctor: 'ComputerLanguage'};
var _user$project$FromEnglish$CompoundPriceSpecification = {ctor: 'CompoundPriceSpecification'};
var _user$project$FromEnglish$Composer = {ctor: 'Composer'};
var _user$project$FromEnglish$Complex = {ctor: 'Complex'};
var _user$project$FromEnglish$CompletedActionStatus = {ctor: 'CompletedActionStatus'};
var _user$project$FromEnglish$Complete = {ctor: 'Complete'};
var _user$project$FromEnglish$Complain = {ctor: 'Complain'};
var _user$project$FromEnglish$CompilationAlbum = {ctor: 'CompilationAlbum'};
var _user$project$FromEnglish$Competitor = {ctor: 'Competitor'};
var _user$project$FromEnglish$Compete = {ctor: 'Compete'};
var _user$project$FromEnglish$Compare = {ctor: 'Compare'};
var _user$project$FromEnglish$CommunicateAction = {ctor: 'CommunicateAction'};
var _user$project$FromEnglish$Communicate = {ctor: 'Communicate'};
var _user$project$FromEnglish$CommentTime = {ctor: 'CommentTime'};
var _user$project$FromEnglish$CommentText = {ctor: 'CommentText'};
var _user$project$FromEnglish$CommentPermission = {ctor: 'CommentPermission'};
var _user$project$FromEnglish$CommentCount = {ctor: 'CommentCount'};
var _user$project$FromEnglish$CommentAction = {ctor: 'CommentAction'};
var _user$project$FromEnglish$Comment = {ctor: 'Comment'};
var _user$project$FromEnglish$Command = {ctor: 'Command'};
var _user$project$FromEnglish$ComedyEvent = {ctor: 'ComedyEvent'};
var _user$project$FromEnglish$ComedyClub = {ctor: 'ComedyClub'};
var _user$project$FromEnglish$CollegeOrUniversity = {ctor: 'CollegeOrUniversity'};
var _user$project$FromEnglish$CollectionPage = {ctor: 'CollectionPage'};
var _user$project$FromEnglish$Collection = {ctor: 'Collection'};
var _user$project$FromEnglish$Collect = {ctor: 'Collect'};
var _user$project$FromEnglish$CollardGreen = {ctor: 'CollardGreen'};
var _user$project$FromEnglish$CodeSampleType = {ctor: 'CodeSampleType'};
var _user$project$FromEnglish$CodeRepository = {ctor: 'CodeRepository'};
var _user$project$FromEnglish$Code = {ctor: 'Code'};
var _user$project$FromEnglish$Coconut = {ctor: 'Coconut'};
var _user$project$FromEnglish$CocktailSauce = {ctor: 'CocktailSauce'};
var _user$project$FromEnglish$Cobalt = {ctor: 'Cobalt'};
var _user$project$FromEnglish$Coach = {ctor: 'Coach'};
var _user$project$FromEnglish$Clove = {ctor: 'Clove'};
var _user$project$FromEnglish$Cloudberry = {ctor: 'Cloudberry'};
var _user$project$FromEnglish$ClothingStore = {ctor: 'ClothingStore'};
var _user$project$FromEnglish$ClothOfGold = {ctor: 'ClothOfGold'};
var _user$project$FromEnglish$Closes = {ctor: 'Closes'};
var _user$project$FromEnglish$Closed = {ctor: 'Closed'};
var _user$project$FromEnglish$ClipNumber = {ctor: 'ClipNumber'};
var _user$project$FromEnglish$Clip = {ctor: 'Clip'};
var _user$project$FromEnglish$Clementine = {ctor: 'Clementine'};
var _user$project$FromEnglish$Clean = {ctor: 'Clean'};
var _user$project$FromEnglish$ClassicTrance = {ctor: 'ClassicTrance'};
var _user$project$FromEnglish$ClaimReviewed = {ctor: 'ClaimReviewed'};
var _user$project$FromEnglish$Claim = {ctor: 'Claim'};
var _user$project$FromEnglish$CivicStructure = {ctor: 'CivicStructure'};
var _user$project$FromEnglish$CityHall = {ctor: 'CityHall'};
var _user$project$FromEnglish$Citation = {ctor: 'Citation'};
var _user$project$FromEnglish$Cinnamon = {ctor: 'Cinnamon'};
var _user$project$FromEnglish$CinderBlock = {ctor: 'CinderBlock'};
var _user$project$FromEnglish$Cilantro = {ctor: 'Cilantro'};
var _user$project$FromEnglish$CigarBox = {ctor: 'CigarBox'};
var _user$project$FromEnglish$Cicely = {ctor: 'Cicely'};
var _user$project$FromEnglish$Chutney = {ctor: 'Chutney'};
var _user$project$FromEnglish$Church = {ctor: 'Church'};
var _user$project$FromEnglish$Chromium = {ctor: 'Chromium'};
var _user$project$FromEnglish$ChristianRock = {ctor: 'ChristianRock'};
var _user$project$FromEnglish$ChristianPunk = {ctor: 'ChristianPunk'};
var _user$project$FromEnglish$ChristianMetal = {ctor: 'ChristianMetal'};
var _user$project$FromEnglish$Chop = {ctor: 'Chop'};
var _user$project$FromEnglish$ChooseAction = {ctor: 'ChooseAction'};
var _user$project$FromEnglish$CholesterolContent = {ctor: 'CholesterolContent'};
var _user$project$FromEnglish$Choke = {ctor: 'Choke'};
var _user$project$FromEnglish$Chocolaty = {ctor: 'Chocolaty'};
var _user$project$FromEnglish$Chives = {ctor: 'Chives'};
var _user$project$FromEnglish$Chintz = {ctor: 'Chintz'};
var _user$project$FromEnglish$Chino = {ctor: 'Chino'};
var _user$project$FromEnglish$ChineseRock = {ctor: 'ChineseRock'};
var _user$project$FromEnglish$Chimichurri = {ctor: 'Chimichurri'};
var _user$project$FromEnglish$ChillOut = {ctor: 'ChillOut'};
var _user$project$FromEnglish$ChiliSauce = {ctor: 'ChiliSauce'};
var _user$project$FromEnglish$ChiliPowder = {ctor: 'ChiliPowder'};
var _user$project$FromEnglish$ChiliPeppers = {ctor: 'ChiliPeppers'};
var _user$project$FromEnglish$ChiliPepper = {ctor: 'ChiliPepper'};
var _user$project$FromEnglish$ChiliOil = {ctor: 'ChiliOil'};
var _user$project$FromEnglish$ChildMinAge = {ctor: 'ChildMinAge'};
var _user$project$FromEnglish$ChildMaxAge = {ctor: 'ChildMaxAge'};
var _user$project$FromEnglish$ChildCare = {ctor: 'ChildCare'};
var _user$project$FromEnglish$Chiffon = {ctor: 'Chiffon'};
var _user$project$FromEnglish$Chickpea = {ctor: 'Chickpea'};
var _user$project$FromEnglish$ChicagoHouse = {ctor: 'ChicagoHouse'};
var _user$project$FromEnglish$Chewy = {ctor: 'Chewy'};
var _user$project$FromEnglish$Chervil = {ctor: 'Chervil'};
var _user$project$FromEnglish$Cherry = {ctor: 'Cherry'};
var _user$project$FromEnglish$Cherimoya = {ctor: 'Cherimoya'};
var _user$project$FromEnglish$Chenille = {ctor: 'Chenille'};
var _user$project$FromEnglish$Cheesecloth = {ctor: 'Cheesecloth'};
var _user$project$FromEnglish$CheckoutTime = {ctor: 'CheckoutTime'};
var _user$project$FromEnglish$CheckoutPage = {ctor: 'CheckoutPage'};
var _user$project$FromEnglish$CheckinTime = {ctor: 'CheckinTime'};
var _user$project$FromEnglish$CheckOutAction = {ctor: 'CheckOutAction'};
var _user$project$FromEnglish$CheckInAction = {ctor: 'CheckInAction'};
var _user$project$FromEnglish$CheckAction = {ctor: 'CheckAction'};
var _user$project$FromEnglish$CheatCode = {ctor: 'CheatCode'};
var _user$project$FromEnglish$Cheat = {ctor: 'Cheat'};
var _user$project$FromEnglish$Chase = {ctor: 'Chase'};
var _user$project$FromEnglish$Charmeuse = {ctor: 'Charmeuse'};
var _user$project$FromEnglish$Charcoal = {ctor: 'Charcoal'};
var _user$project$FromEnglish$CharacterName = {ctor: 'CharacterName'};
var _user$project$FromEnglish$CharacterAttribute = {ctor: 'CharacterAttribute'};
var _user$project$FromEnglish$CharCloth = {ctor: 'CharCloth'};
var _user$project$FromEnglish$Change = {ctor: 'Change'};
var _user$project$FromEnglish$Chamomile = {ctor: 'Chamomile'};
var _user$project$FromEnglish$Chambray = {ctor: 'Chambray'};
var _user$project$FromEnglish$ChamberJazz = {ctor: 'ChamberJazz'};
var _user$project$FromEnglish$Challenge = {ctor: 'Challenge'};
var _user$project$FromEnglish$ChaatMasala = {ctor: 'ChaatMasala'};
var _user$project$FromEnglish$Cesium = {ctor: 'Cesium'};
var _user$project$FromEnglish$CeramicTile = {ctor: 'CeramicTile'};
var _user$project$FromEnglish$Cemetery = {ctor: 'Cemetery'};
var _user$project$FromEnglish$Cement = {ctor: 'Cement'};
var _user$project$FromEnglish$CelticPunk = {ctor: 'CelticPunk'};
var _user$project$FromEnglish$CelticMetal = {ctor: 'CelticMetal'};
var _user$project$FromEnglish$Celtic = {ctor: 'Celtic'};
var _user$project$FromEnglish$CelerySeed = {ctor: 'CelerySeed'};
var _user$project$FromEnglish$CeleryPowder = {ctor: 'CeleryPowder'};
var _user$project$FromEnglish$Celery = {ctor: 'Celery'};
var _user$project$FromEnglish$Celeriac = {ctor: 'Celeriac'};
var _user$project$FromEnglish$CedarBark = {ctor: 'CedarBark'};
var _user$project$FromEnglish$CayennePepper = {ctor: 'CayennePepper'};
var _user$project$FromEnglish$Cause = {ctor: 'Cause'};
var _user$project$FromEnglish$Cauliflower = {ctor: 'Cauliflower'};
var _user$project$FromEnglish$CatholicChurch = {ctor: 'CatholicChurch'};
var _user$project$FromEnglish$Category = {ctor: 'Category'};
var _user$project$FromEnglish$CatalogNumber = {ctor: 'CatalogNumber'};
var _user$project$FromEnglish$Catalog = {ctor: 'Catalog'};
var _user$project$FromEnglish$CatPee = {ctor: 'CatPee'};
var _user$project$FromEnglish$Cassis = {ctor: 'Cassis'};
var _user$project$FromEnglish$CassetteFormat = {ctor: 'CassetteFormat'};
var _user$project$FromEnglish$Casino = {ctor: 'Casino'};
var _user$project$FromEnglish$Cashmere = {ctor: 'Cashmere'};
var _user$project$FromEnglish$Carrot = {ctor: 'Carrot'};
var _user$project$FromEnglish$CarrierRequirements = {ctor: 'CarrierRequirements'};
var _user$project$FromEnglish$Carpet = {ctor: 'Carpet'};
var _user$project$FromEnglish$CargoVolume = {ctor: 'CargoVolume'};
var _user$project$FromEnglish$Cardamom = {ctor: 'Cardamom'};
var _user$project$FromEnglish$CarbonFiber = {ctor: 'CarbonFiber'};
var _user$project$FromEnglish$CarbohydrateContent = {ctor: 'CarbohydrateContent'};
var _user$project$FromEnglish$Caraway = {ctor: 'Caraway'};
var _user$project$FromEnglish$Caption = {ctor: 'Caption'};
var _user$project$FromEnglish$CapeJazz = {ctor: 'CapeJazz'};
var _user$project$FromEnglish$Canvas = {ctor: 'Canvas'};
var _user$project$FromEnglish$CanterburyScene = {ctor: 'CanterburyScene'};
var _user$project$FromEnglish$Cantaloupe = {ctor: 'Cantaloupe'};
var _user$project$FromEnglish$Candidate = {ctor: 'Candidate'};
var _user$project$FromEnglish$CancelAction = {ctor: 'CancelAction'};
var _user$project$FromEnglish$CanaryMelon = {ctor: 'CanaryMelon'};
var _user$project$FromEnglish$Canal = {ctor: 'Canal'};
var _user$project$FromEnglish$CampingPitch = {ctor: 'CampingPitch'};
var _user$project$FromEnglish$Campground = {ctor: 'Campground'};
var _user$project$FromEnglish$Camp = {ctor: 'Camp'};
var _user$project$FromEnglish$Cambric = {ctor: 'Cambric'};
var _user$project$FromEnglish$Calories = {ctor: 'Calories'};
var _user$project$FromEnglish$Californium = {ctor: 'Californium'};
var _user$project$FromEnglish$Calico = {ctor: 'Calico'};
var _user$project$FromEnglish$Calculate = {ctor: 'Calculate'};
var _user$project$FromEnglish$Calcium = {ctor: 'Calcium'};
var _user$project$FromEnglish$Calabrese = {ctor: 'Calabrese'};
var _user$project$FromEnglish$CafeOrCoffeeShop = {ctor: 'CafeOrCoffeeShop'};
var _user$project$FromEnglish$Cadmium = {ctor: 'Cadmium'};
var _user$project$FromEnglish$CableOrSatelliteService = {ctor: 'CableOrSatelliteService'};
var _user$project$FromEnglish$Cabbage = {ctor: 'Cabbage'};
var _user$project$FromEnglish$ByArtist = {ctor: 'ByArtist'};
var _user$project$FromEnglish$Buttery = {ctor: 'Buttery'};
var _user$project$FromEnglish$ButternutSquash = {ctor: 'ButternutSquash'};
var _user$project$FromEnglish$BusinessFunction = {ctor: 'BusinessFunction'};
var _user$project$FromEnglish$BusinessEvent = {ctor: 'BusinessEvent'};
var _user$project$FromEnglish$BusinessEntityType = {ctor: 'BusinessEntityType'};
var _user$project$FromEnglish$BusinessAudience = {ctor: 'BusinessAudience'};
var _user$project$FromEnglish$BusTrip = {ctor: 'BusTrip'};
var _user$project$FromEnglish$BusStop = {ctor: 'BusStop'};
var _user$project$FromEnglish$BusStation = {ctor: 'BusStation'};
var _user$project$FromEnglish$BusReservation = {ctor: 'BusReservation'};
var _user$project$FromEnglish$BusNumber = {ctor: 'BusNumber'};
var _user$project$FromEnglish$BusName = {ctor: 'BusName'};
var _user$project$FromEnglish$Burlap = {ctor: 'Burlap'};
var _user$project$FromEnglish$Bunting = {ctor: 'Bunting'};
var _user$project$FromEnglish$Bump = {ctor: 'Bump'};
var _user$project$FromEnglish$BuddhistTemple = {ctor: 'BuddhistTemple'};
var _user$project$FromEnglish$Buckram = {ctor: 'Buckram'};
var _user$project$FromEnglish$BubblegumDance = {ctor: 'BubblegumDance'};
var _user$project$FromEnglish$Bubble = {ctor: 'Bubble'};
var _user$project$FromEnglish$BrusselsSprout = {ctor: 'BrusselsSprout'};
var _user$project$FromEnglish$Brush = {ctor: 'Brush'};
var _user$project$FromEnglish$Bruise = {ctor: 'Bruise'};
var _user$project$FromEnglish$BrowserRequirements = {ctor: 'BrowserRequirements'};
var _user$project$FromEnglish$BrownMustard = {ctor: 'BrownMustard'};
var _user$project$FromEnglish$BrokenBeat = {ctor: 'BrokenBeat'};
var _user$project$FromEnglish$Broccoli = {ctor: 'Broccoli'};
var _user$project$FromEnglish$Broccoflower = {ctor: 'Broccoflower'};
var _user$project$FromEnglish$Brocade = {ctor: 'Brocade'};
var _user$project$FromEnglish$Broadcloth = {ctor: 'Broadcloth'};
var _user$project$FromEnglish$Broadcaster = {ctor: 'Broadcaster'};
var _user$project$FromEnglish$BroadcastTimezone = {ctor: 'BroadcastTimezone'};
var _user$project$FromEnglish$BroadcastServiceTier = {ctor: 'BroadcastServiceTier'};
var _user$project$FromEnglish$BroadcastService = {ctor: 'BroadcastService'};
var _user$project$FromEnglish$BroadcastRelease = {ctor: 'BroadcastRelease'};
var _user$project$FromEnglish$BroadcastOfEvent = {ctor: 'BroadcastOfEvent'};
var _user$project$FromEnglish$BroadcastEvent = {ctor: 'BroadcastEvent'};
var _user$project$FromEnglish$BroadcastDisplayName = {ctor: 'BroadcastDisplayName'};
var _user$project$FromEnglish$BroadcastChannelId = {ctor: 'BroadcastChannelId'};
var _user$project$FromEnglish$BroadcastChannel = {ctor: 'BroadcastChannel'};
var _user$project$FromEnglish$BroadcastAffiliateOf = {ctor: 'BroadcastAffiliateOf'};
var _user$project$FromEnglish$BroadBeans = {ctor: 'BroadBeans'};
var _user$project$FromEnglish$Britpop = {ctor: 'Britpop'};
var _user$project$FromEnglish$BritishDance = {ctor: 'BritishDance'};
var _user$project$FromEnglish$Brilliantine = {ctor: 'Brilliantine'};
var _user$project$FromEnglish$Brilliance = {ctor: 'Brilliance'};
var _user$project$FromEnglish$Bright = {ctor: 'Bright'};
var _user$project$FromEnglish$Bridge = {ctor: 'Bridge'};
var _user$project$FromEnglish$Brewery = {ctor: 'Brewery'};
var _user$project$FromEnglish$Breathe = {ctor: 'Breathe'};
var _user$project$FromEnglish$BreakbeatHardcore = {ctor: 'BreakbeatHardcore'};
var _user$project$FromEnglish$Breakbeat = {ctor: 'Breakbeat'};
var _user$project$FromEnglish$Breadfruit = {ctor: 'Breadfruit'};
var _user$project$FromEnglish$BreadcrumbList = {ctor: 'BreadcrumbList'};
var _user$project$FromEnglish$Breadcrumb = {ctor: 'Breadcrumb'};
var _user$project$FromEnglish$BrazilianPepper = {ctor: 'BrazilianPepper'};
var _user$project$FromEnglish$Brand = {ctor: 'Brand'};
var _user$project$FromEnglish$BranchOf = {ctor: 'BranchOf'};
var _user$project$FromEnglish$BranchCode = {ctor: 'BranchCode'};
var _user$project$FromEnglish$Branch = {ctor: 'Branch'};
var _user$project$FromEnglish$Boysenberry = {ctor: 'Boysenberry'};
var _user$project$FromEnglish$Box = {ctor: 'Box'};
var _user$project$FromEnglish$BowlingAlley = {ctor: 'BowlingAlley'};
var _user$project$FromEnglish$BouncyTechno = {ctor: 'BouncyTechno'};
var _user$project$FromEnglish$BouncyHouse = {ctor: 'BouncyHouse'};
var _user$project$FromEnglish$Bounce = {ctor: 'Bounce'};
var _user$project$FromEnglish$BossaNova = {ctor: 'BossaNova'};
var _user$project$FromEnglish$BorrowAction = {ctor: 'BorrowAction'};
var _user$project$FromEnglish$Boolean = {ctor: 'Boolean'};
var _user$project$FromEnglish$BookmarkAction = {ctor: 'BookmarkAction'};
var _user$project$FromEnglish$BookingTime = {ctor: 'BookingTime'};
var _user$project$FromEnglish$BookingAgent = {ctor: 'BookingAgent'};
var _user$project$FromEnglish$BookSeries = {ctor: 'BookSeries'};
var _user$project$FromEnglish$BookFormatType = {ctor: 'BookFormatType'};
var _user$project$FromEnglish$BookFormat = {ctor: 'BookFormat'};
var _user$project$FromEnglish$BookEdition = {ctor: 'BookEdition'};
var _user$project$FromEnglish$Bombazine = {ctor: 'Bombazine'};
var _user$project$FromEnglish$Bolt = {ctor: 'Bolt'};
var _user$project$FromEnglish$BolivianCoriander = {ctor: 'BolivianCoriander'};
var _user$project$FromEnglish$Boldo = {ctor: 'Boldo'};
var _user$project$FromEnglish$BoiledWool = {ctor: 'BoiledWool'};
var _user$project$FromEnglish$Bohrium = {ctor: 'Bohrium'};
var _user$project$FromEnglish$BodyOfWater = {ctor: 'BodyOfWater'};
var _user$project$FromEnglish$Bobbinet = {ctor: 'Bobbinet'};
var _user$project$FromEnglish$Boast = {ctor: 'Boast'};
var _user$project$FromEnglish$BoardingPolicyType = {ctor: 'BoardingPolicyType'};
var _user$project$FromEnglish$BoardingPolicy = {ctor: 'BoardingPolicy'};
var _user$project$FromEnglish$BoardingGroup = {ctor: 'BoardingGroup'};
var _user$project$FromEnglish$Blush = {ctor: 'Blush'};
var _user$project$FromEnglish$Blueberry = {ctor: 'Blueberry'};
var _user$project$FromEnglish$BloodOrange = {ctor: 'BloodOrange'};
var _user$project$FromEnglish$BlogPosts = {ctor: 'BlogPosts'};
var _user$project$FromEnglish$BlogPosting = {ctor: 'BlogPosting'};
var _user$project$FromEnglish$BlogPost = {ctor: 'BlogPost'};
var _user$project$FromEnglish$Blink = {ctor: 'Blink'};
var _user$project$FromEnglish$Blind = {ctor: 'Blind'};
var _user$project$FromEnglish$Bless = {ctor: 'Bless'};
var _user$project$FromEnglish$Bleach = {ctor: 'Bleach'};
var _user$project$FromEnglish$Blackcurrant = {ctor: 'Blackcurrant'};
var _user$project$FromEnglish$Blackberry = {ctor: 'Blackberry'};
var _user$project$FromEnglish$BlackVinegar = {ctor: 'BlackVinegar'};
var _user$project$FromEnglish$BlackPeppercorn = {ctor: 'BlackPeppercorn'};
var _user$project$FromEnglish$BlackMustard = {ctor: 'BlackMustard'};
var _user$project$FromEnglish$BlackMetal = {ctor: 'BlackMetal'};
var _user$project$FromEnglish$BlackEyedPea = {ctor: 'BlackEyedPea'};
var _user$project$FromEnglish$BlackCardamom = {ctor: 'BlackCardamom'};
var _user$project$FromEnglish$BlackBean = {ctor: 'BlackBean'};
var _user$project$FromEnglish$BizarreSilk = {ctor: 'BizarreSilk'};
var _user$project$FromEnglish$Bitter = {ctor: 'Bitter'};
var _user$project$FromEnglish$Bismuth = {ctor: 'Bismuth'};
var _user$project$FromEnglish$BirthPlace = {ctor: 'BirthPlace'};
var _user$project$FromEnglish$BirthDate = {ctor: 'BirthDate'};
var _user$project$FromEnglish$BillingPeriod = {ctor: 'BillingPeriod'};
var _user$project$FromEnglish$BillingIncrement = {ctor: 'BillingIncrement'};
var _user$project$FromEnglish$BillingAddress = {ctor: 'BillingAddress'};
var _user$project$FromEnglish$Bilberry = {ctor: 'Bilberry'};
var _user$project$FromEnglish$BibExTerm = {ctor: 'BibExTerm'};
var _user$project$FromEnglish$BetaCloth = {ctor: 'BetaCloth'};
var _user$project$FromEnglish$BestRating = {ctor: 'BestRating'};
var _user$project$FromEnglish$Beryllium = {ctor: 'Beryllium'};
var _user$project$FromEnglish$Berkelium = {ctor: 'Berkelium'};
var _user$project$FromEnglish$BengalineSilk = {ctor: 'BengalineSilk'};
var _user$project$FromEnglish$Benefits = {ctor: 'Benefits'};
var _user$project$FromEnglish$Belong = {ctor: 'Belong'};
var _user$project$FromEnglish$BellPepper = {ctor: 'BellPepper'};
var _user$project$FromEnglish$BefriendAction = {ctor: 'BefriendAction'};
var _user$project$FromEnglish$BedfordCord = {ctor: 'BedfordCord'};
var _user$project$FromEnglish$BedDetails = {ctor: 'BedDetails'};
var _user$project$FromEnglish$BedAndBreakfast = {ctor: 'BedAndBreakfast'};
var _user$project$FromEnglish$Bed = {ctor: 'Bed'};
var _user$project$FromEnglish$Bebop = {ctor: 'Bebop'};
var _user$project$FromEnglish$BeautySalon = {ctor: 'BeautySalon'};
var _user$project$FromEnglish$BeauMondeSeasoning = {ctor: 'BeauMondeSeasoning'};
var _user$project$FromEnglish$BeatMusic = {ctor: 'BeatMusic'};
var _user$project$FromEnglish$BeanSprout = {ctor: 'BeanSprout'};
var _user$project$FromEnglish$Beach = {ctor: 'Beach'};
var _user$project$FromEnglish$Battle = {ctor: 'Battle'};
var _user$project$FromEnglish$Bat = {ctor: 'Bat'};
var _user$project$FromEnglish$Bassline = {ctor: 'Bassline'};
var _user$project$FromEnglish$Basil = {ctor: 'Basil'};
var _user$project$FromEnglish$BaseSalary = {ctor: 'BaseSalary'};
var _user$project$FromEnglish$Barnyard = {ctor: 'Barnyard'};
var _user$project$FromEnglish$Barcode = {ctor: 'Barcode'};
var _user$project$FromEnglish$BarbecueSauce = {ctor: 'BarbecueSauce'};
var _user$project$FromEnglish$Barathea = {ctor: 'Barathea'};
var _user$project$FromEnglish$BarOrPub = {ctor: 'BarOrPub'};
var _user$project$FromEnglish$BankOrCreditUnion = {ctor: 'BankOrCreditUnion'};
var _user$project$FromEnglish$BankAccount = {ctor: 'BankAccount'};
var _user$project$FromEnglish$BananaSquash = {ctor: 'BananaSquash'};
var _user$project$FromEnglish$BananaKetchup = {ctor: 'BananaKetchup'};
var _user$project$FromEnglish$Banana = {ctor: 'Banana'};
var _user$project$FromEnglish$BaltimoreClub = {ctor: 'BaltimoreClub'};
var _user$project$FromEnglish$BallisticNylon = {ctor: 'BallisticNylon'};
var _user$project$FromEnglish$BalearicBeat = {ctor: 'BalearicBeat'};
var _user$project$FromEnglish$Balanced = {ctor: 'Balanced'};
var _user$project$FromEnglish$Balance = {ctor: 'Balance'};
var _user$project$FromEnglish$Bakery = {ctor: 'Bakery'};
var _user$project$FromEnglish$Baked = {ctor: 'Baked'};
var _user$project$FromEnglish$AwayTeam = {ctor: 'AwayTeam'};
var _user$project$FromEnglish$Avocado = {ctor: 'Avocado'};
var _user$project$FromEnglish$AvantGardeJazz = {ctor: 'AvantGardeJazz'};
var _user$project$FromEnglish$AvailableThrough = {ctor: 'AvailableThrough'};
var _user$project$FromEnglish$AvailableOnDevice = {ctor: 'AvailableOnDevice'};
var _user$project$FromEnglish$AvailableLanguage = {ctor: 'AvailableLanguage'};
var _user$project$FromEnglish$AvailableFrom = {ctor: 'AvailableFrom'};
var _user$project$FromEnglish$AvailableDeliveryMethod = {ctor: 'AvailableDeliveryMethod'};
var _user$project$FromEnglish$AvailableChannel = {ctor: 'AvailableChannel'};
var _user$project$FromEnglish$AvailableAtOrFrom = {ctor: 'AvailableAtOrFrom'};
var _user$project$FromEnglish$AvailabilityStarts = {ctor: 'AvailabilityStarts'};
var _user$project$FromEnglish$AvailabilityEnds = {ctor: 'AvailabilityEnds'};
var _user$project$FromEnglish$Availability = {ctor: 'Availability'};
var _user$project$FromEnglish$AutomotiveOntologyWgclass = {ctor: 'AutomotiveOntologyWgclass'};
var _user$project$FromEnglish$AutomotiveBusiness = {ctor: 'AutomotiveBusiness'};
var _user$project$FromEnglish$AutomatedTeller = {ctor: 'AutomatedTeller'};
var _user$project$FromEnglish$Autolytic = {ctor: 'Autolytic'};
var _user$project$FromEnglish$AutoWash = {ctor: 'AutoWash'};
var _user$project$FromEnglish$AutoRental = {ctor: 'AutoRental'};
var _user$project$FromEnglish$AutoPartsStore = {ctor: 'AutoPartsStore'};
var _user$project$FromEnglish$AutoDealer = {ctor: 'AutoDealer'};
var _user$project$FromEnglish$AutoBodyShop = {ctor: 'AutoBodyShop'};
var _user$project$FromEnglish$AuthorizeAction = {ctor: 'AuthorizeAction'};
var _user$project$FromEnglish$AudiobookFormat = {ctor: 'AudiobookFormat'};
var _user$project$FromEnglish$AudioObject = {ctor: 'AudioObject'};
var _user$project$FromEnglish$AudienceType = {ctor: 'AudienceType'};
var _user$project$FromEnglish$Audience = {ctor: 'Audience'};
var _user$project$FromEnglish$Attendees = {ctor: 'Attendees'};
var _user$project$FromEnglish$Attendee = {ctor: 'Attendee'};
var _user$project$FromEnglish$Attach = {ctor: 'Attach'};
var _user$project$FromEnglish$Astringent = {ctor: 'Astringent'};
var _user$project$FromEnglish$AssociatedMedia = {ctor: 'AssociatedMedia'};
var _user$project$FromEnglish$AssociatedArticle = {ctor: 'AssociatedArticle'};
var _user$project$FromEnglish$AssignAction = {ctor: 'AssignAction'};
var _user$project$FromEnglish$AssessAction = {ctor: 'AssessAction'};
var _user$project$FromEnglish$AssemblyVersion = {ctor: 'AssemblyVersion'};
var _user$project$FromEnglish$Asphalt = {ctor: 'Asphalt'};
var _user$project$FromEnglish$Asparagus = {ctor: 'Asparagus'};
var _user$project$FromEnglish$AskAction = {ctor: 'AskAction'};
var _user$project$FromEnglish$AsianUnderground = {ctor: 'AsianUnderground'};
var _user$project$FromEnglish$Asbestos = {ctor: 'Asbestos'};
var _user$project$FromEnglish$Asafoetida = {ctor: 'Asafoetida'};
var _user$project$FromEnglish$ArtworkSurface = {ctor: 'ArtworkSurface'};
var _user$project$FromEnglish$ArticleSection = {ctor: 'ArticleSection'};
var _user$project$FromEnglish$ArticleBody = {ctor: 'ArticleBody'};
var _user$project$FromEnglish$Article = {ctor: 'Article'};
var _user$project$FromEnglish$Artichoke = {ctor: 'Artichoke'};
var _user$project$FromEnglish$ArtPunk = {ctor: 'ArtPunk'};
var _user$project$FromEnglish$ArtMedium = {ctor: 'ArtMedium'};
var _user$project$FromEnglish$ArtGallery = {ctor: 'ArtGallery'};
var _user$project$FromEnglish$ArtEdition = {ctor: 'ArtEdition'};
var _user$project$FromEnglish$ArriveAction = {ctor: 'ArriveAction'};
var _user$project$FromEnglish$Arrive = {ctor: 'Arrive'};
var _user$project$FromEnglish$ArrivalTime = {ctor: 'ArrivalTime'};
var _user$project$FromEnglish$ArrivalTerminal = {ctor: 'ArrivalTerminal'};
var _user$project$FromEnglish$ArrivalStation = {ctor: 'ArrivalStation'};
var _user$project$FromEnglish$ArrivalPlatform = {ctor: 'ArrivalPlatform'};
var _user$project$FromEnglish$ArrivalGate = {ctor: 'ArrivalGate'};
var _user$project$FromEnglish$ArrivalBusStop = {ctor: 'ArrivalBusStop'};
var _user$project$FromEnglish$ArrivalAirport = {ctor: 'ArrivalAirport'};
var _user$project$FromEnglish$Arrest = {ctor: 'Arrest'};
var _user$project$FromEnglish$Arrange = {ctor: 'Arrange'};
var _user$project$FromEnglish$AromaticGinger = {ctor: 'AromaticGinger'};
var _user$project$FromEnglish$Aquarium = {ctor: 'Aquarium'};
var _user$project$FromEnglish$Apricot = {ctor: 'Apricot'};
var _user$project$FromEnglish$Approve = {ctor: 'Approve'};
var _user$project$FromEnglish$Appreciate = {ctor: 'Appreciate'};
var _user$project$FromEnglish$ApplyAction = {ctor: 'ApplyAction'};
var _user$project$FromEnglish$AppliesToPaymentMethod = {ctor: 'AppliesToPaymentMethod'};
var _user$project$FromEnglish$AppliesToDeliveryMethod = {ctor: 'AppliesToDeliveryMethod'};
var _user$project$FromEnglish$ApplicationSuite = {ctor: 'ApplicationSuite'};
var _user$project$FromEnglish$ApplicationSubCategory = {ctor: 'ApplicationSubCategory'};
var _user$project$FromEnglish$ApplicationCategory = {ctor: 'ApplicationCategory'};
var _user$project$FromEnglish$Apologise = {ctor: 'Apologise'};
var _user$project$FromEnglish$ApartmentComplex = {ctor: 'ApartmentComplex'};
var _user$project$FromEnglish$Apartment = {ctor: 'Apartment'};
var _user$project$FromEnglish$AntiFolk = {ctor: 'AntiFolk'};
var _user$project$FromEnglish$AnswerCount = {ctor: 'AnswerCount'};
var _user$project$FromEnglish$Answer = {ctor: 'Answer'};
var _user$project$FromEnglish$AnnualPercentageRate = {ctor: 'AnnualPercentageRate'};
var _user$project$FromEnglish$Announce = {ctor: 'Announce'};
var _user$project$FromEnglish$Anise = {ctor: 'Anise'};
var _user$project$FromEnglish$AnimalShelter = {ctor: 'AnimalShelter'};
var _user$project$FromEnglish$Angular = {ctor: 'Angular'};
var _user$project$FromEnglish$Angelica = {ctor: 'Angelica'};
var _user$project$FromEnglish$AmusementPark = {ctor: 'AmusementPark'};
var _user$project$FromEnglish$Amuse = {ctor: 'Amuse'};
var _user$project$FromEnglish$AmountOfThisGood = {ctor: 'AmountOfThisGood'};
var _user$project$FromEnglish$Americium = {ctor: 'Americium'};
var _user$project$FromEnglish$AmenityFeature = {ctor: 'AmenityFeature'};
var _user$project$FromEnglish$AmbientTechno = {ctor: 'AmbientTechno'};
var _user$project$FromEnglish$AmbientHouse = {ctor: 'AmbientHouse'};
var _user$project$FromEnglish$AmbientDub = {ctor: 'AmbientDub'};
var _user$project$FromEnglish$Ambient = {ctor: 'Ambient'};
var _user$project$FromEnglish$Amaranth = {ctor: 'Amaranth'};
var _user$project$FromEnglish$AlumniOf = {ctor: 'AlumniOf'};
var _user$project$FromEnglish$Alumni = {ctor: 'Alumni'};
var _user$project$FromEnglish$Aluminum = {ctor: 'Aluminum'};
var _user$project$FromEnglish$Aluminium = {ctor: 'Aluminium'};
var _user$project$FromEnglish$AlternativeRock = {ctor: 'AlternativeRock'};
var _user$project$FromEnglish$AlternativeMetal = {ctor: 'AlternativeMetal'};
var _user$project$FromEnglish$AlternativeHeadline = {ctor: 'AlternativeHeadline'};
var _user$project$FromEnglish$AlternativeDance = {ctor: 'AlternativeDance'};
var _user$project$FromEnglish$AlternateName = {ctor: 'AlternateName'};
var _user$project$FromEnglish$Alpaca = {ctor: 'Alpaca'};
var _user$project$FromEnglish$Allspice = {ctor: 'Allspice'};
var _user$project$FromEnglish$AllocateAction = {ctor: 'AllocateAction'};
var _user$project$FromEnglish$AlligatorPepper = {ctor: 'AlligatorPepper'};
var _user$project$FromEnglish$AllWheelDriveConfiguration = {ctor: 'AllWheelDriveConfiguration'};
var _user$project$FromEnglish$AlignmentType = {ctor: 'AlignmentType'};
var _user$project$FromEnglish$AlignmentObject = {ctor: 'AlignmentObject'};
var _user$project$FromEnglish$AlfalfaSprout = {ctor: 'AlfalfaSprout'};
var _user$project$FromEnglish$Alcoholic = {ctor: 'Alcoholic'};
var _user$project$FromEnglish$Albums = {ctor: 'Albums'};
var _user$project$FromEnglish$AlbumReleaseType = {ctor: 'AlbumReleaseType'};
var _user$project$FromEnglish$AlbumRelease = {ctor: 'AlbumRelease'};
var _user$project$FromEnglish$AlbumProductionType = {ctor: 'AlbumProductionType'};
var _user$project$FromEnglish$Aircraft = {ctor: 'Aircraft'};
var _user$project$FromEnglish$AgreeAction = {ctor: 'AgreeAction'};
var _user$project$FromEnglish$AggregateRating = {ctor: 'AggregateRating'};
var _user$project$FromEnglish$AggregateOffer = {ctor: 'AggregateOffer'};
var _user$project$FromEnglish$Affiliation = {ctor: 'Affiliation'};
var _user$project$FromEnglish$Advise = {ctor: 'Advise'};
var _user$project$FromEnglish$AdvanceBookingRequirement = {ctor: 'AdvanceBookingRequirement'};
var _user$project$FromEnglish$AdultEntertainment = {ctor: 'AdultEntertainment'};
var _user$project$FromEnglish$Admit = {ctor: 'Admit'};
var _user$project$FromEnglish$Admire = {ctor: 'Admire'};
var _user$project$FromEnglish$AdministrativeArea = {ctor: 'AdministrativeArea'};
var _user$project$FromEnglish$AddressRegion = {ctor: 'AddressRegion'};
var _user$project$FromEnglish$AddressLocality = {ctor: 'AddressLocality'};
var _user$project$FromEnglish$AddressCountry = {ctor: 'AddressCountry'};
var _user$project$FromEnglish$AdditionalType = {ctor: 'AdditionalType'};
var _user$project$FromEnglish$AdditionalProperty = {ctor: 'AdditionalProperty'};
var _user$project$FromEnglish$AdditionalNumberOfGuests = {ctor: 'AdditionalNumberOfGuests'};
var _user$project$FromEnglish$AdditionalName = {ctor: 'AdditionalName'};
var _user$project$FromEnglish$Actors = {ctor: 'Actors'};
var _user$project$FromEnglish$ActiveActionStatus = {ctor: 'ActiveActionStatus'};
var _user$project$FromEnglish$ActivateAction = {ctor: 'ActivateAction'};
var _user$project$FromEnglish$ActionStatusType = {ctor: 'ActionStatusType'};
var _user$project$FromEnglish$ActionStatus = {ctor: 'ActionStatus'};
var _user$project$FromEnglish$ActionPlatform = {ctor: 'ActionPlatform'};
var _user$project$FromEnglish$ActionOption = {ctor: 'ActionOption'};
var _user$project$FromEnglish$ActionCollabClass = {ctor: 'ActionCollabClass'};
var _user$project$FromEnglish$ActionApplication = {ctor: 'ActionApplication'};
var _user$project$FromEnglish$Action = {ctor: 'Action'};
var _user$project$FromEnglish$Actinium = {ctor: 'Actinium'};
var _user$project$FromEnglish$Acrylic = {ctor: 'Acrylic'};
var _user$project$FromEnglish$AcquiredFrom = {ctor: 'AcquiredFrom'};
var _user$project$FromEnglish$AcornSquash = {ctor: 'AcornSquash'};
var _user$project$FromEnglish$Acidic = {ctor: 'Acidic'};
var _user$project$FromEnglish$AcidTrance = {ctor: 'AcidTrance'};
var _user$project$FromEnglish$AcidTechno = {ctor: 'AcidTechno'};
var _user$project$FromEnglish$AcidRock = {ctor: 'AcidRock'};
var _user$project$FromEnglish$AcidJazz = {ctor: 'AcidJazz'};
var _user$project$FromEnglish$AcidHouse = {ctor: 'AcidHouse'};
var _user$project$FromEnglish$AcidBreaks = {ctor: 'AcidBreaks'};
var _user$project$FromEnglish$AchieveAction = {ctor: 'AchieveAction'};
var _user$project$FromEnglish$AccountingService = {ctor: 'AccountingService'};
var _user$project$FromEnglish$AccountablePerson = {ctor: 'AccountablePerson'};
var _user$project$FromEnglish$AccountId = {ctor: 'AccountId'};
var _user$project$FromEnglish$Accommodation = {ctor: 'Accommodation'};
var _user$project$FromEnglish$AccessibilitySummary = {ctor: 'AccessibilitySummary'};
var _user$project$FromEnglish$AccessibilityHazard = {ctor: 'AccessibilityHazard'};
var _user$project$FromEnglish$AccessibilityFeature = {ctor: 'AccessibilityFeature'};
var _user$project$FromEnglish$AccessibilityControl = {ctor: 'AccessibilityControl'};
var _user$project$FromEnglish$AccessibilityApi = {ctor: 'AccessibilityApi'};
var _user$project$FromEnglish$AccessModeSufficient = {ctor: 'AccessModeSufficient'};
var _user$project$FromEnglish$AccessMode = {ctor: 'AccessMode'};
var _user$project$FromEnglish$AccessCode = {ctor: 'AccessCode'};
var _user$project$FromEnglish$AcceptsReservations = {ctor: 'AcceptsReservations'};
var _user$project$FromEnglish$AcceptedPaymentMethod = {ctor: 'AcceptedPaymentMethod'};
var _user$project$FromEnglish$AcceptedOffer = {ctor: 'AcceptedOffer'};
var _user$project$FromEnglish$AcceptedAnswer = {ctor: 'AcceptedAnswer'};
var _user$project$FromEnglish$AcceptAction = {ctor: 'AcceptAction'};
var _user$project$FromEnglish$Accept = {ctor: 'Accept'};
var _user$project$FromEnglish$AboutPage = {ctor: 'AboutPage'};
var _user$project$FromEnglish$FictLang = {ctor: 'FictLang'};
var _user$project$FromEnglish$No = {ctor: 'No'};
var _user$project$FromEnglish$Yes = {ctor: 'Yes'};
var _user$project$FromEnglish$C = function (a) {
	return {ctor: 'C', _0: a};
};
var _user$project$FromEnglish$X = function (a) {
	return {ctor: 'X', _0: a};
};
var _user$project$FromEnglish$N = function (a) {
	return {ctor: 'N', _0: a};
};
var _user$project$FromEnglish$Unknown = {ctor: 'Unknown'};
var _user$project$FromEnglish$engToWord = function (s) {
	var _p5 = s;
	switch (_p5) {
		case 'unknown':
			return _user$project$FromEnglish$Unknown;
		case 'yes':
			return _user$project$FromEnglish$Yes;
		case 'no':
			return _user$project$FromEnglish$No;
		case 'fictlang':
			return _user$project$FromEnglish$FictLang;
		case 'about_page':
			return _user$project$FromEnglish$AboutPage;
		case 'accept':
			return _user$project$FromEnglish$Accept;
		case 'accept_action':
			return _user$project$FromEnglish$AcceptAction;
		case 'accepted_answer':
			return _user$project$FromEnglish$AcceptedAnswer;
		case 'accepted_offer':
			return _user$project$FromEnglish$AcceptedOffer;
		case 'accepted_payment_method':
			return _user$project$FromEnglish$AcceptedPaymentMethod;
		case 'accepts_reservations':
			return _user$project$FromEnglish$AcceptsReservations;
		case 'access_code':
			return _user$project$FromEnglish$AccessCode;
		case 'access_mode':
			return _user$project$FromEnglish$AccessMode;
		case 'access_mode_sufficient':
			return _user$project$FromEnglish$AccessModeSufficient;
		case 'accessibility_api':
			return _user$project$FromEnglish$AccessibilityApi;
		case 'accessibility_control':
			return _user$project$FromEnglish$AccessibilityControl;
		case 'accessibility_feature':
			return _user$project$FromEnglish$AccessibilityFeature;
		case 'accessibility_hazard':
			return _user$project$FromEnglish$AccessibilityHazard;
		case 'accessibility_summary':
			return _user$project$FromEnglish$AccessibilitySummary;
		case 'accommodation':
			return _user$project$FromEnglish$Accommodation;
		case 'account_id':
			return _user$project$FromEnglish$AccountId;
		case 'accountable_person':
			return _user$project$FromEnglish$AccountablePerson;
		case 'accounting_service':
			return _user$project$FromEnglish$AccountingService;
		case 'achieve_action':
			return _user$project$FromEnglish$AchieveAction;
		case 'acid_breaks':
			return _user$project$FromEnglish$AcidBreaks;
		case 'acid_house':
			return _user$project$FromEnglish$AcidHouse;
		case 'acid_jazz':
			return _user$project$FromEnglish$AcidJazz;
		case 'acid_rock':
			return _user$project$FromEnglish$AcidRock;
		case 'acid_techno':
			return _user$project$FromEnglish$AcidTechno;
		case 'acid_trance':
			return _user$project$FromEnglish$AcidTrance;
		case 'acidic':
			return _user$project$FromEnglish$Acidic;
		case 'acorn_squash':
			return _user$project$FromEnglish$AcornSquash;
		case 'acquired_from':
			return _user$project$FromEnglish$AcquiredFrom;
		case 'acrylic':
			return _user$project$FromEnglish$Acrylic;
		case 'actinium':
			return _user$project$FromEnglish$Actinium;
		case 'action':
			return _user$project$FromEnglish$Action;
		case 'action_application':
			return _user$project$FromEnglish$ActionApplication;
		case 'action_collab_class':
			return _user$project$FromEnglish$ActionCollabClass;
		case 'action_option':
			return _user$project$FromEnglish$ActionOption;
		case 'action_platform':
			return _user$project$FromEnglish$ActionPlatform;
		case 'action_status':
			return _user$project$FromEnglish$ActionStatus;
		case 'action_status_type':
			return _user$project$FromEnglish$ActionStatusType;
		case 'activate_action':
			return _user$project$FromEnglish$ActivateAction;
		case 'active_action_status':
			return _user$project$FromEnglish$ActiveActionStatus;
		case 'actors':
			return _user$project$FromEnglish$Actors;
		case 'additional_name':
			return _user$project$FromEnglish$AdditionalName;
		case 'additional_number_of_guests':
			return _user$project$FromEnglish$AdditionalNumberOfGuests;
		case 'additional_property':
			return _user$project$FromEnglish$AdditionalProperty;
		case 'additional_type':
			return _user$project$FromEnglish$AdditionalType;
		case 'address_country':
			return _user$project$FromEnglish$AddressCountry;
		case 'address_locality':
			return _user$project$FromEnglish$AddressLocality;
		case 'address_region':
			return _user$project$FromEnglish$AddressRegion;
		case 'administrative_area':
			return _user$project$FromEnglish$AdministrativeArea;
		case 'admire':
			return _user$project$FromEnglish$Admire;
		case 'admit':
			return _user$project$FromEnglish$Admit;
		case 'adult_entertainment':
			return _user$project$FromEnglish$AdultEntertainment;
		case 'advance_booking_requirement':
			return _user$project$FromEnglish$AdvanceBookingRequirement;
		case 'advise':
			return _user$project$FromEnglish$Advise;
		case 'affiliation':
			return _user$project$FromEnglish$Affiliation;
		case 'aggregate_offer':
			return _user$project$FromEnglish$AggregateOffer;
		case 'aggregate_rating':
			return _user$project$FromEnglish$AggregateRating;
		case 'agree_action':
			return _user$project$FromEnglish$AgreeAction;
		case 'aircraft':
			return _user$project$FromEnglish$Aircraft;
		case 'album_production_type':
			return _user$project$FromEnglish$AlbumProductionType;
		case 'album_release':
			return _user$project$FromEnglish$AlbumRelease;
		case 'album_release_type':
			return _user$project$FromEnglish$AlbumReleaseType;
		case 'albums':
			return _user$project$FromEnglish$Albums;
		case 'alcoholic':
			return _user$project$FromEnglish$Alcoholic;
		case 'alfalfa_sprout':
			return _user$project$FromEnglish$AlfalfaSprout;
		case 'alignment_object':
			return _user$project$FromEnglish$AlignmentObject;
		case 'alignment_type':
			return _user$project$FromEnglish$AlignmentType;
		case 'all_wheel_drive_configuration':
			return _user$project$FromEnglish$AllWheelDriveConfiguration;
		case 'alligator_pepper':
			return _user$project$FromEnglish$AlligatorPepper;
		case 'allocate_action':
			return _user$project$FromEnglish$AllocateAction;
		case 'allspice':
			return _user$project$FromEnglish$Allspice;
		case 'alpaca':
			return _user$project$FromEnglish$Alpaca;
		case 'alternate_name':
			return _user$project$FromEnglish$AlternateName;
		case 'alternative_dance':
			return _user$project$FromEnglish$AlternativeDance;
		case 'alternative_headline':
			return _user$project$FromEnglish$AlternativeHeadline;
		case 'alternative_metal':
			return _user$project$FromEnglish$AlternativeMetal;
		case 'alternative_rock':
			return _user$project$FromEnglish$AlternativeRock;
		case 'aluminium':
			return _user$project$FromEnglish$Aluminium;
		case 'aluminum':
			return _user$project$FromEnglish$Aluminum;
		case 'alumni':
			return _user$project$FromEnglish$Alumni;
		case 'alumni_of':
			return _user$project$FromEnglish$AlumniOf;
		case 'amaranth':
			return _user$project$FromEnglish$Amaranth;
		case 'ambient':
			return _user$project$FromEnglish$Ambient;
		case 'ambient_dub':
			return _user$project$FromEnglish$AmbientDub;
		case 'ambient_house':
			return _user$project$FromEnglish$AmbientHouse;
		case 'ambient_techno':
			return _user$project$FromEnglish$AmbientTechno;
		case 'amenity_feature':
			return _user$project$FromEnglish$AmenityFeature;
		case 'americium':
			return _user$project$FromEnglish$Americium;
		case 'amount_of_this_good':
			return _user$project$FromEnglish$AmountOfThisGood;
		case 'amuse':
			return _user$project$FromEnglish$Amuse;
		case 'amusement_park':
			return _user$project$FromEnglish$AmusementPark;
		case 'angelica':
			return _user$project$FromEnglish$Angelica;
		case 'angular':
			return _user$project$FromEnglish$Angular;
		case 'animal_shelter':
			return _user$project$FromEnglish$AnimalShelter;
		case 'anise':
			return _user$project$FromEnglish$Anise;
		case 'announce':
			return _user$project$FromEnglish$Announce;
		case 'annual_percentage_rate':
			return _user$project$FromEnglish$AnnualPercentageRate;
		case 'answer':
			return _user$project$FromEnglish$Answer;
		case 'answer_count':
			return _user$project$FromEnglish$AnswerCount;
		case 'anti_folk':
			return _user$project$FromEnglish$AntiFolk;
		case 'apartment':
			return _user$project$FromEnglish$Apartment;
		case 'apartment_complex':
			return _user$project$FromEnglish$ApartmentComplex;
		case 'apologise':
			return _user$project$FromEnglish$Apologise;
		case 'application_category':
			return _user$project$FromEnglish$ApplicationCategory;
		case 'application_sub_category':
			return _user$project$FromEnglish$ApplicationSubCategory;
		case 'application_suite':
			return _user$project$FromEnglish$ApplicationSuite;
		case 'applies_to_delivery_method':
			return _user$project$FromEnglish$AppliesToDeliveryMethod;
		case 'applies_to_payment_method':
			return _user$project$FromEnglish$AppliesToPaymentMethod;
		case 'apply_action':
			return _user$project$FromEnglish$ApplyAction;
		case 'appreciate':
			return _user$project$FromEnglish$Appreciate;
		case 'approve':
			return _user$project$FromEnglish$Approve;
		case 'apricot':
			return _user$project$FromEnglish$Apricot;
		case 'aquarium':
			return _user$project$FromEnglish$Aquarium;
		case 'aromatic_ginger':
			return _user$project$FromEnglish$AromaticGinger;
		case 'arrange':
			return _user$project$FromEnglish$Arrange;
		case 'arrest':
			return _user$project$FromEnglish$Arrest;
		case 'arrival_airport':
			return _user$project$FromEnglish$ArrivalAirport;
		case 'arrival_bus_stop':
			return _user$project$FromEnglish$ArrivalBusStop;
		case 'arrival_gate':
			return _user$project$FromEnglish$ArrivalGate;
		case 'arrival_platform':
			return _user$project$FromEnglish$ArrivalPlatform;
		case 'arrival_station':
			return _user$project$FromEnglish$ArrivalStation;
		case 'arrival_terminal':
			return _user$project$FromEnglish$ArrivalTerminal;
		case 'arrival_time':
			return _user$project$FromEnglish$ArrivalTime;
		case 'arrive':
			return _user$project$FromEnglish$Arrive;
		case 'arrive_action':
			return _user$project$FromEnglish$ArriveAction;
		case 'art_edition':
			return _user$project$FromEnglish$ArtEdition;
		case 'art_gallery':
			return _user$project$FromEnglish$ArtGallery;
		case 'art_medium':
			return _user$project$FromEnglish$ArtMedium;
		case 'art_punk':
			return _user$project$FromEnglish$ArtPunk;
		case 'artichoke':
			return _user$project$FromEnglish$Artichoke;
		case 'article':
			return _user$project$FromEnglish$Article;
		case 'article_body':
			return _user$project$FromEnglish$ArticleBody;
		case 'article_section':
			return _user$project$FromEnglish$ArticleSection;
		case 'artwork_surface':
			return _user$project$FromEnglish$ArtworkSurface;
		case 'asafoetida':
			return _user$project$FromEnglish$Asafoetida;
		case 'asbestos':
			return _user$project$FromEnglish$Asbestos;
		case 'asian_underground':
			return _user$project$FromEnglish$AsianUnderground;
		case 'ask_action':
			return _user$project$FromEnglish$AskAction;
		case 'asparagus':
			return _user$project$FromEnglish$Asparagus;
		case 'asphalt':
			return _user$project$FromEnglish$Asphalt;
		case 'assembly_version':
			return _user$project$FromEnglish$AssemblyVersion;
		case 'assess_action':
			return _user$project$FromEnglish$AssessAction;
		case 'assign_action':
			return _user$project$FromEnglish$AssignAction;
		case 'associated_article':
			return _user$project$FromEnglish$AssociatedArticle;
		case 'associated_media':
			return _user$project$FromEnglish$AssociatedMedia;
		case 'astringent':
			return _user$project$FromEnglish$Astringent;
		case 'attach':
			return _user$project$FromEnglish$Attach;
		case 'attendee':
			return _user$project$FromEnglish$Attendee;
		case 'attendees':
			return _user$project$FromEnglish$Attendees;
		case 'audience':
			return _user$project$FromEnglish$Audience;
		case 'audience_type':
			return _user$project$FromEnglish$AudienceType;
		case 'audio_object':
			return _user$project$FromEnglish$AudioObject;
		case 'audiobook_format':
			return _user$project$FromEnglish$AudiobookFormat;
		case 'authorize_action':
			return _user$project$FromEnglish$AuthorizeAction;
		case 'auto_body_shop':
			return _user$project$FromEnglish$AutoBodyShop;
		case 'auto_dealer':
			return _user$project$FromEnglish$AutoDealer;
		case 'auto_parts_store':
			return _user$project$FromEnglish$AutoPartsStore;
		case 'auto_rental':
			return _user$project$FromEnglish$AutoRental;
		case 'auto_wash':
			return _user$project$FromEnglish$AutoWash;
		case 'autolytic':
			return _user$project$FromEnglish$Autolytic;
		case 'automated_teller':
			return _user$project$FromEnglish$AutomatedTeller;
		case 'automotive_business':
			return _user$project$FromEnglish$AutomotiveBusiness;
		case 'automotive_ontology_wgclass':
			return _user$project$FromEnglish$AutomotiveOntologyWgclass;
		case 'availability':
			return _user$project$FromEnglish$Availability;
		case 'availability_ends':
			return _user$project$FromEnglish$AvailabilityEnds;
		case 'availability_starts':
			return _user$project$FromEnglish$AvailabilityStarts;
		case 'available_at_or_from':
			return _user$project$FromEnglish$AvailableAtOrFrom;
		case 'available_channel':
			return _user$project$FromEnglish$AvailableChannel;
		case 'available_delivery_method':
			return _user$project$FromEnglish$AvailableDeliveryMethod;
		case 'available_from':
			return _user$project$FromEnglish$AvailableFrom;
		case 'available_language':
			return _user$project$FromEnglish$AvailableLanguage;
		case 'available_on_device':
			return _user$project$FromEnglish$AvailableOnDevice;
		case 'available_through':
			return _user$project$FromEnglish$AvailableThrough;
		case 'avant_garde_jazz':
			return _user$project$FromEnglish$AvantGardeJazz;
		case 'avocado':
			return _user$project$FromEnglish$Avocado;
		case 'away_team':
			return _user$project$FromEnglish$AwayTeam;
		case 'baked':
			return _user$project$FromEnglish$Baked;
		case 'bakery':
			return _user$project$FromEnglish$Bakery;
		case 'balance':
			return _user$project$FromEnglish$Balance;
		case 'balanced':
			return _user$project$FromEnglish$Balanced;
		case 'balearic_beat':
			return _user$project$FromEnglish$BalearicBeat;
		case 'ballistic_nylon':
			return _user$project$FromEnglish$BallisticNylon;
		case 'baltimore_club':
			return _user$project$FromEnglish$BaltimoreClub;
		case 'banana':
			return _user$project$FromEnglish$Banana;
		case 'banana_ketchup':
			return _user$project$FromEnglish$BananaKetchup;
		case 'banana_squash':
			return _user$project$FromEnglish$BananaSquash;
		case 'bank_account':
			return _user$project$FromEnglish$BankAccount;
		case 'bank_or_credit_union':
			return _user$project$FromEnglish$BankOrCreditUnion;
		case 'bar_or_pub':
			return _user$project$FromEnglish$BarOrPub;
		case 'barathea':
			return _user$project$FromEnglish$Barathea;
		case 'barbecue_sauce':
			return _user$project$FromEnglish$BarbecueSauce;
		case 'barcode':
			return _user$project$FromEnglish$Barcode;
		case 'barnyard':
			return _user$project$FromEnglish$Barnyard;
		case 'base_salary':
			return _user$project$FromEnglish$BaseSalary;
		case 'basil':
			return _user$project$FromEnglish$Basil;
		case 'bassline':
			return _user$project$FromEnglish$Bassline;
		case 'bat':
			return _user$project$FromEnglish$Bat;
		case 'battle':
			return _user$project$FromEnglish$Battle;
		case 'beach':
			return _user$project$FromEnglish$Beach;
		case 'bean_sprout':
			return _user$project$FromEnglish$BeanSprout;
		case 'beat_music':
			return _user$project$FromEnglish$BeatMusic;
		case 'beau_monde_seasoning':
			return _user$project$FromEnglish$BeauMondeSeasoning;
		case 'beauty_salon':
			return _user$project$FromEnglish$BeautySalon;
		case 'bebop':
			return _user$project$FromEnglish$Bebop;
		case 'bed':
			return _user$project$FromEnglish$Bed;
		case 'bed_and_breakfast':
			return _user$project$FromEnglish$BedAndBreakfast;
		case 'bed_details':
			return _user$project$FromEnglish$BedDetails;
		case 'bedford_cord':
			return _user$project$FromEnglish$BedfordCord;
		case 'befriend_action':
			return _user$project$FromEnglish$BefriendAction;
		case 'bell_pepper':
			return _user$project$FromEnglish$BellPepper;
		case 'belong':
			return _user$project$FromEnglish$Belong;
		case 'benefits':
			return _user$project$FromEnglish$Benefits;
		case 'bengaline_silk':
			return _user$project$FromEnglish$BengalineSilk;
		case 'berkelium':
			return _user$project$FromEnglish$Berkelium;
		case 'beryllium':
			return _user$project$FromEnglish$Beryllium;
		case 'best_rating':
			return _user$project$FromEnglish$BestRating;
		case 'beta_cloth':
			return _user$project$FromEnglish$BetaCloth;
		case 'bib_ex_term':
			return _user$project$FromEnglish$BibExTerm;
		case 'bilberry':
			return _user$project$FromEnglish$Bilberry;
		case 'billing_address':
			return _user$project$FromEnglish$BillingAddress;
		case 'billing_increment':
			return _user$project$FromEnglish$BillingIncrement;
		case 'billing_period':
			return _user$project$FromEnglish$BillingPeriod;
		case 'birth_date':
			return _user$project$FromEnglish$BirthDate;
		case 'birth_place':
			return _user$project$FromEnglish$BirthPlace;
		case 'bismuth':
			return _user$project$FromEnglish$Bismuth;
		case 'bitter':
			return _user$project$FromEnglish$Bitter;
		case 'bizarre_silk':
			return _user$project$FromEnglish$BizarreSilk;
		case 'black_bean':
			return _user$project$FromEnglish$BlackBean;
		case 'black_cardamom':
			return _user$project$FromEnglish$BlackCardamom;
		case 'black_eyed_pea':
			return _user$project$FromEnglish$BlackEyedPea;
		case 'black_metal':
			return _user$project$FromEnglish$BlackMetal;
		case 'black_mustard':
			return _user$project$FromEnglish$BlackMustard;
		case 'black_peppercorn':
			return _user$project$FromEnglish$BlackPeppercorn;
		case 'black_vinegar':
			return _user$project$FromEnglish$BlackVinegar;
		case 'blackberry':
			return _user$project$FromEnglish$Blackberry;
		case 'blackcurrant':
			return _user$project$FromEnglish$Blackcurrant;
		case 'bleach':
			return _user$project$FromEnglish$Bleach;
		case 'bless':
			return _user$project$FromEnglish$Bless;
		case 'blind':
			return _user$project$FromEnglish$Blind;
		case 'blink':
			return _user$project$FromEnglish$Blink;
		case 'blog_post':
			return _user$project$FromEnglish$BlogPost;
		case 'blog_posting':
			return _user$project$FromEnglish$BlogPosting;
		case 'blog_posts':
			return _user$project$FromEnglish$BlogPosts;
		case 'blood_orange':
			return _user$project$FromEnglish$BloodOrange;
		case 'blueberry':
			return _user$project$FromEnglish$Blueberry;
		case 'blush':
			return _user$project$FromEnglish$Blush;
		case 'boarding_group':
			return _user$project$FromEnglish$BoardingGroup;
		case 'boarding_policy':
			return _user$project$FromEnglish$BoardingPolicy;
		case 'boarding_policy_type':
			return _user$project$FromEnglish$BoardingPolicyType;
		case 'boast':
			return _user$project$FromEnglish$Boast;
		case 'bobbinet':
			return _user$project$FromEnglish$Bobbinet;
		case 'body_of_water':
			return _user$project$FromEnglish$BodyOfWater;
		case 'bohrium':
			return _user$project$FromEnglish$Bohrium;
		case 'boiled_wool':
			return _user$project$FromEnglish$BoiledWool;
		case 'boldo':
			return _user$project$FromEnglish$Boldo;
		case 'bolivian_coriander':
			return _user$project$FromEnglish$BolivianCoriander;
		case 'bolt':
			return _user$project$FromEnglish$Bolt;
		case 'bombazine':
			return _user$project$FromEnglish$Bombazine;
		case 'book_edition':
			return _user$project$FromEnglish$BookEdition;
		case 'book_format':
			return _user$project$FromEnglish$BookFormat;
		case 'book_format_type':
			return _user$project$FromEnglish$BookFormatType;
		case 'book_series':
			return _user$project$FromEnglish$BookSeries;
		case 'booking_agent':
			return _user$project$FromEnglish$BookingAgent;
		case 'booking_time':
			return _user$project$FromEnglish$BookingTime;
		case 'bookmark_action':
			return _user$project$FromEnglish$BookmarkAction;
		case 'boolean':
			return _user$project$FromEnglish$Boolean;
		case 'borrow_action':
			return _user$project$FromEnglish$BorrowAction;
		case 'bossa_nova':
			return _user$project$FromEnglish$BossaNova;
		case 'bounce':
			return _user$project$FromEnglish$Bounce;
		case 'bouncy_house':
			return _user$project$FromEnglish$BouncyHouse;
		case 'bouncy_techno':
			return _user$project$FromEnglish$BouncyTechno;
		case 'bowling_alley':
			return _user$project$FromEnglish$BowlingAlley;
		case 'box':
			return _user$project$FromEnglish$Box;
		case 'boysenberry':
			return _user$project$FromEnglish$Boysenberry;
		case 'branch':
			return _user$project$FromEnglish$Branch;
		case 'branch_code':
			return _user$project$FromEnglish$BranchCode;
		case 'branch_of':
			return _user$project$FromEnglish$BranchOf;
		case 'brand':
			return _user$project$FromEnglish$Brand;
		case 'brazilian_pepper':
			return _user$project$FromEnglish$BrazilianPepper;
		case 'breadcrumb':
			return _user$project$FromEnglish$Breadcrumb;
		case 'breadcrumb_list':
			return _user$project$FromEnglish$BreadcrumbList;
		case 'breadfruit':
			return _user$project$FromEnglish$Breadfruit;
		case 'breakbeat':
			return _user$project$FromEnglish$Breakbeat;
		case 'breakbeat_hardcore':
			return _user$project$FromEnglish$BreakbeatHardcore;
		case 'breathe':
			return _user$project$FromEnglish$Breathe;
		case 'brewery':
			return _user$project$FromEnglish$Brewery;
		case 'bridge':
			return _user$project$FromEnglish$Bridge;
		case 'bright':
			return _user$project$FromEnglish$Bright;
		case 'brilliance':
			return _user$project$FromEnglish$Brilliance;
		case 'brilliantine':
			return _user$project$FromEnglish$Brilliantine;
		case 'british_dance':
			return _user$project$FromEnglish$BritishDance;
		case 'britpop':
			return _user$project$FromEnglish$Britpop;
		case 'broad_beans':
			return _user$project$FromEnglish$BroadBeans;
		case 'broadcast_affiliate_of':
			return _user$project$FromEnglish$BroadcastAffiliateOf;
		case 'broadcast_channel':
			return _user$project$FromEnglish$BroadcastChannel;
		case 'broadcast_channel_id':
			return _user$project$FromEnglish$BroadcastChannelId;
		case 'broadcast_display_name':
			return _user$project$FromEnglish$BroadcastDisplayName;
		case 'broadcast_event':
			return _user$project$FromEnglish$BroadcastEvent;
		case 'broadcast_of_event':
			return _user$project$FromEnglish$BroadcastOfEvent;
		case 'broadcast_release':
			return _user$project$FromEnglish$BroadcastRelease;
		case 'broadcast_service':
			return _user$project$FromEnglish$BroadcastService;
		case 'broadcast_service_tier':
			return _user$project$FromEnglish$BroadcastServiceTier;
		case 'broadcast_timezone':
			return _user$project$FromEnglish$BroadcastTimezone;
		case 'broadcaster':
			return _user$project$FromEnglish$Broadcaster;
		case 'broadcloth':
			return _user$project$FromEnglish$Broadcloth;
		case 'brocade':
			return _user$project$FromEnglish$Brocade;
		case 'broccoflower':
			return _user$project$FromEnglish$Broccoflower;
		case 'broccoli':
			return _user$project$FromEnglish$Broccoli;
		case 'broken_beat':
			return _user$project$FromEnglish$BrokenBeat;
		case 'brown_mustard':
			return _user$project$FromEnglish$BrownMustard;
		case 'browser_requirements':
			return _user$project$FromEnglish$BrowserRequirements;
		case 'bruise':
			return _user$project$FromEnglish$Bruise;
		case 'brush':
			return _user$project$FromEnglish$Brush;
		case 'brussels_sprout':
			return _user$project$FromEnglish$BrusselsSprout;
		case 'bubble':
			return _user$project$FromEnglish$Bubble;
		case 'bubblegum_dance':
			return _user$project$FromEnglish$BubblegumDance;
		case 'buckram':
			return _user$project$FromEnglish$Buckram;
		case 'buddhist_temple':
			return _user$project$FromEnglish$BuddhistTemple;
		case 'bump':
			return _user$project$FromEnglish$Bump;
		case 'bunting':
			return _user$project$FromEnglish$Bunting;
		case 'burlap':
			return _user$project$FromEnglish$Burlap;
		case 'bus_name':
			return _user$project$FromEnglish$BusName;
		case 'bus_number':
			return _user$project$FromEnglish$BusNumber;
		case 'bus_reservation':
			return _user$project$FromEnglish$BusReservation;
		case 'bus_station':
			return _user$project$FromEnglish$BusStation;
		case 'bus_stop':
			return _user$project$FromEnglish$BusStop;
		case 'bus_trip':
			return _user$project$FromEnglish$BusTrip;
		case 'business_audience':
			return _user$project$FromEnglish$BusinessAudience;
		case 'business_entity_type':
			return _user$project$FromEnglish$BusinessEntityType;
		case 'business_event':
			return _user$project$FromEnglish$BusinessEvent;
		case 'business_function':
			return _user$project$FromEnglish$BusinessFunction;
		case 'butternut_squash':
			return _user$project$FromEnglish$ButternutSquash;
		case 'buttery':
			return _user$project$FromEnglish$Buttery;
		case 'by_artist':
			return _user$project$FromEnglish$ByArtist;
		case 'cabbage':
			return _user$project$FromEnglish$Cabbage;
		case 'cable_or_satellite_service':
			return _user$project$FromEnglish$CableOrSatelliteService;
		case 'cadmium':
			return _user$project$FromEnglish$Cadmium;
		case 'cafe_or_coffee_shop':
			return _user$project$FromEnglish$CafeOrCoffeeShop;
		case 'calabrese':
			return _user$project$FromEnglish$Calabrese;
		case 'calcium':
			return _user$project$FromEnglish$Calcium;
		case 'calculate':
			return _user$project$FromEnglish$Calculate;
		case 'calico':
			return _user$project$FromEnglish$Calico;
		case 'californium':
			return _user$project$FromEnglish$Californium;
		case 'calories':
			return _user$project$FromEnglish$Calories;
		case 'cambric':
			return _user$project$FromEnglish$Cambric;
		case 'camp':
			return _user$project$FromEnglish$Camp;
		case 'campground':
			return _user$project$FromEnglish$Campground;
		case 'camping_pitch':
			return _user$project$FromEnglish$CampingPitch;
		case 'canal':
			return _user$project$FromEnglish$Canal;
		case 'canary_melon':
			return _user$project$FromEnglish$CanaryMelon;
		case 'cancel_action':
			return _user$project$FromEnglish$CancelAction;
		case 'candidate':
			return _user$project$FromEnglish$Candidate;
		case 'cantaloupe':
			return _user$project$FromEnglish$Cantaloupe;
		case 'canterbury_scene':
			return _user$project$FromEnglish$CanterburyScene;
		case 'canvas':
			return _user$project$FromEnglish$Canvas;
		case 'cape_jazz':
			return _user$project$FromEnglish$CapeJazz;
		case 'caption':
			return _user$project$FromEnglish$Caption;
		case 'caraway':
			return _user$project$FromEnglish$Caraway;
		case 'carbohydrate_content':
			return _user$project$FromEnglish$CarbohydrateContent;
		case 'carbon_fiber':
			return _user$project$FromEnglish$CarbonFiber;
		case 'cardamom':
			return _user$project$FromEnglish$Cardamom;
		case 'cargo_volume':
			return _user$project$FromEnglish$CargoVolume;
		case 'carpet':
			return _user$project$FromEnglish$Carpet;
		case 'carrier_requirements':
			return _user$project$FromEnglish$CarrierRequirements;
		case 'carrot':
			return _user$project$FromEnglish$Carrot;
		case 'cashmere':
			return _user$project$FromEnglish$Cashmere;
		case 'casino':
			return _user$project$FromEnglish$Casino;
		case 'cassette_format':
			return _user$project$FromEnglish$CassetteFormat;
		case 'cassis':
			return _user$project$FromEnglish$Cassis;
		case 'cat_pee':
			return _user$project$FromEnglish$CatPee;
		case 'catalog':
			return _user$project$FromEnglish$Catalog;
		case 'catalog_number':
			return _user$project$FromEnglish$CatalogNumber;
		case 'category':
			return _user$project$FromEnglish$Category;
		case 'catholic_church':
			return _user$project$FromEnglish$CatholicChurch;
		case 'cauliflower':
			return _user$project$FromEnglish$Cauliflower;
		case 'cause':
			return _user$project$FromEnglish$Cause;
		case 'cayenne_pepper':
			return _user$project$FromEnglish$CayennePepper;
		case 'cedar_bark':
			return _user$project$FromEnglish$CedarBark;
		case 'celeriac':
			return _user$project$FromEnglish$Celeriac;
		case 'celery':
			return _user$project$FromEnglish$Celery;
		case 'celery_powder':
			return _user$project$FromEnglish$CeleryPowder;
		case 'celery_seed':
			return _user$project$FromEnglish$CelerySeed;
		case 'celtic':
			return _user$project$FromEnglish$Celtic;
		case 'celtic_metal':
			return _user$project$FromEnglish$CelticMetal;
		case 'celtic_punk':
			return _user$project$FromEnglish$CelticPunk;
		case 'cement':
			return _user$project$FromEnglish$Cement;
		case 'cemetery':
			return _user$project$FromEnglish$Cemetery;
		case 'ceramic_tile':
			return _user$project$FromEnglish$CeramicTile;
		case 'cesium':
			return _user$project$FromEnglish$Cesium;
		case 'chaat_masala':
			return _user$project$FromEnglish$ChaatMasala;
		case 'challenge':
			return _user$project$FromEnglish$Challenge;
		case 'chamber_jazz':
			return _user$project$FromEnglish$ChamberJazz;
		case 'chambray':
			return _user$project$FromEnglish$Chambray;
		case 'chamomile':
			return _user$project$FromEnglish$Chamomile;
		case 'change':
			return _user$project$FromEnglish$Change;
		case 'char_cloth':
			return _user$project$FromEnglish$CharCloth;
		case 'character_attribute':
			return _user$project$FromEnglish$CharacterAttribute;
		case 'character_name':
			return _user$project$FromEnglish$CharacterName;
		case 'charcoal':
			return _user$project$FromEnglish$Charcoal;
		case 'charmeuse':
			return _user$project$FromEnglish$Charmeuse;
		case 'chase':
			return _user$project$FromEnglish$Chase;
		case 'cheat':
			return _user$project$FromEnglish$Cheat;
		case 'cheat_code':
			return _user$project$FromEnglish$CheatCode;
		case 'check_action':
			return _user$project$FromEnglish$CheckAction;
		case 'check_in_action':
			return _user$project$FromEnglish$CheckInAction;
		case 'check_out_action':
			return _user$project$FromEnglish$CheckOutAction;
		case 'checkin_time':
			return _user$project$FromEnglish$CheckinTime;
		case 'checkout_page':
			return _user$project$FromEnglish$CheckoutPage;
		case 'checkout_time':
			return _user$project$FromEnglish$CheckoutTime;
		case 'cheesecloth':
			return _user$project$FromEnglish$Cheesecloth;
		case 'chenille':
			return _user$project$FromEnglish$Chenille;
		case 'cherimoya':
			return _user$project$FromEnglish$Cherimoya;
		case 'cherry':
			return _user$project$FromEnglish$Cherry;
		case 'chervil':
			return _user$project$FromEnglish$Chervil;
		case 'chewy':
			return _user$project$FromEnglish$Chewy;
		case 'chicago_house':
			return _user$project$FromEnglish$ChicagoHouse;
		case 'chickpea':
			return _user$project$FromEnglish$Chickpea;
		case 'chiffon':
			return _user$project$FromEnglish$Chiffon;
		case 'child_care':
			return _user$project$FromEnglish$ChildCare;
		case 'child_max_age':
			return _user$project$FromEnglish$ChildMaxAge;
		case 'child_min_age':
			return _user$project$FromEnglish$ChildMinAge;
		case 'chili_oil':
			return _user$project$FromEnglish$ChiliOil;
		case 'chili_pepper':
			return _user$project$FromEnglish$ChiliPepper;
		case 'chili_peppers':
			return _user$project$FromEnglish$ChiliPeppers;
		case 'chili_powder':
			return _user$project$FromEnglish$ChiliPowder;
		case 'chili_sauce':
			return _user$project$FromEnglish$ChiliSauce;
		case 'chill_out':
			return _user$project$FromEnglish$ChillOut;
		case 'chimichurri':
			return _user$project$FromEnglish$Chimichurri;
		case 'chinese_rock':
			return _user$project$FromEnglish$ChineseRock;
		case 'chino':
			return _user$project$FromEnglish$Chino;
		case 'chintz':
			return _user$project$FromEnglish$Chintz;
		case 'chives':
			return _user$project$FromEnglish$Chives;
		case 'chocolaty':
			return _user$project$FromEnglish$Chocolaty;
		case 'choke':
			return _user$project$FromEnglish$Choke;
		case 'cholesterol_content':
			return _user$project$FromEnglish$CholesterolContent;
		case 'choose_action':
			return _user$project$FromEnglish$ChooseAction;
		case 'chop':
			return _user$project$FromEnglish$Chop;
		case 'christian_metal':
			return _user$project$FromEnglish$ChristianMetal;
		case 'christian_punk':
			return _user$project$FromEnglish$ChristianPunk;
		case 'christian_rock':
			return _user$project$FromEnglish$ChristianRock;
		case 'chromium':
			return _user$project$FromEnglish$Chromium;
		case 'church':
			return _user$project$FromEnglish$Church;
		case 'chutney':
			return _user$project$FromEnglish$Chutney;
		case 'cicely':
			return _user$project$FromEnglish$Cicely;
		case 'cigar_box':
			return _user$project$FromEnglish$CigarBox;
		case 'cilantro':
			return _user$project$FromEnglish$Cilantro;
		case 'cinder_block':
			return _user$project$FromEnglish$CinderBlock;
		case 'cinnamon':
			return _user$project$FromEnglish$Cinnamon;
		case 'citation':
			return _user$project$FromEnglish$Citation;
		case 'city_hall':
			return _user$project$FromEnglish$CityHall;
		case 'civic_structure':
			return _user$project$FromEnglish$CivicStructure;
		case 'claim':
			return _user$project$FromEnglish$Claim;
		case 'claim_reviewed':
			return _user$project$FromEnglish$ClaimReviewed;
		case 'classic_trance':
			return _user$project$FromEnglish$ClassicTrance;
		case 'clean':
			return _user$project$FromEnglish$Clean;
		case 'clementine':
			return _user$project$FromEnglish$Clementine;
		case 'clip':
			return _user$project$FromEnglish$Clip;
		case 'clip_number':
			return _user$project$FromEnglish$ClipNumber;
		case 'closed':
			return _user$project$FromEnglish$Closed;
		case 'closes':
			return _user$project$FromEnglish$Closes;
		case 'cloth_of_gold':
			return _user$project$FromEnglish$ClothOfGold;
		case 'clothing_store':
			return _user$project$FromEnglish$ClothingStore;
		case 'cloudberry':
			return _user$project$FromEnglish$Cloudberry;
		case 'clove':
			return _user$project$FromEnglish$Clove;
		case 'coach':
			return _user$project$FromEnglish$Coach;
		case 'cobalt':
			return _user$project$FromEnglish$Cobalt;
		case 'cocktail_sauce':
			return _user$project$FromEnglish$CocktailSauce;
		case 'coconut':
			return _user$project$FromEnglish$Coconut;
		case 'code':
			return _user$project$FromEnglish$Code;
		case 'code_repository':
			return _user$project$FromEnglish$CodeRepository;
		case 'code_sample_type':
			return _user$project$FromEnglish$CodeSampleType;
		case 'collard_green':
			return _user$project$FromEnglish$CollardGreen;
		case 'collect':
			return _user$project$FromEnglish$Collect;
		case 'collection':
			return _user$project$FromEnglish$Collection;
		case 'collection_page':
			return _user$project$FromEnglish$CollectionPage;
		case 'college_or_university':
			return _user$project$FromEnglish$CollegeOrUniversity;
		case 'comedy_club':
			return _user$project$FromEnglish$ComedyClub;
		case 'comedy_event':
			return _user$project$FromEnglish$ComedyEvent;
		case 'command':
			return _user$project$FromEnglish$Command;
		case 'comment':
			return _user$project$FromEnglish$Comment;
		case 'comment_action':
			return _user$project$FromEnglish$CommentAction;
		case 'comment_count':
			return _user$project$FromEnglish$CommentCount;
		case 'comment_permission':
			return _user$project$FromEnglish$CommentPermission;
		case 'comment_text':
			return _user$project$FromEnglish$CommentText;
		case 'comment_time':
			return _user$project$FromEnglish$CommentTime;
		case 'communicate':
			return _user$project$FromEnglish$Communicate;
		case 'communicate_action':
			return _user$project$FromEnglish$CommunicateAction;
		case 'compare':
			return _user$project$FromEnglish$Compare;
		case 'compete':
			return _user$project$FromEnglish$Compete;
		case 'competitor':
			return _user$project$FromEnglish$Competitor;
		case 'compilation_album':
			return _user$project$FromEnglish$CompilationAlbum;
		case 'complain':
			return _user$project$FromEnglish$Complain;
		case 'complete':
			return _user$project$FromEnglish$Complete;
		case 'completed_action_status':
			return _user$project$FromEnglish$CompletedActionStatus;
		case 'complex':
			return _user$project$FromEnglish$Complex;
		case 'composer':
			return _user$project$FromEnglish$Composer;
		case 'compound_price_specification':
			return _user$project$FromEnglish$CompoundPriceSpecification;
		case 'computer_language':
			return _user$project$FromEnglish$ComputerLanguage;
		case 'computer_store':
			return _user$project$FromEnglish$ComputerStore;
		case 'concentrate':
			return _user$project$FromEnglish$Concentrate;
		case 'concentrated':
			return _user$project$FromEnglish$Concentrated;
		case 'concern':
			return _user$project$FromEnglish$Concern;
		case 'concrete':
			return _user$project$FromEnglish$Concrete;
		case 'conductive':
			return _user$project$FromEnglish$Conductive;
		case 'confess':
			return _user$project$FromEnglish$Confess;
		case 'confirm_action':
			return _user$project$FromEnglish$ConfirmAction;
		case 'confirmation_number':
			return _user$project$FromEnglish$ConfirmationNumber;
		case 'confuse':
			return _user$project$FromEnglish$Confuse;
		case 'connected':
			return _user$project$FromEnglish$Connected;
		case 'consider':
			return _user$project$FromEnglish$Consider;
		case 'consist':
			return _user$project$FromEnglish$Consist;
		case 'consume_action':
			return _user$project$FromEnglish$ConsumeAction;
		case 'contact_option':
			return _user$project$FromEnglish$ContactOption;
		case 'contact_page':
			return _user$project$FromEnglish$ContactPage;
		case 'contact_point':
			return _user$project$FromEnglish$ContactPoint;
		case 'contact_point_option':
			return _user$project$FromEnglish$ContactPointOption;
		case 'contact_points':
			return _user$project$FromEnglish$ContactPoints;
		case 'contact_type':
			return _user$project$FromEnglish$ContactType;
		case 'contain':
			return _user$project$FromEnglish$Contain;
		case 'contained_in':
			return _user$project$FromEnglish$ContainedIn;
		case 'contained_in_place':
			return _user$project$FromEnglish$ContainedInPlace;
		case 'contains_place':
			return _user$project$FromEnglish$ContainsPlace;
		case 'contains_season':
			return _user$project$FromEnglish$ContainsSeason;
		case 'contemporary_folk':
			return _user$project$FromEnglish$ContemporaryFolk;
		case 'content_location':
			return _user$project$FromEnglish$ContentLocation;
		case 'content_rating':
			return _user$project$FromEnglish$ContentRating;
		case 'content_size':
			return _user$project$FromEnglish$ContentSize;
		case 'content_type':
			return _user$project$FromEnglish$ContentType;
		case 'content_url':
			return _user$project$FromEnglish$ContentUrl;
		case 'continent':
			return _user$project$FromEnglish$Continent;
		case 'continental_jazz':
			return _user$project$FromEnglish$ContinentalJazz;
		case 'continue':
			return _user$project$FromEnglish$Continue;
		case 'contributor':
			return _user$project$FromEnglish$Contributor;
		case 'control_action':
			return _user$project$FromEnglish$ControlAction;
		case 'convenience_store':
			return _user$project$FromEnglish$ConvenienceStore;
		case 'conversation':
			return _user$project$FromEnglish$Conversation;
		case 'cook_action':
			return _user$project$FromEnglish$CookAction;
		case 'cook_time':
			return _user$project$FromEnglish$CookTime;
		case 'cooking_method':
			return _user$project$FromEnglish$CookingMethod;
		case 'cool_jazz':
			return _user$project$FromEnglish$CoolJazz;
		case 'coolmax':
			return _user$project$FromEnglish$Coolmax;
		case 'copyright_holder':
			return _user$project$FromEnglish$CopyrightHolder;
		case 'copyright_year':
			return _user$project$FromEnglish$CopyrightYear;
		case 'cordura':
			return _user$project$FromEnglish$Cordura;
		case 'corduroy':
			return _user$project$FromEnglish$Corduroy;
		case 'coriander_leaf':
			return _user$project$FromEnglish$CorianderLeaf;
		case 'coriander_seed':
			return _user$project$FromEnglish$CorianderSeed;
		case 'corked':
			return _user$project$FromEnglish$Corked;
		case 'corn':
			return _user$project$FromEnglish$Corn;
		case 'corn_salad':
			return _user$project$FromEnglish$CornSalad;
		case 'corporation':
			return _user$project$FromEnglish$Corporation;
		case 'correct':
			return _user$project$FromEnglish$Correct;
		case 'cosmic_disco':
			return _user$project$FromEnglish$CosmicDisco;
		case 'cotton':
			return _user$project$FromEnglish$Cotton;
		case 'cough':
			return _user$project$FromEnglish$Cough;
		case 'countries_not_supported':
			return _user$project$FromEnglish$CountriesNotSupported;
		case 'countries_supported':
			return _user$project$FromEnglish$CountriesSupported;
		case 'country':
			return _user$project$FromEnglish$Country;
		case 'country_of_origin':
			return _user$project$FromEnglish$CountryOfOrigin;
		case 'courgette':
			return _user$project$FromEnglish$Courgette;
		case 'course_code':
			return _user$project$FromEnglish$CourseCode;
		case 'course_instance':
			return _user$project$FromEnglish$CourseInstance;
		case 'course_mode':
			return _user$project$FromEnglish$CourseMode;
		case 'course_prerequisites':
			return _user$project$FromEnglish$CoursePrerequisites;
		case 'courthouse':
			return _user$project$FromEnglish$Courthouse;
		case 'coverage_end_time':
			return _user$project$FromEnglish$CoverageEndTime;
		case 'coverage_start_time':
			return _user$project$FromEnglish$CoverageStartTime;
		case 'cowpunk':
			return _user$project$FromEnglish$Cowpunk;
		case 'crab_boil':
			return _user$project$FromEnglish$CrabBoil;
		case 'cranberry':
			return _user$project$FromEnglish$Cranberry;
		case 'crape':
			return _user$project$FromEnglish$Crape;
		case 'crawl':
			return _user$project$FromEnglish$Crawl;
		case 'creamy':
			return _user$project$FromEnglish$Creamy;
		case 'create_action':
			return _user$project$FromEnglish$CreateAction;
		case 'creative_work':
			return _user$project$FromEnglish$CreativeWork;
		case 'creative_work_season':
			return _user$project$FromEnglish$CreativeWorkSeason;
		case 'creative_work_series':
			return _user$project$FromEnglish$CreativeWorkSeries;
		case 'creator':
			return _user$project$FromEnglish$Creator;
		case 'credit_card':
			return _user$project$FromEnglish$CreditCard;
		case 'credited_to':
			return _user$project$FromEnglish$CreditedTo;
		case 'crematorium':
			return _user$project$FromEnglish$Crematorium;
		case 'cretonne':
			return _user$project$FromEnglish$Cretonne;
		case 'crimplene':
			return _user$project$FromEnglish$Crimplene;
		case 'crisp':
			return _user$project$FromEnglish$Crisp;
		case 'cross':
			return _user$project$FromEnglish$Cross;
		case 'crossover_jazz':
			return _user$project$FromEnglish$CrossoverJazz;
		case 'crossover_thrash':
			return _user$project$FromEnglish$CrossoverThrash;
		case 'crunk':
			return _user$project$FromEnglish$Crunk;
		case 'crush':
			return _user$project$FromEnglish$Crush;
		case 'crushed_red_pepper':
			return _user$project$FromEnglish$CrushedRedPepper;
		case 'crust_punk':
			return _user$project$FromEnglish$CrustPunk;
		case 'cubeb':
			return _user$project$FromEnglish$Cubeb;
		case 'cucumber':
			return _user$project$FromEnglish$Cucumber;
		case 'cumin':
			return _user$project$FromEnglish$Cumin;
		case 'curium':
			return _user$project$FromEnglish$Curium;
		case 'currant':
			return _user$project$FromEnglish$Currant;
		case 'currencies_accepted':
			return _user$project$FromEnglish$CurrenciesAccepted;
		case 'currency':
			return _user$project$FromEnglish$Currency;
		case 'currency_conversion_service':
			return _user$project$FromEnglish$CurrencyConversionService;
		case 'curry_ketchup':
			return _user$project$FromEnglish$CurryKetchup;
		case 'curry_leaf':
			return _user$project$FromEnglish$CurryLeaf;
		case 'curry_powder':
			return _user$project$FromEnglish$CurryPowder;
		case 'customer':
			return _user$project$FromEnglish$Customer;
		case 'daikon':
			return _user$project$FromEnglish$Daikon;
		case 'dam':
			return _user$project$FromEnglish$Dam;
		case 'damage':
			return _user$project$FromEnglish$Damage;
		case 'damaged_condition':
			return _user$project$FromEnglish$DamagedCondition;
		case 'damask':
			return _user$project$FromEnglish$Damask;
		case 'damson':
			return _user$project$FromEnglish$Damson;
		case 'dance_event':
			return _user$project$FromEnglish$DanceEvent;
		case 'dance_group':
			return _user$project$FromEnglish$DanceGroup;
		case 'dance_pop':
			return _user$project$FromEnglish$DancePop;
		case 'dance_punk':
			return _user$project$FromEnglish$DancePunk;
		case 'dance_rock':
			return _user$project$FromEnglish$DanceRock;
		case 'dark_ambient':
			return _user$project$FromEnglish$DarkAmbient;
		case 'dark_cabaret':
			return _user$project$FromEnglish$DarkCabaret;
		case 'dark_electro':
			return _user$project$FromEnglish$DarkElectro;
		case 'dark_wave':
			return _user$project$FromEnglish$DarkWave;
		case 'darkside_jungle':
			return _user$project$FromEnglish$DarksideJungle;
		case 'darmstadtium':
			return _user$project$FromEnglish$Darmstadtium;
		case 'data_catalog':
			return _user$project$FromEnglish$DataCatalog;
		case 'data_download':
			return _user$project$FromEnglish$DataDownload;
		case 'data_feed':
			return _user$project$FromEnglish$DataFeed;
		case 'data_feed_element':
			return _user$project$FromEnglish$DataFeedElement;
		case 'data_feed_item':
			return _user$project$FromEnglish$DataFeedItem;
		case 'data_type':
			return _user$project$FromEnglish$DataType;
		case 'dataset_class':
			return _user$project$FromEnglish$DatasetClass;
		case 'dataset_time_interval':
			return _user$project$FromEnglish$DatasetTimeInterval;
		case 'date_created':
			return _user$project$FromEnglish$DateCreated;
		case 'date_deleted':
			return _user$project$FromEnglish$DateDeleted;
		case 'date_issued':
			return _user$project$FromEnglish$DateIssued;
		case 'date_modified':
			return _user$project$FromEnglish$DateModified;
		case 'date_posted':
			return _user$project$FromEnglish$DatePosted;
		case 'date_published':
			return _user$project$FromEnglish$DatePublished;
		case 'date_read':
			return _user$project$FromEnglish$DateRead;
		case 'date_received':
			return _user$project$FromEnglish$DateReceived;
		case 'date_sent':
			return _user$project$FromEnglish$DateSent;
		case 'date_time':
			return _user$project$FromEnglish$DateTime;
		case 'date_vehicle_first_registered':
			return _user$project$FromEnglish$DateVehicleFirstRegistered;
		case 'dated_money_specification':
			return _user$project$FromEnglish$DatedMoneySpecification;
		case 'dateline':
			return _user$project$FromEnglish$Dateline;
		case 'day_of_week':
			return _user$project$FromEnglish$DayOfWeek;
		case 'dazzle':
			return _user$project$FromEnglish$Dazzle;
		case 'deactivate_action':
			return _user$project$FromEnglish$DeactivateAction;
		case 'death_date':
			return _user$project$FromEnglish$DeathDate;
		case 'death_industrial':
			return _user$project$FromEnglish$DeathIndustrial;
		case 'death_metal':
			return _user$project$FromEnglish$DeathMetal;
		case 'death_place':
			return _user$project$FromEnglish$DeathPlace;
		case 'decay':
			return _user$project$FromEnglish$Decay;
		case 'deceive':
			return _user$project$FromEnglish$Deceive;
		case 'decide':
			return _user$project$FromEnglish$Decide;
		case 'decorate':
			return _user$project$FromEnglish$Decorate;
		case 'deep_house':
			return _user$project$FromEnglish$DeepHouse;
		case 'default_value':
			return _user$project$FromEnglish$DefaultValue;
		case 'defence_establishment':
			return _user$project$FromEnglish$DefenceEstablishment;
		case 'delete_action':
			return _user$project$FromEnglish$DeleteAction;
		case 'delight':
			return _user$project$FromEnglish$Delight;
		case 'deliver':
			return _user$project$FromEnglish$Deliver;
		case 'delivery_address':
			return _user$project$FromEnglish$DeliveryAddress;
		case 'delivery_charge_specification':
			return _user$project$FromEnglish$DeliveryChargeSpecification;
		case 'delivery_event':
			return _user$project$FromEnglish$DeliveryEvent;
		case 'delivery_lead_time':
			return _user$project$FromEnglish$DeliveryLeadTime;
		case 'delivery_method':
			return _user$project$FromEnglish$DeliveryMethod;
		case 'delivery_status':
			return _user$project$FromEnglish$DeliveryStatus;
		case 'demand':
			return _user$project$FromEnglish$Demand;
		case 'demo_album':
			return _user$project$FromEnglish$DemoAlbum;
		case 'denim':
			return _user$project$FromEnglish$Denim;
		case 'dense':
			return _user$project$FromEnglish$Dense;
		case 'dentist':
			return _user$project$FromEnglish$Dentist;
		case 'depart_action':
			return _user$project$FromEnglish$DepartAction;
		case 'department':
			return _user$project$FromEnglish$Department;
		case 'department_store':
			return _user$project$FromEnglish$DepartmentStore;
		case 'departure_airport':
			return _user$project$FromEnglish$DepartureAirport;
		case 'departure_bus_stop':
			return _user$project$FromEnglish$DepartureBusStop;
		case 'departure_gate':
			return _user$project$FromEnglish$DepartureGate;
		case 'departure_platform':
			return _user$project$FromEnglish$DeparturePlatform;
		case 'departure_station':
			return _user$project$FromEnglish$DepartureStation;
		case 'departure_terminal':
			return _user$project$FromEnglish$DepartureTerminal;
		case 'departure_time':
			return _user$project$FromEnglish$DepartureTime;
		case 'depend':
			return _user$project$FromEnglish$Depend;
		case 'dependencies':
			return _user$project$FromEnglish$Dependencies;
		case 'deposit_account':
			return _user$project$FromEnglish$DepositAccount;
		case 'depth':
			return _user$project$FromEnglish$Depth;
		case 'describe':
			return _user$project$FromEnglish$Describe;
		case 'description':
			return _user$project$FromEnglish$Description;
		case 'desert_rock':
			return _user$project$FromEnglish$DesertRock;
		case 'deserve':
			return _user$project$FromEnglish$Deserve;
		case 'destroy':
			return _user$project$FromEnglish$Destroy;
		case 'detect':
			return _user$project$FromEnglish$Detect;
		case 'detroit_techno':
			return _user$project$FromEnglish$DetroitTechno;
		case 'develop':
			return _user$project$FromEnglish$Develop;
		case 'diabetic_diet':
			return _user$project$FromEnglish$DiabeticDiet;
		case 'digital_audio_tape_format':
			return _user$project$FromEnglish$DigitalAudioTapeFormat;
		case 'digital_document':
			return _user$project$FromEnglish$DigitalDocument;
		case 'digital_document_permission':
			return _user$project$FromEnglish$DigitalDocumentPermission;
		case 'digital_document_permission_type':
			return _user$project$FromEnglish$DigitalDocumentPermissionType;
		case 'digital_format':
			return _user$project$FromEnglish$DigitalFormat;
		case 'digital_hardcore':
			return _user$project$FromEnglish$DigitalHardcore;
		case 'dijon_ketchup':
			return _user$project$FromEnglish$DijonKetchup;
		case 'dijon_mustard':
			return _user$project$FromEnglish$DijonMustard;
		case 'dill':
			return _user$project$FromEnglish$Dill;
		case 'dill_seed':
			return _user$project$FromEnglish$DillSeed;
		case 'dimensional_lumber':
			return _user$project$FromEnglish$DimensionalLumber;
		case 'dimity':
			return _user$project$FromEnglish$Dimity;
		case 'dip':
			return _user$project$FromEnglish$Dip;
		case 'director':
			return _user$project$FromEnglish$Director;
		case 'directors':
			return _user$project$FromEnglish$Directors;
		case 'disagree':
			return _user$project$FromEnglish$Disagree;
		case 'disagree_action':
			return _user$project$FromEnglish$DisagreeAction;
		case 'disambiguating_description':
			return _user$project$FromEnglish$DisambiguatingDescription;
		case 'disappear':
			return _user$project$FromEnglish$Disappear;
		case 'disapprove':
			return _user$project$FromEnglish$Disapprove;
		case 'disarm':
			return _user$project$FromEnglish$Disarm;
		case 'disco':
			return _user$project$FromEnglish$Disco;
		case 'disco_polo':
			return _user$project$FromEnglish$DiscoPolo;
		case 'discontinued':
			return _user$project$FromEnglish$Discontinued;
		case 'discount':
			return _user$project$FromEnglish$Discount;
		case 'discount_code':
			return _user$project$FromEnglish$DiscountCode;
		case 'discount_currency':
			return _user$project$FromEnglish$DiscountCurrency;
		case 'discover':
			return _user$project$FromEnglish$Discover;
		case 'discover_action':
			return _user$project$FromEnglish$DiscoverAction;
		case 'discusses':
			return _user$project$FromEnglish$Discusses;
		case 'discussion_forum_posting':
			return _user$project$FromEnglish$DiscussionForumPosting;
		case 'discussion_url':
			return _user$project$FromEnglish$DiscussionUrl;
		case 'dislike':
			return _user$project$FromEnglish$Dislike;
		case 'dislike_action':
			return _user$project$FromEnglish$DislikeAction;
		case 'dissolution_date':
			return _user$project$FromEnglish$DissolutionDate;
		case 'distance':
			return _user$project$FromEnglish$Distance;
		case 'distribution':
			return _user$project$FromEnglish$Distribution;
		case 'diva_house':
			return _user$project$FromEnglish$DivaHouse;
		case 'divide':
			return _user$project$FromEnglish$Divide;
		case 'dixieland':
			return _user$project$FromEnglish$Dixieland;
		case 'djmix_album':
			return _user$project$FromEnglish$DjmixAlbum;
		case 'donate_action':
			return _user$project$FromEnglish$DonateAction;
		case 'donegal_tweed':
			return _user$project$FromEnglish$DonegalTweed;
		case 'doom_metal':
			return _user$project$FromEnglish$DoomMetal;
		case 'door_time':
			return _user$project$FromEnglish$DoorTime;
		case 'double':
			return _user$project$FromEnglish$Double;
		case 'download_action':
			return _user$project$FromEnglish$DownloadAction;
		case 'download_url':
			return _user$project$FromEnglish$DownloadUrl;
		case 'downvote_count':
			return _user$project$FromEnglish$DownvoteCount;
		case 'drag':
			return _user$project$FromEnglish$Drag;
		case 'draw_action':
			return _user$project$FromEnglish$DrawAction;
		case 'dream':
			return _user$project$FromEnglish$Dream;
		case 'dream_house':
			return _user$project$FromEnglish$DreamHouse;
		case 'dream_pop':
			return _user$project$FromEnglish$DreamPop;
		case 'dream_trance':
			return _user$project$FromEnglish$DreamTrance;
		case 'dress':
			return _user$project$FromEnglish$Dress;
		case 'dried_lime':
			return _user$project$FromEnglish$DriedLime;
		case 'drill':
			return _user$project$FromEnglish$Drill;
		case 'drink_action':
			return _user$project$FromEnglish$DrinkAction;
		case 'drive_wheel_configuration':
			return _user$project$FromEnglish$DriveWheelConfiguration;
		case 'drive_wheel_configuration_value':
			return _user$project$FromEnglish$DriveWheelConfigurationValue;
		case 'drone_metal':
			return _user$project$FromEnglish$DroneMetal;
		case 'drop':
			return _user$project$FromEnglish$Drop;
		case 'dropoff_location':
			return _user$project$FromEnglish$DropoffLocation;
		case 'dropoff_time':
			return _user$project$FromEnglish$DropoffTime;
		case 'drown':
			return _user$project$FromEnglish$Drown;
		case 'drugget':
			return _user$project$FromEnglish$Drugget;
		case 'drum':
			return _user$project$FromEnglish$Drum;
		case 'drum_and_bass':
			return _user$project$FromEnglish$DrumAndBass;
		case 'dry':
			return _user$project$FromEnglish$Dry;
		case 'dry_cleaning_or_laundry':
			return _user$project$FromEnglish$DryCleaningOrLaundry;
		case 'dubnium':
			return _user$project$FromEnglish$Dubnium;
		case 'dubstep':
			return _user$project$FromEnglish$Dubstep;
		case 'duck':
			return _user$project$FromEnglish$Duck;
		case 'dunedin_sound':
			return _user$project$FromEnglish$DunedinSound;
		case 'duration':
			return _user$project$FromEnglish$Duration;
		case 'duration_of_warranty':
			return _user$project$FromEnglish$DurationOfWarranty;
		case 'durian':
			return _user$project$FromEnglish$Durian;
		case 'dust':
			return _user$project$FromEnglish$Dust;
		case 'dutch_house':
			return _user$project$FromEnglish$DutchHouse;
		case 'dysprosium':
			return _user$project$FromEnglish$Dysprosium;
		case 'e_textiles':
			return _user$project$FromEnglish$ETextiles;
		case 'east_asian_pepper':
			return _user$project$FromEnglish$EastAsianPepper;
		case 'ebook':
			return _user$project$FromEnglish$Ebook;
		case 'editor':
			return _user$project$FromEnglish$Editor;
		case 'educate':
			return _user$project$FromEnglish$Educate;
		case 'education_event':
			return _user$project$FromEnglish$EducationEvent;
		case 'education_requirements':
			return _user$project$FromEnglish$EducationRequirements;
		case 'educational_alignment':
			return _user$project$FromEnglish$EducationalAlignment;
		case 'educational_audience':
			return _user$project$FromEnglish$EducationalAudience;
		case 'educational_framework':
			return _user$project$FromEnglish$EducationalFramework;
		case 'educational_organization':
			return _user$project$FromEnglish$EducationalOrganization;
		case 'educational_role':
			return _user$project$FromEnglish$EducationalRole;
		case 'educational_use':
			return _user$project$FromEnglish$EducationalUse;
		case 'eggplant':
			return _user$project$FromEnglish$Eggplant;
		case 'einsteinium':
			return _user$project$FromEnglish$Einsteinium;
		case 'elderberry':
			return _user$project$FromEnglish$Elderberry;
		case 'electrician':
			return _user$project$FromEnglish$Electrician;
		case 'electro':
			return _user$project$FromEnglish$Electro;
		case 'electro_backbeat':
			return _user$project$FromEnglish$ElectroBackbeat;
		case 'electro_grime':
			return _user$project$FromEnglish$ElectroGrime;
		case 'electro_house':
			return _user$project$FromEnglish$ElectroHouse;
		case 'electro_industrial':
			return _user$project$FromEnglish$ElectroIndustrial;
		case 'electroacoustic':
			return _user$project$FromEnglish$Electroacoustic;
		case 'electronic_art_music':
			return _user$project$FromEnglish$ElectronicArtMusic;
		case 'electronic_rock':
			return _user$project$FromEnglish$ElectronicRock;
		case 'electronica':
			return _user$project$FromEnglish$Electronica;
		case 'electronics_store':
			return _user$project$FromEnglish$ElectronicsStore;
		case 'electropop':
			return _user$project$FromEnglish$Electropop;
		case 'elegant':
			return _user$project$FromEnglish$Elegant;
		case 'elementary_school':
			return _user$project$FromEnglish$ElementarySchool;
		case 'elevation':
			return _user$project$FromEnglish$Elevation;
		case 'eligible_customer_type':
			return _user$project$FromEnglish$EligibleCustomerType;
		case 'eligible_duration':
			return _user$project$FromEnglish$EligibleDuration;
		case 'eligible_quantity':
			return _user$project$FromEnglish$EligibleQuantity;
		case 'eligible_region':
			return _user$project$FromEnglish$EligibleRegion;
		case 'eligible_transaction_volume':
			return _user$project$FromEnglish$EligibleTransactionVolume;
		case 'email':
			return _user$project$FromEnglish$Email;
		case 'email_message':
			return _user$project$FromEnglish$EmailMessage;
		case 'embarrass':
			return _user$project$FromEnglish$Embarrass;
		case 'embassy':
			return _user$project$FromEnglish$Embassy;
		case 'embed_url':
			return _user$project$FromEnglish$EmbedUrl;
		case 'emergency_service':
			return _user$project$FromEnglish$EmergencyService;
		case 'employee':
			return _user$project$FromEnglish$Employee;
		case 'employee_role':
			return _user$project$FromEnglish$EmployeeRole;
		case 'employees':
			return _user$project$FromEnglish$Employees;
		case 'employment_agency':
			return _user$project$FromEnglish$EmploymentAgency;
		case 'employment_type':
			return _user$project$FromEnglish$EmploymentType;
		case 'empty':
			return _user$project$FromEnglish$Empty;
		case 'encodes_creative_work':
			return _user$project$FromEnglish$EncodesCreativeWork;
		case 'encoding':
			return _user$project$FromEnglish$Encoding;
		case 'encoding_format':
			return _user$project$FromEnglish$EncodingFormat;
		case 'encoding_type':
			return _user$project$FromEnglish$EncodingType;
		case 'encodings':
			return _user$project$FromEnglish$Encodings;
		case 'encourage':
			return _user$project$FromEnglish$Encourage;
		case 'end_time':
			return _user$project$FromEnglish$EndTime;
		case 'endive':
			return _user$project$FromEnglish$Endive;
		case 'endorse_action':
			return _user$project$FromEnglish$EndorseAction;
		case 'engine_specification':
			return _user$project$FromEnglish$EngineSpecification;
		case 'entertain':
			return _user$project$FromEnglish$Entertain;
		case 'entertainment_business':
			return _user$project$FromEnglish$EntertainmentBusiness;
		case 'entry_point':
			return _user$project$FromEnglish$EntryPoint;
		case 'enumeration':
			return _user$project$FromEnglish$Enumeration;
		case 'epazote':
			return _user$project$FromEnglish$Epazote;
		case 'epic_doom':
			return _user$project$FromEnglish$EpicDoom;
		case 'episode':
			return _user$project$FromEnglish$Episode;
		case 'episode_number':
			return _user$project$FromEnglish$EpisodeNumber;
		case 'episodes':
			return _user$project$FromEnglish$Episodes;
		case 'equal':
			return _user$project$FromEnglish$Equal;
		case 'estimated_flight_duration':
			return _user$project$FromEnglish$EstimatedFlightDuration;
		case 'ethereal_wave':
			return _user$project$FromEnglish$EtherealWave;
		case 'ethnic_electronica':
			return _user$project$FromEnglish$EthnicElectronica;
		case 'euro_disco':
			return _user$project$FromEnglish$EuroDisco;
		case 'european_free_jazz':
			return _user$project$FromEnglish$EuropeanFreeJazz;
		case 'europium':
			return _user$project$FromEnglish$Europium;
		case 'event':
			return _user$project$FromEnglish$Event;
		case 'event_cancelled':
			return _user$project$FromEnglish$EventCancelled;
		case 'event_postponed':
			return _user$project$FromEnglish$EventPostponed;
		case 'event_rescheduled':
			return _user$project$FromEnglish$EventRescheduled;
		case 'event_reservation':
			return _user$project$FromEnglish$EventReservation;
		case 'event_scheduled':
			return _user$project$FromEnglish$EventScheduled;
		case 'event_status':
			return _user$project$FromEnglish$EventStatus;
		case 'event_status_type':
			return _user$project$FromEnglish$EventStatusType;
		case 'event_venue':
			return _user$project$FromEnglish$EventVenue;
		case 'examine':
			return _user$project$FromEnglish$Examine;
		case 'example_of_work':
			return _user$project$FromEnglish$ExampleOfWork;
		case 'excuse':
			return _user$project$FromEnglish$Excuse;
		case 'executable_library_name':
			return _user$project$FromEnglish$ExecutableLibraryName;
		case 'exercise':
			return _user$project$FromEnglish$Exercise;
		case 'exercise_action':
			return _user$project$FromEnglish$ExerciseAction;
		case 'exercise_course':
			return _user$project$FromEnglish$ExerciseCourse;
		case 'exercise_gym':
			return _user$project$FromEnglish$ExerciseGym;
		case 'exhibition_event':
			return _user$project$FromEnglish$ExhibitionEvent;
		case 'exif_data':
			return _user$project$FromEnglish$ExifData;
		case 'expand':
			return _user$project$FromEnglish$Expand;
		case 'expect':
			return _user$project$FromEnglish$Expect;
		case 'expected_arrival_from':
			return _user$project$FromEnglish$ExpectedArrivalFrom;
		case 'expected_arrival_until':
			return _user$project$FromEnglish$ExpectedArrivalUntil;
		case 'expects_acceptance_of':
			return _user$project$FromEnglish$ExpectsAcceptanceOf;
		case 'experience_requirements':
			return _user$project$FromEnglish$ExperienceRequirements;
		case 'experimental_rock':
			return _user$project$FromEnglish$ExperimentalRock;
		case 'expires':
			return _user$project$FromEnglish$Expires;
		case 'explain':
			return _user$project$FromEnglish$Explain;
		case 'explode':
			return _user$project$FromEnglish$Explode;
		case 'expressive':
			return _user$project$FromEnglish$Expressive;
		case 'extend':
			return _user$project$FromEnglish$Extend;
		case 'extracted':
			return _user$project$FromEnglish$Extracted;
		case 'fade':
			return _user$project$FromEnglish$Fade;
		case 'failed_action_status':
			return _user$project$FromEnglish$FailedActionStatus;
		case 'fallen_over':
			return _user$project$FromEnglish$FallenOver;
		case 'family_name':
			return _user$project$FromEnglish$FamilyName;
		case 'fast_food_restaurant':
			return _user$project$FromEnglish$FastFoodRestaurant;
		case 'fat_content':
			return _user$project$FromEnglish$FatContent;
		case 'fax_number':
			return _user$project$FromEnglish$FaxNumber;
		case 'feature_list':
			return _user$project$FromEnglish$FeatureList;
		case 'fees_and_commissions_specification':
			return _user$project$FromEnglish$FeesAndCommissionsSpecification;
		case 'fence':
			return _user$project$FromEnglish$Fence;
		case 'fennel':
			return _user$project$FromEnglish$Fennel;
		case 'fenugreek':
			return _user$project$FromEnglish$Fenugreek;
		case 'fermium':
			return _user$project$FromEnglish$Fermium;
		case 'festival':
			return _user$project$FromEnglish$Festival;
		case 'fiber_content':
			return _user$project$FromEnglish$FiberContent;
		case 'file_format':
			return _user$project$FromEnglish$FileFormat;
		case 'file_size':
			return _user$project$FromEnglish$FileSize;
		case 'film_action':
			return _user$project$FromEnglish$FilmAction;
		case 'financial_product':
			return _user$project$FromEnglish$FinancialProduct;
		case 'financial_service':
			return _user$project$FromEnglish$FinancialService;
		case 'find_action':
			return _user$project$FromEnglish$FindAction;
		case 'fire_station':
			return _user$project$FromEnglish$FireStation;
		case 'first_performance':
			return _user$project$FromEnglish$FirstPerformance;
		case 'fish_paste':
			return _user$project$FromEnglish$FishPaste;
		case 'fish_sauce':
			return _user$project$FromEnglish$FishSauce;
		case 'five_spice_powder':
			return _user$project$FromEnglish$FiveSpicePowder;
		case 'fix':
			return _user$project$FromEnglish$Fix;
		case 'flabby':
			return _user$project$FromEnglish$Flabby;
		case 'flamboyant':
			return _user$project$FromEnglish$Flamboyant;
		case 'flannel':
			return _user$project$FromEnglish$Flannel;
		case 'flap':
			return _user$project$FromEnglish$Flap;
		case 'flight':
			return _user$project$FromEnglish$Flight;
		case 'flight_distance':
			return _user$project$FromEnglish$FlightDistance;
		case 'flight_number':
			return _user$project$FromEnglish$FlightNumber;
		case 'flight_reservation':
			return _user$project$FromEnglish$FlightReservation;
		case 'float':
			return _user$project$FromEnglish$Float;
		case 'flood':
			return _user$project$FromEnglish$Flood;
		case 'floor_size':
			return _user$project$FromEnglish$FloorSize;
		case 'florida_breaks':
			return _user$project$FromEnglish$FloridaBreaks;
		case 'florist':
			return _user$project$FromEnglish$Florist;
		case 'fold':
			return _user$project$FromEnglish$Fold;
		case 'folk_punk':
			return _user$project$FromEnglish$FolkPunk;
		case 'folktronica':
			return _user$project$FromEnglish$Folktronica;
		case 'food_establishment':
			return _user$project$FromEnglish$FoodEstablishment;
		case 'food_establishment_reservation':
			return _user$project$FromEnglish$FoodEstablishmentReservation;
		case 'food_event':
			return _user$project$FromEnglish$FoodEvent;
		case 'food_friendly':
			return _user$project$FromEnglish$FoodFriendly;
		case 'food_service':
			return _user$project$FromEnglish$FoodService;
		case 'form':
			return _user$project$FromEnglish$Form;
		case 'foulard':
			return _user$project$FromEnglish$Foulard;
		case 'founder':
			return _user$project$FromEnglish$Founder;
		case 'founding_date':
			return _user$project$FromEnglish$FoundingDate;
		case 'founding_location':
			return _user$project$FromEnglish$FoundingLocation;
		case 'four_wheel_drive_configuration':
			return _user$project$FromEnglish$FourWheelDriveConfiguration;
		case 'foxy':
			return _user$project$FromEnglish$Foxy;
		case 'francium':
			return _user$project$FromEnglish$Francium;
		case 'freak_folk':
			return _user$project$FromEnglish$FreakFolk;
		case 'freestyle':
			return _user$project$FromEnglish$Freestyle;
		case 'freestyle_house':
			return _user$project$FromEnglish$FreestyleHouse;
		case 'french_house':
			return _user$project$FromEnglish$FrenchHouse;
		case 'friday':
			return _user$project$FromEnglish$Friday;
		case 'frighten':
			return _user$project$FromEnglish$Frighten;
		case 'frisee':
			return _user$project$FromEnglish$Frisee;
		case 'from_location':
			return _user$project$FromEnglish$FromLocation;
		case 'front_wheel_drive_configuration':
			return _user$project$FromEnglish$FrontWheelDriveConfiguration;
		case 'fruit_ketchup':
			return _user$project$FromEnglish$FruitKetchup;
		case 'fruit_preserves':
			return _user$project$FromEnglish$FruitPreserves;
		case 'fry':
			return _user$project$FromEnglish$Fry;
		case 'fry_sauce':
			return _user$project$FromEnglish$FrySauce;
		case 'fuel_consumption':
			return _user$project$FromEnglish$FuelConsumption;
		case 'fuel_efficiency':
			return _user$project$FromEnglish$FuelEfficiency;
		case 'fuel_type':
			return _user$project$FromEnglish$FuelType;
		case 'funeral_doom':
			return _user$project$FromEnglish$FuneralDoom;
		case 'funk_metal':
			return _user$project$FromEnglish$FunkMetal;
		case 'funky_house':
			return _user$project$FromEnglish$FunkyHouse;
		case 'furniture_store':
			return _user$project$FromEnglish$FurnitureStore;
		case 'fustian':
			return _user$project$FromEnglish$Fustian;
		case 'gadolinium':
			return _user$project$FromEnglish$Gadolinium;
		case 'game_platform':
			return _user$project$FromEnglish$GamePlatform;
		case 'game_play_mode':
			return _user$project$FromEnglish$GamePlayMode;
		case 'game_server':
			return _user$project$FromEnglish$GameServer;
		case 'game_server_status':
			return _user$project$FromEnglish$GameServerStatus;
		case 'game_tip':
			return _user$project$FromEnglish$GameTip;
		case 'garage_punk':
			return _user$project$FromEnglish$GaragePunk;
		case 'garage_rock':
			return _user$project$FromEnglish$GarageRock;
		case 'garam_masala':
			return _user$project$FromEnglish$GaramMasala;
		case 'garden_store':
			return _user$project$FromEnglish$GardenStore;
		case 'garlic_chives':
			return _user$project$FromEnglish$GarlicChives;
		case 'garlic_powder':
			return _user$project$FromEnglish$GarlicPowder;
		case 'garlic_salt':
			return _user$project$FromEnglish$GarlicSalt;
		case 'gas_station':
			return _user$project$FromEnglish$GasStation;
		case 'gated_residence_community':
			return _user$project$FromEnglish$GatedResidenceCommunity;
		case 'gem_squash':
			return _user$project$FromEnglish$GemSquash;
		case 'gender':
			return _user$project$FromEnglish$Gender;
		case 'gender_type':
			return _user$project$FromEnglish$GenderType;
		case 'general_contractor':
			return _user$project$FromEnglish$GeneralContractor;
		case 'geo_circle':
			return _user$project$FromEnglish$GeoCircle;
		case 'geo_coordinates':
			return _user$project$FromEnglish$GeoCoordinates;
		case 'geo_midpoint':
			return _user$project$FromEnglish$GeoMidpoint;
		case 'geo_radius':
			return _user$project$FromEnglish$GeoRadius;
		case 'geo_shape':
			return _user$project$FromEnglish$GeoShape;
		case 'geographic_area':
			return _user$project$FromEnglish$GeographicArea;
		case 'georgette':
			return _user$project$FromEnglish$Georgette;
		case 'ghetto_house':
			return _user$project$FromEnglish$GhettoHouse;
		case 'ginger':
			return _user$project$FromEnglish$Ginger;
		case 'given_name':
			return _user$project$FromEnglish$GivenName;
		case 'glam_metal':
			return _user$project$FromEnglish$GlamMetal;
		case 'glam_rock':
			return _user$project$FromEnglish$GlamRock;
		case 'glass':
			return _user$project$FromEnglish$Glass;
		case 'glass_brick':
			return _user$project$FromEnglish$GlassBrick;
		case 'glass_fiber':
			return _user$project$FromEnglish$GlassFiber;
		case 'glass_wool':
			return _user$project$FromEnglish$GlassWool;
		case 'global_location_number':
			return _user$project$FromEnglish$GlobalLocationNumber;
		case 'glue_laminate':
			return _user$project$FromEnglish$GlueLaminate;
		case 'gluten_free_diet':
			return _user$project$FromEnglish$GlutenFreeDiet;
		case 'goji_berry':
			return _user$project$FromEnglish$GojiBerry;
		case 'golf_course':
			return _user$project$FromEnglish$GolfCourse;
		case 'good_relations_class':
			return _user$project$FromEnglish$GoodRelationsClass;
		case 'good_relations_terms':
			return _user$project$FromEnglish$GoodRelationsTerms;
		case 'gooseberry':
			return _user$project$FromEnglish$Gooseberry;
		case 'gothic_metal':
			return _user$project$FromEnglish$GothicMetal;
		case 'gothic_rock':
			return _user$project$FromEnglish$GothicRock;
		case 'government_building':
			return _user$project$FromEnglish$GovernmentBuilding;
		case 'government_office':
			return _user$project$FromEnglish$GovernmentOffice;
		case 'government_organization':
			return _user$project$FromEnglish$GovernmentOrganization;
		case 'government_permit':
			return _user$project$FromEnglish$GovernmentPermit;
		case 'government_service':
			return _user$project$FromEnglish$GovernmentService;
		case 'grains_of_paradise':
			return _user$project$FromEnglish$GrainsOfParadise;
		case 'grains_of_selim':
			return _user$project$FromEnglish$GrainsOfSelim;
		case 'grapefruit':
			return _user$project$FromEnglish$Grapefruit;
		case 'gravel':
			return _user$project$FromEnglish$Gravel;
		case 'greater_galangal':
			return _user$project$FromEnglish$GreaterGalangal;
		case 'greater_or_equal':
			return _user$project$FromEnglish$GreaterOrEqual;
		case 'green_bean':
			return _user$project$FromEnglish$GreenBean;
		case 'green_pepper':
			return _user$project$FromEnglish$GreenPepper;
		case 'green_peppercorn':
			return _user$project$FromEnglish$GreenPeppercorn;
		case 'grenadine':
			return _user$project$FromEnglish$Grenadine;
		case 'grenfell_cloth':
			return _user$project$FromEnglish$GrenfellCloth;
		case 'grocery_store':
			return _user$project$FromEnglish$GroceryStore;
		case 'groove_metal':
			return _user$project$FromEnglish$GrooveMetal;
		case 'grosgrain':
			return _user$project$FromEnglish$Grosgrain;
		case 'group_boarding_policy':
			return _user$project$FromEnglish$GroupBoardingPolicy;
		case 'guacamole':
			return _user$project$FromEnglish$Guacamole;
		case 'guarantee':
			return _user$project$FromEnglish$Guarantee;
		case 'guava':
			return _user$project$FromEnglish$Guava;
		case 'gypsum_board':
			return _user$project$FromEnglish$GypsumBoard;
		case 'habanero':
			return _user$project$FromEnglish$Habanero;
		case 'haircloth':
			return _user$project$FromEnglish$Haircloth;
		case 'halal_diet':
			return _user$project$FromEnglish$HalalDiet;
		case 'hard_bop':
			return _user$project$FromEnglish$HardBop;
		case 'hard_dance':
			return _user$project$FromEnglish$HardDance;
		case 'hard_rock':
			return _user$project$FromEnglish$HardRock;
		case 'hard_trance':
			return _user$project$FromEnglish$HardTrance;
		case 'hardcover':
			return _user$project$FromEnglish$Hardcover;
		case 'hardware_store':
			return _user$project$FromEnglish$HardwareStore;
		case 'harris_tweed':
			return _user$project$FromEnglish$HarrisTweed;
		case 'has_course_instance':
			return _user$project$FromEnglish$HasCourseInstance;
		case 'has_delivery_method':
			return _user$project$FromEnglish$HasDeliveryMethod;
		case 'has_digital_document_permission':
			return _user$project$FromEnglish$HasDigitalDocumentPermission;
		case 'has_map':
			return _user$project$FromEnglish$HasMap;
		case 'has_menu':
			return _user$project$FromEnglish$HasMenu;
		case 'has_menu_item':
			return _user$project$FromEnglish$HasMenuItem;
		case 'has_menu_section':
			return _user$project$FromEnglish$HasMenuSection;
		case 'has_offer_catalog':
			return _user$project$FromEnglish$HasOfferCatalog;
		case 'has_part':
			return _user$project$FromEnglish$HasPart;
		case 'headline':
			return _user$project$FromEnglish$Headline;
		case 'health_and_beauty_business':
			return _user$project$FromEnglish$HealthAndBeautyBusiness;
		case 'health_club':
			return _user$project$FromEnglish$HealthClub;
		case 'hearing_impaired_supported':
			return _user$project$FromEnglish$HearingImpairedSupported;
		case 'heavy_metal':
			return _user$project$FromEnglish$HeavyMetal;
		case 'help':
			return _user$project$FromEnglish$Help;
		case 'herbaceous':
			return _user$project$FromEnglish$Herbaceous;
		case 'herbal':
			return _user$project$FromEnglish$Herbal;
		case 'herbes_de_provence':
			return _user$project$FromEnglish$HerbesDeProvence;
		case 'herbs_and_spice':
			return _user$project$FromEnglish$HerbsAndSpice;
		case 'high_price':
			return _user$project$FromEnglish$HighPrice;
		case 'high_school':
			return _user$project$FromEnglish$HighSchool;
		case 'hindu_diet':
			return _user$project$FromEnglish$HinduDiet;
		case 'hindu_temple':
			return _user$project$FromEnglish$HinduTemple;
		case 'hip_house':
			return _user$project$FromEnglish$HipHouse;
		case 'hiring_organization':
			return _user$project$FromEnglish$HiringOrganization;
		case 'hobby_shop':
			return _user$project$FromEnglish$HobbyShop;
		case 'hodden':
			return _user$project$FromEnglish$Hodden;
		case 'hoja_santa':
			return _user$project$FromEnglish$HojaSanta;
		case 'holmium':
			return _user$project$FromEnglish$Holmium;
		case 'holy_basil':
			return _user$project$FromEnglish$HolyBasil;
		case 'home_and_construction_business':
			return _user$project$FromEnglish$HomeAndConstructionBusiness;
		case 'home_goods_store':
			return _user$project$FromEnglish$HomeGoodsStore;
		case 'home_location':
			return _user$project$FromEnglish$HomeLocation;
		case 'home_team':
			return _user$project$FromEnglish$HomeTeam;
		case 'honey_dill':
			return _user$project$FromEnglish$HoneyDill;
		case 'honeydew':
			return _user$project$FromEnglish$Honeydew;
		case 'honorific_prefix':
			return _user$project$FromEnglish$HonorificPrefix;
		case 'honorific_suffix':
			return _user$project$FromEnglish$HonorificSuffix;
		case 'horror_punk':
			return _user$project$FromEnglish$HorrorPunk;
		case 'horseradish':
			return _user$project$FromEnglish$Horseradish;
		case 'hospital':
			return _user$project$FromEnglish$Hospital;
		case 'hosting_organization':
			return _user$project$FromEnglish$HostingOrganization;
		case 'hot_mustard':
			return _user$project$FromEnglish$HotMustard;
		case 'hot_sauce':
			return _user$project$FromEnglish$HotSauce;
		case 'hotel_room':
			return _user$project$FromEnglish$HotelRoom;
		case 'houndstooth':
			return _user$project$FromEnglish$Houndstooth;
		case 'hours_available':
			return _user$project$FromEnglish$HoursAvailable;
		case 'house_painter':
			return _user$project$FromEnglish$HousePainter;
		case 'http_method':
			return _user$project$FromEnglish$HttpMethod;
		case 'huckleberry':
			return _user$project$FromEnglish$Huckleberry;
		case 'iata_code':
			return _user$project$FromEnglish$IataCode;
		case 'ice_cream_shop':
			return _user$project$FromEnglish$IceCreamShop;
		case 'identify':
			return _user$project$FromEnglish$Identify;
		case 'idli_podi':
			return _user$project$FromEnglish$IdliPodi;
		case 'ignore_action':
			return _user$project$FromEnglish$IgnoreAction;
		case 'illustrator':
			return _user$project$FromEnglish$Illustrator;
		case 'image_gallery':
			return _user$project$FromEnglish$ImageGallery;
		case 'image_object':
			return _user$project$FromEnglish$ImageObject;
		case 'imagine':
			return _user$project$FromEnglish$Imagine;
		case 'impress':
			return _user$project$FromEnglish$Impress;
		case 'improve':
			return _user$project$FromEnglish$Improve;
		case 'in_broadcast_lineup':
			return _user$project$FromEnglish$InBroadcastLineup;
		case 'in_language':
			return _user$project$FromEnglish$InLanguage;
		case 'in_playlist':
			return _user$project$FromEnglish$InPlaylist;
		case 'in_stock':
			return _user$project$FromEnglish$InStock;
		case 'in_store_only':
			return _user$project$FromEnglish$InStoreOnly;
		case 'incentive_compensation':
			return _user$project$FromEnglish$IncentiveCompensation;
		case 'incentives':
			return _user$project$FromEnglish$Incentives;
		case 'include':
			return _user$project$FromEnglish$Include;
		case 'included_composition':
			return _user$project$FromEnglish$IncludedComposition;
		case 'included_data_catalog':
			return _user$project$FromEnglish$IncludedDataCatalog;
		case 'included_in_data_catalog':
			return _user$project$FromEnglish$IncludedInDataCatalog;
		case 'includes_object':
			return _user$project$FromEnglish$IncludesObject;
		case 'increase':
			return _user$project$FromEnglish$Increase;
		case 'indian_bay_leaf':
			return _user$project$FromEnglish$IndianBayLeaf;
		case 'indie_folk':
			return _user$project$FromEnglish$IndieFolk;
		case 'indie_pop':
			return _user$project$FromEnglish$IndiePop;
		case 'indie_rock':
			return _user$project$FromEnglish$IndieRock;
		case 'indium':
			return _user$project$FromEnglish$Indium;
		case 'individual_product':
			return _user$project$FromEnglish$IndividualProduct;
		case 'industrial':
			return _user$project$FromEnglish$Industrial;
		case 'industrial_folk':
			return _user$project$FromEnglish$IndustrialFolk;
		case 'industrial_metal':
			return _user$project$FromEnglish$IndustrialMetal;
		case 'industrial_rock':
			return _user$project$FromEnglish$IndustrialRock;
		case 'industry':
			return _user$project$FromEnglish$Industry;
		case 'ineligible_region':
			return _user$project$FromEnglish$IneligibleRegion;
		case 'influence':
			return _user$project$FromEnglish$Influence;
		case 'inform':
			return _user$project$FromEnglish$Inform;
		case 'inform_action':
			return _user$project$FromEnglish$InformAction;
		case 'ingredients':
			return _user$project$FromEnglish$Ingredients;
		case 'inject':
			return _user$project$FromEnglish$Inject;
		case 'injure':
			return _user$project$FromEnglish$Injure;
		case 'insert_action':
			return _user$project$FromEnglish$InsertAction;
		case 'install_action':
			return _user$project$FromEnglish$InstallAction;
		case 'install_url':
			return _user$project$FromEnglish$InstallUrl;
		case 'instructor':
			return _user$project$FromEnglish$Instructor;
		case 'instrument':
			return _user$project$FromEnglish$Instrument;
		case 'insurance_agency':
			return _user$project$FromEnglish$InsuranceAgency;
		case 'intangible':
			return _user$project$FromEnglish$Intangible;
		case 'integer':
			return _user$project$FromEnglish$Integer;
		case 'intellectually_satisfying':
			return _user$project$FromEnglish$IntellectuallySatisfying;
		case 'intelligent_drum_and_bass':
			return _user$project$FromEnglish$IntelligentDrumAndBass;
		case 'intend':
			return _user$project$FromEnglish$Intend;
		case 'interact_action':
			return _user$project$FromEnglish$InteractAction;
		case 'interaction_counter':
			return _user$project$FromEnglish$InteractionCounter;
		case 'interaction_service':
			return _user$project$FromEnglish$InteractionService;
		case 'interaction_statistic':
			return _user$project$FromEnglish$InteractionStatistic;
		case 'interaction_type':
			return _user$project$FromEnglish$InteractionType;
		case 'interactivity_type':
			return _user$project$FromEnglish$InteractivityType;
		case 'interest':
			return _user$project$FromEnglish$Interest;
		case 'interest_rate':
			return _user$project$FromEnglish$InterestRate;
		case 'interfere':
			return _user$project$FromEnglish$Interfere;
		case 'internet_cafe':
			return _user$project$FromEnglish$InternetCafe;
		case 'interrupt':
			return _user$project$FromEnglish$Interrupt;
		case 'introduce':
			return _user$project$FromEnglish$Introduce;
		case 'invent':
			return _user$project$FromEnglish$Invent;
		case 'inventory_level':
			return _user$project$FromEnglish$InventoryLevel;
		case 'investment_or_deposit':
			return _user$project$FromEnglish$InvestmentOrDeposit;
		case 'invite':
			return _user$project$FromEnglish$Invite;
		case 'invite_action':
			return _user$project$FromEnglish$InviteAction;
		case 'invoice':
			return _user$project$FromEnglish$Invoice;
		case 'irish_linen':
			return _user$project$FromEnglish$IrishLinen;
		case 'irritate':
			return _user$project$FromEnglish$Irritate;
		case 'is_accessible_for_free':
			return _user$project$FromEnglish$IsAccessibleForFree;
		case 'is_accessory_or_spare_part_for':
			return _user$project$FromEnglish$IsAccessoryOrSparePartFor;
		case 'is_based_on':
			return _user$project$FromEnglish$IsBasedOn;
		case 'is_based_on_url':
			return _user$project$FromEnglish$IsBasedOnUrl;
		case 'is_consumable_for':
			return _user$project$FromEnglish$IsConsumableFor;
		case 'is_family_friendly':
			return _user$project$FromEnglish$IsFamilyFriendly;
		case 'is_gift':
			return _user$project$FromEnglish$IsGift;
		case 'is_live_broadcast':
			return _user$project$FromEnglish$IsLiveBroadcast;
		case 'is_part_of':
			return _user$project$FromEnglish$IsPartOf;
		case 'is_related_to':
			return _user$project$FromEnglish$IsRelatedTo;
		case 'is_similar_to':
			return _user$project$FromEnglish$IsSimilarTo;
		case 'is_variant_of':
			return _user$project$FromEnglish$IsVariantOf;
		case 'issue_number':
			return _user$project$FromEnglish$IssueNumber;
		case 'issued_by':
			return _user$project$FromEnglish$IssuedBy;
		case 'issued_through':
			return _user$project$FromEnglish$IssuedThrough;
		case 'italo_dance':
			return _user$project$FromEnglish$ItaloDance;
		case 'italo_disco':
			return _user$project$FromEnglish$ItaloDisco;
		case 'italo_house':
			return _user$project$FromEnglish$ItaloHouse;
		case 'item_availability':
			return _user$project$FromEnglish$ItemAvailability;
		case 'item_condition':
			return _user$project$FromEnglish$ItemCondition;
		case 'item_list':
			return _user$project$FromEnglish$ItemList;
		case 'item_list_element':
			return _user$project$FromEnglish$ItemListElement;
		case 'item_list_order':
			return _user$project$FromEnglish$ItemListOrder;
		case 'item_list_order_ascending':
			return _user$project$FromEnglish$ItemListOrderAscending;
		case 'item_list_order_descending':
			return _user$project$FromEnglish$ItemListOrderDescending;
		case 'item_list_order_type':
			return _user$project$FromEnglish$ItemListOrderType;
		case 'item_list_unordered':
			return _user$project$FromEnglish$ItemListUnordered;
		case 'item_offered':
			return _user$project$FromEnglish$ItemOffered;
		case 'item_page':
			return _user$project$FromEnglish$ItemPage;
		case 'item_reviewed':
			return _user$project$FromEnglish$ItemReviewed;
		case 'item_shipped':
			return _user$project$FromEnglish$ItemShipped;
		case 'jackfruit':
			return _user$project$FromEnglish$Jackfruit;
		case 'jalapeno':
			return _user$project$FromEnglish$Jalapeno;
		case 'jamaican_jerk_spice':
			return _user$project$FromEnglish$JamaicanJerkSpice;
		case 'jazz_blues':
			return _user$project$FromEnglish$JazzBlues;
		case 'jazz_funk':
			return _user$project$FromEnglish$JazzFunk;
		case 'jazz_fusion':
			return _user$project$FromEnglish$JazzFusion;
		case 'jazz_rap':
			return _user$project$FromEnglish$JazzRap;
		case 'jazz_rock':
			return _user$project$FromEnglish$JazzRock;
		case 'jerusalem_artichoke':
			return _user$project$FromEnglish$JerusalemArtichoke;
		case 'jewelry_store':
			return _user$project$FromEnglish$JewelryStore;
		case 'jicama':
			return _user$project$FromEnglish$Jicama;
		case 'job_benefits':
			return _user$project$FromEnglish$JobBenefits;
		case 'job_location':
			return _user$project$FromEnglish$JobLocation;
		case 'job_posting':
			return _user$project$FromEnglish$JobPosting;
		case 'job_title':
			return _user$project$FromEnglish$JobTitle;
		case 'join_action':
			return _user$project$FromEnglish$JoinAction;
		case 'judge':
			return _user$project$FromEnglish$Judge;
		case 'juicy':
			return _user$project$FromEnglish$Juicy;
		case 'jujube':
			return _user$project$FromEnglish$Jujube;
		case 'jump_up':
			return _user$project$FromEnglish$JumpUp;
		case 'juniper_berry':
			return _user$project$FromEnglish$JuniperBerry;
		case 'kente_cloth':
			return _user$project$FromEnglish$KenteCloth;
		case 'kerseymere':
			return _user$project$FromEnglish$Kerseymere;
		case 'ketchup':
			return _user$project$FromEnglish$Ketchup;
		case 'kevlar':
			return _user$project$FromEnglish$Kevlar;
		case 'keywords':
			return _user$project$FromEnglish$Keywords;
		case 'khaki_drill':
			return _user$project$FromEnglish$KhakiDrill;
		case 'kick':
			return _user$project$FromEnglish$Kick;
		case 'kidney_bean':
			return _user$project$FromEnglish$KidneyBean;
		case 'kill':
			return _user$project$FromEnglish$Kill;
		case 'kimchi':
			return _user$project$FromEnglish$Kimchi;
		case 'kiss':
			return _user$project$FromEnglish$Kiss;
		case 'kiwi_fruit':
			return _user$project$FromEnglish$KiwiFruit;
		case 'kneel':
			return _user$project$FromEnglish$Kneel;
		case 'knock':
			return _user$project$FromEnglish$Knock;
		case 'known_vehicle_damages':
			return _user$project$FromEnglish$KnownVehicleDamages;
		case 'kohlrabi':
			return _user$project$FromEnglish$Kohlrabi;
		case 'kosher_diet':
			return _user$project$FromEnglish$KosherDiet;
		case 'krautrock':
			return _user$project$FromEnglish$Krautrock;
		case 'kumquat':
			return _user$project$FromEnglish$Kumquat;
		case 'label':
			return _user$project$FromEnglish$Label;
		case 'lake_body_of_water':
			return _user$project$FromEnglish$LakeBodyOfWater;
		case 'lampas':
			return _user$project$FromEnglish$Lampas;
		case 'landform':
			return _user$project$FromEnglish$Landform;
		case 'landlord':
			return _user$project$FromEnglish$Landlord;
		case 'landmarks_or_historical_buildings':
			return _user$project$FromEnglish$LandmarksOrHistoricalBuildings;
		case 'language':
			return _user$project$FromEnglish$Language;
		case 'lanthanum':
			return _user$project$FromEnglish$Lanthanum;
		case 'laser_disc_format':
			return _user$project$FromEnglish$LaserDiscFormat;
		case 'laser_like':
			return _user$project$FromEnglish$LaserLike;
		case 'last_reviewed':
			return _user$project$FromEnglish$LastReviewed;
		case 'latin_house':
			return _user$project$FromEnglish$LatinHouse;
		case 'latin_jazz':
			return _user$project$FromEnglish$LatinJazz;
		case 'latitude':
			return _user$project$FromEnglish$Latitude;
		case 'laugh':
			return _user$project$FromEnglish$Laugh;
		case 'launch':
			return _user$project$FromEnglish$Launch;
		case 'lavender':
			return _user$project$FromEnglish$Lavender;
		case 'lawrencium':
			return _user$project$FromEnglish$Lawrencium;
		case 'learn':
			return _user$project$FromEnglish$Learn;
		case 'learning_resource_type':
			return _user$project$FromEnglish$LearningResourceType;
		case 'leathery':
			return _user$project$FromEnglish$Leathery;
		case 'leave_action':
			return _user$project$FromEnglish$LeaveAction;
		case 'left_hand_driving':
			return _user$project$FromEnglish$LeftHandDriving;
		case 'legal_name':
			return _user$project$FromEnglish$LegalName;
		case 'legal_service':
			return _user$project$FromEnglish$LegalService;
		case 'legislative_building':
			return _user$project$FromEnglish$LegislativeBuilding;
		case 'legume':
			return _user$project$FromEnglish$Legume;
		case 'lei_code':
			return _user$project$FromEnglish$LeiCode;
		case 'lemon':
			return _user$project$FromEnglish$Lemon;
		case 'lemon_balm':
			return _user$project$FromEnglish$LemonBalm;
		case 'lemon_grass':
			return _user$project$FromEnglish$LemonGrass;
		case 'lemon_myrtle':
			return _user$project$FromEnglish$LemonMyrtle;
		case 'lemon_pepper':
			return _user$project$FromEnglish$LemonPepper;
		case 'lemon_verbena':
			return _user$project$FromEnglish$LemonVerbena;
		case 'lend_action':
			return _user$project$FromEnglish$LendAction;
		case 'lender':
			return _user$project$FromEnglish$Lender;
		case 'lentils':
			return _user$project$FromEnglish$Lentils;
		case 'lesser':
			return _user$project$FromEnglish$Lesser;
		case 'lesser_galangal':
			return _user$project$FromEnglish$LesserGalangal;
		case 'lesser_or_equal':
			return _user$project$FromEnglish$LesserOrEqual;
		case 'lettuce':
			return _user$project$FromEnglish$Lettuce;
		case 'library':
			return _user$project$FromEnglish$Library;
		case 'license':
			return _user$project$FromEnglish$License;
		case 'lighten':
			return _user$project$FromEnglish$Lighten;
		case 'like_action':
			return _user$project$FromEnglish$LikeAction;
		case 'lima_bean':
			return _user$project$FromEnglish$LimaBean;
		case 'lime':
			return _user$project$FromEnglish$Lime;
		case 'limited_availability':
			return _user$project$FromEnglish$LimitedAvailability;
		case 'linen':
			return _user$project$FromEnglish$Linen;
		case 'liquid_funk':
			return _user$project$FromEnglish$LiquidFunk;
		case 'liquor_store':
			return _user$project$FromEnglish$LiquorStore;
		case 'liquorice':
			return _user$project$FromEnglish$Liquorice;
		case 'list':
			return _user$project$FromEnglish$List;
		case 'list_item':
			return _user$project$FromEnglish$ListItem;
		case 'listen':
			return _user$project$FromEnglish$Listen;
		case 'listen_action':
			return _user$project$FromEnglish$ListenAction;
		case 'literary_event':
			return _user$project$FromEnglish$LiteraryEvent;
		case 'lithium':
			return _user$project$FromEnglish$Lithium;
		case 'live_album':
			return _user$project$FromEnglish$LiveAlbum;
		case 'live_blog_posting':
			return _user$project$FromEnglish$LiveBlogPosting;
		case 'live_blog_update':
			return _user$project$FromEnglish$LiveBlogUpdate;
		case 'load':
			return _user$project$FromEnglish$Load;
		case 'loan_or_credit':
			return _user$project$FromEnglish$LoanOrCredit;
		case 'loan_term':
			return _user$project$FromEnglish$LoanTerm;
		case 'local_business':
			return _user$project$FromEnglish$LocalBusiness;
		case 'location':
			return _user$project$FromEnglish$Location;
		case 'location_created':
			return _user$project$FromEnglish$LocationCreated;
		case 'location_feature_specification':
			return _user$project$FromEnglish$LocationFeatureSpecification;
		case 'locker_delivery':
			return _user$project$FromEnglish$LockerDelivery;
		case 'locksmith':
			return _user$project$FromEnglish$Locksmith;
		case 'loden':
			return _user$project$FromEnglish$Loden;
		case 'lodging_business':
			return _user$project$FromEnglish$LodgingBusiness;
		case 'lodging_reservation':
			return _user$project$FromEnglish$LodgingReservation;
		case 'lodging_unit_description':
			return _user$project$FromEnglish$LodgingUnitDescription;
		case 'lodging_unit_type':
			return _user$project$FromEnglish$LodgingUnitType;
		case 'long_pepper':
			return _user$project$FromEnglish$LongPepper;
		case 'longitude':
			return _user$project$FromEnglish$Longitude;
		case 'look':
			return _user$project$FromEnglish$Look;
		case 'loquat':
			return _user$project$FromEnglish$Loquat;
		case 'lose_action':
			return _user$project$FromEnglish$LoseAction;
		case 'loser':
			return _user$project$FromEnglish$Loser;
		case 'lovage':
			return _user$project$FromEnglish$Lovage;
		case 'love':
			return _user$project$FromEnglish$Love;
		case 'low_calorie_diet':
			return _user$project$FromEnglish$LowCalorieDiet;
		case 'low_fat_diet':
			return _user$project$FromEnglish$LowFatDiet;
		case 'low_lactose_diet':
			return _user$project$FromEnglish$LowLactoseDiet;
		case 'low_price':
			return _user$project$FromEnglish$LowPrice;
		case 'low_salt_diet':
			return _user$project$FromEnglish$LowSaltDiet;
		case 'lutetium':
			return _user$project$FromEnglish$Lutetium;
		case 'lychee':
			return _user$project$FromEnglish$Lychee;
		case 'lyricist':
			return _user$project$FromEnglish$Lyricist;
		case 'lyrics':
			return _user$project$FromEnglish$Lyrics;
		case 'machine_knitting':
			return _user$project$FromEnglish$MachineKnitting;
		case 'madras':
			return _user$project$FromEnglish$Madras;
		case 'magnesium':
			return _user$project$FromEnglish$Magnesium;
		case 'main_content_of_page':
			return _user$project$FromEnglish$MainContentOfPage;
		case 'main_entity':
			return _user$project$FromEnglish$MainEntity;
		case 'main_entity_of_page':
			return _user$project$FromEnglish$MainEntityOfPage;
		case 'mainstream_jazz':
			return _user$project$FromEnglish$MainstreamJazz;
		case 'makes_offer':
			return _user$project$FromEnglish$MakesOffer;
		case 'male':
			return _user$project$FromEnglish$Male;
		case 'mamey':
			return _user$project$FromEnglish$Mamey;
		case 'manage':
			return _user$project$FromEnglish$Manage;
		case 'mandarine':
			return _user$project$FromEnglish$Mandarine;
		case 'manganese':
			return _user$project$FromEnglish$Manganese;
		case 'mangetout':
			return _user$project$FromEnglish$Mangetout;
		case 'mango_ginger':
			return _user$project$FromEnglish$MangoGinger;
		case 'mango_pickle':
			return _user$project$FromEnglish$MangoPickle;
		case 'manufacturer':
			return _user$project$FromEnglish$Manufacturer;
		case 'map_category_type':
			return _user$project$FromEnglish$MapCategoryType;
		case 'map_type':
			return _user$project$FromEnglish$MapType;
		case 'marjoram':
			return _user$project$FromEnglish$Marjoram;
		case 'marry_action':
			return _user$project$FromEnglish$MarryAction;
		case 'mastic':
			return _user$project$FromEnglish$Mastic;
		case 'match':
			return _user$project$FromEnglish$Match;
		case 'material':
			return _user$project$FromEnglish$Material;
		case 'math_rock':
			return _user$project$FromEnglish$MathRock;
		case 'matter':
			return _user$project$FromEnglish$Matter;
		case 'max_price':
			return _user$project$FromEnglish$MaxPrice;
		case 'max_value':
			return _user$project$FromEnglish$MaxValue;
		case 'maximum_attendee_capacity':
			return _user$project$FromEnglish$MaximumAttendeeCapacity;
		case 'mayonnaise':
			return _user$project$FromEnglish$Mayonnaise;
		case 'meal_service':
			return _user$project$FromEnglish$MealService;
		case 'media_object':
			return _user$project$FromEnglish$MediaObject;
		case 'medical_organization':
			return _user$project$FromEnglish$MedicalOrganization;
		case 'medieval_metal':
			return _user$project$FromEnglish$MedievalMetal;
		case 'meitnerium':
			return _user$project$FromEnglish$Meitnerium;
		case 'melodic_death_metal':
			return _user$project$FromEnglish$MelodicDeathMetal;
		case 'melt':
			return _user$project$FromEnglish$Melt;
		case 'member':
			return _user$project$FromEnglish$Member;
		case 'member_of':
			return _user$project$FromEnglish$MemberOf;
		case 'members':
			return _user$project$FromEnglish$Members;
		case 'membership_number':
			return _user$project$FromEnglish$MembershipNumber;
		case 'memorise':
			return _user$project$FromEnglish$Memorise;
		case 'memory_requirements':
			return _user$project$FromEnglish$MemoryRequirements;
		case 'mendelevium':
			return _user$project$FromEnglish$Mendelevium;
		case 'mens_clothing_store':
			return _user$project$FromEnglish$MensClothingStore;
		case 'mentions':
			return _user$project$FromEnglish$Mentions;
		case 'menu':
			return _user$project$FromEnglish$Menu;
		case 'menu_item':
			return _user$project$FromEnglish$MenuItem;
		case 'menu_section':
			return _user$project$FromEnglish$MenuSection;
		case 'merchant':
			return _user$project$FromEnglish$Merchant;
		case 'mercury':
			return _user$project$FromEnglish$Mercury;
		case 'mesh':
			return _user$project$FromEnglish$Mesh;
		case 'mess_up':
			return _user$project$FromEnglish$MessUp;
		case 'message':
			return _user$project$FromEnglish$Message;
		case 'message_attachment':
			return _user$project$FromEnglish$MessageAttachment;
		case 'microfiber':
			return _user$project$FromEnglish$Microfiber;
		case 'microhouse':
			return _user$project$FromEnglish$Microhouse;
		case 'middle_school':
			return _user$project$FromEnglish$MiddleSchool;
		case 'mignonette_sauce':
			return _user$project$FromEnglish$MignonetteSauce;
		case 'mileage_from_odometer':
			return _user$project$FromEnglish$MileageFromOdometer;
		case 'milk':
			return _user$project$FromEnglish$Milk;
		case 'min_price':
			return _user$project$FromEnglish$MinPrice;
		case 'min_value':
			return _user$project$FromEnglish$MinValue;
		case 'minimum_payment_due':
			return _user$project$FromEnglish$MinimumPaymentDue;
		case 'mint':
			return _user$project$FromEnglish$Mint;
		case 'miss':
			return _user$project$FromEnglish$Miss;
		case 'mix':
			return _user$project$FromEnglish$Mix;
		case 'mixed_spice':
			return _user$project$FromEnglish$MixedSpice;
		case 'mixtape_album':
			return _user$project$FromEnglish$MixtapeAlbum;
		case 'moan':
			return _user$project$FromEnglish$Moan;
		case 'mobile_application':
			return _user$project$FromEnglish$MobileApplication;
		case 'mobile_phone_store':
			return _user$project$FromEnglish$MobilePhoneStore;
		case 'modal_jazz':
			return _user$project$FromEnglish$ModalJazz;
		case 'model':
			return _user$project$FromEnglish$Model;
		case 'modified_time':
			return _user$project$FromEnglish$ModifiedTime;
		case 'moleskin':
			return _user$project$FromEnglish$Moleskin;
		case 'molybdenum':
			return _user$project$FromEnglish$Molybdenum;
		case 'monday':
			return _user$project$FromEnglish$Monday;
		case 'monetary_amount':
			return _user$project$FromEnglish$MonetaryAmount;
		case 'monkey_gland_sauce':
			return _user$project$FromEnglish$MonkeyGlandSauce;
		case 'montreal_steak_seasoning':
			return _user$project$FromEnglish$MontrealSteakSeasoning;
		case 'moquette':
			return _user$project$FromEnglish$Moquette;
		case 'mosque':
			return _user$project$FromEnglish$Mosque;
		case 'motel':
			return _user$project$FromEnglish$Motel;
		case 'motorcycle_dealer':
			return _user$project$FromEnglish$MotorcycleDealer;
		case 'motorcycle_repair':
			return _user$project$FromEnglish$MotorcycleRepair;
		case 'mountain':
			return _user$project$FromEnglish$Mountain;
		case 'mourn':
			return _user$project$FromEnglish$Mourn;
		case 'move':
			return _user$project$FromEnglish$Move;
		case 'move_action':
			return _user$project$FromEnglish$MoveAction;
		case 'movie':
			return _user$project$FromEnglish$Movie;
		case 'movie_clip':
			return _user$project$FromEnglish$MovieClip;
		case 'movie_rental_store':
			return _user$project$FromEnglish$MovieRentalStore;
		case 'movie_series':
			return _user$project$FromEnglish$MovieSeries;
		case 'movie_theater':
			return _user$project$FromEnglish$MovieTheater;
		case 'moving_company':
			return _user$project$FromEnglish$MovingCompany;
		case 'mud':
			return _user$project$FromEnglish$Mud;
		case 'muddle':
			return _user$project$FromEnglish$Muddle;
		case 'mugwort':
			return _user$project$FromEnglish$Mugwort;
		case 'mulberry':
			return _user$project$FromEnglish$Mulberry;
		case 'mulling_spices':
			return _user$project$FromEnglish$MullingSpices;
		case 'multiple_values':
			return _user$project$FromEnglish$MultipleValues;
		case 'multiply':
			return _user$project$FromEnglish$Multiply;
		case 'mumbo_sauce':
			return _user$project$FromEnglish$MumboSauce;
		case 'mung_bean':
			return _user$project$FromEnglish$MungBean;
		case 'murder':
			return _user$project$FromEnglish$Murder;
		case 'museum':
			return _user$project$FromEnglish$Museum;
		case 'mushroom':
			return _user$project$FromEnglish$Mushroom;
		case 'mushroom_ketchup':
			return _user$project$FromEnglish$MushroomKetchup;
		case 'music_album':
			return _user$project$FromEnglish$MusicAlbum;
		case 'music_album_production_type':
			return _user$project$FromEnglish$MusicAlbumProductionType;
		case 'music_album_release_type':
			return _user$project$FromEnglish$MusicAlbumReleaseType;
		case 'music_arrangement':
			return _user$project$FromEnglish$MusicArrangement;
		case 'music_by':
			return _user$project$FromEnglish$MusicBy;
		case 'music_composition':
			return _user$project$FromEnglish$MusicComposition;
		case 'music_composition_form':
			return _user$project$FromEnglish$MusicCompositionForm;
		case 'music_event':
			return _user$project$FromEnglish$MusicEvent;
		case 'music_group':
			return _user$project$FromEnglish$MusicGroup;
		case 'music_group_member':
			return _user$project$FromEnglish$MusicGroupMember;
		case 'music_playlist':
			return _user$project$FromEnglish$MusicPlaylist;
		case 'music_recording':
			return _user$project$FromEnglish$MusicRecording;
		case 'music_release':
			return _user$project$FromEnglish$MusicRelease;
		case 'music_release_format':
			return _user$project$FromEnglish$MusicReleaseFormat;
		case 'music_release_format_type':
			return _user$project$FromEnglish$MusicReleaseFormatType;
		case 'music_store':
			return _user$project$FromEnglish$MusicStore;
		case 'music_venue':
			return _user$project$FromEnglish$MusicVenue;
		case 'music_video_object':
			return _user$project$FromEnglish$MusicVideoObject;
		case 'musical_key':
			return _user$project$FromEnglish$MusicalKey;
		case 'muslin':
			return _user$project$FromEnglish$Muslin;
		case 'mustard':
			return _user$project$FromEnglish$Mustard;
		case 'mustard_green':
			return _user$project$FromEnglish$MustardGreen;
		case 'mustard_oil':
			return _user$project$FromEnglish$MustardOil;
		case 'musty':
			return _user$project$FromEnglish$Musty;
		case 'nail_salon':
			return _user$project$FromEnglish$NailSalon;
		case 'nainsook':
			return _user$project$FromEnglish$Nainsook;
		case 'named_position':
			return _user$project$FromEnglish$NamedPosition;
		case 'nankeen':
			return _user$project$FromEnglish$Nankeen;
		case 'nationality':
			return _user$project$FromEnglish$Nationality;
		case 'navy_bean':
			return _user$project$FromEnglish$NavyBean;
		case 'nectarine':
			return _user$project$FromEnglish$Nectarine;
		case 'need':
			return _user$project$FromEnglish$Need;
		case 'neo_bop_jazz':
			return _user$project$FromEnglish$NeoBopJazz;
		case 'neo_psychedelia':
			return _user$project$FromEnglish$NeoPsychedelia;
		case 'neo_swing':
			return _user$project$FromEnglish$NeoSwing;
		case 'neodymium':
			return _user$project$FromEnglish$Neodymium;
		case 'neptunium':
			return _user$project$FromEnglish$Neptunium;
		case 'nest':
			return _user$project$FromEnglish$Nest;
		case 'net_worth':
			return _user$project$FromEnglish$NetWorth;
		case 'new_age':
			return _user$project$FromEnglish$NewAge;
		case 'new_beat':
			return _user$project$FromEnglish$NewBeat;
		case 'new_condition':
			return _user$project$FromEnglish$NewCondition;
		case 'new_prog':
			return _user$project$FromEnglish$NewProg;
		case 'new_rave':
			return _user$project$FromEnglish$NewRave;
		case 'new_wave':
			return _user$project$FromEnglish$NewWave;
		case 'new_zealand_spinach':
			return _user$project$FromEnglish$NewZealandSpinach;
		case 'news_article':
			return _user$project$FromEnglish$NewsArticle;
		case 'next_item':
			return _user$project$FromEnglish$NextItem;
		case 'ngo':
			return _user$project$FromEnglish$Ngo;
		case 'nickel':
			return _user$project$FromEnglish$Nickel;
		case 'nigella':
			return _user$project$FromEnglish$Nigella;
		case 'nigella_sativa':
			return _user$project$FromEnglish$NigellaSativa;
		case 'night_club':
			return _user$project$FromEnglish$NightClub;
		case 'ninon':
			return _user$project$FromEnglish$Ninon;
		case 'niobium':
			return _user$project$FromEnglish$Niobium;
		case 'nobelium':
			return _user$project$FromEnglish$Nobelium;
		case 'noise_pop':
			return _user$project$FromEnglish$NoisePop;
		case 'noise_rock':
			return _user$project$FromEnglish$NoiseRock;
		case 'non_equal':
			return _user$project$FromEnglish$NonEqual;
		case 'notary':
			return _user$project$FromEnglish$Notary;
		case 'note':
			return _user$project$FromEnglish$Note;
		case 'note_digital_document':
			return _user$project$FromEnglish$NoteDigitalDocument;
		case 'notice':
			return _user$project$FromEnglish$Notice;
		case 'novelty_ragtime':
			return _user$project$FromEnglish$NoveltyRagtime;
		case 'nu_disco':
			return _user$project$FromEnglish$NuDisco;
		case 'nu_jazz':
			return _user$project$FromEnglish$NuJazz;
		case 'nu_metal':
			return _user$project$FromEnglish$NuMetal;
		case 'nu_skool_breaks':
			return _user$project$FromEnglish$NuSkoolBreaks;
		case 'null':
			return _user$project$FromEnglish$Null;
		case 'num_adults':
			return _user$project$FromEnglish$NumAdults;
		case 'num_children':
			return _user$project$FromEnglish$NumChildren;
		case 'number':
			return _user$project$FromEnglish$Number;
		case 'number_of_airbags':
			return _user$project$FromEnglish$NumberOfAirbags;
		case 'number_of_axles':
			return _user$project$FromEnglish$NumberOfAxles;
		case 'number_of_beds':
			return _user$project$FromEnglish$NumberOfBeds;
		case 'number_of_doors':
			return _user$project$FromEnglish$NumberOfDoors;
		case 'number_of_employees':
			return _user$project$FromEnglish$NumberOfEmployees;
		case 'number_of_episodes':
			return _user$project$FromEnglish$NumberOfEpisodes;
		case 'number_of_forward_gears':
			return _user$project$FromEnglish$NumberOfForwardGears;
		case 'number_of_items':
			return _user$project$FromEnglish$NumberOfItems;
		case 'number_of_pages':
			return _user$project$FromEnglish$NumberOfPages;
		case 'number_of_players':
			return _user$project$FromEnglish$NumberOfPlayers;
		case 'number_of_previous_owners':
			return _user$project$FromEnglish$NumberOfPreviousOwners;
		case 'number_of_rooms':
			return _user$project$FromEnglish$NumberOfRooms;
		case 'number_of_seasons':
			return _user$project$FromEnglish$NumberOfSeasons;
		case 'numbered_position':
			return _user$project$FromEnglish$NumberedPosition;
		case 'nut':
			return _user$project$FromEnglish$Nut;
		case 'nutmeg':
			return _user$project$FromEnglish$Nutmeg;
		case 'nutrition':
			return _user$project$FromEnglish$Nutrition;
		case 'nutrition_information':
			return _user$project$FromEnglish$NutritionInformation;
		case 'nutritional_yeast':
			return _user$project$FromEnglish$NutritionalYeast;
		case 'nylon':
			return _user$project$FromEnglish$Nylon;
		case 'oaked':
			return _user$project$FromEnglish$Oaked;
		case 'object':
			return _user$project$FromEnglish$Object;
		case 'observe':
			return _user$project$FromEnglish$Observe;
		case 'obtain':
			return _user$project$FromEnglish$Obtain;
		case 'occupancy':
			return _user$project$FromEnglish$Occupancy;
		case 'occupational_category':
			return _user$project$FromEnglish$OccupationalCategory;
		case 'ocean_body_of_water':
			return _user$project$FromEnglish$OceanBodyOfWater;
		case 'offer_catalog':
			return _user$project$FromEnglish$OfferCatalog;
		case 'offer_count':
			return _user$project$FromEnglish$OfferCount;
		case 'offer_item_condition':
			return _user$project$FromEnglish$OfferItemCondition;
		case 'office_equipment_store':
			return _user$project$FromEnglish$OfficeEquipmentStore;
		case 'offline_permanently':
			return _user$project$FromEnglish$OfflinePermanently;
		case 'offline_temporarily':
			return _user$project$FromEnglish$OfflineTemporarily;
		case 'oilskin':
			return _user$project$FromEnglish$Oilskin;
		case 'okra':
			return _user$project$FromEnglish$Okra;
		case 'old_bay_seasoning':
			return _user$project$FromEnglish$OldBaySeasoning;
		case 'oldschool_jungle':
			return _user$project$FromEnglish$OldschoolJungle;
		case 'olefin':
			return _user$project$FromEnglish$Olefin;
		case 'olive':
			return _user$project$FromEnglish$Olive;
		case 'olive_oil':
			return _user$project$FromEnglish$OliveOil;
		case 'on_demand_event':
			return _user$project$FromEnglish$OnDemandEvent;
		case 'on_site_pickup':
			return _user$project$FromEnglish$OnSitePickup;
		case 'onion':
			return _user$project$FromEnglish$Onion;
		case 'onion_powder':
			return _user$project$FromEnglish$OnionPowder;
		case 'online':
			return _user$project$FromEnglish$Online;
		case 'online_full':
			return _user$project$FromEnglish$OnlineFull;
		case 'online_only':
			return _user$project$FromEnglish$OnlineOnly;
		case 'opening_hours':
			return _user$project$FromEnglish$OpeningHours;
		case 'opening_hours_specification':
			return _user$project$FromEnglish$OpeningHoursSpecification;
		case 'operating_system':
			return _user$project$FromEnglish$OperatingSystem;
		case 'opponent':
			return _user$project$FromEnglish$Opponent;
		case 'option':
			return _user$project$FromEnglish$Option;
		case 'opulent':
			return _user$project$FromEnglish$Opulent;
		case 'orange':
			return _user$project$FromEnglish$Orange;
		case 'orchestral_jazz':
			return _user$project$FromEnglish$OrchestralJazz;
		case 'orchestral_uplifting':
			return _user$project$FromEnglish$OrchestralUplifting;
		case 'order_action':
			return _user$project$FromEnglish$OrderAction;
		case 'order_cancelled':
			return _user$project$FromEnglish$OrderCancelled;
		case 'order_date':
			return _user$project$FromEnglish$OrderDate;
		case 'order_delivered':
			return _user$project$FromEnglish$OrderDelivered;
		case 'order_delivery':
			return _user$project$FromEnglish$OrderDelivery;
		case 'order_in_transit':
			return _user$project$FromEnglish$OrderInTransit;
		case 'order_item_number':
			return _user$project$FromEnglish$OrderItemNumber;
		case 'order_item_status':
			return _user$project$FromEnglish$OrderItemStatus;
		case 'order_number':
			return _user$project$FromEnglish$OrderNumber;
		case 'order_payment_due':
			return _user$project$FromEnglish$OrderPaymentDue;
		case 'order_pickup_available':
			return _user$project$FromEnglish$OrderPickupAvailable;
		case 'order_problem':
			return _user$project$FromEnglish$OrderProblem;
		case 'order_processing':
			return _user$project$FromEnglish$OrderProcessing;
		case 'order_quantity':
			return _user$project$FromEnglish$OrderQuantity;
		case 'order_returned':
			return _user$project$FromEnglish$OrderReturned;
		case 'order_status':
			return _user$project$FromEnglish$OrderStatus;
		case 'ordered_item':
			return _user$project$FromEnglish$OrderedItem;
		case 'organdy':
			return _user$project$FromEnglish$Organdy;
		case 'organization':
			return _user$project$FromEnglish$Organization;
		case 'organization_role':
			return _user$project$FromEnglish$OrganizationRole;
		case 'organize_action':
			return _user$project$FromEnglish$OrganizeAction;
		case 'organza':
			return _user$project$FromEnglish$Organza;
		case 'oriented_strand_board':
			return _user$project$FromEnglish$OrientedStrandBoard;
		case 'origin_address':
			return _user$project$FromEnglish$OriginAddress;
		case 'osmium':
			return _user$project$FromEnglish$Osmium;
		case 'osnaburg':
			return _user$project$FromEnglish$Osnaburg;
		case 'ottoman':
			return _user$project$FromEnglish$Ottoman;
		case 'out_of_stock':
			return _user$project$FromEnglish$OutOfStock;
		case 'outlet_store':
			return _user$project$FromEnglish$OutletStore;
		case 'overflow':
			return _user$project$FromEnglish$Overflow;
		case 'owned_from':
			return _user$project$FromEnglish$OwnedFrom;
		case 'owned_through':
			return _user$project$FromEnglish$OwnedThrough;
		case 'ownership_info':
			return _user$project$FromEnglish$OwnershipInfo;
		case 'oxford':
			return _user$project$FromEnglish$Oxford;
		case 'oxidized':
			return _user$project$FromEnglish$Oxidized;
		case 'paddle':
			return _user$project$FromEnglish$Paddle;
		case 'paduasoy':
			return _user$project$FromEnglish$Paduasoy;
		case 'page_end':
			return _user$project$FromEnglish$PageEnd;
		case 'page_start':
			return _user$project$FromEnglish$PageStart;
		case 'pagination':
			return _user$project$FromEnglish$Pagination;
		case 'paint_action':
			return _user$project$FromEnglish$PaintAction;
		case 'painting':
			return _user$project$FromEnglish$Painting;
		case 'paisley':
			return _user$project$FromEnglish$Paisley;
		case 'paisley_underground':
			return _user$project$FromEnglish$PaisleyUnderground;
		case 'palladium':
			return _user$project$FromEnglish$Palladium;
		case 'paperback':
			return _user$project$FromEnglish$Paperback;
		case 'paprika':
			return _user$project$FromEnglish$Paprika;
		case 'parallel_strand_lumber':
			return _user$project$FromEnglish$ParallelStrandLumber;
		case 'parcel_delivery':
			return _user$project$FromEnglish$ParcelDelivery;
		case 'parcel_service':
			return _user$project$FromEnglish$ParcelService;
		case 'parent':
			return _user$project$FromEnglish$Parent;
		case 'parent_audience':
			return _user$project$FromEnglish$ParentAudience;
		case 'parent_item':
			return _user$project$FromEnglish$ParentItem;
		case 'parent_organization':
			return _user$project$FromEnglish$ParentOrganization;
		case 'parent_service':
			return _user$project$FromEnglish$ParentService;
		case 'parking_facility':
			return _user$project$FromEnglish$ParkingFacility;
		case 'parking_map':
			return _user$project$FromEnglish$ParkingMap;
		case 'parsley':
			return _user$project$FromEnglish$Parsley;
		case 'parsnip':
			return _user$project$FromEnglish$Parsnip;
		case 'part_of_episode':
			return _user$project$FromEnglish$PartOfEpisode;
		case 'part_of_invoice':
			return _user$project$FromEnglish$PartOfInvoice;
		case 'part_of_order':
			return _user$project$FromEnglish$PartOfOrder;
		case 'part_of_season':
			return _user$project$FromEnglish$PartOfSeason;
		case 'part_of_series':
			return _user$project$FromEnglish$PartOfSeries;
		case 'part_of_tvseries':
			return _user$project$FromEnglish$PartOfTvseries;
		case 'participant':
			return _user$project$FromEnglish$Participant;
		case 'party_size':
			return _user$project$FromEnglish$PartySize;
		case 'pashmina':
			return _user$project$FromEnglish$Pashmina;
		case 'pass':
			return _user$project$FromEnglish$Pass;
		case 'passenger_priority_status':
			return _user$project$FromEnglish$PassengerPriorityStatus;
		case 'passenger_sequence_number':
			return _user$project$FromEnglish$PassengerSequenceNumber;
		case 'patty_pan':
			return _user$project$FromEnglish$PattyPan;
		case 'pause':
			return _user$project$FromEnglish$Pause;
		case 'pawn_shop':
			return _user$project$FromEnglish$PawnShop;
		case 'pay_action':
			return _user$project$FromEnglish$PayAction;
		case 'payment_accepted':
			return _user$project$FromEnglish$PaymentAccepted;
		case 'payment_automatically_applied':
			return _user$project$FromEnglish$PaymentAutomaticallyApplied;
		case 'payment_card':
			return _user$project$FromEnglish$PaymentCard;
		case 'payment_charge_specification':
			return _user$project$FromEnglish$PaymentChargeSpecification;
		case 'payment_complete':
			return _user$project$FromEnglish$PaymentComplete;
		case 'payment_declined':
			return _user$project$FromEnglish$PaymentDeclined;
		case 'payment_due':
			return _user$project$FromEnglish$PaymentDue;
		case 'payment_due_date':
			return _user$project$FromEnglish$PaymentDueDate;
		case 'payment_method':
			return _user$project$FromEnglish$PaymentMethod;
		case 'payment_method_id':
			return _user$project$FromEnglish$PaymentMethodId;
		case 'payment_past_due':
			return _user$project$FromEnglish$PaymentPastDue;
		case 'payment_service':
			return _user$project$FromEnglish$PaymentService;
		case 'payment_status':
			return _user$project$FromEnglish$PaymentStatus;
		case 'payment_status_type':
			return _user$project$FromEnglish$PaymentStatusType;
		case 'payment_url':
			return _user$project$FromEnglish$PaymentUrl;
		case 'peach':
			return _user$project$FromEnglish$Peach;
		case 'pedal':
			return _user$project$FromEnglish$Pedal;
		case 'peep':
			return _user$project$FromEnglish$Peep;
		case 'people_audience':
			return _user$project$FromEnglish$PeopleAudience;
		case 'pepper_jelly':
			return _user$project$FromEnglish$PepperJelly;
		case 'percale':
			return _user$project$FromEnglish$Percale;
		case 'perform_action':
			return _user$project$FromEnglish$PerformAction;
		case 'performance_role':
			return _user$project$FromEnglish$PerformanceRole;
		case 'performer':
			return _user$project$FromEnglish$Performer;
		case 'performer_in':
			return _user$project$FromEnglish$PerformerIn;
		case 'performers':
			return _user$project$FromEnglish$Performers;
		case 'performing_arts_theater':
			return _user$project$FromEnglish$PerformingArtsTheater;
		case 'performing_group':
			return _user$project$FromEnglish$PerformingGroup;
		case 'perilla':
			return _user$project$FromEnglish$Perilla;
		case 'periodical':
			return _user$project$FromEnglish$Periodical;
		case 'permission_type':
			return _user$project$FromEnglish$PermissionType;
		case 'permit':
			return _user$project$FromEnglish$Permit;
		case 'permit_audience':
			return _user$project$FromEnglish$PermitAudience;
		case 'permitted_usage':
			return _user$project$FromEnglish$PermittedUsage;
		case 'persimmon':
			return _user$project$FromEnglish$Persimmon;
		case 'person':
			return _user$project$FromEnglish$Person;
		case 'peruvian_pepper':
			return _user$project$FromEnglish$PeruvianPepper;
		case 'pet_store':
			return _user$project$FromEnglish$PetStore;
		case 'pets_allowed':
			return _user$project$FromEnglish$PetsAllowed;
		case 'pharmacy':
			return _user$project$FromEnglish$Pharmacy;
		case 'photo':
			return _user$project$FromEnglish$Photo;
		case 'photograph':
			return _user$project$FromEnglish$Photograph;
		case 'photograph_action':
			return _user$project$FromEnglish$PhotographAction;
		case 'photos':
			return _user$project$FromEnglish$Photos;
		case 'physalis':
			return _user$project$FromEnglish$Physalis;
		case 'piccalilli':
			return _user$project$FromEnglish$Piccalilli;
		case 'pickled_cucumber':
			return _user$project$FromEnglish$PickledCucumber;
		case 'pickled_fruit':
			return _user$project$FromEnglish$PickledFruit;
		case 'pickled_onion':
			return _user$project$FromEnglish$PickledOnion;
		case 'pickled_pepper':
			return _user$project$FromEnglish$PickledPepper;
		case 'pickup_location':
			return _user$project$FromEnglish$PickupLocation;
		case 'pickup_time':
			return _user$project$FromEnglish$PickupTime;
		case 'pico_de_gallo':
			return _user$project$FromEnglish$PicoDeGallo;
		case 'pin_stripes':
			return _user$project$FromEnglish$PinStripes;
		case 'pine':
			return _user$project$FromEnglish$Pine;
		case 'pineapple':
			return _user$project$FromEnglish$Pineapple;
		case 'pinto_bean':
			return _user$project$FromEnglish$PintoBean;
		case 'place':
			return _user$project$FromEnglish$Place;
		case 'place_of_worship':
			return _user$project$FromEnglish$PlaceOfWorship;
		case 'plan':
			return _user$project$FromEnglish$Plan;
		case 'plan_action':
			return _user$project$FromEnglish$PlanAction;
		case 'plant':
			return _user$project$FromEnglish$Plant;
		case 'plastic':
			return _user$project$FromEnglish$Plastic;
		case 'plastic_laminate':
			return _user$project$FromEnglish$PlasticLaminate;
		case 'platinum':
			return _user$project$FromEnglish$Platinum;
		case 'play_action':
			return _user$project$FromEnglish$PlayAction;
		case 'play_mode':
			return _user$project$FromEnglish$PlayMode;
		case 'player_type':
			return _user$project$FromEnglish$PlayerType;
		case 'players_online':
			return _user$project$FromEnglish$PlayersOnline;
		case 'playground':
			return _user$project$FromEnglish$Playground;
		case 'plush':
			return _user$project$FromEnglish$Plush;
		case 'plutonium':
			return _user$project$FromEnglish$Plutonium;
		case 'plywood':
			return _user$project$FromEnglish$Plywood;
		case 'point':
			return _user$project$FromEnglish$Point;
		case 'polar_fleece':
			return _user$project$FromEnglish$PolarFleece;
		case 'police_station':
			return _user$project$FromEnglish$PoliceStation;
		case 'polish':
			return _user$project$FromEnglish$Polish;
		case 'polonium':
			return _user$project$FromEnglish$Polonium;
		case 'polyester':
			return _user$project$FromEnglish$Polyester;
		case 'polygon':
			return _user$project$FromEnglish$Polygon;
		case 'polystyrene':
			return _user$project$FromEnglish$Polystyrene;
		case 'polyurethane':
			return _user$project$FromEnglish$Polyurethane;
		case 'pomegranate':
			return _user$project$FromEnglish$Pomegranate;
		case 'pomegranate_seed':
			return _user$project$FromEnglish$PomegranateSeed;
		case 'pomelo':
			return _user$project$FromEnglish$Pomelo;
		case 'pond':
			return _user$project$FromEnglish$Pond;
		case 'pongee':
			return _user$project$FromEnglish$Pongee;
		case 'pop':
			return _user$project$FromEnglish$Pop;
		case 'pop_punk':
			return _user$project$FromEnglish$PopPunk;
		case 'pop_rock':
			return _user$project$FromEnglish$PopRock;
		case 'popcorn_seasoning':
			return _user$project$FromEnglish$PopcornSeasoning;
		case 'poplin':
			return _user$project$FromEnglish$Poplin;
		case 'poppy_seed':
			return _user$project$FromEnglish$PoppySeed;
		case 'position':
			return _user$project$FromEnglish$Position;
		case 'possess':
			return _user$project$FromEnglish$Possess;
		case 'post':
			return _user$project$FromEnglish$Post;
		case 'post_bop':
			return _user$project$FromEnglish$PostBop;
		case 'post_britpop':
			return _user$project$FromEnglish$PostBritpop;
		case 'post_disco':
			return _user$project$FromEnglish$PostDisco;
		case 'post_grunge':
			return _user$project$FromEnglish$PostGrunge;
		case 'post_hardcore':
			return _user$project$FromEnglish$PostHardcore;
		case 'post_metal':
			return _user$project$FromEnglish$PostMetal;
		case 'post_office':
			return _user$project$FromEnglish$PostOffice;
		case 'post_office_box_number':
			return _user$project$FromEnglish$PostOfficeBoxNumber;
		case 'post_punk':
			return _user$project$FromEnglish$PostPunk;
		case 'post_punk_revival':
			return _user$project$FromEnglish$PostPunkRevival;
		case 'post_rock':
			return _user$project$FromEnglish$PostRock;
		case 'postal_address':
			return _user$project$FromEnglish$PostalAddress;
		case 'postal_code':
			return _user$project$FromEnglish$PostalCode;
		case 'potassium':
			return _user$project$FromEnglish$Potassium;
		case 'potato':
			return _user$project$FromEnglish$Potato;
		case 'potential_action':
			return _user$project$FromEnglish$PotentialAction;
		case 'potential_action_status':
			return _user$project$FromEnglish$PotentialActionStatus;
		case 'powder_douce':
			return _user$project$FromEnglish$PowderDouce;
		case 'power_electronics':
			return _user$project$FromEnglish$PowerElectronics;
		case 'power_metal':
			return _user$project$FromEnglish$PowerMetal;
		case 'power_noise':
			return _user$project$FromEnglish$PowerNoise;
		case 'power_pop':
			return _user$project$FromEnglish$PowerPop;
		case 'powerful':
			return _user$project$FromEnglish$Powerful;
		case 'practise':
			return _user$project$FromEnglish$Practise;
		case 'praseodymium':
			return _user$project$FromEnglish$Praseodymium;
		case 'pray':
			return _user$project$FromEnglish$Pray;
		case 'pre_order':
			return _user$project$FromEnglish$PreOrder;
		case 'pre_sale':
			return _user$project$FromEnglish$PreSale;
		case 'preach':
			return _user$project$FromEnglish$Preach;
		case 'precede':
			return _user$project$FromEnglish$Precede;
		case 'predecessor_of':
			return _user$project$FromEnglish$PredecessorOf;
		case 'prefer':
			return _user$project$FromEnglish$Prefer;
		case 'prep_time':
			return _user$project$FromEnglish$PrepTime;
		case 'prepare':
			return _user$project$FromEnglish$Prepare;
		case 'prepend_action':
			return _user$project$FromEnglish$PrependAction;
		case 'preschool':
			return _user$project$FromEnglish$Preschool;
		case 'present':
			return _user$project$FromEnglish$Present;
		case 'presentation_digital_document':
			return _user$project$FromEnglish$PresentationDigitalDocument;
		case 'preserve':
			return _user$project$FromEnglish$Preserve;
		case 'pretend':
			return _user$project$FromEnglish$Pretend;
		case 'prevent':
			return _user$project$FromEnglish$Prevent;
		case 'previous_item':
			return _user$project$FromEnglish$PreviousItem;
		case 'previous_start_date':
			return _user$project$FromEnglish$PreviousStartDate;
		case 'price':
			return _user$project$FromEnglish$Price;
		case 'price_component':
			return _user$project$FromEnglish$PriceComponent;
		case 'price_currency':
			return _user$project$FromEnglish$PriceCurrency;
		case 'price_range':
			return _user$project$FromEnglish$PriceRange;
		case 'price_specification':
			return _user$project$FromEnglish$PriceSpecification;
		case 'price_type':
			return _user$project$FromEnglish$PriceType;
		case 'price_valid_until':
			return _user$project$FromEnglish$PriceValidUntil;
		case 'prick':
			return _user$project$FromEnglish$Prick;
		case 'primary_image_of_page':
			return _user$project$FromEnglish$PrimaryImageOfPage;
		case 'print':
			return _user$project$FromEnglish$Print;
		case 'print_column':
			return _user$project$FromEnglish$PrintColumn;
		case 'print_edition':
			return _user$project$FromEnglish$PrintEdition;
		case 'print_page':
			return _user$project$FromEnglish$PrintPage;
		case 'print_section':
			return _user$project$FromEnglish$PrintSection;
		case 'processing_time':
			return _user$project$FromEnglish$ProcessingTime;
		case 'processor_requirements':
			return _user$project$FromEnglish$ProcessorRequirements;
		case 'produce':
			return _user$project$FromEnglish$Produce;
		case 'produces':
			return _user$project$FromEnglish$Produces;
		case 'product':
			return _user$project$FromEnglish$Product;
		case 'product_id':
			return _user$project$FromEnglish$ProductId;
		case 'product_model':
			return _user$project$FromEnglish$ProductModel;
		case 'product_supported':
			return _user$project$FromEnglish$ProductSupported;
		case 'production_company':
			return _user$project$FromEnglish$ProductionCompany;
		case 'production_date':
			return _user$project$FromEnglish$ProductionDate;
		case 'professional_service':
			return _user$project$FromEnglish$ProfessionalService;
		case 'proficiency_level':
			return _user$project$FromEnglish$ProficiencyLevel;
		case 'profile_page':
			return _user$project$FromEnglish$ProfilePage;
		case 'program_membership':
			return _user$project$FromEnglish$ProgramMembership;
		case 'program_membership_used':
			return _user$project$FromEnglish$ProgramMembershipUsed;
		case 'program_name':
			return _user$project$FromEnglish$ProgramName;
		case 'programming_language':
			return _user$project$FromEnglish$ProgrammingLanguage;
		case 'programming_model':
			return _user$project$FromEnglish$ProgrammingModel;
		case 'progressive':
			return _user$project$FromEnglish$Progressive;
		case 'progressive_breaks':
			return _user$project$FromEnglish$ProgressiveBreaks;
		case 'progressive_drum_bass':
			return _user$project$FromEnglish$ProgressiveDrumBass;
		case 'progressive_folk':
			return _user$project$FromEnglish$ProgressiveFolk;
		case 'progressive_house':
			return _user$project$FromEnglish$ProgressiveHouse;
		case 'progressive_metal':
			return _user$project$FromEnglish$ProgressiveMetal;
		case 'progressive_rock':
			return _user$project$FromEnglish$ProgressiveRock;
		case 'progressive_techno':
			return _user$project$FromEnglish$ProgressiveTechno;
		case 'promethium':
			return _user$project$FromEnglish$Promethium;
		case 'promise':
			return _user$project$FromEnglish$Promise;
		case 'property_id':
			return _user$project$FromEnglish$PropertyId;
		case 'property_value':
			return _user$project$FromEnglish$PropertyValue;
		case 'property_value_specification':
			return _user$project$FromEnglish$PropertyValueSpecification;
		case 'protactinium':
			return _user$project$FromEnglish$Protactinium;
		case 'protect':
			return _user$project$FromEnglish$Protect;
		case 'protein_content':
			return _user$project$FromEnglish$ProteinContent;
		case 'provide':
			return _user$project$FromEnglish$Provide;
		case 'provider':
			return _user$project$FromEnglish$Provider;
		case 'provider_mobility':
			return _user$project$FromEnglish$ProviderMobility;
		case 'provides_broadcast_service':
			return _user$project$FromEnglish$ProvidesBroadcastService;
		case 'provides_service':
			return _user$project$FromEnglish$ProvidesService;
		case 'psychedelic_folk':
			return _user$project$FromEnglish$PsychedelicFolk;
		case 'psychedelic_rock':
			return _user$project$FromEnglish$PsychedelicRock;
		case 'psychedelic_trance':
			return _user$project$FromEnglish$PsychedelicTrance;
		case 'public_holidays':
			return _user$project$FromEnglish$PublicHolidays;
		case 'public_swimming_pool':
			return _user$project$FromEnglish$PublicSwimmingPool;
		case 'publication':
			return _user$project$FromEnglish$Publication;
		case 'publication_event':
			return _user$project$FromEnglish$PublicationEvent;
		case 'publication_issue':
			return _user$project$FromEnglish$PublicationIssue;
		case 'publication_volume':
			return _user$project$FromEnglish$PublicationVolume;
		case 'published_on':
			return _user$project$FromEnglish$PublishedOn;
		case 'publisher':
			return _user$project$FromEnglish$Publisher;
		case 'publishing_principles':
			return _user$project$FromEnglish$PublishingPrinciples;
		case 'pull':
			return _user$project$FromEnglish$Pull;
		case 'pump':
			return _user$project$FromEnglish$Pump;
		case 'pumpkin':
			return _user$project$FromEnglish$Pumpkin;
		case 'pumpkin_pie_spice':
			return _user$project$FromEnglish$PumpkinPieSpice;
		case 'puncture':
			return _user$project$FromEnglish$Puncture;
		case 'punish':
			return _user$project$FromEnglish$Punish;
		case 'punk_jazz':
			return _user$project$FromEnglish$PunkJazz;
		case 'punk_rock':
			return _user$project$FromEnglish$PunkRock;
		case 'purchase_date':
			return _user$project$FromEnglish$PurchaseDate;
		case 'purple_mangosteen':
			return _user$project$FromEnglish$PurpleMangosteen;
		case 'push':
			return _user$project$FromEnglish$Push;
		case 'qualifications':
			return _user$project$FromEnglish$Qualifications;
		case 'qualitative_value':
			return _user$project$FromEnglish$QualitativeValue;
		case 'quantitative_value':
			return _user$project$FromEnglish$QuantitativeValue;
		case 'quantity':
			return _user$project$FromEnglish$Quantity;
		case 'query':
			return _user$project$FromEnglish$Query;
		case 'quest':
			return _user$project$FromEnglish$Quest;
		case 'question':
			return _user$project$FromEnglish$Question;
		case 'quince':
			return _user$project$FromEnglish$Quince;
		case 'quote_action':
			return _user$project$FromEnglish$QuoteAction;
		case 'r_news':
			return _user$project$FromEnglish$RNews;
		case 'race':
			return _user$project$FromEnglish$Race;
		case 'radiate':
			return _user$project$FromEnglish$Radiate;
		case 'radicchio':
			return _user$project$FromEnglish$Radicchio;
		case 'radio_channel':
			return _user$project$FromEnglish$RadioChannel;
		case 'radio_clip':
			return _user$project$FromEnglish$RadioClip;
		case 'radio_episode':
			return _user$project$FromEnglish$RadioEpisode;
		case 'radio_season':
			return _user$project$FromEnglish$RadioSeason;
		case 'radio_series':
			return _user$project$FromEnglish$RadioSeries;
		case 'radio_station':
			return _user$project$FromEnglish$RadioStation;
		case 'radish':
			return _user$project$FromEnglish$Radish;
		case 'radium':
			return _user$project$FromEnglish$Radium;
		case 'raga_rock':
			return _user$project$FromEnglish$RagaRock;
		case 'ragga_jungle':
			return _user$project$FromEnglish$RaggaJungle;
		case 'ragtime':
			return _user$project$FromEnglish$Ragtime;
		case 'raisiny':
			return _user$project$FromEnglish$Raisiny;
		case 'rambutan':
			return _user$project$FromEnglish$Rambutan;
		case 'rammed_earth':
			return _user$project$FromEnglish$RammedEarth;
		case 'rap_metal':
			return _user$project$FromEnglish$RapMetal;
		case 'rap_rock':
			return _user$project$FromEnglish$RapRock;
		case 'raspberry':
			return _user$project$FromEnglish$Raspberry;
		case 'rating_count':
			return _user$project$FromEnglish$RatingCount;
		case 'rating_value':
			return _user$project$FromEnglish$RatingValue;
		case 'reach':
			return _user$project$FromEnglish$Reach;
		case 'react_action':
			return _user$project$FromEnglish$ReactAction;
		case 'read_action':
			return _user$project$FromEnglish$ReadAction;
		case 'read_permission':
			return _user$project$FromEnglish$ReadPermission;
		case 'readonly_value':
			return _user$project$FromEnglish$ReadonlyValue;
		case 'real_estate_agent':
			return _user$project$FromEnglish$RealEstateAgent;
		case 'realise':
			return _user$project$FromEnglish$Realise;
		case 'rear_wheel_drive_configuration':
			return _user$project$FromEnglish$RearWheelDriveConfiguration;
		case 'receive':
			return _user$project$FromEnglish$Receive;
		case 'receive_action':
			return _user$project$FromEnglish$ReceiveAction;
		case 'recipe':
			return _user$project$FromEnglish$Recipe;
		case 'recipe_category':
			return _user$project$FromEnglish$RecipeCategory;
		case 'recipe_cuisine':
			return _user$project$FromEnglish$RecipeCuisine;
		case 'recipe_ingredient':
			return _user$project$FromEnglish$RecipeIngredient;
		case 'recipe_instructions':
			return _user$project$FromEnglish$RecipeInstructions;
		case 'recipe_yield':
			return _user$project$FromEnglish$RecipeYield;
		case 'recipient':
			return _user$project$FromEnglish$Recipient;
		case 'recognise':
			return _user$project$FromEnglish$Recognise;
		case 'record':
			return _user$project$FromEnglish$Record;
		case 'record_label':
			return _user$project$FromEnglish$RecordLabel;
		case 'recorded_as':
			return _user$project$FromEnglish$RecordedAs;
		case 'recorded_at':
			return _user$project$FromEnglish$RecordedAt;
		case 'recorded_in':
			return _user$project$FromEnglish$RecordedIn;
		case 'recording_of':
			return _user$project$FromEnglish$RecordingOf;
		case 'recycling_center':
			return _user$project$FromEnglish$RecyclingCenter;
		case 'redcurrant':
			return _user$project$FromEnglish$Redcurrant;
		case 'reduce':
			return _user$project$FromEnglish$Reduce;
		case 'reference_quantity':
			return _user$project$FromEnglish$ReferenceQuantity;
		case 'references_order':
			return _user$project$FromEnglish$ReferencesOrder;
		case 'refined':
			return _user$project$FromEnglish$Refined;
		case 'reflect':
			return _user$project$FromEnglish$Reflect;
		case 'refurbished_condition':
			return _user$project$FromEnglish$RefurbishedCondition;
		case 'refuse':
			return _user$project$FromEnglish$Refuse;
		case 'regions_allowed':
			return _user$project$FromEnglish$RegionsAllowed;
		case 'register_action':
			return _user$project$FromEnglish$RegisterAction;
		case 'regret':
			return _user$project$FromEnglish$Regret;
		case 'reign':
			return _user$project$FromEnglish$Reign;
		case 'reject':
			return _user$project$FromEnglish$Reject;
		case 'reject_action':
			return _user$project$FromEnglish$RejectAction;
		case 'rejoice':
			return _user$project$FromEnglish$Rejoice;
		case 'related_link':
			return _user$project$FromEnglish$RelatedLink;
		case 'related_to':
			return _user$project$FromEnglish$RelatedTo;
		case 'relax':
			return _user$project$FromEnglish$Relax;
		case 'release':
			return _user$project$FromEnglish$Release;
		case 'release_date':
			return _user$project$FromEnglish$ReleaseDate;
		case 'release_notes':
			return _user$project$FromEnglish$ReleaseNotes;
		case 'release_of':
			return _user$project$FromEnglish$ReleaseOf;
		case 'released_event':
			return _user$project$FromEnglish$ReleasedEvent;
		case 'relish':
			return _user$project$FromEnglish$Relish;
		case 'remain':
			return _user$project$FromEnglish$Remain;
		case 'remaining_attendee_capacity':
			return _user$project$FromEnglish$RemainingAttendeeCapacity;
		case 'remember':
			return _user$project$FromEnglish$Remember;
		case 'remind':
			return _user$project$FromEnglish$Remind;
		case 'remix_album':
			return _user$project$FromEnglish$RemixAlbum;
		case 'remoulade':
			return _user$project$FromEnglish$Remoulade;
		case 'remove':
			return _user$project$FromEnglish$Remove;
		case 'rent_action':
			return _user$project$FromEnglish$RentAction;
		case 'rental_car_reservation':
			return _user$project$FromEnglish$RentalCarReservation;
		case 'replace':
			return _user$project$FromEnglish$Replace;
		case 'replace_action':
			return _user$project$FromEnglish$ReplaceAction;
		case 'replacer':
			return _user$project$FromEnglish$Replacer;
		case 'reply':
			return _user$project$FromEnglish$Reply;
		case 'reply_action':
			return _user$project$FromEnglish$ReplyAction;
		case 'reply_to_url':
			return _user$project$FromEnglish$ReplyToUrl;
		case 'report':
			return _user$project$FromEnglish$Report;
		case 'report_number':
			return _user$project$FromEnglish$ReportNumber;
		case 'representative_of_page':
			return _user$project$FromEnglish$RepresentativeOfPage;
		case 'reproduce':
			return _user$project$FromEnglish$Reproduce;
		case 'request':
			return _user$project$FromEnglish$Request;
		case 'required_collateral':
			return _user$project$FromEnglish$RequiredCollateral;
		case 'required_gender':
			return _user$project$FromEnglish$RequiredGender;
		case 'required_max_age':
			return _user$project$FromEnglish$RequiredMaxAge;
		case 'required_min_age':
			return _user$project$FromEnglish$RequiredMinAge;
		case 'requirements':
			return _user$project$FromEnglish$Requirements;
		case 'requires_subscription':
			return _user$project$FromEnglish$RequiresSubscription;
		case 'rescue':
			return _user$project$FromEnglish$Rescue;
		case 'researcher':
			return _user$project$FromEnglish$Researcher;
		case 'reservation':
			return _user$project$FromEnglish$Reservation;
		case 'reservation_cancelled':
			return _user$project$FromEnglish$ReservationCancelled;
		case 'reservation_confirmed':
			return _user$project$FromEnglish$ReservationConfirmed;
		case 'reservation_for':
			return _user$project$FromEnglish$ReservationFor;
		case 'reservation_hold':
			return _user$project$FromEnglish$ReservationHold;
		case 'reservation_id':
			return _user$project$FromEnglish$ReservationId;
		case 'reservation_package':
			return _user$project$FromEnglish$ReservationPackage;
		case 'reservation_pending':
			return _user$project$FromEnglish$ReservationPending;
		case 'reservation_status':
			return _user$project$FromEnglish$ReservationStatus;
		case 'reservation_status_type':
			return _user$project$FromEnglish$ReservationStatusType;
		case 'reserve_action':
			return _user$project$FromEnglish$ReserveAction;
		case 'reserved_ticket':
			return _user$project$FromEnglish$ReservedTicket;
		case 'reservoir':
			return _user$project$FromEnglish$Reservoir;
		case 'residence':
			return _user$project$FromEnglish$Residence;
		case 'resort':
			return _user$project$FromEnglish$Resort;
		case 'responsibilities':
			return _user$project$FromEnglish$Responsibilities;
		case 'restaurant':
			return _user$project$FromEnglish$Restaurant;
		case 'restricted_diet':
			return _user$project$FromEnglish$RestrictedDiet;
		case 'result':
			return _user$project$FromEnglish$Result;
		case 'result_comment':
			return _user$project$FromEnglish$ResultComment;
		case 'result_review':
			return _user$project$FromEnglish$ResultReview;
		case 'resume_action':
			return _user$project$FromEnglish$ResumeAction;
		case 'reticent':
			return _user$project$FromEnglish$Reticent;
		case 'retire':
			return _user$project$FromEnglish$Retire;
		case 'return':
			return _user$project$FromEnglish$Return;
		case 'return_action':
			return _user$project$FromEnglish$ReturnAction;
		case 'review':
			return _user$project$FromEnglish$Review;
		case 'review_action':
			return _user$project$FromEnglish$ReviewAction;
		case 'review_body':
			return _user$project$FromEnglish$ReviewBody;
		case 'review_count':
			return _user$project$FromEnglish$ReviewCount;
		case 'review_rating':
			return _user$project$FromEnglish$ReviewRating;
		case 'reviewed_by':
			return _user$project$FromEnglish$ReviewedBy;
		case 'reviews':
			return _user$project$FromEnglish$Reviews;
		case 'rhenium':
			return _user$project$FromEnglish$Rhenium;
		case 'rhodium':
			return _user$project$FromEnglish$Rhodium;
		case 'rhubarb':
			return _user$project$FromEnglish$Rhubarb;
		case 'rhyme':
			return _user$project$FromEnglish$Rhyme;
		case 'rich':
			return _user$project$FromEnglish$Rich;
		case 'right_hand_driving':
			return _user$project$FromEnglish$RightHandDriving;
		case 'rinse':
			return _user$project$FromEnglish$Rinse;
		case 'riot_grrrl':
			return _user$project$FromEnglish$RiotGrrrl;
		case 'ripstop':
			return _user$project$FromEnglish$Ripstop;
		case 'risk':
			return _user$project$FromEnglish$Risk;
		case 'river_body_of_water':
			return _user$project$FromEnglish$RiverBodyOfWater;
		case 'rock_and_roll':
			return _user$project$FromEnglish$RockAndRoll;
		case 'rock_in_opposition':
			return _user$project$FromEnglish$RockInOpposition;
		case 'rock_melon':
			return _user$project$FromEnglish$RockMelon;
		case 'roentgenium':
			return _user$project$FromEnglish$Roentgenium;
		case 'role_name':
			return _user$project$FromEnglish$RoleName;
		case 'roofing_contractor':
			return _user$project$FromEnglish$RoofingContractor;
		case 'rose':
			return _user$project$FromEnglish$Rose;
		case 'rosemary':
			return _user$project$FromEnglish$Rosemary;
		case 'rot':
			return _user$project$FromEnglish$Rot;
		case 'rough':
			return _user$project$FromEnglish$Rough;
		case 'round':
			return _user$project$FromEnglish$Round;
		case 'rsvp_action':
			return _user$project$FromEnglish$RsvpAction;
		case 'rsvp_response':
			return _user$project$FromEnglish$RsvpResponse;
		case 'rsvp_response_maybe':
			return _user$project$FromEnglish$RsvpResponseMaybe;
		case 'rsvp_response_no':
			return _user$project$FromEnglish$RsvpResponseNo;
		case 'rsvp_response_type':
			return _user$project$FromEnglish$RsvpResponseType;
		case 'rsvp_response_yes':
			return _user$project$FromEnglish$RsvpResponseYes;
		case 'rubidium':
			return _user$project$FromEnglish$Rubidium;
		case 'ruin':
			return _user$project$FromEnglish$Ruin;
		case 'rule':
			return _user$project$FromEnglish$Rule;
		case 'runner_bean':
			return _user$project$FromEnglish$RunnerBean;
		case 'runtime':
			return _user$project$FromEnglish$Runtime;
		case 'runtime_platform':
			return _user$project$FromEnglish$RuntimePlatform;
		case 'rush':
			return _user$project$FromEnglish$Rush;
		case 'russell_cord':
			return _user$project$FromEnglish$RussellCord;
		case 'rutabaga':
			return _user$project$FromEnglish$Rutabaga;
		case 'ruthenium':
			return _user$project$FromEnglish$Ruthenium;
		case 'rutherfordium':
			return _user$project$FromEnglish$Rutherfordium;
		case 'saffron':
			return _user$project$FromEnglish$Saffron;
		case 'sage':
			return _user$project$FromEnglish$Sage;
		case 'salad_cream':
			return _user$project$FromEnglish$SaladCream;
		case 'salad_dressing':
			return _user$project$FromEnglish$SaladDressing;
		case 'salal_berry':
			return _user$project$FromEnglish$SalalBerry;
		case 'salary_currency':
			return _user$project$FromEnglish$SalaryCurrency;
		case 'salsa':
			return _user$project$FromEnglish$Salsa;
		case 'salsa_golf':
			return _user$project$FromEnglish$SalsaGolf;
		case 'salt':
			return _user$project$FromEnglish$Salt;
		case 'salt_and_pepper':
			return _user$project$FromEnglish$SaltAndPepper;
		case 'samarium':
			return _user$project$FromEnglish$Samarium;
		case 'sambal':
			return _user$project$FromEnglish$Sambal;
		case 'same_as':
			return _user$project$FromEnglish$SameAs;
		case 'samite':
			return _user$project$FromEnglish$Samite;
		case 'sample_type':
			return _user$project$FromEnglish$SampleType;
		case 'sarsaparilla':
			return _user$project$FromEnglish$Sarsaparilla;
		case 'sassafras':
			return _user$project$FromEnglish$Sassafras;
		case 'sateen':
			return _user$project$FromEnglish$Sateen;
		case 'satisfy':
			return _user$project$FromEnglish$Satisfy;
		case 'satsuma':
			return _user$project$FromEnglish$Satsuma;
		case 'saturated_fat_content':
			return _user$project$FromEnglish$SaturatedFatContent;
		case 'saturday':
			return _user$project$FromEnglish$Saturday;
		case 'sauerkraut':
			return _user$project$FromEnglish$Sauerkraut;
		case 'save':
			return _user$project$FromEnglish$Save;
		case 'savory':
			return _user$project$FromEnglish$Savory;
		case 'scallion':
			return _user$project$FromEnglish$Scallion;
		case 'scandium':
			return _user$project$FromEnglish$Scandium;
		case 'scarlet':
			return _user$project$FromEnglish$Scarlet;
		case 'scatter':
			return _user$project$FromEnglish$Scatter;
		case 'schedule_action':
			return _user$project$FromEnglish$ScheduleAction;
		case 'scheduled_payment_date':
			return _user$project$FromEnglish$ScheduledPaymentDate;
		case 'scheduled_time':
			return _user$project$FromEnglish$ScheduledTime;
		case 'schema_version':
			return _user$project$FromEnglish$SchemaVersion;
		case 'scholarly_article':
			return _user$project$FromEnglish$ScholarlyArticle;
		case 'scold':
			return _user$project$FromEnglish$Scold;
		case 'scorch':
			return _user$project$FromEnglish$Scorch;
		case 'scrape':
			return _user$project$FromEnglish$Scrape;
		case 'scratch':
			return _user$project$FromEnglish$Scratch;
		case 'screen_count':
			return _user$project$FromEnglish$ScreenCount;
		case 'screening_event':
			return _user$project$FromEnglish$ScreeningEvent;
		case 'screenshot':
			return _user$project$FromEnglish$Screenshot;
		case 'screw':
			return _user$project$FromEnglish$Screw;
		case 'scribble':
			return _user$project$FromEnglish$Scribble;
		case 'scrim':
			return _user$project$FromEnglish$Scrim;
		case 'scrub':
			return _user$project$FromEnglish$Scrub;
		case 'sculpture':
			return _user$project$FromEnglish$Sculpture;
		case 'sea_body_of_water':
			return _user$project$FromEnglish$SeaBodyOfWater;
		case 'sea_silk':
			return _user$project$FromEnglish$SeaSilk;
		case 'seaborgium':
			return _user$project$FromEnglish$Seaborgium;
		case 'search':
			return _user$project$FromEnglish$Search;
		case 'search_action':
			return _user$project$FromEnglish$SearchAction;
		case 'search_results_page':
			return _user$project$FromEnglish$SearchResultsPage;
		case 'season':
			return _user$project$FromEnglish$Season;
		case 'season_number':
			return _user$project$FromEnglish$SeasonNumber;
		case 'seasons':
			return _user$project$FromEnglish$Seasons;
		case 'seat_number':
			return _user$project$FromEnglish$SeatNumber;
		case 'seat_row':
			return _user$project$FromEnglish$SeatRow;
		case 'seat_section':
			return _user$project$FromEnglish$SeatSection;
		case 'seating_map':
			return _user$project$FromEnglish$SeatingMap;
		case 'seating_type':
			return _user$project$FromEnglish$SeatingType;
		case 'security_screening':
			return _user$project$FromEnglish$SecurityScreening;
		case 'seersucker':
			return _user$project$FromEnglish$Seersucker;
		case 'self_storage':
			return _user$project$FromEnglish$SelfStorage;
		case 'sell_action':
			return _user$project$FromEnglish$SellAction;
		case 'send_action':
			return _user$project$FromEnglish$SendAction;
		case 'serge':
			return _user$project$FromEnglish$Serge;
		case 'serial_number':
			return _user$project$FromEnglish$SerialNumber;
		case 'series':
			return _user$project$FromEnglish$Series;
		case 'serve':
			return _user$project$FromEnglish$Serve;
		case 'server_status':
			return _user$project$FromEnglish$ServerStatus;
		case 'serves_cuisine':
			return _user$project$FromEnglish$ServesCuisine;
		case 'service':
			return _user$project$FromEnglish$Service;
		case 'service_area':
			return _user$project$FromEnglish$ServiceArea;
		case 'service_audience':
			return _user$project$FromEnglish$ServiceAudience;
		case 'service_channel':
			return _user$project$FromEnglish$ServiceChannel;
		case 'service_location':
			return _user$project$FromEnglish$ServiceLocation;
		case 'service_operator':
			return _user$project$FromEnglish$ServiceOperator;
		case 'service_output':
			return _user$project$FromEnglish$ServiceOutput;
		case 'service_phone':
			return _user$project$FromEnglish$ServicePhone;
		case 'service_postal_address':
			return _user$project$FromEnglish$ServicePostalAddress;
		case 'service_sms_number':
			return _user$project$FromEnglish$ServiceSmsNumber;
		case 'service_type':
			return _user$project$FromEnglish$ServiceType;
		case 'service_url':
			return _user$project$FromEnglish$ServiceUrl;
		case 'serving_size':
			return _user$project$FromEnglish$ServingSize;
		case 'sesame':
			return _user$project$FromEnglish$Sesame;
		case 'sesame_oil':
			return _user$project$FromEnglish$SesameOil;
		case 'shade':
			return _user$project$FromEnglish$Shade;
		case 'share_action':
			return _user$project$FromEnglish$ShareAction;
		case 'shared_content':
			return _user$project$FromEnglish$SharedContent;
		case 'sharena_sol':
			return _user$project$FromEnglish$SharenaSol;
		case 'shave':
			return _user$project$FromEnglish$Shave;
		case 'shelter':
			return _user$project$FromEnglish$Shelter;
		case 'shiplap':
			return _user$project$FromEnglish$Shiplap;
		case 'shiso':
			return _user$project$FromEnglish$Shiso;
		case 'shiver':
			return _user$project$FromEnglish$Shiver;
		case 'shock':
			return _user$project$FromEnglish$Shock;
		case 'shoe_store':
			return _user$project$FromEnglish$ShoeStore;
		case 'shoegaze':
			return _user$project$FromEnglish$Shoegaze;
		case 'shop':
			return _user$project$FromEnglish$Shop;
		case 'shopping_center':
			return _user$project$FromEnglish$ShoppingCenter;
		case 'shot_silk':
			return _user$project$FromEnglish$ShotSilk;
		case 'shrug':
			return _user$project$FromEnglish$Shrug;
		case 'sibling':
			return _user$project$FromEnglish$Sibling;
		case 'siblings':
			return _user$project$FromEnglish$Siblings;
		case 'sichuan_pepper':
			return _user$project$FromEnglish$SichuanPepper;
		case 'signal':
			return _user$project$FromEnglish$Signal;
		case 'significant_link':
			return _user$project$FromEnglish$SignificantLink;
		case 'significant_links':
			return _user$project$FromEnglish$SignificantLinks;
		case 'silk':
			return _user$project$FromEnglish$Silk;
		case 'silky':
			return _user$project$FromEnglish$Silky;
		case 'silver':
			return _user$project$FromEnglish$Silver;
		case 'single_family_residence':
			return _user$project$FromEnglish$SingleFamilyResidence;
		case 'single_player':
			return _user$project$FromEnglish$SinglePlayer;
		case 'single_release':
			return _user$project$FromEnglish$SingleRelease;
		case 'sisal':
			return _user$project$FromEnglish$Sisal;
		case 'site_navigation_element':
			return _user$project$FromEnglish$SiteNavigationElement;
		case 'ska_jazz':
			return _user$project$FromEnglish$SkaJazz;
		case 'ska_punk':
			return _user$project$FromEnglish$SkaPunk;
		case 'skate_punk':
			return _user$project$FromEnglish$SkatePunk;
		case 'ski':
			return _user$project$FromEnglish$Ski;
		case 'ski_resort':
			return _user$project$FromEnglish$SkiResort;
		case 'skills':
			return _user$project$FromEnglish$Skills;
		case 'skip':
			return _user$project$FromEnglish$Skip;
		case 'skirret':
			return _user$project$FromEnglish$Skirret;
		case 'sku':
			return _user$project$FromEnglish$Sku;
		case 'slip':
			return _user$project$FromEnglish$Slip;
		case 'sludge_metal':
			return _user$project$FromEnglish$SludgeMetal;
		case 'smile':
			return _user$project$FromEnglish$Smile;
		case 'smokey':
			return _user$project$FromEnglish$Smokey;
		case 'smoking_allowed':
			return _user$project$FromEnglish$SmokingAllowed;
		case 'smooth':
			return _user$project$FromEnglish$Smooth;
		case 'smooth_jazz':
			return _user$project$FromEnglish$SmoothJazz;
		case 'snap_pea':
			return _user$project$FromEnglish$SnapPea;
		case 'snatch':
			return _user$project$FromEnglish$Snatch;
		case 'sneeze':
			return _user$project$FromEnglish$Sneeze;
		case 'sniff':
			return _user$project$FromEnglish$Sniff;
		case 'social_event':
			return _user$project$FromEnglish$SocialEvent;
		case 'social_media_posting':
			return _user$project$FromEnglish$SocialMediaPosting;
		case 'sodium':
			return _user$project$FromEnglish$Sodium;
		case 'sodium_content':
			return _user$project$FromEnglish$SodiumContent;
		case 'soft_rock':
			return _user$project$FromEnglish$SoftRock;
		case 'software_add_on':
			return _user$project$FromEnglish$SoftwareAddOn;
		case 'software_application':
			return _user$project$FromEnglish$SoftwareApplication;
		case 'software_help':
			return _user$project$FromEnglish$SoftwareHelp;
		case 'software_requirements':
			return _user$project$FromEnglish$SoftwareRequirements;
		case 'software_source_code':
			return _user$project$FromEnglish$SoftwareSourceCode;
		case 'software_version':
			return _user$project$FromEnglish$SoftwareVersion;
		case 'sold_out':
			return _user$project$FromEnglish$SoldOut;
		case 'some_products':
			return _user$project$FromEnglish$SomeProducts;
		case 'sorrel':
			return _user$project$FromEnglish$Sorrel;
		case 'soul_jazz':
			return _user$project$FromEnglish$SoulJazz;
		case 'sound':
			return _user$project$FromEnglish$Sound;
		case 'sound_art':
			return _user$project$FromEnglish$SoundArt;
		case 'soundtrack_album':
			return _user$project$FromEnglish$SoundtrackAlbum;
		case 'source_organization':
			return _user$project$FromEnglish$SourceOrganization;
		case 'southern_rock':
			return _user$project$FromEnglish$SouthernRock;
		case 'soy_bean':
			return _user$project$FromEnglish$SoyBean;
		case 'soy_sauce':
			return _user$project$FromEnglish$SoySauce;
		case 'space_disco':
			return _user$project$FromEnglish$SpaceDisco;
		case 'space_house':
			return _user$project$FromEnglish$SpaceHouse;
		case 'space_rock':
			return _user$project$FromEnglish$SpaceRock;
		case 'spaghetti_squash':
			return _user$project$FromEnglish$SpaghettiSquash;
		case 'spandex':
			return _user$project$FromEnglish$Spandex;
		case 'spare':
			return _user$project$FromEnglish$Spare;
		case 'spark':
			return _user$project$FromEnglish$Spark;
		case 'spatial':
			return _user$project$FromEnglish$Spatial;
		case 'spatial_coverage':
			return _user$project$FromEnglish$SpatialCoverage;
		case 'special_commitments':
			return _user$project$FromEnglish$SpecialCommitments;
		case 'special_opening_hours_specification':
			return _user$project$FromEnglish$SpecialOpeningHoursSpecification;
		case 'specialty':
			return _user$project$FromEnglish$Specialty;
		case 'speed_garage':
			return _user$project$FromEnglish$SpeedGarage;
		case 'speed_metal':
			return _user$project$FromEnglish$SpeedMetal;
		case 'spider_silk':
			return _user$project$FromEnglish$SpiderSilk;
		case 'spinach':
			return _user$project$FromEnglish$Spinach;
		case 'spoil':
			return _user$project$FromEnglish$Spoil;
		case 'spoken_word_album':
			return _user$project$FromEnglish$SpokenWordAlbum;
		case 'sponsor':
			return _user$project$FromEnglish$Sponsor;
		case 'sporting_goods_store':
			return _user$project$FromEnglish$SportingGoodsStore;
		case 'sports_activity_location':
			return _user$project$FromEnglish$SportsActivityLocation;
		case 'sports_club':
			return _user$project$FromEnglish$SportsClub;
		case 'sports_event':
			return _user$project$FromEnglish$SportsEvent;
		case 'sports_organization':
			return _user$project$FromEnglish$SportsOrganization;
		case 'sports_team':
			return _user$project$FromEnglish$SportsTeam;
		case 'spot':
			return _user$project$FromEnglish$Spot;
		case 'spouse':
			return _user$project$FromEnglish$Spouse;
		case 'spray':
			return _user$project$FromEnglish$Spray;
		case 'spreadsheet_digital_document':
			return _user$project$FromEnglish$SpreadsheetDigitalDocument;
		case 'sprout':
			return _user$project$FromEnglish$Sprout;
		case 'squeak':
			return _user$project$FromEnglish$Squeak;
		case 'squeal':
			return _user$project$FromEnglish$Squeal;
		case 'squeeze':
			return _user$project$FromEnglish$Squeeze;
		case 'sriracha':
			return _user$project$FromEnglish$Sriracha;
		case 'stack_exchange':
			return _user$project$FromEnglish$StackExchange;
		case 'stadium_or_arena':
			return _user$project$FromEnglish$StadiumOrArena;
		case 'stamp':
			return _user$project$FromEnglish$Stamp;
		case 'star_anise':
			return _user$project$FromEnglish$StarAnise;
		case 'star_fruit':
			return _user$project$FromEnglish$StarFruit;
		case 'star_rating':
			return _user$project$FromEnglish$StarRating;
		case 'start_date':
			return _user$project$FromEnglish$StartDate;
		case 'start_time':
			return _user$project$FromEnglish$StartTime;
		case 'state':
			return _user$project$FromEnglish$State;
		case 'steak_sauce':
			return _user$project$FromEnglish$SteakSauce;
		case 'steering_position':
			return _user$project$FromEnglish$SteeringPosition;
		case 'steering_position_value':
			return _user$project$FromEnglish$SteeringPositionValue;
		case 'step_value':
			return _user$project$FromEnglish$StepValue;
		case 'sti_accommodation_ontology':
			return _user$project$FromEnglish$StiAccommodationOntology;
		case 'stitch':
			return _user$project$FromEnglish$Stitch;
		case 'stone':
			return _user$project$FromEnglish$Stone;
		case 'stoner_rock':
			return _user$project$FromEnglish$StonerRock;
		case 'stop':
			return _user$project$FromEnglish$Stop;
		case 'storage_requirements':
			return _user$project$FromEnglish$StorageRequirements;
		case 'store':
			return _user$project$FromEnglish$Store;
		case 'straight_ahead_jazz':
			return _user$project$FromEnglish$StraightAheadJazz;
		case 'strawberry':
			return _user$project$FromEnglish$Strawberry;
		case 'street_address':
			return _user$project$FromEnglish$StreetAddress;
		case 'street_punk':
			return _user$project$FromEnglish$StreetPunk;
		case 'strengthen':
			return _user$project$FromEnglish$Strengthen;
		case 'stretch':
			return _user$project$FromEnglish$Stretch;
		case 'stride_jazz':
			return _user$project$FromEnglish$StrideJazz;
		case 'strip':
			return _user$project$FromEnglish$Strip;
		case 'strontium':
			return _user$project$FromEnglish$Strontium;
		case 'structured':
			return _user$project$FromEnglish$Structured;
		case 'structured_value':
			return _user$project$FromEnglish$StructuredValue;
		case 'stub_tex':
			return _user$project$FromEnglish$StubTex;
		case 'studio_album':
			return _user$project$FromEnglish$StudioAlbum;
		case 'stuff':
			return _user$project$FromEnglish$Stuff;
		case 'styrofoam':
			return _user$project$FromEnglish$Styrofoam;
		case 'sub_event':
			return _user$project$FromEnglish$SubEvent;
		case 'sub_events':
			return _user$project$FromEnglish$SubEvents;
		case 'sub_organization':
			return _user$project$FromEnglish$SubOrganization;
		case 'sub_reservation':
			return _user$project$FromEnglish$SubReservation;
		case 'subscribe_action':
			return _user$project$FromEnglish$SubscribeAction;
		case 'subtitle_language':
			return _user$project$FromEnglish$SubtitleLanguage;
		case 'subtract':
			return _user$project$FromEnglish$Subtract;
		case 'subway_station':
			return _user$project$FromEnglish$SubwayStation;
		case 'succeed':
			return _user$project$FromEnglish$Succeed;
		case 'successor_of':
			return _user$project$FromEnglish$SuccessorOf;
		case 'suck':
			return _user$project$FromEnglish$Suck;
		case 'suffer':
			return _user$project$FromEnglish$Suffer;
		case 'sugar_content':
			return _user$project$FromEnglish$SugarContent;
		case 'suggest':
			return _user$project$FromEnglish$Suggest;
		case 'suggested_answer':
			return _user$project$FromEnglish$SuggestedAnswer;
		case 'suggested_gender':
			return _user$project$FromEnglish$SuggestedGender;
		case 'suggested_max_age':
			return _user$project$FromEnglish$SuggestedMaxAge;
		case 'suggested_min_age':
			return _user$project$FromEnglish$SuggestedMinAge;
		case 'suit':
			return _user$project$FromEnglish$Suit;
		case 'suitable_for_diet':
			return _user$project$FromEnglish$SuitableForDiet;
		case 'sumac':
			return _user$project$FromEnglish$Sumac;
		case 'sunday':
			return _user$project$FromEnglish$Sunday;
		case 'sung_poetry':
			return _user$project$FromEnglish$SungPoetry;
		case 'super_event':
			return _user$project$FromEnglish$SuperEvent;
		case 'supply':
			return _user$project$FromEnglish$Supply;
		case 'support':
			return _user$project$FromEnglish$Support;
		case 'supporting_data':
			return _user$project$FromEnglish$SupportingData;
		case 'suppose':
			return _user$project$FromEnglish$Suppose;
		case 'surf_rock':
			return _user$project$FromEnglish$SurfRock;
		case 'surface':
			return _user$project$FromEnglish$Surface;
		case 'surprise':
			return _user$project$FromEnglish$Surprise;
		case 'surround':
			return _user$project$FromEnglish$Surround;
		case 'suspect':
			return _user$project$FromEnglish$Suspect;
		case 'suspend':
			return _user$project$FromEnglish$Suspend;
		case 'suspend_action':
			return _user$project$FromEnglish$SuspendAction;
		case 'sweet':
			return _user$project$FromEnglish$Sweet;
		case 'sweet_chilli_sauce':
			return _user$project$FromEnglish$SweetChilliSauce;
		case 'sweet_potato':
			return _user$project$FromEnglish$SweetPotato;
		case 'swing':
			return _user$project$FromEnglish$Swing;
		case 'swing_house':
			return _user$project$FromEnglish$SwingHouse;
		case 'switch':
			return _user$project$FromEnglish$Switch;
		case 'symphonic_metal':
			return _user$project$FromEnglish$SymphonicMetal;
		case 'synagogue':
			return _user$project$FromEnglish$Synagogue;
		case 'syrup':
			return _user$project$FromEnglish$Syrup;
		case 'tabasco_pepper':
			return _user$project$FromEnglish$TabascoPepper;
		case 'table':
			return _user$project$FromEnglish$Table;
		case 'taffeta':
			return _user$project$FromEnglish$Taffeta;
		case 'take_action':
			return _user$project$FromEnglish$TakeAction;
		case 'tamarillo':
			return _user$project$FromEnglish$Tamarillo;
		case 'tamarind':
			return _user$project$FromEnglish$Tamarind;
		case 'tandoori_masala':
			return _user$project$FromEnglish$TandooriMasala;
		case 'tangerine':
			return _user$project$FromEnglish$Tangerine;
		case 'tannic':
			return _user$project$FromEnglish$Tannic;
		case 'tantalum':
			return _user$project$FromEnglish$Tantalum;
		case 'target_collection':
			return _user$project$FromEnglish$TargetCollection;
		case 'target_description':
			return _user$project$FromEnglish$TargetDescription;
		case 'target_name':
			return _user$project$FromEnglish$TargetName;
		case 'target_platform':
			return _user$project$FromEnglish$TargetPlatform;
		case 'target_product':
			return _user$project$FromEnglish$TargetProduct;
		case 'target_url':
			return _user$project$FromEnglish$TargetUrl;
		case 'taro':
			return _user$project$FromEnglish$Taro;
		case 'tarragon':
			return _user$project$FromEnglish$Tarragon;
		case 'tart':
			return _user$project$FromEnglish$Tart;
		case 'tartan':
			return _user$project$FromEnglish$Tartan;
		case 'tartar_sauce':
			return _user$project$FromEnglish$TartarSauce;
		case 'tasmanian_pepper':
			return _user$project$FromEnglish$TasmanianPepper;
		case 'tattersall':
			return _user$project$FromEnglish$Tattersall;
		case 'tattoo_parlor':
			return _user$project$FromEnglish$TattooParlor;
		case 'tax_id':
			return _user$project$FromEnglish$TaxId;
		case 'taxi_reservation':
			return _user$project$FromEnglish$TaxiReservation;
		case 'taxi_service':
			return _user$project$FromEnglish$TaxiService;
		case 'taxi_stand':
			return _user$project$FromEnglish$TaxiStand;
		case 'tech_article':
			return _user$project$FromEnglish$TechArticle;
		case 'tech_house':
			return _user$project$FromEnglish$TechHouse;
		case 'tech_trance':
			return _user$project$FromEnglish$TechTrance;
		case 'technetium':
			return _user$project$FromEnglish$Technetium;
		case 'technical_death_metal':
			return _user$project$FromEnglish$TechnicalDeathMetal;
		case 'techno_dnb':
			return _user$project$FromEnglish$TechnoDnb;
		case 'techno_folk':
			return _user$project$FromEnglish$TechnoFolk;
		case 'telephone':
			return _user$project$FromEnglish$Telephone;
		case 'television_channel':
			return _user$project$FromEnglish$TelevisionChannel;
		case 'television_station':
			return _user$project$FromEnglish$TelevisionStation;
		case 'temporal':
			return _user$project$FromEnglish$Temporal;
		case 'temporal_coverage':
			return _user$project$FromEnglish$TemporalCoverage;
		case 'tempt':
			return _user$project$FromEnglish$Tempt;
		case 'tennis_complex':
			return _user$project$FromEnglish$TennisComplex;
		case 'teriyaki_sauce':
			return _user$project$FromEnglish$TeriyakiSauce;
		case 'terra_cotta':
			return _user$project$FromEnglish$TerraCotta;
		case 'terrazzo':
			return _user$project$FromEnglish$Terrazzo;
		case 'terrify':
			return _user$project$FromEnglish$Terrify;
		case 'tewkesbury_mustard':
			return _user$project$FromEnglish$TewkesburyMustard;
		case 'text':
			return _user$project$FromEnglish$Text;
		case 'text_digital_document':
			return _user$project$FromEnglish$TextDigitalDocument;
		case 'thai_basil':
			return _user$project$FromEnglish$ThaiBasil;
		case 'thallium':
			return _user$project$FromEnglish$Thallium;
		case 'thank':
			return _user$project$FromEnglish$Thank;
		case 'theater_event':
			return _user$project$FromEnglish$TheaterEvent;
		case 'theater_group':
			return _user$project$FromEnglish$TheaterGroup;
		case 'thing':
			return _user$project$FromEnglish$Thing;
		case 'third_stream':
			return _user$project$FromEnglish$ThirdStream;
		case 'thorium':
			return _user$project$FromEnglish$Thorium;
		case 'thrash_metal':
			return _user$project$FromEnglish$ThrashMetal;
		case 'thulium':
			return _user$project$FromEnglish$Thulium;
		case 'thumbnail':
			return _user$project$FromEnglish$Thumbnail;
		case 'thumbnail_url':
			return _user$project$FromEnglish$ThumbnailUrl;
		case 'thursday':
			return _user$project$FromEnglish$Thursday;
		case 'thyme':
			return _user$project$FromEnglish$Thyme;
		case 'tick':
			return _user$project$FromEnglish$Tick;
		case 'ticker_symbol':
			return _user$project$FromEnglish$TickerSymbol;
		case 'ticket':
			return _user$project$FromEnglish$Ticket;
		case 'ticket_number':
			return _user$project$FromEnglish$TicketNumber;
		case 'ticket_token':
			return _user$project$FromEnglish$TicketToken;
		case 'ticketed_seat':
			return _user$project$FromEnglish$TicketedSeat;
		case 'tickle':
			return _user$project$FromEnglish$Tickle;
		case 'tie_action':
			return _user$project$FromEnglish$TieAction;
		case 'tight':
			return _user$project$FromEnglish$Tight;
		case 'timber':
			return _user$project$FromEnglish$Timber;
		case 'time':
			return _user$project$FromEnglish$Time;
		case 'time_required':
			return _user$project$FromEnglish$TimeRequired;
		case 'tin':
			return _user$project$FromEnglish$Tin;
		case 'tip':
			return _user$project$FromEnglish$Tip;
		case 'tip_action':
			return _user$project$FromEnglish$TipAction;
		case 'tire_shop':
			return _user$project$FromEnglish$TireShop;
		case 'titanium':
			return _user$project$FromEnglish$Titanium;
		case 'title':
			return _user$project$FromEnglish$Title;
		case 'to_location':
			return _user$project$FromEnglish$ToLocation;
		case 'toasty':
			return _user$project$FromEnglish$Toasty;
		case 'toll_free':
			return _user$project$FromEnglish$TollFree;
		case 'tomato':
			return _user$project$FromEnglish$Tomato;
		case 'tonka_bean':
			return _user$project$FromEnglish$TonkaBean;
		case 'total_payment_due':
			return _user$project$FromEnglish$TotalPaymentDue;
		case 'total_price':
			return _user$project$FromEnglish$TotalPrice;
		case 'total_time':
			return _user$project$FromEnglish$TotalTime;
		case 'touch':
			return _user$project$FromEnglish$Touch;
		case 'tourist_attraction':
			return _user$project$FromEnglish$TouristAttraction;
		case 'tourist_information_center':
			return _user$project$FromEnglish$TouristInformationCenter;
		case 'toy_store':
			return _user$project$FromEnglish$ToyStore;
		case 'toytown_techno':
			return _user$project$FromEnglish$ToytownTechno;
		case 'trace':
			return _user$project$FromEnglish$Trace;
		case 'track_action':
			return _user$project$FromEnglish$TrackAction;
		case 'tracking_number':
			return _user$project$FromEnglish$TrackingNumber;
		case 'tracking_url':
			return _user$project$FromEnglish$TrackingUrl;
		case 'tracks':
			return _user$project$FromEnglish$Tracks;
		case 'trad_jazz':
			return _user$project$FromEnglish$TradJazz;
		case 'trade':
			return _user$project$FromEnglish$Trade;
		case 'trade_action':
			return _user$project$FromEnglish$TradeAction;
		case 'traditional_doom':
			return _user$project$FromEnglish$TraditionalDoom;
		case 'trailer':
			return _user$project$FromEnglish$Trailer;
		case 'train':
			return _user$project$FromEnglish$Train;
		case 'train_name':
			return _user$project$FromEnglish$TrainName;
		case 'train_number':
			return _user$project$FromEnglish$TrainNumber;
		case 'train_reservation':
			return _user$project$FromEnglish$TrainReservation;
		case 'train_station':
			return _user$project$FromEnglish$TrainStation;
		case 'train_trip':
			return _user$project$FromEnglish$TrainTrip;
		case 'trance':
			return _user$project$FromEnglish$Trance;
		case 'trans_fat_content':
			return _user$project$FromEnglish$TransFatContent;
		case 'transcript':
			return _user$project$FromEnglish$Transcript;
		case 'transfer_action':
			return _user$project$FromEnglish$TransferAction;
		case 'transit_map':
			return _user$project$FromEnglish$TransitMap;
		case 'translator':
			return _user$project$FromEnglish$Translator;
		case 'transparent':
			return _user$project$FromEnglish$Transparent;
		case 'transport':
			return _user$project$FromEnglish$Transport;
		case 'travel':
			return _user$project$FromEnglish$Travel;
		case 'travel_action':
			return _user$project$FromEnglish$TravelAction;
		case 'travel_agency':
			return _user$project$FromEnglish$TravelAgency;
		case 'treat':
			return _user$project$FromEnglish$Treat;
		case 'tremble':
			return _user$project$FromEnglish$Tremble;
		case 'tribal_house':
			return _user$project$FromEnglish$TribalHouse;
		case 'trick':
			return _user$project$FromEnglish$Trick;
		case 'trip':
			return _user$project$FromEnglish$Trip;
		case 'trip_hop':
			return _user$project$FromEnglish$TripHop;
		case 'trot':
			return _user$project$FromEnglish$Trot;
		case 'trouble':
			return _user$project$FromEnglish$Trouble;
		case 'trust':
			return _user$project$FromEnglish$Trust;
		case 'try':
			return _user$project$FromEnglish$Try;
		case 'tubers':
			return _user$project$FromEnglish$Tubers;
		case 'tuesday':
			return _user$project$FromEnglish$Tuesday;
		case 'tulle':
			return _user$project$FromEnglish$Tulle;
		case 'tumble':
			return _user$project$FromEnglish$Tumble;
		case 'tungsten':
			return _user$project$FromEnglish$Tungsten;
		case 'turmeric':
			return _user$project$FromEnglish$Turmeric;
		case 'turn':
			return _user$project$FromEnglish$Turn;
		case 'turnip':
			return _user$project$FromEnglish$Turnip;
		case 'twee_pop':
			return _user$project$FromEnglish$TweePop;
		case 'tweed':
			return _user$project$FromEnglish$Tweed;
		case 'twill':
			return _user$project$FromEnglish$Twill;
		case 'twist':
			return _user$project$FromEnglish$Twist;
		case 'type':
			return _user$project$FromEnglish$Type;
		case 'type_and_quantity_node':
			return _user$project$FromEnglish$TypeAndQuantityNode;
		case 'type_of_bed':
			return _user$project$FromEnglish$TypeOfBed;
		case 'type_of_good':
			return _user$project$FromEnglish$TypeOfGood;
		case 'typical_age_range':
			return _user$project$FromEnglish$TypicalAgeRange;
		case 'ugli_fruit':
			return _user$project$FromEnglish$UgliFruit;
		case 'un_register_action':
			return _user$project$FromEnglish$UnRegisterAction;
		case 'unctuous':
			return _user$project$FromEnglish$Unctuous;
		case 'under_name':
			return _user$project$FromEnglish$UnderName;
		case 'undress':
			return _user$project$FromEnglish$Undress;
		case 'unfasten':
			return _user$project$FromEnglish$Unfasten;
		case 'unit_code':
			return _user$project$FromEnglish$UnitCode;
		case 'unit_price_specification':
			return _user$project$FromEnglish$UnitPriceSpecification;
		case 'unit_text':
			return _user$project$FromEnglish$UnitText;
		case 'unite':
			return _user$project$FromEnglish$Unite;
		case 'unlock':
			return _user$project$FromEnglish$Unlock;
		case 'unpack':
			return _user$project$FromEnglish$Unpack;
		case 'unsaturated_fat_content':
			return _user$project$FromEnglish$UnsaturatedFatContent;
		case 'untidy':
			return _user$project$FromEnglish$Untidy;
		case 'update_action':
			return _user$project$FromEnglish$UpdateAction;
		case 'uplifting_trance':
			return _user$project$FromEnglish$UpliftingTrance;
		case 'upload_date':
			return _user$project$FromEnglish$UploadDate;
		case 'upvote_count':
			return _user$project$FromEnglish$UpvoteCount;
		case 'uranium':
			return _user$project$FromEnglish$Uranium;
		case 'urbanite':
			return _user$project$FromEnglish$Urbanite;
		case 'url':
			return _user$project$FromEnglish$Url;
		case 'url_template':
			return _user$project$FromEnglish$UrlTemplate;
		case 'use_action':
			return _user$project$FromEnglish$UseAction;
		case 'used_condition':
			return _user$project$FromEnglish$UsedCondition;
		case 'user_blocks':
			return _user$project$FromEnglish$UserBlocks;
		case 'user_checkins':
			return _user$project$FromEnglish$UserCheckins;
		case 'user_comments':
			return _user$project$FromEnglish$UserComments;
		case 'user_downloads':
			return _user$project$FromEnglish$UserDownloads;
		case 'user_interaction':
			return _user$project$FromEnglish$UserInteraction;
		case 'user_interaction_count':
			return _user$project$FromEnglish$UserInteractionCount;
		case 'user_likes':
			return _user$project$FromEnglish$UserLikes;
		case 'user_page_visits':
			return _user$project$FromEnglish$UserPageVisits;
		case 'user_plays':
			return _user$project$FromEnglish$UserPlays;
		case 'user_plus_ones':
			return _user$project$FromEnglish$UserPlusOnes;
		case 'user_tweets':
			return _user$project$FromEnglish$UserTweets;
		case 'valid_for':
			return _user$project$FromEnglish$ValidFor;
		case 'valid_from':
			return _user$project$FromEnglish$ValidFrom;
		case 'valid_in':
			return _user$project$FromEnglish$ValidIn;
		case 'valid_through':
			return _user$project$FromEnglish$ValidThrough;
		case 'valid_until':
			return _user$project$FromEnglish$ValidUntil;
		case 'value':
			return _user$project$FromEnglish$Value;
		case 'value_added_tax_included':
			return _user$project$FromEnglish$ValueAddedTaxIncluded;
		case 'value_max_length':
			return _user$project$FromEnglish$ValueMaxLength;
		case 'value_min_length':
			return _user$project$FromEnglish$ValueMinLength;
		case 'value_name':
			return _user$project$FromEnglish$ValueName;
		case 'value_pattern':
			return _user$project$FromEnglish$ValuePattern;
		case 'value_reference':
			return _user$project$FromEnglish$ValueReference;
		case 'value_required':
			return _user$project$FromEnglish$ValueRequired;
		case 'vanadium':
			return _user$project$FromEnglish$Vanadium;
		case 'vanilla':
			return _user$project$FromEnglish$Vanilla;
		case 'vanillin':
			return _user$project$FromEnglish$Vanillin;
		case 'vat_id':
			return _user$project$FromEnglish$VatId;
		case 'vegan_diet':
			return _user$project$FromEnglish$VeganDiet;
		case 'vegetable_flannel':
			return _user$project$FromEnglish$VegetableFlannel;
		case 'vegetal':
			return _user$project$FromEnglish$Vegetal;
		case 'vegetarian_diet':
			return _user$project$FromEnglish$VegetarianDiet;
		case 'vehicle':
			return _user$project$FromEnglish$Vehicle;
		case 'vehicle_configuration':
			return _user$project$FromEnglish$VehicleConfiguration;
		case 'vehicle_engine':
			return _user$project$FromEnglish$VehicleEngine;
		case 'vehicle_identification_number':
			return _user$project$FromEnglish$VehicleIdentificationNumber;
		case 'vehicle_interior_color':
			return _user$project$FromEnglish$VehicleInteriorColor;
		case 'vehicle_interior_type':
			return _user$project$FromEnglish$VehicleInteriorType;
		case 'vehicle_model_date':
			return _user$project$FromEnglish$VehicleModelDate;
		case 'vehicle_seating_capacity':
			return _user$project$FromEnglish$VehicleSeatingCapacity;
		case 'vehicle_special_usage':
			return _user$project$FromEnglish$VehicleSpecialUsage;
		case 'vehicle_transmission':
			return _user$project$FromEnglish$VehicleTransmission;
		case 'velvet':
			return _user$project$FromEnglish$Velvet;
		case 'velveteen':
			return _user$project$FromEnglish$Velveteen;
		case 'velvety':
			return _user$project$FromEnglish$Velvety;
		case 'venue_map':
			return _user$project$FromEnglish$VenueMap;
		case 'version':
			return _user$project$FromEnglish$Version;
		case 'video':
			return _user$project$FromEnglish$Video;
		case 'video_format':
			return _user$project$FromEnglish$VideoFormat;
		case 'video_frame_size':
			return _user$project$FromEnglish$VideoFrameSize;
		case 'video_gallery':
			return _user$project$FromEnglish$VideoGallery;
		case 'video_game':
			return _user$project$FromEnglish$VideoGame;
		case 'video_game_clip':
			return _user$project$FromEnglish$VideoGameClip;
		case 'video_game_series':
			return _user$project$FromEnglish$VideoGameSeries;
		case 'video_object':
			return _user$project$FromEnglish$VideoObject;
		case 'video_quality':
			return _user$project$FromEnglish$VideoQuality;
		case 'vietnamese_coriander':
			return _user$project$FromEnglish$VietnameseCoriander;
		case 'view_action':
			return _user$project$FromEnglish$ViewAction;
		case 'viking_metal':
			return _user$project$FromEnglish$VikingMetal;
		case 'vino_cotto':
			return _user$project$FromEnglish$VinoCotto;
		case 'vinyl_coated_polyester':
			return _user$project$FromEnglish$VinylCoatedPolyester;
		case 'vinyl_format':
			return _user$project$FromEnglish$VinylFormat;
		case 'visit':
			return _user$project$FromEnglish$Visit;
		case 'visual_arts_event':
			return _user$project$FromEnglish$VisualArtsEvent;
		case 'visual_artwork':
			return _user$project$FromEnglish$VisualArtwork;
		case 'vocal_house':
			return _user$project$FromEnglish$VocalHouse;
		case 'vocal_jazz':
			return _user$project$FromEnglish$VocalJazz;
		case 'vocal_trance':
			return _user$project$FromEnglish$VocalTrance;
		case 'volcano':
			return _user$project$FromEnglish$Volcano;
		case 'volume_number':
			return _user$project$FromEnglish$VolumeNumber;
		case 'vote_action':
			return _user$project$FromEnglish$VoteAction;
		case 'wallpaper':
			return _user$project$FromEnglish$Wallpaper;
		case 'want':
			return _user$project$FromEnglish$Want;
		case 'want_action':
			return _user$project$FromEnglish$WantAction;
		case 'warm':
			return _user$project$FromEnglish$Warm;
		case 'warranty':
			return _user$project$FromEnglish$Warranty;
		case 'warranty_promise':
			return _user$project$FromEnglish$WarrantyPromise;
		case 'warranty_scope':
			return _user$project$FromEnglish$WarrantyScope;
		case 'wasabi':
			return _user$project$FromEnglish$Wasabi;
		case 'waste':
			return _user$project$FromEnglish$Waste;
		case 'watch':
			return _user$project$FromEnglish$Watch;
		case 'watch_action':
			return _user$project$FromEnglish$WatchAction;
		case 'water':
			return _user$project$FromEnglish$Water;
		case 'water_chestnut':
			return _user$project$FromEnglish$WaterChestnut;
		case 'watercress':
			return _user$project$FromEnglish$Watercress;
		case 'waterfall':
			return _user$project$FromEnglish$Waterfall;
		case 'watermelon':
			return _user$project$FromEnglish$Watermelon;
		case 'watermelon_rind_preserves':
			return _user$project$FromEnglish$WatermelonRindPreserves;
		case 'wave':
			return _user$project$FromEnglish$Wave;
		case 'wear_action':
			return _user$project$FromEnglish$WearAction;
		case 'web_application':
			return _user$project$FromEnglish$WebApplication;
		case 'web_checkin_time':
			return _user$project$FromEnglish$WebCheckinTime;
		case 'web_page':
			return _user$project$FromEnglish$WebPage;
		case 'web_page_element':
			return _user$project$FromEnglish$WebPageElement;
		case 'web_site':
			return _user$project$FromEnglish$WebSite;
		case 'wednesday':
			return _user$project$FromEnglish$Wednesday;
		case 'weight':
			return _user$project$FromEnglish$Weight;
		case 'welcome':
			return _user$project$FromEnglish$Welcome;
		case 'west_coast_jazz':
			return _user$project$FromEnglish$WestCoastJazz;
		case 'western':
			return _user$project$FromEnglish$Western;
		case 'whipcord':
			return _user$project$FromEnglish$Whipcord;
		case 'whirl':
			return _user$project$FromEnglish$Whirl;
		case 'whisper':
			return _user$project$FromEnglish$Whisper;
		case 'whistle':
			return _user$project$FromEnglish$Whistle;
		case 'white_mustard':
			return _user$project$FromEnglish$WhiteMustard;
		case 'white_peppercorn':
			return _user$project$FromEnglish$WhitePeppercorn;
		case 'white_radish':
			return _user$project$FromEnglish$WhiteRadish;
		case 'wholesale_store':
			return _user$project$FromEnglish$WholesaleStore;
		case 'width':
			return _user$project$FromEnglish$Width;
		case 'wigan':
			return _user$project$FromEnglish$Wigan;
		case 'wiki_doc':
			return _user$project$FromEnglish$WikiDoc;
		case 'win_action':
			return _user$project$FromEnglish$WinAction;
		case 'winery':
			return _user$project$FromEnglish$Winery;
		case 'wink':
			return _user$project$FromEnglish$Wink;
		case 'winner':
			return _user$project$FromEnglish$Winner;
		case 'wipe':
			return _user$project$FromEnglish$Wipe;
		case 'wire_rope':
			return _user$project$FromEnglish$WireRope;
		case 'witch_house':
			return _user$project$FromEnglish$WitchHouse;
		case 'wobble':
			return _user$project$FromEnglish$Wobble;
		case 'wonder':
			return _user$project$FromEnglish$Wonder;
		case 'wood':
			return _user$project$FromEnglish$Wood;
		case 'woodruff':
			return _user$project$FromEnglish$Woodruff;
		case 'wool':
			return _user$project$FromEnglish$Wool;
		case 'word_count':
			return _user$project$FromEnglish$WordCount;
		case 'work_example':
			return _user$project$FromEnglish$WorkExample;
		case 'work_featured':
			return _user$project$FromEnglish$WorkFeatured;
		case 'work_hours':
			return _user$project$FromEnglish$WorkHours;
		case 'work_location':
			return _user$project$FromEnglish$WorkLocation;
		case 'work_performed':
			return _user$project$FromEnglish$WorkPerformed;
		case 'work_presented':
			return _user$project$FromEnglish$WorkPresented;
		case 'works_for':
			return _user$project$FromEnglish$WorksFor;
		case 'world_fusion':
			return _user$project$FromEnglish$WorldFusion;
		case 'worry':
			return _user$project$FromEnglish$Worry;
		case 'worst_rating':
			return _user$project$FromEnglish$WorstRating;
		case 'wpad_block':
			return _user$project$FromEnglish$WpadBlock;
		case 'wrap':
			return _user$project$FromEnglish$Wrap;
		case 'wreck':
			return _user$project$FromEnglish$Wreck;
		case 'wrestle':
			return _user$project$FromEnglish$Wrestle;
		case 'wriggle':
			return _user$project$FromEnglish$Wriggle;
		case 'write_action':
			return _user$project$FromEnglish$WriteAction;
		case 'write_permission':
			return _user$project$FromEnglish$WritePermission;
		case 'x_ray':
			return _user$project$FromEnglish$XRay;
		case 'xo_sauce':
			return _user$project$FromEnglish$XoSauce;
		case 'yacht_rock':
			return _user$project$FromEnglish$YachtRock;
		case 'yam':
			return _user$project$FromEnglish$Yam;
		case 'yawn':
			return _user$project$FromEnglish$Yawn;
		case 'yearly_revenue':
			return _user$project$FromEnglish$YearlyRevenue;
		case 'years_in_operation':
			return _user$project$FromEnglish$YearsInOperation;
		case 'yell':
			return _user$project$FromEnglish$Yell;
		case 'yorkshire_bleeps_and_bass':
			return _user$project$FromEnglish$YorkshireBleepsAndBass;
		case 'ytterbium':
			return _user$project$FromEnglish$Ytterbium;
		case 'yttrium':
			return _user$project$FromEnglish$Yttrium;
		case 'yuzu':
			return _user$project$FromEnglish$Yuzu;
		case 'zedoary':
			return _user$project$FromEnglish$Zedoary;
		case 'zephyr':
			return _user$project$FromEnglish$Zephyr;
		case 'zest':
			return _user$project$FromEnglish$Zest;
		case 'zibeline':
			return _user$project$FromEnglish$Zibeline;
		case 'zinc':
			return _user$project$FromEnglish$Zinc;
		case 'zip':
			return _user$project$FromEnglish$Zip;
		case 'zirconium':
			return _user$project$FromEnglish$Zirconium;
		case 'zone_boarding_policy':
			return _user$project$FromEnglish$ZoneBoardingPolicy;
		case 'zoom':
			return _user$project$FromEnglish$Zoom;
		case 'zucchini':
			return _user$project$FromEnglish$Zucchini;
		default:
			return _user$project$FromEnglish$digitOrComposed(s);
	}
};
var _user$project$FromEnglish$digitOrComposed = function (s) {
	return A2(_elm_lang$core$String$startsWith, '#', s) ? _user$project$FromEnglish$N(
		A2(_elm_lang$core$String$dropLeft, 1, s)) : (A2(_elm_lang$core$String$contains, '/', s) ? _user$project$FromEnglish$toComposedWordsX(
		A2(_elm_lang$core$String$split, '/', s)) : (A2(_elm_lang$core$String$contains, ':', s) ? _user$project$FromEnglish$toComposedWordsC(
		A2(_elm_lang$core$String$split, ':', s)) : _user$project$FromEnglish$Unknown));
};
var _user$project$FromEnglish$toComposedWordsC = function (list) {
	return _user$project$FromEnglish$C(
		A2(_elm_lang$core$List$map, _user$project$FromEnglish$engToWord, list));
};
var _user$project$FromEnglish$toComposedWordsX = function (list) {
	return _user$project$FromEnglish$X(
		A2(_elm_lang$core$List$map, _user$project$FromEnglish$engToWord, list));
};
var _user$project$FromEnglish$engToHexa = function (s) {
	return A2(
		_elm_lang$core$String$join,
		' ',
		_user$project$FromEnglish$toHexa(
			A2(
				_elm_lang$core$List$map,
				_user$project$FromEnglish$engToWord,
				_elm_lang$core$String$words(s))));
};

var _user$project$App$area = F2(
	function (str, meta) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('purple lighten-3'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('purple lighten-2 col s3'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h5,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(meta.title),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('input-field col s9'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$textarea,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('materialize-textarea'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$id('textarea1'),
										_1: {ctor: '[]'}
									}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(str),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$App$update = F2(
	function (_p0, oldContent) {
		var _p1 = _p0;
		return _p1._0;
	});
var _user$project$App$Metadata = function (a) {
	return {title: a};
};
var _user$project$App$NewContent = function (a) {
	return {ctor: 'NewContent', _0: a};
};
var _user$project$App$view = function (content) {
	var asHexa = _user$project$FromEnglish$engToHexa(content);
	var asVisual = _user$project$FromEnglish$hexaToVisual(asHexa);
	var asPhonetic = _user$project$FromEnglish$hexaToPhonetic(asHexa);
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('row'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h2,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Translate'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$form,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('col s12'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('row'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$textarea,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('materialize-textarea purple lighten-5'),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$id('textarea1'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Events$onInput(_user$project$App$NewContent),
												_1: {ctor: '[]'}
											}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$App$area,
										asHexa,
										{title: 'Hexa'}),
									_1: {
										ctor: '::',
										_0: A2(
											_user$project$App$area,
											asVisual,
											{title: 'Visual'}),
										_1: {
											ctor: '::',
											_0: A2(
												_user$project$App$area,
												asPhonetic,
												{title: 'Phonetic'}),
											_1: {ctor: '[]'}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$App$main = _elm_lang$html$Html$beginnerProgram(
	{model: '', view: _user$project$App$view, update: _user$project$App$update})();

var Elm = {};
Elm['App'] = Elm['App'] || {};
if (typeof _user$project$App$main !== 'undefined') {
    _user$project$App$main(Elm['App'], 'App', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

