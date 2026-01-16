---
name: release-management
description: Workflow for updating versions and changelogs for the eng-vocabulary project. Triggered by requests like "update version", "new release", or "write changelog".
---

# Release Management Workflow

This workflow ensures consistency between the version in the code, the user interface, and the change history.

## Steps to Execute

### 1. Change History Analysis (Changelog Generation)

- **Action:** Run `git log` from the last version or recent commits.
- **Requirement:** Summarize changes into groups: `Features`, `Fixes`, `Improvements`.
- **Language:** Changelog WITHIN THE CODE must be written in **English** for professional consistency.

- **Action:** Increment the version (patch, minor, or major per request) in the `package.json` file.

### 3. UI Synchronization

- **Action:** Update the latest content in the relevant UI component (e.g., `ChangelogModal.tsx` or `About.tsx`).
- **Note:** Ensure the displayed version number is also synchronized throughout the application.

### 4. Final Verification

- [ ] Version in `package.json` matches `ChangelogModal.tsx`.
- [ ] Changelog content accurately reflects the actually performed Git history.
- [ ] Changelog language is English.

---

## Triggers

- "Update version for me"
- "Write changelog for this release"
- "Increment version to v1.x.x"
