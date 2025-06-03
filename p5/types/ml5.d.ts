// Type definitions for ml5.js
declare namespace ml5 {
  interface HandPoseOptions {
    maxHands: number;
    flipped: boolean;
    runtime: string;
    modelType: string;
    detectorModelUrl: string;
    landmarkModelUrl: string;
  }

  function handPose(options?: Partial<HandPoseOptions>): HandPose;

  interface HandPose {
    detectStart(video: any, callback: (results: Hand[]) => void): void;
    detectStop(): void;
  }

  interface Keypoint {
    x: number;
    y: number;
    name: string;
  }

  interface Keypoint3D {
    x: number;
    y: number;
    z: number;
    name: string;
  }

  interface KeypointCombined {
    x: number;
    y: number;
    x3D: number;
    y3D: number;
    z3D: number;
  }

  interface Hand {
    keypoints: Keypoint[];
    keypoints3D: Keypoint3D[];
    handedness: "Left" | "Right";
    wrist: KeypointCombined;
    thumb_cmc: KeypointCombined;
    thumb_mcp: KeypointCombined;
    thumb_ip: KeypointCombined;
    thumb_tip: KeypointCombined;
    index_finger_mcp: KeypointCombined;
    index_finger_pip: KeypointCombined;
    index_finger_dip: KeypointCombined;
    index_finger_tip: KeypointCombined;
    middle_finger_mcp: KeypointCombined;
    middle_finger_pip: KeypointCombined;
    middle_finger_dip: KeypointCombined;
    middle_finger_tip: KeypointCombined;
    ring_finger_mcp: KeypointCombined;
    ring_finger_pip: KeypointCombined;
    ring_finger_dip: KeypointCombined;
    ring_finger_tip: KeypointCombined;
    pinky_finger_mcp: KeypointCombined;
    pinky_finger_pip: KeypointCombined;
    pinky_finger_dip: KeypointCombined;
    pinky_finger_tip: KeypointCombined;
  }
}

declare const VIDEO: "video";
declare const AUDIO: "audio";
