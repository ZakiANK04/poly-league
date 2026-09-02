# Deploy Poly League with GitHub, Vercel, and the Existing Supabase Project

This project can be deployed without creating another Supabase project. Keep the existing Supabase project, database, Auth users, and data. GitHub stores the code; Vercel hosts the Next.js site.

## 1. Protect local secrets

The repository now ignores `.env.local`. Keep this file on your computer only:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-existing-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Do not commit `SUPABASE_SERVICE_ROLE_KEY`. The current website only needs the public URL and anon key in the browser.

If `.env.local` was ever committed, rotate the exposed key in Supabase before publishing.

## 2. Test locally

Open the project folder in VS Code, then use **Terminal > New Terminal**:

```powershell
npm install
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000` or the port printed by Next.js. The captain portal is at `/login` and `/captain-portal`.

## 3. Initialize Git from VS Code

Only do this once in the project folder:

```powershell
git init
git add .
git commit -m "Prepare Poly League website"
```

Before `git add .`, confirm that `.env.local` is ignored:

```powershell
git status --short
```

You should not see `.env.local`, `node_modules`, or `.next` in the staged files.

## 4. Create the GitHub repository

1. Sign in to GitHub.
2. Select **New repository**.
3. Give it a name such as `poly-league-website`.
4. Keep it empty: do not add a README, `.gitignore`, or license because this project already has them.
5. Copy the repository HTTPS URL.

Connect and push from the VS Code terminal:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/poly-league-website.git
git push -u origin main
```

GitHub may open a browser sign-in window. Never paste a GitHub password into the terminal.

## 5. Deploy to Vercel

1. Open [vercel.com](https://vercel.com) and sign in with GitHub.
2. Select **Add New > Project**.
3. Import `poly-league-website`.
4. Keep the detected framework as **Next.js**.
5. Before deploying, open **Environment Variables** and add these two values for Production, Preview, and Development:

```text
NEXT_PUBLIC_SUPABASE_URL       your existing Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  your existing Supabase anon public key
```

6. Deploy.

Do not create a Supabase integration from Vercel. The environment variables should point to the existing project.

After deployment, Vercel gives you a URL such as `https://poly-league-website.vercel.app`.

## 6. Configure the existing Supabase project

No new project is required.

### Auth users

In the existing Supabase dashboard:

1. Open **Authentication > Users**.
2. Select **Add user**.
3. Create each captain with their email and password.
4. Copy the Auth user's UUID.

Passwords are managed by Supabase Auth. Never insert passwords into `public.profiles`.

### Link each captain to a team

Run this in the existing project's **SQL Editor**. Use the Auth UUID and a team code already seeded by `supabase/schema.sql`:

```sql
insert into public.profiles (id, full_name, role, team_id)
select
  'AUTH_USER_UUID_HERE',
  'Captain Full Name',
  'captain',
  id
from public.teams
where code = 'AUTO';
```

Use one of: `AUTO`, `DATA`, `ELN`, `ELT`, `INDUS`, `MECA`, `MTRX`, `QHSE`.

Verify the association:

```sql
select p.id, p.full_name, p.role, p.team_id, t.code, t.department
from public.profiles p
left join public.teams t on t.id = p.team_id
where p.id = 'AUTH_USER_UUID_HERE';
```

The result must contain the Auth UUID and the expected team code.

### Database schema

If the existing project already has the Poly League tables, do not run seed statements again. If it does not, run `supabase/schema.sql` once in the existing project's SQL Editor. Review the SQL output before continuing.

The existing schema enables RLS and Realtime for match updates. Keep those policies enabled.

## 7. Configure Supabase Auth URLs

In Supabase, open **Authentication > URL Configuration**:

- **Site URL:** your Vercel URL, for example `https://poly-league-website.vercel.app`
- **Redirect URLs:** add the Vercel URL and local URL if needed:
  - `https://poly-league-website.vercel.app/**`
  - `http://localhost:3000/**`

## 8. Verify production

1. Open the Vercel URL in a private browser window.
2. Visit `/login` and sign in with the Auth user.
3. Confirm the captain header shows the assigned team.
4. Add a test player and confirm the intended team is affected.
5. Open the public team page and verify the change.
6. Test a score update from one browser and the public fixtures page from another.
7. Sign out and confirm `/captain-portal` redirects back to `/login`.

## 9. Updating the deployed site

After future edits in VS Code:

```powershell
npm run lint
npm run build
git add .
git commit -m "Describe the change"
git push
```

Vercel automatically builds the new commit. If you change an environment variable in Vercel, redeploy so the new value is used.

## Common problems

- **No team association:** the `profiles.id` must equal the Auth user's UUID, and `profiles.team_id` must reference the matching row in `public.teams`.
- **Invalid login:** check the user exists under **Authentication > Users** and use the Auth password, not the Supabase database password.
- **Configuration error:** check the two `NEXT_PUBLIC_...` variables in Vercel and redeploy.
- **Local port is busy:** run `$env:PORT=3001; npm run dev` and use the printed URL.
- **Credentials visible in GitHub:** stop, remove the secret from Git history, and rotate it in Supabase. Deleting the file in a later commit is not enough.
