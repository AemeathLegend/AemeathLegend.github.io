# MTG-List(Card collection webside)

## How to Setup

### 1. run this inside your'e console(`path` = your'e desired location for the project), to get git repo

```bash
git clone https://gitlab.ausbildung.tsbw.de/jason.rohde/mtglist.git Card_Collection_Webside
```

!!!open a new console!!!

### 2. setup node.js(windows)

```bash
run node -v
=======================================
if no version listed do the following:|
winget install OpenJS.NodeJS.LTS      |
=======================================
!!!restart console
```

### 2. setup node.js(Linux[Ubuntu,Debian,Mint])

```bash
run node -v
=======================================================
if no version listed do the following:                |
curl -fsSL https://nodesource.com | sudo -E bash -    |
sudo apt-get install -y nodejs                        |
=======================================================
!!!restart console
```

!!!close second console with node installation

### 3. run test server

```bash
cd ./Card_Collection_Webside
npx http-server -o
```
