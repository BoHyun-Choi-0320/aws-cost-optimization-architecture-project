# envs/dev/variables.tf
variable "name_prefix" {
  description = "Prefix for naming AWS resources"
  type = string
  default = "cost-optimization"
}

variable "region" {
  description = "AWS Region to deploy resources in : Seoul Region"
  type = string
  default = "ap-northeast-2"
}

variable "vpc_cidr" {
    description = "CIDR block for the VPC"
    type = string
    default = "211.183.0.0/16"
}

variable "azs" {
  description = "Availability Zones to use"
  type = list(string)
  default = [ "ap-northeast-2a", "ap-northeast-2c" ]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type = list(string)
  default = [ "211.183.1.0/24", "211.183.11.0/24" ]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type = list(string)
  default = [ "211.183.2.0/24", "211.183.12.0/24" ]
}

variable "db_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type = list(string)
  default = [ "211.183.3.0/24", "211.183.13.0/24" ]
}