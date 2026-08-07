variable "frontend_image" {
  type = string
  default = "talhatabrezm/health-frontend:latest"
}

variable "backend_image" {
  type = string
  default = "talhatabrezm/health-backend:latest"
}

variable "frontend_port" {
  type = number
  default = 3000
}

variable "backend_port" {
  type = number
  default = 8010
}