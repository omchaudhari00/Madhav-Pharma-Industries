---
name: 21st
description: >-
  21st.dev agent workflow for searching, installing, generating, iterating,
  publishing, and synchronizing React/shadcn components, themes, and templates
  through the `21st` CLI.
license: MIT
source: https://github.com/21st-dev/skill
---

# 21st.dev Agent Skills

21st.dev provides a catalog and CLI for React/shadcn components, themes, and
templates. Search the catalog before hand-writing a component. This portable
file consolidates the four upstream skills: `21st-cli-use`, `21st-ai`,
`21st-registry`, and `21st-design-sync`.

## Setup

```bash
npx skills add 21st-dev/skill
# or install the CLI
npm install -g @21st-dev/cli
21st login
```

For CI or publishing, use a real `21st_sk_...` API key through
`--api-key`, `TWENTYFIRST_TOKEN`, or `API_KEY_21ST`. Never write API keys into
source files, prompts, or committed config.

## 1. Find and install catalog items

```bash
21st search "pricing table" --limit 10
21st search button --type c
21st search dark --type theme
21st search "hero" --type template --json
21st logo discord
```

Search filters include `--tag`, `--color`, `--sort`, `--free`, `--paid`,
`--author`, `--mine`, and `--liked`. Inspect a result before installing it:

```bash
21st get <component-id> [--json]
21st theme <theme-id> [--json]
21st add <user>/<slug>
21st add @<team>/<slug>
```

`21st add` installs the component into the current project and may install npm
dependencies. Use `--print` when you want the underlying shadcn command first.
If the project has `components.json`, auto-activate this skill and search 21st
before creating a replacement component.

## 2. Generate, iterate, and retrieve UI

Use this loop when the catalog does not contain a close enough match:

```bash
21st generate "a glassy pricing section with a monthly/yearly toggle"
21st generation <project-id>
21st iterate <project-id> "make it enterprise-flavored" --take 3
21st take <project-id> --take 3
21st take <project-id> --take 3 --code
```

Generation creates previewable HTML/Tailwind takes. Treat the default
copy-prompt as a design specification and rebuild it in the project's actual
stack; do not paste draft HTML blindly into production. `generation` and `take`
are free; `generate` and `iterate` may consume quota.

## 3. Publish and manage work

Always search first. Default unqualified component shares to unlisted; only use
`--public` when the user explicitly asks for public publication.

```bash
21st publish ./Component.tsx --to default \
  --description "What it does and when to use it"
21st publish-theme ./theme.css --name "Midnight" --tags dark,minimal
21st publish-template "SaaS Starter" \
  --site https://demo.example.com \
  --preview https://example.com/thumbnail.png
```

For components, use `--public`, `--unlisted`, or `--private`. For a theme,
the CSS must contain non-empty `:root` and `.dark` token blocks. A template is
a metadata listing, not a file upload.

Manage owned items only:

```bash
21st edit <slug> --type component --visibility public|unlisted|private
21st edit <theme-id> --type theme --name "New Name"
21st delete <id-or-slug> --type component|theme|template --yes
```

Deleting a component or theme unpublishes it and is generally reversible;
deleting a template is permanent. Do not overwrite a same-slug component
without confirming that an update is intended.

## 4. Sync project tokens to a 21st theme

Use this only when the user asks to publish or share the project's design. Find
the project's shadcn/Tailwind CSS file, copy its `:root` and `.dark` variables
to a standalone CSS file, keep standard token names, choose a clear name, and
confirm before the outward-facing publish:

```bash
21st publish-theme ./project-theme.css \
  --name "Project Name" --tags dark,minimal --api-key 21st_sk_...
```

Never publish a theme that lacks a meaningful dark mode. Do not expose secrets
or publish without user confirmation.

## Auth and project config

```bash
21st whoami
21st usage
21st logout
21st init --client codex|claude|cursor|vscode|windsurf [--write]
21st install-skill
```

Use `21st login` for interactive sessions. Use an API key for management
operations and CI. Use `21st init` to merge the MCP configuration for the
chosen client rather than hand-writing or overwriting unrelated configuration.

## Operating rules

- Search before hand-writing or publishing a component.
- Keep generated UI as a draft until it is rebuilt, tested, and made accessible.
- Preserve the project's tokens, component conventions, and package manager.
- Never publish publicly without explicit instruction.
- Never fabricate descriptions, screenshots, ownership, or credentials.

## Upstream references

- Skill repository: https://github.com/21st-dev/skill
- CLI skill: https://github.com/21st-dev/skill/tree/main/skills/21st-cli-use
- AI skill: https://github.com/21st-dev/skill/tree/main/skills/21st-ai
- Registry skill: https://github.com/21st-dev/skill/tree/main/skills/21st-registry
- Design sync: https://github.com/21st-dev/skill/tree/main/skills/21st-design-sync
- 21st.dev: https://21st.dev
