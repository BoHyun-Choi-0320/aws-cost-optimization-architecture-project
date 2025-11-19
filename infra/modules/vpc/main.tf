provider "aws" {
  region = var.region
}

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.name_prefix}-vpc"
  }
}

# Public Sunbets
resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  cidr_block = var.public_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
  map_public_ip_on_launch = true
}

# Private Subnets
resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  cidr_block = var.private_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
}

# Database Subnets
resource "aws_subnet" "database" {
  count = length(var.db_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  cidr_block = var.db_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]

  tags = {
    Name = "${var.name_prefix}-db-subnet-${count.index+1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.name_prefix}-igw"
  }
}

# NAT Gateway
resource "aws_eip" "nat_eip" {
  count = length(var.azs)
  domain = "vpc"

  tags = {
    Name = "${var.name_prefix}-eip-${count.index + 1}"
  }
}

resource "aws_nat_gateway" "nat_gw" {
  count = length(var.azs)
  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id = aws_subnet.public[count.index].id

  tags = {
    Name = "${var.name_prefix}-nat-gw-${count.index+1}"
  }

  depends_on = [ aws_internet_gateway.igw ]
}