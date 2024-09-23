const ws = new ReconnectingWebSocket("ws://localhost:8999");

function fadeout($el) {
  $el.stop();
  $el.css("opacity", "100%");
  $el.animate({opacity: 0}, 3000, "easeOutQuad");
}

ws.addEventListener("message", (event) => {
  data = JSON.parse(event.data);
  switch(data.name) {
    case "NUMPAD 7":
      fadeout($(".dir-nw"));
      return;
    case "NUMPAD 8":
      fadeout($(".dir-n"));
      return;
    case "NUMPAD 9":
      fadeout($(".dir-ne"));
      return;
    case "NUMPAD 4":
      fadeout($(".dir-w"));
      return;
    case "NUMPAD 6":
      fadeout($(".dir-e"));
      return;
    case "NUMPAD 1":
      fadeout($(".dir-sw"));
      return;
    case "NUMPAD 2":
      fadeout($(".dir-s"));
      return;
    case "NUMPAD 3":
      fadeout($(".dir-se"));
      return;
  }

  if (data.rep) {
    const $newKey = $("<span />").text(data.rep);
    $(".keystrokes").append($newKey);
    if (data.rep[0] == "<" && data.rep != "<") {
      $newKey.css("font-size", "30%");
    }
    $newKey.fadeOut({duration: 4000, easing: "easeInQuad", complete: () => $newKey.remove()});
  }
});
