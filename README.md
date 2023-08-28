# p5.variableFont

<video autoplay loop mute src="src/example.mp4"></video>

## Bringing variable fonts to p5.js 🎉

I changed a couple p5.js function to support variable fonts and Google fonts ( and by extension, Google variable fonts !).
Everything works but there a some 'ducktape-y' fixs in the code to maintain the original p5 workflow, i'll figure out how to integrate it better if there is enough interest around this but for now, make sure to read the documentation :)

Built around p5.js `v1.7.0` but should work with previous version. It's running in both the main `canvas` and a `p5.Graphics`. If you encounter some issues animating some axis within a `p5.Graphics`, there is a known bug, see below. You can still use `fill()`,`stroke()`,`textWidth()`,`textLeading()` and so on. It even works with the native `drawingContext` functions like `ctx.wordSpacing`.

This build rely on p5.js but you can certainly adapt it for a vanilla webCanvas !

Keep me posted if you create anything cool with it or if there are any issues !
Have fun !

## Important !

There a two(-ish) ways to load and use a font in p5.js, one is by loading a font with `loadFont()` and the other is to define a font in either CSS using a `@font-face` tag or by importing it through an API, i.e. the Google Fonts API. ( A third would be to use SVG, i found some clues but didn't really explored it yet. ). They both boil down the same thing when using `text()` in the 2D context but there are some difference when it comes to using the font data like `font.textToPoints()` or `font.getBounds()`or using the WEBGL context.

In order to use variable fonts in p5.js, you will have to use the CSS way. This is not really different, instead of `textFont(loadedFont)`, you will need to call a string like `textFont('YourFontName')`with either the name of the `font-family` (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), the name of the Google Font (reminder : white-space is important so make sure to use i.e `Playfair Display`) or i added a new argument to the p5 `loadFont()` to define a CSS name as a fourth arguments to make it available for user loaded font (if you wonder why you need to use CSS in the canvas, more on this below).

## Also important !

p5.js cannot render a font with a given variation if that variation doesn't exist, is out of range, the name isn't matching or, in the case of an API requested font, that those variations are not loaded (see below for that). So make sure to load a variable font, that the axis names are matching and that the values are within the range. Most of the time, those names and min-max values are provided on the retailers websites but you can use the Dinamo Font Gauntlet (https://fontgauntlet.com/) or use the provided `font.getVariations()` in the case of a loaded p5.Font.

## Kinda important too !

### Limitations & bugs

#### 🐛 Bug : Animating a single axis on a multi-axis font in a p5.Graphics()

It might happen that when trying to animate one axis in a p5.Graphics without changing the `wght` or `textWeight()`, the font will not be animated at all. I'm looking into it 👀

#### Workaround

For now, just make sure you animate the `wght` axis if one is present. You can make a super subtle variation i.e. slowly going back and forth between 400 and 401, i dont really knwo why but the value need to be updated over time for all the others to animate.

#### 🚫 Limitation: No variable setting in opentype.js

There seems to be no way to request a specific character with specific variable axis values from opnetype.js
This gets in the way of expading this solution to text operations like `font.textToPoints()` and displaying a font in WEBGL because both require the font to be parsed by opentype.js. It will load the font at the minimal axis values and prevent any animation.

#### Workaround

If your text really need to be drawn using points, one solution i saw being applied is to upload both opentype fonts to their minimal-maximal axis values, you might need Glyphs or a similar app to achieve that from a single font file but otherwise many font providers allow you to get individual styles. Once you got the points for the minimal value and the maximal values using either textToPoints or a custom approach using opentype.js, you can interpolate to any font weight by puting a point at a certain percentage between the min/max since the variable characters need to have the same amount of points for them to work correctly.

You can extract a 'single weight' using Dinamo font gauntlet : https://fontgauntlet.com/

#### 🚫 Limitation: No support for WebGL context (yet)

Subsequent to the previous issue, p5.js use opentype.js to extract the datas from a font file in order to render fonts in the 3D space.
See : https://jcgt.org/published/0006/02/02/paper.pdf
And : https://github.com/processing/p5.js/blob/main/src/webgl/text.js

#### Workaround

The usual solution to that is to render the text on an image using p5.js `createGraphics()` or a webgl texture : https://webglfundamentals.org/webgl/lessons/webgl-text-texture.html and using as either a `texture()` or a `texture2D()` in a shader. A good idea is to leverage the 2D canvas font metrics evaluation to get the optimal size for a texture to contain some text at a given size using `drawingContext.measureText(text)`. More on this : https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText

#### 🔎 Nice to have : accessing and caching an API requested font file, axis and measurement

Getting access to the file that is requested i.e. from 'font.gstatic.com' by the 'fonts.googleapis.com' to pass it through `opentype.js` could help to harmonize the process and make it more coherent with the pipeline already being used by p5.js

#### Workaround
Still looking 👀

## Methods

### textFont()

In case you didn't knew, you can define the size using a second parameter

```js
 function textFont(font:string, textsize:number)
```

The main and most common axis is the `wght`, so with a single number, you will adjust your font weight.

```js
 function textFont(font:string, textsize:number, variation:number)
```

Using an object as the third argument tell p5.js to display a font with the given variations (can be animated !)

```js
 function textFont(font:string, textsize:number, variation:{key: value:number, ...}})
```

---

### textWeight()

Same idea as above but only for the text weight (make sure that the weights exists and/or are loaded)

```js
 function textWeight(weight:number)
```

---

### textVariations()

Same idea as above but only for the text weight (make sure that the weight exists and/or are loaded)

```js
 function textVariations(weight:number)
```

Same idea as above but for the text variations (make sure that the weights exists and/or are loaded)

```js
 function textVariations(variation:{key: value:number, ...})
```

---

### textStretch()

```js
 function textStretch(stretch:number)
```
Currently looking into that 👀

---
### loadFont()

```js
 function loadFont(font:URL, onSuccess:function, onError:function, CSSname:string)
```

#### Important

This function needs opentype.js to be loaded externally, p5 relies on it to get the font object needed to load a p5Font. Since i'm exposing `opentype`, please add this to your `<head>` :
`<script src='https://unpkg.com/opentype.js@1.3.4/dist/opentype.js'></script>`

The function is basically the same but take a fourth argument to define the font name in CSS so you can use it `textFont('CSSname')`
I didn't figured out a way to add this without changing the p5.js default behaviors, it's a bit verbose due to the callbacks, but can you use it like this :

```js
function preload() {
    font = loadFont(
        "yourfont.ttf",
        () => {},
        () => {},
        "yourfontname"
    );
}
```

### font.getVariations()
Return the variables axis with their respective min/max and default value.
Setting the 'log' to `true` will display the result in the console, usefull if needed only for reference.

```js
let axis = font.getVariations(((log: boolean) = false));
return { key: axis, values: { default: number, min: number, max: number } };
```



### font.getStyles()
Return the style and the corresponding values on the variables axis.
Setting the 'log' to `true` will display the result in the console.

```js
let styles = font.getStyles(log:boolean=false)
return {key:style,values:{ { key: axis, value:number},...}
```



The output is fitted to be used in the `textFont()`

```js
let styles = font.getStyles();
textFont("your-font", size, styles[BOLD]);
```

Those two function can be used either in the `loadFont()` :

```js
let font;
function preload() {
    font = loadFont(
        "yourfont.ttf",
        (font) => {
            axis = font.getVariations(true);
            styles = font.getStyles(true);
        },
        () => {},
        "yourfontname"
    );
}
```

or in anywhere else using the font object :

```js
let font;
function preload() {
    font = loadFont(
        "yourfont.ttf",
        () => {},
        () => {},
        "yourfontname"
    );
}
function setup() {
    axis = font.getVariations();
    stles = font.getStyles();
}
```

---

### loadGoogleFont()

Small helper function to load a Google Font. It will build a `<link>` element and inject it in the `<head>`.
Make sure to check the exact values and font names on: https://fonts.google.com/.
This function take a `name` as an input and will build an URL according to the Google Fonts API URLs structure.

#### Important : Preloading a Google Font

If you need or want to preload a Google Font (which i strongly suggest) with all its variable axis, you will need to adjust your URL.
Here's a guide on how to do it : https://www.launch2success.com/guide/getting-google-font-variable-files/

In short, you will need to tell Google Font to load all the variations within a certain range. Again, make sure to check the min/max values and names. Unless you're on a super tight ressources management or you know exactly which weights/variations you need, get the widest range of values available. As mentioned before, if you try to display a variation at a value not loaded as Google Font, it will display a default font.

It should look like something like this :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wdth,wght@75..100,200..800&display=swap"
    rel="stylesheet"
/>
```

If you uploaded a Google Font using the preloading method, you won't need to use the following functions. Those works in real-time so you can use these to dynamically add a Google Font to your code.

Load a Google Font to be used with `textFont('name')`.

```js
 function loadGoogleFont(name:string)
```

Load a Google Font at a given weight.

```js
 function loadGoogleFont(name:string, variation:number)
```

Load a Google Font and its weights between the min-max

```js
 function loadGoogleFont(name:string, variation:[min:number,max:number]])
```

Load a Google Font with a given variation axis at a given value

```js
 function loadGoogleFont(name:string, variation:{key: value:number, ...})
```

Load a Google Font and its variations ranging within a min-max

```js
 function loadGoogleFont(name:string, variation:{key: value:[min:number,max:number], ...})
```

# Under the hood

I will try to explain a little bit how things are happening from what i understood so maybe some others interested people might jump in and participate in the effort to get a more diverse type support on p5.js and webcanvas.

## Variable fonts in WebCanvas

### How p5.js handle fonts

#### Native canvas

#### opentype.js

### Every font on the web is either displayed using CSS or rasterized bezier curves

## Webcanvas use a CSS-like approach to 'style' the text before displaying it

### We can use CSS to dynamically change the style of a character by directly setting the style to the canvas element

### Exploring the relationship between CSS and WebCanvas


