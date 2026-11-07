# Portfolio

My personal website, where I document the projects I build: what they do, how they work, what results I got and the problems I ran into along the way.

**Live:** [fyced.github.io](https://fyced.github.io)

## What's in it

- **Home**: a short introduction and the list of projects, styled as a directory. Each project expands in place to show a summary and links. Featured projects are pinned to the top.
- **Project pages**: one page per project, with an overview, how it works, results, challenges and a log.
- **Log**: a timeline of entries for each project (progress, problems, decisions and milestones), so the page shows how the project evolved, not just the final result.
- **Latest updates**: a panel on the home page with the most recent log entries across all projects.

## Built with

- [Astro](https://astro.build), generating a fully static site
- TypeScript
- Plain CSS, with no UI framework
- Markdown for all the content
- GitHub Actions and GitHub Pages for deployment

There is no backend or database: every page is generated at build time from the Markdown files.

## Project structure

```
src/
├── components/        Reusable pieces: header, project row, latest updates…
├── content/
│   ├── projects/      One Markdown file per project
│   └── log/           Log entries, one folder per project
├── data/site.ts       Name, tagline, intro and external links
├── layouts/           Base HTML layout
├── lib/               Helpers for the log (sorting, dates)
├── pages/             Home page and the project page template
└── styles/global.css  Colours, typography and shared styles
templates/             Templates for new projects and log entries
```

## Adding content

I keep the content separate from the code, so adding a project or a log entry doesn't require touching any component.

**New project:** copy `templates/project.md` into `src/content/projects/` and rename it. The file name becomes the URL (`chess-engine.md` → `/projects/chess-engine/`). Fill in the frontmatter and remove the sections I don't need yet.

| Field | Description |
|---|---|
| `title`, `year`, `order` | Name, year and position in the list |
| `tags` | Areas and technologies shown in the list |
| `status` | `active`, `developing`, `exploring`, `research`, `paused` or `finished` |
| `summary` | One or two sentences shown when the row is expanded |
| `featured` | Pins the project to the top of the list (default `false`) |
| `beforeWebsite` | Shows a note that earlier progress isn't documented (default `false`) |
| `links` | Optional `github` and `demo` links |

**New log entry:** copy `templates/log-entry.md` into `src/content/log/<project-name>/` and name it with the date, for example `2026-11-07.md`. Each entry has a `date`, a `title` and a `type` (`progress`, `problem`, `decision` or `milestone`).

## Running it locally

Requires Node.js 22.23.4 or later.

```bash
npm install       # install dependencies
npm run dev       # start the dev server at localhost:4321
npm run build     # build the site into ./dist
npm run preview   # preview the production build
```

## Deployment

Every push to `master` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the site and publishes it to GitHub Pages.
