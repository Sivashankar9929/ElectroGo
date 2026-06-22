variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "server_name" {
  description = "Base name — a 6-char random suffix is appended for global uniqueness."
  type        = string
}

variable "admin_username" {
  type = string
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "mysql_version" {
  type    = string
  default = "8.0.21"
}

variable "sku_name" {
  description = "e.g. B_Standard_B1ms (dev/test) or GP_Standard_D2ds_v4 (production)."
  type        = string
}

variable "storage_size_gb" {
  type    = number
  default = 20
}

variable "database_name" {
  type    = string
  default = "appdb"
}

variable "delegated_subnet_id" {
  description = "Subnet ID delegated to Microsoft.DBforMySQL/flexibleServers."
  type        = string
}

variable "vnet_id" {
  description = "VNet the private DNS zone is linked to."
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
