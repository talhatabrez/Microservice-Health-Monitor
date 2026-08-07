# --- BACKEND DEPLOYMENT ---
resource "kubernetes_deployment" "backend" {
  metadata {
    name = "backend"
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = var.backend_image

          port {
            container_port = var.backend_port
          }
        }
      }
    }
  }
}

# --- BACKEND SERVICE ---
resource "kubernetes_service" "backend_service" {
  metadata {
    name = "backend-service"
  }

  spec {
    type = "ClusterIP"

    selector = {
      app = "backend"
    }

    port {
      port        = var.backend_port
      target_port = var.backend_port
    }
  }
}

# --- FRONTEND DEPLOYMENT ---
resource "kubernetes_deployment" "frontend" {
  metadata {
    name = "frontend"
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = var.frontend_image

          port {
            container_port = 80
          }
        }
      }
    }
  }
}

# --- FRONTEND SERVICE ---
resource "kubernetes_service" "frontend_service" {
  metadata {
    name = "frontend-service"
  }

  spec {
    type = "LoadBalancer"

    selector = {
      app = "frontend"
    }

    port {
      port        = var.frontend_port
      target_port = 80
    }
  }
}