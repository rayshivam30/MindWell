# MindWell Deployment Guide

This guide covers deploying the MindWell mental health app to various environments using the CI/CD pipeline.

## 🚀 Deployment Overview

The MindWell app uses a comprehensive CI/CD pipeline with GitHub Actions that includes:

- **Continuous Integration (CI)** - Automated testing, linting, and security scanning
- **Continuous Deployment (CD)** - Automated deployment to staging and production
- **Security Scanning** - Regular vulnerability assessments
- **Performance Testing** - Load testing and performance monitoring

## 📋 Prerequisites

### Required Accounts & Services
- **GitHub** - Repository hosting and CI/CD
- **Docker Hub / GitHub Container Registry** - Container image storage
- **AWS Account** - Cloud infrastructure (or alternative cloud provider)
- **Firebase Project** - Database and authentication services
- **Redis Cloud** - Session storage (or self-hosted Redis)
- **Domain Name** - For production deployment

### Required Secrets
Configure these secrets in your GitHub repository settings:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
EKS_CLUSTER_NAME=mindwell-cluster

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account"...}

# Security Tokens
SNYK_TOKEN=your-snyk-token
SEMGREP_APP_TOKEN=your-semgrep-token

# Notification Webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SECURITY_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
PERFORMANCE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Performance Testing
LHCI_GITHUB_APP_TOKEN=your-lighthouse-token

# Mobile App Building
EXPO_TOKEN=your-expo-token
```

## 🏗️ Infrastructure Setup

### 1. AWS Infrastructure

#### EKS Cluster Setup
```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create EKS cluster
eksctl create cluster \
  --name mindwell-cluster \
  --region us-east-1 \
  --nodegroup-name mindwell-nodes \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 5 \
  --managed
```

#### Install Required Add-ons
```bash
# Install AWS Load Balancer Controller
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"

# Install cert-manager for SSL certificates
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Install metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### 2. Domain and SSL Setup

#### Configure DNS
```bash
# Point your domain to the load balancer
# A record: mindwell.app -> <load-balancer-ip>
# A record: api.mindwell.app -> <load-balancer-ip>
# A record: docs.mindwell.app -> <github-pages-ip>
```

#### SSL Certificate Issuer
```yaml
# Create ClusterIssuer for Let's Encrypt
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@mindwell.app
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

### 3. Kubernetes Secrets

#### Create Production Secrets
```bash
# Create namespace
kubectl create namespace mindwell-production

# Create secrets
kubectl create secret generic mindwell-secrets \
  --from-literal=redis-url="redis://:your-password@mindwell-redis-service:6379" \
  --from-literal=redis-password="your-secure-redis-password" \
  --from-literal=jwt-secret="your-super-secure-jwt-secret-key" \
  --from-file=firebase-service-account=./firebase-service-account.json \
  --from-literal=sendgrid-api-key="your-sendgrid-api-key" \
  --from-literal=from-email="noreply@mindwell.app" \
  --namespace=mindwell-production

# Create staging secrets (similar but with staging values)
kubectl create namespace mindwell-staging
kubectl create secret generic mindwell-secrets \
  --from-literal=redis-url="redis://:staging-password@mindwell-redis-service:6379" \
  --from-literal=redis-password="staging-redis-password" \
  --from-literal=jwt-secret="staging-jwt-secret-key" \
  --from-file=firebase-service-account=./firebase-service-account-staging.json \
  --from-literal=sendgrid-api-key="your-sendgrid-api-key" \
  --from-literal=from-email="noreply-staging@mindwell.app" \
  --namespace=mindwell-staging
```

## 🔄 CI/CD Pipeline

### Pipeline Stages

#### 1. Continuous Integration (CI)
Triggered on every push and pull request:

```yaml
# .github/workflows/ci.yml
- Code Quality & Linting
- Frontend Tests (70%+ coverage)
- Backend Tests (75%+ coverage)
- Security Scanning
- Build Verification
- Documentation Build
```

#### 2. Security Scanning
Daily security scans and on every push:

```yaml
# .github/workflows/security.yml
- Dependency Vulnerability Scanning
- Code Security Analysis (CodeQL, Semgrep)
- Docker Image Security (Trivy)
- Infrastructure Security (Checkov)
- Secrets Scanning (TruffleHog, GitLeaks)
```

#### 3. Performance Testing
Performance monitoring and load testing:

```yaml
# .github/workflows/performance.yml
- Backend Load Testing (Artillery)
- Frontend Performance (Lighthouse)
- Database Performance (Redis benchmarks)
```

#### 4. Continuous Deployment (CD)
Automated deployment pipeline:

```yaml
# .github/workflows/cd.yml
- Docker Image Build & Push
- Deploy to Staging (on main branch)
- Deploy Documentation (GitHub Pages)
- Deploy to Production (on version tags)
- Mobile App Build (Expo)
```

### Deployment Environments

#### Staging Environment
- **URL**: https://staging.mindwell.app
- **API**: https://api-staging.mindwell.app
- **Trigger**: Push to `main` branch
- **Purpose**: Integration testing and QA

#### Production Environment
- **URL**: https://mindwell.app
- **API**: https://api.mindwell.app
- **Trigger**: Git tags (e.g., `v1.0.0`)
- **Purpose**: Live application

## 📱 Mobile App Deployment

### React Native / Expo Deployment

#### Development Build
```bash
# Install Expo CLI
npm install -g @expo/cli

# Start development server
pnpm start

# Run on device
pnpm android  # or pnpm ios
```

#### Production Build
```bash
# Build for Android
expo build:android --type apk

# Build for iOS
expo build:ios --type archive

# Or use EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

#### App Store Deployment
```bash
# Submit to app stores
eas submit --platform android
eas submit --platform ios
```

## 🐳 Docker Deployment

### Local Development with Docker

#### Start All Services
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Individual Services
```bash
# Backend only
docker-compose up backend redis

# Frontend only
docker-compose up frontend

# Documentation only
docker-compose up docs
```

### Production Docker Deployment

#### Build Production Images
```bash
# Backend
docker build -t mindwell-backend:latest ./backend

# Frontend
docker build -f Dockerfile.web -t mindwell-frontend:latest .

# Documentation
docker build -t mindwell-docs:latest ./docs
```

## ☸️ Kubernetes Deployment

### Deploy to Kubernetes

#### Deploy All Components
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n mindwell-production
kubectl get services -n mindwell-production
kubectl get ingress -n mindwell-production
```

#### Individual Components
```bash
# Deploy backend only
kubectl apply -f k8s/backend-deployment.yaml -n mindwell-production

# Deploy frontend only
kubectl apply -f k8s/frontend-deployment.yaml -n mindwell-production

# Deploy Redis
kubectl apply -f k8s/redis-deployment.yaml -n mindwell-production
```

#### Scaling
```bash
# Scale backend
kubectl scale deployment mindwell-backend --replicas=5 -n mindwell-production

# Scale frontend
kubectl scale deployment mindwell-frontend --replicas=3 -n mindwell-production
```

## 📊 Monitoring & Observability

### Health Checks
- **Backend**: `GET /health`
- **Frontend**: `GET /health`
- **Redis**: `redis-cli ping`

### Monitoring Stack
```bash
# Install Prometheus and Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80
```

### Log Aggregation
```bash
# Install ELK stack
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch
helm install kibana elastic/kibana
helm install filebeat elastic/filebeat
```

## 🔧 Troubleshooting

### Common Issues

#### Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n mindwell-production

# Check logs
kubectl logs <pod-name> -n mindwell-production

# Check events
kubectl get events -n mindwell-production --sort-by='.lastTimestamp'
```

#### Service Not Accessible
```bash
# Check service
kubectl get svc -n mindwell-production

# Check ingress
kubectl describe ingress mindwell-backend-ingress -n mindwell-production

# Test service connectivity
kubectl run test-pod --image=busybox -it --rm -- wget -qO- http://mindwell-backend-service
```

#### Database Connection Issues
```bash
# Check Redis connectivity
kubectl exec -it <backend-pod> -n mindwell-production -- redis-cli -h mindwell-redis-service ping

# Check Redis logs
kubectl logs <redis-pod> -n mindwell-production
```

### Performance Issues

#### High CPU Usage
```bash
# Check resource usage
kubectl top pods -n mindwell-production

# Scale up if needed
kubectl scale deployment mindwell-backend --replicas=5 -n mindwell-production
```

#### Memory Leaks
```bash
# Monitor memory usage
kubectl top pods -n mindwell-production --sort-by=memory

# Restart pods if needed
kubectl rollout restart deployment/mindwell-backend -n mindwell-production
```

## 🔄 Rollback Procedures

### Kubernetes Rollback
```bash
# Check rollout history
kubectl rollout history deployment/mindwell-backend -n mindwell-production

# Rollback to previous version
kubectl rollout undo deployment/mindwell-backend -n mindwell-production

# Rollback to specific revision
kubectl rollout undo deployment/mindwell-backend --to-revision=2 -n mindwell-production
```

### Docker Image Rollback
```bash
# Update deployment with previous image
kubectl set image deployment/mindwell-backend \
  backend=ghcr.io/your-username/mental-health-app-backend:v1.0.0 \
  -n mindwell-production
```

## 📈 Scaling Guidelines

### Horizontal Scaling
```bash
# Enable horizontal pod autoscaler
kubectl autoscale deployment mindwell-backend \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n mindwell-production
```

### Vertical Scaling
```bash
# Update resource limits
kubectl patch deployment mindwell-backend -n mindwell-production -p '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "backend",
          "resources": {
            "requests": {"memory": "512Mi", "cpu": "500m"},
            "limits": {"memory": "1Gi", "cpu": "1000m"}
          }
        }]
      }
    }
  }
}'
```

## 🔐 Security Best Practices

### Network Security
- Use network policies to restrict pod-to-pod communication
- Enable TLS for all external communications
- Use secrets for sensitive configuration

### Container Security
- Run containers as non-root users
- Use read-only root filesystems
- Scan images for vulnerabilities regularly

### Access Control
- Use RBAC for Kubernetes access
- Implement least privilege principles
- Regular access reviews and rotations

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Documentation](https://docs.expo.dev/)

---

For support with deployment issues, please create an issue in the GitHub repository or contact the development team.