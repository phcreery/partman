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

- [x] User Management
- [x] Backup Management
- [ ] Clone Component Operation
- [ ] "Fast" Entry (Barcode/QR code reader)
- [x] Fix: auto logout after leave/timeout
- [ ] Update from UI
- [ ] Merge Categories Operation
- [ ] Public Demo
- [ ] McMaster Carr integration

## Installation

<details>
<summary>Install on Linux Bare Metal</summary>

### Install on Linux Bare Metal

1.  Download latest release of partman for your system. See [Releases](https://github.com/phcreery/partman/releases)

2.  Set environment variables for PARTMAN_USER_EMAIL, PARTMAN_USER_USERNAME, and PARTMAN_USER_PASSWORD

    > Note: env variables for PARTMAN_USER_EMAIL, PARTMAN_USER_USERNAME, and PARTMAN_USER_PASSWORD are needed for first time database creation only.

3.  Initialize database

        partman migrate up

4.  Start partman

        partman serve --http="0.0.0.0:8090"

5.  Visit the link and follow the steps to create a new admin account, OR, run the following

        partman superuser upsert <PARTMAN_ADMIN_EMAIL> <PARTMAN_ADMIN_PASSWORD>

6.  (optional) Create systemd service

        sudo nano /lib/systemd/system/partman.service

```
[Unit]
Description = partman

[Service]
Type             = simple
User             = partman
Group            = partman
LimitNOFILE      = 4096
Restart          = always
RestartSec       = 5s
StandardOutput   = append:/home/partman/errors.log
StandardError    = append:/home/partman/errors.log
WorkingDirectory = /home/partman/
ExecStart        = /home/partman/partman serve --http="0.0.0.0:8080"

[Install]
WantedBy         = multi-user.target
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

> Note: env variables for PARTMAN_USER_EMAIL, PARTMAN_USER_USERNAME, and PARTMAN_USER_PASSWORD are needed for first time database creation only.

</details>

## Configure

<details>
<summary>OIDC</summary>

## OIDC With Authelia

See: https://www.authelia.com/integration/openid-connect/pocketbase/

Create oidc RSA private key: https://www.authelia.com/reference/guides/generating-secure-values/

```
authelia crypto pair rsa generate
cp ./private.pem /config/secrets/oidc/jwks/rsa.2048.key
chmod 755 -R /config/secrets/
```

create secret and digest with

```
authelia crypto hash generate pbkdf2 --variant sha512 --password insecure_secret
```

```
...
identity_providers:
  oidc:
    ...
    ## The other portions of the mandatory OpenID Connect 1.0 configuration go here.
    ## See: https://www.authelia.com/c/oidc
    jwks:
      - key: {{ secret "/config/secrets/oidc/jwks/rsa.2048.key" | mindent 10 "|" | msquote }}
    ...
    clients:
      - client_id: 'partman'
        client_name: 'partman'
        client_secret: '$pbkdf2-sha512$310000$c8p78n7pUMln0jzvd4aK4Q$JNRBzwAo0ek5qKn50cFzzvE9RXV88h1wJn5KGiHrD0YKtZaR/nCb2CJPOsKaPK0hjf.9yHxzQGZziziccp6Yng'  # The digest of 'insecure_secret'.
        public: false
        authorization_policy: 'two_factor'
        require_pkce: true
        pkce_challenge_method: 'S256'
        redirect_uris:
          - 'https://example.com/api/oauth2-redirect'
          - 'http://localhost:8090/api/oauth2-redirect'
        scopes:
          - 'email'
          - 'groups'
          - 'openid'
          - 'profile'
        response_types:
          - 'code'
        grant_types:
          - 'authorization_code'
        access_token_signed_response_alg: 'none'
        userinfo_signed_response_alg: 'none'
        token_endpoint_auth_method: 'client_secret_basic'
...
```

Currently this requires authelia to be run with `--config.experimental.filters template`

- Connect to PocketBase admin view at https://example.com/_/
- On the left menu, go to Settings.
- In Authentication section, go to Auth providers.
- Select the gear on OpenID Connect (oidc)
- Configure the following options:
- ClientID: partman
- Client secret: insecure_secret
- Display name: Authelia (or whatever you want)
  - Auth URL: https://example.com/api/oidc/authorization
  - Token URL: https://example.com/api/oidc/token
  - User API URL: https://example.com/api/oidc/userinfo
  - You can leave Support PKCE checked

</details>

<details>
<summary>Dev Setup</summary>

### Dev Setup

🚀 Technologies used:

- Go
- [PocketBase](https://pocketbase.io/)
- TypeScript
- Vue 3
- Vite
- [Geeker Admin Template](https://github.com/HalseySpicy/Geeker-Admin) and [Fork](https://github.com/Geeker-Admin/Geeker-Admin) (from latest commit on 7/04/25)
- Element-Plus
- Pinia

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

### Release

Test build with

```
bun run build:all
```

On success

```
bun run tag
git push --follow-tags
bun run build:all:release
bun run build:docker:latest
bun run push:docker:latest
```

</details>
