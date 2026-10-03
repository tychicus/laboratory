# Repository working rules

Read this file at the start of every session before changing this repository.
These rules apply to the entire repository. Read any project-level AGENTS.md
files too. The user's current instructions take precedence.

## Projects and paths

- Each top-level content folder is a separate website project. Repository
  infrastructure folders are not projects.
- Use short, descriptive, lowercase folder names, with hyphens if needed.
  Folder names become public website subpaths, so avoid spaces and long names.
- Current projects: `lab/` (laboratory science) and `signal/` (The Signal Archive).
- The repository-root `index.html` is the shared landing page linking projects.
- Keep project-specific pages, assets, styles, and scripts inside that project's
  folder. Change shared root files only when the task requires it.
- Preserve existing folder names and working URLs unless the user approves a
  change. Check links under the actual project subpath, not only at site root.
- Do not alter unrelated projects, domain configuration (`CNAME`), or deployment
  settings as incidental cleanup.

## Preview before committing or publishing

- Inspect the current repository state and preserve existing user changes.
- Implement and test changes locally first. Give the user a usable preview or
  reviewable file and a concise description of what changed.
- Wait for explicit user approval before committing and pushing those changes.
  A request to build or revise a page does not by itself authorize a commit.
- Do not deploy an alternative hosted copy to bypass this preview-first rule.
- Approval applies to the reviewed changes; new substantive revisions need a
  new review. If approval to commit and push is already explicit, proceed.
- Before committing, inspect the diff and include only the approved files.
  Never discard unrelated changes or force-push without explicit authorization.

## Conventional Commits

- Use Conventional Commits: `type(scope): concise description`.
- Use the project folder as the scope for project work, e.g. `lab` or `signal`.
  Use `home` for the shared landing page and `repo` for repository-wide rules.
- Choose the type that describes the change, such as `feat`, `fix`, `style`,
  `docs`, `refactor`, or `chore`.
- Examples:
  - `feat(home): add project landing page`
  - `fix(lab): preserve image proportions on mobile`
  - `feat(signal): add terminal puzzle`
  - `docs(repo): document project workflow`

## Preserve search-engine directives

- Preserve this exact tag inside the `<head>` of the repository-root
  `index.html` and every project's root `index.html`:

  ```html
  <meta name="robots" content="noindex, nofollow">
  ```

- Include it in newly created HTML pages and preview copies too.
- When editing an existing root index that lacks the tag, add it and mention
  that change in the review. Do not remove or weaken it during redesigns,
  refactoring, template changes, or builds.
- If pages are generated, preserve the directive in the source template as
  well as the output. Verify the final HTML before committing.
- Do not replace this directive with a link-level `nofollow` attribute or a
  `robots.txt` rule. It controls indexing behavior, not access permissions.

## Quality and verification

- Preserve working navigation and project functionality unless asked to change
  them. Reuse the existing implementation rather than rebuilding unnecessarily.
- Make all pages responsive across desktop, tablet, and phone layouts. Preserve
  image aspect ratios and avoid horizontal overflow.
- Keep links and controls usable with keyboard and touch. Respect reduced-motion
  preferences for animation.
- Verify changed links and assets, relevant interactions, and the indexing tag.
  Check browser layout when available; disclose any testing limitations instead
  of claiming a visual check that was not performed.
- Keep credentials, temporary files, and local testing artifacts out of commits.

