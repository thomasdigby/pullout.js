
var pullout = function (params) {

	var options = {

		toggle: false,
		toggleContent: 'Show code',
		toggleId: 'toggle-',
		toggleSelector: '[data-pullout-toggle]',

		codeId: 'output-',
		codeSelector: '[data-pullout-output]',
		clickToHighlight: true,

		markupObject: {},
		markupSelector: '[data-pullout-input]',

		appendTo: '',

		prismCss: 'dist/prism.css',
		prismJs: 'dist/prism.js'
	};

	var init = function () {

		// get custom parameters from Smang() & array of code objects
		getCustomParams();
		options.markupObject = document.querySelectorAll(options.markupSelector);

		// detect modern browsers
		if ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {

			// run
			appendCode();

			// load dependendies & add prism class
			document.body.classList.add('language-markup');
			loadCSS(options.prismCss);
			loadJS(options.prismJs, loadPrism());
		}
	};
	var getCustomParams = function () {

		// for each custom attribute, overwrite default
		for (var attrname in params) {
			options[attrname] = params[attrname];
		}
	};
	var appendCode = function () {

		// for each object
		for (var i = 0; i < options.markupObject.length; i++) {

			// get markup and format to code block
			var code = options.markupObject[i],
				formattedCode = formatOutput(code),
				domObject = buildObject(i, formattedCode),
				parentContainer;

			// test for append selector
			if (options.appendTo.length) {
				parentContainer = checkParent(code);
			}

			// if append selector is declared
			if (!!parentContainer) {
				// append to container instead of input
				insertHtml(parentContainer, i, domObject);
			} else {
				// append to input
				insertHtml(code, i, domObject);
			}

			// append markup and toggle click event
			if (options.toggle) {
				bindToggleClickEvent(i);
			}
			if (options.clickToHighlight) {
				bindOutputClickEvent(i);
			}
		}
	};

	// bind events
	var bindToggleClickEvent = function (i) {

		var button = document.getElementById(options.toggleId + i);

		// on click of toggle
		button.addEventListener('click', function () {
			// toggle code visibility
			toggleVisibility(i);
		}, false);
	};
	var bindOutputClickEvent = function (i) {

		var code = document.getElementById(options.codeId + i);

		code.addEventListener('click', function () {
			selectContent(code);
		}, false);
	};
	var selectContent = function (code) {

		// select thisOutput content
		var range = document.createRange(),
			selection = window.getSelection();

		range.selectNodeContents(code);
		selection.removeAllRanges();
		selection.addRange(range);
	};
	var toggleVisibility = function (i) {

		// get code block
		var thisOutput = document.getElementById(options.codeId + i);

		// if code is not visible
		if (thisOutput.getAttribute('aria-visible') === 'false') {

			// show code
			thisOutput.setAttribute('aria-visible', true);

		} else {

			// hide code
			thisOutput.setAttribute('aria-visible', false);
		}
	};

	// code output
	var buildObject = function (i, thisHtml) {

		var selector = detectSelectorType(options.codeSelector),
			style = 'overflow: auto; padding: 15px 18px;',
			toggle = options.toggle ? ' aria-visible="false" ' : '',
			smangObj = [
			'<code id="' + options.codeId + i + '" style="' + style + '" ' + toggle + selector + '>',
				thisHtml,
			'</code>'
			].join('');

		return smangObj;
	};
	var countTabs = function (escapedHtmlArray) {
		return escapedHtmlArray[1].match(/\t/g).length;
	};
	var checkParent = function (element) {

		var parents = [],
			parent = element.parentNode,
			parentContainer;

		while (!!parent) {
			if (parent !== document) {

				var selector = options.appendTo.substring(1, options.appendTo.length - 1);
				parentContainer = parent.getAttribute(selector) !== null ? parent : false;

				if (parentContainer) {
					break;
				}
			}
			var o = parent;
			parents.push(o);
			parent = o.parentNode;
		}

		return parentContainer;
	};
	var escapeHtml = function (string) {

		var entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			'/': '&#x2F;'
		};

		return String(string).replace(/[&<>''\/]/g, function (s) {
			return entityMap[s];
		});
	};
	var formatOutput = function (code) {

		var escapedHtml = escapeHtml(code.innerHTML),
			escapedHtmlArray = escapedHtml.split('\n'),
			formattedOutput = '',
			tabCount = 0;

		// detect if html array has multiple lines
		if (escapedHtmlArray[1].length) {
			tabCount = parseInt(countTabs(escapedHtmlArray));
		}

		// create formatted html output
		for (var i = 0; i < escapedHtmlArray.length; i++) {
			formattedOutput += escapedHtmlArray[i].replace('=""', '').substring(tabCount) + '\n';
		}

		return formattedOutput.trim();
	};
	var insertHtml = function (code, i, domObject) {

		// insert markup object
		code.insertAdjacentHTML('afterbegin', domObject);

		if (options.toggle) {

			var selector = detectSelectorType(options.toggleSelector),
				style = ' style="padding: 10px;" ',
				button = [
				'<button id="' + options.toggleId + i + '" ' + selector + style + '>',
					options.toggleContent,
				'</button>'
				].join('');

			if (!!code.previousElementSibling) {
				code.previousElementSibling.insertAdjacentHTML('afterbegin', button);
			} else {
				code.insertAdjacentHTML('afterbegin', button);
			}
		}
	};
	var detectSelectorType = function (customSelector) {

		var isClass = customSelector.indexOf('.') !== -1,
			selectorClass = customSelector.substr(1),
			selectorOther = customSelector.slice(1, customSelector.length - 1),
			selector = isClass ? 'class="' + selectorClass + '"' : selectorOther;

		return selector;
	};

	// dependencies
	var loadJS = function (src, cb) {
		/*!
			loadJS: load a JS file asynchronously.
			[c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish).
			Licensed MIT
		*/
		'use strict';
		var ref = window.document.getElementsByTagName('script')[0],
			script = window.document.createElement('script');
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore(script, ref);
		if (cb && typeof (cb) === 'function') {
			script.onload = cb;
		}
		return script;
	};
	var loadCSS = function (href, before, media) {
		/*!
			loadCSS: load a CSS file asynchronously.
			[c]2014 @scottjehl, Filament Group, Inc.
			Licensed MIT
		*/
		'use strict';
		var ss = window.document.createElement('link'),
			ref = before || window.document.getElementsByTagName('script')[0],
			sheets = window.document.styleSheets;
		ss.rel = 'stylesheet';
		ss.href = href;
		ss.media = 'only x';
		ref.parentNode.insertBefore(ss, ref);
		function toggleMedia() {
			var defined;
			for (var i = 0; i < sheets.length; i++) {
				if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
					defined = true;
				}
			}
			if (defined) {
				ss.media = media || 'all';
			}
			else {
				setTimeout(toggleMedia);
			}
		}
		toggleMedia();
		return ss;
	};
	var loadPrism = function () {
		setTimeout(function () {
			Prism.highlightAll();
		}, 250);
	};

	init();
};