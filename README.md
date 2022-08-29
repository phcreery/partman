# partman

Personal electronic part database manager

## About

Automatically organize, track, and inventory all your electronic components. 

I like to build small circuits and development boards. This requires me to design and buy PCBs along with electronic components. The problems arises when the minimum order quantity is way more than you need, or when you don't end up building as many boards as you were expecting, leaving you with a bunch of teeny-tiny components that are often too unique to use anywhere else. The lead me to attempting to keep track of them so I can design future boards around the components I already have. I have tried different solutions but none of them gave me the simplicity I wanted. This is an attempt to create a solution to that problem.

## Setup

Basic setup follows these steps:
1. Download latest version of PocketBase
2. Download latest release of partman
3. Copy partman static web files to `pb_public`
4. Start PocketBase

### Linux

1. Create Linux account called partman
```
useradd -m partman
passwd partman
su partman
```

2. Download latest version of PocketBase
```
wget https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip /tmp/pocketbase.zip
unzip /tmp/pocketbase.zip -d /home/partman/
chmod +x /home/partman/pocketbase
```

3. Download latest release of partman
```
PARTMAN_PUBLIC_DOWNLOAD_URL=$(curl -s https://api.github.com/repos/phcreery/partman/releases/latest \
    | jq -r '.assets[] | select(.name | contains(".zip")) | .browser_download_url') && \
    echo "$PARTMAN_PUBLIC_DOWNLOAD_URL" && \
    echo "$PARTMAN_PUBLIC_DOWNLOAD_URL" | wget -qi - -O /tmp/partman.zip
```
4. Download template database
```
DB_PUBLIC_DOWNLOAD_URL=$(curl -s https://api.github.com/repos/phcreery/partman/releases/latest \
    | jq -r '.assets[] | select(.name | contains(".db")) | .browser_download_url') && \
    echo "$DB_PUBLIC_DOWNLOAD_URL" && \
    echo "$DB_PUBLIC_DOWNLOAD_URL" | wget -qi - -O /tmp/data.db
```
5. Copy database template to `pb_data`
6. Copy release to `pb_public`
```
unzip /tmp/partman.zip -d /tmp/partman
cp -r /tmp/partman/* /home/partman/pb_public
cp /tmp/data.db /home/partman/pb_data
```
7. Start PocketBase

```
pocketbase serve --http="0.0.0.0:8090"
```
8. (optional) Create systemd service

```
sudo nano /lib/systemd/system/pocketbase.service
```
```
[Unit]
Description = pocketbase

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
ExecStart      = /home/partman/pocketbase serve --http="0.0.0.0:8080"

[Install]
WantedBy = multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl restart pocketbase
sudo systemctl status pocketbase
```

### Docker

*Coming soon*

### Config

- Database Admin: admin@mail.com : partmanpass
- Default User: partman@test.com : partmanpass

## Developing

🚀 Technologies used:

- Geeker Admin (from latest commit on 7/31/22)
- Vue 3.2
- Vite 2
- TypeScript
- Pinia
- Element-Plus
- PocketBase
