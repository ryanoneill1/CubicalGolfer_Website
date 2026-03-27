# GitHub Actions Auto-Deploy Setup
# =================================
# One-time setup — after this, every GitHub push auto-deploys AND auto-purges cache.

## Step 1: Get your Cloudflare credentials

### CLOUDFLARE_API_TOKEN
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use template: "Edit Cloudflare Workers"
4. Add permission: Zone > Cache Purge > Purge (for your domain)
5. Copy the token

### CLOUDFLARE_ACCOUNT_ID  
1. Go to https://dash.cloudflare.com
2. Click on your account name (top left)
3. Account ID is shown in the URL and right sidebar
4. Looks like: a1b2c3d4e5f6...

### CLOUDFLARE_ZONE_ID
1. Go to https://dash.cloudflare.com
2. Click on "cubicalgolfer.com" domain
3. Scroll down right sidebar — "Zone ID" is shown there
4. Looks like: 1a2b3c4d5e6f...

## Step 2: Add secrets to GitHub

1. Go to https://github.com/ryanoneill1/CubicalGolfer_Website
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret" for each:

   Name: CLOUDFLARE_API_TOKEN    Value: (your API token from step 1)
   Name: CLOUDFLARE_ACCOUNT_ID   Value: (your account ID from step 1)
   Name: CLOUDFLARE_ZONE_ID      Value: (your zone ID from step 1)

## Step 3: Upload the files from this ZIP to GitHub
   (same as always — drag and drop into GitHub)

## After setup:
Every time you push to GitHub:
  ✅ Astro builds automatically
  ✅ Cloudflare Workers deploys automatically  
  ✅ Cloudflare cache purges automatically
  ✅ Site is live within ~3 minutes
  ✅ No manual steps needed ever again
