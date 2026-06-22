variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "vm_name" {
  type = string
}

variable "vm_size" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "subnet_id" {
  description = "Public subnet ID where the VM's NIC is placed."
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

# ── App bootstrap variables (injected into cloud-init) ────────────────────────

variable "git_repo_url" {
  description = "Git repo URL to clone the app from."
  type        = string
}

variable "git_branch" {
  description = "Git branch to clone."
  type        = string
  default     = "main"
}

variable "vm_admin_username" {
  description = "VM admin username — used to set correct home directory ownership."
  type        = string
  default     = "azureuser"
}

variable "db_host" {
  description = "MySQL Flexible Server FQDN."
  type        = string
}

variable "db_port" {
  description = "MySQL port."
  type        = number
  default     = 3306
}

variable "db_name" {
  description = "Database name."
  type        = string
}

variable "db_username" {
  description = "MySQL admin username."
  type        = string
}

variable "db_password" {
  description = "MySQL admin password."
  type        = string
  sensitive   = true
}
