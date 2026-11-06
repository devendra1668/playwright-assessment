---
name: knowledge-refresh
description: "Use when asked to refresh, audit, verify, or update stale workspace agent knowledge, Copilot instructions, custom agents, skills, or project documentation. Check repository sources and current official docs, then update review dates."
argument-hint: "Name the knowledge area or files to review"
---

# Refresh Workspace Knowledge

Use this workflow when project guidance may be stale or when a user asks for the latest verified knowledge.

## Procedure

1. Read `README.md` and identify only the related guidance files.
2. Inspect current source files, scripts, configuration, and tests before carrying forward project facts.
3. For version-sensitive or external behavior, consult official documentation, release notes, or a fresh live test. Record the URL and date checked.
4. Identify durable learnings from the current task: confirmed conventions, validated commands, non-obvious constraints, or root causes likely to recur.
5. Update the smallest relevant set of existing knowledge files. Keep `Last reviewed: YYYY-MM-DD` current and link important claims to evidence.
6. Exclude secrets, personal data, guesses, and one-off debugging details. If no reusable fact emerged, leave the knowledge base unchanged.
7. If code, commands, or configuration changed, run the relevant type-check or test command, then report what was verified and what remains uncertain.

## Learning Model

Knowledge persists through reviewed repository files and instructions for future agents. This is not automatic model training: agents must verify current sources and explicitly update the relevant files.

Last reviewed: 2026-11-06