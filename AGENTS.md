# Repository working rules

Read this file at the start of every session before changing this repository.
These rules apply to the entire repository. Read any project-level AGENTS.md
files too. The user's current instructions take precedence.

## Projects and paths

- Each top-level content folder is a separate website project. Repository
  infrastructure folders are not projects.
- Use short, descriptive, lowercase folder names, with hyphens if needed.
  Folder names become public website subpaths, so avoid spaces and long names.
- Current projects: `lab/` (laboratory science), `mrsoswald/` (Dana's classroom), and `signal/` (The Signal Archive).
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

## File organization, size budgets, and AI-friendly maintenance

These rules apply to **every** site in this repository, including the Lab,
Dana's classroom (`mrsoswald/`), The Signal Archive, the root landing page,
and any future sites.

- Keep HTML, CSS, JavaScript, data, and media logically separated. Prefer
  modular, descriptively named files over monolithic inline HTML pages.
- Target less than **200 KB** for hand-maintained HTML, CSS, and JS files.
  At **250 KB**, review and split by responsibility where practical; above
  **500 KB**, do not add more functionality to that file without a documented
  reason and a plan to modularize it. These are maintainability thresholds,
  not arbitrary runtime restrictions or limits for generated/vendor files.
- Keep major features in their own modules and place reusable styles or
  utilities in appropriately scoped shared files. Avoid needless fragmentation
  into tiny files; group tightly related functionality.
- Use external JS and CSS where feasible. Preserve execution order, relative
  URLs, event behavior, and compatibility with GitHub Pages subpaths.
- Keep large images, fonts, audio, and video as separate assets, optimize
  them for delivery, and avoid embedding them as giant base64 strings in
  source files. Do not split binary files as if they were code.
- When adding a feature, check whether existing files are approaching size
  thresholds. Refactor the relevant area before making an oversized file
  substantially larger. Do not silently rewrite unrelated functionality.
- For existing oversized files (notably `signal/index.html`), plan a
  careful, incremental extraction. Keep the original or a recoverable
  Git revision, verify the refactor locally, and only publish with the
  user's approval under the preview-before-commit rule.
- During AI-assisted edits, retrieve repository structure, file metadata,
  targeted line ranges, or small excerpts first. Never dump multi-megabyte
  files, full encoded assets, or huge tool responses into chat merely to
  inspect them. If a source file exceeds safe tool limits, use local
  scripts, streaming/range reads, or selective extraction instead.
- Before committing, inspect touched source-file sizes and report any
  newly introduced size-budget exceptions with a reason. Avoid making an
  oversized file larger without explicitly flagging it.
- Do not make disruptive refactors simply to meet a number. Functional
  parity, accessible behavior, working links, and preservation of user
  changes take priority over any particular file-size target.

