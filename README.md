# Domain Blacklister Chromium Extension

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [How to Build](#how-to-build)
- [How to Install](#how-to-install)
- [How to Debug](#how-to-debug)
    - [Debugging the Extension's UI](#debugging-the-extensions-ui)
    - [Debugging the Service Worker Scripts](#debugging-the-service-worker-scripts)
- [License](#license)

Domain Blocker is a Chromium extension that allows users to block access to specific domains. I made this so that I would stop automatically and subconsciously through nothing but pure muscle-memory, opening up lichess.org and playing blitz. I know the same function could've been achieved through other means such as configuring my router settings or even just my local machine's network rule - but whatever. 

## Tech Stack

- JavaScript
- Chrome Extension APIs
- Vue.js

## How to Build

1. Make sure you have Node.js installed on your system. You can download it from [https://nodejs.org/](https://nodejs.org/).

2. Clone the repository:

```bash
git clone https://github.com/Zabedz/blacklister-extension
```

3. Install the dependencies:

```bash
cd blacklister-extension
npm ci
```

4. Build the project:

```bash
npm run build
```

## Running tests

```bash
npm run tests
```

## How to Install

1. Build the project following the instructions above.

2. Open Google Chrome, and navigate to `chrome://extensions`.

3. Enable "Developer mode" by toggling the switch in the top right corner of the page.

4. Click "Load unpacked" and select the `dist` directory of your project.

5. The Domain Blocker Chrome extension should now be installed and visible in the list of extensions.

## How to Debug

### Debugging the Extension's UI

1. Right-click on the extension icon in the browser toolbar and select "Inspect popup."

2. This will open Chrome Developer Tools for the extension's popup UI, where you can debug the UI using the Elements, Console, Sources, and other panels.

### Debugging the Service Worker Scripts

1. Navigate to `chrome://extensions` and find the Domain Blocker Chrome extension.

2. Click on the "Details" button of the extension.

3. Scroll down to the "Service Worker" section and click on "inspect".

4. This will open Chrome Developer Tools for the extension's background scripts, where you can debug the service worker using the Elements, Console, Sources, and other panels.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file in the root of the project for more information.
