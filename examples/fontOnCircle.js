function preload() {
    loadGoogleFont("Bricolage Grotesque", {
        wght: [200, 800],
        wdth: [75, 100],
    });
}

function setup() {
    createCanvas(800, 800);
    textAlign(CENTER, CENTER);
    pg = createGraphics(width, height);
    pg.background("blue");
    pg.textAlign(CENTER, CENTER);
    pg.fill("#fff");
}

function draw() {
    clear();
    background("#0060E5");
    push();
    const f = 6 * 60;
    const c = "a";
    const t = c + c + c + c + c + c + c + c + c + c + c + c + c;
    const p = (frameCount % f) / f;

    const txtSize = 200;
    const letters = t
        .split()
        .map((word) => word.split(""))
        .flat();
    pg.reset();
    pg.clear();
    pg.background("blue");
    let totalWidth = 0;
    const datas = letters.map((letter, id, arr) => {
        const progress = quadratic(
            sin(p * TWO_PI + (id / arr.length) * TWO_PI * 2) * 0.5 + 0.5
        );
        const wdth = map(progress, 0, 1, 75, 100);
        const wght = map(progress, 0, 1, 200, 800);

        pg.push();
        pg.textFont("Bricolage Grotesque", txtSize, {
            wdth: wdth,
            wght: wght,
        });
        const letterWidth = pg.textWidth(letter);
        totalWidth += letterWidth;
        pg.pop();
        return {
            character: letter,
            wdth: wdth,
            wght: wght,
            letterWidth: letterWidth,
        };
    });

    let arcLength = 0;
    const radius = (totalWidth / TWO_PI) * 1.1;
    datas.forEach((char, i, arr) => {
        const { character, letterWidth, wdth, wght } = char;
        const lettersRadius = radius;
        arcLength += letterWidth / 2;
        const angle = (arcLength / totalWidth) * TWO_PI;
        const x = pg.width / 2 + Math.cos(angle) * lettersRadius;
        const y = pg.height / 2 + Math.sin(angle) * lettersRadius;
        pg.push();
        pg.textFont("Bricolage Grotesque", txtSize, { wdth: wdth, wght: wght });
        // rotate(a)
        pg.translate(x, y);
        pg.rotate(angle + PI / 2);
        pg.text(character, 0, 0);
        pg.pop();
        arcLength += letterWidth / 2;
    });

    image(pg, 0, 0);
}

function quadratic(p) {
    var m = p - 1,
        t = p * 2;
    if (t < 1) return p * t;
    return 1 - m * m * 2;
}
