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

![](docs/Screenshot%202023-02-24%20194626.png)

![](docs/Screenshot%202023-02-25%20232759.png)

### Goals

- [ ] User Management
- [ ] Backup Management
- [ ] Clone Operation
- [ ] "Fast" Entry (Barcode/QR code reader)
- [ ] Fix: auto logout after leave/timeout
- [ ] Update from UI
- [ ] Merge Categories
- [ ] Public Demo
- [ ] McMaster Carr integration

## Installation

<details>

<summary>Install on Linux Bare Metal</summary>

### Install on Linux Bare Metal

1.  Download latest release of partman for your system. See [Releases](https://github.com/phcreery/partman/releases)

2.  Initialize database

        partman migrate up

    > This will prompt you to create the UI name, username, and password

3.  Start partman

        partman serve --http="0.0.0.0:8090"

    > Visit the link and follow the steps to create a new admin account.

4.  (optional) Create systemd service

        sudo nano /lib/systemd/system/partman.service

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

</details>

<details>

<summary>Docker</summary>

### Docker

```
docker run -d \
  --name partman \
  --restart unless-stopped \
  -v $(pwd)/data:/app/pb_data \
  -e PARTMAN_USER_EMAIL=partman@example.com \
  -e PARTMAN_USER_USERNAME=partman \
  -e PARTMAN_USER_PASSWORD=partmanpassword \
  -p 8092:8092 \
  phcreery/partman:latest
```

Setup superuser/admin account

```
docker exec -ti partman /app/partman superuser create admin@example.com adminadmin
```

</details>

## Developing

🚀 Technologies used:

- Go
- [PocketBase](https://pocketbase.io/)
- TypeScript
- Vue 3
- Vite
- [Geeker Admin Template](https://github.com/HalseySpicy/Geeker-Admin) (from latest commit on 12/11/22)
- Element-Plus
- Pinia

<details>

<summary>Dev Setup</summary>

### Dev Setup

Install prerequisites

- golang >= 1.19

- node & npm OR bun

```
bun i
```

Run server environment

```
bun run dev:server
```

Run client environment with HRM in another terminal

```
bun run dev:client
```

### Build

```
bun run build:all:release
```

### Build with Docker

```
docker build -f 'Dockerfile' -t 'phcreery/partman:latest' '.'
OR
bun run build:docker
```

With predefined account options (not recommended)

```
docker build \
  --build-arg PARTMAN_ADMIN_EMAIL=admin@example.com \
  --build-arg PARTMAN_ADMIN_PASSWORD=AdminPassword1 \
  --build-arg PARTMAN_USER_EMAIL=partman@example.com \
  --build-arg PARTMAN_USER_USERNAME=partman \
  --build-arg PARTMAN_USER_PASSWORD=partmanpassword \
  -f 'Dockerfile' -t 'phcreery/partman:latest' '.'
```

</details>
