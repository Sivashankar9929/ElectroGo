output "vm_id"                   { value = azurerm_linux_virtual_machine.this.id }
output "vm_principal_id"         { value = azurerm_linux_virtual_machine.this.identity[0].principal_id }
output "nic_id"                  { value = azurerm_network_interface.vm.id }
output "nic_ip_configuration_name" { value = azurerm_network_interface.vm.ip_configuration[0].name }
output "public_ip_address"       { value = azurerm_public_ip.vm.ip_address }
