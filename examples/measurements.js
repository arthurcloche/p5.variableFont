function preload() {
	loadGoogleFont("Bricolage Grotesque", {
		wght: [200, 800],
		wdth: [75, 100],
	});
}

function setup() {
	canvas = createCanvas(1080, 1080);
	// frameRate(8)
	textAlign(CENTER, CENTER);
	rectMode(CENTER);
}

function draw() {
	background(0);

	const n = 75 + quadratic(sin(frameCount * 0.03) * 0.5 + 0.5) * 25;
	const m = 200 + quadratic(sin(frameCount * 0.03) * 0.5 + 0.5) * 600;
	const s = 180 - quadratic(sin(frameCount * 0.03) * 0.5 + 0.5) * 125;

    


	push();
	push();
	textFont("Bricolage Grotesque", s, { wdth: n, wght: m });
	let txt = "MEASUREMENTS";
	let f = measureText(txt);
	fill("ivory");
	text(txt, width / 2, height / 2);
	pop();
	push();
	noFill();
	stroke("blue");
	rect(width / 2, height / 2 + f.offset, f.width, f.height);
	push();
	textFont("Courier");
	fill("blue");
	line(width / 2 - f.width / 2, 0, width / 2 - f.width / 2, height);
	line(width / 2 + f.width / 2, 0, width / 2 + f.width / 2, height);
	line(
		0,
		height / 2 - f.height / 2 + f.offset,
		width,
		height / 2 - f.height / 2 + f.offset
	);
	line(
		0,
		height / 2 + f.height / 2 + f.offset,
		width,
		height / 2 + f.height / 2 + f.offset
	);
	push();
	translate(width / 2 + f.width / 2 - 60, height / 2 - (f.height / 2) * 1.4);
	noStroke();
	rect(0, 0, 120, 20);
	fill("white");
	text("tight bounds", 0, 0);
	pop();
	push();
	translate(width / 2 - f.width / 2 + 60, height / 2 + (f.height / 2) * 1.05);
	noStroke();
	rect(0, 0, 120, 20);
	fill("white");
	text(`${f.width.toFixed(0)} x ${f.height.toFixed(0)}`, 0, 0);
	pop();
	pop();
	pop();

    
}

function quadratic(p) {
	var m = p - 1,
		t = p * 2;
	if (t < 1) return p * t;
	return 1 - m * m * 2;
}
