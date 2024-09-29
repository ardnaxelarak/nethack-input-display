## NetHack Input Display
Simple node/client script for displaying input keystrokes (suitable for use on a twitch stream) while playing NetHack.

### Setup
- In `server.js`, change `const windowTitle = "NetHack"` to be whatever the window title of your nethack window is; this will be used to avoid displaying input when any other window is active.
- In the root directory, run `npm install` to install dependencies.
- Add `index.html` as a browser source in OBS (520x120 works well); to make the text white (such as for a dark background), set "Custom CSS" to `body { color: white; }`.

### Usage
- In the root directory, run `npm start`. This will start a webserver sending keystrokes to any connected clients.
- Refresh your OBS source if it's not showing up.
- **IMPORTANT: If you login in to a server (such as via hardfought.org), your keystrokes for your password _will_ show up. Make sure you login in before your stream, or disable the source while you enter your password.**
