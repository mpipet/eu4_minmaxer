# 🔒 Ansible Playbook - Secure Ubuntu Server

## 📋 Prerequisites

### Localy

```bash
sudo apt update
sudo apt install ansible -y

ansible --version
```

### SSH key

```bash
ssh-keygen -t ed25519 -C "votre@email.com"
```

## ⚙️ Configuration

### 1. Edit inventory

```bash
vim inventory.ini
```

Replace `YOUR_SERVER_IP` by your ip server.

### 2. Éditer les variables

```bash
vim vars.yml
```

**Mandatory variables :**

```yaml
admin_email: "votre@email.com"          
deploy_user: "deploy"                    
ssh_port: 2222                           
```

## 🚀 Run

### Connexion test

```bash
ansible all -m ping
```

### Dry-run (simulation)

```bash
ansible-playbook playbook.yml --check
```

### Exécution complète

```bash
ansible-playbook playbook.yml
```

### Run by role (tags)

```bash
ansible-playbook playbook.yml --tags ssh

ansible-playbook playbook.yml --tags firewall

ansible-playbook playbook.yml --tags "ssh,firewall,fail2ban"
```

### Verbose mode

```bash
ansible-playbook playbook.yml -v
ansible-playbook playbook.yml -vv   
ansible-playbook playbook.yml -vvv  
```

## ⚠️ IMPORTANT - After run

### 1. Test SSH connexion

```bash
ssh -p 2222 deploy@VOTRE_SERVER_IP
```

If it works :
```bash
sudo whoami
```

### 2. Check services

```bash
# Firewall
sudo ufw status verbose

# Fail2Ban
sudo fail2ban-client status
sudo fail2ban-client status sshd

# SSH
sudo systemctl status sshd
```

### 3. Update inventory

Once ssh works on the new port :

```bash
vim inventory.ini
```

Change :

```ini
eu4-prod ansible_host=YOUR_SERVER_IP ansible_port=2222 ansible_user=deploy
```
