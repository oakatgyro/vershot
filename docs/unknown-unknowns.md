# Unknown-Unknowns: Definitions for This Project

Based on ["A Field Guide to Claude Fable: Finding Your Unknowns"](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns)
by Thariq Shihipar (Anthropic, Claude Code team).

## Core idea: the map vs. the territory

A prompt (plus skills and context) is a **map** of the work to be done. The
codebase and its real constraints are the **territory**. Anything that blocks
an agent — or a human — is usually not the model; it is the gap between the
map and the territory. Those gaps are the *unknowns*, and they come in four
kinds.

## The four quadrants

|                                | You know it                                  | You don't know it                                 |
| ------------------------------ | -------------------------------------------- | ------------------------------------------------- |
| **Aware of your knowledge**    | **Known knowns** — what's in your prompt     | **Known unknowns** — ambiguities not yet resolved |
| **Unaware of your knowledge**  | **Unknown knowns** — details you'd recognize on sight but forgot to state | **Unknown unknowns** — what you haven't even considered |

- **Known knowns** — Requirements you have already written down. They are in
  the prompt, the spec, or the docs. The agent has them.
- **Known unknowns** — Questions you know exist but haven't answered yet
  ("which auth provider?", "what happens on empty state?"). You can list them;
  you just haven't resolved them.
- **Unknown knowns** — Things you *do* know but didn't think to say, because
  they feel obvious to you. You would instantly recognize the mistake in a
  review ("we never use default exports", "that copy is off-brand"), but the
  knowledge lived only in your head.
- **Unknown unknowns** — Gaps you are not aware of at all: constraints,
  edge cases, and interactions that neither you nor the prompt anticipated.
  They cannot be listed up front by definition — they can only be *surfaced*
  by deliberate techniques.

## Definition of an unknown-unknown in vershot

For this repository, an **unknown-unknown** is:

> A constraint, dependency, or side effect that is real in the territory
> (codebase, CI, infrastructure, or product) but is absent from the map
> (prompt, CLAUDE.md, ADRs, and docs) — and whose absence nobody noticed
> until it broke something.

Concrete examples of the *kind* of thing that has this shape here:

- **Version drift vs. training data** — `src/frontend/lp` uses a Next.js
  version with breaking changes from what agents "remember"
  (see `src/frontend/lp/AGENTS.md`). Any API assumed from memory instead of
  `node_modules/next/dist/docs/` is a candidate unknown-unknown.
- **Invisible coupling between names and settings** — renaming a CI job
  (`ci-lp`, `ci-backend`) silently breaks branch protection and blocks all
  merges (see root `CLAUDE.md`). The coupling exists in GitHub settings, not
  in code, so a code-only reading of the repo will never reveal it.
- **Documented-but-absent structure** — `CLAUDE.md` describes an
  `infrastructure/terraform` directory that does not exist yet. A map that is
  *ahead of* the territory misleads exactly like one that is behind it.
- **Policy encoded outside the repo** — Dependabot auto-merge behavior
  depends on GitHub-side settings applied per clone/fork
  (see `docs/adr/0001-dependabot-auto-merge-policy.md`); a fresh fork
  silently lacks them.

## How we surface unknowns (by stage)

The field guide's techniques, adopted for this project:

### Before implementation

1. **Blindspot pass** — Before writing code in unfamiliar territory, ask the
   agent to list the questions you *should* be asking and the knowledge gaps
   in the plan.
2. **Design directions** — For UI work (the landing page), generate several
   divergent prototypes first to surface visual/architectural preferences you
   didn't know you had.
3. **Reverse interview ("interview me")** — Have the agent interview you,
   prioritizing questions whose answers would change the architecture. This
   converts unknown knowns into known knowns.
4. **Reference hunt** — Point at existing code whose semantics should be
   ported, instead of describing behavior from scratch.
5. **Implementation plan ordered by volatility** — Order tasks by how likely
   they are to change, not chronologically, so unknowns surface while they
   are still cheap.

### During implementation

6. **Implementation notes** — Log deviations, edge cases, and decisions
   discovered mid-flight. Each note is an unknown that just became known —
   promote durable ones into an ADR or the relevant `CLAUDE.md`/`AGENTS.md`.

### After implementation

7. **Pitch / explainer** — Package the spec, result, and notes into a
   self-contained review document so a reviewer can find gaps without
   re-deriving context.
8. **Change quiz** — Before merging, test your own understanding of the
   change; what you can't answer is your next known unknown.

## Working rule

When an unknown-unknown is discovered (usually because something broke or a
review caught it), don't just fix the bug — **move the knowledge into the
map**: an ADR in `docs/adr/`, a note in the closest `CLAUDE.md`/`AGENTS.md`,
or a comment stating the non-obvious constraint. The goal is that each
unknown-unknown can only surprise this project once.
