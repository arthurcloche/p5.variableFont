p5.Font.prototype.getVariations = function (logTables = false) {
    const axes = this.font.tables.fvar.axes;
    if (axes !== undefined || axes.length === 0) {
        let data = {};
        for (let axe of axes) {
            data[axe.tag] = {
                default: axe.defaultValue,
                min: axe.minValue,
                max: axe.maxValue,
            };
        }
        if (logTables) {
            console.log(data);
        }
        return data;
    } else {
        console.log(
            "No valid font tables found, make sure to load a variable font"
        );
    }
};

p5.Font.prototype.getStyles = function (logTables = false) {
    const styles = this.font.tables.fvar.instances;
    if (styles !== undefined && styles.length !== 0) {
        let data = {};
        for (let style of styles) {
            const { name, coordinates } = style;
            data[name.en] = coordinates;
        }
        if (logTables) {
            console.log(data);
        }
        return data;
    } else {
        console.log(
            "No valid font tables found, make sure to load a variable font"
        );
    }
};

p5.prototype.textWeight = function (theWeight) {
    return this._renderer._setProperty("_textWeight", theWeight);
};

p5.prototype.textVariations = function (theVariations) {
    if (theVariations) {
        if (typeof theVariations === "number") {
            this._renderer._setProperty("_textWeight", theVariations);
        } else {
            let fontVariationsSettings = "";
            for (const variation in theVariations) {
                const name = variation;
                const value = theVariations[name];
                fontVariationsSettings += `'${variation}'${value},`;
            }
            let formatedfontVariationsSettings = fontVariationsSettings.slice(
                0,
                -1
            );
            this._renderer._setProperty(
                "_fontVariations",
                formatedfontVariationsSettings
            );
        }
    }
};

p5.prototype.loadFont = function (path, onSuccess, onError, CSSname = "") {
    //p5._validateParameters('loadFont', arguments);
    const p5Font = new p5.Font(this);
    let fontName;

    const self = this;
    /* to be used in the p5 editors or modules to ensure to import opentype.js if not there already*/
    if (typeof opentype === "undefined") {
        console.log(
            "It does seems that you are trying to load a font without opentype.js, add : '<script src='https://unpkg.com/opentype.js@1.3.4/dist/opentype.js'></script>' to you html <head>"
        );
        return;
    }
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
            fontFamily = CSSname
                ? CSSname
                : fileNoPath.slice(0, lastDotIdx !== -1 ? lastDotIdx : 0);
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

p5.prototype.textFont = function (theFont, theSize, theVariations) {
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
            if (this._isOpenType()) {
                font = this._textFont.font.familyName;
                this._setProperty("_textStyle", this._textFont.font.styleName);
            }
            this.canvas.style.fontVariationSettings = this._fontVariations;
            this.drawingContext.font = `${this._textWeight || "normal"} ${
                this._textStyle || "normal"
            } ${this._textSize || 12}px ${font || "sans-serif"}`;

            this.drawingContext.textAlign = this._textAlign;
            if (this._textBaseline === CENTER) {
                this.drawingContext.textBaseline = _CTX_MIDDLE;
            } else {
                this.drawingContext.textBaseline = this._textBaseline;
            }
            return p;
        };

        if (theVariations) {
            if (typeof theVariations === "number") {
                this._renderer._setProperty("_textWeight", theVariations);
            } else {
                let fontVariationsSettings = "";
                for (const variation in theVariations) {
                    const name = variation;
                    const value = theVariations[name];
                    fontVariationsSettings += `'${variation}'${value},`;
                    if (name === "wght") {
                        this._renderer._setProperty("_textWeight", value);
                    }
                }
                let formatedfontVariationsSettings =
                    fontVariationsSettings.slice(0, -1);
                this._renderer._setProperty(
                    "_fontVariations",
                    formatedfontVariationsSettings
                );
            }
        }

        this._renderer._setProperty("_textFont", theFont);
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

p5.prototype.loadGoogleFont = function (name, theVariations) {
    const collapsedName = name.split(" ").join("+");
    let variations = "";
    if (theVariations) {
        // if a single number is passed, we can assume that we want to load the weight
        if (typeof theVariations === "number") {
            variations = `:wght@${theVariations}`;
        }
        // if an array is passed, we want to load all the weights between the two values
        else if (Array.isArray(theVariations)) {
            variations += `:wght@${theVariations[0]}..${theVariations[1]}`;
        } else {
            const sortedVariations = Object.keys(theVariations)
                .sort()
                .reduce((result, key) => {
                    result[key] = theVariations[key];
                    return result;
                }, {});

            // if an obect is passed, we want to load all the axis
            let axis = ":";
            let values = "";
            for (const variation in sortedVariations) {
                axis += variation + ",";
                if (Array.isArray(sortedVariations[variation])) {
                    values += `${sortedVariations[variation][0]}..${sortedVariations[variation][1]},`;
                } else {
                    values += sortedVariations[variation] + ",";
                }
            }
            axis = axis.slice(0, -1);
            values = values.slice(0, -1);
            variations += axis.concat("@", values);
        }
    }
    const link = document.createElement("link");
    link.id = "font";
    link.href = `https://fonts.googleapis.com/css2?family=${collapsedName}${variations}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
};
