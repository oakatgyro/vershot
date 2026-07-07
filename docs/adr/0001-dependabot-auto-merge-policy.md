# ADR 0001 — Dependabot scope and auto-merge policy

- **Status**: Accepted
- **Date**: 2026-05-26

## Context

This is a polyglot template repo (Next.js frontend, Python/uv backend, future Terraform infra) maintained by a single developer. Without an update policy, dependency drift either causes silent rot (no automation) or floods the PR queue (default Dependabot config). We want both freshness and a low-noise queue.

Two coupled questions had to be resolved together:

1. **Which dependency surfaces should Dependabot watch, and how aggressively?**
2. **Which Dependabot PRs are safe to merge without human review?**

The second question only has a meaningful answer if CI exists to verify each PR. The repo had no CI at the time of this decision.

## Decision

### Scope

Dependabot is configured for **all four** potential ecosystems even though two have no files yet:

| Ecosystem | Directory | Status today |
|---|---|---|
| `npm` | `/src/frontend/lp` | Populated |
| `uv` | `/src/backend` | Populated |
| `terraform` | `/infrastructure/terraform` | Pre-staged (empty directory) |
| `github-actions` | `/` | Pre-staged (workflows added in same change) |

Rationale: future-proofing outweighs the cost of empty-directory warnings. When `.tf` files or new workflows appear, Dependabot picks them up without a config change.

### Schedule, grouping, limits

- **Weekly, Monday 09:00 Asia/Tokyo** for all ecosystems. Concentrates noise into one triage window; security PRs ignore the schedule and open immediately on advisory publication.
- **Conservative grouping** on `npm`: `@types/*`, `eslint*`, and remaining dev minor/patch are batched. Runtime deps and majors remain individual so breaking-change bisection stays cheap.
- **PR limit**: 10 for npm, 5 elsewhere. Security PRs are exempt from the limit.
- **Commit prefix**: `chore(deps)` everywhere, matching the project's Conventional Commits convention.
- **Versioning strategy**: `auto` (default). Manifest pins introduced by `create-next-app` (`next`, `react`, `react-dom`, `eslint-config-next`) were unintentional and were rewritten to caret ranges in the same change. This lets Dependabot batch routine minor/patch bumps as lockfile updates instead of editing the manifest on every release.

### Auto-merge — "B-cautious"

A separate workflow (`.github/workflows/dependabot-automerge.yml`) enables GitHub's native auto-merge for a narrow allowlist:

| Bump type | Auto-merge? |
|---|---|
| Dev dep, patch or minor (any ecosystem) | Yes |
| GitHub Action, patch or minor | Yes |
| **Runtime / production dep, any version** | **No (manual)** |
| **Any major version bump** | **No (manual)** |
| **Terraform, any** | **No (manual)** |
| **Security PR (GHSA attached)** | **No (manual)** |

Rationale by row:
- Dev deps don't ship to users; a bad bump fails CI, no production exposure.
- Action patches/minors are tooling; majors (e.g., `checkout@v3→v4`) routinely break.
- Runtime deps (`next`, `react`, `@base-ui/react`) ship to users and warrant a glance even on patches.
- Terraform changes alter real infrastructure; cheap to merge by hand, expensive to mis-merge.
- Security PRs stay manual to preserve awareness of the underlying CVE, not because of merge-speed concerns.

### Required preconditions (configured in same change)

For `gh pr merge --auto` to be a safety gate rather than an instant merge, three GitHub-side settings must hold:

1. Repo: `allow_auto_merge = true`
2. Repo: `delete_branch_on_merge = true`
3. Branch protection on `main` requires status checks `ci-lp` and `ci-backend`

All three were set via `gh api` as part of this ADR's implementation.

## Consequences

### Positive
- Dev/tooling churn merges itself, eliminating ~70% of expected Dependabot PR clicks for a solo dev.
- Runtime, infra, and CVE changes always cross a human's desk.
- Configuration is concentrated in three files plus repo settings, all reversible.

### Negative / accepted trade-offs
- **CI surface is minimal** (lint + typecheck only, no `next build` or tests). Some classes of dep-bump regressions — bundler errors, RSC boundary issues, runtime behavior changes — won't be caught by CI before auto-merge. Mitigated by restricting auto-merge to dev deps + actions only; runtime deps require human review where this gap matters most.
- **Branch protection requires the two named checks** (`ci-lp`, `ci-backend`). Renaming a workflow job silently breaks merge for everyone until protection is updated.
- **Pre-staged ecosystems will log warnings** until `.tf` files / additional workflows appear. Accepted as a one-time noise floor for the future-proofing benefit.
- **Security PRs require manual merge** even when patch-level. For a solo dev this is awareness > speed; teams optimizing time-to-patch should flip this policy.

## Alternatives considered

- **A — No auto-merge, ship only `dependabot.yml`.** Smallest scope, defers all merge work to humans. Rejected because the Monday PR pile would scale faster than triage.
- **B-aggressive — auto-merge security PRs too.** Faster CVE response. Rejected for solo maintainer where CVE awareness > merge latency.
- **C — auto-merge all non-major patch/minor including runtime deps.** Higher freshness, but a `react` patch silently shipping to users is exactly the failure mode we're trying to avoid given CI doesn't run a real build.
- **D — auto-merge everything non-major including terraform.** Rejected; terraform drift is too expensive to undo.
