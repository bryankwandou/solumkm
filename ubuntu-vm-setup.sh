#!/bin/bash
set -e

# 1. Install Docker Engine + Compose plugin on Ubuntu
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. Allow running docker without sudo (log out/in required to take effect)
sudo usermod -aG docker "$USER"

# 3. Clone the project (adjust to your GitLab repo URL once pushed)
# git clone <your-gitlab-repo-url> app && cd app

echo "Docker installed. Log out and back in (or run 'newgrp docker'), then inside the project folder run:"
echo "  docker compose up --build"
