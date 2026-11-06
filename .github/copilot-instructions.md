# Workspace Agent Guidance

- Treat repository files and current test output as the source of truth; use the project README and relevant instructions as orientation, not as a substitute for checking code.
- For time-sensitive framework, dependency, or external-site behavior, verify current official documentation or live behavior before stating it as fact. Mark anything you cannot verify.
- After each meaningful task, identify any durable, verified project learning and add or revise it in the README or the relevant existing instruction, skill, or agent. Link the source and date the verification.
- Do not save secrets, personal details, guesses, or one-off debugging noise as project knowledge. Repository notes persist for future agents; they do not train or update model weights.
- Use the `knowledge-refresh` skill for explicit audits. Do not create a separate script or workflow for knowledge updates unless requested.

Last reviewed: 2026-11-06