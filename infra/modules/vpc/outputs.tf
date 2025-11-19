## vpc
output "vpc_id" {
  value = aws_vpc.main.id
}

## subnet
output "public_subnet_ids" {
  value = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnet_ids" {
  value = [for subnet in aws_subnet.private : subnet.id]
}

output "db_subnet_ids" {
  value = [for subnet in aws_subnet.database : subnet.id]
}