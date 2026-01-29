# Node.js Backend

TypeScript/Node.js backend for the SkyPulse mobile app. Uses SQLite for storage.

## Running locally

Requires: Node.js: v18.0.0 or higher

Optional: create a .env file in the root directory (you can use .env.example for reference). 

**Start the server**

Start the server in development mode:

```bash
npm run dev
```

Compile TypeScript files to the dist/ folder:

```bash
npm run build
```

Run the compiled production code:

```bash
npm run start
```

**Database Management**
A SQLite database is initialised (if doesn't exist) on application startup.

- Manual seeding: npm run seed 
- Automatic seeding: Set SEED_DB=true in your .env file.

Server runs at `http://localhost:3000`.

## Example

```bash
curl "http://localhost:3000/api/v1/activity-score?lat=40.71&lon=-74.01"
```

## Deployment

This section outlines the process for deploying to a DigitalOcean Droplet using Terraform and Docker.
Follow these steps to provision the infrastructure and launch the service.

1. Provision Infrastructure
   Ensure you have Terraform installed and your DigitalOcean API token configured.

**Navigate to the terraform directory**

```bash
cd terraform
```

**Initialize and apply the configuration**

```bash
terraform init
terraform apply
```

Note the IP Address printed in the output after completion.

1. Connect to the Droplet 
SSH into your newly created server using the IP address from the previous step:

```bash
ssh root@<YOUR_DROPLET_IP>
```

2. Clone the Repository
Once inside the Droplet, clone the project and enter the directory:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

3. Launch the Service
Ensure you have a .env file configured on the server if you chose to overwrite the default values provided in the app.
Start the application using Docker Compose - note that unlike the local environment, the only way to trigger database seeding is via SEED_DB environment variable, which can be either set in the server's .env file or passed with the docker compose up command like so:

```
SEED_DB=true docker compose up
```
The server will be accessible at http://<YOUR_DROPLET_IP>:<PORT>.


## Structural Improvements

- Layered architecture: separated concerns (Services, Controllers, Data Access) for better maintainability.
- Added env variables, with a logic to fall back to hard-coded constants in case none are provided in the env

## Logic improvements

- Generate guest IDs for anonymous users (if userId is missing in the incoming request) to improve statistics logging
- Expand coordinate validation to check if latitude and longitude are in a valid range, to catch out invaid inputs early and prevent unnecessary API calls
- Return proper HTTP 502 (Bad Gateway) status when upstream weather services fail
- Apply activity type user preferences when giving recommendations for more customised user experience

## Future script improvements

Include more user preferences, such as:
  - wind sensitivity,
  - temperature units
  - etc.
    
to further customize the weather score for individual users and produce more tailored recommendations.

## AI tools used

Google AI `https://aistudio.google.com`
