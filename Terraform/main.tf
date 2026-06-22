resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# ── Network ───────────────────────────────────────────────────────────────────
module "network" {
  source = "./modules/network"

  resource_group_name  = azurerm_resource_group.main.name
  location             = azurerm_resource_group.main.location
  vnet_name            = var.vnet_name
  vnet_address_space   = var.vnet_address_space
  public_subnet_name   = var.public_subnet_name
  public_subnet_prefix = var.public_subnet_prefix
  private_subnet_name  = var.private_subnet_name
  private_subnet_prefix = var.private_subnet_prefix
  tags                 = var.tags
}

# ── Database ──────────────────────────────────────────────────────────────────
module "database" {
  source = "./modules/database"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  server_name         = var.mysql_server_name
  admin_username      = var.mysql_admin_username
  admin_password      = var.mysql_admin_password
  mysql_version       = var.mysql_version
  sku_name            = var.mysql_sku_name
  storage_size_gb     = var.mysql_storage_size_gb
  database_name       = var.mysql_database_name
  delegated_subnet_id = module.network.private_subnet_id
  vnet_id             = module.network.vnet_id
  tags                = var.tags

  depends_on = [module.network]
}

# ── Compute ───────────────────────────────────────────────────────────────────
module "compute" {
  source = "./modules/compute"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  vm_name             = var.vm_name
  vm_size             = var.vm_size
  admin_username      = var.vm_admin_username
  admin_password      = var.vm_admin_password
  subnet_id           = module.network.public_subnet_id
  tags                = var.tags

  # Passed to the cloud-init bootstrap script.
  vm_admin_username = var.vm_admin_username
  git_repo_url      = var.git_repo_url
  git_branch   = var.git_branch
  db_host      = module.database.fqdn
  db_port      = 3306
  db_name      = module.database.database_name
  db_username  = var.mysql_admin_username
  db_password  = var.mysql_admin_password

  depends_on = [module.network, module.database]
}

# ── Load Balancer ─────────────────────────────────────────────────────────────
module "loadbalancer" {
  source = "./modules/loadbalancer"

  resource_group_name   = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  lb_name               = var.lb_name
  vm_nic_id             = module.compute.nic_id
  ip_configuration_name = module.compute.nic_ip_configuration_name
  tags                  = var.tags

  depends_on = [module.compute]
}

# ── Optional RBAC for VM managed identity ────────────────────────────────────
resource "azurerm_role_assignment" "vm_identity" {
  count = var.enable_rbac_assignment ? 1 : 0

  scope                = var.target_resource_id
  role_definition_name = var.rbac_role_definition_name
  principal_id         = module.compute.vm_principal_id
}
