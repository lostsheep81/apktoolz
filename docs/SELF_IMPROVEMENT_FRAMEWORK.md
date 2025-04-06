# Self-Improvement Framework

This document outlines the components and workflow designed to foster continuous learning and improvement within the `apktoolz` project. It builds upon the initial `SELF_PROMPT.md` guide.

## Goal

To move beyond periodic self-reflection towards a more integrated, traceable, and actionable system for identifying and implementing improvements in our development practices, code quality, and overall process.

## Core Components

1.  **`SELF_PROMPT.md`**:
    *   **Purpose**: The master list of questions designed to provoke thought about various aspects of the project (testing, documentation, CI/CD, etc.).
    *   **Usage**: Refer to this list when reflecting on work, planning changes, or during dedicated review sessions. Consider adding tags (e.g., `#testing`, `#performance`) to prompts for easier filtering.

2.  **`SELF_PROMPT_JOURNAL.md`**:
    *   **Purpose**: The logbook for recording reflections triggered by the prompts. It now uses a structured format.
    *   **Usage**: Create entries whenever a prompt leads to significant insight or action. Use the defined structure (`Date`, `Category`, `Prompt Used`, `Related`, `Insights`, `Actions`, `Effectiveness`, `Refinements`). Crucially, link entries to specific **Related** items like Git commits, issue numbers, or file paths where possible.

3.  **`scripts/prompt_helper.sh` (Optional/Example)**:
    *   **Purpose**: A utility script to streamline interaction with the framework.
    *   **Potential Usage**:
        *   `./scripts/prompt_helper.sh journal`: Guides the user through creating a new journal entry using the standard template.
        *   `./scripts/prompt_helper.sh suggest [category]`: Suggests prompts, potentially filtering by category or prioritizing unused ones (future enhancement).
    *   **Status**: Conceptual; requires implementation if desired.

4.  **Git Hooks (e.g., `hooks/pre-commit`)**:
    *   **Purpose**: Provide automated, context-aware reminders to engage with the self-prompting process.
    *   **Usage**: A simple pre-commit hook might remind the developer to consider adding a journal entry if significant changes are being committed.
    *   **Status**: Example provided; needs to be installed (`ln -s ../../hooks/pre-commit .git/hooks/pre-commit`) and potentially customized.

## Workflow

1.  **During Development**: As you work on features, fixes, or refactoring, keep the prompts in `SELF_PROMPT.md` in mind.
2.  **Significant Change/Completion**: When committing significant changes, fixing a complex bug, or completing a feature:
    *   The `pre-commit` hook (if installed) may remind you to reflect.
    *   **Reflect**: Choose a relevant prompt from `SELF_PROMPT.md`.
    *   **Journal**: Use `./scripts/prompt_helper.sh journal` or manually edit `SELF_PROMPT_JOURNAL.md` to record your insights, actions, and link it to the commit (`Related: <commit_sha>`).
3.  **Periodic Review (Weekly/Bi-weekly)**:
    *   Review recent journal entries. Are actions being followed up?
    *   Scan `SELF_PROMPT.md` for any areas not recently considered.
4.  **Quarterly Analysis**:
    *   Follow the steps outlined in `SELF_PROMPT_JOURNAL.md` to analyze the journal's effectiveness.
    *   **Update `SELF_PROMPT.md`**: Add new relevant prompts, refine existing ones, and remove obsolete ones based on the analysis. This closes the loop, making the framework *self-improving*.

## Benefits

*   **Traceability**: Connects insights and actions directly to code changes or issues.
*   **Consistency**: Encourages more regular reflection through reminders and tooling.
*   **Data-Driven Improvement**: Structured journal entries allow for analysis to identify recurring issues or effective practices.
*   **Adaptive Prompts**: The quarterly review ensures the prompts themselves stay relevant to the project's evolving needs.

Happy Improving!