/** @typedef {import("./p5/types/index").Oscillator} Oscillator */
/** @typedef {import("./p5/types/index").SoundRecorder} SoundRecorder */
/** @typedef {import("./p5/types/index").SoundFile} SoundFile */
/** @typedef {import("./p5/types/index").Delay} Delay */
/** @typedef {{x: number, y: number}} Punto */

let video;
/** @type {ml5.HandPose} */
let handPose;

/** @type {ml5.Hand[]} */
let hands = [];

/** @type {Oscillator} */
let osc;

/** @type {Delay} */
let delay;

/** @type {SoundRecorder} */
let recorder;
/** @type {SoundFile} */
let soundFile;

let isRecording = false;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose({
    flipped: true,
    maxHands: 2,
  });
}

function setup() {
  const scale = 2;
  //createCanvas(640 * scale, 480 * scale);
  createCanvas(windowWidth, windowHeight);

  // @ts-ignore
  osc = new p5.Oscillator("sine");
  osc.freq(300);
  osc.amp(0.5);

  // @ts-ignore
  delay = new p5.Delay();

  //@ts-ignore
  recorder = new p5.SoundRecorder();
  recorder.setInput(osc);

  soundFile = new p5.SoundFile();

  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  // start detecting hands from the webcam video
  handPose.detectStart(video, function (results) {
    hands = results;
  });

  angleMode(DEGREES);
}

function draw() {
  // DRAW_WEBCAMVIDEO
  image(video, 0, 0, width, height);

  const rightHand = hands.find((hand) => hand.handedness === "Right");
  const leftHand = hands.find((hand) => hand.handedness === "Left");
  const handsAreDetected = rightHand && leftHand;

  // console.log(osc.started);
  if (!handsAreDetected) {
    if (osc.started) {
      osc.stop(0);
      recorder.stop();
    }
    return;
  } else {
    if (!osc.started) {
      osc.start();
      recorder.record(soundFile, undefined, () => {
        save(soundFile, "test.mp3");
      });
    }
  }

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

  let distanza_sx = calcolaDistanza(Indicesx, Pollicesx);
  let distanza_dx = calcolaDistanza(Indicedx, Pollicedx);

  //OSC transformazione
  const newFrequency = map(distanza_sx, Indicesx.x, Pollicesx.x, 100, 400);
  const newAmp = map(angolo, -180, 180, 0.1, 1);
  osc.freq(newFrequency);
  osc.amp(newAmp);
  osc.start();

  //puntoMedioSx
  const puntoMedioSx = calcolaPuntoMedio(Indicesx, Pollicesx);
  ellipse(puntoMedioSx.x, puntoMedioSx.y, 10);

  //puntoMedioDx
  const puntoMedioDx = calcolaPuntoMedio(Indicedx, Pollicedx);
  ellipse(puntoMedioDx.x, puntoMedioDx.y, 10);

  //lineatraPuntiMedi
  line(puntoMedioSx.x, puntoMedioSx.y, puntoMedioDx.x, puntoMedioDx.y);
  const distanzaPuntiMedi = calcolaDistanza(puntoMedioDx, puntoMedioSx);
  const delaySeconds = map(distanzaPuntiMedi, 0, width / 2, 0.1, 0.9, true);

  delay.process(osc, delaySeconds, 0.7, 2300);

  //MANOPOLA_AMP
  push();
  translate(puntoMedioDx.x, puntoMedioDx.y);

  fill("white");
  ellipse(0, 0, distanza_dx);

  textAlign(RIGHT);
  fill("white");
  let text_x = -distanza_dx / 2 - 10;

  textSize(20);
  text("MIN", text_x, -10);
  text("MAX", text_x, textSize() + 10);

  fill("white");
  line(text_x, 0, text_x - 50, 0);

  fill("black");
  textAlign(CENTER);
  textSize(20);
  text("VOL\n" + String(newAmp).slice(0, 4), 0, 0);

  rotate(angolo);
  let x1 = distanza_dx / 2;
  let y1 = 0;

  let x2 = distanza_dx / 4;
  let y2 = 0;
  stroke("black");
  line(x1, y1, x2, y2);

  pop();

  //TESTOFREQ
  push();
  translate(puntoMedioSx.x, puntoMedioSx.y);

  // Calcola l’angolo tra indice e pollice sinistro
  let angleSx = atan2(Pollicesx.y - Indicesx.y, Pollicesx.x - Indicesx.x);

  // Ruota di 180° rispetto alla direzione della linea (cioè, testo rivolto in senso opposto)
  rotate(angleSx + 180);

  // Sposta leggermente il testo per distanziarlo di 5 pixel in direzione ortogonale alla linea
  translate(0, 5); // Puoi usare valori negativi se lo vuoi dall’altro lato

  textSize(distanza_sx / 4);
  textAlign(CENTER);
  fill("white");
  text("frequency", 0, -20);

  pop();

  //TESTODELAY
  const puntoMediotraMedi = calcolaPuntoMedio(puntoMedioSx, puntoMedioDx);
  let distanza_puntoMdx_a_pMediotraMedi = calcolaDistanza(
    puntoMedioDx,
    puntoMediotraMedi
  );

  push();
  translate(puntoMediotraMedi.x, puntoMediotraMedi.y);

  let angleTraMedi = atan2(
    puntoMedioDx.y - puntoMedioSx.y,
    puntoMedioDx.x - puntoMedioSx.x
  );
  rotate(angleTraMedi);
  textSize(distanza_puntoMdx_a_pMediotraMedi / 4);
  textAlign(RIGHT);
  fill("white");
  text("delay", 0, -10); // Puoi regolare -10 per spostarlo leggermente sopra la linea

  pop();
}

//SOUNDRECORDER
function mousePressed() {
  // if (!isRecording) {
  //   console.log("⏺ Inizio registrazione...");
  //   recorder.record(soundFile);
  //   isRecording = true;
  // } else {
  //   console.log("⏹ Fine registrazione.");
  //   recorder.stop();
  //   isRecording = false;
  //   // Salva il file
  // }
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
  return deg - 180;
}

/**
 * Calcola la distanza euclidea tra due punti.
 * @param {Punto} p1 - Il primo punto.
 * @param {Punto} p2 - Il secondo punto.
 * @returns {number} La distanza tra i due punti.
 */
function calcolaDistanza(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcola il punto medio tra due punti
 * @param {Punto} p1 - Il primo punto.
 * @param {Punto} p2 - Il secondo punto.
 * @returns {Punto} La distanza tra i due punti.
 */
function calcolaPuntoMedio(p1, p2) {
  const x = p1.x + (p2.x - p1.x) / 2;
  const y = p1.y + (p2.y - p1.y) / 2;
  return { x, y };
}
