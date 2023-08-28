function preload() {

    // both will do the same thing

    // loadFont(
    //     "../src/BricolageGrotesque-VariableFont.ttf",
    //     (font) => {
    //        const axis = font.getVariations(true);
    //        const styles = font.getStyles(true);
    //     },
    //     () => {},
    //     "Bricolage Grotesque"
    // );


    loadGoogleFont("Bricolage Grotesque", {
        wght: [200, 800],
        wdth: [75, 100],
    });
}

function setup() {
    canvas = createCanvas(1200, 500);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
}

function draw() {
    background(220);

    background(220);

    const n = 75 + (sin(frameCount * 0.05) * 0.5 + 0.5) * 25;
    const m = 200 + (cos(frameCount * 0.05) * 0.5 + 0.5) * 600;
    push();
    textFont("Bricolage Grotesque", 60, { wdth: n, wght: m });
    text("HEY THERE!", width / 2, height / 2);
    pop();
}

function quadratic(p) {
    var m = p - 1,
        t = p * 2;
    if (t < 1) return p * t;
    return 1 - m * m * 2;
}
