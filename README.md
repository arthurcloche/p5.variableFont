# p5.variableFont
![example](https://github.com/amehowc/p5.variableFont/assets/38710749/5790ecdc-2786-46db-bc0e-3d89805fec81)  
Font credits: Oh No - Obviously

## Bringing variable fonts to p5.js 🎉

I've modified several p5.js functions to support variable fonts and Google fonts (and by extension, Google variable fonts!). Everything works, but there are some 'duct tape' fixes in the code to maintain the original p5 workflow. I'll integrate these better if there's enough interest. For now, please read the documentation :)

This is built around p5.js `v1.7.0` but should work with previous versions. It can be used on either the main `canvas` or a `p5.Graphics`. There's a known bug related to animating some axes within a `p5.Graphics`. All the standard methods like `fill()`, `stroke()`, `textWidth()`, `textLeading()`, and so on are supported. It even works with native `drawingContext` functions like `ctx.wordSpacing`.

Although this build depends on p5.js, you can adapt it for a vanilla webCanvas!

I'd love to see anything cool you create with it. Let me know if you encounter any issues. Have fun!

## Important !

There are two primary methods for loading and using fonts in p5.js. One involves using `loadFont()`, and the other is by defining a font either through CSS with a `@font-face` tag or importing it via an API like the Google Fonts API. Both methods have the same end result when using `text()` in the 2D context. However, differences emerge when you delve into font data functions like `font.textToPoints()` or `font.getBounds()`, or when using the WEBGL context.

For variable fonts in p5.js, you'll need to use the CSS method. Instead of `textFont(loadedFont)`, you'd call `textFont('YourFontName')` where the name is either the `font-family` from the [CSS specification](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), the name of the Google Font (e.g., `Playfair Display`), or I've added a new argument to p5's `loadFont()` to define a CSS name as a fourth argument for user-loaded fonts.

## Also Important!

p5.js cannot render a font variation that's unavailable, out of range, misnamed, or in the case of an API-requested font, unloaded. Ensure you load the correct variable font, with matching axis names, and values within the proper range. Most of the time, retailers provide these names and min-max values. However, you can also use tools like the [Dinamo Font Gauntlet](https://fontgauntlet.com/) or the built-in `font.getVariations()` for loaded p5.Fonts.

## Kinda Important too!

### Limitations & Bugs

#### 🐛 Bug: Animating a Single Axis on a Multi-Axis Font in `p5.Graphics`
Trying to animate a single axis in a `p5.Graphics` without adjusting the `wght` or `textWeight()` might result in no animation. I'm working on this issue.

#### Workaround
Ensure you animate the `wght` axis if it exists. You can create a minimal variation, for instance, oscillating between 400 and 401.

#### 🚫 Limitation: No Variable Setting in `opentype.js`
There's currently no way to request a specific character with unique variable axis values from `opentype.js`. This limitation impacts functions like `font.textToPoints()` and displaying a font in WEBGL since both require `opentype.js` for parsing. As a result, the font loads with minimal axis values, preventing any animation.

#### Workaround
If you need your text drawn using points, one solution involves uploading both opentype fonts with their minimal-maximal axis values. You might need apps like Glyphs or similar for this. Once you've obtained the points for minimal and maximal values, you can interpolate any font weight by positioning a point between the min/max values.

You can also extract a 'single weight' using the [Dinamo font gauntlet](https://fontgauntlet.com/).

#### 🚫 Limitation: No Support for WebGL Context (Yet)
p5.js uses `opentype.js` to parse font files for rendering in 3D space. Refer to the [following paper](https://jcgt.org/published/0006/02/02/paper.pdf) and the [p5.js source code](https://github.com/processing/p5.js/blob/main/src/webgl/text.js) for details.

#### Workaround
A common solution is to render text on an image using p5.js's `createGraphics()` or a WebGL texture (more details [here](https://webglfundamentals.org/webgl/lessons/webgl-text-texture.html)). One tip is to use the 2D canvas font metrics to obtain the optimal texture size for containing text. More information on this technique can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text).

---

#### 🔎 Nice to have: accessing and caching an API requested font file, axis and measurement

Getting access to the file that is requested i.e. from 'font.gstatic.com' by the 'fonts.googleapis.com' to pass it through `opentype.js` could help to harmonize the process and make it more coherent with the pipeline already being used by p5.js.

#### Workaround
Still looking 👀

## Methods

### textFont()

You can define the size using a second parameter

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


