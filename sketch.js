let video;

/** @type {ml5.HandPose} */
let handPose;

/** @type {ml5.Hand[]} */
let hands = [];

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

  //

  const rightHand = hands.find((hand) => hand.handedness === "Right");
  const leftHand = hands.find((hand) => hand.handedness === "Left");
  if (!rightHand || !leftHand) return;

  const punto = rightHand.index_finger_tip;
  ellipse(punto.x, punto.y, 10, 10);

  const ditoMedioSx = leftHand.middle_finger_tip;
  ellipse(ditoMedioSx.x, ditoMedioSx.y, 10, 10);
}
