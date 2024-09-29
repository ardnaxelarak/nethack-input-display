const ws = new ReconnectingWebSocket("ws://localhost:8999");

function fadeout($el) {
  $el.fadeOut({duration: 4000, easing: "easeInQuad", complete: () => $el.remove()});
}

var $extendedEl = null;

ws.addEventListener("message", (event) => {
  key = JSON.parse(event.data);
  rep = key.rep;

  switch(key.name) {
    case "NUMPAD 7":
      rep = "🡤";
      break;
    case "NUMPAD 8":
      rep = "🡡";
      break;
    case "NUMPAD 9":
      rep = "🡥";
      break;
    case "NUMPAD 4":
      rep = "🡠";
      break;
    case "NUMPAD 5":
      rep = "5";
      break;
    case "NUMPAD 6":
      rep = "🡢";
      break;
    case "NUMPAD 1":
      rep = "🡧";
      break;
    case "NUMPAD 2":
      rep = "🡣";
      break;
    case "NUMPAD 3":
      rep = "🡦";
      break;
    case "NUMPAD DOT":
      rep = ".";
      break;
  }

  if ($extendedEl) {
    if (["RETURN", "ESCAPE"].includes(key.name)) {
      fadeout($extendedEl);
      $extendedEl = null;
      addKey(key.ctrl, false, rep);
      return;
    }

    if (key.alt) {
      if ($extendedEl.text().length == 1) {
        fadeout($extendedEl);
        $extendedEl = null;
        addKey(false, false, "<ESC>");
        addKey(key.ctrl, false, rep);
        return;
      }

      $extendedEl.text("#" + rep);
      return;
    }

    if (key.ctrl) {
      return;
    }

    if (key.name == "BACKSPACE") {
      if ($extendedEl.text().length > 1) {
        $extendedEl.text($extendedEl.text().slice(0, -1));
      }
      return;
    }

    if (key.name == "SPACE") {
      rep = " ";
    }

    $extendedEl.text($extendedEl.text() + rep);
    return;
  }

  if (rep == "#" && !key.ctrl && !key.alt) {
    $extendedEl = $("<span />").text("#");
    $(".keystrokes").append($extendedEl);
    return;
  }

  if (rep) {
    addKey(key.ctrl, key.alt, rep);
  }
});

function addKey(ctrl, alt, rep) {
  if (rep) {
    const $newKey = $("<span />");
    $(".keystrokes").append($newKey);
    if (rep[0] == "<" && rep != "<") {
      $newKey.css("font-size", "70%");
      $newKey.text(rep);
    } else {
      var text = "";
      if (alt) {
        text += "M-";
      }
      if (ctrl) {
        text += "^";
      }
      text += rep;
      $newKey.text(text);
    }
    fadeout($newKey);
  }
}
