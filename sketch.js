p5.prototype.loadFont = function (path, onSuccess, onError) {
    p5._validateParameters("loadFont", arguments);
    const p5Font = new p5.Font(this);

    const self = this;
    opentype.load(path, (err, font) => {
        if (err) {
            p5._friendlyFileLoadError(4, path);
            if (typeof onError !== "undefined") {
                return onError(err);
            }
            console.error(err, path);
            return;
        }
        p5Font.font = font;
        if (typeof onSuccess !== "undefined") {
            onSuccess(p5Font);
        }
        self._decrementPreload();

        // check that we have an acceptable font type
        const validFontTypes = ["ttf", "otf", "woff", "woff2"];

        const fileNoPath = path.split("\\").pop().split("/").pop();

        const lastDotIdx = fileNoPath.lastIndexOf(".");
        let fontFamily;
        let newStyle;
        const fileExt =
            lastDotIdx < 1 ? null : fileNoPath.slice(lastDotIdx + 1);

        // if so, add it to the DOM (name-only) for use with DOM module
        if (validFontTypes.includes(fileExt)) {
            fontFamily = fileNoPath.slice(
                0,
                lastDotIdx !== -1 ? lastDotIdx : 0
            );
            newStyle = document.createElement("style");
            newStyle.appendChild(
                document.createTextNode(
                    `\n@font-face {\nfont-family: ${fontFamily};\nsrc: url(${path});\n}\n`
                )
            );
            document.head.appendChild(newStyle);
        }
    });

    return p5Font;
};

p5.prototype.textVariable = function (theFont, theSize, theVariables) {
    // p5._validateParameters('textFont', arguments);
    if (arguments.length) {
        if (!theFont) {
            throw new Error("null font passed to textFont");
        }
        this._renderer._applyTextProperties = function () {
            let font;
            const p = this._pInst;
            this._setProperty("_textAscent", null);
            this._setProperty("_textDescent", null);
            font = this._textFont;
            console.log(font);
            if (this._isOpenType()) {
                font = this._textFont.font.familyName;
                this._setProperty("_textStyle", this._textFont.font.styleName);
            }
            // console.log(this)
            this.drawingContext.font = `${this._textWeight || "normal"} ${
                this._textStyle || "normal"
            } ${this._textSize || 12}px ${font || "sans-serif"}`;
            this.drawingContext.textAlign = this._textAlign;
            if (this._textBaseline === CENTER) {
                this.drawingContext.textBaseline = _CTX_MIDDLE;
            } else {
                this.drawingContext.textBaseline = this._textBaseline;
            }
            // return p;
        };

        const { wdth, wght } = theVariables;
        this.canvas.style.fontVariationSettings =
            "'wght' " + wght + ", 'wdth' " + wdth;

        this._renderer._setProperty("_textFont", theFont);
        this._renderer._setProperty("_textWeight", wdth);
        if (theSize) {
            this._renderer._setProperty("_textSize", theSize);
            if (!this._renderer._leadingSet) {
                // only use a default value if not previously set (#5181)
                this._renderer._setProperty(
                    "_textLeading",
                    theSize * _DEFAULT_LEADMULT
                );
            }
        }

        return this._renderer._applyTextProperties();
    }

    return this._renderer._textFont;
};



function preload() {
    ft = loadFont("./src/Obviously-Variable.ttf", (ft) => {
        console.log(ft);
        const axes = ft.font.tables.fvar.axes.map((axe) => {
            return {
                name: axe.tag,
                value: axe.defaultValue,
                min: axe.minValue,
                max: axe.maxValue,
            };
        });
        console.log(axes);
    });
}

function setup() {
    canvas = createCanvas(1200, 500);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    // pg = createGraphics(width, height);
    // pg.background("blue");
    // pg.textAlign(CENTER, CENTER);
    
}

function draw() {
    background(220);
    push();

    const t = "Show me some weights!";
    const p = (frameCount % 120) / 120;
    const ctx = drawingContext;

    push();

    //   const axes = ft.font.tables.fvar.axes.map(axe => {
    //         return {name : axe.tag, value : axe.defaultValue, min : axe.minValue, max : axe.maxValue}

    //   });
    //   console.log(axes)
    // noLoop()
    const wdth = Math.round(
        100 + quadratic(sin(p * TWO_PI + PI / 4) * 0.5 + 0.5) * 700
    );
    const wght = Math.round(
        150 + quadratic(sin(p * TWO_PI + PI / 4) * 0.5 + 0.5) * 650
    );
    textGoogleFont(ft, 60, 600);
    noStroke();
    fill("red");
    text(t, width / 2, height / 2);
    pop();

    //   push();
    //   const w1 = Math.round(200 + quadratic(sin(p * TWO_PI + PI / 4) * 0.5 + 0.5) * 600);
    //   const w2 = Math.round(75 + quadratic(sin(p * TWO_PI + PI / 4) * 0.5 + 0.5) * 25);
    //   textGoogleFont("Bricolage Grotesque", 60, 200, { wdth: w2, wght: w1 });
    //   noStroke();
    //   fill("red");
    //   // ctx.wordSpacing = `${25 * quadratic(sin(p * 2 * TWO_PI + PI / 4) * 0.5 + 0.5)}px`
    //   text(t, width / 2, height / 2 - 60);
    //   pop();

    //   push();
    //   const w3 = Math.round(200 + quadratic(sin(p * TWO_PI) * 0.5 + 0.5) * 600);
    //   const w4 = Math.round(75 + quadratic(sin(p * TWO_PI) * 0.5 + 0.5) * 25);
    //   textGoogleFont("Bricolage Grotesque", 60, 200, { wdth: w4, wght: w3 });
    //   stroke('green')
    //   noFill()
    //   text(t, width / 2, height / 2);
    //   pop();

    //   push();
    //   const w5 = Math.round(200 + quadratic(sin(p * TWO_PI - PI / 4) * 0.5 + 0.5) * 600);
    //   const w6 = Math.round(75 + quadratic(sin(p * TWO_PI - PI / 4) * 0.5 + 0.5) * 25);
    //   textGoogleFont("Bricolage Grotesque", 60, 200, { wdth: w6, wght: w5 });
    //   noFill();
    //   stroke("blue");
    //   const wd = textWidth(t);
    //   text(t, width / 2, height / 2 + 60);
    //   rect(width/2,height/2+60,wd, 60)
    //   pop();

    pop();
    // image(pg,0,0)
    // noLoop();
    push();
    noStroke();
    fill(0);
    text(nfc(frameRate(), 1), 15, 10);
    pop();
}

function quadratic(p) {
    var m = p - 1,
        t = p * 2;
    if (t < 1) return p * t;
    return 1 - m * m * 2;
}
