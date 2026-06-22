# Random suffix — MySQL Flexible Server names must be globally unique across Azure.
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_private_dns_zone" "mysql" {
  name                = "${var.server_name}.private.mysql.database.azure.com"
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "mysql" {
  name                  = "link-${var.server_name}"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.mysql.name
  virtual_network_id    = var.vnet_id
}

resource "azurerm_mysql_flexible_server" "this" {
  name                = "${var.server_name}-${random_string.suffix.result}"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.tags

  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  version                = var.mysql_version
  sku_name               = var.sku_name

  # Private access via VNet Integration — no public endpoint.
  delegated_subnet_id = var.delegated_subnet_id
  private_dns_zone_id = azurerm_private_dns_zone.mysql.id

  storage {
    size_gb           = var.storage_size_gb
    auto_grow_enabled = true
  }

  backup_retention_days = 7

  depends_on = [azurerm_private_dns_zone_virtual_network_link.mysql]
}

resource "azurerm_mysql_flexible_database" "app" {
  name                = var.database_name
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mysql_flexible_server.this.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}
