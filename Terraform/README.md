# ElectroGo — Azure Infrastructure (Terraform)

Two-tier Azure web application: .NET 8 app on a Linux VM + MySQL Flexible Server, fronted by an Azure Load Balancer.

## Folder Structure

```
electrogo-iac/
├── environments/
│   └── prod/                  ← Terraform entry point (run commands here)
│       ├── versions.tf        ← Provider + backend config (no secrets)
│       ├── main.tf            ← Wires all modules together
│       ├── variables.tf       ← Variable declarations
│       ├── terraform.tfvars   ← Real values (gitignored)
│       ├── terraform.tfvars.example  ← Safe template to commit
│       └── outputs.tf
│
├── modules/
│   ├── network/               ← VNet, subnets, NSGs
│   ├── compute/               ← Public IP, NIC, Linux VM, cloud-init
│   │   └── templates/
│   │       └── electrogo-bootstrap.sh.tftpl  ← App install script
│   ├── database/              ← MySQL Flexible Server + private DNS
│   └── loadbalancer/          ← Azure Load Balancer
│
└── scripts/
    └── set-env.sh             ← Export ARM_* env vars (gitignored)
```

## Prerequisites

- Terraform >= 1.5.0
- Azure CLI or a Service Principal with Contributor on the target subscription
- A storage account for remote state (see backend config in `environments/prod/versions.tf`)

## Usage

```bash
# 1. Set credentials (never hardcode in .tf files)
cp scripts/set-env.sh scripts/set-env.local.sh   # gitignored copy
# Fill in your values, then:
source scripts/set-env.local.sh

# 2. Copy and fill in variable values
cd environments/prod
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set vm_admin_password and mysql_admin_password

# 3. Init, plan, apply
terraform init
terraform plan
terraform apply
```

## After Apply

```bash
# Get the VM's public IP
terraform output vm_public_ip

# SSH into the VM
ssh azureuser@<vm_public_ip>

# Check the bootstrap log
sudo cat /var/log/electrogo-deploy.log

# Check app status
sudo systemctl status electrogo
sudo journalctl -u electrogo -n 50 --no-pager

# Hit the app
curl http://<load_balancer_public_ip>
```

## What the Bootstrap Does

1. Installs nginx, git, .NET 8 SDK
2. Clones `https://github.com/Sivashankar9929/ElectroGo.git`
3. Patches `Program.cs` to use MySQL instead of SQLite (Pomelo EF Core provider)
4. Publishes the app with `dotnet publish -c Release`
5. Auto-detects the entry-point DLL and creates a systemd service
6. Configures nginx as a reverse proxy (port 80 → localhost:5000)

## Security Notes

- Credentials are passed via `ARM_*` environment variables — never stored in `.tf` files
- `terraform.tfvars` (contains passwords) is gitignored
- The VM uses a system-assigned managed identity for future least-privilege RBAC
- MySQL is VNet-only — no public endpoint
