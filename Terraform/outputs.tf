output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "vm_public_ip" {
  description = "Public IP of the app VM — use this to SSH or test directly."
  value       = module.compute.public_ip_address
}

output "load_balancer_public_ip" {
  description = "Public IP of the load balancer — this is the production URL."
  value       = module.loadbalancer.lb_public_ip
}

output "mysql_fqdn" {
  description = "FQDN of the MySQL Flexible Server (private, VNet-only)."
  value       = module.database.fqdn
}

output "mysql_server_name" {
  description = "Actual server name created (includes random suffix)."
  value       = module.database.server_name
}

output "vm_principal_id" {
  description = "Object ID of the VM's system-assigned managed identity."
  value       = module.compute.vm_principal_id
}
