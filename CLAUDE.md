# CLAUDE.md

## Project Knowledge

Definitions of unknowns / unknown-unknowns and how we surface them:
[docs/unknown-unknowns.md](docs/unknown-unknowns.md).

## Folder Structure

```bash
├── infrastructure
│   └── terraform // infrastructure IaC codes
└── src
    ├── backend // all backend projects
    └── frontend // all frontend projects
       └── lp // This is the landing page repo.
```

## Commit Convention

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
The `commit-msg` hook is wired up via [`pre-commit`](https://pre-commit.com/) using
[`conventional-pre-commit`](https://github.com/compilerla/conventional-pre-commit).

One-time setup per clone:

```bash
pre-commit install --hook-type commit-msg
git config commit.template .gitmessage   # optional: prefilled template
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
`ci`, `chore`, `revert`.
Format: `type(scope): subject`.

## Dependency Updates

Dependabot watches all four ecosystems: `npm` (lp), `uv` (backend), `terraform`,
`github-actions`. Weekly schedule, Monday 09:00 Asia/Tokyo. Auto-merge policy and
rationale: [docs/adr/0001-dependabot-auto-merge-policy.md](docs/adr/0001-dependabot-auto-merge-policy.md).

Auto-merge requires three GitHub-side settings on a fork or new clone:

```bash
gh api -X PATCH repos/OWNER/REPO \
  -F allow_auto_merge=true -F delete_branch_on_merge=true

gh api -X PUT repos/OWNER/REPO/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": {"strict": true, "contexts": ["ci-lp", "ci-backend"]},
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
JSON
```

If you rename a CI job, update the `contexts` list above or branch protection will
block merges indefinitely.
