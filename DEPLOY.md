# Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: GitHub builds the site, copies the
standalone server to the VPS over SSH, and restarts it. nginx sits in front and handles HTTPS.

```
push → GitHub Actions (npm ci, lint, build) → rsync to /srv/portfolio → systemctl restart portfolio
browser → nginx :443 → node server.js on 127.0.0.1:3000
```

Commands below assume Ubuntu or Debian. Replace `example.com` with your domain and
`SERVER_IP` with the server's IP.

## One-time server setup

### 1. Log in and update

```bash
ssh root@SERVER_IP
apt update && apt upgrade -y
```

(If you log in as a non-root sudo user, put `sudo` in front of the commands below.)

### 2. Install Node 22, nginx, rsync

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs nginx rsync
node -v   # should print v22.x
```

Check the CPU with `uname -m`. CI builds on `x86_64`; if the server prints `aarch64`, say so,
since the image library (`sharp`) is built for the CI machine's architecture.

### 3. Create a deploy user and the app folder

```bash
adduser --disabled-password --gecos "" deploy
mkdir -p /srv/portfolio /home/deploy/.ssh
chown deploy:deploy /srv/portfolio
```

### 4. Give CI its own SSH key

On **your laptop** (not the server), make a key just for CI, with no passphrase:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy -N "" -C "github-actions"
cat ~/.ssh/portfolio_deploy.pub
```

Back **on the server**, paste that public key line in:

```bash
nano /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```

Test from your laptop: `ssh -i ~/.ssh/portfolio_deploy deploy@SERVER_IP` should log in
without a password.

### 5. Let `deploy` restart the app (and nothing else)

```bash
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart portfolio' > /etc/sudoers.d/portfolio
chmod 440 /etc/sudoers.d/portfolio
visudo -c   # must say "parsed OK"
```

### 6. Runtime secrets

The GitHub activity island refetches once a day, so the server needs the token too. The file
sits outside `/srv/portfolio` so deploys never wipe it.

```bash
echo 'GITHUB_TOKEN=paste_token_here' > /etc/portfolio.env
chmod 600 /etc/portfolio.env
```

### 7. systemd service

```bash
cat > /etc/systemd/system/portfolio.service <<'EOF'
[Unit]
Description=Portfolio (Next.js)
After=network.target

[Service]
User=deploy
WorkingDirectory=/srv/portfolio
ExecStart=/usr/bin/node server.js
Environment=NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1
EnvironmentFile=/etc/portfolio.env
Restart=always

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable portfolio
```

It starts on the first deploy; there's no `server.js` to run yet.

### 8. nginx

```bash
cat > /etc/nginx/sites-available/portfolio <<'EOF'
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 9. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Allow OpenSSH **before** enabling, or you lock yourself out.

### 10. HTTPS

Needs DNS already pointing at the server (`dig +short example.com` prints `SERVER_IP`).

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.com -d www.example.com --redirect
```

Certbot renews on its own; `certbot renew --dry-run` checks that.

## GitHub secrets

Repo → Settings → Secrets and variables → Actions → New repository secret:

| Name | Value |
|------|-------|
| `SSH_HOST` | `SERVER_IP` |
| `SSH_USER` | `deploy` |
| `SSH_KEY` | full contents of `~/.ssh/portfolio_deploy` (the private one, no `.pub`) |
| `SSH_KNOWN_HOSTS` | output of `ssh-keyscan SERVER_IP` run on your laptop |
| `GH_ACTIVITY_TOKEN` | same token as in `/etc/portfolio.env` |

(GitHub reserves names starting with `GITHUB_`, hence `GH_ACTIVITY_TOKEN`.)

## First deploy

Push to `main`, or Actions tab → Deploy → Run workflow. Then on the server:

```bash
systemctl status portfolio     # active (running)
journalctl -u portfolio -n 50  # app logs
curl -I http://127.0.0.1:3000  # 200
```

## Afterwards: turn off password login

Once key login works for your own user, edit `/etc/ssh/sshd_config`, set
`PasswordAuthentication no`, then `systemctl restart ssh`. Keep your current session open
and test a new login before closing it.
