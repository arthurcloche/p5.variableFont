# p5.variableFont
Attempting to bring variable fonts to p5.js

## Variable fonts in WebCanvas
I promise to elaborate more on this section because it holds a ton of potential. I'm still figuring things out.
I've tried MANY time to bring variable fonts to webCanvas, all attempt where disapointing so i thought it was just not compatible. But recently i had the need to research a little bit how google fonts are uploaded to be used in the browser and following the bread crumbs, i found the gingerbread house at the end and i THINK i figured it out. 

Here's the three main thing i recently realized that helped me putting it all that together, which are kinda obvious when you think about it.
### Every font on the web is either displayed using CSS or rasterized bezier curves
After reading and dwelling into the documentation, i realized that there are two main option to draw fonts on a webCanvas.
The first is by using opentype.js to load the font data and draw each characters using bezier curves as shapes. This is the way p5.js try to work when you upload a font using 'loadFont(url)'

The second is by using the native WebCanvas API using 'textFill()'

### Web Canvas use a CSS-like approach to 'style' the text before displaying it
canvas.font = 'weight style font size'

### We can use CSS to dynamically change the style of a character by directly setting the style to the canvas element, including the p5 canvas ( which still a canvas element)
this.canvas.style.fontVariationSettings = '...axis,...values'

## Limitations
Major issue i haven't figured out yet 
### no variable setting in opentype.js
There seems to be no way to request a specific character with specific variable axis values from opnetype.js
This gets in the way of expading this solution to text operations like font.textToPoints() and displaying a font in WEBGL because both require the font to be parsed by opentype.js. It will load the font at the minimal axis values and prevent any animation.

If you really need it to be drawn using points, one solution i saw being applied is to upload both opentype fonts to their minimal-maximal axis values, you might need Glyphs or a similar app to achieve that from a single font file but otherwise many font providers allow you to get individual styles. Once you got the points for the minimal value and the maximal values using either textToPoints or a custom approach using opentype.js, you can interpolate to any font weight by puting a point at a certain percentage between the min/max since the variable characters need to have the same amount of points for them to work correctly.


## Context
### Webcanvas
There a some specific steps needed to be taken for the webcanvas.
I will put the list here
### p5.js   
There a some specific steps needed to be taken for p5.js.
I will put the list here
# Give me the code already !
## For Google Fonts 

Google Fonts allow to load fonts with variable axis using the [..] operator in the url query.
As explained here : https://www.launch2success.com/guide/getting-google-font-variable-files/

### Weight axis

If you only wish to animate the weight of your google font. You can use the 'textGoogleFont()'

## For Loaded Fonnt 

Google Fonts allow to load fonts with variable axis using the [..] operator in the url query.
As explained here : https://www.launch2success.com/guide/getting-google-font-variable-files/

### Weight axis

If you only wish to animate the weight of your google font. You can use the 'textGoogleFont()'


## Under the hood
I want to try to explain a little bit how things are happening from what i understood so maybe some other might jump in and participate in the effort to get a more diverse type support on p5.js and webcanvas. 