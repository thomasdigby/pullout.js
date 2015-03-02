
/*
 * FormatHTML: JS utility to format HTML
 * @thomasdigby
 * Licensed MIT
 */
function formatHtml(htmlString) {

	function indentHtml(htmlString) {

		// create array from html string
		var htmlArray = createHtmlArray(htmlString),
			indent = '',
			formattedHtml = '';

		// for each line in array
		for (var i = 0; i < htmlArray.length; i++) {

			var currLine = htmlArray[i],
				prevLine = htmlArray[i - 1];

			// only the second line onwards needs indenting
			if (i > 0) {

				// test for opening tag, not closing tag, not comment & not self closing tag
				if (isOpeningTag(prevLine) && !isClosingTag(prevLine) && !isComment(prevLine) && !isSelfClosingTag(prevLine)) {
					// increment tab indent
					indent += '\t';
				}
				// test for closing tag
				if (isClosingTag(currLine)) {
					// decrement tab indent
					indent = indent.slice(0, -1);
				}
			}

			// add formatted output to current output
			formattedHtml += indent + currLine + '\n';
		}

		return formattedHtml.trim();
	}

	// returns html array
	function createHtmlArray(htmlString) {

		// create array split by tag
		var escapedHtml = escapeHtml(htmlString),
			htmlArray = escapedHtml
				// remove tab
				.replace(/\t/g, '')
				// remove line break
				.replace(/\n/g, '')
				// remove space between tags
				.replace(/\&gt;[\s]+\&lt;/g, '&gt;&lt;')
				// add new line before < if not prepended by > or a line break
				.replace(/(?!&gt;)(?!\n)&lt;/g, '\n&lt;')
				// add new line after > if not followed by < or a line break
				.replace(/&gt;(?!&lt;)(?!\n)/g, '&gt;\n')
				// split on each new line
				.split('\n');

		// return filtered array
		return htmlArray.filter(function (item) {
			return item !== '';
		});
	}

	// returns escaped string
	function escapeHtml(htmlString) {

		// entities to be escaped
		var entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			'/': '&#x2F;'
		};

		// return escaped string
		return String(htmlString).replace(/[&<>''\/]/g, function (str) {
			return entityMap[str];
		});
	}

	// helpers
	function isOpeningTag(string) {
		return string.substring(0, 4) === '&lt;';
	}
	function isClosingTag(string) {
		return string.substring(4, 10) === '&#x2F;';
	}
	function isSelfClosingTag(string) {

		// set reference to self closing tag
		var selfClosingTags = ['br', 'input', 'link', 'meta', '!doctype', 'basefont', 'base', 'area', 'source', 'hr', 'wbr', 'param', 'img', 'isindex', 'embed'],
			isSelfClosing = false;

		// test if current line contains a self closing tag
		for (var i = 0; i < selfClosingTags.length; i++) {

			var selfClosing = new RegExp('&lt;' + '\\b' + selfClosingTags[i] + '\\b');

			// if line contains self closing tag, break loop
			if (string.match(selfClosing)) {
				isSelfClosing = true;
				break;
			}
		}

		return isSelfClosing;
	}
	function isComment(string) {
		return string.substring(0, 7) === '&lt;!--';
	}

	// return final formatted html string
	return indentHtml(htmlString);
}
/*!
loadCSS: load a CSS file asynchronously.
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT
*/
function loadCSS(href, before, media, callback) {
	"use strict";
	// Arguments explained:
	// `href` is the URL for your CSS file.
	// `before` optionally defines the element we'll use as a reference for injecting our <link>
	// By default, `before` uses the first <script> element in the page.
	// However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
	// If so, pass a different reference element to the `before` argument and it'll insert before that instead
	// note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
	var ss = window.document.createElement("link");
	var ref = before || window.document.getElementsByTagName("script")[0];
	var sheets = window.document.styleSheets;
	ss.rel = "stylesheet";
	ss.href = href;
	// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
	ss.media = "only x";
	if (callback) {
		ss.onload = callback;
	}
	// inject link
	ref.parentNode.insertBefore(ss, ref);
	// This function sets the link's media back to `all` so that the stylesheet applies once it loads
	// It is designed to poll until document.styleSheets includes the new sheet.
	function toggleMedia() {
		var defined;
		for (var i = 0; i < sheets.length; i++) {
			if (sheets[i].href && sheets[i].href.indexOf(ss.href) > -1) {
				defined = true;
			}
		}
		if (defined) {
			ss.media = media || "all";
		}
		else {
			setTimeout(toggleMedia);
		}
	}
	toggleMedia();
	return ss;
}
/*!
loadJS: load a JS file asynchronously.
[c]2014 @scottjehl, Filament Group, Inc.
(Based on http://goo.gl/REQGQ by Paul Irish).
Licensed MIT
*/
function loadJS(src, cb) {
	"use strict";
	var ref = window.document.getElementsByTagName("script")[0];
	var script = window.document.createElement("script");
	script.src = src;
	script.async = true;
	ref.parentNode.insertBefore(script, ref);
	if (cb && typeof (cb) === "function") {
		script.onload = cb;
	}
	return script;
}


/*
 * pullout: Inline code examples
 * @thomasdigby
 * Licensed MIT
 */
function pullout (selector, params) {


	// set default config options
	var config = {
		options: {
			clickToHighlight: false,
			toggleCode: false,
			highlightSyntax: false,
			prismCss: '',
			prismJs: ''
		},
		toggle: {
			insertHtml: 'beforeend',
			idPrefix: 'toggle-',
			hook: 'data-pullout-toggle',
			selector: 'pullout-toggle',
			contentOpen: 'Show code',
			contentClose: 'Hide code'
		},
		output: {
			insertHtml: 'beforeend',
			idPrefix: 'output-',
			hook: 'data-pullout-output',
			selector: 'pullout-output'
		}
	},
	markupObject = {};


	// run pullout
	var initialise = function () {

		// get custom parameters & array of code objects
		getCustomParams();
		markupObject = document.querySelectorAll(selector);

		// run
		createElements();

		// load Prism dependendies
		if (config.options.highlightSyntax) {
			// add markup class for Prism
			document.body.classList.add('language-markup');
			loadCSS(config.options.prismCss);
			loadJS(config.options.prismJs, loadPrism());
		}
	};

	// create pullout elements and append pullout elements to page
	var createElements = function () {

		// for each pullout on page
		for (var i = 0; i < markupObject.length; i++) {

			// get markup and format to code block
			var inputCode = markupObject[i],
				formattedHtml = formatHtml(inputCode.innerHTML),
				elemCode = buildElemCode(i, formattedHtml),
				elemToggle = config.options.toggleCode ? buildElemToggle(i) : '';

			appendElements(inputCode, elemCode, elemToggle);

			// if toggle code, bind click event
			if (config.options.toggleCode) {
				bindToggleClick(i);
			}

			// if click to highlight code, bind click event
			if (config.options.clickToHighlight) {
				bindCodeClick(i);
			}
		}
	};
	var appendElements = function (inputCode, elemCode, elemToggle) {

		// convert elements to string
		var codeStr = elemCode.outerHTML,
			toggleStr = elemToggle.outerHTML;

		// if toggle code, insert toggle button
		if (config.options.toggleCode) {
			inputCode.insertAdjacentHTML(config.toggle.insertHtml, toggleStr);
		}
		// insert code snippet
		inputCode.insertAdjacentHTML(config.output.insertHtml, codeStr);
	};

	// build elements
	var buildElemCode = function (i, formattedHtml) {

		// build code element and write default style
		var codeElem = document.createElement('code'),
			codeStyle = [
				'overflow: auto;',
				'padding: 15px 18px;',
				'tab-size: 4;',
				'white-space: pre;'
			].join(''),
			jsHook = document.createAttribute(config.output.hook);

		// set code attributes
		codeElem.setAttributeNode(jsHook);
		codeElem.setAttribute('id', config.output.idPrefix + i);
		codeElem.setAttribute('style', codeStyle);
		codeElem.setAttribute('class', config.output.selector);

		// set aria attribute if visibility will be toggled
		if (config.options.toggleCode) {
			codeElem.setAttribute('aria-visible', false);
		}

		// insert formatted html
		codeElem.innerHTML = formattedHtml;

		return codeElem;
	};
	var buildElemToggle = function (i) {

		// build toggle element
		var toggleElem = document.createElement('button'),
			jsHook = document.createAttribute(config.toggle.hook);

		// set code attributes
		toggleElem.setAttributeNode(jsHook);
		toggleElem.setAttribute('id', config.toggle.idPrefix + i);
		toggleElem.setAttribute('class', config.toggle.selector);
		toggleElem.innerHTML = config.toggle.contentOpen;

		return toggleElem;
	};


	// bind events
	var bindToggleClick = function (i) {

		var button = document.getElementById(config.toggle.idPrefix + i);

		// on click of toggle
		button.addEventListener('click', function () {
			// toggle code visibility
			toggleVisibility(i, button);
		}, false);
	};
	var bindCodeClick = function (i) {

		var code = document.getElementById(config.output.idPrefix + i);

		code.addEventListener('click', function () {
			selectContent(code);
		}, false);
	};

	// events
	var toggleVisibility = function (i, button) {

		// get code block
		var codeElem = document.getElementById(config.output.idPrefix + i);

		// if code is not visible
		if (codeElem.getAttribute('aria-visible') === 'false') {

			// show code
			codeElem.setAttribute('aria-visible', true);
			button.innerHTML = config.toggle.contentClose;
		} else {

			// hide code
			codeElem.setAttribute('aria-visible', false);
			button.innerHTML = config.toggle.contentOpen;
		}
	};
	var selectContent = function (code) {

		// select thisOutput content
		var range = document.createRange(),
			selection = window.getSelection();

		range.selectNodeContents(code);
		selection.removeAllRanges();
		selection.addRange(range);
	};


	// helpers
	var getCustomParams = function () {
		// for each custom attribute, overwrite default
		for (var attr in params) {
			for (var nestAttr in params[attr]) {
				config[attr][nestAttr] = params[attr][nestAttr];
			}
		}
	};
	var loadPrism = function () {

		// detect that prism has loaded
		var prismLoad = setInterval(function () {
			if (!!window.Prism) {
				Prism.highlightAll();
				clearInterval(prismLoad);
			}
		}, 50);
	};

	// detect modern browsers and initialise
	if ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {
		initialise();
	}
}