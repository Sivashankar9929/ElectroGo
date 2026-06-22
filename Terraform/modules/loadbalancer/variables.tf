variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "lb_name" {
  type = string
}

variable "vm_nic_id" {
  description = "NIC ID of the app VM to register in the backend pool."
  type        = string
}

variable "ip_configuration_name" {
  description = "Name of the IP configuration on the VM's NIC."
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
