# ORBI Energy Swarm — Web Beta Deployment

## Current beta target

The public beta is deployed with GitHub Pages from canonical `main`.

Expected URL:

`https://ingeniusvictor.github.io/orbi-energy.swarm/`

The deployment workflow is intentionally downstream of the main CI workflow.
A push to `main` must first pass **ORBI Energy Swarm CI**. Only a successful
canonical run can trigger the Pages build.

## Hosting-neutral build

Vite defaults to:

`/`

This keeps normal root-hosting targets such as Vercel compatible.

GitHub Pages overrides the base only during its build:

`ORBI_PUBLIC_BASE=/orbi-energy.swarm/`

No gameplay code depends on the hosting provider.

## Deployment gates

Before the Pages artifact is uploaded, the workflow runs:

1. `npm ci`
2. `npm run release:verify`
3. `npm run build`

The published artifact is only the generated `dist/` directory.

## One-time GitHub Pages setting

GitHub requires the repository Pages source to be configured as **GitHub Actions**.
If the first deployment reports that Pages is not enabled:

1. Repository **Settings**
2. **Pages**
3. **Build and deployment**
4. **Source → GitHub Actions**

This is repository infrastructure state, not application code. After that,
re-running the failed deployment is sufficient.

## Status

This URL is a **BETA preview**, not an RC or stable release. Issues #4 and #5 and
real-device Android hardware validation remain release blockers.
