---
description: "Use when creating or updating project knowledge, Copilot instructions, custom agents, or skills. Keep claims sourced, scoped, and recently verified."
applyTo:
  - ".github/copilot-instructions.md"
  - ".github/agents/**/*.md"
  - ".github/skills/**/*.md"
  - ".github/instructions/**/*.md"
---

# Knowledge Maintenance

- Inspect the live repository before writing project facts; code, package scripts, test configuration, and test results outrank this summary.
- For external or version-sensitive claims, record an official source URL and the date checked. Do not present model memory as a current source.
- Keep each file focused. Put user-facing project guidance in the README and agent behavior in the relevant existing instruction, skill, or agent file.
- At the end of a meaningful task, capture reusable learnings that are confirmed by repository sources or tests. Update an existing relevant file rather than creating duplicate notes or a separate index.
- Prefer durable conventions, verified root causes, and validated commands. Exclude guesses, one-time debugging details, secrets, and personal data.
- Update `Last reviewed: YYYY-MM-DD` whenever a knowledge file is reviewed or changed.
- Treat repository files as persistent context for future agents, not as automatic model training. Recheck external facts when they are used.
- If a source cannot be checked, label the claim unverified and state the limitation.

Last reviewed: 2026-11-06