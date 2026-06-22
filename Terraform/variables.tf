# ── General ───────────────────────────────────────────────────────────────────

variable "resource_group_name" {
  description = "Name of the resource group for all ElectroGo prod resources."
  type        = string
  default     = "ElectroGo-Prod-RG"
}

variable "location" {
  description = "Azure region."
  type        = string
  default     = "Australia East"
}

variable "tags" {
  description = "Common tags applied to every resource."
  type        = map(string)
  default = {
    environment = "prod"
    project     = "electrogo"
    managed_by  = "terraform"
  }
}

# ── Networking ────────────────────────────────────────────────────────────────

variable "vnet_name" {
  type    = string
  default = "vnet-electrogo-prod"
}

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.0.0.0/16"]
}

variable "public_subnet_name" {
  type    = string
  default = "snet-electrogo-public"
}

variable "public_subnet_prefix" {
  type    = list(string)
  default = ["10.0.1.0/24"]
}

variable "private_subnet_name" {
  type    = string
  default = "snet-electrogo-private"
}

variable "private_subnet_prefix" {
  type    = list(string)
  default = ["10.0.2.0/24"]
}

# ── Compute ───────────────────────────────────────────────────────────────────

variable "vm_name" {
  type    = string
  default = "vm-electrogo-prod"
}

variable "vm_size" {
  type    = string
  default = "Standard_D2s_v3"
}

variable "vm_admin_username" {
  type    = string
  default = "azureuser"
}

variable "vm_admin_password" {
  type      = string
  sensitive = true
  validation {
    condition     = length(var.vm_admin_password) >= 12
    error_message = "vm_admin_password must be at least 12 characters."
  }
}

# ── Database ──────────────────────────────────────────────────────────────────

variable "mysql_server_name" {
  type    = string
  default = "mysql-electrogo-prod"
}

variable "mysql_admin_username" {
  type    = string
  default = "dbadmin"
}

variable "mysql_admin_password" {
  type      = string
  sensitive = true
  validation {
    condition     = length(var.mysql_admin_password) >= 12
    error_message = "mysql_admin_password must be at least 12 characters."
  }
}

variable "mysql_version" {
  type    = string
  default = "8.0.21"
}

variable "mysql_sku_name" {
  type    = string
  default = "B_Standard_B1ms"
}

variable "mysql_storage_size_gb" {
  type    = number
  default = 20
}

variable "mysql_database_name" {
  type    = string
  default = "appdb"
}

# ── Load Balancer ─────────────────────────────────────────────────────────────

# ── App source ────────────────────────────────────────────────────────────────

variable "git_repo_url" {
  description = "Git repository URL for the ElectroGo app."
  type        = string
  default     = "https://github.com/Sivashankar9929/ElectroGo.git"
}

variable "git_branch" {
  description = "Git branch to deploy."
  type        = string
  default     = "main"
}

# ── Load Balancer ─────────────────────────────────────────────────────────────

variable "lb_name" {
  type    = string
  default = "lb-electrogo-prod"
}

# ── Optional RBAC ─────────────────────────────────────────────────────────────

variable "enable_rbac_assignment" {
  type    = bool
  default = false
}

variable "target_resource_id" {
  type    = string
  default = ""
}

variable "rbac_role_definition_name" {
  type    = string
  default = "Storage Blob Data Reader"
}
