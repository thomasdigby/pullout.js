# pullout.js

Inline code examples.

## Usage

```html
<div data-pullout-input>
	<div class="module-promo">
		<img src="http://placehold.it/400x300" alt="Placeholder" />
		<h2>Default Module Title</h2><a href="/">Module link</a>
	</div>
</div>
```
```javascript
var pulloutOptions = {
	options: {
		clickToHighlight: false,
		highlightSyntax: false,
		prismCss: '',
		prismJs: '',
		toggleCode: false
	},
	toggle: {
		contentClose: 'Hide code',
		contentOpen: 'Show code',
		idPrefix: 'toggle-',
		insertHtml: 'beforeend',
		selector: 'pullout-toggle'
	},
	output: {
		idPrefix: 'output-',
		insertHtml: 'beforeend',
		selector: 'pullout-output'
	}
};

pullout('[data-pullout-input]', pulloutOptions);
```

## Options
### options
#### clickToHighlight
Type: `bool`
Default: `false`
Binds a click event to the code block that highlights the contained code
#### toggleCode
Type: `bool`
Default: `false`
Creates a button that can toggle the visibility of the code block, specific options can be set within `toggle`
#### highlightSyntax
Type: `bool`
Default: `false`
Fetchs Prism CSS/JS and applies it to the code block, requires a path to both `prismCSS` and `prismJS`
#### prismCSS
Type: `string`
Default: `''`
Path to local or remote Prism CSS file
#### prismJS
Type: `string`
Default: `''`
Path to local or remote Prism JS file

### toggle/output
#### insertHtml
Type: `string`
Default: `'beforeend'`
Position of toggle and output relative to selector, position value required for insertAdjacentHTML(position, text). Must be one of the following strings: `beforebegin`, `afterbegin`, `beforeend`, `afterend`. More detail can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
#### idPrefix
Type: `string`
Default: `'toggle-'` / `'output-'`
Prefix value for the `id`
#### hook
Type: `string`
Default: `'data-pullout-toggle'` / `'data-pullout-output'`
JS hook for toggle/output
#### contentClose
Type: `string`
Default: `'Hide code'`
Text displayed in toggle when code is visible
#### contentOpen
Type: `string`
Default: `'Show code'`
Text displayed in toggle when code is hidden


___
## Releases
* `v1.0.1` Updated readme and included updated formatHtml()
* `v1.0.0` Initial release
