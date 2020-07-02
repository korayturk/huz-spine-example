import React, { Component } from 'react';
import {spine} from 'spine-ts-canvas';

export default class Raptor extends Component {
  constructor(props) {
    super(props);
    this.state = { speed: 100 };
  }

  componentDidMount = () => {
    init();
  };
  
  render() {
    return (
      <div>
      <h1>POWERUP CARD</h1>
      <canvas id="canvasPowerup" style={{ backgroundColor: "orange", float: "left"  }}></canvas>
      <div style={{ float: "left", padding: "20px 0 0 20px" }}>
      Time multiplier
          <br />
          <input type="range" id="vol" name="vol" min="0" max="200" value={this.state.speed} style={{ width: '250px' }} onChange={(event) => {
            this.setState({ speed: parseInt(event.target.value) });
            generalSpeed = parseInt(event.target.value) / 5000;
            console.log(generalSpeed)
          }} />
          </div>
    </div>
    );
  }
}


var generalSpeed = .02
var canvas, context;
var assetManager;
var skeleton, state, bounds;
var skeletonRenderer;

var skelName = "powerup-pro";
var animName = "bounce";

var assetsUrl = "https://raw.githubusercontent.com/byhuz/huz-ui-spine/master/%40editor/assets/powerup/";
function init() {
  canvas = document.getElementById("canvasPowerup");
  canvas.width = 700;
  canvas.height = 480;
  context = canvas.getContext("2d");

  skeletonRenderer = new spine.canvas.SkeletonRenderer(context);
  skeletonRenderer.debugRendering = false;
  skeletonRenderer.triangleRendering = true;

  assetManager = new spine.canvas.AssetManager();
  assetManager.loadTexture(assetsUrl + skelName + ".png");
  assetManager.loadText(assetsUrl + skelName + ".json");
  assetManager.loadText(assetsUrl + skelName + ".atlas");

  requestAnimationFrame(load);
}

function load() {
  if (assetManager.isLoadingComplete()) {
    var data = loadSkeleton(skelName, animName, "default");
    skeleton = data.skeleton;
    state = data.state;
    bounds = data.bounds;
    requestAnimationFrame(render);
  } else {
    requestAnimationFrame(load);
  }
}

function loadSkeleton(name, initialAnimation, skin) {
  if (skin === undefined) skin = "default";

  // Load the texture atlas using name.atlas and name.png from the AssetManager.
  // The function passed to TextureAtlas is used to resolve relative paths.
  let atlas = new spine.TextureAtlas(assetManager.get(assetsUrl + name + ".atlas"), function (path) {
    return assetManager.get(assetsUrl + path);
  });
  // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
  let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

  // Create a SkeletonJson instance for parsing the .json file.
  var skeletonJson = new spine.SkeletonJson(atlasLoader);

  // Set the scale to apply during parsing, parse the file, and create a new skeleton.
  var skeletonData = skeletonJson.readSkeletonData(assetManager.get(assetsUrl + name + ".json"));
  var skeleton = new spine.Skeleton(skeletonData);
  skeleton.scaleY = -1;
  var bounds = calculateBounds(skeleton);
  skeleton.setSkinByName(skin);

  // Create an AnimationState, and set the initial animation in looping mode.
  var animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
  animationState.setAnimation(0, initialAnimation, true);
  animationState.addListener({
    event: function (trackIndex, event) {
      // console.log("Event on track " + trackIndex + ": " + JSON.stringify(event));
    },
    complete: function (trackIndex, loopCount) {
      // console.log("Animation on track " + trackIndex + " completed, loop count: " + loopCount);
    },
    start: function (trackIndex) {
      // console.log("Animation on track " + trackIndex + " started");
    },
    end: function (trackIndex) {
      // console.log("Animation on track " + trackIndex + " ended");
    }
  })

  // Pack everything up and return to caller.
  return { skeleton: skeleton, state: animationState, bounds: bounds };
}

function calculateBounds(skeleton) {
  var data = skeleton.data;
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform();
  var offset = new spine.Vector2();
  var size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);
  return { offset: offset, size: size };
}



function render() {
  resize();

  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "orange";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
  state.update(generalSpeed);
  state.apply(skeleton);
  skeleton.updateWorldTransform();
  skeletonRenderer.draw(skeleton);

  context.strokeStyle = "transparent";
  context.beginPath();
  context.moveTo(-1000, 0);
  context.lineTo(1000, 0);
  context.moveTo(0, -1000);
  context.lineTo(0, 1000);
  context.stroke();

  requestAnimationFrame(render);
}

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  if (canvas.width != w || canvas.height != h) {
    canvas.width = w;
    canvas.height = h;
  }

  // magic
  var centerX = bounds.offset.x + bounds.size.x / 2;
  var centerY = bounds.offset.y + bounds.size.y / 2;
  var scaleX = bounds.size.x / canvas.width;
  var scaleY = bounds.size.y / canvas.height;
  var scale = Math.max(scaleX, scaleY) * 1.2;
  if (scale < 1) scale = 1;
  var width = canvas.width * scale;
  var height = canvas.height * scale;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(1 / scale, 1 / scale);
  context.translate(-centerX, -centerY);
  context.translate(width / 2, height / 2);
}