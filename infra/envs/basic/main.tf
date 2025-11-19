module "vpc" {
  source = "../../modules/vpc"

  name_prefix = var.name_prefix
  region = var.region
  vpc_cidr = var.vpc_cidr
  azs = var.azs
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  db_subnet_cidrs = var.db_subnet_cidrs
}