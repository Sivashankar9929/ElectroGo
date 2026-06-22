terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.110"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Remote state in Azure Blob Storage.
  # Supply values via backend config or environment variables.
  backend "azurerm" {
    resource_group_name  = "<your-resource-group>"
    storage_account_name = "<your-storage-account>"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

# Provider configuration — credentials are read from environment variables.
# Set these before running terraform:
#   export ARM_CLIENT_ID="<service-principal-app-id>"
#   export ARM_CLIENT_SECRET="<service-principal-secret>"
#   export ARM_TENANT_ID="<tenant-id>"
#   export ARM_SUBSCRIPTION_ID="<subscription-id>"
provider "azurerm" {
  features {}
}
