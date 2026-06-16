# Déploiement — TTS Project

## Infrastructure

- **VPS** : Hetzner CX23 (2 vCPU, 4 GB RAM, 40 GB SSD) — Nuremberg, Allemagne
- **IP** : 116.203.68.176
- **OS** : Ubuntu 26.04 LTS
- **Domaine** : jatsa.dev (Namecheap)
- **Sous-domaine projet** : ttslabs.jatsa.dev

## Architecture serveur

Internet → Nginx (port 80/443) →
├── / → fichiers statiques /var/www/tts-project/frontend/dist
└── /api/ → proxy → FastAPI (127.0.0.1:8000, géré par systemd)

## Stack installée sur le VPS

- Python 3.11 (via deadsnakes PPA — requis pour compatibilité Kokoro/spacy/blis)
- Node.js 20.x LTS
- Nginx
- Certbot (Let's Encrypt)
- espeak-ng (dépendance Kokoro)

## Backend (FastAPI)

- Chemin : `/var/www/tts-project/backend`
- Environnement virtuel : `venv` (Python 3.11)
- Variables d'environnement : `.env` (non versionné, créé manuellement sur le serveur)
- Process manager : **systemd** — service `tts-backend.service`
  - Fichier : `/etc/systemd/system/tts-backend.service`
  - Auto-restart activé, démarre au boot

### Commandes utiles

```bash
systemctl status tts-backend
systemctl restart tts-backend
journalctl -u tts-backend -f
```

## Frontend (React + Vite)

- Chemin : `/var/www/tts-project/frontend`
- Build de production : `npm run build` → génère `dist/`
- Servi directement par Nginx (fichiers statiques, pas de serveur Node en prod)
- Variable d'environnement : `VITE_API_URL` dans `.env`

## Nginx

- Fichier de config : `/etc/nginx/sites-available/tts-project`
- Activé via symlink dans `/etc/nginx/sites-enabled/`
- Gère :
  - Le routing React (`try_files` vers `index.html` pour le client-side routing)
  - Le reverse proxy vers FastAPI sur `/api/`
  - HTTPS (configuré automatiquement par Certbot)

### Commandes utiles

```bash
nginx -t
systemctl restart nginx
```

## DNS (Namecheap — Advanced DNS)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 116.203.68.176 | Automatic |
| A Record | ttslabs | 116.203.68.176 | Automatic |

## HTTPS (Let's Encrypt via Certbot)

```bash
certbot --nginx -d jatsa.dev -d ttslabs.jatsa.dev
```

- Certificat valide 90 jours, renouvellement automatique configuré par Certbot
- Domaines couverts : jatsa.dev, ttslabs.jatsa.dev

## Pare-feu (UFW)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Le port 8000 (test direct FastAPI) a été temporairement ouvert puis refermé une fois Nginx configuré.

## Mise à jour du code en production

```bash
ssh root@116.203.68.176
cd /var/www/tts-project
git checkout master
git pull origin master

cd backend
source venv/bin/activate
pip install -r requirements.txt
systemctl restart tts-backend

cd ../frontend
npm install
npm run build
systemctl reload nginx
```

## Problèmes rencontrés et solutions

| Problème | Solution |
|----------|----------|
| Python 3.14 par défaut incompatible avec Kokoro (blis ne compile pas) | Installation de Python 3.11 via deadsnakes PPA |
| Chrome force HTTPS sur les domaines .dev | Configuration HTTPS via Certbot dès le départ |
| Cache DNS local masquait la propagation réelle | ipconfig /flushdns + vidage cache Chrome (chrome://net-internals/#dns) |