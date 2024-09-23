const aw = require("@paymoapp/active-window");
const gkl = require("node-global-key-listener");
const WebSocketServer = require("ws");

const v = new gkl.GlobalKeyboardListener();

const reps = {
  "ESCAPE": {lower: "<ESC>", upper: "<ESC>"},
  "RETURN": {lower: "¶", upper: "¶"},
  "SPACE": {lower: "<Space>", upper: "<Space>"},
  "1": {lower: "1", upper: "!"},
  "2": {lower: "2", upper: "@"},
  "3": {lower: "3", upper: "#"},
  "4": {lower: "4", upper: "$"},
  "5": {lower: "5", upper: "%"},
  "6": {lower: "6", upper: "^"},
  "7": {lower: "7", upper: "&"},
  "8": {lower: "8", upper: "*"},
  "9": {lower: "9", upper: "("},
  "0": {lower: "0", upper: ")"},
  "FORWARD SLASH": {lower: "/", upper: "?"},
  "BACKSLASH": {lower: "\\", upper: "|"},
  "SQUARE BRACKET OPEN": {lower: "[", upper: "{"},
  "SQUARE BRACKET CLOSE": {lower: "]", upper: "}"},
  "COMMA": {lower: ",", upper: "<"},
  "DOT": {lower: ".", upper: ">"},
  "SEMICOLON": {lower: ";", upper: ":"},
  "QUOTE": {lower: "'", upper: "\""},
  "MINUS": {lower: "-", upper: "_"},
  "EQUALS": {lower: "=", upper: "+"},
  "SECTION": {lower: "`", upper: "~"},
}

const ignore = ["LEFT SHIFT", "RIGHT SHIFT", "LEFT CTRL", "RIGHT CTRL", "LEFT ALT", "RIGHT ALT", "LEFT META", "RIGHT META", "MOUSE LEFT", "MOUSE RIGHT", "MOUSE MIDDLE"]

function is_alt(down) {
  return down["LEFT ALT"] || down["RIGHT ALT"] || false;
}

function is_ctrl(down) {
  return down["LEFT CTRL"] || down["RIGHT CTRL"] || false;
}

function is_shift(down) {
  return down["LEFT SHIFT"] || down["RIGHT SHIFT"] || false;
}

function get_representation(key) {
  var base;
  if (key.code >= 65 && key.code < 91) {
    if (key.shift) {
      base = String.fromCharCode(key.code);
    } else {
      base = String.fromCharCode(key.code + 32);
    }
  } else if (Object.keys(reps).includes(key.name)) {
    if (key.shift) {
      base = reps[key.name].upper;
    } else {
      base = reps[key.name].lower;
    }
  } else {
    return null;
  }

  var ret = "";
  if (key.alt) {
    ret += "M-";
  }
  if (key.ctrl) {
    ret += "^";
  }
  ret += base;

  return ret;
}

aw.ActiveWindow.initialize();

aw.ActiveWindow.requestPermissions();

const wss = new WebSocketServer.Server({port: 8999});

const clients = [];

wss.on("connection", client => {
  clients.push(client);

  client.on("disconnect", () => {
    const index = clients.findIndex(el => el === client);
    if (index >= 0) {
      clients.splice(index, 1);
    }
  });
});

v.addListener((key, down) => {
  if (aw.ActiveWindow.getActiveWindow().title != "NetHack") {
    return;
  }

  if (key.state != "DOWN") {
    return;
  }
  if (ignore.includes(key.name)) {
    return;
  }

  data = {
    code: key.vKey,
    name: key.name,
    alt: is_alt(down),
    ctrl: is_ctrl(down),
    shift: is_shift(down),
  };

  data.rep = get_representation(data);

  if (data.name == "TAB" && data.alt) {
    return;
  }

  for (const client of clients) {
    client.send(JSON.stringify(data));
  }
});
