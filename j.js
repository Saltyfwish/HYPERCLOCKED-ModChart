// Hi, this script is messy asf, again i'm probably the worst person to learn from so keep that in mind

"use strict";

const fs = require("fs");

const INPUT = "ExpertStandard.dat";
const OUTPUT = "ExpertPlusStandard.dat";

let difficulty = JSON.parse(fs.readFileSync(INPUT));

const infoFilePath = "info.dat";

const infoData = JSON.parse(fs.readFileSync(infoFilePath));

infoData._difficultyBeatmapSets.forEach(difficultyBeatmapSet => {
    if (difficultyBeatmapSet._difficultyBeatmaps) {
        difficultyBeatmapSet._difficultyBeatmaps.forEach(beatmap => {
            if (beatmap._customData) {
              delete beatmap._customData._requirements;
              delete beatmap._customData._suggestions;
              beatmap._customData._requirements = ["Noodle Extensions", "Chroma","Vivify"];
              //https://github.com/Aeroluna/Heck/wiki/Settings
              beatmap._customData._settings = {
                "_graphics": {
                  "_maxShockwaveParticles": 0,
                },
                "_playerOptions": {
                  "_hideNoteSpawnEffect": true,
                  "_environmentEffectsFilterDefaultPreset": "AllEffects",
                  "_environmentEffectsFilterExpertPlusPreset": "AllEffects",
                  "_noteJumpDurationTypeSettings" : "Dynamic",
                  "_noteJumpStartBeatOffset" : 0
                },
                "_environments": {
                  "_overrideEnvironments": false
                },
                "_chroma": {
                  "_disableChromaEvents": false,
                  "_disableEnvironmentEnhancements": false,
                  "_disableNoteColoring": false
                }
              };
            }
        });
    }
});

fs.writeFileSync(infoFilePath, JSON.stringify(infoData, null, 2));




//    -  -  -  -  -  -  -  -  -  -  -  -  -  BORING SHIT  -  -  -  -  -  -  -  -  -  -  -  -  -  





difficulty.customData = { materials: {}, pointDefinitions: {}, environment: [], customEvents: [], fakeColorNotes: [], fakeBombNotes: [], fakeObstacles: [], fakeBurstSliders: [] };



const customData = difficulty.customData;
const obstacles = difficulty.obstacles;
const notes = difficulty.colorNotes; 
const burstSliders = difficulty.burstSliders; 
const sliders = difficulty.sliders; 
const bombs = difficulty.bombNotes; 
const events = difficulty.basicBeatmapEvents;
const customEvents = customData.customEvents;
const pointDefinitions = customData.pointDefinitions;
const environment = customData.environment;
const geometry = customData.environment.geometry;
const fakeNotes = customData.fakeColorNotes;
const fakeBombs = customData.fakeBombNotes;
const fakeObstacles  = customData.fakeObstacles;
const fakeBurstSliders = customData.fakeBurstSliders;
const rotationEvents = difficulty.rotationEvents;

let filterednotes;
let filteredSliders;
let filteredburstSliders;
let filteredevents;
let filteredobstacles;
let filteredbombs;
let filteredsliders;

let materials = customData.materials;

if (Array.isArray(materials)) {
  materials = {};
}

obstacles.forEach(wall => {
  if (!wall.customData) {
    wall.customData = {};
  }
});

notes.forEach(note => {
  if (!note.customData) {
    note.customData = {};
  }
});

bombs.forEach(bomb => {
  if (!bomb.customData) {
    bomb.customData = {};
  }
});

sliders.forEach(slider => {
  if (!slider.customData) {
    slider.customData = {};
  }
});

burstSliders.forEach(burstSlider => {
  if (!burstSlider.customData) {
    burstSlider.customData = {};
  }
});

function random(min, max, precision = 1) {
  if (precision === 1) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  } else {
    const factor = 1 / precision;
    const adjustedMin = min * factor;
    const adjustedMax = max * factor;

    const randomNum = Math.floor(Math.random() * (adjustedMax + 1 - adjustedMin)) + adjustedMin;
    return randomNum / factor;
  }
}


function randomExcludingRange(min, max, excludeMin, excludeMax, precision = 1) {
  let randomValue = random(min, max, precision);
  while (randomValue >= excludeMin && randomValue <= excludeMax) {
    randomValue = random(min, max, precision);
  }
  return randomValue;
}


// all filterthingys
function filterNotes(start, end, type) {
  filterednotes = notes.filter(n => n.b >= start && n.b <= end);
  if (typeof type !== 'undefined' && type !== null)
      filterednotes = filterednotes.filter(n1 => n1.c == type);
  return filterednotes;
} 
function filterArcs(start, end, type) {
  filteredsliders = sliders.filter(n => n.b >= start && n.b <= end);
  if (typeof type !== 'undefined' && type !== null)
  filteredsliders = filteredsliders.filter(n1 => n1.c == type);
  return filteredsliders;
} 
function filterChains(start, end, type) {
  filteredburstSliders = burstSliders.filter(n => n.b >= start && n.b <= end);
  if (typeof type !== 'undefined' && type !== null)
  filteredburstSliders = filteredburstSliders.filter(n1 => n1.c == type);
  return filteredburstSliders;
} 
function filterBombs(start, end) {
  filteredbombs = bombs.filter(n => n.b >= start && n.b <= end);
  return filteredbombs;
} 
function filterWalls(start, end) {
  filteredobstacles = obstacles.filter(n => n.b >= start && n.b <= end);
  return filteredobstacles;
} 


// Fake filter thingys 
function removeNotes(notesToRemove) {
  notesToRemove.forEach(note => {
    const index = notes.indexOf(note);
    if (index !== -1) {
      notes.splice(index, 1);
    }
  });
}
function removeBombs(wallsToRemove) {
  wallsToRemove.forEach(note => {
    const index = bombs.indexOf(note);
    if (index !== -1) {
      bombs.splice(index, 1);
    }
  });
}
function removeArcs(arcsToRemove) {
  arcsToRemove.forEach(note => {
    const index = sliders.indexOf(note);
    if (index !== -1) {
      sliders.splice(index, 1);
    }
  });
}
function removeChains(chainsToRemove) {
  chainsToRemove.forEach(note => {
    const index = burstSliders.indexOf(note);
    if (index !== -1) {
      sliders.splice(index, 1);
    }
  });
}


function fakefilterNotes(start, end, type) {
  const filteredNotes = notes.filter(n => n.b >= start && n.b <= end);
  
  if (typeof type !== 'undefined' && type !== null) {
    const filteredByType = filteredNotes.filter(n1 => n1.c == type);
    removeNotes(filteredByType);
    return filteredByType;
  } else {
    removeNotes(filteredNotes);
    return filteredNotes;
  }
} 
function fakefilterArcs(start, end, type) {
  const filteredsliders = sliders.filter(n => n.b >= start && n.b <= end);
  
  if (typeof type !== 'undefined' && type !== null) {
    const filteredByType = filteredsliders.filter(n1 => n1.c == type);
    removeArcs(filteredsliders);
    return filteredsliders;
  } else {
    removeArcs(filteredsliders);
    return filteredsliders;
  }
} 
function fakefilterChains(start, end, type) {
  const filteredburstSliders = burstSliders.filter(n => n.b >= start && n.b <= end);
  
  if (typeof type !== 'undefined' && type !== null) {
    const filteredByType = filteredburstSliders.filter(n1 => n1.c == type);
    removeChains(filteredburstSliders);
    return filteredburstSliders;
  } else {
    removeChains(filteredburstSliders);
    return filteredburstSliders;
  }
} 
function fakefilterBombs(start, end) {
  const filteredbombs = bombs.filter(n => n.b >= start && n.b <= end);
  removeBombs(filteredbombs);
  return filteredbombs;
} 
//#region COPY/PASTE   -  -  -  -  -  -  -  -  -  -  -  -  -  use these as a copy/paste template for the lazy   -  -  -  -  -  -  -  -  -  -  -  -  -  
/*




//---------------------------------------------- ENVIRONMENTS ----------------------------------------------

environment.push(
  //fog
  {id: "Name.[0]Environment", lookupMethod: "Exact",    track: "pogFog", components:{
    BloomFogEnvironment:{ 
      height: 0,
      startY: -69,
      attenuation: 0
    }
  }},


  { id: "", lookupMethod: "Exact", active: false, duplicate: 1 },
)

//---------------------------------------------- PUSHING NOTES/WALLS ----------------------------------------------

fakeObstacles.push({
  b: 69,
  x: 0,
  y: 0,   //base 0-2
  d: 420, //duration
  h: 0,   //height 1-5
  w: 0,   //width
  customData:{
    track: "dumbTrackNameHere",
    noteJumpStartBeatOffset: 69,
    noteJumpMovementSpeed: 420,
    uninteractable: true,
    coordinates: [x, y],
    worldRotation: [x, y, z],
    localRotation: [x, y, z],
    size: [w, h, l],
    color: [r, g, b, a],
    animation: {}
    animation.offsetPosition: [],
    animation.offsetWorldRotation: [],
    animation.scale: [], 
  }
});

fakeNotes.push({
  b: 69,
  x: 0,
  y: 0,   
  a: 0, // fucking no idea what a does
  c: 0, //note type (red, blue)
  d: 0,  //direction
  customData:{
    track: "dumbTrackNameHere",
    noteJumpStartBeatOffset: 69,
    noteJumpMovementSpeed: 420,
    uninteractable: true
    animation: {}
    animation.offsetPosition: [],
    animation.offsetWorldRotation: [],
    animation.scale: [], 
  }
});

//---------------------------------------------- NOTEMOD STUFF ----------------------------------------------

filterNotes(0, 6969).forEach(note => { //change filternotes to whatever (filterarcs,chains,bombs,walls)
  note.customData.track = "dumbTrackNameHere";
  note.customData.noteJumpStartBeatOffset = 69;
  note.customData.noteJumpMovementSpeed = 420;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
  note.customData.spawnEffect = false;
  note.customData.disableNoteGravity = true;
  note.customData.disableNoteLook = true;
  note.customData.uninteractable = true;
  note.customData.animation = {}
  note.customData.animation.offsetPosition = [[]];
  note.customData.animation.offsetWorldRotation = [[]];
  note.customData.animation.scale = [[]]; 
  note.customData.animation.dissolveArrow = [[]; 
    fakeNotes.push(note);
});

filterNotes(0, 6969).forEach(note => {
  let n1 = JSON.parse(JSON.stringify(note));
  n1.customData.track = "fake";
  fakeNotes.push(n1);
});

customEvents.push({
  b: 69,
  t: "AnimateTrack",
  d: {
    track: "dumbTrackNameHere",
    duration: 420,
    easing: "easeOutQuad",
    offsetPosition: [[]],
    offsetWorldRotation: [[]],
    localRotation: [[]],
    scale: [[]],
    dissolve: [[]],
    dissolveArrow: [[]],
    color: [[]]
  }
});       

customEvents.push({
  b: 69,
  t: "AssignPathAnimation",
  d: {
    track: "dumbTrackNameHere",
    duration: 420,
    easing: "easeOutQuad",
    definitePosition: [[]],
    offsetPosition: [[]],
    offsetWorldRotation: [[]],
    localRotation: [[]],
    scale: [[]],
    dissolve: [[]],
    dissolveArrow: [[]],
    color: [[]],
    interactable: [[]];
  }
});  

customEvents.push({
  b: 0,
  t: "AssignTrackParent",
  d: {
  childrenTracks: ["heckTrack", "frigTrack"], 
  parentTrack: "dumbTrackNameHere" ,
  worldPositionStays: true,
  }
});

//---------------------------------------------- THE OTHER STUFF idk ----------------------------------------------

customEvents.push({
  b: 69,
  t: "AssignPlayerToTrack",
  d: {
  track: "playerTrack",
  target: "Stuff" //Root, Head, LeftHand, RightHand
  }
});


shader list: [
  Standard",
  "TransparentLight",
  "InterscopeCar"
  "InterscopeConcrete"
] // we dont talk about OpaqueLight (shit dont work)

change to whatever mat name you want
            ↓
materials.matname = {
  color: [1,1,1],
  track: "color track", //track name for color
  shader: "Standard", //see above for shader list
  shaderKeywords: []
};


environment.push({
  geometry: {
    type: "Cube",
    material: "example", //check somewhere at line 32 for material
  },
  track: "TRname",
});

//---------------------------------------------- VIVIFY STUFF ----------------------------------------------

tbh i dont know what any of this means exactly so just read the docs, ill prob explain it in my own simple words later

update post upload: I'm too lazy
https://vivify.aeroluna.dev/docs/

customEvents.push({
  b: float, // Time in beats.
  t: "SetMaterialProperty",
  d: {
    asset: string, // File path to the desired material.
    duration: float, // The length of the event in beats (defaults to 0).
    easing: string, // An easing for the animation to follow (defaults to easeLinear).
    properties: [{
      id: string, // Name of the property on the material.
      type: string, // Type of the property (Texture, Float, Color).
      value: ? // What to set the property to, type varies depending on property type.
    }]
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetGlobalProperty",
  d: {
    duration: float, // The length of the event in beats (defaults to 0).
    easing: string, // An easing for the animation to follow (defaults to easeLinear).
    properties: [{
      id: string, // Name of the property on the material.
      type: string, // Type of the property (Texture, Float, Color).
      value: ? // What to set the property to, type varies depending on property type.
    }]
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "InstantiatePrefab",
  d: {
    asset: string, // File path to the desired prefab.
    id: string, // (Optional) Unique id for referencing prefab later. Random id will be given by default.
    track: string, // (Optional) Track to animate prefab transform.
    position: vector3, // (Optional) Set position.
    localPosition: vector3, // (Optional) Set localPosition.
    rotation: vector3, // (Optional) Set rotation (in euler angles).
    localRotation: vector3. // (Optional) Set localRotation (in euler angles).
    scale: vector3 //(Optional) Set scale.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "Blit",
  d: {
    asset: string, // (Optional) File path to the desired material. If missing, will just copy from source to destination without anything special.
    priority: int, // (Optional) Which order to run current active post processing effects. Higher priority will run first. Default = 0
    pass: int, // (Optional) Which pass in the shader to use. Will use all passes if not defined.
    source: string, // (Optional) Which texture to pass to the shader as "_MainTex". "_Main" is reserved for the camera. Default = "_Main"
    destination: string, // (Optional) Which render texture to save to. Can be an array. "_Main" is reserved for the camera. Default = "_Main"
    duration: float, // (Optional) How long will this material be applied. Default = 0
    easing: string, // (Optional) See SetMaterialProperty.
    properties: ? // (Optional) See SetMaterialProperty.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "DeclareCullingTexture",
  d: {
    id: string // Name of the culling mask, this is what you must name your sampler in your shader.
    track: string/string[] // Name(s) of your track(s). Everything on the track(s) will be added to this mask.
    whitelist: bool // (Optional) When true, will cull everything but the selected tracks. Default = false.
    depthTexture: bool // (Optional) When true, write depth texture to "'name'_Depth". Default = false.
  }
});

//Example where notes are not rendered on the right side of the screen
sampler2D _NotesCulled;

fixed4 frag(v2f i) : SV_Target
{
  if (i.uv.x > 0.5)
  {
    return tex2D(_NotesCulled, i.uv);
  }
  else {
    return tex2D(_MainTex, i.uv);
  }
}


customEvents.push({
  b: float, // Time in beats.
  t: "DeclareRenderTexture",
  d: {
    id: string, // Name of the texture
    xRatio: float, // (Optional) Number to divide width by, i.e. on a 1920x1080 screen, an xRatio of 2 will give you a 960x1080 texture.
    yRatio: float, // (Optional) Number to divide height by.
    width: int, // (Optional) Exact width for the texture.
    height: int, // (Optional) Exact height for the texture.
    colorFormat: string, // (Optional) https://docs.unity3d.com/ScriptReference/RenderTextureFormat.html
    filterMode: string // (Optional) https://docs.unity3d.com/ScriptReference/FilterMode.html
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "DestroyTexture",
  d: {
    id: string or string[], // Names(s) of textures to destroy.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "DestroyPrefab",
  d: {
    id: string or string[], // Id(s) of prefab to destroy.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetAnimatorProperty",
  d: {
    id: string, // Id assigned to prefab.
    duration: float, // (Optional) The length of the event in beats. Defaults to 0.
    easing: string, // (Optional) An easing for the animation to follow. Defaults to "easeLinear".
    properties: [{
      id: string, // Name of the property.
      type: string, // Type of the property (Bool, Float, Trigger).
      value: ? // What to set the property to, type varies depending on property type.
    }]
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetCameraProperty",
  d: {
    id: string, // (Optional) Id of camera to affect. Default to "_Main".
    properties: { 
      depthTextureMode: [], // (Optional) Sets the depth texture mode on the camera. Can be [Depth, DepthNormals, MotionVectors].
      clearFlags: string, // (Optional) Can be [Skybox, SolidColor, Depth, Nothing]. See https://docs.unity3d.com/ScriptReference/CameraClearFlags.html
      backgroundColor: [], // (Optional) [R, G, B, (Optional) A] Color to clear screen with. Only used with SolidColor clear flag.
      culling: { // (Optional) Sets a culling mask where the selected tracks are culled
          "track: string/string[], // Name(s) of your track(s). Everything on the track(s) will be added to this mask.
          "whitelist: bool // (Optional) When true, will cull everything but the selected tracks. Defaults to false.
      },
      bloomPrePass: bool, // (Optional) Enable or disable the bloom pre pass effect.
      mainEffect: bool // (Optional) Enable or disable the main bloom effect.
    }
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "AssignTrackPrefab",
  d: {
    track: string, // Only objects on this track will be affected.
    note: string // File path to the desired prefab to replace notes.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetRenderSetting",
  d: {
    duration: float, // (Optional) The length of the event in beats. Defaults to 0.
    easing: string, // (Optional) An easing for the animation to follow. Defaults to "easeLinear".
    property: point definition // The setting to set
  }
});
customEvents.push({
  b: float, // Time in beats.
  t: "CreateCamera",
  d: {
    id: string, // Id of the camera.
    texture: string, // (Optional) Will render to a new texture set to this key.
    depthTexture: string // (Optional) Renders just the depth to this texture.
    properties: ? // (Optional) See SetCameraProperty
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "CreateScreenTexture",
  d: {
    id: string, // Name of the texture
    xRatio: float, // (Optional) Number to divide width by, i.e. on a 1920x1080 screen, an xRatio of 2 will give you a 960x1080 texture.
    yRatio: float, // (Optional) Number to divide height by.
    width: int, // (Optional) Exact width for the texture.
    height: int, // (Optional) Exact height for the texture.
    colorFormat: string, // (Optional) https://docs.unity3d.com/ScriptReference/RenderTextureFormat.html
    filterMode: string // (Optional) https://docs.unity3d.com/ScriptReference/FilterMode.html
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "DestroyObject",
  d: {
    id: string or string[], // Id(s) of object to destroy.
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "AssignObjectPrefab",
  d: {
    loadMode: string, // (Optional) How to load the asset (Single, Additive).
    object: {} // See below
  }
});
//little for loopy

for (var i =0; i<=200; i+=1) {

}

*/

//#region                       -  -  -  -  -  -  -  -  -  -  -  -  -  DO YOUR DIRTY WORK HERE  -  -  -  -  -  -  -  -  -  -  -  -  -


filterNotes(0, 6969).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.7;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
filterChains(0, 6969).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.7;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
filterArcs(0, 6969).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.7;
  note.customData.noteJumpMovementSpeed = 15;
});
filterNotes(326, 396).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.75;
  note.customData.noteJumpMovementSpeed = 16;
  note.customData.disableBadCutSaberType = true;
});
//                        -  -  -  -  -  -  -  -  -  -  -  -  -  NOTEMODS(do not go totally insane, just small things)  -  -  -  -  -  -  -  -  -  -  -  -  -
filterNotes(24, 29).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.5;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
filterArcs(24, 29).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.5;
  note.customData.noteJumpMovementSpeed = 15;
});
filterNotes(91, 116).forEach(note => {
  if (note.c == undefined){
    note.customData.track = ["drooop","leftdrop"];
  } else {
    note.customData.track = ["drooop","rightdrop"];
  }

  note.customData.noteJumpStartBeatOffset = -0.7;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
function filterthingyidk (start,end){
  filterNotes(start, end).forEach(note => {
    if (note.c == undefined){
      note.customData.track = ["drooop","leftdrop"];
    } else {
      note.customData.track = ["drooop","rightdrop"];
    }
  
    note.customData.noteJumpStartBeatOffset = 0;
    note.customData.noteJumpMovementSpeed = 15;
    note.customData.disableBadCutSaberType = true;
    note.customData.animation = {}
    note.customData.animation.offsetPosition = [[0,0,-24,0],[0,0,0,0.25,"easeOutCubic"]];
    note.customData.animation.dissolve = [[0,0.05],[1,0.15,"easeOutCubic"]];
    note.customData.animation.dissolveArrow = [[0,0.05],[1,0.15,"easeOutCubic"]];
    note.customData.animation.interactable = [[0,0.25],[1,0.25]];
  });
}
filterthingyidk (91,92)
filterthingyidk (94,96)
filterthingyidk (99,100)
filterthingyidk (102,104)
filterthingyidk (107,108)
filterthingyidk (110,112)
filterthingyidk (115,116)

function schwnak(beat){
  customEvents.push({
    b: beat,
    t: "AnimateTrack",
    d: {
      track: "drooop",
      duration: 1,
      scale: [[2,2,1,0],[1,1,1,1,"easeOutCubic"]],
    }
  }); 
}
schwnak(90)
schwnak(91)
schwnak(93)
schwnak(94)
schwnak(95)
schwnak(98)
schwnak(99)
schwnak(101)
schwnak(102)
schwnak(103)
schwnak(106)
schwnak(107)
schwnak(109)
schwnak(110)
schwnak(111)
schwnak(114)
schwnak(115)
schwnak(116)


filterthingyidk (126,128)
filterthingyidk (131,132)
filterthingyidk (134,136)
filterthingyidk (139,140)
filterthingyidk (142,144)
filterthingyidk (147,148)


schwnak(125)
schwnak(126)
schwnak(127)
schwnak(130)
schwnak(131)
schwnak(132)
schwnak(133)
schwnak(134)
schwnak(135)
schwnak(138)
schwnak(139)
schwnak(141)
schwnak(142)
schwnak(143)
schwnak(146)
schwnak(147)
filterNotes(123, 125).forEach(note => {
  note.customData.noteJumpStartBeatOffset = -0.7;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
  note.customData.track = ["invis"];
});

filterNotes(217, 217).forEach(note => {
  if (note.c == undefined){
    note.customData.track = ["mewhenspazzzzzz","testnote"];
  } else {
    note.customData.track = ["mewhenspazzzzzzR","testnote"];
  }

  note.customData.noteJumpStartBeatOffset = 4.20;
  note.customData.noteJumpMovementSpeed = 0.01;
  note.customData.disableBadCutSaberType = true;
});
customEvents.push({
  b: 0,
  t: "AnimateTrack",
  d: {
    track: ["mewhenspazzzzzz","mewhenspazzzzzzR"],
    dissolve: [0],
    dissolveArrow: [0],
    offsetPosition: [7,0,0],
    interactable: [0]
  }
}); 
customEvents.push({
  b: 215,
  t: "AnimateTrack",
  d: {
    track: "mewhenspazzzzzz",
    duration: 2,
    dissolve: [[0,0],[1,0.25,"easeOutCubic"],[1,1],[0,1]],
    dissolveArrow: [[0,0],[1,0.25,"easeOutCubic"],[1,1],[0,1]],
    offsetPosition: [[-1,1,7,0],[0,0,9,0.45,"easeOutQuart"],[0,0,0,1,"easeInSine"]],
    localRotation: [[15,-15,-90,0],[0,0,0,0.45,"easeOutBack"]],
    interactable: [[0,0.8],[1,0.8]]
  }
}); 
customEvents.push({
  b: 215,
  t: "AnimateTrack",
  d: {
    track: "mewhenspazzzzzzR",
    duration: 2,
    dissolve: [[0,0],[1,0.25,"easeOutCubic"],[1,1],[0,1]],
    dissolveArrow: [[0,0],[1,0.25,"easeOutCubic"],[1,1],[0,1]],
    offsetPosition: [[-1,-1,7,0],[0,0,9,0.45,"easeOutQuart"],[0,0,0,1,"easeInSine"]],
    localRotation: [[-15,15,90,0],[0,0,0,0.45,"easeOutBack"]],
    interactable: [[0,0.8],[1,0.8]]

  }
}); 
customEvents.push({
  b: 217.25,
  t: "AnimateTrack",
  d: {
    track: ["mewhenspazzzzzz","mewhenspazzzzzzR"],
    time: [1]
  }
}); 
filterNotes(218, 253).forEach(note => {
  note.customData.track = "testnote";
  note.customData.noteJumpStartBeatOffset = -0.7;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
filterNotes(254, 257).forEach(note => {
  note.customData.track = "testnote";
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
filterNotes(257.5, 284.75).forEach(note => {
  note.customData.track = "testnote";
  note.customData.noteJumpStartBeatOffset = -0.5;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
filterNotes(285, 289).forEach(note => {
  note.customData.track = "testnote";
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});

filterNotes(55, 59).forEach(note => { 
  if (note.c == undefined){
    note.customData.track = "blackwhitessL";
  } else {
    note.customData.track = "blackwhitessR";
  }
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
});
filterNotes(71, 74).forEach(note => { 
  if (note.c == undefined){
    note.customData.track = "blackwhitessL";
  } else {
    note.customData.track = "blackwhitessR";
  }
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
});
filterNotes(116.5, 122).forEach(note => { 
  if (note.c == undefined){
    note.customData.track = "blackwhitessL";
  } else {
    note.customData.track = "blackwhitessR";
  }
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
});
filterNotes(149, 153).forEach(note => { 
  if (note.c == undefined){
    note.customData.track = "blackwhitessL";
  } else {
    note.customData.track = "blackwhitessR";
  }
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
});
filterNotes(289, 325.25).forEach(note => { 
  if (note.c == undefined){
    note.customData.track = "blackwhitessL";
  } else {
    note.customData.track = "blackwhitessR";
  }
  note.customData.noteJumpStartBeatOffset = -0.6;
  note.customData.noteJumpMovementSpeed = 15;
});

filterNotes(355, 365.25).forEach(note => { 
  if (note.c == undefined){
    note.customData.track = "blackwhitessL";
  } else {
    note.customData.track = "blackwhitessR";
  }
  note.customData.noteJumpStartBeatOffset = -0.75;
  note.customData.noteJumpMovementSpeed = 16;
});


filterNotes(58, 71).forEach(note => {
  note.customData.track = "wooffyyy";
  note.customData.noteJumpStartBeatOffset = -1;
  note.customData.noteJumpMovementSpeed = 15;
  note.customData.disableBadCutSaberType = true;
});
customEvents.push({
  b: 57,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: "wooffyyy",
    offsetPosition: [[0,0,0,0],[0,0,2,0.5,"easeOutCubic"],[0,0,0,1,"easeInCubic"]],
    repeat: 6969
  }
}); 
filterNotes(209, 215).forEach(note => {
  


  note.customData.noteJumpStartBeatOffset = -0.5;
  note.customData.noteJumpMovementSpeed = 17;
  note.customData.disableBadCutSaberType = true;
  note.customData.animation = {}
  note.customData.animation.dissolve = [0];
  note.customData.animation.dissolveArrow = [1];

  let n1 = JSON.parse(JSON.stringify(note));
  n1.b += 0.005
  if (n1.c == undefined){
  n1.customData.track = "weeebbbooooollllL";
  } else {
  n1.customData.track = "weeebbbooooollllR";
  }
  n1.customData.noteJumpStartBeatOffset = -0.5;
  n1.customData.noteJumpMovementSpeed = 17;
  n1.customData.disableBadCutSaberType = true;
  n1.customData.animation = {}
  n1.customData.animation.dissolve = [1];
  n1.customData.animation.dissolveArrow = [0];
  fakeNotes.push(n1);
    let n2 = JSON.parse(JSON.stringify(note));
  n2.b += 0.01
  n2.customData.track = "35131yhg13yq564";
  
  n2.customData.noteJumpStartBeatOffset = -0.5;
  n2.customData.noteJumpMovementSpeed = 17;
  n2.customData.disableBadCutSaberType = true;
  n2.customData.animation = {}
  n2.customData.animation.dissolve = [1];
  n2.customData.animation.dissolveArrow = [0];
    n2.customData.animation.color = [0,0,0,0];
  fakeNotes.push(n2); 
});
customEvents.push({
  b: 0,
  t: "AssignPathAnimation",
  d: {
    track: ["weeebbbooooollllL","weeebbbooooollllR"],
    offsetPosition: [0,0,0],
  }
}); 
customEvents.push({
  b: 209,
  t: "AssignPathAnimation",
  d: {
    duration: 6,
    easing: "easeInQuad", 
    track: "weeebbbooooollllR",
    offsetPosition: [[12,0,0,0],[0,0,0,0.5,"easeOutBack"]],
  }
}); 
customEvents.push({
  b: 209,
  t: "AssignPathAnimation",
  d: {
    duration: 6,
    easing: "easeInQuad", 
    track: "weeebbbooooollllL",
    offsetPosition: [[-12,0,0,0],[0,0,0,0.5,"easeOutBack"]],
  }
}); 
//                      -  -  -  -  -  -  -  -  -  -  -  -  -  VIVIFY SHIT  -  -  -  -  -  -  -  -  -  -  -  -  -
customEvents.push({
  b: 121-0.1, 
  t: "CreateScreenTexture",
  d: {
    id: "_Old1", 
  }
});
customEvents.push({
  b: 121+0.05-0.1, 
  t: "Blit",
  d: {
    destination: "_Old1", 
  }
});
customEvents.push({
  b: 121-0.1, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/picturemat.mat" ,
    duration: 6969,
    properties: [
      { 
        id: "_1",
        type: "Float",
        value: [1]
      },
    ]
  }
});
customEvents.push({
  b: 0,
  t: "AssignPlayerToTrack",
  d: {
  track: "brahhhhhhh",
  }
});
customEvents.push({
  b: 121-0.1,
  t: "AnimateTrack",
  d: {
    track: "brahhhhhhh",
    duration: 0.05,
    position: [[0,0,2,1],[0,0,0,1]],
    localRotation: [[0,180,0,1],[0,0,0,1]]
  }
});   

customEvents.push({
  b: 121, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/person/backshots.prefab",
    track: "polorodebr",
    id: "byebye",
    scale: [1,1.5,1]
  }
});
customEvents.push({
  b: 121, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/person/person.prefab",
    track: "polorode3",
    id: "byebye2",
    scale: [0.15,0.15,0.2]
  }
});
customEvents.push({
  b: 121, 
  t: "InstantiatePrefab",
  d: {
    asset:  "assets/assetbundles/person/picture.prefab",
    track: "polorode",
    id: "byebye3",
    scale: [1,1.5,1]
  }
});
customEvents.push({
  b: 121, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/person/render.prefab",
    track: "polorode",
    id: "byebye4",
    scale: [2,1.125,1]
  }
});
customEvents.push({
  b: 126, 
  t: "DestroyObject",
  d: {
    id: ["byebye","byebye2","byebye3","byebye4",]
  }
});
customEvents.push({
  b: 121,
  t: "AnimateTrack",
  d: {
    track: "polorode3",
    duration: 2,
    scale: [[0,0,0,0.6],[0.15,0.15,0.2,0.6]],
  }
}); 
customEvents.push({
  b: 121,
  t: "AnimateTrack",
  d: {
    track: ["polorode","polorode3"],
    duration: 2,
    localRotation: [[0,180,15,0,"easeInBack"],[0,180,-15,0.5,"easeInBack"],[0,0,0,1,"easeOutCubic"]]
  }
}); 
customEvents.push({
  b: 121,
  t: "AnimateTrack",
  d: {
    track: "polorodebr",
    duration: 2,
    localRotation: [[0,0,-15,0,"easeInBack"],[0,0,15,0.5,"easeInBack"],[0,-180,0,1,"easeOutCubic"]]
  }
}); 

customEvents.push({
  b: 121,
  t: "AnimateTrack",
  d: {
    track: "floorrrrrrrr",
    duration: 1,
    position: [[0,0.3,2,0]],
  }
}); 
customEvents.push({
  b: 125,
  t: "AnimateTrack",
  d: {
    track: "floorrrrrrrr",
    duration: 1,
    position: [[0,0.3,2,0],[0,-2.5,2,1,"easeInQuart"]],
  }
}); 
customEvents.push({
  b: 0,
  t: "AssignTrackParent",
  d: {
  childrenTracks: ["polorode","polorode3","polorodebr"], 
  parentTrack: "floorrrrrrrr" ,
  }
});
customEvents.push({
  b: 121,
  t: "AnimateTrack",
  d: {
    track: "floorrrrrrrr",
    duration: 1,
    localRotation: [[50,0,0,0]]
  }
}); 
customEvents.push({
  b: 121,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 0.05,
    position: [[0,0,2,1],[0,0,0,1]],
    localRotation: [[0,180,0,1],[0,0,0,1]]
  }
});  
customEvents.push({
  b: 121, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/flash.prefab",
    track: "flash",
    id: "flashbang",
    position: [0,1.6,2],
    scale: [7,7,0]
  }
});
customEvents.push({
  b: 122, 
  t: "DestroyObject",
  d: {
    id: "flashbang"
  }
});
customEvents.push({
  b: 121, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/materials/flash.mat" , 
    duration: 1, 
    properties: [
      { 
        id: "_GlowStrength",
        type: "Float",
        value: [[7.69,0],[0,1,"easeOutCubic"]]
      },
      { 
        id: "_GlowSize",
        type: "Float",
        value: 0.2
      },
      { 
        id: "_Transparency",
        type: "Float",
        value: [[1,0.75],[0,1,"easeOutCubic"]]
      },

    ]
  }
});
customEvents.push({
  b: 0, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/warningmes.prefab",
    id: "lowwwwwww",
    track: "youknowwhatelseismassive",
    position: [0,0.2,1.8],
    scale: [16/5,9/5,0],
    localRotation: [80,0,0]
  }
});
customEvents.push({
  b: 24,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: "youknowwhatelseismassive",
    scale: [[16/5,9/5,0,0],[16/5,0,0,1,"easeInCirc"]],
  }
}); 
customEvents.push({
  b: 27, 
  t: "DestroyObject",
  d: {
    id: "lowwwwwww"
  }
});
customEvents.push({
  b: 0, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/cube.prefab",
    track: ":3"
  }
});

customEvents.push({
  b: 0,
  t: "AnimateTrack",
  d: {
    track: ":3",
    duration: 2,
    localRotation: [[0,0,0,0],[0,180,0,0.5],[0,360,0,1]],
    repeat: 6969
  }
});  

customEvents.push({
  b: 0, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 5.375,
    properties: [
      {
        id: "_Noise", 
        type: "Float",
        value: 0
      },
      {
        id: "_Limit",
        type: "Float",
        value: 0
      },
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.6,1],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: 3
      },
      {
        id: "_Mute",
        type: "Float",
        value: 0.133
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: 0.4
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.005
      },

      {
        id: "_Bars",
        type: "Float",
        value: 0
      }
    ]
  }
});


customEvents.push({
  b: 5.375, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 2.5,
    properties: [
      { 
        id: "_Bars",
        type: "Float",
        value: [[1,0],[1,1,"easeInOutCubic"]]
      }
    ]
  }
});

customEvents.push({
  b: 5, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/bars.prefab",
    track: "leftbar",
    id: "davidissmelly"
  }
});

customEvents.push({
  b: 10, 
  t: "DestroyObject",
  d: {
    id: "davidissmelly"
  }
});

customEvents.push({
  b: 149, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/bars.prefab",
    track: "leftbar2",
    id: "davidissmelly2"
  }
});
customEvents.push({
  b: 155, 
  t: "DestroyObject",
  d: {
    id: "davidissmelly2"
  }
});
customEvents.push({
  b: 149,
  t: "AnimateTrack",
  d: {
    track: "leftbar2",
    duration: 5,
    rotation: ["baseHeadRotation"],
    localPosition: ["baseHeadPosition"],
  }
});
customEvents.push({
  b: 0,
  t: "AnimateTrack",
  d: {
    track: "leftbar",
    duration: 6969,
    rotation: ["baseHeadRotation"],
    localPosition: ["baseHeadPosition"],
  }
});

customEvents.push({
  b: 0, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/materials/cuzvhsbarsucks.mat" , 
    duration: 5.375, 
    properties: [
      { 
        id: "_SplitAmount",
        type: "Float",
        value: 0
      },
      { 
        id: "_MoveZ",
        type: "Float",
        value: 0.15
      }
    ]
  }
});
customEvents.push({
  b: 5.375, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/materials/cuzvhsbarsucks.mat" , 
    duration: 4, 
    properties: [
      { 
        id: "_SplitAmount",
        type: "Float",
        value: [[0,0],[0.145,1,"easeInOutQuart"]]
      }
    ]
  }
});
customEvents.push({
  b: 149, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/materials/cuzvhsbarsucks.mat" , 
    duration: 1, 
    properties: [
      { 
        id: "_SplitAmount",
        type: "Float",
        value: [[0.145,0],[0.04,1,"easeOutExpo"]]
      }
    ]
  }
});
customEvents.push({
  b: 153, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/materials/cuzvhsbarsucks.mat" , 
    duration: 2, 
    properties: [
      { 
        id: "_SplitAmount",
        type: "Float",
        value: [[0.04,0],[0.245,1,"easeOutSine"]]
      }
    ]
  }
});
customEvents.push({
  b: 7.875, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 13+(1-0.875),
    properties: [
      {
        id: "_Noise",
        type: "Float",
        value: 0
      },
      {
        id: "_Limit",
        type: "Float",
        value: 0
      },
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.6,1],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: 3
      },
      {
        id: "_Mute",
        type: "Float",
        value: 0.133
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: 0.4
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.005
      },
    ]
  }
});

customEvents.push({
  b: 5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 16,
    properties: [
      {
        id: "_Resolution",
        type: "Float",
        value: 90000
      },
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: 2
      },
    ]
  }
});
//customEvents.push({
//  b: 21, 
//  t: "Blit",
//  d: {
//    asset: "assets/shaders/glitchy.mat",
//    duration: 4,
//    properties: [
//      {
//        id: "_Resolution",
//        type: "Float",
//        value: 90000
//      },
//      {
//        id: "_GlitchMultiplier",
//        type: "Float",
//        value: [[2,0],[0,1]]
//      },
//    ]
//  }
//});
function noteveryoneunderstandshousemusic(name){
  customEvents.push({
    b: 0, 
    t: "InstantiatePrefab",
    d: {
      asset: "assets/assetbundles/noteveryone/"+name+".prefab",
      id: name,
      track: name
    }
  });
  customEvents.push({
    b: 25,
    t: "AnimateTrack",
    d: {
      track: name,
      position: [0,-6969,-6969]
    }
  }); 
  customEvents.push({
    b: 25, 
    t: "DestroyObject",
    d: {
      id: name,
    }
  });
}
noteveryoneunderstandshousemusic("not")
noteveryoneunderstandshousemusic("everyone")
noteveryoneunderstandshousemusic("understands")
noteveryoneunderstandshousemusic("house")
noteveryoneunderstandshousemusic("music")
noteveryoneunderstandshousemusic("its")
noteveryoneunderstandshousemusic("a")
noteveryoneunderstandshousemusic("spiritual")
noteveryoneunderstandshousemusic("thing")
customEvents.push({
  b: 10.5,
  t: "AnimateTrack",
  d: {
    track: "not",
    position: [-5,4,10]
  }
}); 
customEvents.push({
  b: 10.875,
  t: "AnimateTrack",
  d: {
    track: "everyone",
    position: [-3,2,10]
  }
}); 
customEvents.push({
  b: 12.5,
  t: "AnimateTrack",
  d: {
    track: "understands",
    position: [-0,0,10]
  }
}); 
customEvents.push({
  b: 15,
  t: "AnimateTrack",
  d: {
    track: "house",
    position: [2,4,10]
  }
}); 
customEvents.push({
  b: 16.25,
  t: "AnimateTrack",
  d: {
    track: "music",
    position: [3,3,10]
  }
}); 
customEvents.push({
  b: 17.5,
  t: "AnimateTrack",
  d: {
    track: "its",
    position: [-4,0,10]
  }
}); 
customEvents.push({
  b: 18,
  t: "AnimateTrack",
  d: {
    track: "a",
    position: [-2.7,0.6,10]
  }
}); 
customEvents.push({
  b: 19,
  t: "AnimateTrack",
  d: {
    track: "spiritual",
    position: [-2,1.2,10]
  }
}); 
customEvents.push({
  b: 21,
  t: "AnimateTrack",
  d: {
    track: "thing",
    duration: 0.125,
    position: [[3,2,10,0.5],[0,-6969,-6969,0.5]],
    repeat: 6969,
  }
}); 

customEvents.push({
  b: 21, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/materials/words.mat", 
    duration: 4, 
    properties: [{
      id: "_ColorR",
      type: "Float", 
      value: [[1,0],[0,1]]
    }]
  }
});
customEvents.push({
  b: 21, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 3,
    properties: [
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.6,0],[0.1,1],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: [[3,0],[3,1]]
      },
      {
        id: "_Mute",
        type: "Float",
        value: [[0.133,0],[0,1]]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.4,0],[0.2,1]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.005,0],[0.002,1]]
      },
    ]
  }
});
customEvents.push({
  b: 24, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_Scanline",
        type: "Float",
        value: [0.1]
      },
      {
        id: "_Gap",
        type: "Float",
        value: [3]
      },
      {
        id: "_Mute",
        type: "Float",
        value: [0]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [0.2]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [0.002]
      },
    ]
  }
});
customEvents.push({
  b: 25, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 7,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.02,0],[0.5,1/7,"easeOutQuad"]]
      },
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.1,0],[0.6,1/7,"easeOutQuad"],[0.6,1,"easeOutQuad"],[0,1]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.002,0],[0.009,1/7,"easeOutQuad"]]
      },
    ]
  }
});
customEvents.push({
  b: 32, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 9,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.5,0],[0.02,1/9,"easeOutQuad"]]
      },
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.6,0],[0.1,1/9,"easeOutQuad"]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.009,0],[0.002,1/9,"easeOutQuad"]]
      },
    ]
  }
});
customEvents.push({
  b: 41, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 7,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.02,0],[0.5,1/7,"easeOutQuad"]]
      },
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.1,0],[0.6,1/7,"easeOutQuad"],[0.6,1,"easeOutQuad"],[0,1]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.002,0],[0.009,1/7,"easeOutQuad"]]
      },
    ]
  }
});
customEvents.push({
  b: 48, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 8,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.5,0],[0.02,1/8,"easeOutQuad"]]
      },
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.6,0],[0.1,1/8,"easeOutQuad"]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.009,0],[0.002,1/8,"easeOutQuad"]]
      },
    ]
  }
});
customEvents.push({
  b: 56, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 90-56,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.002,0],[0.0035,1/90-59,"easeOutCubic"]]
      },
    ]
  }
});

customEvents.push({
  b: 57, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0.4
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0.3
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0],[0.4,0.25,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0.25],[-0.4,0.5,"easeOutCubic"]]
      },

      {
        id: "_RightOffset",
        type: "Float",
        value: [[0,0.5],[-0.4,0.75,"easeOutCubic"]]
      },
      {
        id: "_LeftOffset",
        type: "Float",
        value: [[0,0.75],[0.4,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 61, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0.4,0],[0,0.25,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0.4,0.25],[0,0.5,"easeOutCubic"]]
      },

      {
        id: "_RightOffset",
        type: "Float",
        value: [[-0.4,0.5],[0,0.75,"easeOutCubic"]]
      },
      {
        id: "_LeftOffset",
        type: "Float",
        value: [[0.4,0.75],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 65, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0],[-0.4,0.25,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0.25],[0.4,0.5,"easeOutCubic"]]
      },

      {
        id: "_RightOffset",
        type: "Float",
        value: [[0,0.5],[0.4,0.75,"easeOutCubic"]]
      },
      {
        id: "_LeftOffset",
        type: "Float",
        value: [[0,0.75],[-0.4,1,"easeOutCubic"]]
      },
    ]
  }
});

customEvents.push({
  b: 69, //nice
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[-0.4,0],[0,0.25,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0.4,0.25],[0,0.5,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 71,
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 1,
    properties: [
      {
        id: "_RightOffset",
        type: "Float",
        value: [[0.4,0],[0,1,"easeOutCubic"]]
      },
      {
        id: "_LeftOffset",
        type: "Float",
        value: [[-0.4,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 73, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0.4
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0.3
      },
      {
        id: "_RightOffset",
        type: "Float",
        value: [[0,0],[0.4,0.25,"easeOutCubic"]]
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0.25],[0.4,0.5,"easeOutCubic"]]
      },

      {
        id: "_LeftOffset",
        type: "Float",
        value: [[-0,0.5],[-0.4,0.75,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0,0.75],[-0.4,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 77, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0.4
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0.3
      },
      {
        id: "_RightOffset",
        type: "Float",
        value: [[0.4,0],[0,0.25,"easeOutCubic"]]
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0.4,0.25],[0,0.5,"easeOutCubic"]]
      },

      {
        id: "_LeftOffset",
        type: "Float",
        value: [[-0.4,0.5],[0,0.75,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0.4,0.75],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 81, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 4,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0.4
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0.3
      },
      {
        id: "_RightOffset",
        type: "Float",
        value: [[0,0],[0.4,0.25,"easeOutCubic"]]
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0.25],[0.4,0.5,"easeOutCubic"]]
      },

      {
        id: "_LeftOffset",
        type: "Float",
        value: [[-0,0.5],[-0.4,0.75,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0,0.75],[-0.4,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 85, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 1,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0.4
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0.3
      },
      {
        id: "_RightOffset",
        type: "Float",
        value: [[0.4,0],[0,1,"easeOutCubic"]]
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0.4,0],[0,1,"easeOutCubic"]]
      },

      {
        id: "_LeftOffset",
        type: "Float",
        value: [[-0.4,0],[0,1,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0.4,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
function bapthing(beat,amount,duration,ease,hororver,truetrue,durationsssss){
  if (truetrue == 1){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/bloom.mat",
        duration: duration,
        properties: [
          {
            id: "_BloomIntensity",
            type: "Float",
            value: [[5,0],[1,1,ease]]
          },
          {
            id: "_BloomThreshold",
            type: "Float",
            value: [[0.11,0],[0,1,ease]]
          },
        ]
      }
    });
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/vhs.mat",
        duration: durationsssss,
        properties: [
          {
            id: "_Pixelate",
            type: "Float",
            value: [[0.69,0],[0.1,duration/(durationsssss/2),ease]]
          }
        ]
      }
    });
  }

  if (hororver == 1){
    if (truetrue == 1){
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_GapSizeX",
              type: "Float",
              value: 0.4
            },
            {
              id: "_GapSizeY",
              type: "Float",
              value: 0
            },
            {
              id: "_TopOffset",
              type: "Float",
              value: [[amount*-1,0],[0,1,ease]]
            },
            {
              id: "_BottomOffset",
              type: "Float",
              value: [[amount,0],[0,1,ease]]
            },
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[amount*-6,0],[0,1,ease]]
            },
            {
              id: "_RightOffset",
              type: "Float",
              value: [[amount*6,0],[0,1,ease]]
            },
          ]
        }
      });
    } else {
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
        
          properties: [
            {
              id: "_GapSizeX",
              type: "Float",
              value: 0
            },
            {
              id: "_GapSizeY",
              type: "Float",
              value: 0
            },
            {
              id: "_TopOffset",
              type: "Float",
              value: [[amount*-1,0],[0,1,ease]]
            },
            {
              id: "_BottomOffset",
              type: "Float",
              value: [[amount,0],[0,1,ease]]
            }
          ]
        }
      });
    }


  } else {
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: duration,
        properties: [
          {
            id: "_GapSizeX",
            type: "Float",
            value: 0
          },
          {
            id: "_GapSizeY",
            type: "Float",
            value: 0
          },
          {
            id: "_RightOffset",
            type: "Float",
            value: [[amount*-1,0],[0,1,ease]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[amount,0],[0,1,ease]]
          },
        ]
      }
    });
  }
}
bapthing(33,0.069,1,"easeOutQuart",1)
bapthing(37,-0.069,1,"easeOutQuart",1)
bapthing(41,0.069,1,"easeOutQuart",1)
bapthing(49,0.069,1,"easeOutQuart",0)
bapthing(53,-0.069,1,"easeOutQuart",0)
function blackwhite(beat,duration){
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/fried.mat",
      duration: duration,
      properties: [
        {
          id: "_Brightness",
          type: "Float",
          value: [[0,1],[0,1,"easeInCirc"]]
        },
        {
          id: "_Saturation",
          type: "Float",
          value: [[-1,1],[0,1,"easeInCirc"]]
        },
        {
          id: "_Contrast",
          type: "Float",
          value: [[0.2,1],[0,1,"easeInCirc"]]
        },
  
      ]
    }
  });
  customEvents.push({
    b: beat,
    t: "AnimateTrack",
    d: {
      track: "blackwhitessL",
      duration: duration,
      color: [[0.6,0.6,0.6,1,1],["baseNote0Color",1]]
    }
  });   
  customEvents.push({
    b: beat,
    t: "AnimateTrack",
    d: {
      track: "blackwhitessR",
      duration: duration,
      color: [[1,1,1,1,1],["baseNote1Color",1]]
    }
  });    
}
blackwhite(56,1)


blackwhite(71,2)


customEvents.push({
  b: 149, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 4,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0.1,1],[0,1,"easeInCirc"]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: [[-1,1],[0,1,"easeInCirc"]]
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0.2,1],[0,1,"easeInCirc"]]
      },

    ]
  }
});
customEvents.push({
  b: 149,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessL",
    duration: 4,
    color: [[0.6,0.6,0.6,1,1],["baseNote0Color",1]]
  }
});   
customEvents.push({
  b: 149,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessR",
    duration: 4,
    color: [[1,1,1,1,1],["baseNote1Color",1]]
  }
});   
const bloomm = 6.9
const tresh = 0.11
customEvents.push({
  b: 73, 
  t: "Blit",
  d: {
    asset: "assets/shaders/bloom.mat",
    duration: 12,
    properties: [
      {
        id: "_BloomIntensity",
        type: "Float",
        value: [[1,0],[bloomm,1,"easeOutSine"]]
      },
      {
        id: "_BloomThreshold",
        type: "Float",
        value: [[0,0],[tresh,1,"easeOutSine"]]
      },
    ]
  }
});
customEvents.push({
  b: 85, 
  t: "Blit",
  d: {
    asset: "assets/shaders/bloom.mat",
    duration: 1,
    properties: [
      {
        id: "_BloomIntensity",
        type: "Float",
        value: [[bloomm,0],[1,1,"easeOutCubic"]]
      },
      {
        id: "_BloomThreshold",
        type: "Float",
        value: [[tresh,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
//customEvents.push({
//  b: 56, 
//  t: "Blit",
//  d: {
//    asset: "assets/shaders/mistake.mat",
//    duration: 1,
//    properties: [
//      {
//        id: "_Scale",
//        type: "Float",
//        value: [[2,0],[1,1,"easeInQuart"]]
//      },
//      {
//        id: "_RotationAngle",
//        type: "Float",
//        value: [[25,0],[0,1,"easeInQuart"]]
//      }
//    ]
//  }
//});
customEvents.push({
  b: 56,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 1,
    position: [[0,0,0,0],[0.72,0,-2.5,0.5,"easeOutQuart"],[0,0,0,1,"easeInQuint"]],
    localRotation: [[0,0,0,0],[0,0,25,0.5,"easeOutQuart"],[0,0,0,1,"easeInQuint"]]
  }
});   
//customEvents.push({
//  b: 89, 
//  t: "Blit",
//  d: {
//    asset: "assets/shaders/mistake.mat",
//    duration: 1,
//    properties: [
//      {
//        id: "_Scale",
//        type: "Float",
//        value: [[1,0],[2,0.5,"easeOutQuart"],[1,1,"easeInQuint"]]
//      },
//      {
//        id: "_RotationAngle",
//        type: "Float",
//        value: [[0,0],[25,0.5,"easeOutQuart"],[0,1,"easeInQuint"]]
//      }
//    ]
//  }
//});
customEvents.push({
  b: 1,
  t: "AssignPlayerToTrack",
  d: {
  track: "gimmehead",
  target: "Head" //Root, Head, LeftHand, RightHand
  }
});

customEvents.push({
  b: 89,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 1,
    position: [[0,0,0,0],[0.72,0,-2.8,0.5,"easeOutQuart"],[0,0,0,1,"easeInQuint"]],
    localRotation: [[0,0,0,0],[0,0,25,0.5,"easeOutQuart"],[0,0,0,1,"easeInQuint"]]
  }
});   
customEvents.push({
  b: 50.5, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/the thing.prefab",
    track: "lol",
    id: "begone1"
  }
});
customEvents.push({
  b: 50.5, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/the thing2.prefab",
    track: "lol",
    id: "begone2"
  }
});
customEvents.push({
  b: 65, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/warning.prefab",
    track: "lol",
    id: "begone3"
  }
});
customEvents.push({
  b: 65, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/warning2.prefab",
    track: "lol",
    id: "begone4"
  }
});
customEvents.push({
  b: 91, 
  t: "DestroyObject",
  d: {
    id: ["begone1","begone2","begone3","begone4"],
  }
});
customEvents.push({
  b: 85,
  t: "AnimateTrack",
  d: {
    track: "lol",
    duration: 4,
    scale: [[1,1,1,0],[5,5,5,1,"easeInCubic"]],
  }
});   
for (var i = 73; i <= 84; i += 2) {
  customEvents.push({
    b: i, 
    t: "Blit",
    d: {
      asset: "assets/shaders/sepscreen.mat",
      duration: 2,
      properties: [
        {
          id: "_BottomOffset",
          type: "Float",
          value: [[0,0],[-0.3,0.25,"easeOutCubic"],[0,0.5,"easeInCubic"]]
        },
        {
          id: "_TopOffset",
          type: "Float",
          value: [[0,0.5],[0.3,0.75,"easeOutCubic"],[0,1,"easeInCubic"]]
        }
      ]
    }
  });
}
customEvents.push({
  b: 90, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.0035,0],[0.004,1,"easeOutCubic"]]
      },
    ]
  }
});

let alternate = true;

const filteredBombs = fakefilterBombs(90, 148);

let durations = [];
let nextDelays = [];

for (let i = 0; i < filteredBombs.length; i++) {
  const note = filteredBombs[i];
  const value = alternate ? 0.1 : -0.1;
  const extraParam = (note.b === 122 || note.b === 123) ? undefined : 1;

  let duration = 1;
  let nextDelay = 1; 

  if (i < filteredBombs.length - 1) {
    nextDelay = filteredBombs[i + 1].b - note.b;
    duration = nextDelay;
  }

  durations.push(duration);
  nextDelays.push(nextDelay);

  bapthing(note.b, value, 1, "easeOutQuart", 1, extraParam, nextDelay);

  alternate = !alternate;
}
customEvents.push({
  b: 149, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 4,
  }
});



function removeWalls(wallsToRemove) {
  wallsToRemove.forEach(wall => {
    const index = obstacles.indexOf(wall);
    if (index !== -1) {
      obstacles.splice(index, 1);
    }
  });
}

function fakefilterWalls(start, end) {
  const filteredWalls = obstacles.filter(n => n.b >= start && n.b <= end);
  removeWalls(filteredWalls);
  return filteredWalls;
}

const filteredWalls = fakefilterWalls(90, 148);
let alternate2 = true;

for (const note of filteredWalls) {
  if (note.b % 1 === 0) { 
    const value = alternate2 ? 0.3 : -0.3;
    bapthing(note.b, value, 1, "easeOutCubic", 0);
    alternate2 = !alternate2;
  }

}
customEvents.push({
  b: 129.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 1,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0],[-0.3,0.25,"easeOutCubic"],[0,0.5,"easeInCirc"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0],[0.3,0.25,"easeOutCubic"],[0,0.5,"easeInCirc"]]
      },
    ]
  }
});

blackwhite(116,4)
customEvents.push({
  b: 120, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 1,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0,0],[0,1,"easeInCirc"]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: [[-1,0],[0,1,"easeInCirc"]]
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0.2,0],[0,1,"easeInCirc"]]
      },

    ]
  }
});
customEvents.push({
  b: 120,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessL",
    duration: 1,
    color: [[0.6,0.6,0.6,1,0],["baseNote0Color",1,"easeInCirc"]]
  }
});   
customEvents.push({
  b: 120,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessR",
    duration: 1,
    color: [[1,1,1,1,0],["baseNote1Color",1,"easeInCirc"]]
  }
});  
//customEvents.push({
//  b: 117, 
//  t: "Blit",
//  d: {
//    asset: "assets/shaders/mistake.mat",
//    duration: 3,
//    properties: [
//      {
//        id: "_Scale",
//        type: "Float",
//        value: [[1,0],[3,1,"easeOutSine"]]
//      },
//      {
//        id: "_RotationAngle",
//        type: "Float",
//        value: [[0,0],[25,1,"easeOutSine"]]
//      }
//    ]
//  }
//});
customEvents.push({
  b: 117,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 3,
    position: [[0,0,0,0],[0.72,0,-3.6,1,"easeOutSine"]],
    localRotation: [[0,0,0,0],[0,0,25,1,"easeOutSine"]]
  }
});   
//customEvents.push({
//  b: 120, 
//  t: "Blit",
//  d: {
//    asset: "assets/shaders/mistake.mat",
//    duration: 1,
//    properties: [
//      {
//        id: "_Scale",
//        type: "Float",
//        value: [[3,0],[1,1,"easeInCubic"]]
//      },
//      {
//        id: "_RotationAngle",
//        type: "Float",
//        value: [[25,0],[0,1,"easeInCubic"]]
//      }
//    ]
//  }
//});
customEvents.push({
  b: 120,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 1,
    position: [[0.72,0,-3.6,0],[0,0,0,1,"easeInCubic"]],
    localRotation: [[0,0,25,0],[0,0,0,1,"easeInCubic"]]
  }
});  
customEvents.push({
  b: 121, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.0035,0],[0.02,1,"easeOutCubic"]]
      },
    ]
  }
});

customEvents.push({
  b: 122, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 3,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.02
      },
    ]
  }
});

customEvents.push({
  b: 125, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.02,0],[0.0035,1,"easeOutCubic"]]
      },
    ]
  }
});

customEvents.push({
  b: 153, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 31,
    properties: [
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.01,0],[0.169,2/31,"easeOutQuart"],[0.169,1,"easeOutQuart"],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: [[3,0],[3,2/31,"easeOutQuart"]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.0035,0],[0.002,2/31,"easeOutQuart"]]
      },
    ]
  }
});
customEvents.push({
  b: 184, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 13,
    properties: [
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.169,0],[0.1,1/13,"easeOutQuad"],[0.1,1,"easeOutQuad"],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: [[3,0],[3,1/13,"easeOutQuad"]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.002,0],[0.002,1/13,"easeOutQuad"]]
      },
    ]
  }
});

customEvents.push({
  b: 197, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 2.75,
    properties: [
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.2,0],[0.169,1/2.75,"easeOutQuad"],[0.169,1,"easeOutQuad"],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: [[3,0],[3,1/2.75,"easeOutQuad"]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.01,0],[0.005,1/2.75,"easeOutQuad"]]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.8,0],[0.3,1/2.75,"easeOutQuad"]]
      },
    ]
  }
});
customEvents.push({
  b: 199.75, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_Scanline",
        type: "Float",
        value: [[0.169,0],[0.1,1,"easeOutCubic"],[0,1]]
      },
      {
        id: "_Gap",
        type: "Float",
        value: [[3,0],[3,1,"easeOutCubic"]]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.005,0],[0.002,1,"easeOutCubic"]]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.5,0],[0.3,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 200.75, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 217-200.75,
  }
});
customEvents.push({
  b: 209, 
  t: "Blit",
  d: {
    asset: "assets/shaders/bloom.mat",
    duration: 6,
    properties: [
      {
        id: "_BloomIntensity",
        type: "Float",
        value: [[1,0],[4,1]]
      },
      {
        id: "_BloomThreshold",
        type: "Float",
        value: [[0,0],[0.11,1]]
      },
    ]
  }
});
customEvents.push({
  b: 215, 
  t: "Blit",
  d: {
    asset: "assets/shaders/bloom.mat",
    duration: 0.5,
    properties: [
      {
        id: "_BloomIntensity",
        type: "Float",
        value: [[4,0],[1,1,"easeOutCubic"]]
      },
      {
        id: "_BloomThreshold",
        type: "Float",
        value: [[0.11,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
//check it out yall
customEvents.push({
  b: 217, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 7,
    properties: [
      {
        id: "_Resolution",
        type: "Float",
        value: 20000
      },
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: 200
      },
    ]
  }
});
customEvents.push({
  b: 224, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 29,
  }
});
customEvents.push({
  b: 257, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 32,
  }
});
customEvents.push({
  b: 224, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 1,
    properties: [
      {
        id: "_Resolution",
        type: "Float",
        value: [[20000,0],[50000,1,"easeOutCubic"]]
      },
    ]
  }
});

bapthing(217,-0.3,1,"easeOutElastic",1,1)
// I understand it now
customEvents.push({
  b: 217, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [[0.01,0],[0.002,1,"easeOutCubic"]]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.8,0],[0.3,1,"easeOutCubic"]]
      },
    ]
  }
});

customEvents.push({
  b: 219, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1.25,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.5,0.125],
          [0.002,0.125],
          [0.002,0.25],
          [0.5,0.25],
          [0.5,0.375],
          [0.002,0.375],
          [0.002,0.4375],
          [0.5,0.4375],
          [0.5,0.5],
          [0.002,0.5],
          [0.002,0.5625],
          [0.5,0.5625],
          [0.5,0.625],
          [0.002,0.625],
          [0.002,0.6875],
          [0.5,0.6875],
          [0.5,0.75],
          [0.002,0.75],
          [0.002,0.8125],
          [0.5,0.8125],
          [0.5,0.875],
          [0.002,0.875],
          [0.002,0.9375],
        ]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.8,0],[0.3,1,"easeOutCubic"]]
      },
    ],
  }
});
customEvents.push({
  b: 220.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.5,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.8,0.125],
          [0.3,0.125],
          [0.3,0.25],
          [0.8,0.25],
          [0.8,0.375],
          [0.3,0.375],
          [0.3,0.4375],
          [0.8,0.4375],
          [0.8,0.5],
          [0.3,0.5],
          [0.3,0.5625],
          [0.8,0.5625],
          [0.8,0.625],
          [0.3,0.625],
          [0.3,0.6875],
          [0.8,0.6875],
          [0.8,0.75],
          [0.3,0.75],
          [0.3,0.8125],
          [0.8,0.8125],
          [0.8,0.875],
          [0.3,0.875],
          [0.3,0.9375],
          [0.8,0.9375],
          [0.005,1]
        ]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.5,0.125],
          [0.002,0.125],
          [0.002,0.25],
          [0.5,0.25],
          [0.5,0.375],
          [0.002,0.375],
          [0.002,0.4375],
          [0.5,0.4375],
          [0.5,0.5],
          [0.002,0.5],
          [0.002,0.5625],
          [0.5,0.5625],
          [0.5,0.625],
          [0.002,0.625],
          [0.002,0.6875],
          [0.5,0.6875],
          [0.5,0.75],
          [0.002,0.75],
          [0.002,0.8125],
          [0.5,0.8125],
          [0.5,0.875],
          [0.002,0.875],
          [0.002,0.9375],
        ]
      },
    ],
  }
});
customEvents.push({
  b: 218.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 0.75,
    properties: [

      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0],[0.3,1,"easeInCirc"]]
      }
    ]
  }
});
customEvents.push({
  b: 219.25, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 1.25,
    properties: [

      {
        id: "_TopOffset",
        type: "Float",
        value: [[0.3,0],[0,0.99,"easeInCirc"]]
      }
    ]
  }
});
customEvents.push({
  b: 220.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 0.5,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0],[-0.3,0.75,"easeOutCubic"],[0,1,"easeInCubic"]]
      }
    ]
  }
});
customEvents.push({
  b: 221.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 0.5,
    properties: [
      {
        id: "_RightOffset",
        type: "Float",
        value: [[0,0],[-0.2,0.5,"easeOutCubic"],[0,1,"easeInCubic"]]
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0]]
      }
    ]
  }
});
customEvents.push({
  b: 222, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 0.5,
    properties: [
      {
        id: "_LeftOffset",
        type: "Float",
        value: [[0,0],[0.2,0.5,"easeOutCubic"],[0,1,"easeInCubic"]]
      }
    ]
  }
});

function tweakin(beat,amount,ease){
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/split.mat",
      duration: 1,
      properties: [
        {
          id: "_BottomOffset",
          type: "Float",
          value: [[amount*-2,0],[0,1,ease]]
        },
      ]
    }
  });
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/split.mat",
      duration: 1,
      properties: [
        {
          id: "_TopOffset",
          type: "Float",
          value: [[amount*2,0],[0,1,ease]]
        },
      ]
    }
  });
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/split.mat",
      duration: 1,
      properties: [
        {
          id: "_RightOffset",
          type: "Float",
          value: [[amount*-1,0],[0,1,ease]]
        },
      ]
    }
  });
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/split.mat",
      duration: 1,
      properties: [
        {
          id: "_LeftOffset",
          type: "Float",
          value: [[amount*1,0],[0,1,ease]]
        },
      ]
    }
  });
  
}
function tweakin2(beat,amount,ease,duration,sideortop,thealter){
  if (thealter == 1){
    if (sideortop == 0){
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_RightOffset",
              type: "Float",
              value: [[amount*-1,0],[0,1,ease]]
            }
          ]
        }
      });
    } else {
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_BottomOffset",
              type: "Float",
              value: [[amount*-1,0],[0,1,ease]]
            },
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[0,0]]
            },
            {
              id: "_RightOffset",
              type: "Float",
              value: [[0,0]]
            },
          ]
        }
      });
    }
  } else {
    if (sideortop == 0){
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[amount,0],[0,1,ease]]
            }
          ]
        }
      });
    } else {
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_TopOffset",
              type: "Float",
              value: [[amount,0],[0,1,ease]]
            },
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[0,0]]
            },
            {
              id: "_RightOffset",
              type: "Float",
              value: [[0,0]]
            },
          ]
        }
      });
    }
  }
}
var alternatedeez = true;


bombs.filter(note => note.b >= 224 && note.b <= 252).forEach(note => {
  note.customData.uninteractable = true;
  note.customData.animation = {};
  note.customData.animation.offsetPosition = [[0, -6969, -6969, 0]];
  note.customData.animation.scale = [[0, 0, 0, 0]];
  note.customData.animation.dissolve = [[0, 0]];
  var value = alternatedeez ? 0.008 : -0.008;
  tweakin(note.b,value,"easeOutQuart")
  alternatedeez = !alternatedeez;
});


let alternatedeeznut = true;
const filteredWalls4 = fakefilterWalls(224, 253);

for (const note of filteredWalls4) {
  const value = alternatedeeznut ? 1 : -1;
  const isSpecialBeat = [239, 240, 251.25, 252].includes(note.b);
  tweakin2(note.b, isSpecialBeat ? 0.2 : 0.3, isSpecialBeat ? "easeOutCubic" : "easeOutQuart", note.d, isSpecialBeat ? 0 : 1, value);

  alternatedeeznut = !alternatedeeznut;
  
  if (!isSpecialBeat) {
  
  }
}



customEvents.push({
  b: 252, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 1,
    properties: [
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: [[200,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 257, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 1,
    properties: [
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: 200
      },
    ]
  }
});
customEvents.push({
  b: 253,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 4,
    position: [[0,0,0,0],[0.72,0,-3.6,0.5,"easeOutQuart"],[0,0,0,1,"easeInCirc"]],
    localRotation: [[0,0,0,0],[0,0,25,0.5,"easeOutQuart"],[0,0,0,1,"easeInCirc"]]
  }
});  
customEvents.push({
  b: 257, 
  t: "Blit",
  d: {
    asset: "assets/shaders/moreglitch.mat",
    duration: 32,
    properties: [
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: 200
      },
      {
        id: "_Resolution",
        type: "Float",
        value: 20000
      },
    ]
  }
});

function lesstweakin(beat,amount,ease,version){
  if (version == 1) {
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: 1,
        properties: [
          {
            id: "_BottomOffset",
            type: "Float",
            value: [[amount*-2,0],[0,1,ease]]
          },
          {
            id: "_TopOffset",
            type: "Float",
            value: [[amount*2,0],[0,1,ease]]
          },
          {
            id: "_RightOffset",
            type: "Float",
            value: [[amount*-1,0],[0,1,ease]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[amount*1,0],[0,1,ease]]
          },
        ]
      }
    });

  } else if (version == 2) {
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: 1,
        properties: [
          {
            id: "_GapSizeX",
            type: "Float",
            value: 0
          },
          {
            id: "_RightOffset",
            type: "Float",
            value: [[amount*-3,0],[0,1,ease]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[amount*3,0],[0,1,ease]]
          },
        ]
      }
    });
  } else if (version == 3){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: 1,
        properties: [
          {
            id: "_BottomOffset",
            type: "Float",
            value: [[amount*-3,0],[0,1,ease]]
          },
          {
            id: "_TopOffset",
            type: "Float",
            value: [[amount*3,0],[0,1,ease]]
          },
          {
            id: "_RightOffset",
            type: "Float",
            value: [[amount*-1,0],[0,1,ease]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[amount*1,0],[0,1,ease]]
          },
        ]
      }
    });
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/vhs.mat",
        duration: 1,
        properties: [
          {
            id: "_Pixelate",
            type: "Float",
            value: [[1,0],[0.2,1,ease]]
          },
        ]
      }
    });
  }
}

function lesstweakin2(beat,amount,ease,duration,version,alter){
  if (version == 1){
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_TopOffset",
              type: "Float",
              value: [[amount*1,0],[0,1,ease]]
            },
            {
              id: "_BottomOffset",
              type: "Float",
              value: [[amount*-1,0],[0,1,ease]]
            }
          ]
        }
      });
  } else if (version == 2){
    if (alter == 0){
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[amount*1,0],[0,1,ease]]
            },
          ]
        }
      });
    } else {
      customEvents.push({
        b: beat, 
        t: "Blit",
        d: {
          asset: "assets/shaders/sepscreen.mat",
          duration: duration,
          properties: [
            {
              id: "_RightOffset",
              type: "Float",
              value: [[amount*-1,0],[0,1,ease]]
            },
          ]
        }
      });
    }

  }
}
let die = true;
const filteredWalls2 = fakefilterWalls(257, 289);
for (const note of filteredWalls2) {
  const value = die ? 0.08 : -0.08;
  if (note.h >= 1 && note.h <= 3) {
    const easing = note.h === 3 ? "easeOutCubic" : "easeOutQuart";
    lesstweakin(note.b, value, easing, note.h);
    die = !die;
  }

}


let die2 = true;
const filteredWalls3 = fakefilterWalls(257, 289);

for (const note of filteredWalls3) {
  if (note.h === 4 || note.h === 5) {
    const value = die2 ? 0 : 1;
    lesstweakin2(note.b, 0.4, "easeOutQuart", note.d, note.h - 3, value);
    die2 = !die2;
  }

}



customEvents.push({
  b: 266, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.5,0.125],
          [0.002,0.125],
          [0.002,0.25],
          [0.5,0.25],
          [0.5,0.375],
          [0.002,0.375],
          [0.002,0.4375],
          [0.5,0.4375],
          [0.5,0.5],
          [0.002,0.5],
          [0.002,0.5625],
          [0.5,0.5625],
          [0.5,0.625],
          [0.002,0.625],
          [0.002,0.6875],
          [0.5,0.6875],
          [0.5,0.75],
          [0.002,0.75],
          [0.002,0.8125],
          [0.5,0.8125],
          [0.5,0.875],
          [0.002,0.875],
          [0.002,0.9375],
        ]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [[0.8,0],[0.2,1,"easeOutCubic"]]
      },
    ],
  }
});
customEvents.push({
  b: 282, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.9,0.125],
          [0.3,0.125],
          [0.3,0.25],
          [0.9,0.25],
          [0.9,0.375],
          [0.3,0.375],
          [0.3,0.4375],
          [0.9,0.4375],
          [0.9,0.5],
          [0.3,0.5],
          [0.3,0.5625],
          [0.9,0.5625],
          [0.9,0.625],
          [0.3,0.625],
          [0.3,0.6875],
          [0.9,0.6875],
          [0.9,0.75],
          [0.3,0.75],
          [0.3,0.8125],
          [0.9,0.8125],
          [0.9,0.875],
          [0.3,0.875],
          [0.3,0.9375],
          [0.9,0.9375],
          [0.2,1]
        ]
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.5,0.125],
          [0.002,0.125],
          [0.002,0.25],
          [0.5,0.25],
          [0.5,0.375],
          [0.002,0.375],
          [0.002,0.4375],
          [0.5,0.4375],
          [0.5,0.5],
          [0.002,0.5],
          [0.002,0.5625],
          [0.5,0.5625],
          [0.5,0.625],
          [0.002,0.625],
          [0.002,0.6875],
          [0.5,0.6875],
          [0.5,0.75],
          [0.002,0.75],
          [0.002,0.8125],
          [0.5,0.8125],
          [0.5,0.875],
          [0.002,0.875],
          [0.002,0.9375],
        ]
      },
    ],
  }
});
function melo(beat){
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/bloom.mat",
      duration: 5,
      properties: [
        {
          id: "_BloomIntensity",
          type: "Float",
          value: [[1,0],[3,1/5,"easeInCirc"],[3,4/5],[1,1,"easeOutQuad"]]
        },
        {
          id: "_BloomThreshold",
          type: "Float",
          value: [[0,0],[0.17,1/5,"easeInCirc"],[0.17,4/5],[0,1,"easeOutQuad"]]
        },
      ]
    }
  });
}
melo(260)
melo(268)
melo(276)
customEvents.push({
  b: 259.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.5,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.01,0],[0.002,1,"easeOutCubic"]
        ]
      },
    ],
  }
});
customEvents.push({
  b: 273.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 0.25,
    properties: [
      {
        id: "_RightOffset",
        type: "Float",
        value: [[-0.2,0,"easeOutCubic"],[0,1,"easeInCubic"]]
      }
    ]
  }
});
customEvents.push({
  b: 273.75, 
  t: "Blit",
  d: {
    asset: "assets/shaders/sepscreen.mat",
    duration: 0.25,
    properties: [
      {
        id: "_LeftOffset",
        type: "Float",
        value: [[0.2,0,"easeOutCubic"],[0,1,"easeInCubic"]]
      }
    ]
  }
});

customEvents.push({
  b: 274, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 0.5,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: [
          [0.35,0.125],
          [0,0.125],
          [0,0.25],
          [-0.35,0.25],
          [-0.35,0.375],
          [0,0.375],
          [0,0.4375],
          [0.35,0.4375],
          [0.35,0.5],
          [0,0.5],
          [0,0.5625],
          [-0.35,0.5625],
          [-0.35,0.625],
          [0,0.625],
          [0,0.6875],
          [0.35,0.6875],
          [0.35,0.75],
          [0,0.75],
          [0,0.8125],
          [-0.35,0.8125],
          [-0.35,0.875],
          [0,0.875],
          [0,0.9375],
        ]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [
          [-0.35,0.125],
          [0,0.125],
          [0,0.25],
          [0.35,0.25],
          [0.35,0.375],
          [0,0.375],
          [0,0.4375],
          [-0.35,0.4375],
          [-0.35,0.5],
          [0,0.5],
          [0,0.5625],
          [0.35,0.5625],
          [0.35,0.625],
          [0,0.625],
          [0,0.6875],
          [-0.35,0.6875],
          [-0.35,0.75],
          [0,0.75],
          [0,0.8125],
          [0.35,0.8125],
          [0.35,0.875],
          [0,0.875],
          [0,0.9375],
        ]
      },

      {
        id: "_RightOffset",
        type: "Float",
        value: [
          [-0.35,0.125],
          [0,0.125],
          [0,0.25],
          [0.35,0.25],
          [0.35,0.375],
          [0,0.375],
          [0,0.4375],
          [-0.35,0.4375],
          [-0.35,0.5],
          [0,0.5],
          [0,0.5625],
          [0.35,0.5625],
          [0.35,0.625],
          [0,0.625],
          [0,0.6875],
          [-0.35,0.6875],
          [-0.35,0.75],
          [0,0.75],
          [0,0.8125],
          [0.35,0.8125],
          [0.35,0.875],
          [0,0.875],
          [0,0.9375],
        ]
      },
      {
        id: "_LeftOffset",
        type: "Float",
        value: [
          [0.35,0.125],
          [0,0.125],
          [0,0.25],
          [-0.35,0.25],
          [-0.35,0.375],
          [0,0.375],
          [0,0.4375],
          [0.35,0.4375],
          [0.35,0.5],
          [0,0.5],
          [0,0.5625],
          [-0.35,0.5625],
          [-0.35,0.625],
          [0,0.625],
          [0,0.6875],
          [0.35,0.6875],
          [0.35,0.75],
          [0,0.75],
          [0,0.8125],
          [-0.35,0.8125],
          [-0.35,0.875],
          [0,0.875],
          [0,0.9375],
        ]
      },
    ]
  }
});
customEvents.push({
  b: 275, 
  t: "Blit",
  d: {
    asset: "assets/shaders/bloom.mat",
    duration: 0.5,
    properties: [
      {
        id: "_BloomIntensity",
        type: "Float",
        value: [[20,0],[1,1,"easeOutCubic"]]
      },
      {
        id: "_BloomThreshold",
        type: "Float",
        value: [[0.12,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});
function thatonesound(beat){
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/vhs.mat",
      duration: 0.75,
      properties: [
        {
          id: "_Pixelate",
          type: "Float",
          value: [
            [0.9, 0.125],
            [0.3, 0.125],
            [0.9, 0.1875],
            [0.3, 0.1875],
            [0.9, 0.25],
            [0.3, 0.25],
            [0.9, 0.3125],
            [0.3, 0.3125],
            [0.9, 0.375],
            [0.3, 0.375],
            [0.9, 0.4375],
            [0.3, 0.4375],
            [0.9, 0.5],
            [0.3, 0.5],
            [0.9, 0.5625],
            [0.3, 0.5625],
            [0.9, 0.625],
            [0.3, 0.625],
            [0.9, 0.6875],
            [0.3, 0.6875],
            [0.9, 0.75],
            [0.3, 0.75],
            [0.9, 0.8125],
            [0.3, 0.8125],
            [0.9, 0.875],
            [0.3, 0.875],
            [0.9, 0.9375],
            [0.2, 1]            
          ]
        },
      ],
    }
  });
}
thatonesound(260)
thatonesound(276)

customEvents.push({
  b: 268, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.75,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.9,0.125],
          [0.3,0.125],
          [0.3,0.25],
          [0.9,0.25],
          [0.9,0.375],
          [0.3,0.375],
          [0.3,0.5],
          [0.9,0.5],
          [0.9,0.625],
          [0.3,0.625],
          [0.3,0.875],
          [0.9,0.875],
          [0.2,1],
        ]
      },
    ],
  }
});
customEvents.push({
  b: 284, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.75,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.9,0.125],
          [0.3,0.125],
          [0.3,0.25],
          [0.9,0.25],
          [0.9,0.375],
          [0.3,0.375],
          [0.3,0.5],
          [0.9,0.5],
          [0.9,0.625],
          [0.3,0.625],
          [0.3,0.875],
          [0.9,0.875],
          [0.2,1],
        ]
      },
    ],
  }
});
customEvents.push({
  b: 285,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 3,
    position: [[0,0,0,0],[0.72,0,-4,1,"easeOutSine"]],
    localRotation: [[0,0,0,0],[0,0,25,1,"easeOutSine"]]
  }
});   
customEvents.push({
  b: 288,
  t: "AnimateTrack",
  d: {
    track: "gimmehead",
    duration: 1,
    position: [[0.72,0,-4,0],[0,0,0,1,"easeInCubic"]],
    localRotation: [[0,0,25,0],[0,0,0,1,"easeInCubic"]]
  }
}); 
customEvents.push({
  b: 285, 
  t: "Blit",
  d: {
    asset: "assets/shaders/moreglitch.mat",
    duration: 2,
    properties: [
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: [[200,0],[0,1,"easeOutQuad"]]
      }
    ]
  }
});
customEvents.push({
  b: 285, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 2,
    properties: [
      {
        id: "_GlitchMultiplier",
        type: "Float",
        value: [[200,0],[0,1,"easeOutQuad"]]
      }
    ]
  }
});
// that was the most of all time
customEvents.push({
  b: 289, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 325.167-289,
  }
});
customEvents.push({
  b: 289, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/vhs.mat",
    properties: [
      {
        id: "_Noise",
        type: "Float",
        value: 0
      },
      {
        id: "_Limit",
        type: "Float",
        value: 0
      },
      {
        id: "_Scanline",
        type: "Float",
        value: 0.3
      },
      {
        id: "_Gap",
        type: "Float",
        value: 3
      },
      {
        id: "_Mute",
        type: "Float",
        value: 0.05
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: 0.4
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.005
      },
    ],
  }
});
customEvents.push({
  b: 289, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 26,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0,1],[0,1,"easeInCirc"]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: [[-1,1],[0,1,"easeInCirc"]]
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0.5,1],[0,1,"easeInCirc"]]
      },

    ]
  }
});
customEvents.push({
  b: 149,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessL",
    duration: 26,
    color: [[0.6,0.6,0.6,1,1],["baseNote0Color",1]]
  }
});   
customEvents.push({
  b: 149,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessR",
    duration: 26,
    color: [[1,1,1,1,1],["baseNote1Color",1]]
  }
});   








customEvents.push({
  b: 303, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 12,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0,0],[0,1]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: [[-1,0],[0,1]]
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0.2,0],[0,1]]
      },

    ]
  }
});
customEvents.push({
  b: 303,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessL",
    duration: 12,
    color: [[0.6,0.6,0.6,1,0],["baseNote0Color",1]]
  }
});   
customEvents.push({
  b: 303,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessR",
    duration: 12,
    color: [[1,1,1,1,0],["baseNote1Color",1]]
  }
});   













blackwhite(315.167,324.5-315.167)
blackwhite(324.833,325.167-324.833)
customEvents.push({
  b: 217, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 289-217,
  }
});

customEvents.push({
  b: 315.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 10,
    properties: [
      {
        id: "_Bars2",
        type: "Float",
        value: [
          [0,1/10],[0.3,2/10,"easeOutCubic"]
        ]
      },
      {
        id: "_Noise",
        type: "Float",
        value: 0
      },
      {
        id: "_Limit",
        type: "Float",
        value: 0
      },
      {
        id: "_Scanline",
        type: "Float",
        value: 0.3
      },
      {
        id: "_Gap",
        type: "Float",
        value: 3
      },
      {
        id: "_Mute",
        type: "Float",
        value: 0.05
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: 0.4
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.005
      },
    ],
  }
});
customEvents.push({
  b: 324.5, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.5+.167,
    properties: [
      {
        id: "_Bars2",
        type: "Float",
        value: [
          [0.5,0.5],
          [0.3,0.5],
          [0.3,0.96],
          [0.5,0.96],
        ]
      }
    ],
  }
});
customEvents.push({
  b: 325.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 1.833,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0],[0.2,0.5/1.833,"easeOutBack"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0],[-0.2,0.5/1.833,"easeOutBack"]]
      },
    ]
  }
});
customEvents.push({
  b: 327, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 0.667,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0.2,0],[0,1,"easeInCirc"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0.2,0],[0,1,"easeInCirc"]]
      },
    ]
  }
});



customEvents.push({
  b: 378, 
  t: "Blit",
  d: {
    asset: "assets/shaders/glitchy.mat",
    duration: 6,
    properties: [
        {
          id: "_Resolution",
          type: "Float",
          value: 20000
        },
        {
          id: "_GlitchMultiplier",
          type: "Float",
          value: 200
        },
    ]
  }
});
function day(beat,amount,duration,ease,version){
  if (version == 1){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: duration,
        properties: [
          {
            id: "_RightOffset",
            type: "Float",
            value: [[amount*-1,0],[0,1,ease]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[amount*1,0],[0,1,ease]]
          },
          {
            id: "_BottomOffset",
            type: "Float",
            value: [[0,0]]
          },
          {
            id: "_TopOffset",
            type: "Float",
            value: [[0,0]]
          },
        ]
      }
    });
  } else {
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: duration,
        properties: [
          {
            id: "_BottomOffset",
            type: "Float",
            value: [[amount*1,0],[0,1,ease]]
          },
          {
            id: "_TopOffset",
            type: "Float",
            value: [[amount*-1,0],[0,1,ease]]
          },
          {
            id: "_RightOffset",
            type: "Float",
            value: [[0,0]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[0,0]]
          },
        ]
      }
    });
  }

}
function cum(beat,amount,duration,ease,leftorright){
  if (leftorright == 1){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/sepscreen.mat",
        duration: duration,
        properties: [
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[amount*1,0],[0,1,ease]]
          },
        ]
      }
    });
  } else {
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/sepscreen.mat",
        duration: duration,
        properties: [
          {
            id: "_RightOffset",
            type: "Float",
            value: [[amount*-1,0],[0,1,ease]]
          }
        ]
      }
    });
  }

}

let meow = true;
const filteredWalls5 = fakefilterWalls(326, 356); 

for (const note of filteredWalls5) {
  const value = meow ? 0.4 : -0.4;
  if (note.h === 4 || note.h === 5) {
    day(note.b, value, note.d+0.5, "easeOutElastic", note.h === 5 ? 1 : 2);
    meow = !meow;
  }

  if (note.h === 1 || note.h === 2) {
    cum(note.b, 0.3, note.d, "easeOutCubic", note.h);
  }

  if (note.h >= 6 && note.h <= 8) {
    fuckingspam(note.b, note.d, note.h - 5);
  }
  if (note.h === 69){
    EEERRR (note.b,note.d)
  }
}
customEvents.push({
  b: 325.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 365.167-325.167,
    properties: [
      {
        id: "_Noise",
        type: "Float",
        value: 0
      },
      {
        id: "_Limit",
        type: "Float",
        value: 0
      },
      {
        id: "_Scanline",
        type: "Float",
        value: 0.3
      },
      {
        id: "_Gap",
        type: "Float",
        value: 3
      },
      {
        id: "_Mute",
        type: "Float",
        value: 0.05
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: 0.4
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.005
      },
    ]
  }
});

customEvents.push({
  b: 325.167, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 1.333,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.9, 0.125],
          [0.3, 0.125],
          [0.9, 0.1875],
          [0.3, 0.1875],
          [0.9, 0.25],
          [0.3, 0.25],
          [0.9, 0.3125],
          [0.3, 0.3125],
          [0.9, 0.375],
          [0.3, 0.375],
          [0.9, 0.4375],
          [0.3, 0.4375],
          [0.9, 0.5],
          [0.3, 0.5],
          [0.9, 0.5625],
          [0.3, 0.5625],
          [0.9, 0.625],
          [0.3, 0.625],
          [0.9, 0.6875],
          [0.3, 0.6875],
          [0.9, 0.75],
          [0.3, 0.75],
          [0.9, 0.8125],
          [0.3, 0.8125],
          [0.9, 0.875],
          [0.3, 0.875],
          [0.9, 0.9375],
          [0.2, 1]            
        ]
      },
    ],
  }
});
customEvents.push({
  b: 326.5, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.5,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.5,0.125],
          [0.002,0.125],
          [0.002,0.25],
          [0.5,0.25],
          [0.5,0.375],
          [0.002,0.375],
          [0.002,0.4375],
          [0.5,0.4375],
          [0.5,0.5],
          [0.002,0.5],
          [0.002,0.5625],
          [0.5,0.5625],
          [0.5,0.625],
          [0.002,0.625],
          [0.002,0.6875],
          [0.5,0.6875],
          [0.5,0.75],
          [0.002,0.75],
          [0.002,0.8125],
          [0.5,0.8125],
          [0.5,0.875],
          [0.002,0.875],
          [0.002,0.9375],
        ]
      },
    ],
  }
});
customEvents.push({
  b: 327, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0.5,
    properties: [
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: [
          [0.5,0.125],
          [0.002,0.125],
          [0.002,0.25],
          [0.5,0.25],
          [0.5,0.375],
          [0.002,0.375],
          [0.002,0.4375],
          [0.5,0.4375],
          [0.5,0.5],
          [0.002,0.5],
          [0.002,0.5625],
          [0.5,0.5625],
          [0.5,0.625],
          [0.002,0.625],
          [0.002,0.6875],
          [0.5,0.6875],
          [0.5,0.75],
          [0.002,0.75],
          [0.002,0.8125],
          [0.5,0.8125],
          [0.5,0.875],
          [0.002,0.875],
          [0.002,0.9375],
        ]
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.9, 0.125],
          [0.3, 0.125],
          [0.9, 0.1875],
          [0.3, 0.1875],
          [0.9, 0.25],
          [0.3, 0.25],
          [0.9, 0.3125],
          [0.3, 0.3125],
          [0.9, 0.375],
          [0.3, 0.375],
          [0.9, 0.4375],
          [0.3, 0.4375],
          [0.9, 0.5],
          [0.3, 0.5],
          [0.9, 0.5625],
          [0.3, 0.5625],
          [0.9, 0.625],
          [0.3, 0.625],
          [0.9, 0.6875],
          [0.3, 0.6875],
          [0.9, 0.75],
          [0.3, 0.75],
          [0.9, 0.8125],
          [0.3, 0.8125],
          [0.9, 0.875],
          [0.3, 0.875],
          [0.9, 0.9375],
          [0.2, 1]            
        ]
      },
    ],
  }
});

function fuckingspam (beat,duration,type){
  if (type == 1){
    customEvents.push({
      b: beat, 
      t: "SetMaterialProperty",
      d: {
        asset: "assets/shaders/vhs.mat",
        duration: duration,
        properties: [
          {
            id: "_Pixelate",
            type: "Float",
            value: [
              [0.9, 0.125],
              [0.3, 0.125],
              [0.9, 0.1875],
              [0.3, 0.1875],
              [0.9, 0.25],
              [0.3, 0.25],
              [0.9, 0.3125],
              [0.3, 0.3125],
              [0.9, 0.375],
              [0.3, 0.375],
              [0.9, 0.4375],
              [0.3, 0.4375],
              [0.9, 0.5],
              [0.3, 0.5],
              [0.9, 0.5625],
              [0.3, 0.5625],
              [0.9, 0.625],
              [0.3, 0.625],
              [0.9, 0.6875],
              [0.3, 0.6875],
              [0.9, 0.75],
              [0.3, 0.75],
              [0.9, 0.8125],
              [0.3, 0.8125],
              [0.9, 0.875],
              [0.3, 0.875],
              [0.9, 0.9375]            
            ]
          },
        ],
      }
    });
    customEvents.push({
      b: beat+duration, 
      t: "SetMaterialProperty",
      d: {
        asset: "assets/shaders/vhs.mat",
        duration: 0,
        properties: [
          {
            id: "_Pixelate",
            type: "Float",
            value: [
              [0.2, 0],         
            ]
          },
        ],
      }
    });
  }
  if (type == 2){
    customEvents.push({
      b: beat, 
      t: "SetMaterialProperty",
      d: {
        asset: "assets/shaders/vhs.mat",
        duration: duration,
        properties: [
          {
            id: "_ChromaticAberration",
            type: "Float",
            value: [
              [0.5,0.125],
              [0.002,0.125],
              [0.002,0.25],
              [0.5,0.25],
              [0.5,0.375],
              [0.002,0.375],
              [0.002,0.4375],
              [0.5,0.4375],
              [0.5,0.5],
              [0.002,0.5],
              [0.002,0.5625],
              [0.5,0.5625],
              [0.5,0.625],
              [0.002,0.625],
              [0.002,0.6875],
              [0.5,0.6875],
              [0.5,0.75],
              [0.002,0.75],
              [0.002,0.8125],
              [0.5,0.8125],
              [0.5,0.875],
              [0.002,0.875],
              [0.002,0.9375],
            ]
          },
        ],
      }
    });
  }
  if (type == 3){
    customEvents.push({
      b: beat, 
      t: "SetMaterialProperty",
      d: {
        asset: "assets/shaders/vhs.mat",
        duration: duration,
        properties: [
          {
            id: "_ChromaticAberration",
            type: "Float",
            value: [
              [0.5,0.125],
              [0.002,0.125],
              [0.002,0.25],
              [0.5,0.25],
              [0.5,0.375],
              [0.002,0.375],
              [0.002,0.4375],
              [0.5,0.4375],
              [0.5,0.5],
              [0.002,0.5],
              [0.002,0.5625],
              [0.5,0.5625],
              [0.5,0.625],
              [0.002,0.625],
              [0.002,0.6875],
              [0.5,0.6875],
              [0.5,0.75],
              [0.002,0.75],
              [0.002,0.8125],
              [0.5,0.8125],
              [0.5,0.875],
              [0.002,0.875],
              [0.002,0.9375],
            ]
          },
          {
            id: "_Pixelate",
            type: "Float",
            value: [
              [0.9, 0.125],
              [0.3, 0.125],
              [0.9, 0.1875],
              [0.3, 0.1875],
              [0.9, 0.25],
              [0.3, 0.25],
              [0.9, 0.3125],
              [0.3, 0.3125],
              [0.9, 0.375],
              [0.3, 0.375],
              [0.9, 0.4375],
              [0.3, 0.4375],
              [0.9, 0.5],
              [0.3, 0.5],
              [0.9, 0.5625],
              [0.3, 0.5625],
              [0.9, 0.625],
              [0.3, 0.625],
              [0.9, 0.6875],
              [0.3, 0.6875],
              [0.9, 0.75],
              [0.3, 0.75],
              [0.9, 0.8125],
              [0.3, 0.8125],
              [0.9, 0.875],
              [0.3, 0.875],
              [0.9, 0.9375],
              [0.2, 1]            
            ]
          },
        ],
      }
    });
  }
}
customEvents.push({
  b: 345.167, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 0,
    properties: [
      {
        id: "_Pixelate",
        type: "Float",
        value: [
          [0.2, 0]            
        ]
      },
    ],
  }
});


customEvents.push({
  b: 355.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 5,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0,1],[0,1,"easeInCirc"]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: [[-1,1],[0,1,"easeInCirc"]]
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0.5,1],[0,1,"easeInCirc"]]
      },

    ]
  }
});
customEvents.push({
  b: 355.167,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessL",
    duration: 5,
    color: [[0.6,0.6,0.6,1,1],["baseNote0Color",1]]
  }
});   
customEvents.push({
  b: 355.167,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessR",
    duration: 5,
    color: [[1,1,1,1,1],["baseNote1Color",1]]
  }
});   








customEvents.push({
  b: 360.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 5,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0,0],[0,1]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: [[-1,0],[0,1]]
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0.2,0],[0,1]]
      },

    ]
  }
});
customEvents.push({
  b: 360.167,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessL",
    duration: 5,
    color: [[0.6,0.6,0.6,1,0],["baseNote0Color",1]]
  }
});   
customEvents.push({
  b: 360.167,
  t: "AnimateTrack",
  d: {
    track: "blackwhitessR",
    duration: 5,
    color: [[1,1,1,1,0],["baseNote1Color",1]]
  }
});   
customEvents.push({
  b: 365.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/vhs.mat",
    duration: 6969,
    properties: [
      {
        id: "_Bars2",
        type: "Float",
        value: [
          [-0.1,0],[0.34,1.5/6969,"easeInOutQuart"]
        ]
      },
      {
        id: "_Noise",
        type: "Float",
        value: 0
      },
      {
        id: "_Limit",
        type: "Float",
        value: 0
      },
      {
        id: "_Scanline",
        type: "Float",
        value: 0.3
      },
      {
        id: "_Gap",
        type: "Float",
        value: 3
      },
      {
        id: "_Mute",
        type: "Float",
        value: 0.05
      },
      {
        id: "_Pixelate",
        type: "Float",
        value: 0.4
      },
      {
        id: "_ChromaticAberration",
        type: "Float",
        value: 0.005
      },

    ],
  }
});

customEvents.push({
  b: 0, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/mirr.prefab",
    track: "mirrorthing",
  }
});
customEvents.push({
  b: 0,
  t: "AnimateTrack",
  d: {
    track: "mirrorthing",
    scale: [0,0,0]
  }
});  
customEvents.push({
  b: 71,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: "mirrorthing",
    scale: [[0,0,0,0],[6969,6969,6969,1,"easeOutExpo"]]
  }
});  
customEvents.push({
  b: 71, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/dontbreakplease.mat", 
    duration: 2, 
    properties: [{
      id: "_DuplicationAmount",
      type: "Float", 
      value: [5]
    }]
  }
});
customEvents.push({
  b: 73, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/dontbreakplease.mat", 
    duration: 12, 
    properties: [{
      id: "_DuplicationAmount",
      type: "Float", 
      value: [[5,0],[10,1,"easeInQuart"]]
    }]
  }
});
customEvents.push({
  b: 85, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/dontbreakplease.mat", 
    duration: 2, 
    properties: [{
      id: "_DuplicationAmount",
      type: "Float", 
      value: [[10,0],[400,1,"easeInOutCubic"]]
    }]
  }
});

customEvents.push({
  b: 90,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: "mirrorthing",
    scale: [[6969,6969,6969,0]]
  }
});  

// I love working out of order

customEvents.push({
  b: 89,
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/camerayeah.prefab",
    track: "camera",
    id: "ccamamamaa",
    scale: [0,0,0]
  }
});
customEvents.push({
  b: 89,
  t: "AnimateTrack",
  d: {
    track: "camera",
    duration: 153-89,
    rotation: ["baseHeadRotation"],
    position: ["baseHeadPosition"],
  }
});
customEvents.push({
  b: 153,
  t: "DestroyObject",
  d: {
    id: "ccamamamaa",

  }
});
for (var i =1; i<=8; i+=1) {
  customEvents.push({
    b: 89,
    t: "InstantiatePrefab",
    d: {
      asset: "assets/assetbundles/mirrorthing.prefab",
      id: "uh2"+i,
      track: "mirror"+i,
      position: [0,1,8],
      scale: [0,0,0],
      rotation: [0,0,180]
    }
  });
  customEvents.push({
    b: 153, 
    t: "DestroyObject",
    d: {
      id: "uh2"+i,
    }
  });
}




for (var i = 1; i <= 4; i += 1) {  
  const rany1 = 12 - ((i - 1) * 4) + random(-0.25, 0.25, 0.01)-4
  const ranz1 = random(7, 9, 0.01)
  var what = (i % 2 === 0) ? -3 : -6;  
  var what2 = (i % 2 === 0) ? -6 : -3;  
  customEvents.push({  
    b: 89,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror" + i,  
      duration: 1,  
      easing: "easeOutQuad",  
      position: [[0, 4, 8, 0], [what, rany1, ranz1, 1, "easeOutCubic"]],  
      scale: [2, 3, 1],  
      rotation: [[random(-15, 15), random(-20, 20), 90 + random(-17, 17)+180, 0], [random(-15, 15), random(-15, -30), 90 + random(-17, 17)+180, 1, "easeOutCubic"]],
    }  
  });   
  customEvents.push({  
    b: 90,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 12,  
      position: [[what,rany1,ranz1,0],[what,rany1-12,ranz1,1]],
      repeat: 696969
    }  
  });       
  customEvents.push({  
    b: 90+12,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 28,  
      position: [[what,rany1+20,ranz1,0],[what,rany1-28+20,ranz1,1]],
    }  
  });   
  customEvents.push({  
    b: 90+12+28,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 28,  
      position: [[what2,rany1+20,ranz1,0],[what2,rany1-28+20,ranz1,1]],
      repeat: 696969
    }  
  });   
  customEvents.push({  
    b: 90+12+56,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 28,  
      position: [[what,rany1+20,ranz1,0],[what,rany1-28+20,ranz1,1]],
    }  
  });  
}


for (var i = 5; i <= 8; i += 1) {  
  var what = (i % 2 === 0) ? 6 : 3;  
  var what2 = (i % 2 === 0) ? 3 : 6;  
  const rany2 = 12-((i-4)*4)+random(-0.25,0.25,0.01)
  const ranz2 = random(7, 9, 0.01)

  customEvents.push({  
    b: 89,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror" + i,  
      duration: 1,  
      easing: "easeOutQuad",  
      position: [[0,4,8,0],[what,rany2,ranz2,1,"easeOutCubic"]],  
      scale: [2,3,1],  
      rotation: [[random(-15,15),random(-20,20),90+ random(-17, 17)+180,0],[random(-15,15),random(15,30),90 + random(-17, 17)+180,1,"easeOutCubic"]]  ,
    }  
  });  
  customEvents.push({  
    b: 90,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 12,  
      position: [[what,rany2,ranz2,0],[what,rany2-12,ranz2,1]],
      repeat: 696969
    }  
  });    
  customEvents.push({  
    b: 90+12,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 28,  
      position: [[what,rany2+20,ranz2,0],[what,rany2-28+20,ranz2,1]],
    }  
  });   
  customEvents.push({  
    b: 90+12+28,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 28,  
      position: [[what2,rany2+20,ranz2,0],[what2,rany2-28+20,ranz2,1]],
      repeat: 696969
    }  
  });   
  customEvents.push({  
    b: 90+12+56,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror"+i,  
      duration: 28,  
      position: [[what,rany2+20,ranz2,0],[what,rany2-28+20,ranz2,1]],
    }  
  });  
}  
// i dont fucking get it


// repeat 
for (var i =1; i<=8; i+=1) {
  customEvents.push({
    b: 89,
    t: "InstantiatePrefab",
    d: {
      asset: "assets/assetbundles/mirrorthing.prefab",
      id: "uh"+i,
      track: "mirror2"+i,
      position: [0,1,8],
      scale: [0,0,0],
    }
  });
  customEvents.push({
    b: 153, 
    t: "DestroyObject",
    d: {
      id: "uh"+i,
    }
  });
}





for (var i = 1; i <= 5; i += 1) {  
  const rany1 = (12 - ((i +1)* 4) + random(-0.25, 0.25, 0.01)) +20
  const ranz1 = random(7, 9, 0.01)
  var what = (i % 2 === 0) ? -3 : -6;  
  var what2 = (i % 2 === 0) ? -6 : -3;  
  customEvents.push({  
    b: 89,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror2" + i,  
      duration: 1,  
      easing: "easeOutQuad",  
      position: [[0, 4, 8, 0], [what, rany1, ranz1, 1, "easeOutCubic"]],  
      scale: [2, 3, 1],  
      rotation: [[random(-15, 15), random(-20, 20), 90 + random(-17, 17)+180, 0], [random(-15, 15), random(-15, -30), 90 + random(-17, 17)+180, 1, "easeOutCubic"]]  
    }  
  });   
  customEvents.push({  
    b: 90,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror2"+i,  
      duration: 28,  
      position: [[what,rany1,ranz1,0],[what,rany1-28,ranz1,1]],
    }  
  });   
  if(i <= 7) {
    customEvents.push({  
      b: 90+28,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        duration: 28,  
        position: [[what2,rany1,ranz1,0],[what2,rany1-28,ranz1,1]],
      }  
    });    
  } else {
    customEvents.push({  
      b: 90+28,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        position: [0,0,-6969],
      }  
    });  
  }
  if(i <= 7) {
    customEvents.push({  
      b: 90+56,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        duration: 28,  
        position: [[what,rany1,ranz1,0],[what,rany1-28,ranz1,1]],
      }  
    });   
  } else {
    customEvents.push({  
      b: 90+28,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        position: [0,0,-6969],
      }  
    });  
  }
}


for (var i = 5; i <= 8; i += 1) {  
  var what = (i % 2 === 0) ? 6 : 3;  
  var what2 = (i % 2 === 0) ? 3 : 6;  
  const rany2 = (12-((i-5)*4)+random(-0.25,0.25,0.01)) +12
  const ranz2 = random(7, 9, 0.01)

  customEvents.push({  
    b: 89,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror2" + i,  
      duration: 1,  
      easing: "easeOutQuad",  
      position: [[0,4,8,0],[what,rany2,ranz2,1,"easeOutCubic"]],  
      scale: [2,3,1],  
      rotation: [[random(-15,15),random(-20,20),90+ random(-17, 17)+180,0],[random(-15,15),random(15,30),90 + random(-17, 17)+180,1,"easeOutCubic"]]  ,
    }  
  });  
 
  customEvents.push({  
    b: 90,  
    t: "AnimateTrack",  
    d: {  
      track: "mirror2"+i,  
      duration: 28,  
      position: [[what,rany2,ranz2,0],[what,rany2-28,ranz2,1]],
    }  
  });   
  if(i <= 7) {
    customEvents.push({  
      b: 90+28,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        duration: 28,  
        position: [[what2,rany2,ranz2,0],[what2,rany2-28,ranz2,1]],
      }  
    });    
  } else {
    customEvents.push({  
      b: 90+28,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        position: [0,0,-6969],
      }  
    });  
  }
  if(i <= 7) {
    customEvents.push({  
      b: 90+56,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        duration: 28,  
        position: [[what,rany2,ranz2,0],[what,rany2-28,ranz2,1]],
      }  
    });   
  } else {
    customEvents.push({  
      b: 90+28,  
      t: "AnimateTrack",  
      d: {  
        track: "mirror2"+i,  
        position: [0,0,-6969],
      }  
    });  
  }

}  
// this shit took me so god damn long omfg

const tr = [];

for (var i =1; i<=8; i+=1) {
  tr.push("mirror" + i);
}

for (var i =1; i<=8; i+=1) {
  tr.push("mirror2" + i);
}
customEvents.push({  
  b: 152,  
  t: "AnimateTrack",  
  d: {  
    track: tr,  
    duration: 1,
    scale: [[2,3,1,0],[5,1,1,0.5,"easeOutCubic"],[0,6,1,1,"easeInCubic"]]
  }  
}); 
customEvents.push({
  b:153, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 181-153,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0.1,0]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[1,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0,0],[0.025,2/(184-153),"easeOutCubic"]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[1,0]]
      },
    ]
  }
});
customEvents.push({
  b:181, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 2,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0.1,0]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[1,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0.025,0],[0,1,"easeInOutQuad"]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[1,0]]
      },
    ]
  }
});
customEvents.push({
  b:209, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 6,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0.01,0],[0.1,1]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[5,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0,0],[0.05,1]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[0,0]]
      },
    ]
  }
});

customEvents.push({
  b:215, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 1,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0.1,0]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[5,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0.05,0],[0,1]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[0,0],[1,1]]
      },
    ]
  }
});
customEvents.push({
  b: 325.167, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 327.667-325.167,
    properties: [
      {
        id: "_GlitchIntensity",
        type: "Float",
        value: 69
      },
      {
        id: "_Threshold",
        type: "Float",
        value: 0
      },
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0,0],[0.2,1,"easeInCirc"]]
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 3
      },
  
      {
        id: "_TopStretchAmount",
        type: "Float",
        value: [0]
      }
    ]
  }
});

customEvents.push({
  b: 375+(1/6), 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 10*0.25,
    properties: [
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0,0],[0.1,1,"easeInQuart"]]
      },
      {
        id: "_TopStretchAmount",
        type: "Float",
        value: [[0,0]]
      }
    ]
  }
});
customEvents.push({
  b: 377+(2/3), 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 1/3,
    properties: [
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0.1,0],[0,1,"easeOutQuart"]]
      }
    ]
  }
});
customEvents.push({
  b: 377+(2/3), 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 1/3,
    properties: [
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0.1,0],[0,1,"easeOutQuart"]]
      },
      
    ]
  }
});


customEvents.push({
  b:5.25, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 15.75,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0.1,0]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[1,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[20,0]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[0,0]]
      },
    ]
  }
});
customEvents.push({
  b: 21, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 2,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0.1,0],[0,1,"easeOutSine"]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[1,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[20,0]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[0,0]]
      },
    ]
  }
});


//customEvents.push({
//  b: 21, 
//  t: "Blit",
//  d: {
//    asset: "assets/shaders/pixel.mat",
//    duration: 4,
//    properties: [
//      {
//        id: "_GlitchIntensity",
//        type: "Float",
//        value: [1]
//      },
//      {
//        id: "_Threshold",
//        type: "Float",
//        value: [0]
//      },
//      {
//        id: "_BottomStretchAmount",
//        type: "Float",
//        value: [[0,0],[0.05,1,"easeInQuad"]]
//      },
//      {
//        id: "_TopStretchAmount",
//        type: "Float",
//        value: [0]
//      },
//      {
//        id: "_DisplacementStrength",
//        type: "Float",
//        value: [3]
//      },
//    ]
//  }
//});







function fillervhs (beat,duration){
  customEvents.push({
    b: 24, 
    t: "Blit",
    d: {
      asset: "assets/shaders/vhs.mat",
      duration: 1,
      properties: [
        {
          id: "_Scanline",
          type: "Float",
          value: [0.1]
        },
        {
          id: "_Gap",
          type: "Float",
          value: [3,1]
        },
        {
          id: "_Mute",
          type: "Float",
          value: [0]
        },
        {
          id: "_Pixelate",
          type: "Float",
          value: [0.2]
        },
        {
          id: "_ChromaticAberration",
          type: "Float",
          value: [0.002,1]
        },
      ]
    }
  });
}

// ATTEMPTING TO CULL
customEvents.push({
  b: 217,
  t: "AssignPlayerToTrack",
  d: {
  track: "saberrrrrrrr",
  target: "LeftHand" //Root, Head, LeftHand, RightHand
  }
});
customEvents.push({
  b: 217,
  t: "AssignPlayerToTrack",
  d: {
  track: "saberrrrrrrr",
  target: "RightHand" //Root, Head, LeftHand, RightHand
  }
});



customEvents.push({
  b: 0, 
  t: "CreateCamera",
  d: {
    id: "theintrothing", // (Optional) Id of camera to affect. Default to "_Main".
    texture: "_Notes",
    properties: {
      culling: { // (Optional) Sets a culling mask where the selected tracks are culled
        track: ["youknowwhatelseismassive"], // Name(s) of your track(s). Everything on the track(s) will be added to this mask.
        whitelist: true // (Optional) When true, will cull everything but the selected tracks. Defaults to false.
      },
    }
  }
});
customEvents.push({
  b: 25, 
  t: "DestroyObject",
  d: {
    id: "theintrothing"
  }
});

customEvents.push({
  b: 5.25, 
  t: "Blit",
  d: {
    asset: "assets/shaders/butwhore.mat",
    duration: 24-5.25,
    properties: [
      {
        id: "_LeftStretchAmount",
        type: "Float",
        value: [[0.03,16/(24-5.25)],[0,19/(24-5.25),"easeOutQuad"]]
      },
      {
        id: "_RightStretchAmount",
        type: "Float",
        value: [[-0.03,16/(24-5.25)],[0,19/(24-5.25),"easeOutQuad"]]
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 2
      }, 
      {
        id: "_GlitchIntensity",
        type: "Float",
        value: 1
      },
      {
        id: "_Threshold",
        type: "Float",
        value: 0
      },
    ]
  }
});
customEvents.push({
  b: 23, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 4,
    properties: [
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0,0],[0.1,0.5,"easeInCubic"],[0,1,"easeOutCubic"]]
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 3
      },
      
    ]
  }
});
//customEvents.push({
//  b: 25, 
//  t: "DestroyObject",
//  d: {
//    id: "bruh"
//  }
//});

customEvents.push({
  b: 217, 
  t: "CreateCamera",
  d: {
    id: "please",
    texture: "_Notes",
    properties: {
      culling: { // (Optional) Sets a culling mask where the selected tracks are culled
        track: ["testnote","saberrrrrrrr"], // Name(s) of your track(s). Everything on the track(s) will be added to this mask.
        whitelist: true // (Optional) When true, will cull everything but the selected tracks. Defaults to false.
      },
    }
  }
});
customEvents.push({
  b: 289, 
  t: "DestroyObject",
  d: {
    id: "please"
  }
});


customEvents.push({
  b: 219, 
  t: "Blit",
  d: {
    asset: "assets/shaders/butwhore.mat",
    duration: 1.5,
    properties: [
      {
        id: "_LeftStretchAmount",
        type: "Float",
        value: [[0,0],[0.06,1,"easeInOutQuad"]]
      },
      {
        id: "_RightStretchAmount",
        type: "Float",
        value: 0
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 2
      },
      {
        id: "_GlitchIntensity",
        type: "Float",
        value: 1
      },
      {
        id: "_Threshold",
        type: "Float",
        value: 0
      },
    ]
  }
});
customEvents.push({
  b: 220.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/butwhore.mat",
    duration: 1,
    properties: [
      {
        id: "_LeftStretchAmount",
        type: "Float",
        value: [[0,0],[0.06,1,"easeOutQuart"]]
      },
    ]
  }
});

customEvents.push({
  b: 221.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/butwhore.mat",
    duration: 257-221.5,
    properties: [
      {
        id: "_LeftStretchAmount",
        type: "Float",
        value: [
          [0,0],
          [0.1,0.5/(257-221.5),"easeOutCubic"],
          [0.02,1/(257-221.5),"easeOutCubic"],
          [0.02,(257-221.5)/(257-221.5)],
        ]
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 2
      },
    ]
  }
});
customEvents.push({
  b: 257, 
  t: "Blit",
  d: {
    asset: "assets/shaders/butwhore.mat",
    properties: [
      {
        id: "_LeftStretchAmount",
        type: "Float",
        value: 0
      },
      {
        id: "_RightStretchAmount",
        type: "Float",
        value: 0
      },
    ]
  }
});
const wtf = 0.02
function idkloopthingy (beat){
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/butwhore.mat",
      duration: 1.5,
      properties: [
        {
          id: "_LeftStretchAmount",
          type: "Float",
          value: [[0,0],[wtf*2,0.25,"easeOutCubic"]]
        },
      ]
    }
  });


  customEvents.push({
    b: beat+1.5, 
    t: "Blit",
    d: {
      asset: "assets/shaders/butwhore.mat",
      duration: 1.5,
      properties: [
        {
          id: "_LeftStretchAmount",
          type: "Float",
          value: [[wtf*2,0],[0,0.25,"easeOutCubic"]]
        },
      ]
    }
  });

  customEvents.push({
    b: beat+1.5, 
    t: "Blit",
    d: {
      asset: "assets/shaders/butwhore.mat",
      duration: 1.5,
      properties: [
        {
          id: "_RightStretchAmount",
          type: "Float",
          value: [[0,0],[wtf,0.25,"easeOutCubic"]]
        },
      ]
    }
  });


  customEvents.push({
    b: beat+3, 
    t: "Blit",
    d: {
      asset: "assets/shaders/butwhore.mat",
      duration: 1.5,
      properties: [
        {
          id: "_RightStretchAmount",
          type: "Float",
          value: [[wtf,0],[0,0.25,"easeOutCubic"]]
        },
      ]
    }
  });

}
idkloopthingy (261)
idkloopthingy (269)
idkloopthingy (277)
customEvents.push({
  b: 257, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration: 289-257,
  }
});

const excludeNumbers = [263, 271, 279]; 

for (var i = 257; i <= 284; i += 2) {
  
  if (excludeNumbers.includes(i)) {
    continue; 
  }

  customEvents.push({
    b: i, 
    t: "SetMaterialProperty",
    d: {
      asset: "assets/shaders/fried.mat",
      duration: 1,
      properties: [
        {
          id: "_Hue",
          type: "Float",
          value: [[-6969, 0], [0, 0.75, "easeOutCirc"]]
        },
        {
          id: "_Contrast",
          type: "Float",
          value: 69
        },
        {
          id: "_Saturation",
          type: "Float",
          value: [[-1, 0.25], [0, 0.25]]
        },
        {
          id: "_Brightness",
          type: "Float",
          value: [[0.1, 0.25], [0, 0.25]]
        },
      ]
    }
  });
}

function asdiogrw (beat){
  customEvents.push({
    b: beat, 
    t: "SetMaterialProperty",
    d: {
      asset: "assets/shaders/fried.mat",
      duration: 4,
      properties: [
        {
          id: "_Hue",
          type: "Float",
          value: [[-1000000,0],[0,3/4]]
        },
        {
          id: "_Contrast",
          type: "Float",
          value: [[0,1],[69,1]]
        },
      ]
    }
  });
  
}
asdiogrw (261)
asdiogrw (269)
asdiogrw (277)
customEvents.push({
  b: 221.5, 
  t: "Blit",
  d: {
    asset: "assets/shaders/intro.mat",
    duration: 289-221.5,
    properties: [
      {
        id: "_RightStretchAmount",
        type: "Float",
        value: [
          [0,0],
          [0.05,0.5/(289-221.5),"easeOutCubic"],
          [0.005,1/(289-221.5),"easeOutCubic"],

          [0.005,(285-221.5)/(289-221.5)],

          [0,(289-221.5+4)/(289-221.5),"easeOutQuad"],
        ]
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 10
      },
    ]
  }
});


customEvents.push({
  b: 209, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/dontbreakplease.mat", 
    duration: 6, 
    properties: [{
      id: "_DuplicationAmount",
      type: "Float", 
      value: [[400,0],[100,1,"easeInQuart"]]
    }]
  }
});

customEvents.push({
  b: 201, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/uhoh.prefab",
    track: "lol2",
    id: "jesus1"
  }
});
customEvents.push({
  b: 201, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/stinky.prefab",
    track: "lol2",
    id: "jesus2"
  }
});
customEvents.push({
  b: 201, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/uhoh (1).prefab",
    track: "lol4",
    id: "jesus3"
  }
});
customEvents.push({
  b: 200, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/stinky (1).prefab",
    track: "lol4",
    id: "jesus4"
  }
});
customEvents.push({
  b: 257, 
  t: "DestroyObject",
  d: {
    id: ["jesus1","jesus2","jesus3","jesus4"]
  }
});
customEvents.push({
  b: 253,
  t: "AnimateTrack",
  d: {
    track: ["lol4","lol2"],
    duration: 4,
    scale: [[1,1,1,0],[5,5,5,1,"easeInCubic"]],
  }
});  

customEvents.push({
  b: 180, 
  t: "Blit",
  d: {
    asset: "assets/shaders/intro.mat",
    duration: 4,
    properties: [
      {
        id: "_LeftStretchAmount",
        type: "Float",
        value: [[0,0/4],[0.1,2.5/4,"easeInExpo"],[0.1,2.5/4],[0,1,"easeOutExpo"]]
      },
      {
        id: "_RightStretchAmount",
        type: "Float",
        value: [[0,0/4],[0.1,2.5/4,"easeInExpo"],[0.1,2.5/4],[0,1,"easeOutExpo"]]
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 1.5
      },
      {
        id: "_GlitchIntensity",
        type: "Float",
        value: 1.5
      },
      {
        id: "_Threshold",
        type: "Float",
        value: 0
      },
    ]
  }
});
customEvents.push({
  b:257, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 2,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: 0.1
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: 1
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0,0],[0.025,0.5,"easeOutCubic"]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: 20
      },
    ]
  }
});

for (var i =259; i<=283; i+=4) {
  customEvents.push({
    b:i, 
    t: "Blit",
    d: {
      asset: "assets/shaders/pixelsort.mat",
      duration: 2,
      properties: [

        {
          id: "_GlitchAmount",
          type: "Float",
          value: [[0.025,0],[-0.025,0.5,"easeOutElastic"]]
        },
        {
          id: "_SortDirection",
          type: "Float",
          value: 20
        },
      ]
    }
  });
}
for (var i =261; i<=283; i+=4) {
  customEvents.push({
    b:i, 
    t: "Blit",
    d: {
      asset: "assets/shaders/pixelsort.mat",
      duration: 2,
      properties: [
        {
          id: "_GlitchAmount",
          type: "Float",
          value: [[-0.025,0],[0.025,0.5,"easeOutElastic"]]
        },
        {
          id: "_SortDirection",
          type: "Float",
          value: 20
        },
      ]
    }
  });
}
customEvents.push({
  b:285, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 4,
    properties: [
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0.1,0],[0,1,"easeOutCubic"]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[-0.025,0],[0,1,"easeOutBack"]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: 20
      },
    ]
  }
});
customEvents.push({
  b: 289, 
  t: "Blit",
  d: {
    asset: "assets/shaders/bloom.mat",
    duration: 6969,
    properties: [
      {
        id: "_BloomIntensity",
        type: "Float",
        value: [[1,0]]
      },
      {
        id: "_BloomThreshold",
        type: "Float",
        value: [[0.11,0]]
      },
    ]
  }
});
function EEERRR (beat,duration){
  customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/pixel.mat",
      duration: duration,
      properties: [
        {
          id: "_BottomStretchAmount",
          type: "Float",
          value: [[0,0],[0.1,1,"easeInOutCubic"],[0,1]]
        },
        {
          id: "_DisplacementStrength",
          type: "Float",
          value: 3
        },
        {
          id: "_Threshold",
          type: "Float",
          value: 0
        },
        
      ]
    }
  });
}
function textstuff (beat, name, posx, posy, rotz, deadbeat){
  customEvents.push({
    b: beat, 
    t: "InstantiatePrefab",
    d: {
      asset: "assets/assetbundles/yo/"+name+".prefab",
      track: name,
      id: name,
      position: [posx,posy,5],
      rotation: [0,0,rotz],
      scale: [0.75,0.75,1]
    }
  });
  customEvents.push({
    b: deadbeat, 
    t: "DestroyObject",
    d: {
      id: name, 
    }
  });
}
textstuff (320.70, "yo", -3, 3, 15, 325.167)
textstuff (321.594, "give", -4, 2, 10, 325.167)
textstuff (322, "me", -2, 1.5, 10, 325.167)
textstuff (322.453, "some", 1, 3.5, -15, 325.167)
textstuff (322.75, "thing", 2, 2.25, -15, 325.167)
textstuff (323, "to", 1, 1.5, -15, 325.167)
textstuff (323.5, "dance", -3, 1.5, 0, 325.167,324.5)

customEvents.push({
  b: 323,
  t: "AnimateTrack",
  d: {
    track: ["dance"],
    duration: 3,
    position: ["baseHeadPosition"],
    rotation: ["baseHeadRotation"],
    scale: [0.25,0.25,1]
  }
}); 
function sqeek (beat, duration,alt,uh){
  if(uh == 1){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: duration,
        properties: [
          {
            id: "_GapSizeX",
            type: "Float",
            value: 0
          },
          {
            id: "_GapSizeY",
            type: "Float",
            value: 0
          },
          {
            id: "_BottomOffset",
            type: "Float",
            value: 0
          },
          {
            id: "_TopOffset",
            type: "Float",
            value: 0
          },
    
          {
            id: "_RightOffset",
            type: "Float",
            value: [[alt,0],[0,1,"easeOutElastic"]]
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[alt*-1,0],[0,1,"easeOutElastic"]]
          },
        ]
      }
    });
  } else if (uh = 2){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/split.mat",
        duration: duration,
        properties: [
          {
            id: "_GapSizeX",
            type: "Float",
            value: 0
          },
          {
            id: "_GapSizeY",
            type: "Float",
            value: 0
          },
          {
            id: "_BottomOffset",
            type: "Float",
            value: [[alt,0],[0,1,"easeOutElastic"]]
          },
          {
            id: "_TopOffset",
            type: "Float",
            value: [[alt*-1,0],[0,1,"easeOutElastic"]]
          },
    
          {
            id: "_RightOffset",
            type: "Float",
            value: 0
          },
          {
            id: "_LeftOffset",
            type: "Float",
            value: 0
          },
        ]
      }
    });
  }
}



function wea (beat, duration,alt,uh){
  if (uh == 1){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/sepscreen.mat",
        duration: duration,
        properties: [
          {
            id: "_RightOffset",
            type: "Float",
            value: [[alt,0],[0,1,"easeOutCubic"]]
          }
        ]
      }
    });
  } if (uh == 2){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/sepscreen.mat",
        duration: duration,
        properties: [
          {
            id: "_LeftOffset",
            type: "Float",
            value: [[alt*-1,0],[0,1,"easeOutCubic"]]
          }
        ]
      }
    });
  } else if (uh == 3){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/sepscreen.mat",
        duration: duration,
        properties: [
          {
            id: "_BottomOffset",
            type: "Float",
            value: [[0,0],[alt,0.5,"easeOutQuart"],[0,1,"easeOutQuart"]]
          }
        ]
      }
    });
  } else if (uh == 4){
    customEvents.push({
      b: beat, 
      t: "Blit",
      d: {
        asset: "assets/shaders/sepscreen.mat",
        duration: duration,
        properties: [
          {
            id: "_TopOffset",
            type: "Float",
            value: [[0,0],[alt*-1,0.5,"easeOutQuart"],[0,1,"easeOutQuart"]]
          }
        ]
      }
    });
  }
}
customEvents.push({
  b: 387, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 6969,
    properties: [
      {
        id: "_GapSizeX",
        type: "Float",
        value: 0.3
      },
      {
        id: "_GapSizeY",
        type: "Float",
        value: 0.2
      },
      {
        id: "_RightOffset",
        type: "Float",
        value:0
      },
      {
        id: "_LeftOffset",
        type: "Float",
        value: 0
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: 0
      },
      {
        id: "_BottomOffset",
        type: "Float",
        value: 0
      },
    ]
  }
});

function pain (beat,duration,amoun,uh,uh2){
  if (uh == 1){
    if(uh2==69){
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_RightOffset",
              type: "Float",
              value: [[0,0],[amoun,1,"easeOutCubic"]]
            },
          ]
        }
      });
    } else if (uh2==70) {
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_BottomOffset",
              type: "Float",
              value: [[0,0],[amoun,1,"easeOutCubic"]]
            },
          ]
        }
      });
    }  else if (uh2==71) {
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[0,0],[amoun*-1,1,"easeOutCubic"]]
            },
          ]
        }
      });
    }  else if (uh2==72) {
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_TopOffset",
              type: "Float",
              value: [[0,0],[amoun*-1,1,"easeOutCubic"]]
            },
          ]
        }
      });
    }

  } else if (uh==2){
    if(uh2==69){
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_RightOffset",
              type: "Float",
              value: [[amoun,0],[0,1,"easeOutCubic"]]
            },
          ]
        }
      });
    } else if (uh2==70) {
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_BottomOffset",
              type: "Float",
              value: [[amoun,0],[0,1,"easeOutCubic"]]
            },
          ]
        }
      });
    }  else if (uh2==71) {
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_LeftOffset",
              type: "Float",
              value: [[amoun*-1,0],[0,1,"easeOutCubic"]]
            },
          ]
        }
      });
    }  else if (uh2==72) {
      customEvents.push({
        b: beat, 
        t: "SetMaterialProperty",
        d: {
          asset: "assets/shaders/split.mat",
          duration: duration,
          properties: [
            {
              id: "_TopOffset",
              type: "Float",
              value: [[amoun*-1,0],[0,1,"easeOutCubic"]]
            },
          ]
        }
      });
    }
  }
  
}
function wepwepwepwepwep(beat, duration,type){
  if (type == 1){
    customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/sepscreen.mat",
      duration: duration,
      properties: [
        {
          id: "_TopOffset",
          type: "Float",
          value: [[0,0],[0.05,0.5,"easeOutCubic"],[0,1,"easeOutCubic"]]
        },
        {
          id: "_BottomOffset",
          type: "Float",
          value: [[0,0],[-0.05,0.5,"easeOutCubic"],[0,1,"easeOutCubic"]]
        },
      ]
    }
  });
  } else {
    customEvents.push({
    b: beat, 
    t: "Blit",
    d: {
      asset: "assets/shaders/sepscreen.mat",
      duration: duration,
      properties: [
        {
          id: "_TopOffset",
          type: "Float",
          value: [[0,0],[0.05,0.5,"easeOutCubic"],[0,1,"easeOutCubic"]]
        },
        {
          id: "_BottomOffset",
          type: "Float",
          value: [[0,0],[-0.05,0.5,"easeOutCubic"],[0,1,"easeOutCubic"]]
        },
      ]
    }
  });
  }

}
//now last stretch 
let nopw = true;
let nopw2 = true;
let woop = true;
let moment = true;
let moment2 = true;
let moment3 = true;
let moment4 = true;
let moment5 = true;
const filteredWallspain = fakefilterWalls(365, 6969); 

for (const note of filteredWallspain) {
  const value = nopw ? 0.4 : -0.4;
  if (note.h === 1) {
    sqeek (note.b, note.d+0.75,value,1)
    nopw = !nopw;
  }
  const value2 = nopw2 ? 0.4 : -0.4;
  if (note.h === 2) {
    sqeek (note.b, 1,value2,2)
    nopw2 = !nopw2;
  }
  const value3 = woop ? 1 : 2;
  if (note.h === 3) {
    wea (note.b, 0.75,-0.4,value3)
  }

  if (note.h === 4) {
    wea (note.b, note.d+0.1,-0.4,3)
  }
  if (note.h === 5) {
    wea (note.b, note.d+0.1,-0.4,4)
  }


  const gay1 = moment ? 1 : 2;
  if (note.h === 69) {
    pain (note.b,note.d,0.3,gay1,note.h)
    moment = !moment;
  }
  const gay2 = moment2 ? 1 : 2;
  if (note.h === 70) {
    pain (note.b,note.d,0.3,gay2,note.h)
    moment2 = !moment2;
  }
  const gay3 = moment3 ? 1 : 2;
  if (note.h === 71) {
    pain (note.b,note.d,0.3,gay3,note.h)
    moment3 = !moment3;
  }
  const gay4 = moment4 ? 1 : 2;
  if (note.h === 72) {
    pain (note.b,note.d,0.3,gay4,note.h)
    moment4 = !moment4;
  }


  const lastthingy = moment5 ? 1 : 2;
  if (note.h === 420) {
  wepwepwepwepwep(note.b, note.d,lastthingy)
    moment5 = !moment5;
  }


}
customEvents.push({
  b: 378, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration:  383.609-378,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: 0
      },
      {
        id: "_Saturation",
        type: "Float",
        value: 0
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[0,0],[1,1/(383.609-378),"easeOutCubic"],[1,(383.609-379)/(383.609-378)],[0,1,"easeOutCubic"]]
      },

    ]
  }
});
customEvents.push({
  b:378, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixelsort.mat",
    duration: 383.609-378,
    properties: [
      {
        id: "_SortThreshold",
        type: "Float",
        value: [[0,0],[0.1,1/(383.609-378),"easeOutCubic"],[0.1,(383.609-379)/(383.609-378)],[0,1,"easeOutCubic"]]
      },
      {
        id: "_GlitchSpeed",
        type: "Float",
        value: [[1,0]]
      },
      {
        id: "_GlitchAmount",
        type: "Float",
        value: [[0,0],[0.05,1/(383.609-378),"easeOutCubic"],[0.05,(383.609-379)/(383.609-378)],[0,1,"easeOutCubic"]]
      },
      {
        id: "_SortDirection",
        type: "Float",
        value: [[0,0]]
      },
    ]
  }
});
customEvents.push({
  b: 378, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 383.609-378,
    properties: [
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0,0],[0.05,(383.609-379)/(383.609-378)],[0,1,"easeOutCubic"]]
      },
      {
        id: "_TopStretchAmount",
        type: "Float",
        value: [[0,0]]
      }
    ]
  }
});
customEvents.push({
  b: 395.188, 
  t: "Blit",
  d: {
    asset: "assets/shaders/fried.mat",
    duration:  6969,
    properties: [

    ]
  }
});
customEvents.push({
  b: 395.188, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/fried.mat",
    duration:  417.75-395.188,
    properties: [
      {
        id: "_Brightness",
        type: "Float",
        value: [[0,0],[-1,1]]
      },
      {
        id: "_Saturation",
        type: "Float",
        value: -1
      },
      {
        id: "_Contrast",
        type: "Float",
        value: [[1,0]]
      },

    ]
  }
});

customEvents.push({
  b: 338, 
  t: "Blit",
  d: {
    asset: "assets/shaders/pixel.mat",
    duration: 7,
    properties: [
      {
        id: "_BottomStretchAmount",
        type: "Float",
        value: [[0,0],[0.03,1/7,"easeOutCubic"],[0.03,5.5/7,"easeOutCubic"],[0,1,"easeInCubic"]]
      },
      {
        id: "_GlitchIntensity",
        type: "Float",
        value: 69
      },
      {
        id: "_Threshold",
        type: "Float",
        value: 0
      },
      {
        id: "_DisplacementStrength",
        type: "Float",
        value: 6
      },
    ]
  }
});
  customEvents.push({
    b: 335.167, 
    t: "Blit",
    d: {
      asset: "assets/shaders/fried.mat",
      duration: 1,
      properties: [

        {
          id: "_Contrast",
          type: "Float",
          value: [[69,1],[0,1,"easeOutCubic"]]
        },
  
      ]
    }
  });


customEvents.push({
  b: 383.609, 
  t: "Blit",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 3,
  }
});
customEvents.push({
  b: 383.609, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 383.922-383.609,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0,0],[0.1,1,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0,0],[-0.1,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 384.25, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 0.25,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0.1,0],[-0.1,1,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0.1,0],[0.1,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 384.583, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 1,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[-0.1,0],[0.1,1,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0.1,0],[-0.1,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 384.833, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 1,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[0.1,0],[-0.1,1,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[-0.1,0],[0.1,1,"easeOutCubic"]]
      },
    ]
  }
});
customEvents.push({
  b: 385.203, 
  t: "SetMaterialProperty",
  d: {
    asset: "assets/shaders/split.mat",
    duration: 1,
    properties: [
      {
        id: "_BottomOffset",
        type: "Float",
        value: [[-0.1,0],[0,1,"easeOutCubic"]]
      },
      {
        id: "_TopOffset",
        type: "Float",
        value: [[0.1,0],[0,1,"easeOutCubic"]]
      },
    ]
  }
});


customEvents.push({
  b: 395.188, 
  t: "InstantiatePrefab",
  d: {
    asset: "assets/assetbundles/dogshit.prefab",
  }
});

//                      -  -  -  -  -  -  -  -  -  -  -  -  -  ENVO STUFF  -  -  -  -  -  -  -  -  -  -  -  -  -

for (var i =31; i<=45; i+=1) {
  const what = [1,3,4]
  environment.push(
    { 
      id: "GameCore.["+i+"]BigTrackLaneRing(Clone).[1]NeonTubeBothSidesDirectional",
      lookupMethod: "Exact",
      scale:
      what,
      track: "ringlight"
      
  },
  {
    id: "GameCore.["+i+"]BigTrackLaneRing(Clone).[2]NeonTubeBothSidesDirectional (1)",
    lookupMethod: "Exact",
    scale:
      what,
      track: "ringlight"
  
},
{
  id: "GameCore.["+i+"]BigTrackLaneRing(Clone).[3]NeonTubeBothSidesDirectional (2)",
  lookupMethod: "Exact",
  scale:
    what,
      track: "ringlight"

},
{
  id: "GameCore.["+i+"]BigTrackLaneRing(Clone).[4]NeonTubeBothSidesDirectional (3)",
  lookupMethod: "Exact",
  scale: 
    what,
      track: "ringlight"
},
  )
}
for (var i =31; i<=45; i+=1) {
  var zPosition = (i - 31 + 1) * 4;
  environment.push(
    { id: "GameCore.["+i+"]BigTrackLaneRing(Clone)", lookupMethod: "Exact", scale: [0.3,0.3,0.5],position: [0,1.2,zPosition],track: "cumball" },
  )
}
for (var i =1; i<=30; i+=1) {
  var zPosition = (i - 4 + 1) * 2;
  environment.push(
    { id: "GameCore.["+i+"]SmallTrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1.8,1.8,1.8],position: [0,1.2,zPosition+5],track: "cumball2" },
  )
}
for (var i =38; i<=41; i+=1) {
  var zPosition = (i - 38 + 1) * 6;
  var thing = ((i - 38 + 1) * 1)-1;
  if (i==38){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]RotatingLasersPair.[1]BaseR", lookupMethod: "Exact", scale: [1.6,1.6,1.6],position: [4,0,zPosition+15] },
    )
  } else {
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]RotatingLasersPair ("+thing+").[1]BaseR", lookupMethod: "Exact", scale: [1.6,1.6,1.6],position: [4,0,zPosition+15] },
    )
  }
}
for (var i =38; i<=41; i+=1) {
  var zPosition = (i - 38 + 1) * 6;
  var thing = ((i - 38 + 1) * 1)-1;
  if (i==38){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]RotatingLasersPair.[0]BaseL", lookupMethod: "Exact", scale: [1.6,1.6,1.6],position: [-4,0,zPosition+15] },
    )
  } else {
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]RotatingLasersPair ("+thing+").[0]BaseL", lookupMethod: "Exact", scale: [1.6,1.6,1.6],position: [-4,0,zPosition+15] },
    )
  }
}
for (var i =28; i<=36; i+=2) {
  var zPosition = (i - 28 + 1) * 6;
  if (i==28){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserR", lookupMethod: "Exact", scale: [2,2,2],position: [2.2,-0.5,zPosition+15] },
    )
  } else if (i==30){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserR (1)", lookupMethod: "Exact", scale: [2,2,2],position: [2.2,-0.5,zPosition+15] },
    )
  }else if (i==32){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserR (2)", lookupMethod: "Exact", scale: [2,2,2],position: [2.2,-0.5,zPosition+15] },
    )
  }else if (i==34){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserR (3)", lookupMethod: "Exact", scale: [2,2,2],position: [2.2,-0.5,zPosition+15] },
    )
  }else if (i==36){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserR (4)", lookupMethod: "Exact", scale: [2,2,2],position: [2.2,-0.5,zPosition+15] },
    )
  }
}
for (var i =29; i<=37; i+=2) {
  var zPosition = (i - 29 + 1) * 6;
  if (i==29){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserL", lookupMethod: "Exact", scale: [2,2,2],position: [-2.2,-0.5,zPosition+15] },
    )
  } else if (i==31){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserL (1)", lookupMethod: "Exact", scale: [2,2,2],position: [-2.2,-0.5,zPosition+15] },
    )
  }else if (i==33){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserL (2)", lookupMethod: "Exact", scale: [2,2,2],position: [-2.2,-0.5,zPosition+15] },
    )
  }else if (i==35){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserL (3)", lookupMethod: "Exact", scale: [2,2,2],position: [-2.2,-0.5,zPosition+15] },
    )
  }else if (i==37){
    environment.push(
      { id: "DefaultEnvironment.[0]Environment.["+i+"]DoubleColorLaserL (4)", lookupMethod: "Exact", scale: [2,2,2],position: [-2.2,-0.5,zPosition+15] },
    )
  }
}
environment.push(
  { id: "Spectrograms", lookupMethod: "Contains", active: false },
)
environment.push(
  { id: "DefaultEnvironment.[0]Environment.[9]TrackConstruction", lookupMethod: "Exact",track: "con"},
  { id: "DefaultEnvironment.[0]Environment.[8]TrackMirror", lookupMethod: "Exact", track: "con2" },
)
//customEvents.push({
//  b: 153, 
//  t: "InstantiatePrefab",
//  d: {
//    asset: "assets/assetbundles/plat.prefab",
//    track: "con"
//  }
//});
customEvents.push({
  b: 0,
  t: "AssignTrackParent",
  d: {
  childrenTracks: ["con","con2"], 
  parentTrack: "construc" ,
  }
});
//customEvents.push({
//  b: 153,
//  t: "AnimateTrack",
//  d: {
//    track: ["con","con2"],
//    position: [0,-6969,-6969],
//    scale: [0,0,0]
//  }
//}); 
customEvents.push({
  b: 71,
  t: "AnimateTrack",
  d: {
    duration: 2,
    track: "construc",
    position: [[0,0,0,0],[0,-20,0,1,"easeOutCubic"]]
  }
});  
customEvents.push({
  b: 85,
  t: "AnimateTrack",
  d: {
    duration: 2,
    track: "construc",
    position: [[0,-20,0,0],[0,0,0,1,"easeOutCubic"]]
  }
});  
customEvents.push({
  b: 71,
  t: "AnimateTrack",
  d: {
    duration: 2,
    track: ["cumball","cumball2"],
    scale: [[1,1,1,0],[10,10,10,1,"easeOutCubic"]]
  }
});  
customEvents.push({
  b: 86.5,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: ["cumball"],
    scale: [[10,10,10,0],[0.5,0.5,5,1,"easeOutCubic"]]
  }
});  
customEvents.push({
  b: 86.5,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: ["ringlight"],
    scale: [1,3,1]
  }
});  
customEvents.push({
  b: 209,
  t: "AnimateTrack",
  d: {
    duration: 6,
    track: ["ringlight"],
    scale: [[10,10,10,0],[1,3,4,1,"easeInQuad"]]
  }
});  
customEvents.push({
  b: 209,
  t: "AnimateTrack",
  d: {
    duration: 6,
    track: ["cumball"],
    scale: [[0.5,0.5,5,0],[0.5,0.5,1,1,"easeInQuad"]]
  }
}); 
customEvents.push({
  b: 289,
  t: "AnimateTrack",
  d: {
    duration: 2,
    track: ["cumball","cumball2"],
    scale: [[0,0,0,0]]
  }
}); 
customEvents.push({
  b: 325.167,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: ["cumball"],
    scale: [[0,0,0,0],[0.3,0.3,0.5,1,"easeOutCubic"]]
  }
});  
customEvents.push({
  b: 325.167,
  t: "AnimateTrack",
  d: {
    duration: 1,
    track: ["cumball2"],
    scale: [[0,0,0,0],[1.8,1.8,1.8,1,"easeOutCubic"]]
  }
});  
//environment.push(
//  { id: "GameCore", lookupMethod: "Contains", active: false },
//  { id: "DefaultEnvironment", lookupMethod: "Contains", active: false },
//)

//#endregion

//#region write file
const precision = 6; //decimals to round to  --- use this for better wall precision or to try and decrease JSON file size
const jsonP = Math.pow(10, precision);
const sortP = Math.pow(10, 2);

function deeperDaddy(obj) {
  if (obj)
    for (const key in obj) {
      if (obj[key] == null) {
        delete obj[key];
      } else if (typeof obj[key] === "object" || Array.isArray(obj[key])) {
        deeperDaddy(obj[key]);
      } else if (typeof obj[key] == "number") {
        obj[key] = parseFloat(
          Math.round((obj[key] + Number.EPSILON) * jsonP) / jsonP
        );
      }
    }
}
deeperDaddy(difficulty);

difficulty.colorNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);
difficulty.customData.fakeColorNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.bombNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);
difficulty.customData.fakeBombNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.sliders.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.burstSliders.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);
difficulty.customData.fakeBurstSliders.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.customData.customEvents.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.obstacles.sort((a, b) => a.b- b.b);
difficulty.basicBeatmapEvents.sort((a, b) => a.b - b.b);

fs.writeFileSync(OUTPUT, JSON.stringify(difficulty, null, 0));

const outputData = JSON.parse(fs.readFileSync(OUTPUT)); console.log("\n--------------- 𝙏𝙃𝙀 𝙁𝙐𝙉𝙉𝙔 𝙎𝙏𝘼𝙏𝙎---------------\n"); const BigBoobs = (array, label) => { if (array && Array.isArray(array) && array.length > 0) { console.log(`${array.length} ${label}`); } };
const boobs = [
  { data: outputData.customData.environment, label: 'Environment Pieces' },{ data: outputData.customData.customEvents, label: 'Custom Events' },
  { data: outputData.notes, label: 'Notes' },{ data: outputData.obstacles, label: 'Walls' },
  { data: outputData.events, label: 'Events' },{ data: outputData.burstSliders, label: 'Burst Sliders' },
  { data: outputData.sliders, label: 'Sliders' },{ data: outputData.bombs, label: 'Bombs' },
  { data: outputData.customData.pointDefinitions, label: 'Point Definitions' },{ data: outputData.customData.materials, label: 'Materials' },
  { data: outputData.customData.fakeColorNotes, label: 'Fake Color Notes' },{ data: outputData.customData.fakeBombNotes, label: 'Fake Bomb Notes' },
  { data: outputData.customData.fakeObstacles, label: 'Fake Obstacles' },{ data: outputData.customData.fakeBurstSliders, label: 'Fake Burst Sliders' },
];
boobs.forEach(({ data, label }) => BigBoobs(data, label)); console.log("\x1b[1m\x1b[32m","\n\n"); const filePath = 'count.txt'; if (!fs.existsSync(filePath)) { fs.writeFileSync(filePath, '0'); } let count = parseInt(fs.readFileSync(filePath)); count++; fs.writeFileSync(filePath, count.toString()); console.log(`GIVE IT UP FOR DAY ${count}!`);
//#endregion