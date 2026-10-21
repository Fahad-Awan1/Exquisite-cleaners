//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region node_modules/gsap/gsap-core.js
function _assertThisInitialized(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _inheritsLoose(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
	subClass.__proto__ = superClass;
}
/*!
* GSAP 3.15.0
* https://gsap.com
*
* @license Copyright 2008-2026, GreenSock. All rights reserved.
* Subject to the terms at https://gsap.com/standard-license
* @author: Jack Doyle, jack@greensock.com
*/
var _config = {
	autoSleep: 120,
	force3D: "auto",
	nullTargetWarn: 1,
	units: { lineHeight: "" }
};
var _defaults$1 = {
	duration: .5,
	overwrite: false,
	delay: 0
};
var _suppressOverwrites$1;
var _reverting$1;
var _context$3;
var _bigNum$1 = 1e8;
var _tinyNum = 1 / _bigNum$1;
var _2PI = Math.PI * 2;
var _HALF_PI = _2PI / 4;
var _gsID = 0;
var _sqrt = Math.sqrt;
var _cos = Math.cos;
var _sin = Math.sin;
var _isString$1 = function _isString(value) {
	return typeof value === "string";
};
var _isFunction$1 = function _isFunction(value) {
	return typeof value === "function";
};
var _isNumber$1 = function _isNumber(value) {
	return typeof value === "number";
};
var _isUndefined = function _isUndefined(value) {
	return typeof value === "undefined";
};
var _isObject$1 = function _isObject(value) {
	return typeof value === "object";
};
var _isNotFalse = function _isNotFalse(value) {
	return value !== false;
};
var _windowExists$2 = function _windowExists() {
	return typeof window !== "undefined";
};
var _isFuncOrString = function _isFuncOrString(value) {
	return _isFunction$1(value) || _isString$1(value);
};
var _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {};
var _isArray = Array.isArray;
var _randomExp = /random\([^)]+\)/g;
var _commaDelimExp = /,\s*/g;
var _strictNumExp = /(?:-?\.?\d|\.)+/gi;
var _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
var _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
var _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
var _relExp = /[+-]=-?[.\d]+/;
var _delimitedValueExp = /[^,'"\[\]\s]+/gi;
var _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
var _globalTimeline;
var _win$3;
var _coreInitted$3;
var _doc$3;
var _globals = {};
var _installScope = {};
var _coreReady;
var _install = function _install(scope) {
	return (_installScope = _merge(scope, _globals)) && gsap$3;
};
var _missingPlugin = function _missingPlugin(property, value) {
	return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
};
var _warn = function _warn(message, suppress) {
	return !suppress && console.warn(message);
};
var _addGlobal = function _addGlobal(name, obj) {
	return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
};
var _emptyFunc = function _emptyFunc() {
	return 0;
};
var _startAtRevertConfig = {
	suppressEvents: true,
	isStart: true,
	kill: false
};
var _revertConfigNoKill = {
	suppressEvents: true,
	kill: false
};
var _revertConfig = { suppressEvents: true };
var _reservedProps = {};
var _lazyTweens = [];
var _lazyLookup = {};
var _lastRenderedFrame;
var _plugins = {};
var _effects = {};
var _nextGCFrame = 30;
var _harnessPlugins = [];
var _callbackNames = "";
var _harness = function _harness(targets) {
	var target = targets[0], harnessPlugin, i;
	_isObject$1(target) || _isFunction$1(target) || (targets = [targets]);
	if (!(harnessPlugin = (target._gsap || {}).harness)) {
		i = _harnessPlugins.length;
		while (i-- && !_harnessPlugins[i].targetTest(target));
		harnessPlugin = _harnessPlugins[i];
	}
	i = targets.length;
	while (i--) targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
	return targets;
};
var _getCache = function _getCache(target) {
	return target._gsap || _harness(toArray(target))[0]._gsap;
};
var _getProperty = function _getProperty(target, property, v) {
	return (v = target[property]) && _isFunction$1(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
};
var _forEachName = function _forEachName(names, func) {
	return (names = names.split(",")).forEach(func) || names;
};
var _round$1 = function _round(value) {
	return Math.round(value * 1e5) / 1e5 || 0;
};
var _roundPrecise = function _roundPrecise(value) {
	return Math.round(value * 1e7) / 1e7 || 0;
};
var _parseRelative = function _parseRelative(start, value) {
	var operator = value.charAt(0), end = parseFloat(value.substr(2));
	start = parseFloat(start);
	return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
};
var _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
	var l = toFind.length, i = 0;
	for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;);
	return i < l;
};
var _lazyRender = function _lazyRender() {
	var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
	_lazyLookup = {};
	_lazyTweens.length = 0;
	for (i = 0; i < l; i++) {
		tween = a[i];
		tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
	}
};
var _isRevertWorthy = function _isRevertWorthy(animation) {
	return !!(animation._initted || animation._startAt || animation.add);
};
var _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
	_lazyTweens.length && !_reverting$1 && _lazyRender();
	animation.render(time, suppressEvents, force || !!(_reverting$1 && time < 0 && _isRevertWorthy(animation)));
	_lazyTweens.length && !_reverting$1 && _lazyRender();
};
var _numericIfPossible = function _numericIfPossible(value) {
	var n = parseFloat(value);
	return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString$1(value) ? value.trim() : value;
};
var _passThrough$1 = function _passThrough(p) {
	return p;
};
var _setDefaults$1 = function _setDefaults(obj, defaults) {
	for (var p in defaults) p in obj || (obj[p] = defaults[p]);
	return obj;
};
var _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
	return function(obj, defaults) {
		for (var p in defaults) p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
	};
};
var _merge = function _merge(base, toMerge) {
	for (var p in toMerge) base[p] = toMerge[p];
	return base;
};
var _mergeDeep = function _mergeDeep(base, toMerge) {
	for (var p in toMerge) p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject$1(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
	return base;
};
var _copyExcluding = function _copyExcluding(obj, excluding) {
	var copy = {}, p;
	for (p in obj) p in excluding || (copy[p] = obj[p]);
	return copy;
};
var _inheritDefaults = function _inheritDefaults(vars) {
	var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults$1;
	if (_isNotFalse(vars.inherit)) while (parent) {
		func(vars, parent.vars.defaults);
		parent = parent.parent || parent._dp;
	}
	return vars;
};
var _arraysMatch = function _arraysMatch(a1, a2) {
	var i = a1.length, match = i === a2.length;
	while (match && i-- && a1[i] === a2[i]);
	return i < 0;
};
var _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
	if (firstProp === void 0) firstProp = "_first";
	if (lastProp === void 0) lastProp = "_last";
	var prev = parent[lastProp], t;
	if (sortBy) {
		t = child[sortBy];
		while (prev && prev[sortBy] > t) prev = prev._prev;
	}
	if (prev) {
		child._next = prev._next;
		prev._next = child;
	} else {
		child._next = parent[firstProp];
		parent[firstProp] = child;
	}
	if (child._next) child._next._prev = child;
	else parent[lastProp] = child;
	child._prev = prev;
	child.parent = child._dp = parent;
	return child;
};
var _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
	if (firstProp === void 0) firstProp = "_first";
	if (lastProp === void 0) lastProp = "_last";
	var prev = child._prev, next = child._next;
	if (prev) prev._next = next;
	else if (parent[firstProp] === child) parent[firstProp] = next;
	if (next) next._prev = prev;
	else if (parent[lastProp] === child) parent[lastProp] = prev;
	child._next = child._prev = child.parent = null;
};
var _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
	child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
	child._act = 0;
};
var _uncache = function _uncache(animation, child) {
	if (animation && (!child || child._end > animation._dur || child._start < 0)) {
		var a = animation;
		while (a) {
			a._dirty = 1;
			a = a.parent;
		}
	}
	return animation;
};
var _recacheAncestors = function _recacheAncestors(animation) {
	var parent = animation.parent;
	while (parent && parent.parent) {
		parent._dirty = 1;
		parent.totalDuration();
		parent = parent.parent;
	}
	return animation;
};
var _rewindStartAt = function _rewindStartAt(tween, totalTime, suppressEvents, force) {
	return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
};
var _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
	return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
};
var _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
	return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
};
var _animationCycle = function _animationCycle(tTime, cycleDuration) {
	var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
	return tTime && whole === tTime ? whole - 1 : whole;
};
var _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
	return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
};
var _setEnd = function _setEnd(animation) {
	return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
};
var _alignPlayhead = function _alignPlayhead(animation, totalTime) {
	var parent = animation._dp;
	if (parent && parent.smoothChildTiming && animation._ts) {
		animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
		_setEnd(animation);
		parent._dirty || _uncache(parent, animation);
	}
	return animation;
};
var _postAddChecks = function _postAddChecks(timeline, child) {
	var t;
	if (child._time || !child._dur && child._initted || child._start < timeline._time && (child._dur || !child.add)) {
		t = _parentToChildTotalTime(timeline.rawTime(), child);
		if (!child._dur || _clamp$1(0, child.totalDuration(), t) - child._tTime > _tinyNum) child.render(t, true);
	}
	if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
		if (timeline._dur < timeline.duration()) {
			t = timeline;
			while (t._dp) {
				t.rawTime() >= 0 && t.totalTime(t._tTime);
				t = t._dp;
			}
		}
		timeline._zTime = -_tinyNum;
	}
};
var _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
	child.parent && _removeFromParent(child);
	child._start = _roundPrecise((_isNumber$1(position) ? position : position || timeline !== _globalTimeline ? _parsePosition$1(timeline, position, child) : timeline._time) + child._delay);
	child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
	_addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
	_isFromOrFromStart(child) || (timeline._recent = child);
	skipChecks || _postAddChecks(timeline, child);
	timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime);
	return timeline;
};
var _scrollTrigger = function _scrollTrigger(animation, trigger) {
	return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
};
var _attemptInitTween = function _attemptInitTween(tween, time, force, suppressEvents, tTime) {
	_initTween(tween, time, tTime);
	if (!tween._initted) return 1;
	if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
		_lazyTweens.push(tween);
		tween._lazy = [tTime, suppressEvents];
		return 1;
	}
};
var _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
	var parent = _ref.parent;
	return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
};
var _isFromOrFromStart = function _isFromOrFromStart(_ref2) {
	var data = _ref2.data;
	return data === "isFromStart" || data === "isStart";
};
var _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
	var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
	if (repeatDelay && tween._repeat) {
		tTime = _clamp$1(0, tween._tDur, totalTime);
		iteration = _animationCycle(tTime, repeatDelay);
		tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
		if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
			prevRatio = 1 - ratio;
			tween.vars.repeatRefresh && tween._initted && tween.invalidate();
		}
	}
	if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
		if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) return;
		prevIteration = tween._zTime;
		tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
		suppressEvents || (suppressEvents = totalTime && !prevIteration);
		tween.ratio = ratio;
		tween._from && (ratio = 1 - ratio);
		tween._time = 0;
		tween._tTime = tTime;
		pt = tween._pt;
		while (pt) {
			pt.r(ratio, pt.d);
			pt = pt._next;
		}
		totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
		tween._onUpdate && !suppressEvents && _callback$1(tween, "onUpdate");
		tTime && tween._repeat && !suppressEvents && tween.parent && _callback$1(tween, "onRepeat");
		if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
			ratio && _removeFromParent(tween, 1);
			if (!suppressEvents && !_reverting$1) {
				_callback$1(tween, ratio ? "onComplete" : "onReverseComplete", true);
				tween._prom && tween._prom();
			}
		}
	} else if (!tween._zTime) tween._zTime = totalTime;
};
var _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
	var child;
	if (time > prevTime) {
		child = animation._first;
		while (child && child._start <= time) {
			if (child.data === "isPause" && child._start > prevTime) return child;
			child = child._next;
		}
	} else {
		child = animation._last;
		while (child && child._start >= time) {
			if (child.data === "isPause" && child._start < prevTime) return child;
			child = child._prev;
		}
	}
};
var _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
	var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
	totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
	animation._dur = dur;
	animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
	totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
	animation.parent && _setEnd(animation);
	skipUncache || _uncache(animation.parent, animation);
	return animation;
};
var _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
	return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
};
var _zeroPosition = {
	_start: 0,
	endTime: _emptyFunc,
	totalDuration: _emptyFunc
};
var _parsePosition$1 = function _parsePosition(animation, position, percentAnimation) {
	var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$1 ? recent.endTime(false) : animation._dur, i, offset, isPercent;
	if (_isString$1(position) && (isNaN(position) || position in labels)) {
		offset = position.charAt(0);
		isPercent = position.substr(-1) === "%";
		i = position.indexOf("=");
		if (offset === "<" || offset === ">") {
			i >= 0 && (position = position.replace(/=/, ""));
			return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
		}
		if (i < 0) {
			position in labels || (labels[position] = clippedDuration);
			return labels[position];
		}
		offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
		if (isPercent && percentAnimation) offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
		return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
	}
	return position == null ? clippedDuration : +position;
};
var _createTweenType = function _createTweenType(type, params, timeline) {
	var isLegacy = _isNumber$1(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
	isLegacy && (vars.duration = params[1]);
	vars.parent = timeline;
	if (type) {
		irVars = vars;
		parent = timeline;
		while (parent && !("immediateRender" in irVars)) {
			irVars = parent.vars.defaults || {};
			parent = _isNotFalse(parent.vars.inherit) && parent.parent;
		}
		vars.immediateRender = _isNotFalse(irVars.immediateRender);
		type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
	}
	return new Tween(params[0], vars, params[varsIndex + 1]);
};
var _conditionalReturn = function _conditionalReturn(value, func) {
	return value || value === 0 ? func(value) : func;
};
var _clamp$1 = function _clamp(min, max, value) {
	return value < min ? min : value > max ? max : value;
};
var getUnit = function getUnit(value, v) {
	return !_isString$1(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
};
var clamp$1 = function clamp(min, max, value) {
	return _conditionalReturn(value, function(v) {
		return _clamp$1(min, max, v);
	});
};
var _slice = [].slice;
var _isArrayLike = function _isArrayLike(value, nonEmpty) {
	return value && _isObject$1(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject$1(value[0])) && !value.nodeType && value !== _win$3;
};
var _flatten = function _flatten(ar, leaveStrings, accumulator) {
	if (accumulator === void 0) accumulator = [];
	return ar.forEach(function(value) {
		var _accumulator;
		return _isString$1(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
	}) || accumulator;
};
var toArray = function toArray(value, scope, leaveStrings) {
	return _context$3 && !scope && _context$3.selector ? _context$3.selector(value) : _isString$1(value) && !leaveStrings && (_coreInitted$3 || !_wake()) ? _slice.call((scope || _doc$3).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
};
var selector = function selector(value) {
	value = toArray(value)[0] || _warn("Invalid scope") || {};
	return function(v) {
		var el = value.current || value.nativeElement || value;
		return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$3.createElement("div") : value);
	};
};
var shuffle = function shuffle(a) {
	return a.sort(function() {
		return .5 - Math.random();
	});
};
var distribute = function distribute(v) {
	if (_isFunction$1(v)) return v;
	var vars = _isObject$1(v) ? v : { each: v }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
	if (_isString$1(from)) ratioX = ratioY = {
		center: .5,
		edges: .5,
		end: 1
	}[from] || 0;
	else if (!isDecimal && ratios) {
		ratioX = from[0];
		ratioY = from[1];
	}
	return function(i, target, a) {
		var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max, min, wrapAt;
		if (!distances) {
			wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
			if (!wrapAt) {
				max = -_bigNum$1;
				while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l);
				wrapAt < l && wrapAt--;
			}
			distances = cache[l] = [];
			originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
			originY = wrapAt === _bigNum$1 ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
			max = 0;
			min = _bigNum$1;
			for (j = 0; j < l; j++) {
				x = j % wrapAt - originX;
				y = originY - (j / wrapAt | 0);
				distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
				d > max && (max = d);
				d < min && (min = d);
			}
			from === "random" && shuffle(distances);
			distances.max = max - min;
			distances.min = min;
			distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
			distances.b = l < 0 ? base - l : base;
			distances.u = getUnit(vars.amount || vars.each) || 0;
			ease = ease && l < 0 ? _invertEase(ease) : ease;
		}
		l = (distances[i] - distances.min) / distances.max || 0;
		return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
	};
};
var _roundModifier = function _roundModifier(v) {
	var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
	return function(raw) {
		var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
		return (n - n % 1) / p + (_isNumber$1(raw) ? 0 : getUnit(raw));
	};
};
var snap = function snap(snapTo, value) {
	var isArray = _isArray(snapTo), radius, is2D;
	if (!isArray && _isObject$1(snapTo)) {
		radius = isArray = snapTo.radius || _bigNum$1;
		if (snapTo.values) {
			snapTo = toArray(snapTo.values);
			if (is2D = !_isNumber$1(snapTo[0])) radius *= radius;
		} else snapTo = _roundModifier(snapTo.increment);
	}
	return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction$1(snapTo) ? function(raw) {
		is2D = snapTo(raw);
		return Math.abs(is2D - raw) <= radius ? is2D : raw;
	} : function(raw) {
		var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum$1, closest = 0, i = snapTo.length, dx, dy;
		while (i--) {
			if (is2D) {
				dx = snapTo[i].x - x;
				dy = snapTo[i].y - y;
				dx = dx * dx + dy * dy;
			} else dx = Math.abs(snapTo[i] - x);
			if (dx < min) {
				min = dx;
				closest = i;
			}
		}
		closest = !radius || min <= radius ? snapTo[closest] : raw;
		return is2D || closest === raw || _isNumber$1(raw) ? closest : closest + getUnit(raw);
	});
};
var random = function random(min, max, roundingIncrement, returnFunction) {
	return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
		return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
	});
};
var pipe = function pipe() {
	for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) functions[_key] = arguments[_key];
	return function(value) {
		return functions.reduce(function(v, f) {
			return f(v);
		}, value);
	};
};
var unitize = function unitize(func, unit) {
	return function(value) {
		return func(parseFloat(value)) + (unit || getUnit(value));
	};
};
var normalize = function normalize(min, max, value) {
	return mapRange(min, max, 0, 1, value);
};
var _wrapArray = function _wrapArray(a, wrapper, value) {
	return _conditionalReturn(value, function(index) {
		return a[~~wrapper(index)];
	});
};
var wrap = function wrap(min, max, value) {
	var range = max - min;
	return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function(value) {
		return (range + (value - min) % range) % range + min;
	});
};
var wrapYoyo = function wrapYoyo(min, max, value) {
	var range = max - min, total = range * 2;
	return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function(value) {
		value = (total + (value - min) % total) % total || 0;
		return min + (value > range ? total - value : value);
	});
};
var _replaceRandom = function _replaceRandom(s) {
	return s.replace(_randomExp, function(match) {
		var arIndex = match.indexOf("[") + 1, values = match.substring(arIndex || 7, arIndex ? match.indexOf("]") : match.length - 1).split(_commaDelimExp);
		return random(arIndex ? values : +values[0], arIndex ? 0 : +values[1], +values[2] || 1e-5);
	});
};
var mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
	var inRange = inMax - inMin, outRange = outMax - outMin;
	return _conditionalReturn(value, function(value) {
		return outMin + ((value - inMin) / inRange * outRange || 0);
	});
};
var interpolate = function interpolate(start, end, progress, mutate) {
	var func = isNaN(start + end) ? 0 : function(p) {
		return (1 - p) * start + p * end;
	};
	if (!func) {
		var isString = _isString$1(start), master = {}, p, i, interpolators, l, il;
		progress === true && (mutate = 1) && (progress = null);
		if (isString) {
			start = { p: start };
			end = { p: end };
		} else if (_isArray(start) && !_isArray(end)) {
			interpolators = [];
			l = start.length;
			il = l - 2;
			for (i = 1; i < l; i++) interpolators.push(interpolate(start[i - 1], start[i]));
			l--;
			func = function func(p) {
				p *= l;
				var i = Math.min(il, ~~p);
				return interpolators[i](p - i);
			};
			progress = end;
		} else if (!mutate) start = _merge(_isArray(start) ? [] : {}, start);
		if (!interpolators) {
			for (p in end) _addPropTween.call(master, start, p, "get", end[p]);
			func = function func(p) {
				return _renderPropTweens(p, master) || (isString ? start.p : start);
			};
		}
	}
	return _conditionalReturn(progress, func);
};
var _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
	var labels = timeline.labels, min = _bigNum$1, p, distance, label;
	for (p in labels) {
		distance = labels[p] - fromTime;
		if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
			label = p;
			min = distance;
		}
	}
	return label;
};
var _callback$1 = function _callback(animation, type, executeLazyFirst) {
	var v = animation.vars, callback = v[type], prevContext = _context$3, context = animation._ctx, params, scope, result;
	if (!callback) return;
	params = v[type + "Params"];
	scope = v.callbackScope || animation;
	executeLazyFirst && _lazyTweens.length && _lazyRender();
	context && (_context$3 = context);
	result = params ? callback.apply(scope, params) : callback.call(scope);
	_context$3 = prevContext;
	return result;
};
var _interrupt = function _interrupt(animation) {
	_removeFromParent(animation);
	animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
	animation.progress() < 1 && _callback$1(animation, "onInterrupt");
	return animation;
};
var _quickTween;
var _registerPluginQueue = [];
var _createPlugin = function _createPlugin(config) {
	if (!config) return;
	config = !config.name && config["default"] || config;
	if (_windowExists$2() || config.headless) {
		var name = config.name, isFunc = _isFunction$1(config), Plugin = name && !isFunc && config.init ? function() {
			this._props = [];
		} : config, instanceDefaults = {
			init: _emptyFunc,
			render: _renderPropTweens,
			add: _addPropTween,
			kill: _killPropTweensOf,
			modifier: _addPluginModifier,
			rawVars: 0
		}, statics = {
			targetTest: 0,
			get: 0,
			getSetter: _getSetter,
			aliases: {},
			register: 0
		};
		_wake();
		if (config !== Plugin) {
			if (_plugins[name]) return;
			_setDefaults$1(Plugin, _setDefaults$1(_copyExcluding(config, instanceDefaults), statics));
			_merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));
			_plugins[Plugin.prop = name] = Plugin;
			if (config.targetTest) {
				_harnessPlugins.push(Plugin);
				_reservedProps[name] = 1;
			}
			name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
		}
		_addGlobal(name, Plugin);
		config.register && config.register(gsap$3, Plugin, PropTween);
	} else _registerPluginQueue.push(config);
};
var _255 = 255;
var _colorLookup = {
	aqua: [
		0,
		_255,
		_255
	],
	lime: [
		0,
		_255,
		0
	],
	silver: [
		192,
		192,
		192
	],
	black: [
		0,
		0,
		0
	],
	maroon: [
		128,
		0,
		0
	],
	teal: [
		0,
		128,
		128
	],
	blue: [
		0,
		0,
		_255
	],
	navy: [
		0,
		0,
		128
	],
	white: [
		_255,
		_255,
		_255
	],
	olive: [
		128,
		128,
		0
	],
	yellow: [
		_255,
		_255,
		0
	],
	orange: [
		_255,
		165,
		0
	],
	gray: [
		128,
		128,
		128
	],
	purple: [
		128,
		0,
		128
	],
	green: [
		0,
		128,
		0
	],
	red: [
		_255,
		0,
		0
	],
	pink: [
		_255,
		192,
		203
	],
	cyan: [
		0,
		_255,
		_255
	],
	transparent: [
		_255,
		_255,
		_255,
		0
	]
};
var _hue = function _hue(h, m1, m2) {
	h += h < 0 ? 1 : h > 1 ? -1 : 0;
	return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
};
var splitColor = function splitColor(v, toHSL, forceAlpha) {
	var a = !v ? _colorLookup.black : _isNumber$1(v) ? [
		v >> 16,
		v >> 8 & _255,
		v & _255
	] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
	if (!a) {
		if (v.substr(-1) === ",") v = v.substr(0, v.length - 1);
		if (_colorLookup[v]) a = _colorLookup[v];
		else if (v.charAt(0) === "#") {
			if (v.length < 6) {
				r = v.charAt(1);
				g = v.charAt(2);
				b = v.charAt(3);
				v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
			}
			if (v.length === 9) {
				a = parseInt(v.substr(1, 6), 16);
				return [
					a >> 16,
					a >> 8 & _255,
					a & _255,
					parseInt(v.substr(7), 16) / 255
				];
			}
			v = parseInt(v.substr(1), 16);
			a = [
				v >> 16,
				v >> 8 & _255,
				v & _255
			];
		} else if (v.substr(0, 3) === "hsl") {
			a = wasHSL = v.match(_strictNumExp);
			if (!toHSL) {
				h = +a[0] % 360 / 360;
				s = +a[1] / 100;
				l = +a[2] / 100;
				g = l <= .5 ? l * (s + 1) : l + s - l * s;
				r = l * 2 - g;
				a.length > 3 && (a[3] *= 1);
				a[0] = _hue(h + 1 / 3, r, g);
				a[1] = _hue(h, r, g);
				a[2] = _hue(h - 1 / 3, r, g);
			} else if (~v.indexOf("=")) {
				a = v.match(_numExp);
				forceAlpha && a.length < 4 && (a[3] = 1);
				return a;
			}
		} else a = v.match(_strictNumExp) || _colorLookup.transparent;
		a = a.map(Number);
	}
	if (toHSL && !wasHSL) {
		r = a[0] / _255;
		g = a[1] / _255;
		b = a[2] / _255;
		max = Math.max(r, g, b);
		min = Math.min(r, g, b);
		l = (max + min) / 2;
		if (max === min) h = s = 0;
		else {
			d = max - min;
			s = l > .5 ? d / (2 - max - min) : d / (max + min);
			h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
			h *= 60;
		}
		a[0] = ~~(h + .5);
		a[1] = ~~(s * 100 + .5);
		a[2] = ~~(l * 100 + .5);
	}
	forceAlpha && a.length < 4 && (a[3] = 1);
	return a;
};
var _colorOrderData = function _colorOrderData(v) {
	var values = [], c = [], i = -1;
	v.split(_colorExp).forEach(function(v) {
		var a = v.match(_numWithUnitExp) || [];
		values.push.apply(values, a);
		c.push(i += a.length + 1);
	});
	values.c = c;
	return values;
};
var _formatColors = function _formatColors(s, toHSL, orderMatchData) {
	var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
	if (!colors) return s;
	colors = colors.map(function(color) {
		return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
	});
	if (orderMatchData) {
		d = _colorOrderData(s);
		c = orderMatchData.c;
		if (c.join(result) !== d.c.join(result)) {
			shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
			l = shell.length - 1;
			for (; i < l; i++) result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
		}
	}
	if (!shell) {
		shell = s.split(_colorExp);
		l = shell.length - 1;
		for (; i < l; i++) result += shell[i] + colors[i];
	}
	return result + shell[l];
};
var _colorExp = function() {
	var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
	for (p in _colorLookup) s += "|" + p + "\\b";
	return new RegExp(s + ")", "gi");
}();
var _hslExp = /hsl[a]?\(/;
var _colorStringFilter = function _colorStringFilter(a) {
	var combined = a.join(" "), toHSL;
	_colorExp.lastIndex = 0;
	if (_colorExp.test(combined)) {
		toHSL = _hslExp.test(combined);
		a[1] = _formatColors(a[1], toHSL);
		a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
		return true;
	}
};
var _tickerActive;
var _ticker = function() {
	var _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick(v) {
		var elapsed = _getTime() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
		(elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
		_lastUpdate += elapsed;
		time = _lastUpdate - _startTime;
		overlap = time - _nextTime;
		if (overlap > 0 || manual) {
			frame = ++_self.frame;
			_delta = time - _self.time * 1e3;
			_self.time = time = time / 1e3;
			_nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
			dispatch = 1;
		}
		manual || (_id = _req(_tick));
		if (dispatch) for (_i = 0; _i < _listeners.length; _i++) _listeners[_i](time, _delta, frame, v);
	};
	_self = {
		time: 0,
		frame: 0,
		tick: function tick() {
			_tick(true);
		},
		deltaRatio: function deltaRatio(fps) {
			return _delta / (1e3 / (fps || 60));
		},
		wake: function wake() {
			if (_coreReady) {
				if (!_coreInitted$3 && _windowExists$2()) {
					_win$3 = _coreInitted$3 = window;
					_doc$3 = _win$3.document || {};
					_globals.gsap = gsap$3;
					(_win$3.gsapVersions || (_win$3.gsapVersions = [])).push(gsap$3.version);
					_install(_installScope || _win$3.GreenSockGlobals || !_win$3.gsap && _win$3 || {});
					_registerPluginQueue.forEach(_createPlugin);
				}
				_raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
				_id && _self.sleep();
				_req = _raf || function(f) {
					return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
				};
				_tickerActive = 1;
				_tick(2);
			}
		},
		sleep: function sleep() {
			(_raf ? cancelAnimationFrame : clearTimeout)(_id);
			_tickerActive = 0;
			_req = _emptyFunc;
		},
		lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
			_lagThreshold = threshold || Infinity;
			_adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
		},
		fps: function fps(_fps) {
			_gap = 1e3 / (_fps || 240);
			_nextTime = _self.time * 1e3 + _gap;
		},
		add: function add(callback, once, prioritize) {
			var func = once ? function(t, d, f, v) {
				callback(t, d, f, v);
				_self.remove(func);
			} : callback;
			_self.remove(callback);
			_listeners[prioritize ? "unshift" : "push"](func);
			_wake();
			return func;
		},
		remove: function remove(callback, i) {
			~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
		},
		_listeners
	};
	return _self;
}();
var _wake = function _wake() {
	return !_tickerActive && _ticker.wake();
};
var _easeMap = {};
var _customEaseExp = /^[\d.\-M][\d.\-,\s]/;
var _quotesExp = /["']/g;
var _parseObjectInString = function _parseObjectInString(value) {
	var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index, val, parsedVal;
	for (; i < l; i++) {
		val = split[i];
		index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
		parsedVal = val.substr(0, index);
		obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
		key = val.substr(index + 1).trim();
	}
	return obj;
};
var _valueInParentheses = function _valueInParentheses(value) {
	var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
	return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
};
var _configEaseFromString = function _configEaseFromString(name) {
	var split = (name + "").split("("), ease = _easeMap[split[0]];
	return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
};
var _invertEase = function _invertEase(ease) {
	return function(p) {
		return 1 - ease(1 - p);
	};
};
var _parseEase = function _parseEase(ease, defaultEase) {
	return !ease ? defaultEase : (_isFunction$1(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
};
var _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
	if (easeOut === void 0) easeOut = function easeOut(p) {
		return 1 - easeIn(1 - p);
	};
	if (easeInOut === void 0) easeInOut = function easeInOut(p) {
		return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
	};
	var ease = {
		easeIn,
		easeOut,
		easeInOut
	}, lowercaseName;
	_forEachName(names, function(name) {
		_easeMap[name] = _globals[name] = ease;
		_easeMap[lowercaseName = name.toLowerCase()] = easeOut;
		for (var p in ease) _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
	});
	return ease;
};
var _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
	return function(p) {
		return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
	};
};
var _configElastic = function _configElastic(type, amplitude, period) {
	var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut(p) {
		return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
	}, ease = type === "out" ? easeOut : type === "in" ? function(p) {
		return 1 - easeOut(1 - p);
	} : _easeInOutFromOut(easeOut);
	p2 = _2PI / p2;
	ease.config = function(amplitude, period) {
		return _configElastic(type, amplitude, period);
	};
	return ease;
};
var _configBack = function _configBack(type, overshoot) {
	if (overshoot === void 0) overshoot = 1.70158;
	var easeOut = function easeOut(p) {
		return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
	}, ease = type === "out" ? easeOut : type === "in" ? function(p) {
		return 1 - easeOut(1 - p);
	} : _easeInOutFromOut(easeOut);
	ease.config = function(overshoot) {
		return _configBack(type, overshoot);
	};
	return ease;
};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
	var power = i < 5 ? i + 1 : i;
	_insertEase(name + ",Power" + (power - 1), i ? function(p) {
		return Math.pow(p, power);
	} : function(p) {
		return p;
	}, function(p) {
		return 1 - Math.pow(1 - p, power);
	}, function(p) {
		return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
	});
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
(function(n, c) {
	var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut(p) {
		return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
	};
	_insertEase("Bounce", function(p) {
		return 1 - easeOut(1 - p);
	}, easeOut);
})(7.5625, 2.75);
_insertEase("Expo", function(p) {
	return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
});
_insertEase("Circ", function(p) {
	return -(_sqrt(1 - p * p) - 1);
});
_insertEase("Sine", function(p) {
	return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = { config: function config(steps, immediateStart) {
	if (steps === void 0) steps = 1;
	var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
	return function(p) {
		return ((p2 * _clamp$1(0, max, p) | 0) + p3) * p1;
	};
} };
_defaults$1.ease = _easeMap["quad.out"];
_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
	return _callbackNames += name + "," + name + "Params,";
});
var GSCache = function GSCache(target, harness) {
	this.id = _gsID++;
	target._gsap = this;
	this.target = target;
	this.harness = harness;
	this.get = harness ? harness.get : _getProperty;
	this.set = harness ? harness.getSetter : _getSetter;
};
var Animation = /*#__PURE__*/ function() {
	function Animation(vars) {
		this.vars = vars;
		this._delay = +vars.delay || 0;
		if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
			this._rDelay = vars.repeatDelay || 0;
			this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
		}
		this._ts = 1;
		_setDuration(this, +vars.duration, 1, 1);
		this.data = vars.data;
		if (_context$3) {
			this._ctx = _context$3;
			_context$3.data.push(this);
		}
		_tickerActive || _ticker.wake();
	}
	var _proto = Animation.prototype;
	_proto.delay = function delay(value) {
		if (value || value === 0) {
			this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
			this._delay = value;
			return this;
		}
		return this._delay;
	};
	_proto.duration = function duration(value) {
		return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
	};
	_proto.totalDuration = function totalDuration(value) {
		if (!arguments.length) return this._tDur;
		this._dirty = 0;
		return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
	};
	_proto.totalTime = function totalTime(_totalTime, suppressEvents) {
		_wake();
		if (!arguments.length) return this._tTime;
		var parent = this._dp;
		if (parent && parent.smoothChildTiming && this._ts) {
			_alignPlayhead(this, _totalTime);
			!parent._dp || parent.parent || _postAddChecks(parent, this);
			while (parent && parent.parent) {
				if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) parent.totalTime(parent._tTime, true);
				parent = parent.parent;
			}
			if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) _addToTimeline(this._dp, this, this._start - this._delay);
		}
		if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !this._initted && this._dur && _totalTime || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
			this._ts || (this._pTime = _totalTime);
			_lazySafeRender(this, _totalTime, suppressEvents);
		}
		return this;
	};
	_proto.time = function time(value, suppressEvents) {
		return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
	};
	_proto.totalProgress = function totalProgress(value, suppressEvents) {
		return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
	};
	_proto.progress = function progress(value, suppressEvents) {
		return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
	};
	_proto.iteration = function iteration(value, suppressEvents) {
		var cycleDuration = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
	};
	_proto.timeScale = function timeScale(value, suppressEvents) {
		if (!arguments.length) return this._rts === -_tinyNum ? 0 : this._rts;
		if (this._rts === value) return this;
		var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
		this._rts = +value || 0;
		this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
		this.totalTime(_clamp$1(-Math.abs(this._delay), this.totalDuration(), tTime), suppressEvents !== false);
		_setEnd(this);
		return _recacheAncestors(this);
	};
	_proto.paused = function paused(value) {
		if (!arguments.length) return this._ps;
		if (this._ps !== value) {
			this._ps = value;
			if (value) {
				this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
				this._ts = this._act = 0;
			} else {
				_wake();
				this._ts = this._rts;
				this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
			}
		}
		return this;
	};
	_proto.startTime = function startTime(value) {
		if (arguments.length) {
			this._start = _roundPrecise(value);
			var parent = this.parent || this._dp;
			parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, this._start - this._delay);
			return this;
		}
		return this._start;
	};
	_proto.endTime = function endTime(includeRepeats) {
		return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
	};
	_proto.rawTime = function rawTime(wrapRepeats) {
		var parent = this.parent || this._dp;
		return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
	};
	_proto.revert = function revert(config) {
		if (config === void 0) config = _revertConfig;
		var prevIsReverting = _reverting$1;
		_reverting$1 = config;
		if (_isRevertWorthy(this)) {
			this.timeline && this.timeline.revert(config);
			this.totalTime(-.01, config.suppressEvents);
		}
		this.data !== "nested" && config.kill !== false && this.kill();
		_reverting$1 = prevIsReverting;
		return this;
	};
	_proto.globalTime = function globalTime(rawTime) {
		var animation = this, time = arguments.length ? rawTime : animation.rawTime();
		while (animation) {
			time = animation._start + time / (Math.abs(animation._ts) || 1);
			animation = animation._dp;
		}
		return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
	};
	_proto.repeat = function repeat(value) {
		if (arguments.length) {
			this._repeat = value === Infinity ? -2 : value;
			return _onUpdateTotalDuration(this);
		}
		return this._repeat === -2 ? Infinity : this._repeat;
	};
	_proto.repeatDelay = function repeatDelay(value) {
		if (arguments.length) {
			var time = this._time;
			this._rDelay = value;
			_onUpdateTotalDuration(this);
			return time ? this.time(time) : this;
		}
		return this._rDelay;
	};
	_proto.yoyo = function yoyo(value) {
		if (arguments.length) {
			this._yoyo = value;
			return this;
		}
		return this._yoyo;
	};
	_proto.seek = function seek(position, suppressEvents) {
		return this.totalTime(_parsePosition$1(this, position), _isNotFalse(suppressEvents));
	};
	_proto.restart = function restart(includeDelay, suppressEvents) {
		this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
		this._dur || (this._zTime = -_tinyNum);
		return this;
	};
	_proto.play = function play(from, suppressEvents) {
		from != null && this.seek(from, suppressEvents);
		return this.reversed(false).paused(false);
	};
	_proto.reverse = function reverse(from, suppressEvents) {
		from != null && this.seek(from || this.totalDuration(), suppressEvents);
		return this.reversed(true).paused(false);
	};
	_proto.pause = function pause(atTime, suppressEvents) {
		atTime != null && this.seek(atTime, suppressEvents);
		return this.paused(true);
	};
	_proto.resume = function resume() {
		return this.paused(false);
	};
	_proto.reversed = function reversed(value) {
		if (arguments.length) {
			!!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
			return this;
		}
		return this._rts < 0;
	};
	_proto.invalidate = function invalidate() {
		this._initted = this._act = 0;
		this._zTime = -_tinyNum;
		return this;
	};
	_proto.isActive = function isActive() {
		var parent = this.parent || this._dp, start = this._start, rawTime;
		return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
	};
	_proto.eventCallback = function eventCallback(type, callback, params) {
		var vars = this.vars;
		if (arguments.length > 1) {
			if (!callback) delete vars[type];
			else {
				vars[type] = callback;
				params && (vars[type + "Params"] = params);
				type === "onUpdate" && (this._onUpdate = callback);
			}
			return this;
		}
		return vars[type];
	};
	_proto.then = function then(onFulfilled) {
		var self = this, prevProm = self._prom;
		return new Promise(function(resolve) {
			var f = _isFunction$1(onFulfilled) ? onFulfilled : _passThrough$1, _resolve = function _resolve() {
				var _then = self.then;
				self.then = null;
				prevProm && prevProm();
				_isFunction$1(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
				resolve(f);
				self.then = _then;
			};
			if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) _resolve();
			else self._prom = _resolve;
		});
	};
	_proto.kill = function kill() {
		_interrupt(this);
	};
	return Animation;
}();
_setDefaults$1(Animation.prototype, {
	_time: 0,
	_start: 0,
	_end: 0,
	_tTime: 0,
	_tDur: 0,
	_dirty: 0,
	_repeat: 0,
	_yoyo: false,
	parent: null,
	_initted: false,
	_rDelay: 0,
	_ts: 1,
	_dp: 0,
	ratio: 0,
	_zTime: -_tinyNum,
	_prom: 0,
	_ps: false,
	_rts: 1
});
var Timeline = /*#__PURE__*/ function(_Animation) {
	_inheritsLoose(Timeline, _Animation);
	function Timeline(vars, position) {
		var _this;
		if (vars === void 0) vars = {};
		_this = _Animation.call(this, vars) || this;
		_this.labels = {};
		_this.smoothChildTiming = !!vars.smoothChildTiming;
		_this.autoRemoveChildren = !!vars.autoRemoveChildren;
		_this._sort = _isNotFalse(vars.sortChildren);
		_globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
		vars.reversed && _this.reverse();
		vars.paused && _this.paused(true);
		vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
		return _this;
	}
	var _proto2 = Timeline.prototype;
	_proto2.to = function to(targets, vars, position) {
		_createTweenType(0, arguments, this);
		return this;
	};
	_proto2.from = function from(targets, vars, position) {
		_createTweenType(1, arguments, this);
		return this;
	};
	_proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
		_createTweenType(2, arguments, this);
		return this;
	};
	_proto2.set = function set(targets, vars, position) {
		vars.duration = 0;
		vars.parent = this;
		_inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
		vars.immediateRender = !!vars.immediateRender;
		new Tween(targets, vars, _parsePosition$1(this, position), 1);
		return this;
	};
	_proto2.call = function call(callback, params, position) {
		return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
	};
	_proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
		vars.duration = duration;
		vars.stagger = vars.stagger || stagger;
		vars.onComplete = onCompleteAll;
		vars.onCompleteParams = onCompleteAllParams;
		vars.parent = this;
		new Tween(targets, vars, _parsePosition$1(this, position));
		return this;
	};
	_proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
		vars.runBackwards = 1;
		_inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
		return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
	};
	_proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
		toVars.startAt = fromVars;
		_inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
		return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
	};
	_proto2.render = function render(totalTime, suppressEvents, force) {
		var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
		this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
		if (tTime !== this._tTime || force || crossingStart) {
			if (prevTime !== this._time && dur) {
				tTime += this._time - prevTime;
				totalTime += this._time - prevTime;
			}
			time = tTime;
			prevStart = this._start;
			timeScale = this._ts;
			prevPaused = !timeScale;
			if (crossingStart) {
				dur || (prevTime = this._zTime);
				(totalTime || !suppressEvents) && (this._zTime = totalTime);
			}
			if (this._repeat) {
				yoyo = this._yoyo;
				cycleDuration = dur + this._rDelay;
				if (this._repeat < -1 && totalTime < 0) return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
				time = _roundPrecise(tTime % cycleDuration);
				if (tTime === tDur) {
					iteration = this._repeat;
					time = dur;
				} else {
					prevIteration = _roundPrecise(tTime / cycleDuration);
					iteration = ~~prevIteration;
					if (iteration && iteration === prevIteration) {
						time = dur;
						iteration--;
					}
					time > dur && (time = dur);
				}
				prevIteration = _animationCycle(this._tTime, cycleDuration);
				!prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
				if (yoyo && iteration & 1) {
					time = dur - time;
					isYoyo = 1;
				}
				if (iteration !== prevIteration && !this._lock) {
					var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
					iteration < prevIteration && (rewinding = !rewinding);
					prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
					this._lock = 1;
					this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
					this._tTime = tTime;
					!suppressEvents && this.parent && _callback$1(this, "onRepeat");
					if (this.vars.repeatRefresh && !isYoyo) {
						this.invalidate()._lock = 1;
						prevIteration = iteration;
					}
					if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
					dur = this._dur;
					tDur = this._tDur;
					if (doesWrap) {
						this._lock = 2;
						prevTime = rewinding ? dur : -1e-4;
						this.render(prevTime, true);
						this.vars.repeatRefresh && !isYoyo && this.invalidate();
					}
					this._lock = 0;
					if (!this._ts && !prevPaused) return this;
				}
			}
			if (this._hasPause && !this._forcing && this._lock < 2) {
				pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
				if (pauseTween) tTime -= time - (time = pauseTween._start);
			}
			this._tTime = tTime;
			this._time = time;
			this._act = !!timeScale;
			if (!this._initted) {
				this._onUpdate = this.vars.onUpdate;
				this._initted = 1;
				this._zTime = totalTime;
				prevTime = 0;
			}
			if (!prevTime && tTime && dur && !suppressEvents && !prevIteration) {
				_callback$1(this, "onStart");
				if (this._tTime !== tTime) return this;
			}
			if (time >= prevTime && totalTime >= 0) {
				child = this._first;
				while (child) {
					next = child._next;
					if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
						if (child.parent !== this) return this.render(totalTime, suppressEvents, force);
						child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
						if (time !== this._time || !this._ts && !prevPaused) {
							pauseTween = 0;
							next && (tTime += this._zTime = -_tinyNum);
							break;
						}
					}
					child = next;
				}
			} else {
				child = this._last;
				var adjustedTime = totalTime < 0 ? totalTime : time;
				while (child) {
					next = child._prev;
					if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
						if (child.parent !== this) return this.render(totalTime, suppressEvents, force);
						child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && _isRevertWorthy(child));
						if (time !== this._time || !this._ts && !prevPaused) {
							pauseTween = 0;
							next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
							break;
						}
					}
					child = next;
				}
			}
			if (pauseTween && !suppressEvents) {
				this.pause();
				pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
				if (this._ts) {
					this._start = prevStart;
					_setEnd(this);
					return this.render(totalTime, suppressEvents, force);
				}
			}
			this._onUpdate && !suppressEvents && _callback$1(this, "onUpdate", true);
			if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
				if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
					if (!this._lock) {
						(totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
						if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
							_callback$1(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
							this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
						}
					}
				}
			}
		}
		return this;
	};
	_proto2.add = function add(child, position) {
		var _this2 = this;
		_isNumber$1(position) || (position = _parsePosition$1(this, position, child));
		if (!(child instanceof Animation)) {
			if (_isArray(child)) {
				child.forEach(function(obj) {
					return _this2.add(obj, position);
				});
				return this;
			}
			if (_isString$1(child)) return this.addLabel(child, position);
			if (_isFunction$1(child)) child = Tween.delayedCall(0, child);
			else return this;
		}
		return this !== child ? _addToTimeline(this, child, position) : this;
	};
	_proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
		if (nested === void 0) nested = true;
		if (tweens === void 0) tweens = true;
		if (timelines === void 0) timelines = true;
		if (ignoreBeforeTime === void 0) ignoreBeforeTime = -_bigNum$1;
		var a = [], child = this._first;
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				if (child instanceof Tween) tweens && a.push(child);
				else {
					timelines && a.push(child);
					nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
				}
			}
			child = child._next;
		}
		return a;
	};
	_proto2.getById = function getById(id) {
		var animations = this.getChildren(1, 1, 1), i = animations.length;
		while (i--) if (animations[i].vars.id === id) return animations[i];
	};
	_proto2.remove = function remove(child) {
		if (_isString$1(child)) return this.removeLabel(child);
		if (_isFunction$1(child)) return this.killTweensOf(child);
		child.parent === this && _removeLinkedListItem(this, child);
		if (child === this._recent) this._recent = this._last;
		return _uncache(this);
	};
	_proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
		if (!arguments.length) return this._tTime;
		this._forcing = 1;
		if (!this._dp && this._ts) this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
		_Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
		this._forcing = 0;
		return this;
	};
	_proto2.addLabel = function addLabel(label, position) {
		this.labels[label] = _parsePosition$1(this, position);
		return this;
	};
	_proto2.removeLabel = function removeLabel(label) {
		delete this.labels[label];
		return this;
	};
	_proto2.addPause = function addPause(position, callback, params) {
		var t = Tween.delayedCall(0, callback || _emptyFunc, params);
		t.data = "isPause";
		this._hasPause = 1;
		return _addToTimeline(this, t, _parsePosition$1(this, position));
	};
	_proto2.removePause = function removePause(position) {
		var child = this._first;
		position = _parsePosition$1(this, position);
		while (child) {
			if (child._start === position && child.data === "isPause") _removeFromParent(child);
			child = child._next;
		}
	};
	_proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
		var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
		while (i--) _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
		return this;
	};
	_proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
		var a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber$1(onlyActive), children;
		while (child) {
			if (child instanceof Tween) {
				if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) a.push(child);
			} else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) a.push.apply(a, children);
			child = child._next;
		}
		return a;
	};
	_proto2.tweenTo = function tweenTo(position, vars) {
		vars = vars || {};
		var tl = this, endTime = _parsePosition$1(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults$1({
			ease: vars.ease || "none",
			lazy: false,
			immediateRender: false,
			time: endTime,
			overwrite: "auto",
			duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
			onStart: function onStart() {
				tl.pause();
				if (!initted) {
					var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
					tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
					initted = 1;
				}
				_onStart && _onStart.apply(tween, onStartParams || []);
			}
		}, vars));
		return immediateRender ? tween.render(0) : tween;
	};
	_proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
		return this.tweenTo(toPosition, _setDefaults$1({ startAt: { time: _parsePosition$1(this, fromPosition) } }, vars));
	};
	_proto2.recent = function recent() {
		return this._recent;
	};
	_proto2.nextLabel = function nextLabel(afterTime) {
		if (afterTime === void 0) afterTime = this._time;
		return _getLabelInDirection(this, _parsePosition$1(this, afterTime));
	};
	_proto2.previousLabel = function previousLabel(beforeTime) {
		if (beforeTime === void 0) beforeTime = this._time;
		return _getLabelInDirection(this, _parsePosition$1(this, beforeTime), 1);
	};
	_proto2.currentLabel = function currentLabel(value) {
		return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
	};
	_proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
		if (ignoreBeforeTime === void 0) ignoreBeforeTime = 0;
		var child = this._first, labels = this.labels, p;
		amount = _roundPrecise(amount);
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				child._start += amount;
				child._end += amount;
			}
			child = child._next;
		}
		if (adjustLabels) {
			for (p in labels) if (labels[p] >= ignoreBeforeTime) labels[p] += amount;
		}
		return _uncache(this);
	};
	_proto2.invalidate = function invalidate(soft) {
		var child = this._first;
		this._lock = 0;
		while (child) {
			child.invalidate(soft);
			child = child._next;
		}
		return _Animation.prototype.invalidate.call(this, soft);
	};
	_proto2.clear = function clear(includeLabels) {
		if (includeLabels === void 0) includeLabels = true;
		var child = this._first, next;
		while (child) {
			next = child._next;
			this.remove(child);
			child = next;
		}
		this._dp && (this._time = this._tTime = this._pTime = 0);
		includeLabels && (this.labels = {});
		return _uncache(this);
	};
	_proto2.totalDuration = function totalDuration(value) {
		var max = 0, self = this, child = self._last, prevStart = _bigNum$1, prev, start, parent;
		if (arguments.length) return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
		if (self._dirty) {
			parent = self.parent;
			while (child) {
				prev = child._prev;
				child._dirty && child.totalDuration();
				start = child._start;
				if (start > prevStart && self._sort && child._ts && !self._lock) {
					self._lock = 1;
					_addToTimeline(self, child, start - child._delay, 1)._lock = 0;
				} else prevStart = start;
				if (start < 0 && child._ts) {
					max -= start;
					if (!parent && !self._dp || parent && parent.smoothChildTiming) {
						self._start += _roundPrecise(start / self._ts);
						self._time -= start;
						self._tTime -= start;
					}
					self.shiftChildren(-start, false, -Infinity);
					prevStart = 0;
				}
				child._end > max && child._ts && (max = child._end);
				child = prev;
			}
			_setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
			self._dirty = 0;
		}
		return self._tDur;
	};
	Timeline.updateRoot = function updateRoot(time) {
		if (_globalTimeline._ts) {
			_lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
			_lastRenderedFrame = _ticker.frame;
		}
		if (_ticker.frame >= _nextGCFrame) {
			_nextGCFrame += _config.autoSleep || 120;
			var child = _globalTimeline._first;
			if (!child || !child._ts) {
				if (_config.autoSleep && _ticker._listeners.length < 2) {
					while (child && !child._ts) child = child._next;
					child || _ticker.sleep();
				}
			}
		}
	};
	return Timeline;
}(Animation);
_setDefaults$1(Timeline.prototype, {
	_lock: 0,
	_hasPause: 0,
	_forcing: 0
});
var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
	var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
	pt.b = start;
	pt.e = end;
	start += "";
	end += "";
	if (hasRandom = ~end.indexOf("random(")) end = _replaceRandom(end);
	if (stringFilter) {
		a = [start, end];
		stringFilter(a, target, prop);
		start = a[0];
		end = a[1];
	}
	startNums = start.match(_complexStringNumExp) || [];
	while (result = _complexStringNumExp.exec(end)) {
		endNum = result[0];
		chunk = end.substring(index, result.index);
		if (color) color = (color + 1) % 5;
		else if (chunk.substr(-5) === "rgba(") color = 1;
		if (endNum !== startNums[matchIndex++]) {
			startNum = parseFloat(startNums[matchIndex - 1]) || 0;
			pt._pt = {
				_next: pt._pt,
				p: chunk || matchIndex === 1 ? chunk : ",",
				s: startNum,
				c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
				m: color && color < 4 ? Math.round : 0
			};
			index = _complexStringNumExp.lastIndex;
		}
	}
	pt.c = index < end.length ? end.substring(index, end.length) : "";
	pt.fp = funcParam;
	if (_relExp.test(end) || hasRandom) pt.e = 0;
	this._pt = pt;
	return pt;
};
var _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
	_isFunction$1(end) && (end = end(index || 0, target, targets));
	var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction$1(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction$1(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction$1(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
	if (_isString$1(end)) {
		if (~end.indexOf("random(")) end = _replaceRandom(end);
		if (end.charAt(1) === "=") {
			pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
			if (pt || pt === 0) end = pt;
		}
	}
	if (!optional || parsedStart !== end || _forceAllPropTweens) {
		if (!isNaN(parsedStart * end) && end !== "") {
			pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
			funcParam && (pt.fp = funcParam);
			modifier && pt.modifier(modifier, this, target);
			return this._pt = pt;
		}
		!currentValue && !(prop in target) && _missingPlugin(prop, end);
		return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
	}
};
var _processVars = function _processVars(vars, index, target, targets, tween) {
	_isFunction$1(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
	if (!_isObject$1(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) return _isString$1(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
	var copy = {}, p;
	for (p in vars) copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
	return copy;
};
var _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
	var plugin, pt, ptLookup, i;
	if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
		tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
		if (tween !== _quickTween) {
			ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
			i = plugin._props.length;
			while (i--) ptLookup[plugin._props[i]] = pt;
		}
	}
	return plugin;
};
var _overwritingTween;
var _forceAllPropTweens;
var _initTween = function _initTween(tween, time, tTime) {
	var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites$1, tl = tween.timeline, reverseEase = vars.easeReverse || yoyoEase, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
	tl && (!keyframes || !ease) && (ease = "none");
	tween._ease = _parseEase(ease, _defaults$1.ease);
	tween._rEase = reverseEase && (_parseEase(reverseEase) || tween._ease);
	tween._from = !tl && !!vars.runBackwards;
	if (tween._from) tween.ratio = 1;
	if (!tl || keyframes && !vars.stagger) {
		harness = targets[0] ? _getCache(targets[0]).harness : 0;
		harnessVars = harness && vars[harness.prop];
		cleanVars = _copyExcluding(vars, _reservedProps);
		if (prevStartAt) {
			prevStartAt._zTime < 0 && prevStartAt.progress(1);
			time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
			prevStartAt._lazy = 0;
		}
		if (startAt) {
			_removeFromParent(tween._startAt = Tween.set(targets, _setDefaults$1({
				data: "isStart",
				overwrite: false,
				parent,
				immediateRender: true,
				lazy: !prevStartAt && _isNotFalse(lazy),
				startAt: null,
				delay: 0,
				onUpdate: onUpdate && function() {
					return _callback$1(tween, "onUpdate");
				},
				stagger: 0
			}, startAt)));
			tween._startAt._dp = 0;
			tween._startAt._sat = tween;
			time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
			if (immediateRender) {
				if (dur && time <= 0 && tTime <= 0) {
					time && (tween._zTime = time);
					return;
				}
			}
		} else if (runBackwards && dur) {
			if (!prevStartAt) {
				time && (immediateRender = false);
				p = _setDefaults$1({
					overwrite: false,
					data: "isFromStart",
					lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
					immediateRender,
					stagger: 0,
					parent
				}, cleanVars);
				harnessVars && (p[harness.prop] = harnessVars);
				_removeFromParent(tween._startAt = Tween.set(targets, p));
				tween._startAt._dp = 0;
				tween._startAt._sat = tween;
				time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
				tween._zTime = time;
				if (!immediateRender) _initTween(tween._startAt, _tinyNum, _tinyNum);
				else if (!time) return;
			}
		}
		tween._pt = tween._ptCache = 0;
		lazy = dur && _isNotFalse(lazy) || lazy && !dur;
		for (i = 0; i < targets.length; i++) {
			target = targets[i];
			gsData = target._gsap || _harness(targets)[i]._gsap;
			tween._ptLookup[i] = ptLookup = {};
			_lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
			index = fullTargets === targets ? i : fullTargets.indexOf(target);
			if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
				tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
				plugin._props.forEach(function(name) {
					ptLookup[name] = pt;
				});
				plugin.priority && (hasPriority = 1);
			}
			if (!harness || harnessVars) for (p in cleanVars) if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) plugin.priority && (hasPriority = 1);
			else ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
			tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
			if (autoOverwrite && tween._pt) {
				_overwritingTween = tween;
				_globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
				overwritten = !tween.parent;
				_overwritingTween = 0;
			}
			tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
		}
		hasPriority && _sortPropTweensByPriority(tween);
		tween._onInit && tween._onInit(tween);
	}
	tween._onUpdate = onUpdate;
	tween._initted = (!tween._op || tween._pt) && !overwritten;
	keyframes && time <= 0 && tl.render(_bigNum$1, true, true);
};
var _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
	var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
	if (!ptCache) {
		ptCache = tween._ptCache[property] = [];
		lookup = tween._ptLookup;
		i = tween._targets.length;
		while (i--) {
			pt = lookup[i][property];
			if (pt && pt.d && pt.d._pt) {
				pt = pt.d._pt;
				while (pt && pt.p !== property && pt.fp !== property) pt = pt._next;
			}
			if (!pt) {
				_forceAllPropTweens = 1;
				tween.vars[property] = "+=0";
				_initTween(tween, time);
				_forceAllPropTweens = 0;
				return skipRecursion ? _warn(property + " not eligible for reset. Try splitting into individual properties") : 1;
			}
			ptCache.push(pt);
		}
	}
	i = ptCache.length;
	while (i--) {
		rootPT = ptCache[i];
		pt = rootPT._pt || rootPT;
		pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
		pt.c = value - pt.s;
		rootPT.e && (rootPT.e = _round$1(value) + getUnit(rootPT.e));
		rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
	}
};
var _addAliasesToVars = function _addAliasesToVars(targets, vars) {
	var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases;
	if (!propertyAliases) return vars;
	copy = _merge({}, vars);
	for (p in propertyAliases) if (p in copy) {
		aliases = propertyAliases[p].split(",");
		i = aliases.length;
		while (i--) copy[aliases[i]] = copy[p];
	}
	return copy;
};
var _parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
	var ease = obj.ease || easeEach || "power1.inOut", p, a;
	if (_isArray(obj)) {
		a = allProps[prop] || (allProps[prop] = []);
		obj.forEach(function(value, i) {
			return a.push({
				t: i / (obj.length - 1) * 100,
				v: value,
				e: ease
			});
		});
	} else for (p in obj) {
		a = allProps[p] || (allProps[p] = []);
		p === "ease" || a.push({
			t: parseFloat(prop),
			v: obj[p],
			e: ease
		});
	}
};
var _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
	return _isFunction$1(value) ? value.call(tween, i, target, targets) : _isString$1(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
};
var _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert";
var _staggerPropsToSkip = {};
_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
	return _staggerPropsToSkip[name] = 1;
});
var Tween = /*#__PURE__*/ function(_Animation2) {
	_inheritsLoose(Tween, _Animation2);
	function Tween(targets, vars, position, skipInherit) {
		var _this3;
		if (typeof vars === "number") {
			position.duration = vars;
			vars = position;
			position = null;
		}
		_this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
		var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber$1(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
		_this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
		_this3._ptLookup = [];
		_this3._overwrite = overwrite;
		if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
			vars = _this3.vars;
			var easeReverse = vars.easeReverse || vars.yoyoEase;
			tl = _this3.timeline = new Timeline({
				data: "nested",
				defaults: defaults || {},
				targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
			});
			tl.kill();
			tl.parent = tl._dp = _assertThisInitialized(_this3);
			tl._start = 0;
			if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
				l = parsedTargets.length;
				staggerFunc = stagger && distribute(stagger);
				if (_isObject$1(stagger)) {
					for (p in stagger) if (~_staggerTweenProps.indexOf(p)) {
						staggerVarsToMerge || (staggerVarsToMerge = {});
						staggerVarsToMerge[p] = stagger[p];
					}
				}
				for (i = 0; i < l; i++) {
					copy = _copyExcluding(vars, _staggerPropsToSkip);
					copy.stagger = 0;
					easeReverse && (copy.easeReverse = easeReverse);
					staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
					curTarget = parsedTargets[i];
					copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
					copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
					if (!stagger && l === 1 && copy.delay) {
						_this3._delay = delay = copy.delay;
						_this3._start += delay;
						copy.delay = 0;
					}
					tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
					tl._ease = _easeMap.none;
				}
				tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
			} else if (keyframes) {
				_inheritDefaults(_setDefaults$1(tl.vars.defaults, { ease: "none" }));
				tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
				var time = 0, a, kf, v;
				if (_isArray(keyframes)) {
					keyframes.forEach(function(frame) {
						return tl.to(parsedTargets, frame, ">");
					});
					tl.duration();
				} else {
					copy = {};
					for (p in keyframes) p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
					for (p in copy) {
						a = copy[p].sort(function(a, b) {
							return a.t - b.t;
						});
						time = 0;
						for (i = 0; i < a.length; i++) {
							kf = a[i];
							v = {
								ease: kf.e,
								duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
							};
							v[p] = kf.v;
							tl.to(parsedTargets, v, time);
							time += v.duration;
						}
					}
					tl.duration() < duration && tl.to({}, { duration: duration - tl.duration() });
				}
			}
			duration || _this3.duration(duration = tl.duration());
		} else _this3.timeline = 0;
		if (overwrite === true && !_suppressOverwrites$1) {
			_overwritingTween = _assertThisInitialized(_this3);
			_globalTimeline.killTweensOf(parsedTargets);
			_overwritingTween = 0;
		}
		_addToTimeline(parent, _assertThisInitialized(_this3), position);
		vars.reversed && _this3.reverse();
		vars.paused && _this3.paused(true);
		if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
			_this3._tTime = -_tinyNum;
			_this3.render(Math.max(0, -delay) || 0);
		}
		scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
		return _this3;
	}
	var _proto3 = Tween.prototype;
	_proto3.render = function render(totalTime, suppressEvents, force) {
		var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline;
		if (!dur) _renderZeroDurationTween(this, totalTime, suppressEvents, force);
		else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
			time = tTime;
			timeline = this.timeline;
			if (this._repeat) {
				cycleDuration = dur + this._rDelay;
				if (this._repeat < -1 && isNegative) return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
				time = _roundPrecise(tTime % cycleDuration);
				if (tTime === tDur) {
					iteration = this._repeat;
					time = dur;
				} else {
					prevIteration = _roundPrecise(tTime / cycleDuration);
					iteration = ~~prevIteration;
					if (iteration && iteration === prevIteration) {
						time = dur;
						iteration--;
					} else if (time > dur) time = dur;
				}
				isYoyo = this._yoyo && iteration & 1;
				if (isYoyo) time = dur - time;
				prevIteration = _animationCycle(this._tTime, cycleDuration);
				if (time === prevTime && !force && this._initted && iteration === prevIteration) {
					this._tTime = tTime;
					return this;
				}
				if (iteration !== prevIteration) {
					if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
						this._lock = force = 1;
						this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
					}
				}
			}
			if (!this._initted) {
				if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
					this._tTime = 0;
					return this;
				}
				if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) return this;
				if (dur !== this._dur) return this.render(totalTime, suppressEvents, force);
			}
			if (this._rEase) {
				var inv = time < prevTime;
				if (inv !== this._inv) {
					var segDur = inv ? prevTime : dur - prevTime;
					this._inv = inv;
					if (this._from) this.ratio = 1 - this.ratio;
					this._invRatio = this.ratio;
					this._invTime = prevTime;
					this._invRecip = segDur ? (inv ? -1 : 1) / segDur : 0;
					this._invScale = inv ? -this.ratio : 1 - this.ratio;
					this._invEase = inv ? this._rEase : this._ease;
				}
				this.ratio = ratio = this._invRatio + this._invScale * this._invEase((time - this._invTime) * this._invRecip);
			} else this.ratio = ratio = this._ease(time / dur);
			if (this._from) this.ratio = ratio = 1 - ratio;
			this._tTime = tTime;
			this._time = time;
			if (!this._act && this._ts) {
				this._act = 1;
				this._lazy = 0;
			}
			if (!prevTime && tTime && !suppressEvents && !prevIteration) {
				_callback$1(this, "onStart");
				if (this._tTime !== tTime) return this;
			}
			pt = this._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
			timeline && timeline.render(totalTime < 0 ? totalTime : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
			if (this._onUpdate && !suppressEvents) {
				isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
				_callback$1(this, "onUpdate");
			}
			this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback$1(this, "onRepeat");
			if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
				isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
				(totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
				if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
					_callback$1(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
					this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
				}
			}
		}
		return this;
	};
	_proto3.targets = function targets() {
		return this._targets;
	};
	_proto3.invalidate = function invalidate(soft) {
		(!soft || !this.vars.runBackwards) && (this._startAt = 0);
		this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
		this._ptLookup = [];
		this.timeline && this.timeline.invalidate(soft);
		return _Animation2.prototype.invalidate.call(this, soft);
	};
	_proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
		_tickerActive || _ticker.wake();
		this._ts || this.play();
		var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
		this._initted || _initTween(this, time);
		ratio = this._ease(time / this._dur);
		if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) return this.resetTo(property, value, start, startIsRelative, 1);
		_alignPlayhead(this, 0);
		this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
		return this.render(0);
	};
	_proto3.kill = function kill(targets, vars) {
		if (vars === void 0) vars = "all";
		if (!targets && (!vars || vars === "all")) {
			this._lazy = this._pt = 0;
			this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting$1);
			return this;
		}
		if (this.timeline) {
			var tDur = this.timeline.totalDuration();
			this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
			this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
			return this;
		}
		var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
		if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
			vars === "all" && (this._pt = 0);
			return _interrupt(this);
		}
		overwrittenProps = this._op = this._op || [];
		if (vars !== "all") {
			if (_isString$1(vars)) {
				p = {};
				_forEachName(vars, function(name) {
					return p[name] = 1;
				});
				vars = p;
			}
			vars = _addAliasesToVars(parsedTargets, vars);
		}
		i = parsedTargets.length;
		while (i--) if (~killingTargets.indexOf(parsedTargets[i])) {
			curLookup = propTweenLookup[i];
			if (vars === "all") {
				overwrittenProps[i] = vars;
				props = curLookup;
				curOverwriteProps = {};
			} else {
				curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
				props = vars;
			}
			for (p in props) {
				pt = curLookup && curLookup[p];
				if (pt) {
					if (!("kill" in pt.d) || pt.d.kill(p) === true) _removeLinkedListItem(this, pt, "_pt");
					delete curLookup[p];
				}
				if (curOverwriteProps !== "all") curOverwriteProps[p] = 1;
			}
		}
		this._initted && !this._pt && firstPT && _interrupt(this);
		return this;
	};
	Tween.to = function to(targets, vars) {
		return new Tween(targets, vars, arguments[2]);
	};
	Tween.from = function from(targets, vars) {
		return _createTweenType(1, arguments);
	};
	Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
		return new Tween(callback, 0, {
			immediateRender: false,
			lazy: false,
			overwrite: false,
			delay,
			onComplete: callback,
			onReverseComplete: callback,
			onCompleteParams: params,
			onReverseCompleteParams: params,
			callbackScope: scope
		});
	};
	Tween.fromTo = function fromTo(targets, fromVars, toVars) {
		return _createTweenType(2, arguments);
	};
	Tween.set = function set(targets, vars) {
		vars.duration = 0;
		vars.repeatDelay || (vars.repeat = 0);
		return new Tween(targets, vars);
	};
	Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
		return _globalTimeline.killTweensOf(targets, props, onlyActive);
	};
	return Tween;
}(Animation);
_setDefaults$1(Tween.prototype, {
	_targets: [],
	_lazy: 0,
	_startAt: 0,
	_op: 0,
	_onInit: 0
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
	Tween[name] = function() {
		var tl = new Timeline(), params = _slice.call(arguments, 0);
		params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
		return tl[name].apply(tl, params);
	};
});
var _setterPlain = function _setterPlain(target, property, value) {
	return target[property] = value;
};
var _setterFunc = function _setterFunc(target, property, value) {
	return target[property](value);
};
var _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
	return target[property](data.fp, value);
};
var _setterAttribute = function _setterAttribute(target, property, value) {
	return target.setAttribute(property, value);
};
var _getSetter = function _getSetter(target, property) {
	return _isFunction$1(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
};
var _renderPlain = function _renderPlain(ratio, data) {
	return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
};
var _renderBoolean = function _renderBoolean(ratio, data) {
	return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
};
var _renderComplexString = function _renderComplexString(ratio, data) {
	var pt = data._pt, s = "";
	if (!ratio && data.b) s = data.b;
	else if (ratio === 1 && data.e) s = data.e;
	else {
		while (pt) {
			s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
			pt = pt._next;
		}
		s += data.c;
	}
	data.set(data.t, data.p, s, data);
};
var _renderPropTweens = function _renderPropTweens(ratio, data) {
	var pt = data._pt;
	while (pt) {
		pt.r(ratio, pt.d);
		pt = pt._next;
	}
};
var _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
	var pt = this._pt, next;
	while (pt) {
		next = pt._next;
		pt.p === property && pt.modifier(modifier, tween, target);
		pt = next;
	}
};
var _killPropTweensOf = function _killPropTweensOf(property) {
	var pt = this._pt, hasNonDependentRemaining, next;
	while (pt) {
		next = pt._next;
		if (pt.p === property && !pt.op || pt.op === property) _removeLinkedListItem(this, pt, "_pt");
		else if (!pt.dep) hasNonDependentRemaining = 1;
		pt = next;
	}
	return !hasNonDependentRemaining;
};
var _setterWithModifier = function _setterWithModifier(target, property, value, data) {
	data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
};
var _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
	var pt = parent._pt, next, pt2, first, last;
	while (pt) {
		next = pt._next;
		pt2 = first;
		while (pt2 && pt2.pr > pt.pr) pt2 = pt2._next;
		if (pt._prev = pt2 ? pt2._prev : last) pt._prev._next = pt;
		else first = pt;
		if (pt._next = pt2) pt2._prev = pt;
		else last = pt;
		pt = next;
	}
	parent._pt = first;
};
var PropTween = /*#__PURE__*/ function() {
	function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
		this.t = target;
		this.s = start;
		this.c = change;
		this.p = prop;
		this.r = renderer || _renderPlain;
		this.d = data || this;
		this.set = setter || _setterPlain;
		this.pr = priority || 0;
		this._next = next;
		if (next) next._prev = this;
	}
	var _proto4 = PropTween.prototype;
	_proto4.modifier = function modifier(func, tween, target) {
		this.mSet = this.mSet || this.set;
		this.set = _setterWithModifier;
		this.m = func;
		this.mt = target;
		this.tween = tween;
	};
	return PropTween;
}();
_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(name) {
	return _reservedProps[name] = 1;
});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
	sortChildren: false,
	defaults: _defaults$1,
	autoRemoveChildren: true,
	id: "root",
	smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
var _media = [];
var _listeners$1 = {};
var _emptyArray$2 = [];
var _lastMediaTime = 0;
var _contextID = 0;
var _dispatch$1 = function _dispatch(type) {
	return (_listeners$1[type] || _emptyArray$2).map(function(f) {
		return f();
	});
};
var _onMediaChange = function _onMediaChange() {
	var time = Date.now(), matches = [];
	if (time - _lastMediaTime > 2) {
		_dispatch$1("matchMediaInit");
		_media.forEach(function(c) {
			var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
			for (p in queries) {
				match = _win$3.matchMedia(queries[p]).matches;
				match && (anyMatch = 1);
				if (match !== conditions[p]) {
					conditions[p] = match;
					toggled = 1;
				}
			}
			if (toggled) {
				c.revert();
				anyMatch && matches.push(c);
			}
		});
		_dispatch$1("matchMediaRevert");
		matches.forEach(function(c) {
			return c.onMatch(c, function(func) {
				return c.add(null, func);
			});
		});
		_lastMediaTime = time;
		_dispatch$1("matchMedia");
	}
};
var Context = /*#__PURE__*/ function() {
	function Context(func, scope) {
		this.selector = scope && selector(scope);
		this.data = [];
		this._r = [];
		this.isReverted = false;
		this.id = _contextID++;
		func && this.add(func);
	}
	var _proto5 = Context.prototype;
	_proto5.add = function add(name, func, scope) {
		if (_isFunction$1(name)) {
			scope = func;
			func = name;
			name = _isFunction$1;
		}
		var self = this, f = function f() {
			var prev = _context$3, prevSelector = self.selector, result;
			prev && prev !== self && prev.data.push(self);
			scope && (self.selector = selector(scope));
			_context$3 = self;
			result = func.apply(self, arguments);
			_isFunction$1(result) && self._r.push(result);
			_context$3 = prev;
			self.selector = prevSelector;
			self.isReverted = false;
			return result;
		};
		self.last = f;
		return name === _isFunction$1 ? f(self, function(func) {
			return self.add(null, func);
		}) : name ? self[name] = f : f;
	};
	_proto5.ignore = function ignore(func) {
		var prev = _context$3;
		_context$3 = null;
		func(this);
		_context$3 = prev;
	};
	_proto5.getTweens = function getTweens() {
		var a = [];
		this.data.forEach(function(e) {
			return e instanceof Context ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
		});
		return a;
	};
	_proto5.clear = function clear() {
		this._r.length = this.data.length = 0;
	};
	_proto5.kill = function kill(revert, matchMedia) {
		var _this4 = this;
		if (revert) (function() {
			var tweens = _this4.getTweens(), i = _this4.data.length, t;
			while (i--) {
				t = _this4.data[i];
				if (t.data === "isFlip") {
					t.revert();
					t.getChildren(true, true, false).forEach(function(tween) {
						return tweens.splice(tweens.indexOf(tween), 1);
					});
				}
			}
			tweens.map(function(t) {
				return {
					g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -Infinity,
					t
				};
			}).sort(function(a, b) {
				return b.g - a.g || -Infinity;
			}).forEach(function(o) {
				return o.t.revert(revert);
			});
			i = _this4.data.length;
			while (i--) {
				t = _this4.data[i];
				if (t instanceof Timeline) {
					if (t.data !== "nested") {
						t.scrollTrigger && t.scrollTrigger.revert();
						t.kill();
					}
				} else !(t instanceof Tween) && t.revert && t.revert(revert);
			}
			_this4._r.forEach(function(f) {
				return f(revert, _this4);
			});
			_this4.isReverted = true;
		})();
		else this.data.forEach(function(e) {
			return e.kill && e.kill();
		});
		this.clear();
		if (matchMedia) {
			var i = _media.length;
			while (i--) _media[i].id === this.id && _media.splice(i, 1);
		}
	};
	_proto5.revert = function revert(config) {
		this.kill(config || {});
	};
	return Context;
}();
var MatchMedia = /*#__PURE__*/ function() {
	function MatchMedia(scope) {
		this.contexts = [];
		this.scope = scope;
		_context$3 && _context$3.data.push(this);
	}
	var _proto6 = MatchMedia.prototype;
	_proto6.add = function add(conditions, func, scope) {
		_isObject$1(conditions) || (conditions = { matches: conditions });
		var context = new Context(0, scope || this.scope), cond = context.conditions = {}, mq, p, active;
		_context$3 && !context.selector && (context.selector = _context$3.selector);
		this.contexts.push(context);
		func = context.add("onMatch", func);
		context.queries = conditions;
		for (p in conditions) if (p === "all") active = 1;
		else {
			mq = _win$3.matchMedia(conditions[p]);
			if (mq) {
				_media.indexOf(context) < 0 && _media.push(context);
				(cond[p] = mq.matches) && (active = 1);
				mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
			}
		}
		active && func(context, function(f) {
			return context.add(null, f);
		});
		return this;
	};
	_proto6.revert = function revert(config) {
		this.kill(config || {});
	};
	_proto6.kill = function kill(revert) {
		this.contexts.forEach(function(c) {
			return c.kill(revert, true);
		});
	};
	return MatchMedia;
}();
var _gsap = {
	registerPlugin: function registerPlugin() {
		for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		args.forEach(function(config) {
			return _createPlugin(config);
		});
	},
	timeline: function timeline(vars) {
		return new Timeline(vars);
	},
	getTweensOf: function getTweensOf(targets, onlyActive) {
		return _globalTimeline.getTweensOf(targets, onlyActive);
	},
	getProperty: function getProperty(target, property, unit, uncache) {
		_isString$1(target) && (target = toArray(target)[0]);
		var getter = _getCache(target || {}).get, format = unit ? _passThrough$1 : _numericIfPossible;
		unit === "native" && (unit = "");
		return !target ? target : !property ? function(property, unit, uncache) {
			return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
		} : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
	},
	quickSetter: function quickSetter(target, property, unit) {
		target = toArray(target);
		if (target.length > 1) {
			var setters = target.map(function(t) {
				return gsap$3.quickSetter(t, property, unit);
			}), l = setters.length;
			return function(value) {
				var i = l;
				while (i--) setters[i](value);
			};
		}
		target = target[0] || {};
		var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
			var p = new Plugin();
			_quickTween._pt = 0;
			p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
			p.render(1, p);
			_quickTween._pt && _renderPropTweens(1, _quickTween);
		} : cache.set(target, p);
		return Plugin ? setter : function(value) {
			return setter(target, p, unit ? value + unit : value, cache, 1);
		};
	},
	quickTo: function quickTo(target, property, vars) {
		var _setDefaults2;
		var tween = gsap$3.to(target, _setDefaults$1((_setDefaults2 = {}, _setDefaults2[property] = "+=0.1", _setDefaults2.paused = true, _setDefaults2.stagger = 0, _setDefaults2), vars || {})), func = function func(value, start, startIsRelative) {
			return tween.resetTo(property, value, start, startIsRelative);
		};
		func.tween = tween;
		return func;
	},
	isTweening: function isTweening(targets) {
		return _globalTimeline.getTweensOf(targets, true).length > 0;
	},
	defaults: function defaults(value) {
		value && value.ease && (value.ease = _parseEase(value.ease, _defaults$1.ease));
		return _mergeDeep(_defaults$1, value || {});
	},
	config: function config(value) {
		return _mergeDeep(_config, value || {});
	},
	registerEffect: function registerEffect(_ref3) {
		var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
		(plugins || "").split(",").forEach(function(pluginName) {
			return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
		});
		_effects[name] = function(targets, vars, tl) {
			return effect(toArray(targets), _setDefaults$1(vars || {}, defaults), tl);
		};
		if (extendTimeline) Timeline.prototype[name] = function(targets, vars, position) {
			return this.add(_effects[name](targets, _isObject$1(vars) ? vars : (position = vars) && {}, this), position);
		};
	},
	registerEase: function registerEase(name, ease) {
		_easeMap[name] = _parseEase(ease);
	},
	parseEase: function parseEase(ease, defaultEase) {
		return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
	},
	getById: function getById(id) {
		return _globalTimeline.getById(id);
	},
	exportRoot: function exportRoot(vars, includeDelayedCalls) {
		if (vars === void 0) vars = {};
		var tl = new Timeline(vars), child, next;
		tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
		_globalTimeline.remove(tl);
		tl._dp = 0;
		tl._time = tl._tTime = _globalTimeline._time;
		child = _globalTimeline._first;
		while (child) {
			next = child._next;
			if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) _addToTimeline(tl, child, child._start - child._delay);
			child = next;
		}
		_addToTimeline(_globalTimeline, tl, 0);
		return tl;
	},
	context: function context(func, scope) {
		return func ? new Context(func, scope) : _context$3;
	},
	matchMedia: function matchMedia(scope) {
		return new MatchMedia(scope);
	},
	matchMediaRefresh: function matchMediaRefresh() {
		return _media.forEach(function(c) {
			var cond = c.conditions, found, p;
			for (p in cond) if (cond[p]) {
				cond[p] = false;
				found = 1;
			}
			found && c.revert();
		}) || _onMediaChange();
	},
	addEventListener: function addEventListener(type, callback) {
		var a = _listeners$1[type] || (_listeners$1[type] = []);
		~a.indexOf(callback) || a.push(callback);
	},
	removeEventListener: function removeEventListener(type, callback) {
		var a = _listeners$1[type], i = a && a.indexOf(callback);
		i >= 0 && a.splice(i, 1);
	},
	utils: {
		wrap,
		wrapYoyo,
		distribute,
		random,
		snap,
		normalize,
		getUnit,
		clamp: clamp$1,
		splitColor,
		toArray,
		selector,
		mapRange,
		pipe,
		unitize,
		interpolate,
		shuffle
	},
	install: _install,
	effects: _effects,
	ticker: _ticker,
	updateRoot: Timeline.updateRoot,
	plugins: _plugins,
	globalTimeline: _globalTimeline,
	core: {
		PropTween,
		globals: _addGlobal,
		Tween,
		Timeline,
		Animation,
		getCache: _getCache,
		_removeLinkedListItem,
		reverting: function reverting() {
			return _reverting$1;
		},
		context: function context(toAdd) {
			if (toAdd && _context$3) {
				_context$3.data.push(toAdd);
				toAdd._ctx = _context$3;
			}
			return _context$3;
		},
		suppressOverwrites: function suppressOverwrites(value) {
			return _suppressOverwrites$1 = value;
		}
	}
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
	return _gsap[name] = Tween[name];
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, { duration: 0 });
var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
	var pt = plugin._pt;
	while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) pt = pt._next;
	return pt;
};
var _addModifiers = function _addModifiers(tween, modifiers) {
	var targets = tween._targets, p, i, pt;
	for (p in modifiers) {
		i = targets.length;
		while (i--) {
			pt = tween._ptLookup[i][p];
			if (pt && (pt = pt.d)) {
				if (pt._pt) pt = _getPluginPropTween(pt, p);
				pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
			}
		}
	}
};
var _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
	return {
		name,
		headless: 1,
		rawVars: 1,
		init: function init(target, vars, tween) {
			tween._onInit = function(tween) {
				var temp, p;
				if (_isString$1(vars)) {
					temp = {};
					_forEachName(vars, function(name) {
						return temp[name] = 1;
					});
					vars = temp;
				}
				if (modifier) {
					temp = {};
					for (p in vars) temp[p] = modifier(vars[p]);
					vars = temp;
				}
				_addModifiers(tween, vars);
			};
		}
	};
};
var gsap$3 = _gsap.registerPlugin({
	name: "attr",
	init: function init(target, vars, tween, index, targets) {
		var p, pt, v;
		this.tween = tween;
		for (p in vars) {
			v = target.getAttribute(p) || "";
			pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
			pt.op = p;
			pt.b = v;
			this._props.push(p);
		}
	},
	render: function render(ratio, data) {
		var pt = data._pt;
		while (pt) {
			_reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
			pt = pt._next;
		}
	}
}, {
	name: "endArray",
	headless: 1,
	init: function init(target, value) {
		var i = value.length;
		while (i--) this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
	}
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
Tween.version = Timeline.version = gsap$3.version = "3.15.0";
_coreReady = 1;
_windowExists$2() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
//#endregion
//#region node_modules/gsap/CSSPlugin.js
/*!
* CSSPlugin 3.15.0
* https://gsap.com
*
* Copyright 2008-2026, GreenSock. All rights reserved.
* Subject to the terms at https://gsap.com/standard-license
* @author: Jack Doyle, jack@greensock.com
*/
var _win$2;
var _doc$2;
var _docElement;
var _pluginInitted;
var _tempDiv;
var _recentSetterPlugin;
var _reverting;
var _windowExists$1 = function _windowExists() {
	return typeof window !== "undefined";
};
var _transformProps = {};
var _RAD2DEG = 180 / Math.PI;
var _DEG2RAD = Math.PI / 180;
var _atan2 = Math.atan2;
var _bigNum = 1e8;
var _capsExp$1 = /([A-Z])/g;
var _horizontalExp = /(left|right|width|margin|padding|x)/i;
var _complexExp = /[\s,\(]\S/;
var _propertyAliases = {
	autoAlpha: "opacity,visibility",
	scale: "scaleX,scaleY",
	alpha: "opacity"
};
var _renderCSSProp = function _renderCSSProp(ratio, data) {
	return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
};
var _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
	return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
};
var _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
	return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
};
var _renderCSSPropWithBeginningAndEnd = function _renderCSSPropWithBeginningAndEnd(ratio, data) {
	return data.set(data.t, data.p, ratio === 1 ? data.e : ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
};
var _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
	var value = data.s + data.c * ratio;
	data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
};
var _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
	return data.set(data.t, data.p, ratio ? data.e : data.b, data);
};
var _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
	return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
};
var _setterCSSStyle = function _setterCSSStyle(target, property, value) {
	return target.style[property] = value;
};
var _setterCSSProp = function _setterCSSProp(target, property, value) {
	return target.style.setProperty(property, value);
};
var _setterTransform = function _setterTransform(target, property, value) {
	return target._gsap[property] = value;
};
var _setterScale = function _setterScale(target, property, value) {
	return target._gsap.scaleX = target._gsap.scaleY = value;
};
var _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
	var cache = target._gsap;
	cache.scaleX = cache.scaleY = value;
	cache.renderTransform(ratio, cache);
};
var _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
	var cache = target._gsap;
	cache[property] = value;
	cache.renderTransform(ratio, cache);
};
var _transformProp$1 = "transform";
var _transformOriginProp = _transformProp$1 + "Origin";
var _saveStyle = function _saveStyle(property, isNotCSS) {
	var _this = this;
	var target = this.target, style = target.style, cache = target._gsap;
	if (property in _transformProps && style) {
		this.tfm = this.tfm || {};
		if (property !== "transform") {
			property = _propertyAliases[property] || property;
			~property.indexOf(",") ? property.split(",").forEach(function(a) {
				return _this.tfm[a] = _get(target, a);
			}) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
			property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
		} else return _propertyAliases.transform.split(",").forEach(function(p) {
			return _saveStyle.call(_this, p, isNotCSS);
		});
		if (this.props.indexOf(_transformProp$1) >= 0) return;
		if (cache.svg) {
			this.svgo = target.getAttribute("data-svg-origin");
			this.props.push(_transformOriginProp, isNotCSS, "");
		}
		property = _transformProp$1;
	}
	(style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
};
var _removeIndependentTransforms = function _removeIndependentTransforms(style) {
	if (style.translate) {
		style.removeProperty("translate");
		style.removeProperty("scale");
		style.removeProperty("rotate");
	}
};
var _revertStyle = function _revertStyle() {
	var props = this.props, target = this.target, style = target.style, cache = target._gsap, i = 0, p;
	for (; i < props.length; i += 3) if (!props[i + 1]) props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp$1, "-$1").toLowerCase());
	else if (props[i + 1] === 2) target[props[i]](props[i + 2]);
	else target[props[i]] = props[i + 2];
	if (this.tfm) {
		for (p in this.tfm) cache[p] = this.tfm[p];
		if (cache.svg) {
			cache.renderTransform();
			target.setAttribute("data-svg-origin", this.svgo || "");
		}
		i = _reverting();
		if ((!i || !i.isStart) && !style[_transformProp$1]) {
			_removeIndependentTransforms(style);
			if (cache.zOrigin && style[_transformOriginProp]) {
				style[_transformOriginProp] += " " + cache.zOrigin + "px";
				cache.zOrigin = 0;
				cache.renderTransform();
			}
			cache.uncache = 1;
		}
	}
};
var _getStyleSaver = function _getStyleSaver(target, properties) {
	var saver = {
		target,
		props: [],
		revert: _revertStyle,
		save: _saveStyle
	};
	target._gsap || gsap$3.core.getCache(target);
	properties && target.style && target.nodeType && properties.split(",").forEach(function(p) {
		return saver.save(p);
	});
	return saver;
};
var _supports3D;
var _createElement = function _createElement(type, ns) {
	var e = _doc$2.createElementNS ? _doc$2.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$2.createElement(type);
	return e && e.style ? e : _doc$2.createElement(type);
};
var _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
	var cs = getComputedStyle(target);
	return cs[property] || cs.getPropertyValue(property.replace(_capsExp$1, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
};
var _prefixes = "O,Moz,ms,Ms,Webkit".split(",");
var _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
	var s = (element || _tempDiv).style, i = 5;
	if (property in s && !preferPrefix) return property;
	property = property.charAt(0).toUpperCase() + property.substr(1);
	while (i-- && !(_prefixes[i] + property in s));
	return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
};
var _initCore$1 = function _initCore() {
	if (_windowExists$1() && window.document) {
		_win$2 = window;
		_doc$2 = _win$2.document;
		_docElement = _doc$2.documentElement;
		_tempDiv = _createElement("div") || { style: {} };
		_createElement("div");
		_transformProp$1 = _checkPropPrefix(_transformProp$1);
		_transformOriginProp = _transformProp$1 + "Origin";
		_tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
		_supports3D = !!_checkPropPrefix("perspective");
		_reverting = gsap$3.core.reverting;
		_pluginInitted = 1;
	}
};
var _getReparentedCloneBBox = function _getReparentedCloneBBox(target) {
	var owner = target.ownerSVGElement, svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone = target.cloneNode(true), bbox;
	clone.style.display = "block";
	svg.appendChild(clone);
	_docElement.appendChild(svg);
	try {
		bbox = clone.getBBox();
	} catch (e) {}
	svg.removeChild(clone);
	_docElement.removeChild(svg);
	return bbox;
};
var _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
	var i = attributesArray.length;
	while (i--) if (target.hasAttribute(attributesArray[i])) return target.getAttribute(attributesArray[i]);
};
var _getBBox = function _getBBox(target) {
	var bounds, cloned;
	try {
		bounds = target.getBBox();
	} catch (error) {
		bounds = _getReparentedCloneBBox(target);
		cloned = 1;
	}
	bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
	return bounds && !bounds.width && !bounds.x && !bounds.y ? {
		x: +_getAttributeFallbacks(target, [
			"x",
			"cx",
			"x1"
		]) || 0,
		y: +_getAttributeFallbacks(target, [
			"y",
			"cy",
			"y1"
		]) || 0,
		width: 0,
		height: 0
	} : bounds;
};
var _isSVG = function _isSVG(e) {
	return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
};
var _removeProperty = function _removeProperty(target, property) {
	if (property) {
		var style = target.style, first2Chars;
		if (property in _transformProps && property !== _transformOriginProp) property = _transformProp$1;
		if (style.removeProperty) {
			first2Chars = property.substr(0, 2);
			if (first2Chars === "ms" || property.substr(0, 6) === "webkit") property = "-" + property;
			style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp$1, "-$1").toLowerCase());
		} else style.removeAttribute(property);
	}
};
var _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
	var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
	plugin._pt = pt;
	pt.b = beginning;
	pt.e = end;
	plugin._props.push(property);
	return pt;
};
var _nonConvertibleUnits = {
	deg: 1,
	rad: 1,
	turn: 1
};
var _nonStandardLayouts = {
	grid: 1,
	flex: 1
};
var _convertToUnit = function _convertToUnit(target, property, value, unit) {
	var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
	if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) return curValue;
	curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
	isSVG = target.getCTM && _isSVG(target);
	if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
		px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
		return _round$1(toPercent ? curValue / px * amount : curValue / 100 * px);
	}
	style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
	parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
	if (isSVG) parent = (target.ownerSVGElement || {}).parentNode;
	if (!parent || parent === _doc$2 || !parent.appendChild) parent = _doc$2.body;
	cache = parent._gsap;
	if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) return _round$1(curValue / cache.width * amount);
	else {
		if (toPercent && (property === "height" || property === "width")) {
			var v = target.style[property];
			target.style[property] = amount + unit;
			px = target[measureProperty];
			v ? target.style[property] = v : _removeProperty(target, property);
		} else {
			(toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
			parent === target && (style.position = "static");
			parent.appendChild(_tempDiv);
			px = _tempDiv[measureProperty];
			parent.removeChild(_tempDiv);
			style.position = "absolute";
		}
		if (horizontal && toPercent) {
			cache = _getCache(parent);
			cache.time = _ticker.time;
			cache.width = parent[measureProperty];
		}
	}
	return _round$1(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
};
var _get = function _get(target, property, unit, uncache) {
	var value;
	_pluginInitted || _initCore$1();
	if (property in _propertyAliases && property !== "transform") {
		property = _propertyAliases[property];
		if (~property.indexOf(",")) property = property.split(",")[0];
	}
	if (_transformProps[property] && property !== "transform") {
		value = _parseTransform(target, uncache);
		value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
	} else {
		value = target.style[property];
		if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
	}
	return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
};
var _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
	if (!start || start === "none") {
		var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
		if (s && s !== start) {
			prop = p;
			start = s;
		} else if (prop === "borderColor") start = _getComputedProperty(target, "borderTopColor");
	}
	var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
	pt.b = start;
	pt.e = end;
	start += "";
	end += "";
	if (end.substring(0, 6) === "var(--") end = _getComputedProperty(target, end.substring(4, end.indexOf(")")));
	if (end === "auto") {
		startValue = target.style[prop];
		target.style[prop] = end;
		end = _getComputedProperty(target, prop) || end;
		startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
	}
	a = [start, end];
	_colorStringFilter(a);
	start = a[0];
	end = a[1];
	startValues = start.match(_numWithUnitExp) || [];
	endValues = end.match(_numWithUnitExp) || [];
	if (endValues.length) {
		while (result = _numWithUnitExp.exec(end)) {
			endValue = result[0];
			chunk = end.substring(index, result.index);
			if (color) color = (color + 1) % 5;
			else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") color = 1;
			if (endValue !== (startValue = startValues[matchIndex++] || "")) {
				startNum = parseFloat(startValue) || 0;
				startUnit = startValue.substr((startNum + "").length);
				endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
				endNum = parseFloat(endValue);
				endUnit = endValue.substr((endNum + "").length);
				index = _numWithUnitExp.lastIndex - endUnit.length;
				if (!endUnit) {
					endUnit = endUnit || _config.units[prop] || startUnit;
					if (index === end.length) {
						end += endUnit;
						pt.e += endUnit;
					}
				}
				if (startUnit !== endUnit) startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
				pt._pt = {
					_next: pt._pt,
					p: chunk || matchIndex === 1 ? chunk : ",",
					s: startNum,
					c: endNum - startNum,
					m: color && color < 4 || prop === "zIndex" ? Math.round : 0
				};
			}
		}
		pt.c = index < end.length ? end.substring(index, end.length) : "";
	} else pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
	_relExp.test(end) && (pt.e = 0);
	this._pt = pt;
	return pt;
};
var _keywordToPercent = {
	top: "0%",
	bottom: "100%",
	left: "0%",
	right: "100%",
	center: "50%"
};
var _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
	var split = value.split(" "), x = split[0], y = split[1] || "50%";
	if (x === "top" || x === "bottom" || y === "left" || y === "right") {
		value = x;
		x = y;
		y = value;
	}
	split[0] = _keywordToPercent[x] || x;
	split[1] = _keywordToPercent[y] || y;
	return split.join(" ");
};
var _renderClearProps = function _renderClearProps(ratio, data) {
	if (data.tween && data.tween._time === data.tween._dur) {
		var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i;
		if (props === "all" || props === true) {
			style.cssText = "";
			clearTransforms = 1;
		} else {
			props = props.split(",");
			i = props.length;
			while (--i > -1) {
				prop = props[i];
				if (_transformProps[prop]) {
					clearTransforms = 1;
					prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp$1;
				}
				_removeProperty(target, prop);
			}
		}
		if (clearTransforms) {
			_removeProperty(target, _transformProp$1);
			if (cache) {
				cache.svg && target.removeAttribute("transform");
				style.scale = style.rotate = style.translate = "none";
				_parseTransform(target, 1);
				cache.uncache = 1;
				_removeIndependentTransforms(style);
			}
		}
	}
};
var _specialProps = { clearProps: function clearProps(plugin, target, property, endValue, tween) {
	if (tween.data !== "isFromStart") {
		var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
		pt.u = endValue;
		pt.pr = -10;
		pt.tween = tween;
		plugin._props.push(property);
		return 1;
	}
} };
var _identity2DMatrix = [
	1,
	0,
	0,
	1,
	0,
	0
];
var _rotationalProperties = {};
var _isNullTransform = function _isNullTransform(value) {
	return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
};
var _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
	var matrixString = _getComputedProperty(target, _transformProp$1);
	return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round$1);
};
var _getMatrix = function _getMatrix(target, force2D) {
	var cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
	if (cache.svg && target.getAttribute("transform")) {
		temp = target.transform.baseVal.consolidate().matrix;
		matrix = [
			temp.a,
			temp.b,
			temp.c,
			temp.d,
			temp.e,
			temp.f
		];
		return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
	} else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
		temp = style.display;
		style.display = "block";
		parent = target.parentNode;
		if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
			addedToDOM = 1;
			nextSibling = target.nextElementSibling;
			_docElement.appendChild(target);
		}
		matrix = _getComputedTransformMatrixAsArray(target);
		temp ? style.display = temp : _removeProperty(target, "display");
		if (addedToDOM) nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
	}
	return force2D && matrix.length > 6 ? [
		matrix[0],
		matrix[1],
		matrix[4],
		matrix[5],
		matrix[12],
		matrix[13]
	] : matrix;
};
var _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
	var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
	if (!originIsAbsolute) {
		bounds = _getBBox(target);
		xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
		yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
	} else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
		x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
		y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
		xOrigin = x;
		yOrigin = y;
	}
	if (smooth || smooth !== false && cache.smooth) {
		tx = xOrigin - xOriginOld;
		ty = yOrigin - yOriginOld;
		cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
		cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
	} else cache.xOffset = cache.yOffset = 0;
	cache.xOrigin = xOrigin;
	cache.yOrigin = yOrigin;
	cache.smooth = !!smooth;
	cache.origin = origin;
	cache.originIsAbsolute = !!originIsAbsolute;
	target.style[_transformOriginProp] = "0px 0px";
	if (pluginToAddPropTweensTo) {
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
	}
	target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
};
var _parseTransform = function _parseTransform(target, uncache) {
	var cache = target._gsap || new GSCache(target);
	if ("x" in cache && !uncache && !cache.uncache) return cache;
	var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0, y, z, scaleX = scaleY = 1, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
	cache.svg = !!(target.getCTM && _isSVG(target));
	if (cs.translate) {
		if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") style[_transformProp$1] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp$1] !== "none" ? cs[_transformProp$1] : "");
		style.scale = style.rotate = style.translate = "none";
	}
	matrix = _getMatrix(target, cache.svg);
	if (cache.svg) {
		if (cache.uncache) {
			t2 = target.getBBox();
			origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
			t1 = "";
		} else t1 = !uncache && target.getAttribute("data-svg-origin");
		_applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
	}
	xOrigin = cache.xOrigin || 0;
	yOrigin = cache.yOrigin || 0;
	if (matrix !== _identity2DMatrix) {
		a = matrix[0];
		b = matrix[1];
		c = matrix[2];
		d = matrix[3];
		x = a12 = matrix[4];
		y = a22 = matrix[5];
		if (matrix.length === 6) {
			scaleX = Math.sqrt(a * a + b * b);
			scaleY = Math.sqrt(d * d + c * c);
			rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
			skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
			skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
			if (cache.svg) {
				x -= xOrigin - (xOrigin * a + yOrigin * c);
				y -= yOrigin - (xOrigin * b + yOrigin * d);
			}
		} else {
			a32 = matrix[6];
			a42 = matrix[7];
			a13 = matrix[8];
			a23 = matrix[9];
			a33 = matrix[10];
			a43 = matrix[11];
			x = matrix[12];
			y = matrix[13];
			z = matrix[14];
			angle = _atan2(a32, a33);
			rotationX = angle * _RAD2DEG;
			if (angle) {
				cos = Math.cos(-angle);
				sin = Math.sin(-angle);
				t1 = a12 * cos + a13 * sin;
				t2 = a22 * cos + a23 * sin;
				t3 = a32 * cos + a33 * sin;
				a13 = a12 * -sin + a13 * cos;
				a23 = a22 * -sin + a23 * cos;
				a33 = a32 * -sin + a33 * cos;
				a43 = a42 * -sin + a43 * cos;
				a12 = t1;
				a22 = t2;
				a32 = t3;
			}
			angle = _atan2(-c, a33);
			rotationY = angle * _RAD2DEG;
			if (angle) {
				cos = Math.cos(-angle);
				sin = Math.sin(-angle);
				t1 = a * cos - a13 * sin;
				t2 = b * cos - a23 * sin;
				t3 = c * cos - a33 * sin;
				a43 = d * sin + a43 * cos;
				a = t1;
				b = t2;
				c = t3;
			}
			angle = _atan2(b, a);
			rotation = angle * _RAD2DEG;
			if (angle) {
				cos = Math.cos(angle);
				sin = Math.sin(angle);
				t1 = a * cos + b * sin;
				t2 = a12 * cos + a22 * sin;
				b = b * cos - a * sin;
				a22 = a22 * cos - a12 * sin;
				a = t1;
				a12 = t2;
			}
			if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
				rotationX = rotation = 0;
				rotationY = 180 - rotationY;
			}
			scaleX = _round$1(Math.sqrt(a * a + b * b + c * c));
			scaleY = _round$1(Math.sqrt(a22 * a22 + a32 * a32));
			angle = _atan2(a12, a22);
			skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
			perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
		}
		if (cache.svg) {
			t1 = target.getAttribute("transform");
			cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp$1));
			t1 && target.setAttribute("transform", t1);
		}
	}
	if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
		if (invertedScaleX) {
			scaleX *= -1;
			skewX += rotation <= 0 ? 180 : -180;
			rotation += rotation <= 0 ? 180 : -180;
		} else {
			scaleY *= -1;
			skewX += skewX <= 0 ? 180 : -180;
		}
	}
	uncache = uncache || cache.uncache;
	cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
	cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
	cache.z = z + px;
	cache.scaleX = _round$1(scaleX);
	cache.scaleY = _round$1(scaleY);
	cache.rotation = _round$1(rotation) + deg;
	cache.rotationX = _round$1(rotationX) + deg;
	cache.rotationY = _round$1(rotationY) + deg;
	cache.skewX = skewX + deg;
	cache.skewY = skewY + deg;
	cache.transformPerspective = perspective + px;
	if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) style[_transformOriginProp] = _firstTwoOnly(origin);
	cache.xOffset = cache.yOffset = 0;
	cache.force3D = _config.force3D;
	cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
	cache.uncache = 0;
	return cache;
};
var _firstTwoOnly = function _firstTwoOnly(value) {
	return (value = value.split(" "))[0] + " " + value[1];
};
var _addPxTranslate = function _addPxTranslate(target, start, value) {
	var unit = getUnit(start);
	return _round$1(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
};
var _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
	cache.z = "0px";
	cache.rotationY = cache.rotationX = "0deg";
	cache.force3D = 0;
	_renderCSSTransforms(ratio, cache);
};
var _zeroDeg = "0deg";
var _zeroPx = "0px";
var _endParenthesis = ") ";
var _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
	var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
	if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
		var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
		angle = parseFloat(rotationX) * _DEG2RAD;
		cos = Math.cos(angle);
		x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
		y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
		z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
	}
	if (transformPerspective !== _zeroPx) transforms += "perspective(" + transformPerspective + _endParenthesis;
	if (xPercent || yPercent) transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
	if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
	if (rotation !== _zeroDeg) transforms += "rotate(" + rotation + _endParenthesis;
	if (rotationY !== _zeroDeg) transforms += "rotateY(" + rotationY + _endParenthesis;
	if (rotationX !== _zeroDeg) transforms += "rotateX(" + rotationX + _endParenthesis;
	if (skewX !== _zeroDeg || skewY !== _zeroDeg) transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
	if (scaleX !== 1 || scaleY !== 1) transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
	target.style[_transformProp$1] = transforms || "translate(0, 0)";
};
var _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
	var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
	rotation = parseFloat(rotation);
	skewX = parseFloat(skewX);
	skewY = parseFloat(skewY);
	if (skewY) {
		skewY = parseFloat(skewY);
		skewX += skewY;
		rotation += skewY;
	}
	if (rotation || skewX) {
		rotation *= _DEG2RAD;
		skewX *= _DEG2RAD;
		a11 = Math.cos(rotation) * scaleX;
		a21 = Math.sin(rotation) * scaleX;
		a12 = Math.sin(rotation - skewX) * -scaleY;
		a22 = Math.cos(rotation - skewX) * scaleY;
		if (skewX) {
			skewY *= _DEG2RAD;
			temp = Math.tan(skewX - skewY);
			temp = Math.sqrt(1 + temp * temp);
			a12 *= temp;
			a22 *= temp;
			if (skewY) {
				temp = Math.tan(skewY);
				temp = Math.sqrt(1 + temp * temp);
				a11 *= temp;
				a21 *= temp;
			}
		}
		a11 = _round$1(a11);
		a21 = _round$1(a21);
		a12 = _round$1(a12);
		a22 = _round$1(a22);
	} else {
		a11 = scaleX;
		a22 = scaleY;
		a21 = a12 = 0;
	}
	if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
		tx = _convertToUnit(target, "x", x, "px");
		ty = _convertToUnit(target, "y", y, "px");
	}
	if (xOrigin || yOrigin || xOffset || yOffset) {
		tx = _round$1(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
		ty = _round$1(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
	}
	if (xPercent || yPercent) {
		temp = target.getBBox();
		tx = _round$1(tx + xPercent / 100 * temp.width);
		ty = _round$1(ty + yPercent / 100 * temp.height);
	}
	temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
	target.setAttribute("transform", temp);
	forceCSS && (target.style[_transformProp$1] = temp);
};
var _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
	var cap = 360, isString = _isString$1(endValue), change = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1) - startNum, finalValue = startNum + change + "deg", direction, pt;
	if (isString) {
		direction = endValue.split("_")[1];
		if (direction === "short") {
			change %= cap;
			if (change !== change % (cap / 2)) change += change < 0 ? cap : -cap;
		}
		if (direction === "cw" && change < 0) change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
		else if (direction === "ccw" && change > 0) change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
	}
	plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
	pt.e = finalValue;
	pt.u = "deg";
	plugin._props.push(property);
	return pt;
};
var _assign = function _assign(target, source) {
	for (var p in source) target[p] = source[p];
	return target;
};
var _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
	var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
	if (startCache.svg) {
		startValue = target.getAttribute("transform");
		target.setAttribute("transform", "");
		style[_transformProp$1] = transforms;
		endCache = _parseTransform(target, 1);
		_removeProperty(target, _transformProp$1);
		target.setAttribute("transform", startValue);
	} else {
		startValue = getComputedStyle(target)[_transformProp$1];
		style[_transformProp$1] = transforms;
		endCache = _parseTransform(target, 1);
		style[_transformProp$1] = startValue;
	}
	for (p in _transformProps) {
		startValue = startCache[p];
		endValue = endCache[p];
		if (startValue !== endValue && exclude.indexOf(p) < 0) {
			startUnit = getUnit(startValue);
			endUnit = getUnit(endValue);
			startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
			endNum = parseFloat(endValue);
			plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
			plugin._pt.u = endUnit || 0;
			plugin._props.push(p);
		}
	}
	_assign(endCache, startCache);
};
_forEachName("padding,margin,Width,Radius", function(name, index) {
	var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [
		t,
		r,
		b,
		l
	] : [
		t + l,
		t + r,
		b + r,
		b + l
	]).map(function(side) {
		return index < 2 ? name + side : "border" + side + name;
	});
	_specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
		var a, vars;
		if (arguments.length < 4) {
			a = props.map(function(prop) {
				return _get(plugin, prop, property);
			});
			vars = a.join(" ");
			return vars.split(a[0]).length === 5 ? a[0] : vars;
		}
		a = (endValue + "").split(" ");
		vars = {};
		props.forEach(function(prop, i) {
			return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
		});
		plugin.init(target, vars, tween);
	};
});
var CSSPlugin = {
	name: "css",
	register: _initCore$1,
	targetTest: function targetTest(target) {
		return target.style && target.nodeType;
	},
	init: function init(target, vars, tween, index, targets) {
		var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps, finalTransformValue;
		_pluginInitted || _initCore$1();
		this.styles = this.styles || _getStyleSaver(target);
		inlineProps = this.styles.props;
		this.tween = tween;
		for (p in vars) {
			if (p === "autoRound") continue;
			endValue = vars[p];
			if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) continue;
			type = typeof endValue;
			specialProp = _specialProps[p];
			if (type === "function") {
				endValue = endValue.call(tween, index, target, targets);
				type = typeof endValue;
			}
			if (type === "string" && ~endValue.indexOf("random(")) endValue = _replaceRandom(endValue);
			if (specialProp) specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
			else if (p.substr(0, 2) === "--") {
				startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
				endValue += "";
				_colorExp.lastIndex = 0;
				if (!_colorExp.test(startValue)) {
					startUnit = getUnit(startValue);
					endUnit = getUnit(endValue);
					endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
				}
				this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
				props.push(p);
				inlineProps.push(p, 0, style[p]);
			} else if (type !== "undefined") {
				if (startAt && p in startAt) {
					startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
					_isString$1(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
					getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
					(startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
				} else startValue = _get(target, p);
				startNum = parseFloat(startValue);
				relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
				relative && (endValue = endValue.substr(2));
				endNum = parseFloat(endValue);
				if (p in _propertyAliases) {
					if (p === "autoAlpha") {
						if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) startNum = 0;
						inlineProps.push("visibility", 0, style.visibility);
						_addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
					}
					if (p !== "scale" && p !== "transform") {
						p = _propertyAliases[p];
						~p.indexOf(",") && (p = p.split(",")[0]);
					}
				}
				isTransformRelated = p in _transformProps;
				if (isTransformRelated) {
					this.styles.save(p);
					finalTransformValue = endValue;
					if (type === "string" && endValue.substring(0, 6) === "var(--") {
						endValue = _getComputedProperty(target, endValue.substring(4, endValue.indexOf(")")));
						if (endValue.substring(0, 5) === "calc(") {
							var origPerspective = target.style.perspective;
							target.style.perspective = endValue;
							endValue = _getComputedProperty(target, "perspective");
							origPerspective ? target.style.perspective = origPerspective : _removeProperty(target, "perspective");
						}
						endNum = parseFloat(endValue);
					}
					if (!transformPropTween) {
						cache = target._gsap;
						cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
						smooth = vars.smoothOrigin !== false && cache.smooth;
						transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp$1, 0, 1, cache.renderTransform, cache, 0, -1);
						transformPropTween.dep = 1;
					}
					if (p === "scale") {
						this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
						this._pt.u = 0;
						props.push("scaleY", p);
						p += "X";
					} else if (p === "transformOrigin") {
						inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
						endValue = _convertKeywordsToPercentages(endValue);
						if (cache.svg) _applySVGOrigin(target, endValue, 0, smooth, 0, this);
						else {
							endUnit = parseFloat(endValue.split(" ")[2]) || 0;
							endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
							_addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
						}
						continue;
					} else if (p === "svgOrigin") {
						_applySVGOrigin(target, endValue, 1, smooth, 0, this);
						continue;
					} else if (p in _rotationalProperties) {
						_addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
						continue;
					} else if (p === "smoothOrigin") {
						_addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
						continue;
					} else if (p === "force3D") {
						cache[p] = endValue;
						continue;
					} else if (p === "transform") {
						_addRawTransformPTs(this, endValue, target);
						continue;
					}
				} else if (!(p in style)) p = _checkPropPrefix(p) || p;
				if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
					startUnit = (startValue + "").substr((startNum + "").length);
					endNum || (endNum = 0);
					endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
					startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
					this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
					this._pt.u = endUnit || 0;
					if (isTransformRelated && finalTransformValue !== endValue) {
						this._pt.b = startValue;
						this._pt.e = finalTransformValue;
						this._pt.r = _renderCSSPropWithBeginningAndEnd;
					} else if (startUnit !== endUnit && endUnit !== "%") {
						this._pt.b = startValue;
						this._pt.r = _renderCSSPropWithBeginning;
					}
				} else if (!(p in style)) {
					if (p in target) this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
					else if (p !== "parseTransform") {
						_missingPlugin(p, endValue);
						continue;
					}
				} else _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
				isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
				props.push(p);
			}
		}
		hasPriority && _sortPropTweensByPriority(this);
	},
	render: function render(ratio, data) {
		if (data.tween._time || !_reverting()) {
			var pt = data._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
		} else data.styles.revert();
	},
	get: _get,
	aliases: _propertyAliases,
	getSetter: function getSetter(target, property, plugin) {
		var p = _propertyAliases[property];
		p && p.indexOf(",") < 0 && (property = p);
		return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
	},
	core: {
		_removeProperty,
		_getMatrix
	}
};
gsap$3.utils.checkPrefix = _checkPropPrefix;
gsap$3.core.getStyleSaver = _getStyleSaver;
(function(positionAndScale, rotation, others, aliases) {
	var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
		_transformProps[name] = 1;
	});
	_forEachName(rotation, function(name) {
		_config.units[name] = "deg";
		_rotationalProperties[name] = 1;
	});
	_propertyAliases[all[13]] = positionAndScale + "," + rotation;
	_forEachName(aliases, function(name) {
		var split = name.split(":");
		_propertyAliases[split[1]] = all[split[0]];
	});
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
_forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
	_config.units[name] = "px";
});
gsap$3.registerPlugin(CSSPlugin);
//#endregion
//#region node_modules/gsap/index.js
var gsapWithCSS = gsap$3.registerPlugin(CSSPlugin) || gsap$3;
gsapWithCSS.core.Tween;
//#endregion
//#region node_modules/gsap/Observer.js
function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}
function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}
/*!
* Observer 3.15.0
* https://gsap.com
*
* @license Copyright 2008-2026, GreenSock. All rights reserved.
* Subject to the terms at https://gsap.com/standard-license
* @author: Jack Doyle, jack@greensock.com
*/
var gsap$2;
var _coreInitted$2;
var _win$1;
var _doc$1;
var _docEl$1;
var _body$1;
var _isTouch;
var _pointerType;
var ScrollTrigger$1;
var _root$1;
var _normalizer$1;
var _eventTypes;
var _context$2;
var _getGSAP$1 = function _getGSAP() {
	return gsap$2 || typeof window !== "undefined" && (gsap$2 = window.gsap) && gsap$2.registerPlugin && gsap$2;
};
var _startup$1 = 1;
var _observers = [];
var _scrollers = [];
var _proxies = [];
var _getTime$1 = Date.now;
var _bridge = function _bridge(name, value) {
	return value;
};
var _integrate = function _integrate() {
	var core = ScrollTrigger$1.core, data = core.bridge || {}, scrollers = core._scrollers, proxies = core._proxies;
	scrollers.push.apply(scrollers, _scrollers);
	proxies.push.apply(proxies, _proxies);
	_scrollers = scrollers;
	_proxies = proxies;
	_bridge = function _bridge(name, value) {
		return data[name](value);
	};
};
var _getProxyProp = function _getProxyProp(element, property) {
	return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
};
var _isViewport$1 = function _isViewport(el) {
	return !!~_root$1.indexOf(el);
};
var _addListener$1 = function _addListener(element, type, func, passive, capture) {
	return element.addEventListener(type, func, {
		passive: passive !== false,
		capture: !!capture
	});
};
var _removeListener$1 = function _removeListener(element, type, func, capture) {
	return element.removeEventListener(type, func, !!capture);
};
var _scrollLeft = "scrollLeft";
var _scrollTop = "scrollTop";
var _onScroll$1 = function _onScroll() {
	return _normalizer$1 && _normalizer$1.isPressed || _scrollers.cache++;
};
var _scrollCacheFunc = function _scrollCacheFunc(f, doNotCache) {
	var cachingFunc = function cachingFunc(value) {
		if (value || value === 0) {
			_startup$1 && (_win$1.history.scrollRestoration = "manual");
			var isNormalizing = _normalizer$1 && _normalizer$1.isPressed;
			value = cachingFunc.v = Math.round(value) || (_normalizer$1 && _normalizer$1.iOS ? 1 : 0);
			f(value);
			cachingFunc.cacheID = _scrollers.cache;
			isNormalizing && _bridge("ss", value);
		} else if (doNotCache || _scrollers.cache !== cachingFunc.cacheID || _bridge("ref")) {
			cachingFunc.cacheID = _scrollers.cache;
			cachingFunc.v = f();
		}
		return cachingFunc.v + cachingFunc.offset;
	};
	cachingFunc.offset = 0;
	return f && cachingFunc;
};
var _horizontal = {
	s: _scrollLeft,
	p: "left",
	p2: "Left",
	os: "right",
	os2: "Right",
	d: "width",
	d2: "Width",
	a: "x",
	sc: _scrollCacheFunc(function(value) {
		return arguments.length ? _win$1.scrollTo(value, _vertical.sc()) : _win$1.pageXOffset || _doc$1[_scrollLeft] || _docEl$1[_scrollLeft] || _body$1[_scrollLeft] || 0;
	})
};
var _vertical = {
	s: _scrollTop,
	p: "top",
	p2: "Top",
	os: "bottom",
	os2: "Bottom",
	d: "height",
	d2: "Height",
	a: "y",
	op: _horizontal,
	sc: _scrollCacheFunc(function(value) {
		return arguments.length ? _win$1.scrollTo(_horizontal.sc(), value) : _win$1.pageYOffset || _doc$1[_scrollTop] || _docEl$1[_scrollTop] || _body$1[_scrollTop] || 0;
	})
};
var _getTarget = function _getTarget(t, self) {
	return (self && self._ctx && self._ctx.selector || gsap$2.utils.toArray)(t)[0] || (typeof t === "string" && gsap$2.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
};
var _isWithin = function _isWithin(element, list) {
	var i = list.length;
	while (i--) if (list[i] === element || list[i].contains(element)) return true;
	return false;
};
var _getScrollFunc = function _getScrollFunc(element, _ref) {
	var s = _ref.s, sc = _ref.sc;
	_isViewport$1(element) && (element = _doc$1.scrollingElement || _docEl$1);
	var i = _scrollers.indexOf(element), offset = sc === _vertical.sc ? 1 : 2;
	!~i && (i = _scrollers.push(element) - 1);
	_scrollers[i + offset] || _addListener$1(element, "scroll", _onScroll$1);
	var prev = _scrollers[i + offset], func = prev || (_scrollers[i + offset] = _scrollCacheFunc(_getProxyProp(element, s), true) || (_isViewport$1(element) ? sc : _scrollCacheFunc(function(value) {
		return arguments.length ? element[s] = value : element[s];
	})));
	func.target = element;
	prev || (func.smooth = gsap$2.getProperty(element, "scrollBehavior") === "smooth");
	return func;
};
var _getVelocityProp = function _getVelocityProp(value, minTimeRefresh, useDelta) {
	var v1 = value, v2 = value, t1 = _getTime$1(), t2 = t1, min = minTimeRefresh || 50, dropToZeroTime = Math.max(500, min * 3), update = function update(value, force) {
		var t = _getTime$1();
		if (force || t - t1 > min) {
			v2 = v1;
			v1 = value;
			t2 = t1;
			t1 = t;
		} else if (useDelta) v1 += value;
		else v1 = v2 + (value - v2) / (t - t2) * (t1 - t2);
	};
	return {
		update,
		reset: function reset() {
			v2 = v1 = useDelta ? 0 : v1;
			t2 = t1 = 0;
		},
		getVelocity: function getVelocity(latestValue) {
			var tOld = t2, vOld = v2, t = _getTime$1();
			(latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
			return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1e3;
		}
	};
};
var _getEvent = function _getEvent(e, preventDefault) {
	preventDefault && !e._gsapAllow && e.cancelable !== false && e.preventDefault();
	return e.changedTouches ? e.changedTouches[0] : e;
};
var _getAbsoluteMax = function _getAbsoluteMax(a) {
	var max = Math.max.apply(Math, a), min = Math.min.apply(Math, a);
	return Math.abs(max) >= Math.abs(min) ? max : min;
};
var _setScrollTrigger = function _setScrollTrigger() {
	ScrollTrigger$1 = gsap$2.core.globals().ScrollTrigger;
	ScrollTrigger$1 && ScrollTrigger$1.core && _integrate();
};
var _initCore = function _initCore(core) {
	gsap$2 = core || _getGSAP$1();
	if (!_coreInitted$2 && gsap$2 && typeof document !== "undefined" && document.body) {
		_win$1 = window;
		_doc$1 = document;
		_docEl$1 = _doc$1.documentElement;
		_body$1 = _doc$1.body;
		_root$1 = [
			_win$1,
			_doc$1,
			_docEl$1,
			_body$1
		];
		gsap$2.utils.clamp;
		_context$2 = gsap$2.core.context || function() {};
		_pointerType = "onpointerenter" in _body$1 ? "pointer" : "mouse";
		_isTouch = Observer.isTouch = _win$1.matchMedia && _win$1.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win$1 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
		_eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl$1 ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl$1) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
		setTimeout(function() {
			return _startup$1 = 0;
		}, 500);
		_coreInitted$2 = 1;
	}
	ScrollTrigger$1 || _setScrollTrigger();
	return _coreInitted$2;
};
_horizontal.op = _vertical;
_scrollers.cache = 0;
var Observer = /*#__PURE__*/ function() {
	function Observer(vars) {
		this.init(vars);
	}
	var _proto = Observer.prototype;
	_proto.init = function init(vars) {
		_coreInitted$2 || _initCore(gsap$2) || console.warn("Please gsap.registerPlugin(Observer)");
		ScrollTrigger$1 || _setScrollTrigger();
		var tolerance = vars.tolerance, dragMinimum = vars.dragMinimum, type = vars.type, target = vars.target, lineHeight = vars.lineHeight, debounce = vars.debounce, preventDefault = vars.preventDefault, onStop = vars.onStop, onStopDelay = vars.onStopDelay, ignore = vars.ignore, wheelSpeed = vars.wheelSpeed, event = vars.event, onDragStart = vars.onDragStart, onDragEnd = vars.onDragEnd, onDrag = vars.onDrag, onPress = vars.onPress, onRelease = vars.onRelease, onRight = vars.onRight, onLeft = vars.onLeft, onUp = vars.onUp, onDown = vars.onDown, onChangeX = vars.onChangeX, onChangeY = vars.onChangeY, onChange = vars.onChange, onToggleX = vars.onToggleX, onToggleY = vars.onToggleY, onHover = vars.onHover, onHoverEnd = vars.onHoverEnd, onMove = vars.onMove, ignoreCheck = vars.ignoreCheck, isNormalizer = vars.isNormalizer, onGestureStart = vars.onGestureStart, onGestureEnd = vars.onGestureEnd, onWheel = vars.onWheel, onEnable = vars.onEnable, onDisable = vars.onDisable, onClick = vars.onClick, scrollSpeed = vars.scrollSpeed, capture = vars.capture, allowClicks = vars.allowClicks, lockAxis = vars.lockAxis, onLockAxis = vars.onLockAxis;
		this.target = target = _getTarget(target) || _docEl$1;
		this.vars = vars;
		ignore && (ignore = gsap$2.utils.toArray(ignore));
		tolerance = tolerance || 1e-9;
		dragMinimum = dragMinimum || 0;
		wheelSpeed = wheelSpeed || 1;
		scrollSpeed = scrollSpeed || 1;
		type = type || "wheel,touch,pointer";
		debounce = debounce !== false;
		lineHeight || (lineHeight = parseFloat(_win$1.getComputedStyle(_body$1).lineHeight) || 22);
		var id, onStopDelayedCall, dragged, moved, wheeled, locked, axis, self = this, prevDeltaX = 0, prevDeltaY = 0, passive = vars.passive || !preventDefault && vars.passive !== false, scrollFuncX = _getScrollFunc(target, _horizontal), scrollFuncY = _getScrollFunc(target, _vertical), scrollX = scrollFuncX(), scrollY = scrollFuncY(), limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown", isViewport = _isViewport$1(target), ownerDoc = target.ownerDocument || _doc$1, deltaX = [
			0,
			0,
			0
		], deltaY = [
			0,
			0,
			0
		], onClickTime = 0, clickCapture = function clickCapture() {
			return onClickTime = _getTime$1();
		}, _ignoreCheck = function _ignoreCheck(e, isPointerOrTouch) {
			return (self.event = e) && ignore && _isWithin(e.target, ignore) || isPointerOrTouch && limitToTouch && e.pointerType !== "touch" || ignoreCheck && ignoreCheck(e, isPointerOrTouch);
		}, onStopFunc = function onStopFunc() {
			self._vx.reset();
			self._vy.reset();
			onStopDelayedCall.pause();
			onStop && onStop(self);
		}, update = function update() {
			var dx = self.deltaX = _getAbsoluteMax(deltaX), dy = self.deltaY = _getAbsoluteMax(deltaY), changedX = Math.abs(dx) >= tolerance, changedY = Math.abs(dy) >= tolerance;
			onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY);
			if (changedX) {
				onRight && self.deltaX > 0 && onRight(self);
				onLeft && self.deltaX < 0 && onLeft(self);
				onChangeX && onChangeX(self);
				onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
				prevDeltaX = self.deltaX;
				deltaX[0] = deltaX[1] = deltaX[2] = 0;
			}
			if (changedY) {
				onDown && self.deltaY > 0 && onDown(self);
				onUp && self.deltaY < 0 && onUp(self);
				onChangeY && onChangeY(self);
				onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
				prevDeltaY = self.deltaY;
				deltaY[0] = deltaY[1] = deltaY[2] = 0;
			}
			if (moved || dragged) {
				onMove && onMove(self);
				if (dragged) {
					onDragStart && dragged === 1 && onDragStart(self);
					onDrag && onDrag(self);
					dragged = 0;
				}
				moved = false;
			}
			locked && !(locked = false) && onLockAxis && onLockAxis(self);
			if (wheeled) {
				onWheel(self);
				wheeled = false;
			}
			id = 0;
		}, onDelta = function onDelta(x, y, index) {
			deltaX[index] += x;
			deltaY[index] += y;
			self._vx.update(x);
			self._vy.update(y);
			debounce ? id || (id = requestAnimationFrame(update)) : update();
		}, onTouchOrPointerDelta = function onTouchOrPointerDelta(x, y) {
			if (lockAxis && !axis) {
				self.axis = axis = Math.abs(x) > Math.abs(y) ? "x" : "y";
				locked = true;
			}
			if (axis !== "y") {
				deltaX[2] += x;
				self._vx.update(x, true);
			}
			if (axis !== "x") {
				deltaY[2] += y;
				self._vy.update(y, true);
			}
			debounce ? id || (id = requestAnimationFrame(update)) : update();
		}, _onDrag = function _onDrag(e) {
			if (_ignoreCheck(e, 1)) return;
			e = _getEvent(e, preventDefault);
			var x = e.clientX, y = e.clientY, dx = x - self.x, dy = y - self.y, isDragging = self.isDragging;
			self.x = x;
			self.y = y;
			if (isDragging || (dx || dy) && (Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum)) {
				dragged || (dragged = isDragging ? 2 : 1);
				isDragging || (self.isDragging = true);
				onTouchOrPointerDelta(dx, dy);
			}
		}, _onPress = self.onPress = function(e) {
			if (_ignoreCheck(e, 1) || e && e.button) return;
			self.axis = axis = null;
			onStopDelayedCall.pause();
			self.isPressed = true;
			e = _getEvent(e);
			prevDeltaX = prevDeltaY = 0;
			self.startX = self.x = e.clientX;
			self.startY = self.y = e.clientY;
			self._vx.reset();
			self._vy.reset();
			_addListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, passive, true);
			self.deltaX = self.deltaY = 0;
			onPress && onPress(self);
		}, _onRelease = self.onRelease = function(e) {
			if (_ignoreCheck(e, 1)) return;
			_removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
			var isTrackingDrag = !isNaN(self.y - self.startY), wasDragging = self.isDragging, isDragNotClick = wasDragging && (Math.abs(self.x - self.startX) > 3 || Math.abs(self.y - self.startY) > 3), eventData = _getEvent(e);
			if (!isDragNotClick && isTrackingDrag) {
				self._vx.reset();
				self._vy.reset();
				if (preventDefault && allowClicks) gsap$2.delayedCall(.08, function() {
					if (_getTime$1() - onClickTime > 300 && !e.defaultPrevented) {
						if (e.target.click) e.target.click();
						else if (ownerDoc.createEvent) {
							var syntheticEvent = ownerDoc.createEvent("MouseEvents");
							syntheticEvent.initMouseEvent("click", true, true, _win$1, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
							e.target.dispatchEvent(syntheticEvent);
						}
					}
				});
			}
			self.isDragging = self.isGesturing = self.isPressed = false;
			onStop && wasDragging && !isNormalizer && onStopDelayedCall.restart(true);
			dragged && update();
			onDragEnd && wasDragging && onDragEnd(self);
			onRelease && onRelease(self, isDragNotClick);
		}, _onGestureStart = function _onGestureStart(e) {
			return e.touches && e.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e, self.isDragging);
		}, _onGestureEnd = function _onGestureEnd() {
			return (self.isGesturing = false) || onGestureEnd(self);
		}, onScroll = function onScroll(e) {
			if (_ignoreCheck(e)) return;
			var x = scrollFuncX(), y = scrollFuncY();
			onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
			scrollX = x;
			scrollY = y;
			onStop && onStopDelayedCall.restart(true);
		}, _onWheel = function _onWheel(e) {
			if (_ignoreCheck(e)) return;
			e = _getEvent(e, preventDefault);
			onWheel && (wheeled = true);
			var multiplier = (e.deltaMode === 1 ? lineHeight : e.deltaMode === 2 ? _win$1.innerHeight : 1) * wheelSpeed;
			onDelta(e.deltaX * multiplier, e.deltaY * multiplier, 0);
			onStop && !isNormalizer && onStopDelayedCall.restart(true);
		}, _onMove = function _onMove(e) {
			if (_ignoreCheck(e)) return;
			var x = e.clientX, y = e.clientY, dx = x - self.x, dy = y - self.y;
			self.x = x;
			self.y = y;
			moved = true;
			onStop && onStopDelayedCall.restart(true);
			(dx || dy) && onTouchOrPointerDelta(dx, dy);
		}, _onHover = function _onHover(e) {
			self.event = e;
			onHover(self);
		}, _onHoverEnd = function _onHoverEnd(e) {
			self.event = e;
			onHoverEnd(self);
		}, _onClick = function _onClick(e) {
			return _ignoreCheck(e) || _getEvent(e, preventDefault) && onClick(self);
		};
		onStopDelayedCall = self._dc = gsap$2.delayedCall(onStopDelay || .25, onStopFunc).pause();
		self.deltaX = self.deltaY = 0;
		self._vx = _getVelocityProp(0, 50, true);
		self._vy = _getVelocityProp(0, 50, true);
		self.scrollX = scrollFuncX;
		self.scrollY = scrollFuncY;
		self.isDragging = self.isGesturing = self.isPressed = false;
		_context$2(this);
		self.enable = function(e) {
			if (!self.isEnabled) {
				_addListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
				type.indexOf("scroll") >= 0 && _addListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, passive, capture);
				type.indexOf("wheel") >= 0 && _addListener$1(target, "wheel", _onWheel, passive, capture);
				if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
					_addListener$1(target, _eventTypes[0], _onPress, passive, capture);
					_addListener$1(ownerDoc, _eventTypes[2], _onRelease);
					_addListener$1(ownerDoc, _eventTypes[3], _onRelease);
					allowClicks && _addListener$1(target, "click", clickCapture, true, true);
					onClick && _addListener$1(target, "click", _onClick);
					onGestureStart && _addListener$1(ownerDoc, "gesturestart", _onGestureStart);
					onGestureEnd && _addListener$1(ownerDoc, "gestureend", _onGestureEnd);
					onHover && _addListener$1(target, _pointerType + "enter", _onHover);
					onHoverEnd && _addListener$1(target, _pointerType + "leave", _onHoverEnd);
					onMove && _addListener$1(target, _pointerType + "move", _onMove);
				}
				self.isEnabled = true;
				self.isDragging = self.isGesturing = self.isPressed = moved = dragged = false;
				self._vx.reset();
				self._vy.reset();
				scrollX = scrollFuncX();
				scrollY = scrollFuncY();
				e && e.type && _onPress(e);
				onEnable && onEnable(self);
			}
			return self;
		};
		self.disable = function() {
			if (self.isEnabled) {
				_observers.filter(function(o) {
					return o !== self && _isViewport$1(o.target);
				}).length || _removeListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
				if (self.isPressed) {
					self._vx.reset();
					self._vy.reset();
					_removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
				}
				_removeListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, capture);
				_removeListener$1(target, "wheel", _onWheel, capture);
				_removeListener$1(target, _eventTypes[0], _onPress, capture);
				_removeListener$1(ownerDoc, _eventTypes[2], _onRelease);
				_removeListener$1(ownerDoc, _eventTypes[3], _onRelease);
				_removeListener$1(target, "click", clickCapture, true);
				_removeListener$1(target, "click", _onClick);
				_removeListener$1(ownerDoc, "gesturestart", _onGestureStart);
				_removeListener$1(ownerDoc, "gestureend", _onGestureEnd);
				_removeListener$1(target, _pointerType + "enter", _onHover);
				_removeListener$1(target, _pointerType + "leave", _onHoverEnd);
				_removeListener$1(target, _pointerType + "move", _onMove);
				self.isEnabled = self.isPressed = self.isDragging = false;
				onDisable && onDisable(self);
			}
		};
		self.kill = self.revert = function() {
			self.disable();
			var i = _observers.indexOf(self);
			i >= 0 && _observers.splice(i, 1);
			_normalizer$1 === self && (_normalizer$1 = 0);
		};
		_observers.push(self);
		isNormalizer && _isViewport$1(target) && (_normalizer$1 = self);
		self.enable(event);
	};
	_createClass(Observer, [{
		key: "velocityX",
		get: function get() {
			return this._vx.getVelocity();
		}
	}, {
		key: "velocityY",
		get: function get() {
			return this._vy.getVelocity();
		}
	}]);
	return Observer;
}();
Observer.version = "3.15.0";
Observer.create = function(vars) {
	return new Observer(vars);
};
Observer.register = _initCore;
Observer.getAll = function() {
	return _observers.slice();
};
Observer.getById = function(id) {
	return _observers.filter(function(o) {
		return o.vars.id === id;
	})[0];
};
_getGSAP$1() && gsap$2.registerPlugin(Observer);
//#endregion
//#region node_modules/gsap/ScrollTrigger.js
/*!
* ScrollTrigger 3.15.0
* https://gsap.com
*
* @license Copyright 2008-2026, GreenSock. All rights reserved.
* Subject to the terms at https://gsap.com/standard-license
* @author: Jack Doyle, jack@greensock.com
*/
var gsap$1;
var _coreInitted$1;
var _win;
var _doc;
var _docEl;
var _body;
var _root;
var _resizeDelay;
var _toArray$1;
var _clamp;
var _time2;
var _syncInterval;
var _refreshing;
var _pointerIsDown;
var _transformProp;
var _i;
var _prevWidth;
var _prevHeight;
var _autoRefresh;
var _sort;
var _suppressOverwrites;
var _ignoreResize;
var _normalizer;
var _ignoreMobileResize;
var _baseScreenHeight;
var _baseScreenWidth;
var _fixIOSBug;
var _context$1;
var _scrollRestoration;
var _div100vh;
var _100vh;
var _isReverted;
var _clampingMax;
var _limitCallbacks;
var _startup = 1;
var _getTime = Date.now;
var _time1 = _getTime();
var _lastScrollTime = 0;
var _enabled = 0;
var _parseClamp = function _parseClamp(value, type, self) {
	var clamp = _isString(value) && (value.substr(0, 6) === "clamp(" || value.indexOf("max") > -1);
	self["_" + type + "Clamp"] = clamp;
	return clamp ? value.substr(6, value.length - 7) : value;
};
var _keepClamp = function _keepClamp(value, clamp) {
	return clamp && (!_isString(value) || value.substr(0, 6) !== "clamp(") ? "clamp(" + value + ")" : value;
};
var _rafBugFix = function _rafBugFix() {
	return _enabled && requestAnimationFrame(_rafBugFix);
};
var _pointerDownHandler = function _pointerDownHandler() {
	return _pointerIsDown = 1;
};
var _pointerUpHandler = function _pointerUpHandler() {
	return _pointerIsDown = 0;
};
var _passThrough = function _passThrough(v) {
	return v;
};
var _round = function _round(value) {
	return Math.round(value * 1e5) / 1e5 || 0;
};
var _windowExists = function _windowExists() {
	return typeof window !== "undefined";
};
var _getGSAP = function _getGSAP() {
	return gsap$1 || _windowExists() && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
};
var _isViewport = function _isViewport(e) {
	return !!~_root.indexOf(e);
};
var _getViewportDimension = function _getViewportDimension(dimensionProperty) {
	return (dimensionProperty === "Height" ? _100vh : _win["inner" + dimensionProperty]) || _docEl["client" + dimensionProperty] || _body["client" + dimensionProperty];
};
var _getBoundsFunc = function _getBoundsFunc(element) {
	return _getProxyProp(element, "getBoundingClientRect") || (_isViewport(element) ? function() {
		_winOffsets.width = _win.innerWidth;
		_winOffsets.height = _100vh;
		return _winOffsets;
	} : function() {
		return _getBounds(element);
	});
};
var _getSizeFunc = function _getSizeFunc(scroller, isViewport, _ref) {
	var d = _ref.d, d2 = _ref.d2, a = _ref.a;
	return (a = _getProxyProp(scroller, "getBoundingClientRect")) ? function() {
		return a()[d];
	} : function() {
		return (isViewport ? _getViewportDimension(d2) : scroller["client" + d2]) || 0;
	};
};
var _getOffsetsFunc = function _getOffsetsFunc(element, isViewport) {
	return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function() {
		return _winOffsets;
	};
};
var _maxScroll = function _maxScroll(element, _ref2) {
	var s = _ref2.s, d2 = _ref2.d2, d = _ref2.d, a = _ref2.a;
	return Math.max(0, (s = "scroll" + d2) && (a = _getProxyProp(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport(element) ? (_docEl[s] || _body[s]) - _getViewportDimension(d2) : element[s] - element["offset" + d2]);
};
var _iterateAutoRefresh = function _iterateAutoRefresh(func, events) {
	for (var i = 0; i < _autoRefresh.length; i += 3) (!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
};
var _isString = function _isString(value) {
	return typeof value === "string";
};
var _isFunction = function _isFunction(value) {
	return typeof value === "function";
};
var _isNumber = function _isNumber(value) {
	return typeof value === "number";
};
var _isObject = function _isObject(value) {
	return typeof value === "object";
};
var _endAnimation = function _endAnimation(animation, reversed, pause) {
	return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
};
var _callback = function _callback(self, func, extraParam) {
	if (self.enabled) {
		var result = self._ctx ? self._ctx.add(function() {
			return func(self, extraParam);
		}) : func(self, extraParam);
		result && result.totalTime && (self.callbackAnimation = result);
	}
};
var _abs = Math.abs;
var _left = "left";
var _top = "top";
var _right = "right";
var _bottom = "bottom";
var _width = "width";
var _height = "height";
var _Right = "Right";
var _Left = "Left";
var _Top = "Top";
var _Bottom = "Bottom";
var _padding = "padding";
var _margin = "margin";
var _Width = "Width";
var _Height = "Height";
var _px = "px";
var _getComputedStyle = function _getComputedStyle(element) {
	return _win.getComputedStyle(element.nodeType === Node.DOCUMENT_NODE ? element.scrollingElement : element);
};
var _makePositionable = function _makePositionable(element) {
	var position = _getComputedStyle(element).position;
	element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
};
var _setDefaults = function _setDefaults(obj, defaults) {
	for (var p in defaults) p in obj || (obj[p] = defaults[p]);
	return obj;
};
var _getBounds = function _getBounds(element, withoutTransforms) {
	var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap$1.to(element, {
		x: 0,
		y: 0,
		xPercent: 0,
		yPercent: 0,
		rotation: 0,
		rotationX: 0,
		rotationY: 0,
		scale: 1,
		skewX: 0,
		skewY: 0
	}).progress(1), bounds = element.getBoundingClientRect ? element.getBoundingClientRect() : element.scrollingElement.getBoundingClientRect();
	tween && tween.progress(0).kill();
	return bounds;
};
var _getSize = function _getSize(element, _ref3) {
	var d2 = _ref3.d2;
	return element["offset" + d2] || element["client" + d2] || 0;
};
var _getLabelRatioArray = function _getLabelRatioArray(timeline) {
	var a = [], labels = timeline.labels, duration = timeline.duration(), p;
	for (p in labels) a.push(labels[p] / duration);
	return a;
};
var _getClosestLabel = function _getClosestLabel(animation) {
	return function(value) {
		return gsap$1.utils.snap(_getLabelRatioArray(animation), value);
	};
};
var _snapDirectional = function _snapDirectional(snapIncrementOrArray) {
	var snap = gsap$1.utils.snap(snapIncrementOrArray), a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function(a, b) {
		return a - b;
	});
	return a ? function(value, direction, threshold) {
		if (threshold === void 0) threshold = .001;
		var i;
		if (!direction) return snap(value);
		if (direction > 0) {
			value -= threshold;
			for (i = 0; i < a.length; i++) if (a[i] >= value) return a[i];
			return a[i - 1];
		} else {
			i = a.length;
			value += threshold;
			while (i--) if (a[i] <= value) return a[i];
		}
		return a[0];
	} : function(value, direction, threshold) {
		if (threshold === void 0) threshold = .001;
		var snapped = snap(value);
		return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
	};
};
var _getLabelAtDirection = function _getLabelAtDirection(timeline) {
	return function(value, st) {
		return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
	};
};
var _multiListener = function _multiListener(func, element, types, callback) {
	return types.split(",").forEach(function(type) {
		return func(element, type, callback);
	});
};
var _addListener = function _addListener(element, type, func, nonPassive, capture) {
	return element.addEventListener(type, func, {
		passive: !nonPassive,
		capture: !!capture
	});
};
var _removeListener = function _removeListener(element, type, func, capture) {
	return element.removeEventListener(type, func, !!capture);
};
var _wheelListener = function _wheelListener(func, el, scrollFunc) {
	scrollFunc = scrollFunc && scrollFunc.wheelHandler;
	if (scrollFunc) {
		func(el, "wheel", scrollFunc);
		func(el, "touchmove", scrollFunc);
	}
};
var _markerDefaults = {
	startColor: "green",
	endColor: "red",
	indent: 0,
	fontSize: "16px",
	fontWeight: "normal"
};
var _defaults = {
	toggleActions: "play",
	anticipatePin: 0
};
var _keywords = {
	top: 0,
	left: 0,
	center: .5,
	bottom: 1,
	right: 1
};
var _offsetToPx = function _offsetToPx(value, size) {
	if (_isString(value)) {
		var eqIndex = value.indexOf("="), relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
		if (~eqIndex) {
			value.indexOf("%") > eqIndex && (relative *= size / 100);
			value = value.substr(0, eqIndex - 1);
		}
		value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
	}
	return value;
};
var _createMarker = function _createMarker(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
	var startColor = _ref4.startColor, endColor = _ref4.endColor, fontSize = _ref4.fontSize, indent = _ref4.indent, fontWeight = _ref4.fontWeight;
	var e = _doc.createElement("div"), useFixedPosition = _isViewport(container) || _getProxyProp(container, "pinType") === "fixed", isScroller = type.indexOf("scroller") !== -1, parent = useFixedPosition ? _body : container.tagName === "IFRAME" ? container.contentDocument.body : container, isStart = type.indexOf("start") !== -1, color = isStart ? startColor : endColor, css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
	css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
	(isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
	matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
	e._isStart = isStart;
	e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
	e.style.cssText = css;
	e.innerText = name || name === 0 ? type + "-" + name : type;
	parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
	e._offset = e["offset" + direction.op.d2];
	_positionMarker(e, 0, direction, isStart);
	return e;
};
var _positionMarker = function _positionMarker(marker, start, direction, flipped) {
	var vars = { display: "block" }, side = direction[flipped ? "os2" : "p2"], oppositeSide = direction[flipped ? "p2" : "os2"];
	marker._isFlipped = flipped;
	vars[direction.a + "Percent"] = flipped ? -100 : 0;
	vars[direction.a] = flipped ? "1px" : 0;
	vars["border" + side + _Width] = 1;
	vars["border" + oppositeSide + _Width] = 0;
	vars[direction.p] = start + "px";
	gsap$1.set(marker, vars);
};
var _triggers = [];
var _ids = {};
var _rafID;
var _sync = function _sync() {
	return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
};
var _onScroll = function _onScroll() {
	if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body.clientWidth) {
		_scrollers.cache++;
		if (_normalizer) _rafID || (_rafID = requestAnimationFrame(_updateAll));
		else _updateAll();
		_lastScrollTime || _dispatch("scrollStart");
		_lastScrollTime = _getTime();
	}
};
var _setBaseDimensions = function _setBaseDimensions() {
	_baseScreenWidth = _win.innerWidth;
	_baseScreenHeight = _win.innerHeight;
};
var _onResize = function _onResize(force) {
	_scrollers.cache++;
	(force === true || !_refreshing && !_ignoreResize && !_doc.fullscreenElement && !_doc.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win.innerWidth || Math.abs(_win.innerHeight - _baseScreenHeight) > _win.innerHeight * .25)) && _resizeDelay.restart(true);
};
var _listeners = {};
var _emptyArray$1 = [];
var _softRefresh = function _softRefresh() {
	return _removeListener(ScrollTrigger, "scrollEnd", _softRefresh) || _refreshAll(true);
};
var _dispatch = function _dispatch(type) {
	return _listeners[type] && _listeners[type].map(function(f) {
		return f();
	}) || _emptyArray$1;
};
var _savedStyles = [];
var _revertRecorded = function _revertRecorded(media) {
	for (var i = 0; i < _savedStyles.length; i += 5) if (!media || _savedStyles[i + 4] && _savedStyles[i + 4].query === media) {
		_savedStyles[i].style.cssText = _savedStyles[i + 1];
		_savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
		_savedStyles[i + 3].uncache = 1;
	}
};
var _recordScrollPositions = function _recordScrollPositions() {
	return _scrollers.forEach(function(obj) {
		return _isFunction(obj) && ++obj.cacheID && (obj.rec = obj());
	});
};
var _revertAll = function _revertAll(kill, media) {
	var trigger;
	for (_i = 0; _i < _triggers.length; _i++) {
		trigger = _triggers[_i];
		if (trigger && (!media || trigger._ctx === media)) {
			if (kill) trigger.kill(1);
			else trigger.revert(true, true);
		}
	}
	_isReverted = true;
	media && _revertRecorded(media);
	media || _dispatch("revert");
};
var _clearScrollMemory = function _clearScrollMemory(scrollRestoration, force) {
	_scrollers.cache++;
	(force || !_refreshingAll) && _scrollers.forEach(function(obj) {
		return _isFunction(obj) && obj.cacheID++ && (obj.rec = 0);
	});
	_isString(scrollRestoration) && (_win.history.scrollRestoration = _scrollRestoration = scrollRestoration);
};
var _refreshingAll;
var _refreshID = 0;
var _queueRefreshID;
var _queueRefreshAll = function _queueRefreshAll() {
	if (_queueRefreshID !== _refreshID) {
		var id = _queueRefreshID = _refreshID;
		requestAnimationFrame(function() {
			return id === _refreshID && _refreshAll(true);
		});
	}
};
var _refresh100vh = function _refresh100vh() {
	_body.appendChild(_div100vh);
	_100vh = !_normalizer && _div100vh.offsetHeight || _win.innerHeight;
	_body.removeChild(_div100vh);
};
var _hideAllMarkers = function _hideAllMarkers(hide) {
	return _toArray$1(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(el) {
		return el.style.display = hide ? "none" : "block";
	});
};
var _refreshAll = function _refreshAll(force, skipRevert) {
	_docEl = _doc.documentElement;
	_body = _doc.body;
	_root = [
		_win,
		_doc,
		_docEl,
		_body
	];
	if (_lastScrollTime && !force && !_isReverted) {
		_addListener(ScrollTrigger, "scrollEnd", _softRefresh);
		return;
	}
	_refresh100vh();
	_refreshingAll = ScrollTrigger.isRefreshing = true;
	_isReverted || _recordScrollPositions();
	var refreshInits = _dispatch("refreshInit");
	_sort && ScrollTrigger.sort();
	skipRevert || _revertAll();
	_scrollers.forEach(function(obj) {
		if (_isFunction(obj)) {
			obj.smooth && (obj.target.style.scrollBehavior = "auto");
			obj(0);
		}
	});
	_triggers.slice(0).forEach(function(t) {
		return t.refresh();
	});
	_isReverted = false;
	_triggers.forEach(function(t) {
		if (t._subPinOffset && t.pin) {
			var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight", original = t.pin[prop];
			t.revert(true, 1);
			t.adjustPinSpacing(t.pin[prop] - original);
			t.refresh();
		}
	});
	_clampingMax = 1;
	_hideAllMarkers(true);
	_triggers.forEach(function(t) {
		var max = _maxScroll(t.scroller, t._dir), endClamp = t.vars.end === "max" || t._endClamp && t.end > max, startClamp = t._startClamp && t.start >= max;
		(endClamp || startClamp) && t.setPositions(startClamp ? max - 1 : t.start, endClamp ? Math.max(startClamp ? max : t.start + 1, max) : t.end, true);
	});
	_hideAllMarkers(false);
	_clampingMax = 0;
	refreshInits.forEach(function(result) {
		return result && result.render && result.render(-1);
	});
	_scrollers.forEach(function(obj) {
		if (_isFunction(obj)) {
			obj.smooth && requestAnimationFrame(function() {
				return obj.target.style.scrollBehavior = "smooth";
			});
			obj.rec && obj(obj.rec);
		}
	});
	_clearScrollMemory(_scrollRestoration, 1);
	_resizeDelay.pause();
	_refreshID++;
	_refreshingAll = 2;
	_updateAll(2);
	_triggers.forEach(function(t) {
		return _isFunction(t.vars.onRefresh) && t.vars.onRefresh(t);
	});
	_refreshingAll = ScrollTrigger.isRefreshing = false;
	_dispatch("refresh");
};
var _lastScroll = 0;
var _direction = 1;
var _primary;
var _updateAll = function _updateAll(force) {
	if (force === 2 || !_refreshingAll && !_isReverted) {
		ScrollTrigger.isUpdating = true;
		_primary && _primary.update(0);
		var l = _triggers.length, time = _getTime(), recordVelocity = time - _time1 >= 50, scroll = l && _triggers[0].scroll();
		_direction = _lastScroll > scroll ? -1 : 1;
		_refreshingAll || (_lastScroll = scroll);
		if (recordVelocity) {
			if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
				_lastScrollTime = 0;
				_dispatch("scrollEnd");
			}
			_time2 = _time1;
			_time1 = time;
		}
		if (_direction < 0) {
			_i = l;
			while (_i-- > 0) _triggers[_i] && _triggers[_i].update(0, recordVelocity);
			_direction = 1;
		} else for (_i = 0; _i < l; _i++) _triggers[_i] && _triggers[_i].update(0, recordVelocity);
		ScrollTrigger.isUpdating = false;
	}
	_rafID = 0;
};
var _propNamesToCopy = [
	_left,
	_top,
	_bottom,
	_right,
	_margin + _Bottom,
	_margin + _Right,
	_margin + _Top,
	_margin + _Left,
	"display",
	"flexShrink",
	"float",
	"zIndex",
	"gridColumnStart",
	"gridColumnEnd",
	"gridRowStart",
	"gridRowEnd",
	"gridArea",
	"justifySelf",
	"alignSelf",
	"placeSelf",
	"order"
];
var _stateProps = _propNamesToCopy.concat([
	_width,
	_height,
	"boxSizing",
	"max" + _Width,
	"max" + _Height,
	"position",
	_margin,
	_padding,
	_padding + _Top,
	_padding + _Right,
	_padding + _Bottom,
	_padding + _Left
]);
var _swapPinOut = function _swapPinOut(pin, spacer, state) {
	_setState(state);
	var cache = pin._gsap;
	if (cache.spacerIsNative) _setState(cache.spacerState);
	else if (pin._gsap.swappedIn) {
		var parent = spacer.parentNode;
		if (parent) {
			parent.insertBefore(pin, spacer);
			parent.removeChild(spacer);
		}
	}
	pin._gsap.swappedIn = false;
};
var _swapPinIn = function _swapPinIn(pin, spacer, cs, spacerState) {
	if (!pin._gsap.swappedIn) {
		var i = _propNamesToCopy.length, spacerStyle = spacer.style, pinStyle = pin.style, p;
		while (i--) {
			p = _propNamesToCopy[i];
			spacerStyle[p] = cs[p];
		}
		spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
		cs.display === "inline" && (spacerStyle.display = "inline-block");
		pinStyle[_bottom] = pinStyle[_right] = "auto";
		spacerStyle.flexBasis = cs.flexBasis || "auto";
		spacerStyle.overflow = "visible";
		spacerStyle.boxSizing = "border-box";
		spacerStyle[_width] = _getSize(pin, _horizontal) + _px;
		spacerStyle[_height] = _getSize(pin, _vertical) + _px;
		spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
		_setState(spacerState);
		pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
		pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
		pinStyle[_padding] = cs[_padding];
		if (pin.parentNode !== spacer) {
			pin.parentNode.insertBefore(spacer, pin);
			spacer.appendChild(pin);
		}
		pin._gsap.swappedIn = true;
	}
};
var _capsExp = /([A-Z])/g;
var _setState = function _setState(state) {
	if (state) {
		var style = state.t.style, l = state.length, i = 0, p, value;
		(state.t._gsap || gsap$1.core.getCache(state.t)).uncache = 1;
		for (; i < l; i += 2) {
			value = state[i + 1];
			p = state[i];
			if (value) style[p] = value;
			else if (style[p]) style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
		}
	}
};
var _getState = function _getState(element) {
	var l = _stateProps.length, style = element.style, state = [], i = 0;
	for (; i < l; i++) state.push(_stateProps[i], style[_stateProps[i]]);
	state.t = element;
	return state;
};
var _copyState = function _copyState(state, override, omitOffsets) {
	var result = [], l = state.length, i = omitOffsets ? 8 : 0, p;
	for (; i < l; i += 2) {
		p = state[i];
		result.push(p, p in override ? override[p] : state[i + 1]);
	}
	result.t = state.t;
	return result;
};
var _winOffsets = {
	left: 0,
	top: 0
};
var _parsePosition = function _parsePosition(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation, clampZeroProp) {
	_isFunction(value) && (value = value(self));
	if (_isString(value) && value.substr(0, 3) === "max") value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
	var time = containerAnimation ? containerAnimation.time() : 0, p1, p2, element;
	containerAnimation && containerAnimation.seek(0);
	isNaN(value) || (value = +value);
	if (!_isNumber(value)) {
		_isFunction(trigger) && (trigger = trigger(self));
		var offsets = (value || "0").split(" "), bounds, localOffset, globalOffset, display;
		element = _getTarget(trigger, self) || _body;
		bounds = _getBounds(element) || {};
		if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
			display = element.style.display;
			element.style.display = "block";
			bounds = _getBounds(element);
			display ? element.style.display = display : element.style.removeProperty("display");
		}
		localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
		globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
		value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
		markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
		scrollerSize -= scrollerSize - globalOffset;
	} else {
		containerAnimation && (value = gsap$1.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
		markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
	}
	if (clampZeroProp) {
		self[clampZeroProp] = value || -.001;
		value < 0 && (value = 0);
	}
	if (marker) {
		var position = value + scrollerSize, isStart = marker._isStart;
		p1 = "scroll" + direction.d2;
		_positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body[p1], _docEl[p1]) : marker.parentNode[p1]) <= position + 1);
		if (useFixedPosition) {
			scrollerBounds = _getBounds(markerScroller);
			useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
		}
	}
	if (containerAnimation && element) {
		p1 = _getBounds(element);
		containerAnimation.seek(scrollerMax);
		p2 = _getBounds(element);
		containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
		value = value / containerAnimation._caScrollDist * scrollerMax;
	}
	containerAnimation && containerAnimation.seek(time);
	return containerAnimation ? value : Math.round(value);
};
var _prefixExp = /(webkit|moz|length|cssText|inset)/i;
var _reparent = function _reparent(element, parent, top, left) {
	if (element.parentNode !== parent) {
		var style = element.style, p, cs;
		if (parent === _body) {
			element._stOrig = style.cssText;
			cs = _getComputedStyle(element);
			for (p in cs) if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") style[p] = cs[p];
			style.top = top;
			style.left = left;
		} else style.cssText = element._stOrig;
		gsap$1.core.getCache(element).uncache = 1;
		parent.appendChild(element);
	}
};
var _interruptionTracker = function _interruptionTracker(getValueFunc, initialValue, onInterrupt) {
	var last1 = initialValue, last2 = last1;
	return function(value) {
		var current = Math.round(getValueFunc());
		if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
			value = current;
			onInterrupt && onInterrupt();
		}
		last2 = last1;
		last1 = Math.round(value);
		return last1;
	};
};
var _shiftMarker = function _shiftMarker(marker, direction, value) {
	var vars = {};
	vars[direction.p] = "+=" + value;
	gsap$1.set(marker, vars);
};
var _getTweenCreator = function _getTweenCreator(scroller, direction) {
	var getScroll = _getScrollFunc(scroller, direction), prop = "_scroll" + direction.p2, getTween = function getTween(scrollTo, vars, initialValue, change1, change2) {
		var tween = getTween.tween, onComplete = vars.onComplete, modifiers = {};
		initialValue = initialValue || getScroll();
		var checkForInterruption = _interruptionTracker(getScroll, initialValue, function() {
			tween.kill();
			getTween.tween = 0;
		});
		change2 = change1 && change2 || 0;
		change1 = change1 || scrollTo - initialValue;
		tween && tween.kill();
		vars[prop] = scrollTo;
		vars.inherit = false;
		vars.modifiers = modifiers;
		modifiers[prop] = function() {
			return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
		};
		vars.onUpdate = function() {
			_scrollers.cache++;
			getTween.tween && _updateAll();
		};
		vars.onComplete = function() {
			getTween.tween = 0;
			onComplete && onComplete.call(tween);
		};
		tween = getTween.tween = gsap$1.to(scroller, vars);
		return tween;
	};
	scroller[prop] = getScroll;
	getScroll.wheelHandler = function() {
		return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
	};
	_addListener(scroller, "wheel", getScroll.wheelHandler);
	ScrollTrigger.isTouch && _addListener(scroller, "touchmove", getScroll.wheelHandler);
	return getTween;
};
var ScrollTrigger = /*#__PURE__*/ function() {
	function ScrollTrigger(vars, animation) {
		_coreInitted$1 || ScrollTrigger.register(gsap$1) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
		_context$1(this);
		this.init(vars, animation);
	}
	var _proto = ScrollTrigger.prototype;
	_proto.init = function init(vars, animation) {
		this.progress = this.start = 0;
		this.vars && this.kill(true, true);
		if (!_enabled) {
			this.update = this.refresh = this.kill = _passThrough;
			return;
		}
		vars = _setDefaults(_isString(vars) || _isNumber(vars) || vars.nodeType ? { trigger: vars } : vars, _defaults);
		var _vars = vars, onUpdate = _vars.onUpdate, toggleClass = _vars.toggleClass, id = _vars.id, onToggle = _vars.onToggle, onRefresh = _vars.onRefresh, scrub = _vars.scrub, trigger = _vars.trigger, pin = _vars.pin, pinSpacing = _vars.pinSpacing, invalidateOnRefresh = _vars.invalidateOnRefresh, anticipatePin = _vars.anticipatePin, onScrubComplete = _vars.onScrubComplete, onSnapComplete = _vars.onSnapComplete, once = _vars.once, snap = _vars.snap, pinReparent = _vars.pinReparent, pinSpacer = _vars.pinSpacer, containerAnimation = _vars.containerAnimation, fastScrollEnd = _vars.fastScrollEnd, preventOverlaps = _vars.preventOverlaps, direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical, isToggle = !scrub && scrub !== 0, scroller = _getTarget(vars.scroller || _win), scrollerCache = gsap$1.core.getCache(scroller), isViewport = _isViewport(scroller), useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed", callbacks = [
			vars.onEnter,
			vars.onLeave,
			vars.onEnterBack,
			vars.onLeaveBack
		], toggleActions = isToggle && vars.toggleActions.split(" "), markers = "markers" in vars ? vars.markers : _defaults.markers, borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, self = this, onRefreshInit = vars.onRefreshInit && function() {
			return vars.onRefreshInit(self);
		}, getScrollerSize = _getSizeFunc(scroller, isViewport, direction), getScrollerOffsets = _getOffsetsFunc(scroller, isViewport), lastSnap = 0, lastRefresh = 0, prevProgress = 0, scrollFunc = _getScrollFunc(scroller, direction), tweenTo, pinCache, snapFunc, scroll1, scroll2, start, end, markerStart, markerEnd, markerStartTrigger, markerEndTrigger, markerVars, executingOnRefresh, change, pinOriginalState, pinActiveState, pinState, spacer, offset, pinGetter, pinSetter, pinStart, pinChange, spacingStart, spacerState, markerStartSetter, pinMoves, markerEndSetter, cs, snap1, snap2, scrubTween, scrubSmooth, snapDurClamp, snapDelayedCall, prevScroll, prevAnimProgress, caMarkerSetter, customRevertReturn;
		self._startClamp = self._endClamp = false;
		self._dir = direction;
		anticipatePin *= 45;
		self.scroller = scroller;
		self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
		scroll1 = scrollFunc();
		self.vars = vars;
		animation = animation || vars.animation;
		if ("refreshPriority" in vars) {
			_sort = 1;
			vars.refreshPriority === -9999 && (_primary = self);
		}
		scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
			top: _getTweenCreator(scroller, _vertical),
			left: _getTweenCreator(scroller, _horizontal)
		};
		self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
		self.scrubDuration = function(value) {
			scrubSmooth = _isNumber(value) && value;
			if (!scrubSmooth) {
				scrubTween && scrubTween.progress(1).kill();
				scrubTween = 0;
			} else scrubTween ? scrubTween.duration(value) : scrubTween = gsap$1.to(animation, {
				ease: "expo",
				totalProgress: "+=0",
				inherit: false,
				duration: scrubSmooth,
				paused: true,
				onComplete: function onComplete() {
					return onScrubComplete && onScrubComplete(self);
				}
			});
		};
		if (animation) {
			animation.vars.lazy = false;
			animation._initted && !self.isReverted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true);
			self.animation = animation.pause();
			animation.scrollTrigger = self;
			self.scrubDuration(scrub);
			snap1 = 0;
			id || (id = animation.vars.id);
		}
		if (snap) {
			if (!_isObject(snap) || snap.push) snap = { snapTo: snap };
			"scrollBehavior" in _body.style && gsap$1.set(isViewport ? [_body, _docEl] : scroller, { scrollBehavior: "auto" });
			_scrollers.forEach(function(o) {
				return _isFunction(o) && o.target === (isViewport ? _doc.scrollingElement || _docEl : scroller) && (o.smooth = false);
			});
			snapFunc = _isFunction(snap.snapTo) ? snap.snapTo : snap.snapTo === "labels" ? _getClosestLabel(animation) : snap.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap.directional !== false ? function(value, st) {
				return _snapDirectional(snap.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
			} : gsap$1.utils.snap(snap.snapTo);
			snapDurClamp = snap.duration || {
				min: .1,
				max: 2
			};
			snapDurClamp = _isObject(snapDurClamp) ? _clamp(snapDurClamp.min, snapDurClamp.max) : _clamp(snapDurClamp, snapDurClamp);
			snapDelayedCall = gsap$1.delayedCall(snap.delay || scrubSmooth / 2 || .1, function() {
				var scroll = scrollFunc(), refreshedRecently = _getTime() - lastRefresh < 500, tween = tweenTo.tween;
				if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
					var progress = (scroll - start) / change, totalProgress = animation && !isToggle ? animation.totalProgress() : progress, velocity = refreshedRecently ? 0 : (totalProgress - snap2) / (_getTime() - _time2) * 1e3 || 0, change1 = gsap$1.utils.clamp(-progress, 1 - progress, _abs(velocity / 2) * velocity / .185), naturalEnd = progress + (snap.inertia === false ? 0 : change1), endValue, endScroll, _snap = snap, onStart = _snap.onStart, _onInterrupt = _snap.onInterrupt, _onComplete = _snap.onComplete;
					endValue = snapFunc(naturalEnd, self);
					_isNumber(endValue) || (endValue = naturalEnd);
					endScroll = Math.max(0, Math.round(start + endValue * change));
					if (scroll <= end && scroll >= start && endScroll !== scroll) {
						if (tween && !tween._initted && tween.data <= _abs(endScroll - scroll)) return;
						if (snap.inertia === false) change1 = endValue - progress;
						tweenTo(endScroll, {
							duration: snapDurClamp(_abs(Math.max(_abs(naturalEnd - totalProgress), _abs(endValue - totalProgress)) * .185 / velocity / .05 || 0)),
							ease: snap.ease || "power3",
							data: _abs(endScroll - scroll),
							onInterrupt: function onInterrupt() {
								return snapDelayedCall.restart(true) && _onInterrupt && _callback(self, _onInterrupt);
							},
							onComplete: function onComplete() {
								self.update();
								lastSnap = scrollFunc();
								if (animation && !isToggle) scrubTween ? scrubTween.resetTo("totalProgress", endValue, animation._tTime / animation._tDur) : animation.progress(endValue);
								snap1 = snap2 = animation && !isToggle ? animation.totalProgress() : self.progress;
								onSnapComplete && onSnapComplete(self);
								_onComplete && _callback(self, _onComplete);
							}
						}, scroll, change1 * change, endScroll - scroll - change1 * change);
						onStart && _callback(self, onStart, tweenTo.tween);
					}
				} else if (self.isActive && lastSnap !== scroll) snapDelayedCall.restart(true);
			}).pause();
		}
		id && (_ids[id] = self);
		trigger = self.trigger = _getTarget(trigger || pin !== true && pin);
		customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
		customRevertReturn && (customRevertReturn = customRevertReturn(self));
		pin = pin === true ? trigger : _getTarget(pin);
		_isString(toggleClass) && (toggleClass = {
			targets: trigger,
			className: toggleClass
		});
		if (pin) {
			pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding);
			self.pin = pin;
			pinCache = gsap$1.core.getCache(pin);
			if (!pinCache.spacer) {
				if (pinSpacer) {
					pinSpacer = _getTarget(pinSpacer);
					pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement);
					pinCache.spacerIsNative = !!pinSpacer;
					pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
				}
				pinCache.spacer = spacer = pinSpacer || _doc.createElement("div");
				spacer.classList.add("pin-spacer");
				id && spacer.classList.add("pin-spacer-" + id);
				pinCache.pinState = pinOriginalState = _getState(pin);
			} else pinOriginalState = pinCache.pinState;
			vars.force3D !== false && gsap$1.set(pin, { force3D: true });
			self.spacer = spacer = pinCache.spacer;
			cs = _getComputedStyle(pin);
			spacingStart = cs[pinSpacing + direction.os2];
			pinGetter = gsap$1.getProperty(pin);
			pinSetter = gsap$1.quickSetter(pin, direction.a, _px);
			_swapPinIn(pin, spacer, cs);
			pinState = _getState(pin);
		}
		if (markers) {
			markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
			markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
			markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
			offset = markerStartTrigger["offset" + direction.op.d2];
			var content = _getTarget(_getProxyProp(scroller, "content") || scroller);
			markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
			markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
			containerAnimation && (caMarkerSetter = gsap$1.quickSetter([markerStart, markerEnd], direction.a, _px));
			if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
				_makePositionable(isViewport ? _body : scroller);
				gsap$1.set([markerStartTrigger, markerEndTrigger], { force3D: true });
				markerStartSetter = gsap$1.quickSetter(markerStartTrigger, direction.a, _px);
				markerEndSetter = gsap$1.quickSetter(markerEndTrigger, direction.a, _px);
			}
		}
		if (containerAnimation) {
			var oldOnUpdate = containerAnimation.vars.onUpdate, oldParams = containerAnimation.vars.onUpdateParams;
			containerAnimation.eventCallback("onUpdate", function() {
				self.update(0, 0, 1);
				oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
			});
		}
		self.previous = function() {
			return _triggers[_triggers.indexOf(self) - 1];
		};
		self.next = function() {
			return _triggers[_triggers.indexOf(self) + 1];
		};
		self.revert = function(revert, temp) {
			if (!temp) return self.kill(true);
			var r = revert !== false || !self.enabled, prevRefreshing = _refreshing;
			if (r !== self.isReverted) {
				if (r) {
					prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0);
					prevProgress = self.progress;
					prevAnimProgress = animation && animation.progress();
				}
				markerStart && [
					markerStart,
					markerEnd,
					markerStartTrigger,
					markerEndTrigger
				].forEach(function(m) {
					return m.style.display = r ? "none" : "block";
				});
				if (r) {
					_refreshing = self;
					self.update(r);
				}
				if (pin && (!pinReparent || !self.isActive)) {
					if (r) _swapPinOut(pin, spacer, pinOriginalState);
					else _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
				}
				r || self.update(r);
				_refreshing = prevRefreshing;
				self.isReverted = r;
			}
		};
		self.refresh = function(soft, force, position, pinOffset) {
			if ((_refreshing || !self.enabled) && !force) return;
			if (pin && soft && _lastScrollTime) {
				_addListener(ScrollTrigger, "scrollEnd", _softRefresh);
				return;
			}
			!_refreshingAll && onRefreshInit && onRefreshInit(self);
			_refreshing = self;
			if (tweenTo.tween && !position) {
				tweenTo.tween.kill();
				tweenTo.tween = 0;
			}
			scrubTween && scrubTween.pause();
			if (invalidateOnRefresh && animation) {
				animation.revert({ kill: false }).invalidate();
				animation.getChildren ? animation.getChildren(true, true, false).forEach(function(t) {
					return t.vars.immediateRender && t.render(0, true, true);
				}) : animation.vars.immediateRender && animation.render(0, true, true);
			}
			self.isReverted || self.revert(true, true);
			self._subPinOffset = false;
			var size = getScrollerSize(), scrollerBounds = getScrollerOffsets(), max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction), isFirstRefresh = change <= .01 || !change, offset = 0, otherPinOffset = pinOffset || 0, parsedEnd = _isObject(position) ? position.end : vars.end, parsedEndTrigger = vars.endTrigger || trigger, parsedStart = _isObject(position) ? position.start : vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"), pinnedContainer = self.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer, self), triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0, i = triggerIndex, cs, bounds, scroll, isVertical, override, curTrigger, curPin, oppositeScroll, initted, revertedPins, forcedOverflow, markerStartOffset, markerEndOffset;
			if (markers && _isObject(position)) {
				markerStartOffset = gsap$1.getProperty(markerStartTrigger, direction.p);
				markerEndOffset = gsap$1.getProperty(markerEndTrigger, direction.p);
			}
			while (i-- > 0) {
				curTrigger = _triggers[i];
				curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self);
				curPin = curTrigger.pin;
				if (curPin && (curPin === trigger || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
					revertedPins || (revertedPins = []);
					revertedPins.unshift(curTrigger);
					curTrigger.revert(true, true);
				}
				if (curTrigger !== _triggers[i]) {
					triggerIndex--;
					i--;
				}
			}
			_isFunction(parsedStart) && (parsedStart = parsedStart(self));
			parsedStart = _parseClamp(parsedStart, "start", self);
			start = _parsePosition(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._startClamp && "_startClamp") || (pin ? -.001 : 0);
			_isFunction(parsedEnd) && (parsedEnd = parsedEnd(self));
			if (_isString(parsedEnd) && !parsedEnd.indexOf("+=")) {
				if (~parsedEnd.indexOf(" ")) parsedEnd = (_isString(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
				else {
					offset = _offsetToPx(parsedEnd.substr(2), size);
					parsedEnd = _isString(parsedStart) ? parsedStart : (containerAnimation ? gsap$1.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset;
					parsedEndTrigger = trigger;
				}
			}
			parsedEnd = _parseClamp(parsedEnd, "end", self);
			end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._endClamp && "_endClamp")) || -.001;
			offset = 0;
			i = triggerIndex;
			while (i--) {
				curTrigger = _triggers[i] || {};
				curPin = curTrigger.pin;
				if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
					cs = curTrigger.end - (self._startClamp ? Math.max(0, curTrigger.start) : curTrigger.start);
					if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && isNaN(parsedStart)) offset += cs * (1 - curTrigger.progress);
					curPin === pin && (otherPinOffset += cs);
				}
			}
			start += offset;
			end += offset;
			self._startClamp && (self._startClamp += offset);
			if (self._endClamp && !_refreshingAll) {
				self._endClamp = end || -.001;
				end = Math.min(end, _maxScroll(scroller, direction));
			}
			change = end - start || (start -= .01) && .001;
			if (isFirstRefresh) prevProgress = gsap$1.utils.clamp(0, 1, gsap$1.utils.normalize(start, end, prevScroll));
			self._pinPush = otherPinOffset;
			if (markerStart && offset) {
				cs = {};
				cs[direction.a] = "+=" + offset;
				pinnedContainer && (cs[direction.p] = "-=" + scrollFunc());
				gsap$1.set([markerStart, markerEnd], cs);
			}
			if (pin && !(_clampingMax && self.end >= _maxScroll(scroller, direction))) {
				cs = _getComputedStyle(pin);
				isVertical = direction === _vertical;
				scroll = scrollFunc();
				pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
				if (!max && end > 1) {
					forcedOverflow = (isViewport ? _doc.scrollingElement || _docEl : scroller).style;
					forcedOverflow = {
						style: forcedOverflow,
						value: forcedOverflow["overflow" + direction.a.toUpperCase()]
					};
					if (isViewport && _getComputedStyle(_body)["overflow" + direction.a.toUpperCase()] !== "scroll") forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
				}
				_swapPinIn(pin, spacer, cs);
				pinState = _getState(pin);
				bounds = _getBounds(pin, true);
				oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();
				if (pinSpacing) {
					spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
					spacerState.t = spacer;
					i = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
					if (i) {
						spacerState.push(direction.d, i + _px);
						spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
					}
					_setState(spacerState);
					if (pinnedContainer) _triggers.forEach(function(t) {
						if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) t._subPinOffset = true;
					});
					useFixedPosition && scrollFunc(prevScroll);
				} else {
					i = _getSize(pin, direction);
					i && spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
				}
				if (useFixedPosition) {
					override = {
						top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
						left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
						boxSizing: "border-box",
						position: "fixed"
					};
					override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
					override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
					override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
					override[_padding] = cs[_padding];
					override[_padding + _Top] = cs[_padding + _Top];
					override[_padding + _Right] = cs[_padding + _Right];
					override[_padding + _Bottom] = cs[_padding + _Bottom];
					override[_padding + _Left] = cs[_padding + _Left];
					pinActiveState = _copyState(pinOriginalState, override, pinReparent);
					_refreshingAll && scrollFunc(0);
				}
				if (animation) {
					initted = animation._initted;
					_suppressOverwrites(1);
					animation.render(animation.duration(), true, true);
					pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
					pinMoves = Math.abs(change - pinChange) > 1;
					useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2);
					animation.render(0, true, true);
					initted || animation.invalidate(true);
					animation.parent || animation.totalTime(animation.totalTime());
					_suppressOverwrites(0);
				} else pinChange = change;
				forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
			} else if (trigger && scrollFunc() && !containerAnimation) {
				bounds = trigger.parentNode;
				while (bounds && bounds !== _body) {
					if (bounds._pinOffset) {
						start -= bounds._pinOffset;
						end -= bounds._pinOffset;
					}
					bounds = bounds.parentNode;
				}
			}
			revertedPins && revertedPins.forEach(function(t) {
				return t.revert(false, true);
			});
			self.start = start;
			self.end = end;
			scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc();
			if (!containerAnimation && !_refreshingAll) {
				scroll1 < prevScroll && scrollFunc(prevScroll);
				self.scroll.rec = 0;
			}
			self.revert(false, true);
			lastRefresh = _getTime();
			if (snapDelayedCall) {
				lastSnap = -1;
				snapDelayedCall.restart(true);
			}
			_refreshing = 0;
			animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress || 0, true).render(animation.time(), true, true);
			if (isFirstRefresh || prevProgress !== self.progress || containerAnimation || invalidateOnRefresh || animation && !animation._initted) {
				animation && !isToggle && (animation._initted || prevProgress || animation.vars.immediateRender !== false) && animation.totalProgress(containerAnimation && start < -.001 && !prevProgress ? gsap$1.utils.normalize(start, end, 0) : prevProgress, true);
				self.progress = isFirstRefresh || (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
			}
			pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
			scrubTween && scrubTween.invalidate();
			if (!isNaN(markerStartOffset)) {
				markerStartOffset -= gsap$1.getProperty(markerStartTrigger, direction.p);
				markerEndOffset -= gsap$1.getProperty(markerEndTrigger, direction.p);
				_shiftMarker(markerStartTrigger, direction, markerStartOffset);
				_shiftMarker(markerStart, direction, markerStartOffset - (pinOffset || 0));
				_shiftMarker(markerEndTrigger, direction, markerEndOffset);
				_shiftMarker(markerEnd, direction, markerEndOffset - (pinOffset || 0));
			}
			isFirstRefresh && !_refreshingAll && self.update();
			if (onRefresh && !_refreshingAll && !executingOnRefresh) {
				executingOnRefresh = true;
				onRefresh(self);
				executingOnRefresh = false;
			}
		};
		self.getVelocity = function() {
			return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1e3 || 0;
		};
		self.endAnimation = function() {
			_endAnimation(self.callbackAnimation);
			if (animation) scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
		};
		self.labelToScroll = function(label) {
			return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
		};
		self.getTrailing = function(name) {
			var i = _triggers.indexOf(self), a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);
			return (_isString(name) ? a.filter(function(t) {
				return t.vars.preventOverlaps === name;
			}) : a).filter(function(t) {
				return self.direction > 0 ? t.end <= start : t.start >= end;
			});
		};
		self.update = function(reset, recordVelocity, forceFake) {
			if (containerAnimation && !forceFake && !reset) return;
			var scroll = _refreshingAll === true ? prevScroll : self.scroll(), p = reset ? 0 : (scroll - start) / change, clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0, prevProgress = self.progress, isActive, wasActive, toggleState, action, stateChanged, toggled, isAtMax, isTakingAction;
			if (recordVelocity) {
				scroll2 = scroll1;
				scroll1 = containerAnimation ? scrollFunc() : scroll;
				if (snap) {
					snap2 = snap1;
					snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
				}
			}
			if (anticipatePin && pin && !_refreshing && !_startup && _lastScrollTime) {
				if (!clipped && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) clipped = 1e-4;
				else if (clipped === 1 && end > scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) clipped = .9999;
			}
			if (clipped !== prevProgress && self.enabled) {
				isActive = self.isActive = !!clipped && clipped < 1;
				wasActive = !!prevProgress && prevProgress < 1;
				toggled = isActive !== wasActive;
				stateChanged = toggled || !!clipped !== !!prevProgress;
				self.direction = clipped > prevProgress ? 1 : -1;
				self.progress = clipped;
				if (stateChanged && !_refreshing) {
					toggleState = clipped && !prevProgress ? 0 : clipped === 1 ? 1 : prevProgress === 1 ? 2 : 3;
					if (isToggle) {
						action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState];
						isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
					}
				}
				preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function(t) {
					return t.endAnimation();
				}));
				if (!isToggle) {
					if (scrubTween && !_refreshing && !_startup) {
						scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start);
						if (scrubTween.resetTo) scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
						else {
							scrubTween.vars.totalProgress = clipped;
							scrubTween.invalidate().restart();
						}
					} else if (animation) animation.totalProgress(clipped, !!(_refreshing && (lastRefresh || reset)));
				}
				if (pin) {
					reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
					if (!useFixedPosition) pinSetter(_round(pinStart + pinChange * clipped));
					else if (stateChanged) {
						isAtMax = !reset && clipped > prevProgress && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction);
						if (pinReparent) {
							if (!reset && (isActive || isAtMax)) {
								var bounds = _getBounds(pin, true), _offset = scroll - start;
								_reparent(pin, _body, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
							} else _reparent(pin, spacer);
						}
						_setState(isActive || isAtMax ? pinActiveState : pinState);
						pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
					}
				}
				snap && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
				toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray$1(toggleClass.targets).forEach(function(el) {
					return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
				});
				onUpdate && !isToggle && !reset && onUpdate(self);
				if (stateChanged && !_refreshing) {
					if (isToggle) {
						if (isTakingAction) {
							if (action === "complete") animation.pause().totalProgress(1);
							else if (action === "reset") animation.restart(true).pause();
							else if (action === "restart") animation.restart(true);
							else animation[action]();
						}
						onUpdate && onUpdate(self);
					}
					if (toggled || !_limitCallbacks) {
						onToggle && toggled && _callback(self, onToggle);
						callbacks[toggleState] && _callback(self, callbacks[toggleState]);
						once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0);
						if (!toggled) {
							toggleState = clipped === 1 ? 1 : 3;
							callbacks[toggleState] && _callback(self, callbacks[toggleState]);
						}
					}
					if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber(fastScrollEnd) ? fastScrollEnd : 2500)) {
						_endAnimation(self.callbackAnimation);
						scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
					}
				} else if (isToggle && onUpdate && !_refreshing) onUpdate(self);
			}
			if (markerEndSetter) {
				var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
				markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
				markerEndSetter(n);
			}
			caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
		};
		self.enable = function(reset, refresh) {
			if (!self.enabled) {
				self.enabled = true;
				_addListener(scroller, "resize", _onResize);
				isViewport || _addListener(scroller, "scroll", _onScroll);
				onRefreshInit && _addListener(ScrollTrigger, "refreshInit", onRefreshInit);
				if (reset !== false) {
					self.progress = prevProgress = 0;
					scroll1 = scroll2 = lastSnap = scrollFunc();
				}
				refresh !== false && self.refresh();
			}
		};
		self.getTween = function(snap) {
			return snap && tweenTo ? tweenTo.tween : scrubTween;
		};
		self.setPositions = function(newStart, newEnd, keepClamp, pinOffset) {
			if (containerAnimation) {
				var st = containerAnimation.scrollTrigger, duration = containerAnimation.duration(), _change = st.end - st.start;
				newStart = st.start + _change * newStart / duration;
				newEnd = st.start + _change * newEnd / duration;
			}
			self.refresh(false, false, {
				start: _keepClamp(newStart, keepClamp && !!self._startClamp),
				end: _keepClamp(newEnd, keepClamp && !!self._endClamp)
			}, pinOffset);
			self.update();
		};
		self.adjustPinSpacing = function(amount) {
			if (spacerState && amount) {
				var i = spacerState.indexOf(direction.d) + 1;
				spacerState[i] = parseFloat(spacerState[i]) + amount + _px;
				spacerState[1] = parseFloat(spacerState[1]) + amount + _px;
				_setState(spacerState);
			}
		};
		self.disable = function(reset, allowAnimation) {
			reset !== false && self.revert(true, true);
			if (self.enabled) {
				self.enabled = self.isActive = false;
				allowAnimation || scrubTween && scrubTween.pause();
				prevScroll = 0;
				pinCache && (pinCache.uncache = 1);
				onRefreshInit && _removeListener(ScrollTrigger, "refreshInit", onRefreshInit);
				if (snapDelayedCall) {
					snapDelayedCall.pause();
					tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
				}
				if (!isViewport) {
					var i = _triggers.length;
					while (i--) if (_triggers[i].scroller === scroller && _triggers[i] !== self) return;
					_removeListener(scroller, "resize", _onResize);
					isViewport || _removeListener(scroller, "scroll", _onScroll);
				}
			}
		};
		self.kill = function(revert, allowAnimation) {
			self.disable(revert, allowAnimation);
			scrubTween && !allowAnimation && scrubTween.kill();
			id && delete _ids[id];
			var i = _triggers.indexOf(self);
			i >= 0 && _triggers.splice(i, 1);
			i === _i && _direction > 0 && _i--;
			i = 0;
			_triggers.forEach(function(t) {
				return t.scroller === self.scroller && (i = 1);
			});
			i || _refreshingAll || (self.scroll.rec = 0);
			if (animation) {
				animation.scrollTrigger = null;
				revert && animation.revert({ kill: false });
				allowAnimation || animation.kill();
			}
			markerStart && [
				markerStart,
				markerEnd,
				markerStartTrigger,
				markerEndTrigger
			].forEach(function(m) {
				return m.parentNode && m.parentNode.removeChild(m);
			});
			_primary === self && (_primary = 0);
			if (pin) {
				pinCache && (pinCache.uncache = 1);
				i = 0;
				_triggers.forEach(function(t) {
					return t.pin === pin && i++;
				});
				i || (pinCache.spacer = 0);
			}
			vars.onKill && vars.onKill(self);
		};
		_triggers.push(self);
		self.enable(false, false);
		customRevertReturn && customRevertReturn(self);
		if (animation && animation.add && !change) {
			var updateFunc = self.update;
			self.update = function() {
				self.update = updateFunc;
				_scrollers.cache++;
				start || end || self.refresh();
			};
			gsap$1.delayedCall(.01, self.update);
			change = .01;
			start = end = 0;
		} else self.refresh();
		pin && _queueRefreshAll();
	};
	ScrollTrigger.register = function register(core) {
		if (!_coreInitted$1) {
			gsap$1 = core || _getGSAP();
			_windowExists() && window.document && ScrollTrigger.enable();
			_coreInitted$1 = _enabled;
		}
		return _coreInitted$1;
	};
	ScrollTrigger.defaults = function defaults(config) {
		if (config) for (var p in config) _defaults[p] = config[p];
		return _defaults;
	};
	ScrollTrigger.disable = function disable(reset, kill) {
		_enabled = 0;
		_triggers.forEach(function(trigger) {
			return trigger[kill ? "kill" : "disable"](reset);
		});
		_removeListener(_win, "wheel", _onScroll);
		_removeListener(_doc, "scroll", _onScroll);
		clearInterval(_syncInterval);
		_removeListener(_doc, "touchcancel", _passThrough);
		_removeListener(_body, "touchstart", _passThrough);
		_multiListener(_removeListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);
		_multiListener(_removeListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);
		_resizeDelay.kill();
		_iterateAutoRefresh(_removeListener);
		for (var i = 0; i < _scrollers.length; i += 3) {
			_wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);
			_wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
		}
	};
	ScrollTrigger.enable = function enable() { window.__enableCalls = (window.__enableCalls || 0) + 1; const __t0 = performance.now(); try { return __enableBody.apply(this, arguments); } finally { window.__enableMs = (window.__enableMs || 0) + performance.now() - __t0; } }; function __enableBody() {
		_win = window;
		_doc = document;
		_docEl = _doc.documentElement;
		_body = _doc.body;
		if (gsap$1) {
			_toArray$1 = gsap$1.utils.toArray;
			_clamp = gsap$1.utils.clamp;
			_context$1 = gsap$1.core.context || _passThrough;
			_suppressOverwrites = gsap$1.core.suppressOverwrites || _passThrough;
			_scrollRestoration = _win.history.scrollRestoration || "auto";
			_lastScroll = _win.pageYOffset || 0;
			gsap$1.core.globals("ScrollTrigger", ScrollTrigger);
			if (_body) {
				_enabled = 1;
				_div100vh = document.createElement("div");
				_div100vh.style.height = "100vh";
				_div100vh.style.position = "absolute";
				_refresh100vh();
				_rafBugFix();
				Observer.register(gsap$1);
				ScrollTrigger.isTouch = Observer.isTouch;
				_fixIOSBug = Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent);
				_ignoreMobileResize = Observer.isTouch === 1;
				_addListener(_win, "wheel", _onScroll);
				_root = [
					_win,
					_doc,
					_docEl,
					_body
				];
				if (gsap$1.matchMedia) {
					ScrollTrigger.matchMedia = function(vars) {
						var mm = gsap$1.matchMedia(), p;
						for (p in vars) mm.add(p, vars[p]);
						return mm;
					};
					gsap$1.addEventListener("matchMediaInit", function() {
						_recordScrollPositions();
						_revertAll();
					});
					gsap$1.addEventListener("matchMediaRevert", function() {
						return _revertRecorded();
					});
					gsap$1.addEventListener("matchMedia", function() {
						_refreshAll(0, 1);
						_dispatch("matchMedia");
					});
					gsap$1.matchMedia().add("(orientation: portrait)", function() {
						_setBaseDimensions();
						return _setBaseDimensions;
					});
				} else console.warn("Requires GSAP 3.11.0 or later");
				_setBaseDimensions();
				_addListener(_doc, "scroll", _onScroll);
				var bodyHasStyle = _body.hasAttribute("style"), bodyStyle = _body.style, border = bodyStyle.borderTopStyle, AnimationProto = gsap$1.core.Animation.prototype, bounds, i;
				AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", { value: function value() {
					return this.time(-.01, true);
				} });
				bodyStyle.borderTopStyle = "solid";
				bounds = _getBounds(_body);
				_vertical.m = Math.round(bounds.top + _vertical.sc()) || 0;
				_horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
				border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style");
				if (!bodyHasStyle) {
					_body.setAttribute("style", "");
					_body.removeAttribute("style");
				}
				_syncInterval = setInterval(_sync, 250);
				gsap$1.delayedCall(.5, function() {
					return _startup = 0;
				});
				_addListener(_doc, "touchcancel", _passThrough);
				_addListener(_body, "touchstart", _passThrough);
				_multiListener(_addListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);
				_multiListener(_addListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);
				_transformProp = gsap$1.utils.checkPrefix("transform");
				_stateProps.push(_transformProp);
				_coreInitted$1 = _getTime();
				_resizeDelay = gsap$1.delayedCall(.2, _refreshAll).pause();
				_autoRefresh = [
					_doc,
					"visibilitychange",
					function() {
						var w = _win.innerWidth, h = _win.innerHeight;
						if (_doc.hidden) {
							_prevWidth = w;
							_prevHeight = h;
						} else if (_prevWidth !== w || _prevHeight !== h) _onResize();
					},
					_doc,
					"DOMContentLoaded",
					_refreshAll,
					_win,
					"load",
					_refreshAll,
					_win,
					"resize",
					_onResize
				];
				_iterateAutoRefresh(_addListener);
				_triggers.forEach(function(trigger) {
					return trigger.enable(0, 1);
				});
				for (i = 0; i < _scrollers.length; i += 3) {
					_wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);
					_wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
				}
			} else if (_doc) _doc.addEventListener("DOMContentLoaded", function onLoad() {
				ScrollTrigger.enable();
				_doc.removeEventListener("DOMContentLoaded", onLoad);
			});
		}
	};
	ScrollTrigger.config = function config(vars) {
		"limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
		var ms = vars.syncInterval;
		ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
		"ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger.isTouch === 1 && vars.ignoreMobileResize);
		if ("autoRefreshEvents" in vars) {
			_iterateAutoRefresh(_removeListener) || _iterateAutoRefresh(_addListener, vars.autoRefreshEvents || "none");
			_ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
		}
	};
	ScrollTrigger.scrollerProxy = function scrollerProxy(target, vars) {
		var t = _getTarget(target), i = _scrollers.indexOf(t), isViewport = _isViewport(t);
		if (~i) _scrollers.splice(i, isViewport ? 6 : 2);
		if (vars) isViewport ? _proxies.unshift(_win, vars, _body, vars, _docEl, vars) : _proxies.unshift(t, vars);
	};
	ScrollTrigger.clearMatchMedia = function clearMatchMedia(query) {
		_triggers.forEach(function(t) {
			return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
		});
	};
	ScrollTrigger.isInViewport = function isInViewport(element, ratio, horizontal) {
		var bounds = (_isString(element) ? _getTarget(element) : element).getBoundingClientRect(), offset = bounds[horizontal ? _width : _height] * ratio || 0;
		return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win.innerHeight;
	};
	ScrollTrigger.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
		_isString(element) && (element = _getTarget(element));
		var bounds = element.getBoundingClientRect(), size = bounds[horizontal ? _width : _height], offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
		return horizontal ? (bounds.left + offset) / _win.innerWidth : (bounds.top + offset) / _win.innerHeight;
	};
	ScrollTrigger.killAll = function killAll(allowListeners) {
		_triggers.slice(0).forEach(function(t) {
			return t.vars.id !== "ScrollSmoother" && t.kill();
		});
		if (allowListeners !== true) {
			var listeners = _listeners.killAll || [];
			_listeners = {};
			listeners.forEach(function(f) {
				return f();
			});
		}
	};
	return ScrollTrigger;
}();
ScrollTrigger.version = "3.15.0";
ScrollTrigger.saveStyles = function(targets) {
	return targets ? _toArray$1(targets).forEach(function(target) {
		if (target && target.style) {
			var i = _savedStyles.indexOf(target);
			i >= 0 && _savedStyles.splice(i, 5);
			_savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap$1.core.getCache(target), _context$1());
		}
	}) : _savedStyles;
};
ScrollTrigger.revert = function(soft, media) {
	return _revertAll(!soft, media);
};
ScrollTrigger.create = function(vars, animation) {
	return new ScrollTrigger(vars, animation);
};
ScrollTrigger.refresh = function(safe) {
	return safe ? _onResize(true) : (_coreInitted$1 || ScrollTrigger.register()) && _refreshAll(true);
};
ScrollTrigger.update = function(force) {
	return ++_scrollers.cache && _updateAll(force === true ? 2 : 0);
};
ScrollTrigger.clearScrollMemory = _clearScrollMemory;
ScrollTrigger.maxScroll = function(element, horizontal) {
	return _maxScroll(element, horizontal ? _horizontal : _vertical);
};
ScrollTrigger.getScrollFunc = function(element, horizontal) {
	return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
};
ScrollTrigger.getById = function(id) {
	return _ids[id];
};
ScrollTrigger.getAll = function() {
	return _triggers.filter(function(t) {
		return t.vars.id !== "ScrollSmoother";
	});
};
ScrollTrigger.isScrolling = function() {
	return !!_lastScrollTime;
};
ScrollTrigger.snapDirectional = _snapDirectional;
ScrollTrigger.addEventListener = function(type, callback) {
	var a = _listeners[type] || (_listeners[type] = []);
	~a.indexOf(callback) || a.push(callback);
};
ScrollTrigger.removeEventListener = function(type, callback) {
	var a = _listeners[type], i = a && a.indexOf(callback);
	i >= 0 && a.splice(i, 1);
};
ScrollTrigger.batch = function(targets, vars) {
	var result = [], varsCopy = {}, interval = vars.interval || .016, batchMax = vars.batchMax || 1e9, proxyCallback = function proxyCallback(type, callback) {
		var elements = [], triggers = [], delay = gsap$1.delayedCall(interval, function() {
			callback(elements, triggers);
			elements = [];
			triggers = [];
		}).pause();
		return function(self) {
			elements.length || delay.restart(true);
			elements.push(self.trigger);
			triggers.push(self);
			batchMax <= elements.length && delay.progress(1);
		};
	}, p;
	for (p in vars) varsCopy[p] = p.substr(0, 2) === "on" && _isFunction(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
	if (_isFunction(batchMax)) {
		batchMax = batchMax();
		_addListener(ScrollTrigger, "refresh", function() {
			return batchMax = vars.batchMax();
		});
	}
	_toArray$1(targets).forEach(function(target) {
		var config = {};
		for (p in varsCopy) config[p] = varsCopy[p];
		config.trigger = target;
		result.push(ScrollTrigger.create(config));
	});
	return result;
};
var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier(scrollFunc, current, end, max) {
	current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
	return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
};
var _allowNativePanning = function _allowNativePanning(target, direction) {
	if (direction === true) target.style.removeProperty("touch-action");
	else target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (Observer.isTouch ? " pinch-zoom" : "") : "none";
	target === _docEl && _allowNativePanning(_body, direction);
};
var _overflow = {
	auto: 1,
	scroll: 1
};
var _nestedScroll = function _nestedScroll(_ref5) {
	var event = _ref5.event, target = _ref5.target, axis = _ref5.axis;
	var node = (event.changedTouches ? event.changedTouches[0] : event).target, cache = node._gsap || gsap$1.core.getCache(node), time = _getTime(), cs;
	if (!cache._isScrollT || time - cache._isScrollT > 2e3) {
		while (node && node !== _body && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]))) node = node.parentNode;
		cache._isScroll = node && node !== target && !_isViewport(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
		cache._isScrollT = time;
	}
	if (cache._isScroll || axis === "x") {
		event.stopPropagation();
		event._gsapAllow = true;
	}
};
var _inputObserver = function _inputObserver(target, type, inputs, nested) {
	return Observer.create({
		target,
		capture: true,
		debounce: false,
		lockAxis: true,
		type,
		onWheel: nested = nested && _nestedScroll,
		onPress: nested,
		onDrag: nested,
		onScroll: nested,
		onEnable: function onEnable() {
			return inputs && _addListener(_doc, Observer.eventTypes[0], _captureInputs, false, true);
		},
		onDisable: function onDisable() {
			return _removeListener(_doc, Observer.eventTypes[0], _captureInputs, true);
		}
	});
};
var _inputExp = /(input|label|select|textarea)/i;
var _inputIsFocused;
var _captureInputs = function _captureInputs(e) {
	var isInput = _inputExp.test(e.target.tagName);
	if (isInput || _inputIsFocused) {
		e._gsapAllow = true;
		_inputIsFocused = isInput;
	}
};
var _getScrollNormalizer = function _getScrollNormalizer(vars) {
	_isObject(vars) || (vars = {});
	vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
	vars.type || (vars.type = "wheel,touch");
	vars.debounce = !!vars.debounce;
	vars.id = vars.id || "normalizer";
	var _vars2 = vars, normalizeScrollX = _vars2.normalizeScrollX, momentum = _vars2.momentum, allowNestedScroll = _vars2.allowNestedScroll, onRelease = _vars2.onRelease, self, maxY, target = _getTarget(vars.target) || _docEl, smoother = gsap$1.core.globals().ScrollSmoother, smootherInstance = smoother && smoother.get(), content = _fixIOSBug && (vars.content && _getTarget(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()), scrollFuncY = _getScrollFunc(target, _vertical), scrollFuncX = _getScrollFunc(target, _horizontal), scale = 1, initialScale = (Observer.isTouch && _win.visualViewport ? _win.visualViewport.scale * _win.visualViewport.width : _win.outerWidth) / _win.innerWidth, wheelRefresh = 0, resolveMomentumDuration = _isFunction(momentum) ? function() {
		return momentum(self);
	} : function() {
		return momentum || 2.8;
	}, lastRefreshID, skipTouchMove, inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll), resumeTouchMove = function resumeTouchMove() {
		return skipTouchMove = false;
	}, scrollClampX = _passThrough, scrollClampY = _passThrough, updateClamps = function updateClamps() {
		maxY = _maxScroll(target, _vertical);
		scrollClampY = _clamp(_fixIOSBug ? 1 : 0, maxY);
		normalizeScrollX && (scrollClampX = _clamp(0, _maxScroll(target, _horizontal)));
		lastRefreshID = _refreshID;
	}, removeContentOffset = function removeContentOffset() {
		content._gsap.y = _round(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
		content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
		scrollFuncY.offset = scrollFuncY.cacheID = 0;
	}, ignoreDrag = function ignoreDrag() {
		if (skipTouchMove) {
			requestAnimationFrame(resumeTouchMove);
			var offset = _round(self.deltaY / 2), scroll = scrollClampY(scrollFuncY.v - offset);
			if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
				scrollFuncY.offset = scroll - scrollFuncY.v;
				var y = _round((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);
				content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
				content._gsap.y = y + "px";
				scrollFuncY.cacheID = _scrollers.cache;
				_updateAll();
			}
			return true;
		}
		scrollFuncY.offset && removeContentOffset();
		skipTouchMove = true;
	}, tween, startScrollX, startScrollY, onStopDelayedCall, onResize = function onResize() {
		updateClamps();
		if (tween.isActive() && tween.vars.scrollY > maxY) scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
	};
	content && gsap$1.set(content, { y: "+=0" });
	vars.ignoreCheck = function(e) {
		return _fixIOSBug && e.type === "touchmove" && ignoreDrag(e) || scale > 1.05 && e.type !== "touchstart" || self.isGesturing || e.touches && e.touches.length > 1;
	};
	vars.onPress = function() {
		skipTouchMove = false;
		var prevScale = scale;
		scale = _round((_win.visualViewport && _win.visualViewport.scale || 1) / initialScale);
		tween.pause();
		prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
		startScrollX = scrollFuncX();
		startScrollY = scrollFuncY();
		updateClamps();
		lastRefreshID = _refreshID;
	};
	vars.onRelease = vars.onGestureStart = function(self, wasDragging) {
		scrollFuncY.offset && removeContentOffset();
		if (!wasDragging) onStopDelayedCall.restart(true);
		else {
			_scrollers.cache++;
			var dur = resolveMomentumDuration(), currentScroll, endScroll;
			if (normalizeScrollX) {
				currentScroll = scrollFuncX();
				endScroll = currentScroll + dur * .05 * -self.velocityX / .227;
				dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, _horizontal));
				tween.vars.scrollX = scrollClampX(endScroll);
			}
			currentScroll = scrollFuncY();
			endScroll = currentScroll + dur * .05 * -self.velocityY / .227;
			dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, _vertical));
			tween.vars.scrollY = scrollClampY(endScroll);
			tween.invalidate().duration(dur).play(.01);
			if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) gsap$1.to({}, {
				onUpdate: onResize,
				duration: dur
			});
		}
		onRelease && onRelease(self);
	};
	vars.onWheel = function() {
		tween._ts && tween.pause();
		if (_getTime() - wheelRefresh > 1e3) {
			lastRefreshID = 0;
			wheelRefresh = _getTime();
		}
	};
	vars.onChange = function(self, dx, dy, xArray, yArray) {
		_refreshID !== lastRefreshID && updateClamps();
		dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self.startX - self.x) : scrollFuncX() + dx - xArray[1]));
		if (dy) {
			scrollFuncY.offset && removeContentOffset();
			var isTouch = yArray[2] === dy, y = isTouch ? startScrollY + self.startY - self.y : scrollFuncY() + dy - yArray[1], yClamped = scrollClampY(y);
			isTouch && y !== yClamped && (startScrollY += yClamped - y);
			scrollFuncY(yClamped);
		}
		(dy || dx) && _updateAll();
	};
	vars.onEnable = function() {
		_allowNativePanning(target, normalizeScrollX ? false : "x");
		ScrollTrigger.addEventListener("refresh", onResize);
		_addListener(_win, "resize", onResize);
		if (scrollFuncY.smooth) {
			scrollFuncY.target.style.scrollBehavior = "auto";
			scrollFuncY.smooth = scrollFuncX.smooth = false;
		}
		inputObserver.enable();
	};
	vars.onDisable = function() {
		_allowNativePanning(target, true);
		_removeListener(_win, "resize", onResize);
		ScrollTrigger.removeEventListener("refresh", onResize);
		inputObserver.kill();
	};
	vars.lockAxis = vars.lockAxis !== false;
	self = new Observer(vars);
	self.iOS = _fixIOSBug;
	_fixIOSBug && !scrollFuncY() && scrollFuncY(1);
	_fixIOSBug && gsap$1.ticker.add(_passThrough);
	onStopDelayedCall = self._dc;
	tween = gsap$1.to(self, {
		ease: "power4",
		paused: true,
		inherit: false,
		scrollX: normalizeScrollX ? "+=0.1" : "+=0",
		scrollY: "+=0.1",
		modifiers: { scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function() {
			return tween.pause();
		}) },
		onUpdate: _updateAll,
		onComplete: onStopDelayedCall.vars.onComplete
	});
	return self;
};
ScrollTrigger.sort = function(func) {
	if (_isFunction(func)) return _triggers.sort(func);
	var scroll = _win.pageYOffset || 0;
	ScrollTrigger.getAll().forEach(function(t) {
		return t._sortY = t.trigger ? scroll + t.trigger.getBoundingClientRect().top : t.start + _win.innerHeight;
	});
	return _triggers.sort(func || function(a, b) {
		return (a.vars.refreshPriority || 0) * -1e6 + (a.vars.containerAnimation ? 1e6 : a._sortY) - ((b.vars.containerAnimation ? 1e6 : b._sortY) + (b.vars.refreshPriority || 0) * -1e6);
	});
};
ScrollTrigger.observe = function(vars) {
	return new Observer(vars);
};
ScrollTrigger.normalizeScroll = function(vars) {
	if (typeof vars === "undefined") return _normalizer;
	if (vars === true && _normalizer) return _normalizer.enable();
	if (vars === false) {
		_normalizer && _normalizer.kill();
		_normalizer = vars;
		return;
	}
	var normalizer = vars instanceof Observer ? vars : _getScrollNormalizer(vars);
	_normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
	_isViewport(normalizer.target) && (_normalizer = normalizer);
	return normalizer;
};
ScrollTrigger.core = {
	_getVelocityProp,
	_inputObserver,
	_scrollers,
	_proxies,
	bridge: {
		ss: function ss() {
			_lastScrollTime || _dispatch("scrollStart");
			_lastScrollTime = _getTime();
		},
		ref: function ref() {
			return _refreshing;
		}
	}
};
_getGSAP() && gsap$1.registerPlugin(ScrollTrigger);
//#endregion
//#region node_modules/gsap/SplitText.js
/*!
* SplitText 3.15.0
* https://gsap.com
*
* @license Copyright 2026, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license.
* @author: Jack Doyle
*/
var gsap;
var _fonts;
var _splitProp = typeof Symbol === "function" ? Symbol() : "_split";
var _coreInitted;
var _initIfNecessary = () => _coreInitted || SplitText.register(window.gsap);
var _charSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter() : 0;
var _toArray = (r) => !r ? [] : typeof r === "string" ? _toArray(document.querySelectorAll(r)) : "length" in r ? Array.from(r).reduce((acc, cur) => {
	typeof cur === "string" ? acc.push(..._toArray(cur)) : acc.push(cur);
	return acc;
}, []) : [r];
var _elements = (targets) => _toArray(targets).filter((e) => e && e.nodeType === 1);
var _emptyArray = [];
var _context = function() {};
var _defaultContext = { add: (f) => f() };
var _spacesRegEx = /\s+/g;
var _emojiSafeRegEx = /* @__PURE__ */ new RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu");
var _emptyBounds = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
};
var _findNextValidBounds = (allBounds, startIndex) => {
	while (++startIndex < allBounds.length && allBounds[startIndex] === _emptyBounds);
	return allBounds[startIndex] || _emptyBounds;
};
var _revertOriginal = ({ element, html, ariaL, ariaH }) => {
	element.innerHTML = html;
	ariaL ? element.setAttribute("aria-label", ariaL) : element.removeAttribute("aria-label");
	ariaH ? element.setAttribute("aria-hidden", ariaH) : element.removeAttribute("aria-hidden");
};
var _stretchToFitSpecialChars = (collection, specialCharsRegEx) => {
	if (specialCharsRegEx) {
		let charsFound = new Set(collection.join("").match(specialCharsRegEx) || _emptyArray), i = collection.length, slots, word, char, combined;
		if (charsFound.size) while (--i > -1) {
			word = collection[i];
			for (char of charsFound) if (char.startsWith(word) && char.length > word.length) {
				slots = 0;
				combined = word;
				while (char.startsWith(combined += collection[i + ++slots]) && combined.length < char.length);
				if (slots && combined.length === char.length) {
					collection[i] = char;
					collection.splice(i + 1, slots);
					break;
				}
			}
		}
	}
	return collection;
};
var _disallowInline = (element) => window.getComputedStyle(element).display === "inline" && (element.style.display = "inline-block");
var _insertNodeBefore = (newChild, parent, existingChild) => parent.insertBefore(typeof newChild === "string" ? document.createTextNode(newChild) : newChild, existingChild);
var _getWrapper = (type, config, collection) => {
	let className = config[type + "sClass"] || "", { tag = "div", aria = "auto", propIndex = false } = config, display = type === "line" ? "block" : "inline-block", incrementClass = className.indexOf("++") > -1, wrapper = (text) => {
		let el = document.createElement(tag), i = collection.length + 1;
		className && (el.className = className + (incrementClass ? " " + className + i : ""));
		propIndex && el.style.setProperty("--" + type, i + "");
		aria !== "none" && el.setAttribute("aria-hidden", "true");
		if (tag !== "span") {
			el.style.position = "relative";
			el.style.display = display;
		}
		el.textContent = text;
		collection.push(el);
		return el;
	};
	incrementClass && (className = className.replace("++", ""));
	wrapper.collection = collection;
	return wrapper;
};
var _getLineWrapper = (element, nodes, config, collection) => {
	let lineWrapper = _getWrapper("line", config, collection), textAlign = window.getComputedStyle(element).textAlign || "left";
	return (startIndex, endIndex) => {
		let newLine = lineWrapper("");
		newLine.style.textAlign = textAlign;
		element.insertBefore(newLine, nodes[startIndex]);
		for (; startIndex < endIndex; startIndex++) newLine.appendChild(nodes[startIndex]);
		newLine.normalize();
	};
};
var _splitWordsAndCharsRecursively = (element, config, wordWrapper, charWrapper, prepForCharsOnly, deepSlice, ignore, charSplitRegEx, specialCharsRegEx, isNested) => {
	var _a;
	let nodes = Array.from(element.childNodes), i = 0, { wordDelimiter, reduceWhiteSpace = true, prepareText } = config, elementBounds = element.getBoundingClientRect(), lastBounds = elementBounds, isPreformatted = !reduceWhiteSpace && window.getComputedStyle(element).whiteSpace.substring(0, 3) === "pre", ignoredPreviousSibling = 0, wordsCollection = wordWrapper.collection, wordDelimIsNotSpace, wordDelimString, wordDelimSplitter, curNode, words, curWordEl, startsWithSpace, endsWithSpace, j, bounds, curWordChars, clonedNode, curSubNode, tempSubNode, curTextContent, wordText, lastWordText, k;
	if (typeof wordDelimiter === "object") {
		wordDelimSplitter = wordDelimiter.delimiter || wordDelimiter;
		wordDelimString = wordDelimiter.replaceWith || "";
	} else wordDelimString = wordDelimiter === "" ? "" : wordDelimiter || " ";
	wordDelimIsNotSpace = wordDelimString !== " ";
	for (; i < nodes.length; i++) {
		curNode = nodes[i];
		if (curNode.nodeType === 3) {
			curTextContent = curNode.textContent || "";
			if (reduceWhiteSpace) curTextContent = curTextContent.replace(_spacesRegEx, " ");
			else if (isPreformatted) curTextContent = curTextContent.replace(/\n/g, wordDelimString + "\n");
			prepareText && (curTextContent = prepareText(curTextContent, element));
			curNode.textContent = curTextContent;
			words = wordDelimString || wordDelimSplitter ? curTextContent.split(wordDelimSplitter || wordDelimString) : curTextContent.match(charSplitRegEx) || _emptyArray;
			lastWordText = words[words.length - 1];
			endsWithSpace = wordDelimIsNotSpace ? lastWordText.slice(-1) === " " : !lastWordText;
			lastWordText || words.pop();
			lastBounds = elementBounds;
			startsWithSpace = wordDelimIsNotSpace ? words[0].charAt(0) === " " : !words[0];
			startsWithSpace && _insertNodeBefore(" ", element, curNode);
			words[0] || words.shift();
			_stretchToFitSpecialChars(words, specialCharsRegEx);
			deepSlice && isNested || (curNode.textContent = "");
			for (j = 1; j <= words.length; j++) {
				wordText = words[j - 1];
				if (!reduceWhiteSpace && isPreformatted && wordText.charAt(0) === "\n") {
					(_a = curNode.previousSibling) == null || _a.remove();
					_insertNodeBefore(document.createElement("br"), element, curNode);
					wordText = wordText.slice(1);
				}
				if (!reduceWhiteSpace && wordText === "") _insertNodeBefore(wordDelimString, element, curNode);
				else if (wordText === " ") element.insertBefore(document.createTextNode(" "), curNode);
				else {
					wordDelimIsNotSpace && wordText.charAt(0) === " " && _insertNodeBefore(" ", element, curNode);
					if (ignoredPreviousSibling && j === 1 && !startsWithSpace && wordsCollection.indexOf(ignoredPreviousSibling.parentNode) > -1) {
						curWordEl = wordsCollection[wordsCollection.length - 1];
						curWordEl.appendChild(document.createTextNode(charWrapper ? "" : wordText));
					} else {
						curWordEl = wordWrapper(charWrapper ? "" : wordText);
						_insertNodeBefore(curWordEl, element, curNode);
						ignoredPreviousSibling && j === 1 && !startsWithSpace && curWordEl.insertBefore(ignoredPreviousSibling, curWordEl.firstChild);
					}
					if (charWrapper) {
						curWordChars = _charSegmenter ? _stretchToFitSpecialChars([..._charSegmenter.segment(wordText)].map((s) => s.segment), specialCharsRegEx) : wordText.match(charSplitRegEx) || _emptyArray;
						for (k = 0; k < curWordChars.length; k++) curWordEl.appendChild(curWordChars[k] === " " ? document.createTextNode(" ") : charWrapper(curWordChars[k]));
					}
					if (deepSlice && isNested) {
						curTextContent = curNode.textContent = curTextContent.substring(wordText.length + 1, curTextContent.length);
						bounds = curWordEl.getBoundingClientRect();
						if (bounds.top > lastBounds.top && bounds.left <= lastBounds.left) {
							clonedNode = element.cloneNode();
							curSubNode = element.childNodes[0];
							while (curSubNode && curSubNode !== curWordEl) {
								tempSubNode = curSubNode;
								curSubNode = curSubNode.nextSibling;
								clonedNode.appendChild(tempSubNode);
							}
							element.parentNode.insertBefore(clonedNode, element);
							prepForCharsOnly && _disallowInline(clonedNode);
						}
						lastBounds = bounds;
					}
					if (j < words.length || endsWithSpace) _insertNodeBefore(j >= words.length ? " " : wordDelimIsNotSpace && wordText.slice(-1) === " " ? " " + wordDelimString : wordDelimString, element, curNode);
				}
			}
			element.removeChild(curNode);
			ignoredPreviousSibling = 0;
		} else if (curNode.nodeType === 1) {
			if (ignore && ignore.indexOf(curNode) > -1) {
				wordsCollection.indexOf(curNode.previousSibling) > -1 && wordsCollection[wordsCollection.length - 1].appendChild(curNode);
				ignoredPreviousSibling = curNode;
			} else {
				_splitWordsAndCharsRecursively(curNode, config, wordWrapper, charWrapper, prepForCharsOnly, deepSlice, ignore, charSplitRegEx, specialCharsRegEx, true);
				ignoredPreviousSibling = 0;
			}
			prepForCharsOnly && _disallowInline(curNode);
		}
	}
};
var _SplitText = class _SplitText {
	constructor(elements, config) {
		this.isSplit = false;
		_initIfNecessary();
		this.elements = _elements(elements);
		this.chars = [];
		this.words = [];
		this.lines = [];
		this.masks = [];
		this.vars = config;
		this.elements.forEach((el) => {
			var _a;
			config.overwrite !== false && ((_a = el[_splitProp]) == null || _a._data.orig.filter(({ element }) => element === el).forEach(_revertOriginal));
			el[_splitProp] = this;
		});
		this._split = () => this.isSplit && this.split(this.vars);
		let orig = [], timerId, checkWidths = () => {
			let i = orig.length, o;
			while (i--) {
				o = orig[i];
				let w = o.element.offsetWidth;
				if (w !== o.width) {
					o.width = w;
					this._split();
					return;
				}
			}
		};
		this._data = {
			orig,
			obs: typeof ResizeObserver !== "undefined" && new ResizeObserver(() => {
				clearTimeout(timerId);
				timerId = setTimeout(checkWidths, 200);
			})
		};
		_context(this);
		this.split(config);
	}
	split(config) {
		(this._ctx || _defaultContext).add(() => {
			this.isSplit && this.revert();
			this.vars = config = config || this.vars || {};
			let { type = "chars,words,lines", aria = "auto", deepSlice = true, smartWrap, onSplit, autoSplit = false, specialChars, mask } = this.vars, splitLines = type.indexOf("lines") > -1, splitCharacters = type.indexOf("chars") > -1, splitWords = type.indexOf("words") > -1, onlySplitCharacters = splitCharacters && !splitWords && !splitLines, specialCharsRegEx = specialChars && ("push" in specialChars ? new RegExp("(?:" + specialChars.join("|") + ")", "gu") : specialChars), finalCharSplitRegEx = specialCharsRegEx ? new RegExp(specialCharsRegEx.source + "|" + _emojiSafeRegEx.source, "gu") : _emojiSafeRegEx, ignore = !!config.ignore && _elements(config.ignore), { orig, animTime, obs } = this._data, onSplitResult;
			if (splitCharacters || splitWords || splitLines) {
				this.elements.forEach((element, index) => {
					orig[index] = {
						element,
						html: element.innerHTML,
						ariaL: element.getAttribute("aria-label"),
						ariaH: element.getAttribute("aria-hidden")
					};
					aria === "auto" ? element.setAttribute("aria-label", (element.textContent || "").trim()) : aria === "hidden" && element.setAttribute("aria-hidden", "true");
					let chars = [], words = [], lines = [], charWrapper = splitCharacters ? _getWrapper("char", config, chars) : null, wordWrapper = _getWrapper("word", config, words), i, curWord, smartWrapSpan, nextSibling;
					_splitWordsAndCharsRecursively(element, config, wordWrapper, charWrapper, onlySplitCharacters, deepSlice && (splitLines || onlySplitCharacters), ignore, finalCharSplitRegEx, specialCharsRegEx, false);
					if (splitLines) {
						let nodes = _toArray(element.childNodes), wrapLine = _getLineWrapper(element, nodes, config, lines), curNode, toRemove = [], lineStartIndex = 0, allBounds = nodes.map((n) => n.nodeType === 1 ? n.getBoundingClientRect() : _emptyBounds), lastBounds = _emptyBounds, curBounds;
						for (i = 0; i < nodes.length; i++) {
							curNode = nodes[i];
							if (curNode.nodeType === 1) {
								if (curNode.nodeName === "BR") {
									if (!i || nodes[i - 1].nodeName !== "BR") {
										toRemove.push(curNode);
										wrapLine(lineStartIndex, i + 1);
									}
									lineStartIndex = i + 1;
									lastBounds = _findNextValidBounds(allBounds, i);
								} else {
									curBounds = allBounds[i];
									if (i && curBounds.top > lastBounds.top && curBounds.left < lastBounds.left + lastBounds.width - 1) {
										wrapLine(lineStartIndex, i);
										lineStartIndex = i;
									}
									lastBounds = curBounds;
								}
							}
						}
						lineStartIndex < i && wrapLine(lineStartIndex, i);
						toRemove.forEach((el) => {
							var _a;
							return (_a = el.parentNode) == null ? void 0 : _a.removeChild(el);
						});
					}
					if (!splitWords) {
						for (i = 0; i < words.length; i++) {
							curWord = words[i];
							if (splitCharacters || !curWord.nextSibling || curWord.nextSibling.nodeType !== 3) {
								if (smartWrap && !splitLines) {
									smartWrapSpan = document.createElement("span");
									smartWrapSpan.style.whiteSpace = "nowrap";
									while (curWord.firstChild) smartWrapSpan.appendChild(curWord.firstChild);
									curWord.replaceWith(smartWrapSpan);
								} else curWord.replaceWith(...curWord.childNodes);
							} else {
								nextSibling = curWord.nextSibling;
								if (nextSibling && nextSibling.nodeType === 3) {
									nextSibling.textContent = (curWord.textContent || "") + (nextSibling.textContent || "");
									curWord.remove();
								}
							}
						}
						words.length = 0;
						element.normalize();
					}
					this.lines.push(...lines);
					this.words.push(...words);
					this.chars.push(...chars);
				});
				mask && this[mask] && this.masks.push(...this[mask].map((el) => {
					let maskEl = el.cloneNode();
					el.replaceWith(maskEl);
					maskEl.appendChild(el);
					el.className && (maskEl.className = el.className.trim().split(" ").map((s) => s + "-mask").join(" "));
					maskEl.style.overflow = "clip";
					return maskEl;
				}));
			}
			this.isSplit = true;
			_fonts && splitLines && autoSplit && _fonts.addEventListener("loadingdone", this._split);
			if ((onSplitResult = onSplit && onSplit(this)) && onSplitResult.totalTime) this._data.anim = animTime ? onSplitResult.totalTime(animTime) : onSplitResult;
			splitLines && autoSplit && this.elements.forEach((element, index) => {
				orig[index].width = element.offsetWidth;
				obs && obs.observe(element);
			});
		});
		return this;
	}
	kill() {
		let { obs } = this._data;
		obs && obs.disconnect();
		_fonts?.removeEventListener("loadingdone", this._split);
	}
	revert() {
		var _a, _b;
		if (this.isSplit) {
			let { orig, anim } = this._data;
			this.kill();
			orig.forEach(_revertOriginal);
			this.chars.length = this.words.length = this.lines.length = orig.length = this.masks.length = 0;
			this.isSplit = false;
			if (anim) {
				this._data.animTime = anim.totalTime();
				anim.revert();
			}
			(_b = (_a = this.vars).onRevert) == null || _b.call(_a, this);
		}
		return this;
	}
	static create(elements, config) {
		return new _SplitText(elements, config);
	}
	static register(core) {
		gsap = gsap || core || window.gsap;
		if (gsap) {
			_toArray = gsap.utils.toArray;
			_context = gsap.core.context || _context;
		}
		if (!_coreInitted && window.innerWidth > 0) {
			_fonts = document.fonts;
			_coreInitted = true;
		}
	}
};
_SplitText.version = "3.15.0";
var SplitText = _SplitText;
//#endregion
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region node_modules/lenis/dist/lenis.mjs
var version = "1.3.27";
/**
* Clamp a value between a minimum and maximum value
*
* @param min Minimum value
* @param input Value to clamp
* @param max Maximum value
* @returns Clamped value
*/
function clamp(min, input, max) {
	return Math.max(min, Math.min(input, max));
}
/**
*  Linearly interpolate between two values using an amount (0 <= t <= 1)
*
* @param x First value
* @param y Second value
* @param t Amount to interpolate (0 <= t <= 1)
* @returns Interpolated value
*/
function lerp(x, y, t) {
	return (1 - t) * x + t * y;
}
/**
* Damp a value over time using a damping factor
* {@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}
*
* @param x Initial value
* @param y Target value
* @param lambda Damping factor
* @param dt Time elapsed since the last update
* @returns Damped value
*/
function damp(x, y, lambda, deltaTime) {
	return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
/**
* Calculate the modulo of the dividend and divisor while keeping the result within the same sign as the divisor
* {@link https://anguscroll.com/just/just-modulo}
*
* @param n Dividend
* @param d Divisor
* @returns Modulo
*/
function modulo(n, d) {
	return (n % d + d) % d;
}
/**
* Animate class to handle value animations with lerping or easing
*
* @example
* const animate = new Animate()
* animate.fromTo(0, 100, { duration: 1, easing: (t) => t })
* animate.advance(0.5) // 50
*/
var Animate = class {
	constructor() {
		_defineProperty(this, "isRunning", false);
		_defineProperty(this, "value", 0);
		_defineProperty(this, "from", 0);
		_defineProperty(this, "to", 0);
		_defineProperty(this, "currentTime", 0);
		_defineProperty(this, "lerp", void 0);
		_defineProperty(this, "duration", void 0);
		_defineProperty(this, "easing", void 0);
		_defineProperty(this, "onUpdate", void 0);
	}
	/**
	* Advance the animation by the given delta time
	*
	* @param deltaTime - The time in seconds to advance the animation
	*/
	advance(deltaTime) {
		if (!this.isRunning) return;
		let completed = false;
		if (this.duration && this.easing) {
			this.currentTime += deltaTime;
			const linearProgress = clamp(0, this.currentTime / this.duration, 1);
			completed = linearProgress >= 1;
			const easedProgress = completed ? 1 : this.easing(linearProgress);
			this.value = this.from + (this.to - this.from) * easedProgress;
		} else if (this.lerp) {
			this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
			if (Math.round(this.value) === Math.round(this.to)) {
				this.value = this.to;
				completed = true;
			}
		} else {
			this.value = this.to;
			completed = true;
		}
		if (completed) this.stop();
		this.onUpdate?.(this.value, completed);
	}
	/** Stop the animation */
	stop() {
		this.isRunning = false;
	}
	/**
	* Set up the animation from a starting value to an ending value
	* with optional parameters for lerping, duration, easing, and onUpdate callback
	*
	* @param from - The starting value
	* @param to - The ending value
	* @param options - Options for the animation
	*/
	fromTo(from, to, { lerp, duration, easing, onStart, onUpdate }) {
		this.from = this.value = from;
		this.to = to;
		this.lerp = lerp;
		this.duration = duration;
		this.easing = easing;
		this.currentTime = 0;
		this.isRunning = true;
		onStart?.();
		this.onUpdate = onUpdate;
	}
};
function debounce(callback, delay) {
	let timer;
	return function(...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
			callback.apply(this, args);
		}, delay);
	};
}
/**
* Dimensions class to handle the size of the content and wrapper
*
* @example
* const dimensions = new Dimensions(wrapper, content)
* dimensions.on('resize', (e) => {
*   console.log(e.width, e.height)
* })
*/
var Dimensions = class {
	constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
		_defineProperty(this, "width", 0);
		_defineProperty(this, "height", 0);
		_defineProperty(this, "scrollHeight", 0);
		_defineProperty(this, "scrollWidth", 0);
		_defineProperty(this, "debouncedResize", void 0);
		_defineProperty(this, "wrapperResizeObserver", void 0);
		_defineProperty(this, "contentResizeObserver", void 0);
		_defineProperty(this, "resize", () => {
			this.onWrapperResize();
			this.onContentResize();
		});
		_defineProperty(this, "onWrapperResize", () => {
			if (this.wrapper instanceof Window) {
				this.width = window.innerWidth;
				this.height = window.innerHeight;
			} else {
				this.width = this.wrapper.clientWidth;
				this.height = this.wrapper.clientHeight;
			}
		});
		_defineProperty(this, "onContentResize", () => {
			if (this.wrapper instanceof Window) {
				this.scrollHeight = this.content.scrollHeight;
				this.scrollWidth = this.content.scrollWidth;
			} else {
				this.scrollHeight = this.wrapper.scrollHeight;
				this.scrollWidth = this.wrapper.scrollWidth;
			}
		});
		this.wrapper = wrapper;
		this.content = content;
		if (autoResize) {
			this.debouncedResize = debounce(this.resize, debounceValue);
			if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize);
			else {
				this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
				this.wrapperResizeObserver.observe(this.wrapper);
			}
			this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
			this.contentResizeObserver.observe(this.content);
		}
		this.resize();
	}
	destroy() {
		this.wrapperResizeObserver?.disconnect();
		this.contentResizeObserver?.disconnect();
		if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize);
	}
	get limit() {
		return {
			x: this.scrollWidth - this.width,
			y: this.scrollHeight - this.height
		};
	}
};
/**
* Emitter class to handle events
* @example
* const emitter = new Emitter()
* emitter.on('event', (data) => {
*   console.log(data)
* })
* emitter.emit('event', 'data')
*/
var Emitter = class {
	constructor() {
		_defineProperty(this, "events", {});
	}
	/**
	* Emit an event with the given data
	* @param event Event name
	* @param args Data to pass to the event handlers
	*/
	emit(event, ...args) {
		const callbacks = this.events[event] || [];
		for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i]?.(...args);
	}
	/**
	* Add a callback to the event
	* @param event Event name
	* @param cb Callback function
	* @returns Unsubscribe function
	*/
	on(event, cb) {
		if (this.events[event]) this.events[event].push(cb);
		else this.events[event] = [cb];
		return () => {
			this.events[event] = this.events[event]?.filter((i) => cb !== i);
		};
	}
	/**
	* Remove a callback from the event
	* @param event Event name
	* @param callback Callback function
	*/
	off(event, callback) {
		this.events[event] = this.events[event]?.filter((i) => callback !== i);
	}
	/**
	* Remove all event listeners and clean up
	*/
	destroy() {
		this.events = {};
	}
};
var LINE_HEIGHT = 100 / 6;
var listenerOptions = { passive: false };
function getDeltaMultiplier(deltaMode, size) {
	if (deltaMode === 1) return LINE_HEIGHT;
	if (deltaMode === 2) return size;
	return 1;
}
var VirtualScroll = class {
	constructor(element, options = {
		wheelMultiplier: 1,
		touchMultiplier: 1
	}) {
		_defineProperty(this, "touchStart", {
			x: 0,
			y: 0
		});
		_defineProperty(this, "lastDelta", {
			x: 0,
			y: 0
		});
		_defineProperty(this, "window", {
			width: 0,
			height: 0
		});
		_defineProperty(this, "emitter", new Emitter());
		_defineProperty(
			this,
			/**
			* Event handler for 'touchstart' event
			*
			* @param event Touch event
			*/
			"onTouchStart",
			(event) => {
				const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
				this.touchStart.x = clientX;
				this.touchStart.y = clientY;
				this.lastDelta = {
					x: 0,
					y: 0
				};
				this.emitter.emit("scroll", {
					deltaX: 0,
					deltaY: 0,
					event
				});
			}
		);
		_defineProperty(
			this,
			/** Event handler for 'touchmove' event */
			"onTouchMove",
			(event) => {
				const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
				const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
				const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
				this.touchStart.x = clientX;
				this.touchStart.y = clientY;
				this.lastDelta = {
					x: deltaX,
					y: deltaY
				};
				this.emitter.emit("scroll", {
					deltaX,
					deltaY,
					event
				});
			}
		);
		_defineProperty(this, "onTouchEnd", (event) => {
			this.emitter.emit("scroll", {
				deltaX: this.lastDelta.x,
				deltaY: this.lastDelta.y,
				event
			});
		});
		_defineProperty(
			this,
			/** Event handler for 'wheel' event */
			"onWheel",
			(event) => {
				let { deltaX, deltaY, deltaMode } = event;
				const multiplierX = getDeltaMultiplier(deltaMode, this.window.width);
				const multiplierY = getDeltaMultiplier(deltaMode, this.window.height);
				deltaX *= multiplierX;
				deltaY *= multiplierY;
				deltaX *= this.options.wheelMultiplier;
				deltaY *= this.options.wheelMultiplier;
				this.emitter.emit("scroll", {
					deltaX,
					deltaY,
					event
				});
			}
		);
		_defineProperty(this, "onWindowResize", () => {
			this.window = {
				width: window.innerWidth,
				height: window.innerHeight
			};
		});
		this.element = element;
		this.options = options;
		window.addEventListener("resize", this.onWindowResize);
		this.onWindowResize();
		this.element.addEventListener("wheel", this.onWheel, listenerOptions);
		this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
		this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
		this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
	}
	/**
	* Add an event listener for the given event and callback
	*
	* @param event Event name
	* @param callback Callback function
	*/
	on(event, callback) {
		return this.emitter.on(event, callback);
	}
	/** Remove all event listeners and clean up */
	destroy() {
		this.emitter.destroy();
		window.removeEventListener("resize", this.onWindowResize);
		this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
		this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
		this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
		this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
	}
};
var defaultEasing = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));
var Lenis = class {
	constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = .075, touchInertiaExponent = 1.7, duration, easing, lerp = .1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false, respectReducedMotion = true } = {}) {
		_defineProperty(this, "_isScrolling", false);
		_defineProperty(this, "_isStopped", false);
		_defineProperty(this, "_isLocked", false);
		_defineProperty(this, "_preventNextNativeScrollEvent", false);
		_defineProperty(this, "_resetVelocityTimeout", null);
		_defineProperty(this, "_rafId", null);
		_defineProperty(this, "_isDraggingSelection", false);
		_defineProperty(this, "reducedMotionMediaQuery", window.matchMedia("(prefers-reduced-motion: reduce)"));
		_defineProperty(
			this,
			/**
			* Whether or not the user is touching the screen
			*/
			"isTouching",
			void 0
		);
		_defineProperty(
			this,
			/**
			* Whether or not the device is running iOS
			*/
			"isIos",
			void 0
		);
		_defineProperty(
			this,
			/**
			* The time in ms since the lenis instance was created
			*/
			"time",
			0
		);
		_defineProperty(
			this,
			/**
			* User data that will be forwarded through the scroll event
			*
			* @example
			* lenis.scrollTo(100, {
			*   userData: {
			*     foo: 'bar'
			*   }
			* })
			*/
			"userData",
			{}
		);
		_defineProperty(
			this,
			/**
			* The last velocity of the scroll
			*/
			"lastVelocity",
			0
		);
		_defineProperty(
			this,
			/**
			* The current velocity of the scroll
			*/
			"velocity",
			0
		);
		_defineProperty(
			this,
			/**
			* The direction of the scroll
			*/
			"direction",
			0
		);
		_defineProperty(
			this,
			/**
			* The options passed to the lenis instance
			*/
			"options",
			void 0
		);
		_defineProperty(
			this,
			/**
			* The target scroll value
			*/
			"targetScroll",
			void 0
		);
		_defineProperty(
			this,
			/**
			* The animated scroll value
			*/
			"animatedScroll",
			void 0
		);
		_defineProperty(this, "animate", new Animate());
		_defineProperty(this, "emitter", new Emitter());
		_defineProperty(this, "dimensions", void 0);
		_defineProperty(this, "virtualScroll", void 0);
		_defineProperty(this, "onScrollEnd", (e) => {
			if (!(e instanceof CustomEvent)) {
				if (this.isScrolling === "smooth" || this.isScrolling === false) e.stopPropagation();
			}
		});
		_defineProperty(this, "dispatchScrollendEvent", () => {
			this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
				bubbles: this.options.wrapper === window,
				detail: { lenisScrollEnd: true }
			}));
		});
		_defineProperty(this, "onTransitionEnd", (event) => {
			if (event.propertyName?.includes("overflow") && event.target === this.rootElement) this.checkOverflow();
		});
		_defineProperty(this, "onClick", (event) => {
			const linkElementsUrls = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.href).map((element) => new URL(element.href));
			const currentUrl = new URL(window.location.href);
			if (this.options.anchors) {
				const anchorElementUrl = linkElementsUrls.find((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname === targetUrl.pathname && targetUrl.hash);
				if (anchorElementUrl) {
					const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
					const target = decodeURIComponent(anchorElementUrl.hash);
					this.scrollTo(target, options);
					return;
				}
			}
			if (this.options.stopInertiaOnNavigate) {
				if (linkElementsUrls.some((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname !== targetUrl.pathname)) {
					this.reset();
					return;
				}
			}
		});
		_defineProperty(this, "onPointerDown", (event) => {
			if (event.button === 1) this.reset();
		});
		_defineProperty(this, "onVirtualScroll", (data) => {
			if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
			const { deltaX, deltaY, event } = data;
			this.emitter.emit("virtual-scroll", {
				deltaX,
				deltaY,
				event
			});
			if (event.ctrlKey) return;
			if (event.lenisStopPropagation) return;
			const isTouch = event.type.includes("touch");
			const isWheel = event.type.includes("wheel");
			if (isTouch && this.isIos) {
				if (event.type === "touchstart") this._isDraggingSelection = this.isTouchOnSelectionHandle(event);
				if (this._isDraggingSelection) {
					if (event.type === "touchend") this._isDraggingSelection = false;
					return;
				}
			}
			this.isTouching = event.type === "touchstart" || event.type === "touchmove";
			const isClickOrTap = deltaX === 0 && deltaY === 0;
			if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
				this.reset();
				return;
			}
			const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
			if (isClickOrTap || isUnknownGesture) return;
			let composedPath = event.composedPath();
			composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
			const prevent = this.options.prevent;
			const gestureOrientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
			if (composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || gestureOrientation === "vertical" && node.hasAttribute?.("data-lenis-prevent-vertical") || gestureOrientation === "horizontal" && node.hasAttribute?.("data-lenis-prevent-horizontal") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(node, {
				deltaX,
				deltaY
			})))) return;
			if (this.isStopped || this.isLocked) {
				if (event.cancelable) event.preventDefault();
				return;
			}
			if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
				this.isScrolling = "native";
				this.animate.stop();
				event.lenisStopPropagation = true;
				return;
			}
			let delta = deltaY;
			if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
			else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
			if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
			if (event.cancelable) event.preventDefault();
			const isSyncTouch = isTouch && this.options.syncTouch;
			const hasTouchInertia = isTouch && event.type === "touchend";
			if (hasTouchInertia) delta = Math.sign(delta) * Math.abs(this.velocity) ** this.options.touchInertiaExponent;
			this.scrollTo(this.targetScroll + delta, {
				programmatic: false,
				...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
					lerp: this.options.lerp,
					duration: this.options.duration,
					easing: this.options.easing
				}
			});
		});
		_defineProperty(this, "onNativeScroll", () => {
			if (this._resetVelocityTimeout !== null) {
				clearTimeout(this._resetVelocityTimeout);
				this._resetVelocityTimeout = null;
			}
			if (this._preventNextNativeScrollEvent) {
				this._preventNextNativeScrollEvent = false;
				return;
			}
			if (this.isScrolling === false || this.isScrolling === "native") {
				const lastScroll = this.animatedScroll;
				this.animatedScroll = this.targetScroll = this.actualScroll;
				this.lastVelocity = this.velocity;
				this.velocity = this.animatedScroll - lastScroll;
				this.direction = Math.sign(this.animatedScroll - lastScroll);
				if (!this.isStopped) this.isScrolling = "native";
				this.emit();
				if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
					this.lastVelocity = this.velocity;
					this.velocity = 0;
					this.isScrolling = false;
					this.emit();
				}, 400);
			}
		});
		_defineProperty(
			this,
			/**
			* RequestAnimationFrame for lenis
			*
			* @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
			*/
			"raf",
			(time) => {
				const deltaTime = time - (this.time || time);
				this.time = time;
				this.animate.advance(deltaTime * .001);
				if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
			}
		);
		window.lenisVersion = version;
		if (!window.lenis) window.lenis = {};
		window.lenis.version = version;
		if (orientation === "horizontal") window.lenis.horizontal = true;
		if (syncTouch === true) window.lenis.touch = true;
		this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
		if (!wrapper || wrapper === document.documentElement) wrapper = window;
		if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
		else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
		this.options = {
			wrapper,
			content,
			eventsTarget,
			smoothWheel,
			syncTouch,
			syncTouchLerp,
			touchInertiaExponent,
			duration,
			easing,
			lerp,
			infinite,
			gestureOrientation,
			orientation,
			touchMultiplier,
			wheelMultiplier,
			autoResize,
			prevent,
			virtualScroll,
			overscroll,
			autoRaf,
			anchors,
			autoToggle,
			allowNestedScroll,
			naiveDimensions,
			stopInertiaOnNavigate,
			respectReducedMotion
		};
		this.dimensions = new Dimensions(wrapper, content, { autoResize });
		this.updateClassName();
		this.targetScroll = this.animatedScroll = this.actualScroll;
		this.options.wrapper.addEventListener("scroll", this.onNativeScroll);
		this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
		if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick);
		this.options.wrapper.addEventListener("pointerdown", this.onPointerDown);
		this.virtualScroll = new VirtualScroll(eventsTarget, {
			touchMultiplier,
			wheelMultiplier
		});
		this.virtualScroll.on("scroll", this.onVirtualScroll);
		if (this.options.autoToggle) {
			this.checkOverflow();
			this.rootElement.addEventListener("transitionend", this.onTransitionEnd);
		}
		if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
	}
	/**
	* Destroy the lenis instance, remove all event listeners and clean up the class name
	*/
	destroy() {
		this.emitter.destroy();
		if (this._resetVelocityTimeout !== null) {
			clearTimeout(this._resetVelocityTimeout);
			this._resetVelocityTimeout = null;
		}
		this.options.wrapper.removeEventListener("scroll", this.onNativeScroll);
		this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
		this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown);
		if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick);
		this.virtualScroll.destroy();
		this.dimensions.destroy();
		this.cleanUpClassName();
		if (this._rafId) cancelAnimationFrame(this._rafId);
	}
	on(event, callback) {
		return this.emitter.on(event, callback);
	}
	off(event, callback) {
		return this.emitter.off(event, callback);
	}
	get overflow() {
		const property = this.isHorizontal ? "overflow-x" : "overflow-y";
		return getComputedStyle(this.rootElement)[property];
	}
	checkOverflow() {
		if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
		else this.internalStart();
	}
	setScroll(scroll) {
		if (this.isHorizontal) this.options.wrapper.scrollTo({
			left: scroll,
			behavior: "instant"
		});
		else this.options.wrapper.scrollTo({
			top: scroll,
			behavior: "instant"
		});
	}
	isTouchOnSelectionHandle(event) {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
		const touch = event.targetTouches[0] ?? event.changedTouches[0];
		if (!touch) return false;
		const rects = selection.getRangeAt(0).getClientRects();
		if (rects.length === 0) return false;
		const first = rects[0];
		const last = rects[rects.length - 1];
		const HANDLE_RADIUS = 40;
		const nearStart = Math.hypot(touch.clientX - first.left, touch.clientY - first.top) <= HANDLE_RADIUS;
		const nearEnd = Math.hypot(touch.clientX - last.right, touch.clientY - last.bottom) <= HANDLE_RADIUS;
		return nearStart || nearEnd;
	}
	/**
	* Force lenis to recalculate the dimensions
	*/
	resize() {
		this.dimensions.resize();
		this.animatedScroll = this.targetScroll = this.actualScroll;
		this.emit();
	}
	emit() {
		this.emitter.emit("scroll", this);
	}
	reset() {
		this.isLocked = false;
		this.isScrolling = false;
		this.animatedScroll = this.targetScroll = this.actualScroll;
		this.lastVelocity = this.velocity = 0;
		this.animate.stop();
	}
	/**
	* Start lenis scroll after it has been stopped
	*/
	start() {
		if (!this.isStopped) return;
		if (this.options.autoToggle) {
			this.rootElement.style.removeProperty("overflow");
			return;
		}
		this.internalStart();
	}
	internalStart() {
		if (!this.isStopped) return;
		this.reset();
		this.isStopped = false;
		this.emit();
	}
	/**
	* Stop lenis scroll
	*/
	stop() {
		if (this.isStopped) return;
		if (this.options.autoToggle) {
			this.rootElement.style.setProperty("overflow", "clip");
			return;
		}
		this.internalStop();
	}
	internalStop() {
		if (this.isStopped) return;
		this.reset();
		this.isStopped = true;
		this.emit();
	}
	/**
	* Scroll to a target value
	*
	* @param target The target value to scroll to
	* @param options The options for the scroll
	*
	* @example
	* lenis.scrollTo(100, {
	*   offset: 100,
	*   duration: 1,
	*   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
	*   lerp: 0.1,
	*   onStart: () => {
	*     console.log('onStart')
	*   },
	*   onComplete: () => {
	*     console.log('onComplete')
	*   },
	* })
	*/
	scrollTo(_target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
		if (this.prefersReducedMotion) if (programmatic) immediate = true;
		else {
			lerp = 1;
			duration = void 0;
			easing = void 0;
		}
		if ((this.isStopped || this.isLocked) && !force) return;
		let target = _target;
		let adjustedOffset = offset;
		if (typeof target === "string" && [
			"top",
			"left",
			"start",
			"#"
		].includes(target)) target = 0;
		else if (typeof target === "string" && [
			"bottom",
			"right",
			"end"
		].includes(target)) target = this.limit;
		else {
			let node = null;
			if (typeof target === "string") {
				node = target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector(target);
				if (!node) if (target === "#top") target = 0;
				else console.warn("Lenis: Target not found", target);
			} else if (target instanceof Element) node = target;
			if (node) {
				if (this.options.wrapper !== window) {
					const wrapperRect = this.rootElement.getBoundingClientRect();
					adjustedOffset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
				}
				const rect = node.getBoundingClientRect();
				const targetStyle = getComputedStyle(node);
				const scrollMargin = this.isHorizontal ? Number.parseFloat(targetStyle.scrollMarginLeft) : Number.parseFloat(targetStyle.scrollMarginTop);
				const containerStyle = getComputedStyle(this.rootElement);
				const scrollPadding = this.isHorizontal ? Number.parseFloat(containerStyle.scrollPaddingLeft) : Number.parseFloat(containerStyle.scrollPaddingTop);
				target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll - (Number.isNaN(scrollMargin) ? 0 : scrollMargin) - (Number.isNaN(scrollPadding) ? 0 : scrollPadding);
			}
		}
		if (typeof target !== "number") return;
		target += adjustedOffset;
		if (this.options.infinite) {
			if (programmatic) {
				this.targetScroll = this.animatedScroll = this.scroll;
				const distance = target - this.animatedScroll;
				if (distance > this.limit / 2) target -= this.limit;
				else if (distance < -this.limit / 2) target += this.limit;
			}
		} else target = clamp(0, target, this.limit);
		if (target === this.targetScroll) {
			onStart?.(this);
			onComplete?.(this);
			return;
		}
		this.userData = userData ?? {};
		if (immediate) {
			this.animatedScroll = this.targetScroll = target;
			this.setScroll(this.scroll);
			this.reset();
			this.preventNextNativeScrollEvent();
			this.emit();
			onComplete?.(this);
			this.userData = {};
			requestAnimationFrame(() => {
				this.dispatchScrollendEvent();
			});
			return;
		}
		if (!programmatic) this.targetScroll = target;
		if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
		else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
		this.animate.fromTo(this.animatedScroll, target, {
			duration,
			easing,
			lerp,
			onStart: () => {
				if (lock) this.isLocked = true;
				this.isScrolling = "smooth";
				onStart?.(this);
			},
			onUpdate: (value, completed) => {
				this.isScrolling = "smooth";
				this.lastVelocity = this.velocity;
				this.velocity = value - this.animatedScroll;
				this.direction = Math.sign(this.velocity);
				this.animatedScroll = value;
				this.setScroll(this.scroll);
				if (programmatic) this.targetScroll = value;
				if (!completed) this.emit();
				if (completed) {
					this.reset();
					this.emit();
					onComplete?.(this);
					this.userData = {};
					requestAnimationFrame(() => {
						this.dispatchScrollendEvent();
					});
					this.preventNextNativeScrollEvent();
				}
			}
		});
	}
	preventNextNativeScrollEvent() {
		this._preventNextNativeScrollEvent = true;
		requestAnimationFrame(() => {
			this._preventNextNativeScrollEvent = false;
		});
	}
	hasNestedScroll(node, { deltaX, deltaY }) {
		const time = Date.now();
		if (!node._lenis) node._lenis = {};
		const cache = node._lenis;
		let hasOverflowX;
		let hasOverflowY;
		let isScrollableX;
		let isScrollableY;
		let hasOverscrollBehaviorX;
		let hasOverscrollBehaviorY;
		let scrollWidth;
		let scrollHeight;
		let clientWidth;
		let clientHeight;
		if (time - (cache.time ?? 0) > 2e3) {
			cache.time = Date.now();
			const computedStyle = window.getComputedStyle(node);
			cache.computedStyle = computedStyle;
			hasOverflowX = [
				"auto",
				"overlay",
				"scroll"
			].includes(computedStyle.overflowX);
			hasOverflowY = [
				"auto",
				"overlay",
				"scroll"
			].includes(computedStyle.overflowY);
			hasOverscrollBehaviorX = ["auto"].includes(computedStyle.overscrollBehaviorX);
			hasOverscrollBehaviorY = ["auto"].includes(computedStyle.overscrollBehaviorY);
			cache.hasOverflowX = hasOverflowX;
			cache.hasOverflowY = hasOverflowY;
			if (!(hasOverflowX || hasOverflowY)) return false;
			scrollWidth = node.scrollWidth;
			scrollHeight = node.scrollHeight;
			clientWidth = node.clientWidth;
			clientHeight = node.clientHeight;
			isScrollableX = scrollWidth > clientWidth;
			isScrollableY = scrollHeight > clientHeight;
			cache.isScrollableX = isScrollableX;
			cache.isScrollableY = isScrollableY;
			cache.scrollWidth = scrollWidth;
			cache.scrollHeight = scrollHeight;
			cache.clientWidth = clientWidth;
			cache.clientHeight = clientHeight;
			cache.hasOverscrollBehaviorX = hasOverscrollBehaviorX;
			cache.hasOverscrollBehaviorY = hasOverscrollBehaviorY;
		} else {
			isScrollableX = cache.isScrollableX;
			isScrollableY = cache.isScrollableY;
			hasOverflowX = cache.hasOverflowX;
			hasOverflowY = cache.hasOverflowY;
			scrollWidth = cache.scrollWidth;
			scrollHeight = cache.scrollHeight;
			clientWidth = cache.clientWidth;
			clientHeight = cache.clientHeight;
			hasOverscrollBehaviorX = cache.hasOverscrollBehaviorX;
			hasOverscrollBehaviorY = cache.hasOverscrollBehaviorY;
		}
		if (!(hasOverflowX && isScrollableX || hasOverflowY && isScrollableY)) return false;
		const orientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
		let scroll;
		let maxScroll;
		let delta;
		let hasOverflow;
		let isScrollable;
		let hasOverscrollBehavior;
		if (orientation === "horizontal") {
			scroll = Math.round(node.scrollLeft);
			maxScroll = scrollWidth - clientWidth;
			delta = deltaX;
			hasOverflow = hasOverflowX;
			isScrollable = isScrollableX;
			hasOverscrollBehavior = hasOverscrollBehaviorX;
		} else if (orientation === "vertical") {
			scroll = Math.round(node.scrollTop);
			maxScroll = scrollHeight - clientHeight;
			delta = deltaY;
			hasOverflow = hasOverflowY;
			isScrollable = isScrollableY;
			hasOverscrollBehavior = hasOverscrollBehaviorY;
		} else return false;
		if (!hasOverscrollBehavior && (scroll >= maxScroll || scroll <= 0)) return true;
		return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
	}
	/**
	* The root element on which lenis is instanced
	*/
	get rootElement() {
		return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
	}
	/**
	* The limit which is the maximum scroll value
	*/
	get limit() {
		if (this.options.naiveDimensions) {
			if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
			return this.rootElement.scrollHeight - this.rootElement.clientHeight;
		}
		return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
	}
	/**
	* Whether or not the scroll is horizontal
	*/
	get isHorizontal() {
		return this.options.orientation === "horizontal";
	}
	/**
	* The actual scroll value
	*/
	get actualScroll() {
		const wrapper = this.options.wrapper;
		return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
	}
	/**
	* The current scroll value
	*/
	get scroll() {
		return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
	}
	/**
	* The progress of the scroll relative to the limit
	*/
	get progress() {
		return this.limit === 0 ? 1 : this.scroll / this.limit;
	}
	/**
	* Current scroll state
	*/
	get isScrolling() {
		return this._isScrolling;
	}
	set isScrolling(value) {
		if (this._isScrolling !== value) {
			this._isScrolling = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is stopped
	*/
	get isStopped() {
		return this._isStopped;
	}
	set isStopped(value) {
		if (this._isStopped !== value) {
			this._isStopped = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is locked
	*/
	get isLocked() {
		return this._isLocked;
	}
	set isLocked(value) {
		if (this._isLocked !== value) {
			this._isLocked = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is smooth scrolling
	*/
	get isSmooth() {
		return this.isScrolling === "smooth";
	}
	/**
	* Whether the user prefers reduced motion and lenis is honoring it (see `respectReducedMotion` option)
	*/
	get prefersReducedMotion() {
		return this.options.respectReducedMotion && this.reducedMotionMediaQuery.matches;
	}
	/**
	* The class name applied to the wrapper element
	*/
	get className() {
		let className = "lenis";
		if (this.options.autoToggle) className += " lenis-autoToggle";
		if (this.isStopped) className += " lenis-stopped";
		if (this.isLocked) className += " lenis-locked";
		if (this.isScrolling) className += " lenis-scrolling";
		if (this.isScrolling === "smooth") className += " lenis-smooth";
		return className;
	}
	updateClassName() {
		this.cleanUpClassName();
		this.className.split(" ").forEach((className) => {
			this.rootElement.classList.add(className);
		});
	}
	cleanUpClassName() {
		for (const className of Array.from(this.rootElement.classList)) if (className === "lenis" || className.startsWith("lenis-")) this.rootElement.classList.remove(className);
	}
};
//#endregion
//#region src/js/config.js
var WHATSAPP_NUMBER = "17133645155";
var PHONE_DISPLAY = "+1 713-364-5155";
var SOCIAL = {
	instagram: "",
	facebook: "",
	tiktok: ""
};
var PREVIEW = {
	whatsappNumber: "27728408296",
	currencyToggle: false
};
var VENTURES = {
	whatsappNumber: "27728408296",
	phoneDisplay: "+27 72 840 8296",
	email: "",
	social: {
		facebook: "https://www.facebook.com/ExquisiteVenturesGh/",
		instagram: "https://www.instagram.com/exquisiteventuresgh/",
		tiktok: ""
	},
	cleanersUrl: "https://exquisite-cleaners.vercel.app/"
};
var root$1 = typeof document !== "undefined" ? document.documentElement : null;
var IS_VENTURES = !!root$1 && root$1.dataset.site === "ventures";
var isPreview = !!root$1 && root$1.hasAttribute("data-demo");
var ACTIVE_WHATSAPP = WHATSAPP_NUMBER;
if (IS_VENTURES) ACTIVE_WHATSAPP = VENTURES.whatsappNumber;
else if (isPreview && PREVIEW.whatsappNumber) ACTIVE_WHATSAPP = PREVIEW.whatsappNumber;
var CURRENCY_TOGGLE = !(isPreview && !PREVIEW.currencyToggle);
var CONTACT = IS_VENTURES ? {
	whatsapp: ACTIVE_WHATSAPP,
	phone: VENTURES.phoneDisplay,
	phoneHref: `+${VENTURES.whatsappNumber}`,
	email: VENTURES.email,
	hours: "",
	city: "Accra, Ghana"
} : {
	whatsapp: ACTIVE_WHATSAPP,
	phone: PHONE_DISPLAY,
	phoneHref: `+${WHATSAPP_NUMBER}`,
	email: "",
	hours: "Mon – Sat · 7:00 – 19:00",
	city: "Accra, Ghana"
};
var ACTIVE_SOCIAL = IS_VENTURES ? VENTURES.social : SOCIAL;
var CURRENCIES = {
	GHS: {
		symbol: "GH₵",
		rate: 1
	},
	GBP: {
		symbol: "£",
		rate: 1 / 16.5
	},
	USD: {
		symbol: "$",
		rate: 1 / 12.5
	}
};
var PRICES = {
	regular: 350,
	deep: 950,
	moveout: 1200,
	carpet: 400,
	airbnb: 450,
	airbnbLinen: 650,
	familyCare: 1500
};
var waLink = (text = "") => `https://wa.me/${ACTIVE_WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
//#endregion
//#region src/js/modules/transitions.js
var root = document.documentElement;
function initIntro() {
	const preloader = document.querySelector(".preloader");
	const panel = document.querySelector(".wipe__panel");
	const logo = document.querySelector(".wipe__logo");
	try {
		sessionStorage.setItem("ec-visited", "1");
	} catch (e) {}
	return new Promise((resolve) => {
		if (root.classList.contains("returning") || !preloader) {
			preloader?.remove();
			gsapWithCSS.set([panel, logo], { animation: "none" });
			gsapWithCSS.timeline().to(logo, {
				opacity: 0,
				duration: .3
			}).to(panel, {
				scaleY: 0,
				transformOrigin: "top",
				duration: .9,
				ease: "expo.inOut"
			}, .05).add(resolve, .35);
			return;
		}
		gsapWithCSS.timeline({ defaults: { ease: "expo.out" } }).to(".preloader__ring circle", {
			strokeDashoffset: 0,
			duration: .9,
			ease: "power2.inOut"
		}).to(".preloader__emblem", {
			opacity: 1,
			scale: 1,
			duration: .7
		}, .2).to(".preloader__word span", {
			y: 0,
			duration: .7,
			stagger: .035
		}, .3).to(".preloader__tag", {
			opacity: 1,
			duration: .5
		}, .65).to(preloader, {
			yPercent: -100,
			duration: .9,
			ease: "expo.inOut"
		}, 1.15).add(resolve, 1.45).add(() => preloader.remove());
	});
}
function initPageTransitions(lenis) {
	const panel = document.querySelector(".wipe__panel");
	const logo = document.querySelector(".wipe__logo");
	document.addEventListener("click", (e) => {
		const a = e.target.closest("a");
		if (!a) return;
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		if (a.target === "_blank" || a.hasAttribute("download")) return;
		const url = new URL(a.href, location.href);
		if (url.origin !== location.origin) return;
		if (url.pathname === location.pathname && url.hash) return;
		if (url.href === location.href) {
			e.preventDefault();
			return;
		}
		e.preventDefault();
		lenis?.stop();
		gsapWithCSS.timeline({ onComplete: () => location.href = url.href }).set(panel, { transformOrigin: "bottom" }).to(panel, {
			scaleY: 1,
			duration: .7,
			ease: "expo.inOut"
		}).to(logo, {
			opacity: 1,
			duration: .25
		}, .45);
	});
	window.addEventListener("pageshow", (e) => {
		if (!e.persisted) return;
		gsapWithCSS.set(panel, { scaleY: 0 });
		gsapWithCSS.set(logo, { opacity: 0 });
		lenis?.start();
	});
}
//#endregion
//#region src/js/modules/nav.js
function initHeader(lenis) {
	const header = document.querySelector("[data-header]");
	const bar = document.querySelector(".action-bar");
	if (!header) return;
	let last = 0;
	let ticking = false;
	let pageH = document.documentElement.scrollHeight;
	let viewH = window.innerHeight;
	const measure = () => {
		pageH = document.documentElement.scrollHeight;
		viewH = window.innerHeight;
	};
	window.addEventListener("resize", measure, { passive: true });
	window.addEventListener("load", measure);
	new ResizeObserver(measure).observe(document.body);
	const state = {
		scrolled: null,
		hidden: null,
		barHidden: null
	};
	const set = (el, key, cls, val) => {
		if (state[key] !== val) {
			state[key] = val;
			el.classList.toggle(cls, val);
		}
	};
	const update = () => {
		ticking = false;
		const y = window.scrollY;
		set(header, "scrolled", "is-scrolled", y > 40);
		if (!document.body.classList.contains("drawer-open")) set(header, "hidden", "is-hidden", y > last && y > 400);
		if (bar) set(bar, "barHidden", "is-hidden", viewH + y > pageH - 140);
		last = y;
	};
	const onScroll = () => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	};
	update();
	window.addEventListener("scroll", onScroll, { passive: true });
}
function initDrawer(lenis) {
	const burger = document.querySelector("[data-burger]");
	const drawer = document.querySelector("[data-drawer]");
	if (!burger || !drawer) return;
	const bg = drawer.querySelector(".drawer__bg");
	const links = drawer.querySelectorAll(".drawer__nav a, .drawer__foot > *");
	let open = false;
	let tl;
	const set = (state) => {
		open = state;
		burger.setAttribute("aria-expanded", String(open));
		burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
		drawer.setAttribute("aria-hidden", String(!open));
		document.body.classList.toggle("drawer-open", open);
		tl?.kill();
		if (open) {
			drawer.classList.add("is-open");
			lenis?.stop();
			tl = gsapWithCSS.timeline().fromTo(bg, { clipPath: "circle(0% at calc(100% - 44px) 40px)" }, {
				clipPath: "circle(150% at calc(100% - 44px) 40px)",
				duration: .9,
				ease: "expo.inOut"
			}).fromTo(links, {
				y: 60,
				opacity: 0,
				rotateX: -40
			}, {
				y: 0,
				opacity: 1,
				rotateX: 0,
				duration: .8,
				stagger: .05,
				ease: "expo.out"
			}, .35);
			links[0]?.focus({ preventScroll: true });
		} else {
			lenis?.start();
			tl = gsapWithCSS.timeline({ onComplete: () => drawer.classList.remove("is-open") }).to(links, {
				y: -30,
				opacity: 0,
				duration: .3,
				stagger: .02,
				ease: "power2.in"
			}).to(bg, {
				clipPath: "circle(0% at calc(100% - 44px) 40px)",
				duration: .7,
				ease: "expo.inOut"
			}, .15);
		}
	};
	burger.addEventListener("click", () => set(!open));
	drawer.addEventListener("click", (e) => {
		if (open && e.target.closest("a[href^=\"#\"]")) set(false);
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && open) {
			set(false);
			burger.focus();
		}
	});
	window.matchMedia("(min-width: 1280px)").addEventListener("change", (e) => {
		if (e.matches && open) set(false);
	});
}
//#endregion
//#region src/js/modules/animations.js
var $$$1 = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
var inHero = (el) => !!el.closest(".hero, .page-hero");
var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
function whenVisible(els, cb, { margin = "0px 0px -8% 0px", batch = false } = {}) {
	if (!els.length) return;
	let queue = [];
	let scheduled = false;
	const io = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (!e.isIntersecting) return;
			io.unobserve(e.target);
			if (batch) queue.push(e.target);
			else cb(e.target);
		});
		if (batch && queue.length && !scheduled) {
			scheduled = true;
			requestAnimationFrame(() => {
				scheduled = false;
				const q = queue;
				queue = [];
				cb(q);
			});
		}
	}, { rootMargin: margin });
	els.forEach((el) => io.observe(el));
}
ScrollTrigger.config({ ignoreMobileResize: true });
function initAnimations({ reduceMotion }) {
	splitHeadings();
	reveals();
	initCounters();
	initMarquee();
	if (reduceMotion) document.querySelector("[data-process]")?.classList.add("process--static");
	else {
		heroParallax();
		imageParallax();
		maskReveal();
		beforeAfter();
		horizontalProcess();
		bigWords();
		servicesShowcase();
	}
	if (isTouch) touchEffects(reduceMotion);
	window.addEventListener("load", () => ScrollTrigger.refresh());
}
function touchEffects(reduceMotion) {
	document.documentElement.classList.add("touch");
	const band = new IntersectionObserver((entries) => {
		entries.forEach((e) => e.target.classList.toggle("is-inview", e.isIntersecting));
	}, { rootMargin: "-28% 0px -28% 0px" });
	$$$1(".card, .feature, .price-card, .contact-card, .split__media, .finder__panel").forEach((el) => band.observe(el));
	if (reduceMotion) return;
	$$$1(".card__media").forEach((media) => {
		gsapWithCSS.fromTo(media, {
			rotateX: 14,
			transformPerspective: 900,
			transformOrigin: "50% 100%"
		}, {
			rotateX: -6,
			ease: "none",
			scrollTrigger: {
				trigger: media,
				start: "top bottom",
				end: "bottom top",
				scrub: true
			}
		});
	});
	const icons = $$$1(".feature__icon");
	gsapWithCSS.set(icons, {
		rotateY: -180,
		scale: .6
	});
	whenVisible(icons, (batch) => gsapWithCSS.to(batch, {
		rotateY: 0,
		scale: 1,
		duration: 1.2,
		stagger: .1,
		ease: "back.out(1.6)"
	}), {
		batch: true,
		margin: "0px 0px -15% 0px"
	});
	whenVisible($$$1(".flip"), (card) => {
		if (card.classList.contains("is-flipped")) return;
		const inner = card.querySelector(".flip__inner");
		gsapWithCSS.timeline({
			delay: .5,
			onComplete: () => gsapWithCSS.set(inner, { clearProps: "transform" })
		}).to(inner, {
			rotateY: 28,
			duration: .6,
			ease: "power2.out"
		}).to(inner, {
			rotateY: 0,
			duration: .9,
			ease: "elastic.out(1, 0.5)"
		});
	}, { margin: "0px 0px -35% 0px" });
}
function splitHeadings() {
	$$$1("[data-split]").forEach((el) => {
		const hero = inHero(el);
		SplitText.create(el, {
			type: "lines",
			mask: "lines",
			linesClass: "split-line",
			autoSplit: true,
			onSplit(self) {
				el.classList.add("is-split");
				const anim = gsapWithCSS.from(self.lines, {
					yPercent: 115,
					rotate: 2,
					duration: 1.2,
					stagger: .1,
					ease: "expo.out",
					delay: hero ? .15 : 0,
					paused: !hero
				});
				if (el.dataset.revealed) anim.progress(1);
				el._splitAnim = anim;
				return anim;
			}
		});
		if (!hero) whenVisible([el], () => {
			el.dataset.revealed = "1";
			el._splitAnim?.play();
		}, { margin: "0px 0px -12% 0px" });
	});
}
function reveals() {
	const heroItems = $$$1("[data-reveal]").filter(inHero);
	gsapWithCSS.to(heroItems, {
		opacity: 1,
		y: 0,
		duration: 1.2,
		stagger: .12,
		delay: .35,
		ease: "expo.out",
		startAt: { y: 40 }
	});
	const fades = $$$1("[data-reveal]").filter((el) => !inHero(el));
	gsapWithCSS.set(fades, { y: 50 });
	whenVisible(fades, (batch) => gsapWithCSS.to(batch, {
		opacity: 1,
		y: 0,
		duration: 1.1,
		stagger: .1,
		ease: "expo.out",
		overwrite: true
	}), { batch: true });
	const flips = $$$1("[data-reveal-3d]");
	gsapWithCSS.set(flips, {
		y: 90,
		rotateX: -32,
		transformPerspective: 1200,
		transformOrigin: "50% 0%"
	});
	whenVisible(flips, (batch) => gsapWithCSS.to(batch, {
		opacity: 1,
		y: 0,
		rotateX: 0,
		duration: 1.3,
		stagger: .12,
		ease: "expo.out",
		overwrite: true,
		clearProps: "transform"
	}), { batch: true });
}
function heroParallax() {
	$$$1(".hero__bg img, .page-hero__bg img").forEach((img) => {
		const section = img.closest(".hero, .page-hero");
		gsapWithCSS.fromTo(img, {
			scale: 1.12,
			yPercent: 0
		}, {
			scale: 1.25,
			yPercent: 10,
			ease: "none",
			scrollTrigger: {
				trigger: section,
				start: "top top",
				end: "bottom top",
				scrub: true
			}
		});
	});
	const copy = document.querySelector(".hero__copy, .page-hero__inner");
	if (copy) gsapWithCSS.to(copy, {
		yPercent: -18,
		opacity: .2,
		ease: "none",
		scrollTrigger: {
			trigger: copy.closest(".hero, .page-hero"),
			start: "top top",
			end: "bottom top",
			scrub: true
		}
	});
}
function imageParallax() {
	$$$1("[data-parallax]").forEach((wrap) => {
		const img = wrap.querySelector("img");
		if (!img) return;
		const amount = parseFloat(wrap.dataset.parallax || "12");
		gsapWithCSS.fromTo(img, { yPercent: -amount }, {
			yPercent: amount * .2,
			ease: "none",
			scrollTrigger: {
				trigger: wrap,
				start: "top bottom",
				end: "bottom top",
				scrub: true
			}
		});
	});
}
function maskReveal() {
	$$$1(".mask-reveal").forEach((sec) => {
		const media = sec.querySelector(".mask-reveal__media");
		const img = media.querySelector("img");
		gsapWithCSS.timeline({ scrollTrigger: {
			trigger: sec,
			start: "top 85%",
			end: "center center",
			scrub: .6
		} }).fromTo(media, {
			scaleX: .72,
			scaleY: .76
		}, {
			scaleX: 1,
			scaleY: 1,
			ease: "none"
		}).fromTo(img, { scale: 1.25 }, {
			scale: 1,
			ease: "none"
		}, 0);
	});
}
function beforeAfter() {
	const sec = document.querySelector("[data-ba]");
	if (!sec) return;
	const stage = sec.querySelector(".ba__stage");
	const before = sec.querySelector(".ba__before");
	const beforeInner = sec.querySelector(".ba__before-inner");
	const bar = sec.querySelector(".ba__squeegee");
	const sparkles = $$$1(".ba__sparkles i", sec);
	const after = sec.querySelector(".ba__label--after");
	gsapWithCSS.set(after, { opacity: .35 });
	gsapWithCSS.timeline({ scrollTrigger: {
		trigger: sec,
		start: "top top",
		end: "+=140%",
		scrub: .6,
		pin: sec.querySelector(".ba__pin"),
		anticipatePin: 1,
		invalidateOnRefresh: true
	} }).fromTo(before, { xPercent: 0 }, {
		xPercent: 100,
		ease: "none",
		duration: 1
	}, 0).fromTo(beforeInner, { xPercent: 0 }, {
		xPercent: -100,
		ease: "none",
		duration: 1
	}, 0).fromTo(bar, { x: 0 }, {
		x: () => stage.offsetWidth,
		ease: "none",
		duration: 1
	}, 0).to(after, {
		opacity: 1,
		duration: .2
	}, .8).to(sparkles, {
		opacity: 1,
		scale: 1,
		rotate: 90,
		duration: .15,
		stagger: .05,
		ease: "back.out(3)"
	}, .85).to(sparkles, {
		opacity: 0,
		scale: .4,
		duration: .15,
		stagger: .05
	}, 1.05);
}
function servicesShowcase() {
	const sec = document.querySelector("[data-showcase]");
	if (!sec) return;
	const grid = sec.querySelector(".cards");
	const cards = $$$1(".card", grid);
	const mid = (cards.length - 1) / 2;
	const mm = gsapWithCSS.matchMedia();
	mm.add("(min-width: 1100px)", () => {
		const toCentre = (card) => grid.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
		const tl = gsapWithCSS.timeline({ scrollTrigger: {
			trigger: grid,
			start: "top 90%",
			end: "top 30%",
			scrub: .8,
			invalidateOnRefresh: true
		} });
		cards.forEach((card, i) => {
			tl.fromTo(card, {
				x: () => toCentre(card),
				y: 70 + Math.abs(i - mid) * 18,
				rotation: (i - mid) * 8,
				scale: .84,
				transformOrigin: "50% 120%",
				zIndex: cards.length - Math.round(Math.abs(i - mid))
			}, {
				x: 0,
				y: 0,
				rotation: 0,
				scale: 1,
				ease: "power2.out"
			}, 0);
		});
	});
	mm.add("(max-width: 1099px)", () => {
		cards.forEach((card, i) => {
			const dir = i % 2 ? 1 : -1;
			gsapWithCSS.fromTo(card, {
				rotateY: dir * 32,
				x: dir * 60,
				y: 50,
				opacity: .15,
				transformPerspective: 1e3,
				transformOrigin: dir > 0 ? "100% 50%" : "0% 50%"
			}, {
				rotateY: 0,
				x: 0,
				y: 0,
				opacity: 1,
				ease: "power2.out",
				scrollTrigger: {
					trigger: card,
					start: "top 98%",
					end: "top 58%",
					scrub: .6
				}
			});
		});
	});
	cards.forEach((card) => {
		const media = card.querySelector(".card__media");
		const img = media?.querySelector("img");
		const num = card.querySelector(".card__num");
		const lines = card.querySelectorAll(".card__tag, .card__title, .card__text, .tags li, .link-arrow");
		gsapWithCSS.set(media, { clipPath: "inset(100% 0% 0% 0%)" });
		gsapWithCSS.set(num, {
			scale: 0,
			rotation: -180
		});
		gsapWithCSS.set(lines, {
			y: 22,
			opacity: 0
		});
		whenVisible([card], () => {
			card.classList.add("is-shown");
			gsapWithCSS.timeline().to(media, {
				clipPath: "inset(0% 0% 0% 0%)",
				duration: 1.2,
				ease: "expo.inOut"
			}).fromTo(img, { scale: 1.35 }, {
				scale: 1,
				duration: 1.6,
				ease: "expo.out",
				clearProps: "transform"
			}, .1).to(num, {
				scale: 1,
				rotation: 0,
				duration: .9,
				ease: "back.out(2)"
			}, .6).to(lines, {
				y: 0,
				opacity: 1,
				duration: .8,
				stagger: .06,
				ease: "expo.out",
				clearProps: "transform,opacity"
			}, .35);
		}, { margin: "0px 0px -12% 0px" });
	});
}
function horizontalProcess() {
	const sec = document.querySelector("[data-process]");
	if (!sec) return;
	const track = sec.querySelector(".process__track");
	const panels = $$$1(".process__panel", sec);
	const distance = () => track.scrollWidth - window.innerWidth;
	const slide = gsapWithCSS.to(track, {
		x: () => -distance(),
		ease: "none",
		scrollTrigger: {
			trigger: sec,
			start: "top top",
			end: () => `+=${distance()}`,
			scrub: .8,
			pin: true,
			invalidateOnRefresh: true,
			anticipatePin: 1
		}
	});
	panels.forEach((panel) => {
		gsapWithCSS.fromTo(panel, {
			rotateY: -18,
			scale: .92,
			transformPerspective: 1200
		}, {
			rotateY: 0,
			scale: 1,
			ease: "none",
			scrollTrigger: {
				trigger: panel,
				containerAnimation: slide,
				start: "left right",
				end: "center center",
				scrub: true
			}
		});
	});
}
function bigWords() {
	$$$1(".big-word").forEach((el, i) => {
		gsapWithCSS.fromTo(el, { xPercent: i % 2 ? -20 : 5 }, {
			xPercent: i % 2 ? 5 : -20,
			ease: "none",
			scrollTrigger: {
				trigger: el,
				start: "top bottom",
				end: "bottom top",
				scrub: true
			}
		});
	});
}
function initCounters() {
	$$$1("[data-count]").forEach((el) => {
		const end = parseFloat(el.dataset.count);
		const suffix = el.dataset.suffix || "";
		const obj = { v: 0 };
		el.textContent = "0" + suffix;
		whenVisible([el], () => gsapWithCSS.to(obj, {
			v: end,
			duration: 2,
			ease: "power3.out",
			onUpdate: () => el.textContent = Math.round(obj.v) + suffix
		}));
	});
}
function initMarquee() {
	const loops = $$$1(".marquee__track").map((track) => {
		const loop = gsapWithCSS.to(track, {
			xPercent: -50,
			duration: 28,
			ease: "none",
			repeat: -1
		});
		loop.totalTime(14e3);
		return loop;
	});
	if (!loops.length) return;
	let dir = 1;
	let boost = 0;
	ScrollTrigger.create({
		start: 0,
		end: "max",
		onUpdate: (self) => {
			const v = self.getVelocity();
			if (Math.abs(v) < 5) return;
			dir = v < 0 ? -1 : 1;
			boost = Math.min(3, Math.abs(v) / 600);
		}
	});
	gsapWithCSS.ticker.add(() => {
		boost *= .94;
		const ts = dir * (1 + boost);
		loops.forEach((l) => {
			if (Math.abs(l.timeScale() - ts) > .01) l.timeScale(ts);
		});
	});
}
//#endregion
//#region src/js/modules/currency.js
var KEY = "ec-currency";
var read = () => {
	try {
		return localStorage.getItem(KEY);
	} catch (e) {
		return null;
	}
};
var save = (code) => {
	try {
		localStorage.setItem(KEY, code);
	} catch (e) {}
};
var format = (ghs, code) => {
	const { symbol, rate } = CURRENCIES[code];
	const value = ghs * rate;
	return symbol + (code === "GHS" ? Math.round(value / 10) * 10 : Math.round(value)).toLocaleString("en-GB");
};
function initCurrency() {
	let current = CURRENCY_TOGGLE && CURRENCIES[read()] ? read() : "GHS";
	const apply = (code, animate) => {
		current = code;
		document.querySelectorAll("[data-currency]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.currency === code)));
		document.querySelectorAll("[data-price]").forEach((el) => {
			const text = format(parseFloat(el.dataset.price), code);
			if (!animate) {
				el.textContent = text;
				return;
			}
			gsapWithCSS.timeline().to(el, {
				yPercent: -60,
				opacity: 0,
				duration: .2,
				ease: "power2.in"
			}).add(() => el.textContent = text).fromTo(el, {
				yPercent: 60,
				opacity: 0
			}, {
				yPercent: 0,
				opacity: 1,
				duration: .45,
				ease: "expo.out"
			});
		});
		document.querySelectorAll("[data-currency-name]").forEach((el) => el.textContent = code);
	};
	document.addEventListener("click", (e) => {
		const btn = e.target.closest("[data-currency]");
		if (!btn || btn.dataset.currency === current) return;
		save(btn.dataset.currency);
		apply(btn.dataset.currency, true);
	});
	apply(current, false);
}
//#endregion
//#region src/js/demo-links.js
var CARE_TABS = {
	"family-care": "abroad",
	"mama-care": "baby",
	bereavement: "funeral",
	wedding: "wedding",
	travel: "travel",
	festival: "festival"
};
/**
* @param {string} href  link as written in the full site, e.g. "/family-care.html#mama-care"
* @param {{ nav?: boolean }} [opts]  nav: true for menu links ("Contact" scrolls instead of opening WhatsApp)
* @returns {null | { href: string, tab?: string, wa?: string }}  null = leave the link as it is
*/
function demoTarget(href, { nav = false } = {}) {
	if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
	const url = new URL(href, "https://preview.local");
	const page = url.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index";
	const hash = url.hash.slice(1);
	switch (page) {
		case "index": return null;
		case "contact": {
			if (nav) return { href: "#contact" };
			const service = url.searchParams.get("service");
			return {
				href: "#contact",
				wa: service ? `Hello Exquisite Cleaners, I'd like to book ${service}.` : "Hello Exquisite Cleaners, I'd like to book a clean."
			};
		}
		case "services":
		case "airbnb": return { href: "#services" };
		case "property-maintenance": return { href: "#maintenance" };
		case "about": return { href: "#why" };
		case "family-care": return {
			href: "#care",
			tab: CARE_TABS[hash] || "abroad"
		};
		default: return { href: "#main" };
	}
}
//#endregion
//#region src/js/modules/chatbot.js
function match(text, bot) {
	const t = ` ${text.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").replace(/\s+/g, " ")} `;
	const early = bot.preMatch && bot.preMatch(t);
	if (early) return early;
	let best = null;
	let bestScore = 0;
	for (const intent of bot.intents) {
		let score = 0;
		for (const k of intent.keys || []) if (t.includes(` ${k} `)) score += 3 + k.split(" ").length;
		else if (k.length > 4 && t.includes(k)) score += 2;
		if (intent.id === "greet" || intent.id === "thanks") score *= .5;
		if (score > bestScore) {
			best = intent;
			bestScore = score;
		}
	}
	return best;
}
var isDemo = document.documentElement.hasAttribute("data-demo");
function resolveLink(url) {
	const t = isDemo && demoTarget(url);
	if (!t) return { href: url };
	return t.wa ? { href: waLink(t.wa) } : {
		href: t.href,
		tab: t.tab
	};
}
function renderRich(el, text) {
	const re = /\[\[([^|\]]+)\|([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g;
	let last = 0;
	let m;
	while (m = re.exec(text)) {
		el.append(text.slice(last, m.index));
		const isButton = m[1] !== void 0;
		const { href, tab } = resolveLink(isButton ? m[2] : m[4]);
		const a = document.createElement("a");
		a.textContent = isButton ? m[1] : m[3];
		a.href = href;
		if (isButton) a.className = "msg__btn";
		if (tab) a.dataset.tab = tab;
		if (/^https?:/.test(href)) {
			a.target = "_blank";
			a.rel = "noopener";
		}
		el.append(a);
		last = m.index + m[0].length;
	}
	el.append(text.slice(last));
}
function initChat(lenis, bot) {
	const root = document.querySelector("[data-chat]");
	if (!root) return;
	const toggle = root.querySelector("[data-chat-toggle]");
	const close = root.querySelector("[data-chat-close]");
	const panel = root.querySelector("[data-chat-panel]");
	const log = root.querySelector("[data-chat-log]");
	const chips = root.querySelector("[data-chat-chips]");
	const form = root.querySelector("[data-chat-form]");
	const input = form.querySelector("input");
	const teaser = root.querySelector("[data-chat-teaser]");
	let started = false;
	let open = false;
	const mobile = window.matchMedia("(max-width: 639px)");
	const scrollDown = () => log.scrollTop = log.scrollHeight;
	const addMsg = (text, who) => {
		const div = document.createElement("div");
		div.className = `msg msg--${who}`;
		if (who === "bot") renderRich(div, text);
		else div.textContent = text;
		log.append(div);
		scrollDown();
	};
	const setChips = (list) => {
		chips.replaceChildren(...list.map((label) => {
			const b = document.createElement("button");
			b.type = "button";
			b.textContent = label;
			b.addEventListener("click", () => ask(label));
			return b;
		}));
	};
	const respond = (intent) => {
		const typing = document.createElement("div");
		typing.className = "msg msg--bot msg--typing";
		typing.setAttribute("aria-label", `${bot.name} is typing`);
		typing.innerHTML = "<i></i><i></i><i></i>";
		log.append(typing);
		scrollDown();
		const text = intent.reply();
		setTimeout(() => {
			typing.remove();
			addMsg(text, "bot");
			setChips(intent.chips);
		}, Math.min(1400, 500 + text.length * 4));
	};
	const ask = (text) => {
		const q = text.trim();
		if (!q) return;
		addMsg(q, "user");
		const mapped = bot.chipMap[q];
		const intent = mapped ? bot.intents.find((i) => i.id === mapped) : match(q, bot);
		respond(intent || bot.fallback);
	};
	const setOpen = (state) => {
		open = state;
		root.classList.toggle("is-open", open);
		toggle.setAttribute("aria-expanded", String(open));
		toggle.setAttribute("aria-label", open ? "Close chat assistant" : "Open chat assistant");
		panel.setAttribute("aria-hidden", String(!open));
		if (mobile.matches) {
			open ? lenis?.stop() : lenis?.start();
			document.body.style.overflow = open ? "hidden" : "";
		}
		if (open && !started) {
			started = true;
			addMsg(bot.greeting, "bot");
			setChips(bot.startChips);
		}
		if (open && !mobile.matches) setTimeout(() => input.focus(), 300);
		if (!open) toggle.focus({ preventScroll: true });
	};
	toggle.addEventListener("click", () => setOpen(!open));
	close.addEventListener("click", () => setOpen(false));
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && open) setOpen(false);
	});
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		ask(input.value);
		input.value = "";
	});
	log.setAttribute("data-lenis-prevent", "");
	log.addEventListener("click", (e) => {
		if (e.target.closest("a[href^=\"#\"]")) setOpen(false);
	});
	const TEASER_KEY = "ec-chat-teaser";
	const teaserDone = () => {
		try {
			return sessionStorage.getItem(TEASER_KEY) === "1";
		} catch (e) {
			return false;
		}
	};
	const retireTeaser = () => {
		try {
			sessionStorage.setItem(TEASER_KEY, "1");
		} catch (e) {}
		teaser.classList.remove("is-visible");
		setTimeout(() => teaser.hidden = true, 500);
	};
	if (!teaserDone()) setTimeout(() => {
		if (open || teaserDone()) return;
		teaser.hidden = false;
		requestAnimationFrame(() => teaser.classList.add("is-visible"));
		try {
			sessionStorage.setItem(TEASER_KEY, "1");
		} catch (e) {}
		setTimeout(retireTeaser, 5e3);
	}, 4e3);
	teaser.querySelector("[data-chat-teaser-open]").addEventListener("click", () => {
		retireTeaser();
		setOpen(true);
	});
	teaser.querySelector("[data-chat-teaser-close]").addEventListener("click", retireTeaser);
	toggle.addEventListener("click", retireTeaser);
}
//#endregion
//#region src/js/chat/cleaners-bot.js
var price = (ghs) => {
	let code = "GHS";
	if (CURRENCY_TOGGLE) try {
		code = localStorage.getItem("ec-currency") || "GHS";
	} catch (e) {}
	const c = CURRENCIES[code] || CURRENCIES.GHS;
	const v = ghs * c.rate;
	return c.symbol + (code === "GHS" ? Math.round(v / 10) * 10 : Math.round(v)).toLocaleString("en-GB");
};
var INTENTS$1 = [
	{
		id: "greet",
		keys: [
			"hi",
			"hello",
			"hey",
			"good morning",
			"good afternoon",
			"good evening",
			"akwaaba",
			"howdy"
		],
		reply: () => "Hello, and welcome! How can I help you today? You can ask about our services, prices, care packages or booking.",
		chips: [
			"Our services",
			"Prices",
			"Book a clean"
		]
	},
	{
		id: "services",
		keys: [
			"service",
			"services",
			"what do you do",
			"offer",
			"help with",
			"options"
		],
		reply: () => "We offer:\n• Residential cleaning\n• Corporate & commercial cleaning\n• Airbnb & short-stay management\n• Specialised home care (Family Care, Mama Care, Bereavement, Wedding Recovery, Return From Travel, Festival prep)\n• Property maintenance\n\nSee them all on our [services page](/services.html).",
		chips: [
			"Home cleaning",
			"Office cleaning",
			"Family Care",
			"Maintenance"
		]
	},
	{
		id: "residential",
		keys: [
			"home",
			"house",
			"residential",
			"apartment",
			"flat",
			"deep clean",
			"deep cleaning",
			"regular clean",
			"carpet",
			"upholstery",
			"sofa",
			"window",
			"floor",
			"kitchen",
			"bathroom",
			"sanitis",
			"sanitiz",
			"move in",
			"move out",
			"moving"
		],
		reply: () => "Our residential cleaning covers homes of every size:\n• Regular and deep cleaning\n• Move-in / move-out cleans\n• Kitchens, bathrooms, windows and floors\n• Laundry and ironing\n• Carpet and upholstery cleaning\n• Home sanitisation\n\n[More about home cleaning](/services.html#residential)",
		chips: [
			"Prices",
			"Book a clean",
			"Laundry & ironing"
		]
	},
	{
		id: "laundry",
		keys: [
			"laundry",
			"ironing",
			"iron",
			"washing clothes",
			"linen"
		],
		reply: () => "Yes, we do laundry and ironing, either on its own or as part of a home clean, Airbnb turnover or care package.",
		chips: [
			"Home cleaning",
			"Airbnb hosting",
			"Book a clean"
		]
	},
	{
		id: "commercial",
		keys: [
			"office",
			"commercial",
			"business",
			"company",
			"corporate",
			"restaurant",
			"shop",
			"retail",
			"school",
			"church",
			"venue",
			"event",
			"building",
			"contract"
		],
		reply: () => "We clean offices, restaurants, retail spaces, corporate facilities, schools, commercial buildings, events and venues.\n\nWe specialise in long-term contracts with a dedicated, dependable team. [Commercial cleaning](/services.html#commercial)",
		chips: [
			"Request a site visit",
			"Prices",
			"Talk to a person"
		]
	},
	{
		id: "airbnb",
		keys: [
			"airbnb",
			"short stay",
			"short-stay",
			"host",
			"guest",
			"turnover",
			"booking.com",
			"rental",
			"holiday let",
			"property manager"
		],
		reply: () => `For Airbnb and short-stay hosts we handle:\n• Guest turnover cleaning\n• Linen and laundry\n• Property inspections\n• Restocking essentials\n• Check-in / check-out support\n• Emergency guest support\n• Maintenance coordination\n\nTurnovers start from about ${price(450)}. Ideal if you live outside Ghana. [Airbnb management](/airbnb.html)`,
		chips: [
			"I live abroad",
			"Prices",
			"Book a clean"
		]
	},
	{
		id: "family",
		keys: [
			"abroad",
			"diaspora",
			"overseas",
			"uk",
			"london",
			"usa",
			"america",
			"canada",
			"germany",
			"parent",
			"parents",
			"mum",
			"mom",
			"dad",
			"mother",
			"father",
			"elderly",
			"grandma",
			"grandmother",
			"family care",
			"check on",
			"loved one",
			"i live abroad"
		],
		reply: () => "Exquisite Family Care is made for Ghanaians abroad and busy professionals. We can:\n• Clean and sanitise the home\n• Do laundry and ironing\n• Shop for groceries and collect medication\n• Carry out home safety checks\n• Make companion visits and help with appointments\n• Make emergency support visits\n• Send you monthly updates and photographs\n\n[Explore Family Care](/family-care.html#family-care)",
		chips: [
			"Family Care price",
			"Airbnb hosting",
			"Talk to a person"
		]
	},
	{
		id: "mama",
		keys: [
			"baby",
			"newborn",
			"mama",
			"new mother",
			"new mum",
			"pregnan",
			"nursery",
			"maternity",
			"birth"
		],
		reply: () => "Congratulations! Mama Care helps new families with deep cleaning, laundry and ironing, bed linen changes, nursery preparation, kitchen cleaning, grocery shopping, meal preparation help and baby-room sanitisation. [Mama Care](/family-care.html#mama-care)",
		chips: [
			"Book a clean",
			"Prices",
			"Other care packages"
		]
	},
	{
		id: "bereavement",
		keys: [
			"funeral",
			"bereave",
			"death",
			"passed away",
			"burial",
			"one week",
			"mourning",
			"condolence"
		],
		reply: () => "We’re so sorry for your loss. Bereavement Care supports families, churches and funeral organisers with pre-funeral cleaning, guest-area preparation, cleaning during arrangements, a post-funeral deep clean, laundry, waste management and kitchen support. [Bereavement Care](/family-care.html#bereavement)",
		chips: ["Talk to a person", "Book a clean"]
	},
	{
		id: "wedding",
		keys: [
			"wedding",
			"marriage",
			"engagement",
			"newlywed",
			"reception",
			"party",
			"after party"
		],
		reply: () => "Wedding Recovery takes care of everything after the celebration: post-wedding cleaning, guest rooms, laundry, gift organisation, kitchen cleaning and waste removal. [Wedding Recovery](/family-care.html#wedding)",
		chips: [
			"Book a clean",
			"Festival prep",
			"Prices"
		]
	},
	{
		id: "travel",
		keys: [
			"return",
			"returning",
			"coming home",
			"travel",
			"trip",
			"holiday",
			"arrive",
			"arrival",
			"landing",
			"flight"
		],
		reply: () => "With Return From Travel we get your home ready before you land: deep cleaning, fresh bedding, grocery stocking, fridge preparation, airing the home and optional welcome touches. [Return From Travel](/family-care.html#travel)",
		chips: ["Book a clean", "I live abroad"]
	},
	{
		id: "festival",
		keys: [
			"festival",
			"christmas",
			"easter",
			"eid",
			"homowo",
			"new year",
			"celebration",
			"guests coming",
			"festival prep"
		],
		reply: () => "Festival & Celebration Preparation gets your home guest-ready with deep cleaning, window, carpet and upholstery cleaning, guest-room preparation and outdoor cleaning. [Festival prep](/family-care.html#festival)",
		chips: ["Book a clean", "Prices"]
	},
	{
		id: "maintenance",
		keys: [
			"paint",
			"painting",
			"plumb",
			"plumbing",
			"leak",
			"pipe",
			"tile",
			"tiling",
			"repair",
			"fix",
			"handyman",
			"maintenance",
			"fixture",
			"install",
			"broken"
		],
		reply: () => "Through qualified personnel and trusted providers we coordinate:\n• Interior and exterior painting\n• Plumbing repairs and installations\n• Floor and wall tiling\n• Minor handyman repairs\n• Fixture installations\n• Preventative maintenance\n\n[Property maintenance](/property-maintenance.html)",
		chips: ["Request a site visit", "I live abroad"]
	},
	{
		id: "prices",
		keys: [
			"price",
			"prices",
			"cost",
			"how much",
			"quote",
			"rate",
			"charge",
			"fee",
			"expensive",
			"cheap",
			"budget",
			"family care price"
		],
		reply: () => `Here are our sample starting prices:\n• Regular home clean: from ${price(PRICES.regular)}\n• Deep clean: from ${price(PRICES.deep)}\n• Move-in / move-out: from ${price(PRICES.moveout)}\n• Carpet & upholstery: from ${price(PRICES.carpet)}\n• Airbnb turnover: from ${price(PRICES.airbnb)}\n• Family Care: from ${price(PRICES.familyCare)} per month\n\nFinal price after a free quote.${CURRENCY_TOGGLE ? " You can switch currency at the top of the page." : ""}\n[[Get a free quote on WhatsApp|${waLink("Hello Exquisite Cleaners, I'd like a free quote.")}]]`,
		chips: [
			"Book a clean",
			"Office cleaning",
			"Talk to a person"
		]
	},
	{
		id: "book",
		keys: [
			"book",
			"booking",
			"appointment",
			"schedule",
			"reserve",
			"hire",
			"available",
			"availability",
			"request a site visit",
			"site visit",
			"when can"
		],
		reply: () => `Booking takes a minute:\n1. Fill in our [booking form](/contact.html), or\n2. Message us on [WhatsApp](${waLink("Hello Exquisite Cleaners, I would like to book a clean.")})\n\nWe confirm the details and time with you, usually the same day.`,
		chips: [
			"Prices",
			"Where do you work?",
			"Opening hours"
		]
	},
	{
		id: "location",
		keys: [
			"where",
			"location",
			"area",
			"areas",
			"accra",
			"tema",
			"kumasi",
			"east legon",
			"cantonments",
			"airport",
			"spintex",
			"city",
			"region",
			"cover",
			"where do you work"
		],
		reply: () => `We’re based in ${CONTACT.city} and serve Greater Accra. For other areas, [message us](${waLink("Hello, do you cover my area?")}) and we’ll let you know.`,
		chips: ["Book a clean", "Opening hours"]
	},
	{
		id: "hours",
		keys: [
			"hour",
			"hours",
			"open",
			"opening",
			"time",
			"sunday",
			"weekend",
			"opening hours"
		],
		reply: () => `Our team works ${CONTACT.hours}. Messages sent outside those hours are answered first thing the next working day.`,
		chips: ["Book a clean", "Talk to a person"]
	},
	{
		id: "payment",
		keys: [
			"pay",
			"payment",
			"momo",
			"mobile money",
			"card",
			"bank",
			"transfer",
			"invoice",
			"deposit"
		],
		reply: () => "We share payment details when we confirm your booking, including options for clients paying from abroad. Business clients on contracts receive regular invoices.",
		chips: ["Book a clean", "Talk to a person"]
	},
	{
		id: "trust",
		keys: [
			"trust",
			"safe",
			"vetted",
			"background",
			"insured",
			"reliable",
			"staff",
			"cleaners",
			"team",
			"who will come",
			"eco",
			"product",
			"chemical",
			"supplies",
			"equipment"
		],
		reply: () => "Your home is in safe hands. Our cleaners are carefully vetted and trained, and we use quality, eco-conscious products. Tell us about allergies or product preferences and we’ll follow them. Clients abroad receive photo updates so they can see the work.",
		chips: ["Book a clean", "Family Care"]
	},
	{
		id: "human",
		keys: [
			"human",
			"person",
			"agent",
			"call",
			"phone",
			"number",
			"contact",
			"email",
			"whatsapp",
			"talk to a person",
			"speak"
		],
		reply: () => `Of course. You can reach our team:\n• [WhatsApp](${waLink("Hello Exquisite Cleaners!")})\n• Call [${CONTACT.phone}](tel:${CONTACT.phoneHref})${CONTACT.email ? `\n• Email [${CONTACT.email}](mailto:${CONTACT.email})` : ""}`,
		chips: ["Book a clean", "Prices"]
	},
	{
		id: "thanks",
		keys: [
			"thank",
			"thanks",
			"medaase",
			"great",
			"perfect",
			"awesome",
			"ok",
			"okay",
			"bye",
			"goodbye"
		],
		reply: () => "You’re very welcome! If you need anything else, I’m right here. You do, we clean.",
		chips: ["Book a clean", "Our services"]
	}
];
var CHIP_MAP = {
	"Our services": "services",
	"Home cleaning": "residential",
	"Office cleaning": "commercial",
	"Airbnb hosting": "airbnb",
	"Family Care": "family",
	"Family Care price": "prices",
	"Maintenance": "maintenance",
	"Prices": "prices",
	"Book a clean": "book",
	"I live abroad": "family",
	"Talk to a person": "human",
	"Opening hours": "hours",
	"Where do you work?": "location",
	"Laundry & ironing": "laundry",
	"Request a site visit": "book",
	"Festival prep": "festival",
	"Other care packages": "care"
};
var CARE = {
	id: "care",
	reply: () => "Our specialised care packages:\n• Exquisite Family Care\n• Mama Care\n• Bereavement Care\n• Wedding Recovery\n• Return From Travel\n• Festival & Celebration Preparation\n\n[See all packages](/family-care.html)",
	chips: ["Family Care", "Book a clean"]
};
var START_CHIPS = [
	"Prices",
	"I live abroad",
	"Airbnb hosting",
	"Office cleaning",
	"Book a clean"
];
var PRICE_WORDS = /\b(price|prices|pricing|cost|costs|how much|quote|rate|rates|charge|charges|fee|fees|expensive|cheap|budget)\b/;
var PRICE_SERVICES = [
	{
		keys: ["deep"],
		name: "A deep clean",
		ghs: () => PRICES.deep,
		ask: "a deep clean"
	},
	{
		keys: [
			"move in",
			"move-in",
			"move out",
			"move-out",
			"moving",
			"end of tenancy"
		],
		name: "A move-in / move-out clean",
		ghs: () => PRICES.moveout,
		ask: "a move-in / move-out clean"
	},
	{
		keys: [
			"carpet",
			"upholstery",
			"sofa",
			"couch",
			"rug"
		],
		name: "Carpet & upholstery cleaning",
		ghs: () => PRICES.carpet,
		ask: "carpet & upholstery cleaning"
	},
	{
		keys: [
			"airbnb",
			"turnover",
			"short stay",
			"short-stay",
			"guest"
		],
		name: "An Airbnb turnover clean",
		ghs: () => PRICES.airbnb,
		ask: "Airbnb turnover cleaning",
		extra: () => `With linen laundry, restocking and a photo report, it starts from ${price(PRICES.airbnbLinen)}.`
	},
	{
		keys: [
			"family care",
			"parent",
			"parents",
			"mum",
			"mom",
			"dad",
			"abroad",
			"elderly"
		],
		name: "Exquisite Family Care",
		ghs: () => PRICES.familyCare,
		per: " per month",
		ask: "Exquisite Family Care"
	},
	{
		keys: [
			"office",
			"commercial",
			"business",
			"restaurant",
			"school",
			"shop",
			"contract",
			"company"
		],
		ask: "commercial cleaning",
		custom: "Business cleaning is priced per site, after a free site visit, so the team and schedule match your space."
	},
	{
		keys: [
			"mama",
			"baby",
			"bereave",
			"funeral",
			"wedding",
			"travel",
			"festival",
			"christmas",
			"paint",
			"plumb",
			"tiling",
			"repair",
			"maintenance"
		],
		ask: "a care package or maintenance job",
		custom: "This service is tailored to your home and dates, so we price it after a quick chat."
	},
	{
		keys: [
			"regular",
			"weekly",
			"fortnightly",
			"standard",
			"home",
			"house",
			"apartment",
			"flat",
			"clean",
			"cleaning"
		],
		name: "A regular home clean",
		ghs: () => PRICES.regular,
		ask: "a regular home clean"
	}
];
function priceAnswer(t) {
	const svc = PRICE_SERVICES.find((p) => p.keys.some((k) => k.length > 5 ? t.includes(k) : t.includes(` ${k} `)));
	if (!svc) return INTENTS$1.find((i) => i.id === "prices");
	const button = `[[Get a free quote on WhatsApp|${waLink(`Hello Exquisite Cleaners, I'd like a free quote for ${svc.ask}.`)}]]`;
	const body = svc.custom ? svc.custom : `${svc.name} starts from ${price(svc.ghs())}${svc.per || ""} (sample price).${svc.extra ? `\n${svc.extra()}` : ""}`;
	return {
		reply: () => `${body}\n\nFinal price after a free quote.\n${button}`,
		chips: [
			"Prices",
			"Book a clean",
			"Talk to a person"
		]
	};
}
var FALLBACK = {
	reply: () => `I’m not completely sure about that one, but our team can help. [Chat with us on WhatsApp](${waLink("Hello Exquisite Cleaners, I have a question.")}) or try one of these:`,
	chips: [
		"Our services",
		"Prices",
		"Talk to a person"
	]
};
var cleanersBot = {
	name: "Ama",
	greeting: "Akwaaba! I’m Ama, the Exquisite Cleaners assistant.\nAsk me about our services, prices, care packages or how to book.",
	intents: [...INTENTS$1, CARE],
	chipMap: { ...CHIP_MAP },
	startChips: START_CHIPS,
	preMatch: (t) => PRICE_WORDS.test(t) ? priceAnswer(t) : null,
	fallback: FALLBACK
};
//#endregion
//#region src/js/chat/ventures-bot.js
var quoteButton = (what) => `[[Get a quote on WhatsApp|${waLink(`Hello Exquisite Ventures, I'd like a quote for ${what}.`)}]]`;
var venturesBot = {
	name: "Exquisite Ventures Assistant",
	greeting: "Akwaaba! I’m the Exquisite Ventures assistant.\nAsk me about the products we import, planning an event, or getting a quote.",
	intents: [
		{
			id: "greet",
			keys: [
				"hi",
				"hello",
				"hey",
				"good morning",
				"good afternoon",
				"good evening",
				"akwaaba",
				"howdy"
			],
			reply: () => "Hello, and welcome to Exquisite Ventures! Ask me about importing products, planning an event, or getting a quote.",
			chips: [
				"Our services",
				"Plan an event",
				"Products we import"
			]
		},
		{
			id: "about",
			keys: [
				"who are you",
				"about",
				"company",
				"what do you do",
				"exquisite ventures",
				"business",
				"team",
				"services",
				"service",
				"offer"
			],
			reply: () => "Exquisite Ventures is a team of creative business people who know both the Ghanaian and international markets. We help start-ups and established businesses with:\n• Import & export of premium products\n• Event organisation\n• Event management\n\n[See our services](#services)",
			chips: [
				"Products we import",
				"Plan an event",
				"Get a quote"
			]
		},
		{
			id: "import",
			keys: [
				"import",
				"export",
				"products",
				"product",
				"wine",
				"wines",
				"water",
				"flavoured",
				"cosmetics",
				"body care",
				"tea",
				"juice",
				"fragrance",
				"perfume",
				"supply",
				"supplier",
				"wholesale",
				"stock",
				"buy",
				"order",
				"distribute"
			],
			reply: () => `We import premium products into Ghana, including wines, flavoured and sparkling water, juices, teas, cosmetics and fragrances.\n\nTell us what you need and in what quantities, and we’ll check availability.\n[See our products](#products)\n${quoteButton("imported products")}`,
			chips: [
				"Our partners",
				"Get a quote",
				"Talk to a person"
			]
		},
		{
			id: "events",
			keys: [
				"event",
				"events",
				"party",
				"parties",
				"corporate",
				"wedding",
				"birthday",
				"christening",
				"naming",
				"launch",
				"dinner",
				"venue",
				"organise",
				"organize",
				"plan",
				"planning",
				"consulting",
				"celebration",
				"plan an event"
			],
			reply: () => `Event organisation covers:\n• Corporate events\n• Private events and parties\n• Venue scouting\n• Event consulting\n\nShare your date, guest numbers and style, and we’ll put a plan together.\n${quoteButton("an event")}`,
			chips: [
				"Event management",
				"See the gallery",
				"Get a quote"
			]
		},
		{
			id: "management",
			keys: [
				"management",
				"manage",
				"coordinate",
				"coordinator",
				"on the day",
				"my own event",
				"supervise",
				"event management"
			],
			reply: () => `Already planning your own event? With event management we become an extra pair of eyes on the day, keeping suppliers, timing and guests on track so you can enjoy it.\n${quoteButton("event management")}`,
			chips: ["Plan an event", "Get a quote"]
		},
		{
			id: "partners",
			keys: [
				"partner",
				"partners",
				"brands",
				"brand",
				"zidela",
				"carmien",
				"clos malverne",
				"sezabe",
				"kegau",
				"cedarberg",
				"our partners"
			],
			reply: () => "We’re proud to work with brands including Zidela, Carmien, Clos Malverne, Sezabe, Kegau and Cedarberg Aqua.\n[See our partners](#partners)",
			chips: ["Products we import", "Get a quote"]
		},
		{
			id: "gallery",
			keys: [
				"gallery",
				"photos",
				"pictures",
				"portfolio",
				"past events",
				"see the gallery",
				"examples"
			],
			reply: () => "Have a look at some of our past events and setups in the [gallery](#gallery).",
			chips: ["Plan an event", "Get a quote"]
		},
		{
			id: "cleaners",
			keys: [
				"clean",
				"cleaning",
				"cleaners",
				"cleaner",
				"home care",
				"airbnb",
				"housekeeping",
				"exquisite cleaners"
			],
			reply: () => `Cleaning is handled by our sister company, Exquisite Cleaners: premium home, office and Airbnb cleaning plus family care across Accra.\n[[Visit Exquisite Cleaners|${VENTURES.cleanersUrl}]]`,
			chips: ["Our services", "Talk to a person"]
		},
		{
			id: "quote",
			keys: [
				"price",
				"prices",
				"cost",
				"how much",
				"quote",
				"rate",
				"charge",
				"fee",
				"budget",
				"get a quote"
			],
			reply: () => `Every order and event is different, so we price each one after a quick chat. Send us the details and we’ll reply with a quote.\n${quoteButton("my project")}`,
			chips: [
				"Plan an event",
				"Products we import",
				"Talk to a person"
			]
		},
		{
			id: "location",
			keys: [
				"where",
				"location",
				"located",
				"ghana",
				"accra",
				"south africa",
				"country",
				"deliver",
				"delivery"
			],
			reply: () => `We’re based in ${CONTACT.city} and serve clients across Ghana, working with producers and partners abroad, including South Africa.`,
			chips: ["Products we import", "Talk to a person"]
		},
		{
			id: "human",
			keys: [
				"human",
				"person",
				"agent",
				"call",
				"phone",
				"number",
				"contact",
				"whatsapp",
				"talk to a person",
				"speak",
				"facebook",
				"instagram",
				"social",
				"email"
			],
			reply: () => `You can reach our team:\n• [WhatsApp](${waLink("Hello Exquisite Ventures!")})\n• Call [${CONTACT.phone}](tel:${CONTACT.phoneHref})\n• [Facebook](${VENTURES.social.facebook}) · [Instagram](${VENTURES.social.instagram})`,
			chips: ["Get a quote", "Our services"]
		},
		{
			id: "thanks",
			keys: [
				"thank",
				"thanks",
				"medaase",
				"great",
				"perfect",
				"awesome",
				"ok",
				"okay",
				"bye",
				"goodbye"
			],
			reply: () => "You’re very welcome! We’d love to bring a little class to your next project.",
			chips: ["Get a quote", "Our services"]
		}
	],
	chipMap: {
		"Our services": "about",
		"Plan an event": "events",
		"Products we import": "import",
		"Get a quote": "quote",
		"Event management": "management",
		"Our partners": "partners",
		"See the gallery": "gallery",
		"Talk to a person": "human",
		"Exquisite Cleaners": "cleaners"
	},
	startChips: [
		"Our services",
		"Plan an event",
		"Products we import",
		"Get a quote",
		"Exquisite Cleaners"
	],
	fallback: {
		reply: () => `I’m not completely sure about that one, but our team can help. [Chat with us on WhatsApp](${waLink("Hello Exquisite Ventures, I have a question.")}) or try one of these:`,
		chips: [
			"Our services",
			"Get a quote",
			"Talk to a person"
		]
	}
};
//#endregion
//#region src/js/modules/interactions.js
var $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
var finePointer$1 = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
function initInteractions(lenis, reduceMotion) {
	if (finePointer$1 && !reduceMotion) {
		initTilt();
		initMagnetic();
		initCursor();
	}
	initAnchors(lenis);
	initFinder(reduceMotion);
	initFlips();
	initBookingForm();
	initGallery(reduceMotion);
}
function initGallery(reduceMotion) {
	const gallery = document.querySelector("[data-gallery]");
	const box = document.querySelector("[data-lightbox]");
	if (!gallery || !box) return;
	const items = $$("[data-full]", gallery);
	const img = box.querySelector("img");
	const count = box.querySelector("[data-lightbox-count]");
	let index = 0;
	let opener = null;
	const show = (i, dir = 0) => {
		index = (i + items.length) % items.length;
		const item = items[index];
		img.src = item.dataset.full;
		img.alt = item.querySelector("img")?.alt || "";
		count.textContent = `${index + 1} / ${items.length}`;
		if (!reduceMotion) gsapWithCSS.fromTo(img, {
			opacity: 0,
			x: dir * 40,
			scale: .97
		}, {
			opacity: 1,
			x: 0,
			scale: 1,
			duration: .5,
			ease: "expo.out"
		});
	};
	const open = (i, from) => {
		opener = from;
		box.hidden = false;
		document.body.style.overflow = "hidden";
		window.__lenis?.stop();
		show(i);
		if (!reduceMotion) gsapWithCSS.fromTo(box, { opacity: 0 }, {
			opacity: 1,
			duration: .35
		});
		box.querySelector("[data-lightbox-close]").focus();
	};
	const close = () => {
		box.hidden = true;
		document.body.style.overflow = "";
		window.__lenis?.start();
		opener?.focus({ preventScroll: true });
	};
	items.forEach((item, i) => item.addEventListener("click", () => open(i, item)));
	box.querySelector("[data-lightbox-close]").addEventListener("click", close);
	box.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(index - 1, -1));
	box.querySelector("[data-lightbox-next]").addEventListener("click", () => show(index + 1, 1));
	box.addEventListener("click", (e) => {
		if (e.target === box) close();
	});
	document.addEventListener("keydown", (e) => {
		if (box.hidden) return;
		if (e.key === "Escape") close();
		if (e.key === "ArrowRight") show(index + 1, 1);
		if (e.key === "ArrowLeft") show(index - 1, -1);
	});
	let startX = null;
	box.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
	box.addEventListener("touchend", (e) => {
		if (startX === null) return;
		const dx = e.changedTouches[0].clientX - startX;
		if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
		startX = null;
	});
}
function initTilt() {
	$$("[data-tilt]").forEach((el) => {
		const rx = gsapWithCSS.quickTo(el, "rotateX", {
			duration: .6,
			ease: "power3.out"
		});
		const ry = gsapWithCSS.quickTo(el, "rotateY", {
			duration: .6,
			ease: "power3.out"
		});
		gsapWithCSS.set(el, { transformPerspective: 1e3 });
		el.addEventListener("pointermove", (e) => {
			const r = el.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width - .5;
			const y = (e.clientY - r.top) / r.height - .5;
			rx(-y * 10);
			ry(x * 12);
		});
		el.addEventListener("pointerleave", () => {
			rx(0);
			ry(0);
		});
	});
}
function initMagnetic() {
	$$("[data-magnetic]").forEach((el) => {
		const x = gsapWithCSS.quickTo(el, "x", {
			duration: .5,
			ease: "power3.out"
		});
		const y = gsapWithCSS.quickTo(el, "y", {
			duration: .5,
			ease: "power3.out"
		});
		el.addEventListener("pointermove", (e) => {
			const r = el.getBoundingClientRect();
			x((e.clientX - r.left - r.width / 2) * .3);
			y((e.clientY - r.top - r.height / 2) * .4);
		});
		el.addEventListener("pointerleave", () => {
			x(0);
			y(0);
		});
	});
}
function initCursor() {
	const cursor = document.querySelector(".cursor");
	if (!cursor) return;
	const label = cursor.querySelector(".cursor__label");
	const x = gsapWithCSS.quickTo(cursor, "x", {
		duration: .35,
		ease: "power3.out"
	});
	const y = gsapWithCSS.quickTo(cursor, "y", {
		duration: .35,
		ease: "power3.out"
	});
	window.addEventListener("pointermove", (e) => {
		cursor.classList.add("is-visible");
		x(e.clientX);
		y(e.clientY);
	});
	document.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
	document.addEventListener("pointerover", (e) => {
		const t = e.target.closest("[data-cursor]");
		cursor.classList.toggle("is-hover", !!t);
		if (t) label.textContent = t.dataset.cursor;
	});
}
function initAnchors(lenis) {
	document.addEventListener("click", (e) => {
		const a = e.target.closest("a[href^=\"#\"]");
		if (!a || a.getAttribute("href").length < 2) return;
		const target = document.querySelector(a.getAttribute("href"));
		if (!target) return;
		e.preventDefault();
		if (a.dataset.tab) document.getElementById(`tab-${a.dataset.tab}`)?.click();
		if (lenis) lenis.scrollTo(target, {
			offset: -80,
			duration: 1.4
		});
		else target.scrollIntoView({ behavior: "smooth" });
	});
}
function initFinder(reduceMotion) {
	$$("[data-finder]").forEach((finder) => {
		const tabs = $$("[role=\"tab\"]", finder);
		const panels = $$("[role=\"tabpanel\"]", finder);
		const select = (tab, focus) => {
			tabs.forEach((t) => {
				const on = t === tab;
				t.setAttribute("aria-selected", String(on));
				t.tabIndex = on ? 0 : -1;
			});
			panels.forEach((p) => p.hidden = p.id !== tab.getAttribute("aria-controls"));
			if (focus) tab.focus();
			const panel = document.getElementById(tab.getAttribute("aria-controls"));
			if (panel) {
				gsapWithCSS.fromTo(panel.querySelector("img"), {
					clipPath: "inset(0 100% 0 0)",
					scale: 1.15
				}, {
					clipPath: "inset(0 0% 0 0)",
					scale: 1,
					duration: 1,
					ease: "expo.out"
				});
				gsapWithCSS.fromTo(panel.querySelectorAll(".finder__body > *"), {
					y: 26,
					opacity: 0
				}, {
					y: 0,
					opacity: 1,
					duration: .7,
					stagger: .05,
					ease: "expo.out"
				});
			}
		};
		tabs.forEach((tab, i) => {
			tab.addEventListener("click", () => select(tab));
			tab.addEventListener("keydown", (e) => {
				if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
				const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
				select(next, true);
			});
		});
	});
}
function initFlips() {
	$$(".flip").forEach((card) => {
		const btns = $$("[data-flip]", card);
		const toggle = () => {
			const on = card.classList.toggle("is-flipped");
			btns.forEach((b) => b.setAttribute("aria-expanded", String(on)));
		};
		btns.forEach((b) => b.addEventListener("click", (e) => {
			e.stopPropagation();
			toggle();
		}));
		if (!finePointer$1) card.addEventListener("click", (e) => {
			if (!e.target.closest("a, button")) toggle();
		});
	});
	if (location.hash) {
		const target = document.querySelector(location.hash);
		if (target?.classList.contains("flip")) setTimeout(() => target.classList.add("is-flipped"), 1200);
	}
}
function initBookingForm() {
	const form = document.querySelector("[data-booking]");
	if (!form) return;
	const status = form.querySelector("[data-status]");
	const service = new URLSearchParams(location.search).get("service");
	const select = form.querySelector("select[name=\"service\"]");
	if (service && select) {
		if (Array.from(select.options).find((o) => o.value === service)) select.value = service;
	}
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		let firstInvalid = null;
		$$("[required]", form).forEach((input) => {
			const field = input.closest(".field");
			const err = field.querySelector(".field__error");
			const ok = input.value.trim() !== "";
			field.classList.toggle("field--invalid", !ok);
			input.setAttribute("aria-invalid", String(!ok));
			if (err) err.textContent = ok ? "" : "Please fill this in.";
			if (!ok && !firstInvalid) firstInvalid = input;
		});
		if (firstInvalid) {
			firstInvalid.focus();
			return;
		}
		const data = new FormData(form);
		if (form.dataset.booking === "generic") {
			const fields = $$("input, select, textarea", form).filter((el) => el.name && el.value.trim() && el.type !== "radio" && el.type !== "checkbox");
			const lines = [form.dataset.intro || "Hello,", ...fields.map((el) => {
				return `• ${form.querySelector(`label[for="${el.id}"]`)?.textContent.replace(/\s*\*$/, "").trim() || el.name}: ${el.value.trim()}`;
			})];
			window.open(waLink(lines.join("\n")), "_blank", "noopener");
			status.textContent = "Thank you! WhatsApp has opened with your message. Just press send and we’ll reply shortly.";
			status.hidden = false;
			gsapWithCSS.fromTo(status, {
				y: 12,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: .6,
				ease: "expo.out"
			});
			return;
		}
		const lines = [
			"Hello Exquisite Cleaners, I would like to book:",
			`• Service: ${data.get("service")}`,
			data.get("property") && `• Property: ${data.get("property")}`,
			data.get("frequency") && `• Frequency: ${data.get("frequency")}`,
			data.get("date") && `• Preferred date: ${data.get("date")}`,
			`• Location: ${data.get("location")}`,
			`• Name: ${data.get("name")}`,
			`• Phone: ${data.get("phone")}`,
			data.get("abroad") && "• I live abroad (diaspora client)",
			data.get("message") && `• Notes: ${data.get("message")}`
		].filter(Boolean);
		window.open(waLink(lines.join("\n")), "_blank", "noopener");
		status.textContent = "Thank you! WhatsApp has opened with your booking details. Just press send and we’ll reply shortly.";
		status.hidden = false;
		gsapWithCSS.fromTo(status, {
			y: 12,
			opacity: 0
		}, {
			y: 0,
			opacity: 1,
			duration: .6,
			ease: "expo.out"
		});
	});
}
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/js/main.js
gsapWithCSS.registerPlugin(ScrollTrigger, SplitText);
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
var lenis = null;
if (!reduceMotion && finePointer) {
	lenis = new Lenis({
		lerp: .1,
		smoothWheel: true
	});
	lenis.on("scroll", ScrollTrigger.update);
	gsapWithCSS.ticker.add((time) => lenis.raf(time * 1e3));
}
gsapWithCSS.ticker.lagSmoothing(500, 33);
window.__lenis = lenis;
var $all = (sel) => document.querySelectorAll(sel);
$all("[data-wa]").forEach((a) => {
	a.href = waLink(a.dataset.wa);
	a.target = "_blank";
	a.rel = "noopener";
});
$all("[data-tel]").forEach((a) => {
	a.href = `tel:${CONTACT.phoneHref}`;
	a.textContent = CONTACT.phone;
});
$all("[data-tel-link]").forEach((a) => a.href = `tel:${CONTACT.phoneHref}`);
$all("[data-tel-text]").forEach((el) => el.textContent = CONTACT.phone);
if (CONTACT.email) {
	$all("[data-mail], [data-mail-link]").forEach((a) => {
		a.href = `mailto:${CONTACT.email}`;
		a.hidden = false;
	});
	$all("[data-mail]").forEach((a) => a.textContent = CONTACT.email);
	$all("[data-mail-text]").forEach((el) => el.textContent = CONTACT.email);
} else $all("[data-mail], [data-mail-link]").forEach((el) => el.remove());
$all("[data-social]").forEach((a) => {
	const url = ACTIVE_SOCIAL[a.dataset.social];
	if (url) {
		a.href = url;
		a.hidden = false;
	} else a.remove();
});
$all("[data-socials]").forEach((box) => box.hidden = !box.querySelector("a"));
$all("[data-cleaners-link]").forEach((a) => a.href = VENTURES.cleanersUrl);
document.querySelectorAll("[data-hours]").forEach((el) => CONTACT.hours ? el.textContent = CONTACT.hours : el.remove());
document.querySelectorAll("[data-year]").forEach((el) => el.textContent = (/* @__PURE__ */ new Date()).getFullYear());
initHeader(lenis);
initDrawer(lenis);
initCurrency();
initChat(lenis, IS_VENTURES ? venturesBot : cleanersBot);
initInteractions(lenis, reduceMotion);
initPageTransitions(lenis);
Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]).then(async () => {
	initAnimations({
		reduceMotion,
		introTimeline: await initIntro()
	});
});
var heroStage = document.querySelector("[data-hero-3d]");
var lowPower = !(/iP(hone|ad|od)/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && (navigator.hardwareConcurrency || 4) <= 4 || navigator.deviceMemory && navigator.deviceMemory <= 3 || navigator.connection && navigator.connection.saveData;
if (heroStage && !lowPower) {
	const load = () => __vitePreload(() => import("./hero3d-DMsoRnwv.js").then((m) => m.initHero3D(heroStage, reduceMotion)), []).catch(() => {});
	const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
	const schedule = () => idle(load, { timeout: 2500 });
	if (document.readyState === "complete") schedule();
	else window.addEventListener("load", schedule, { once: true });
}
var ring = document.querySelector("[data-ring]");
if (ring) {
	const io = new IntersectionObserver(([e]) => {
		if (!e.isIntersecting) return;
		io.disconnect();
		__vitePreload(() => import("./ring-BtkTiuVJ.js").then((m) => m.initRing(ring, reduceMotion)), []);
	}, { rootMargin: "800px 0px" });
	io.observe(ring);
}
var globe = document.querySelector("[data-globe]");
if (globe) {
	const io = new IntersectionObserver(([e]) => {
		if (!e.isIntersecting) return;
		io.disconnect();
		__vitePreload(() => import("./globe-Og-nP4gN.js").then((m) => m.initGlobe(globe, reduceMotion)), []);
	}, { rootMargin: "600px 0px" });
	io.observe(globe);
}
//#endregion
export { gsapWithCSS as n, ScrollTrigger as t };
