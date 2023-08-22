/*
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    get all the font weights. the .. is a [...attribute]
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&display=swap" rel="stylesheet">
    
    You can define a the min,max that you prefer by tweaking the above link

    textGoogleFont('font name',size,weight)
*/

p5.prototype.textGoogleFont = function (theFont, theSize, theWeight) {
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
            this.drawingContext.font = `${this._textWeight || "normal"} ${
                this._textStyle || "normal"
            } ${this._textSize || 12}px ${font || "sans-serif"}`;
            this.drawingContext.textAlign = this._textAlign;
            if (this._textBaseline === CENTER) {
                this.drawingContext.textBaseline = _CTX_MIDDLE;
            } else {
                this.drawingContext.textBaseline = this._textBaseline;
            }
        };
        this._renderer._setProperty("_textFont", theFont);
        this._renderer._setProperty("_textWeight", theWeight);
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
