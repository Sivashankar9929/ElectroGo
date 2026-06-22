resource "azurerm_linux_virtual_machine" "this" {
  name                = var.vm_name
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = var.vm_size
  tags                = var.tags

  admin_username                  = var.admin_username
  admin_password                  = var.admin_password
  disable_password_authentication = false

  network_interface_ids = [azurerm_network_interface.vm.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "StandardSSD_LRS"
  }

  # Ubuntu 24.04 LTS — matches the Microsoft .NET package feed URL in bootstrap.
  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }

  identity {
    type = "SystemAssigned"
  }

  custom_data = base64encode(templatefile("${path.module}/templates/electrogo-bootstrap.sh.tftpl", {
    vm_admin_username = var.admin_username
    git_repo_url      = var.git_repo_url
    git_branch        = var.git_branch
    db_host           = var.db_host
    db_port           = var.db_port
    db_name           = var.db_name
    db_username       = var.db_username
    db_password       = var.db_password
  }))
}
