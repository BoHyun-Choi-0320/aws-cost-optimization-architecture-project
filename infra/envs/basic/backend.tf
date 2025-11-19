terraform {
  backend "remote" {
    organization = "aws-cost-optimization-basic"

    workspaces {
        name = "aws-cost-optimization-architecture-project"
    }
  }
}