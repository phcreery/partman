<p align="center">
  <img src="src/assets/images/logo.png" width="200" />
</p>

# partman

Personal electronic part database manager in a single binary

## About

> **Warning**
> This is very early in development. I am dogfooding it with my own data though.
> Contributions are welcome.

Automatically organize, track, and inventory all your electronic components.

I like to build small circuits and development boards. This requires me to design and buy PCBs along with electronic components. The problems arises when the minimum order quantity is way more than you need, or when you don't end up building as many boards as you were expecting, leaving you with a bunch of teeny-tiny components that are often too unique to use anywhere else. The lead me to attempting to keep track of them so I can design future boards around the components I already have. I have tried different solutions but none of them gave me the simplicity I wanted. This is an attempt to create a solution to that problem.

### Features

- Import BoM into inventory and automatically merge/update duplicate components
- Fast search for any attribute
- Import BoM as a project
- Automatically Deduct Project qty used from inventory
- [Octopart](https://octopart.com/) integration for metadata and attribute fetching
- Export inventory as CSV
- and more!

![](doc/Screenshot%202023-02-24%20194626.png)

![](doc/Screenshot%202023-02-25%20232759.png)

### Goals

- [ ] Update from UI
- [ ] "Fast" Entry (Barcode/QR code reader)
- [ ] fix: auto logout after leave/timeout
- [ ] new: merge categories

## Installation

### Docker

_Coming soon_

### Manually Install on Linux

1. Download latest release of partman for your system

See [Releases](https://github.com/phcreery/partman/releases)

2. Initialize database

```
partman migrate up
```

This will prompt you to create the UI name, username, and password

3. Start partman

```
partman serve --http="0.0.0.0:8090"
```

Visit the link and follow the steps to create a new admin account.

4. (optional) Create systemd service

```
sudo nano /lib/systemd/system/partman.service
```

```
[Unit]
Description = partman

[Service]
Type           = simple
User           = partman
Group          = partman
LimitNOFILE    = 4096
Restart        = always
RestartSec     = 5s
StandardOutput = append:/home/partman/errors.log
StandardError  = append:/home/partman/errors.log
WorkingDirectory=/home/partman/
ExecStart      = /home/partman/partman serve --http="0.0.0.0:8080"

[Install]
WantedBy = multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl restart partman
sudo systemctl status partman
```

### Updating

```
sudo systemctl stop partman
[download latest partman binary]
partman migrate up
sudo systemctl start partman
```

## Developing

🚀 Technologies used:

- Go
- [PocketBase](https://pocketbase.io/)
- TypeScript
- Vue 3
- Vite 3
- [Geeker Admin Template](https://github.com/HalseySpicy/Geeker-Admin) (from latest commit on 12/11/22)
- Element-Plus
- Pinia

### Dev Setup

Install prerequisites

- golang >= 1.19

- node & npm

```
go get github.com/pocketbase/pocketbase
npm i
```

Run server environment

```
npm run dev:server
```

Run client environment with HRM in another terminal

```
npm run dev:client
```

### Build

```
npm run release:build
```
