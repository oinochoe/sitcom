/*
Most of the stuff in here is just bootstrapping. Essentially it's just
setting ThreeJS up so that it renders a flat surface upon which to draw 
the shader. The only thing to see here really is the uniforms sent to 
the shader. Apart from that all of the magic happens in the HTML view
under the fragment shader.
*/

var container = void 0;
var camera = void 0,
    scene = void 0,
    renderer = void 0;
var uniforms = void 0;

var loader = new THREE.TextureLoader();
var texture = void 0,
    rtTexture = void 0,
    rtTexture2 = void 0;
loader.setCrossOrigin("anonymous");
loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png', function do_something_with_texture(tex) {
  texture = tex;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  init();
  animate();
});

function init() {
  container = document.getElementById('mousepoint');

  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  var geometry = new THREE.PlaneBufferGeometry(2, 2);

  rtTexture = new THREE.WebGLRenderTarget(window.innerWidth * .2, window.innerHeight * .2);
  rtTexture2 = new THREE.WebGLRenderTarget(window.innerWidth * .2, window.innerHeight * .2);

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_noise: { type: "t", value: texture },
    u_buffer: { type: "t", value: rtTexture.texture },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_renderpass: { type: 'b', value: false }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });
  material.extensions.derivatives = true;

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.addEventListener('pointermove', function (e) {
    var ratio = window.innerHeight / window.innerWidth;
    uniforms.u_mouse.value.x = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    uniforms.u_mouse.value.y = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1;

    e.preventDefault();
  });
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;

  rtTexture = new THREE.WebGLRenderTarget(window.innerWidth * .2, window.innerHeight * .2);
  rtTexture2 = new THREE.WebGLRenderTarget(window.innerWidth * .2, window.innerHeight * .2);
}

function animate(delta) {
  requestAnimationFrame(animate);
  render(delta);
}

var capturer = new CCapture({
  verbose: true,
  framerate: 60,
  // motionBlurFrames: 4,
  quality: 90,
  format: 'webm',
  workersPath: 'js/'
});
var capturing = false;

isCapturing = function isCapturing(val) {
  if (val === false && window.capturing === true) {
    capturer.stop();
    capturer.save();
  } else if (val === true && window.capturing === false) {
    capturer.start();
  }
  capturing = val;
};
toggleCapture = function toggleCapture() {
  isCapturing(!capturing);
};

window.addEventListener('keyup', function (e) {
  if (e.keyCode == 68) toggleCapture();
});

var then = 0;
function renderTexture(delta) {
  // let ov = uniforms.u_buff.value;

  var odims = uniforms.u_resolution.value.clone();
  uniforms.u_resolution.value.x = window.innerWidth * .2;
  uniforms.u_resolution.value.y = window.innerHeight * .2;

  uniforms.u_buffer.value = rtTexture2.texture;

  uniforms.u_renderpass.value = true;

  //   rtTexture = rtTexture2;
  //   rtTexture2 = buffer;

  window.rtTexture = rtTexture;
  renderer.setRenderTarget(rtTexture);
  renderer.render(scene, camera, rtTexture, true);

  var buffer = rtTexture;
  rtTexture = rtTexture2;
  rtTexture2 = buffer;

  // uniforms.u_buff.value = ov;

  uniforms.u_buffer.value = rtTexture.texture;
  uniforms.u_resolution.value = odims;
  uniforms.u_renderpass.value = false;
}
function render(delta) {

  uniforms.u_time.value = delta * 0.0005;
  renderer.render(scene, camera);
  renderTexture();

  if (capturing) {
    capturer.capture(renderer.domElement);
  }
}