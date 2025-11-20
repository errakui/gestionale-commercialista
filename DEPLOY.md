# 🚀 Guida Deployment su Server VPS

Guida per installare il gestionale su un server VPS (Ubuntu/Debian).

## Prerequisiti Server

- Ubuntu 20.04+ o Debian 11+
- Accesso root o sudo
- Dominio configurato (opzionale ma consigliato)

## 1. Preparazione Server

### Aggiorna il sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Installa Node.js 18.x

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Installa MySQL

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### Installa PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Installa Nginx

```bash
sudo apt install -y nginx
```

## 2. Configura MySQL

```bash
# Accedi a MySQL
sudo mysql

# Crea database e utente
CREATE DATABASE gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'gestionale'@'localhost' IDENTIFIED BY 'password_sicura_qui';
GRANT ALL PRIVILEGES ON gestionale_commercialista.* TO 'gestionale'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Deploy Applicazione

### Clona/Carica il progetto

```bash
cd /var/www
sudo mkdir gestionale
sudo chown $USER:$USER gestionale
cd gestionale

# Se usi Git
git clone <tuo-repository> .

# Oppure carica i file via SCP/SFTP
```

### Installa dipendenze

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Configura ambiente backend

```bash
cd backend
nano .env
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=gestionale
DB_PASSWORD=password_sicura_qui
DB_DATABASE=gestionale_commercialista

JWT_SECRET=genera-stringa-random-sicura-almeno-32-caratteri
JWT_EXPIRES_IN=8h

PORT=3001
NODE_ENV=production

FRONTEND_URL=https://tuo-dominio.com
```

### Configura ambiente frontend

```bash
cd ../frontend
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://tuo-dominio.com/api
```

### Inizializza database

```bash
cd ../backend
npm run migration:run
npm run seed
```

### Build applicazione

```bash
# Backend
cd /var/www/gestionale/backend
npm run build

# Frontend
cd /var/www/gestionale/frontend
npm run build
```

## 4. Configura PM2

### Crea file ecosystem.config.js

```bash
cd /var/www/gestionale
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'gestionale-backend',
      cwd: '/var/www/gestionale/backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'cluster',
    },
    {
      name: 'gestionale-frontend',
      cwd: '/var/www/gestionale/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      exec_mode: 'cluster',
    },
  ],
};
```

### Avvia con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 5. Configura Nginx

```bash
sudo nano /etc/nginx/sites-available/gestionale
```

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name tuo-dominio.com www.tuo-dominio.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name tuo-dominio.com www.tuo-dominio.com;

    # SSL Certificate (configurare dopo aver ottenuto Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/tuo-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tuo-dominio.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Client max body size (per upload file)
    client_max_body_size 10M;
}
```

### Abilita il sito

```bash
sudo ln -s /etc/nginx/sites-available/gestionale /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. SSL con Let's Encrypt

```bash
# Installa Certbot
sudo apt install -y certbot python3-certbot-nginx

# Ottieni certificato
sudo certbot --nginx -d tuo-dominio.com -d www.tuo-dominio.com

# Auto-rinnovo
sudo certbot renew --dry-run
```

## 7. Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 8. Backup Automatico

### Script backup database

```bash
sudo nano /usr/local/bin/backup-gestionale.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/gestionale"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u gestionale -p'password_sicura_qui' gestionale_commercialista | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Mantieni solo ultimi 30 giorni
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-gestionale.sh
```

### Cron per backup giornaliero

```bash
sudo crontab -e
```

Aggiungi:
```
0 2 * * * /usr/local/bin/backup-gestionale.sh
```

## 9. Monitoraggio

### Logs PM2

```bash
pm2 logs gestionale-backend
pm2 logs gestionale-frontend
```

### Monitoraggio processi

```bash
pm2 monit
```

### Riavvio automatico dopo riavvio server

```bash
pm2 startup
pm2 save
```

## 10. Aggiornamenti

```bash
cd /var/www/gestionale

# Pull nuove modifiche
git pull

# Aggiorna dipendenze se necessario
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Rebuild
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Riavvia
pm2 restart all
```

## Risoluzione Problemi

### Controllare status servizi

```bash
# PM2
pm2 status

# Nginx
sudo systemctl status nginx

# MySQL
sudo systemctl status mysql
```

### Logs

```bash
# PM2 logs
pm2 logs

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# MySQL error log
sudo tail -f /var/log/mysql/error.log
```

## Sicurezza Aggiuntiva

1. **Cambia la password admin** al primo accesso
2. **Genera un JWT_SECRET sicuro**: `openssl rand -base64 32`
3. **Configura fail2ban** per proteggere SSH
4. **Aggiorna regolarmente** il sistema e le dipendenze
5. **Backup regolari** del database

## Performance

Per migliorare le performance in produzione:

```bash
# Aumenta istanze PM2
pm2 scale gestionale-backend 2
pm2 scale gestionale-frontend 2
```

Ottimizza MySQL in `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```ini
innodb_buffer_pool_size = 256M
max_connections = 100
```

---

✅ **Deployment completato!** L'applicazione è ora accessibile su `https://tuo-dominio.com`

