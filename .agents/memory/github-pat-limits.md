---
name: Fine-grained GitHub PAT limitations
description: Fine-grained PATs cannot create new repos without Administration write permission
---

Fine-grained GitHub PATs (format: `github_pat_...`) have granular permissions.

**Why:** Creating a new repository requires "Administration: Read and write" at the account level. Most fine-grained PATs only grant "Contents: Write" on existing repos.

**How to apply:** When a user wants to push to a new GitHub repo:
1. Try `POST /user/repos` — if it returns "Resource not accessible by personal access token", the token lacks repo-creation permission
2. Ask the user to create the repo manually at github.com/new (takes 10 seconds)
3. Then set remote: `git remote add origin https://x-access-token:TOKEN@github.com/USER/REPO.git`
4. Then `git push -u origin main`

The Replit `gitPush()` callback also requires the repo to exist and the user to have connected GitHub to Replit.
