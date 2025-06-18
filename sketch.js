let video;
/** @type {ml5.HandPose} */
let handPose;

/** @type {ml5.Hand[]} */
let hands = [];

let osc;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose({
    flipped: true,
    maxHands: 2,
  });
}

function setup() {
  const scale = 2;
  createCanvas(640 * scale, 480 * scale);

  osc = new p5.Oscillator("sine");
  osc.freq(300);
  osc.amp(0.5);
  osc.start();
  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  // start detecting hands from the webcam video
  handPose.detectStart(video, function (results) {
    hands = results;
  });
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  const rightHand = hands.find((hand) => hand.handedness === "Right");
  const leftHand = hands.find((hand) => hand.handedness === "Left");
  const handsAreDetected = rightHand && leftHand;

  if (!handsAreDetected) return;
  // if (!handsAreDetected) {
  //   if (osc.started) osc.stop();
  //   return;
  // } else {
  //   if (!osc.started) {
  //     osc.freq(300);
  //     osc.amp(0.5);
  //     osc.start();
  //   }
  // }

  //rightHand
  const Indicedx = rightHand.index_finger_tip;
  const Pollicedx = rightHand.thumb_tip;

  fill("white");
  ellipse(Indicedx.x, Indicedx.y, 10);
  fill("white");
  ellipse(Pollicedx.x, Pollicedx.y, 10);

  stroke("white");
  line(Indicedx.x, Indicedx.y, Pollicedx.x, Pollicedx.y);

  let angolo = calcolaAngoloGradi360(Indicedx, Pollicedx);

  //leftHand
  const Indicesx = leftHand.index_finger_tip;
  const Pollicesx = leftHand.thumb_tip;

  fill("white");
  ellipse(Indicesx.x, Indicesx.y, 10);
  fill("white");
  ellipse(Pollicesx.x, Pollicesx.y, 10);

  stroke("white");
  line(Indicesx.x, Indicesx.y, Pollicesx.x, Pollicesx.y);

  let distanza = calcolaDistanza(Indicesx, Pollicesx);

  ellipse(width / 2, height / 2, angolo);

  //OSC transformazione
  const newFrequency = map(distanza, Indicesx.x, Pollicesx.x, 100, 400);
  const newAmp = map(angolo, 0, 360, 0.5, 1);
  osc.freq(newFrequency);
  osc.amp(newAmp);
  osc.start();
}

/**
 * Calcola l'angolo (in gradi) tra due punti rispetto all'asse X,
 * restituendo un valore compreso tra 0° e 360°.
 * @param {{x: number, y: number}} p1 - Il primo punto (origine del segmento).
 * @param {{x: number, y: number}} p2 - Il secondo punto (termine del segmento).
 * @returns {number} L'angolo in gradi compreso tra 0° e 360°.
 */
function calcolaAngoloGradi360(p1, p2) {
  const rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  let deg = rad * (180 / Math.PI);
  if (deg < 0) deg += 360;
  return deg;
}
/**
 * Calcola la distanza euclidea tra due punti.
 * @param {{x: number, y: number}} p1 - Il primo punto.
 * @param {{x: number, y: number}} p2 - Il secondo punto.
 * @returns {number} La distanza tra i due punti.
 */
function calcolaDistanza(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
