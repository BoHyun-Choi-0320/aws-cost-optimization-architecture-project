# envs/dev/variables.tf
variable "name_prefix" {
  description = "Prefix for naming AWS resources"
  type = string
}

variable "region" {
  description = "AWS Region to deploy resources in : Seoul Region"
  type = string
}

variable "vpc_cidr" {
    description = "CIDR block for the VPC"
    type = string
}

variable "azs" {
  description = "Availability Zones to use"
  type = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type = list(string)
}

variable "db_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type = list(string)
}