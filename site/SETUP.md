# Sara Sadr Jahani — Portfolio (Jekyll)

## Run it

```
docker compose up --build
```

The `--build` matters the first time (and any time you change the `Gemfile` or `Dockerfile`)
so it actually installs gems instead of using a stale cached image. After that, plain
`docker compose up` is enough.

Then open **http://localhost:4000**. Any file you save is live-reloaded in the browser automatically (via the `35729` livereload port). First build takes a bit longer (installing gems); after that, `bundle_cache` is reused so restarts are fast.

To stop: `Ctrl+C`, then `docker compose down` if you want to remove the containers.

**If the build fails on `bundle install`:** this site uses a plain `jekyll` Gemfile (not the
heavier `github-pages` metagem), specifically to avoid the version-pinning/native-compile
issues that gem is known for in Docker. If you still hit a gem error, it's almost always one
of:
- **Stale cached gems in the `bundle_cache` volume** — this is the most common one. Gems
  installed inside a `docker build` land in the image layer, but at runtime the
  `bundle_cache:/usr/local/bundle` volume in `docker-compose.yml` mounts right over that path
  and shadows it — so if that volume was ever populated under an *older* Gemfile (e.g. before
  a `jekyll` version bump), the container keeps using those old cached gems no matter how many
  times you rebuild the image. Symptom: an error like `Could not find gem 'jekyll (~> 4.3)' in
  locally installed gems... source contains jekyll-3.10.0`. Fix: wipe the volume, not just the
  image —
  ```
  docker compose down -v
  docker compose build --no-cache
  docker compose up
  ```
  The `-v` is the part that matters; a plain `docker compose down` leaves the volume intact.
- **Stale image** (less common, no old-version symptom) — run `docker compose build --no-cache` once, then `docker compose up`.
- **A leftover `Gemfile.lock`** from a previous attempt with different gem versions — delete
  it and rebuild; Bundler will regenerate one that matches this Gemfile.
- **No network access from inside the container** (corporate proxy/firewall) — `bundle
  install` needs to reach rubygems.org.

## Editing content — everything lives in `_data/*.json`

You never need to touch HTML/Liquid to update your info. Just edit the relevant JSON file and save — the dev server picks it up automatically.

| File | Powers | Fields |
|---|---|---|
| `_data/education.json` | CV → Education | `years`, `role`, `org`, `description` (optional) |
| `_data/experience.json` | CV → Experience | `years`, `role`, `org`, `description` (optional) |
| `_data/research_experience.json` | CV → Research Experience | same as above |
| `_data/awards.json` | CV → Honours & Awards | `years`, `role`, `org` |
| `_data/skills.json` | CV → Tools & Methods | flat array of strings |
| `_data/projects.json` | Projects page | `num`, `title`, `description`, `tags` (array), `link` |
| `_data/news.json` | News page | `date`, `html` (can include `<a>`/`<strong>` tags) |
| `_data/home_focus.json` | Home → "What I work on" (3 cards) | `title`, `description` |
| `_data/tags.json` | Home hero chips | flat array of strings |
| `_data/research.json` | Research page | `eyebrow`, `title`, `lede`, `paragraphs` (array), `focus` (array of `title`/`description`) |

**Adding a new entry** — e.g. a new job in `experience.json` — just add a new object to the array:

```json
{
  "years": "May 2025 — Present",
  "role": "Senior Data Scientist",
  "org": "New Company, Remote",
  "description": "What you did there."
}
```

Order in the array = order on the page (top of array = top of page), so put your newest entries first.

## Site-wide fields (name, email, bio, etc.)

These live in `_config.yml` — `author`, `email`, `phone`, `location`, `hero_bio`, `role_line`, `job_title`, etc. Editing `_config.yml` requires a container restart to take effect (`docker compose restart`), unlike `_data/*.json` which live-reloads.

## Assets

- `assets/img/profile.jpg` — hero photo
- `assets/img/wave-motif.svg` — decorative background motif (hero + page headers)
- `assets/cv-sara-sadr-jahani.pdf` — **not included yet.** Drop your CV PDF at this exact path (referenced by `site.cv_pdf` in `_config.yml`) so the "Download PDF" buttons work.

## CV floating section nav

The CV page has a "jump to section" nav that fades in once you scroll past the page header —
Education, Experience, Research Experience, Awards, Skills, Languages, Volunteering, Academic
Service, References — but it isn't the same layout at every screen size:

- **Desktop** (above 800px): a vertical icon rail on the right edge, vertically centered.
  Hovering an icon (or scrolling into that section) expands it into a colored pill with its
  label — no click needed to see where you are.
- **Mobile** (800px and below): a completely different layout, not a shrunk-down version of
  the desktop one — a slim horizontal bar pinned to the bottom of the screen, with labels
  always visible on each chip and the active one highlighted. If it doesn't fit, it scrolls
  sideways rather than stacking down the screen.

That split exists because a 9-item vertical list, even doing nothing but sitting there, ends
up dominating most of a phone screen's height when centered vertically — which is exactly what
the base file's dock ran into (solved there by just hiding it below 1024px). A fixed-height
horizontal bar can't have that problem no matter how many sections you add.

It only appears on `/cv/`. If you add or reorder CV sections, keep the `id` on each
`<section>` in `_includes/cv.html` in sync with the `data-section` values in
`_includes/cv-dock.html`, and give the new item a Font Awesome icon consistent with the others.

## Responsive behavior

The layout steps down through three tiers rather than jumping straight to mobile:
- **≤1024px** — tighter grid gaps and section padding (still multi-column)
- **≤800px** — hero, about/focus grids, and project grid collapse to a single column; nav switches to the hamburger menu

## Pages / routes


Plus one route per project write-up (see below): `/projects/<slug>/`

## Project write-ups — math, images, code, pseudocode, diagrams

Each card on the Projects page can link to its own full write-up page, written in Markdown
with the same rich formatting the base file supported. These live in `_research/*.md` (one
file per project) and use the `research-project` layout.

**The full reference, with copy-pasteable examples of every feature, is at `/projects/style-guide/`** (not linked in the nav — it's a private reference page, same as the base file's `/research/style-guide/`). It covers:

- **Math** — inline `$E=mc^2$` and display `$$...$$` via KaTeX
- **Images** — plain `![]()` or captioned `<figure class="research-figure">` blocks
- **Tables** — standard Markdown tables
- **Code blocks** — syntax-highlighted, with a copy button, via fenced ` ```python ` blocks
- **Code tabs** — click-to-switch panels for showing the same snippet in multiple languages
- **Pseudocode** — LaTeX `algorithmic`-style fenced ` ```pseudocode ` blocks, typeset with line numbers
- **Diagrams** — [Mermaid](https://mermaid.js.org/) flowcharts/sequence diagrams in fenced ` ```mermaid ` blocks
- **Video/audio** — plain HTML5 `<video>`/`<audio>`, or a responsive `<div class="research-video">` wrapper for embedded YouTube/Vimeo
- **Footnotes** — standard kramdown `[^1]` syntax
- **Heading anchors** — automatic `#` permalinks on every `##`/`###`
- **Links section** — set `links.code` / `links.demo` / `links.paper` in front matter and the buttons appear automatically at the bottom of the page

**Adding a new project write-up:**

1. Copy `_research/siamese-bert-sentence-scorer.md` (or any existing one) to a new file, e.g. `_research/my-project.md` — the filename becomes the URL (`/projects/my-project/`).
2. Edit the front matter: `title`, `subtitle`, `description`, `status`, `date`, `tags`, `order`, optional `thumbnail` and `links`.
3. Write the body in Markdown below the `---`.
4. Point that project's `link` field in `_data/projects.json` at `/projects/my-project/`.

Six real examples are already included (`social-graph-analytics.md`, `siamese-bert-sentence-scorer.md`, `dynamic-pricing-optimizer.md`, `traffic-flow-forecasting.md`, `fraud-sentiment-detection.md`, `ecommerce-pipeline-automation.md`), each demonstrating a couple of these features in context — copy the patterns you need from whichever is closest to what you're writing.

