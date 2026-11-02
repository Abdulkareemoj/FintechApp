# Backend deploy — Oracle Cloud (one-time server bootstrap)

The GitHub Actions workflow (`.github/workflows/backend.yml`) deploys every push
to `main`. Each release lands in `~/fintech-backend/releases/<short-sha>/`,
migrations are applied with a self-contained EF migration bundle, then the
`live` symlink is swapped and the systemd service restarted:

```
/home/<user>/fintech-backend/
├── releases/<sha>/        # extracted publish output + efbundle
├── releases/<sha>.tar.gz  # (removed after extraction)
├── shared/app.env         # env vars (NOT overwritten by deploys)
└── live -> releases/<sha> # symlink the service runs from
```

## 1. Install the ASP.NET Core 10 runtime

Ubuntu 24.04 (works for both x86_64 and arm64 — apt picks the right arch):

```bash
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb && rm packages-microsoft-prod.deb
sudo apt-get update && sudo apt-get install -y aspnetcore-runtime-10.0
```

(For Ubuntu 22.04 swap `24.04` in the URL. Only the runtime is needed — the app
is published framework-dependent; the migration bundle is self-contained.)

Verify: `dotnet --list-runtimes` → `Microsoft.AspNetCore.App 10.x`.

Arch note: the self-contained migration bundle is built for one architecture —
set `BUNDLE_RID` in `.github/workflows/backend.yml` to match `uname -m` on this
instance (`linux-x64` for AMD micros, `linux-arm64` for Ampere A1).

## 2. Open the API port

Both layers must allow it — Oracle instances have TWO firewalls:

```bash
# a) OCI Security List / NSG (console): ingress TCP 5182 from 0.0.0.0/0
#    (or restrict to Vercel egress ranges — they are published and rotate)
#
# b) the in-OS iptables (Oracle Ubuntu images ship with REJECT rules):
sudo iptables -I INPUT -p tcp --dport 5182 -j ACCEPT
sudo apt-get install -y iptables-persistent && sudo netfilter-persistent save
```

## 3. Directory + environment file

```bash
mkdir -p ~/fintech-backend/releases ~/fintech-backend/shared
cp app.env.example ~/fintech-backend/shared/app.env
nano ~/fintech-backend/shared/app.env   # fill in connection string + keys
chmod 600 ~/fintech-backend/shared/app.env
```

The connection string in `app.env` is used by the app **and** by the
migration bundle the deploy script runs. Dev seed data does NOT run in
production — the database only needs to exist and be reachable.

## 4. systemd service

```bash
sudo cp fintech-backend.service /etc/systemd/system/
# if your username is not "ubuntu", edit User= / paths in the unit first
sudo systemctl daemon-reload
sudo systemctl enable fintech-backend
```

The CI deploy step runs `sudo systemctl restart fintech-backend` over SSH, so
the deploy user needs a passwordless rule for exactly that command:

```bash
echo "$USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart fintech-backend" \
  | sudo tee /etc/sudoers.d/fintech-deploy
sudo chmod 440 /etc/sudoers.d/fintech-deploy
```

## 5. GitHub secrets

| Secret | Value |
|---|---|
| `ORACLE_SSH_KEY` | private key whose pubkey is in `~/.ssh/authorized_keys` on the instance |
| `ORACLE_CLOUD_IP` | public IP (reserve it so it never changes) |
| `ORACLE_CLOUD_USER` | SSH username |

## 6. First deploy + verify

Push to `main` (or re-run the workflow). Then:

```bash
curl http://<ip>:5182/health
systemctl status fintech-backend
journalctl -u fintech-backend -f
ls -la ~/fintech-backend/live   # symlink → latest release
```

Rollback: `ln -sfn ~/fintech-backend/releases/<old-sha> ~/fintech-backend/live && sudo systemctl restart fintech-backend`.

## Notes / gotchas

- **Hangfire** uses SQL Server storage in Production — it creates its schema
  (`HangFire.*` tables) on first start; the DB user needs DDL rights.
- `/hangfire` dashboard requires an authenticated `Admin` in Production.
  Swagger/Scalar are dev-only.
- The web app on Vercel reaches this API through a same-origin rewrite
  (`web/vercel.json`, `/api/*` → `http://<this-ip>:5182/api/*`), so no CORS
  changes are needed. Replace the placeholder IP in that file.
- Traffic Vercel→API is plain HTTP over the public internet (no domain = no
  TLS). Tokens are therefore sent unencrypted on that hop. Acceptable for
  demos; fix by pointing a domain (even a free one) at the IP and terminating
  TLS with Caddy/nginx.
