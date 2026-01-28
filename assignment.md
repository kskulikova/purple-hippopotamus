# Platform Engineer — Take-Home Assignment

## Overview

You've inherited a small Python backend called **SkyPulse**. Your job is to migrate it to Node.js and make it deployable. The code is in the `/original` directory.

**Time estimate:** ~2 hours. You're encouraged to use AI tools — note which ones you used in your README.

---

## Tasks

### Step 1: Rewrite in Node.js

Rewrite the backend in **Node.js** (TypeScript optional).

- Keep the API contract identical (same endpoints, same request/response format)
- Keep the logic equivalent but feel free to:
    - Improve structure
    - Add error handling
    - Simplify logic
    - Document assumptions
- Bonus:
    - If you think the script could be improved (even slightly), describe your reasoning in the README.

### Step 2: Containerize

- Dockerfile + docker-compose.yml
- `docker compose up` should run the service on port 3000

### Step 3: Infrastructure as Code

Write Terraform to provision a **DigitalOcean Droplet** that can run Docker.

Must pass `terraform validate` and `terraform plan`. You don't need to run `apply` — we will.

### Step 4: Documentation

README.md with:
- How to run locally
- How to deploy
- Improvements you made and why
- AI tools you used

---

## Deployment Flow

We expect the deployment to work like this:

1. `terraform apply` → provisions the Droplet
2. SSH into the Droplet
3. Clone the repo
4. `docker compose up`
5. Service is live

---

## Submission

Your repository should include:

```
/original/          # The original Python code (don't modify)
/src/               # Your Node.js rewrite
/terraform/         # Terraform configuration
Dockerfile
docker-compose.yml
README.md
```

