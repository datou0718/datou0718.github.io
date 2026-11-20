# Editing your website

All paths below are relative to this folder. Edit the source files here, then
run `npm run check` from the repository root and `npm run preview` to review.
Use `npm run dev` for a live preview while editing.

| What to update | File or folder |
| --- | --- |
| Name, title, email, social links, research interests, education, experience, awards, teaching, reviewer entries, site URL | [profile.json](profile.json) |
| Short biography and its research question | [bio.md](bio.md) |
| Recent news | [news.json](news.json) |
| Publications, selected papers, research questions, figure paths | [publications.json](publications.json) |
| Post titles, dates, descriptions, and URLs | [posts.json](posts.json) |
| Post text | [posts/](posts/) |
| CV | [public/assets/CV.pdf](public/assets/CV.pdf) |
| Headshot (also used as the favicon) | [public/assets/me.jpg](public/assets/me.jpg) |
| Publication figures | [public/assets/publications/](public/assets/publications/) |
| Institution logos and fallback initials/colors | [institutions.json](institutions.json), [public/logos/](public/logos/) |
| Google ownership verification | [public/google8053d0725209f494.html](public/google8053d0725209f494.html) |

## Profile and biography

Edit values in `profile.json` using standard JSON: double quotes, no comments,
and no trailing commas. Lists appear in the order you specify. The name is
also used in the copyright, publication author emphasis, and search metadata.
`siteUrl` supplies the canonical URLs, sitemap, and social metadata.

Write the biography as Markdown in `bio.md`. Keep the research question in
triple asterisks for the existing bold, italic serif styling:

```md
***Is in-memory computing the future of computer architecture?***
```

Reviewer tags use the `reviewer` array in `profile.json`:

```json
"reviewer": [{ "venue": "ISCAS", "years": "2026" }]
```

Reviewer remains visible on mobile; Research Interests is hidden there.

## News

Add new entries at the top of `news.json`, with `date` and `content` fields.
Keep dates in `YYYY-MM-DD` format. The first three entries are visible; further
entries are accessible by scrolling the news panel.

The `content` field supports inline Markdown. Wrap any words in `**` to make
only those words bold:

```json
{
  "date": "2026-04-22",
  "content": "**RETENTION** is accepted by **TCAD**!"
}
```

Plain text still works; you can mix normal text and multiple bold phrases in
the same entry.

## Publications

Edit `publications.json`; its order controls the display order. Set
`"selected": true` to include a paper on the homepage. All entries appear on
the Publications page.

Use `researchQuestion` for the italic serif callout. It is plain text, so no
Markdown markers are needed. Omit it or leave it empty to hide the callout.
Store figures in `public/assets/publications/` and reference them like this:

```json
"researchQuestion": "Your research question goes here.",
"figure": {
  "src": "/assets/publications/retention-overview.png",
  "alt": "A description of the paper figure.",
  "width": 1600,
  "height": 834
}
```

Use the image's actual pixel dimensions. Figures are non-interactive and shown
without cropping; omit `figure` for a text-only card. Authors remain visible,
while the venue and abstract appear under **Details & abstract**. Author lists
and expanded details/abstracts use justified alignment. Write abstracts as plain
text (for example, `top-k` and `22.3×`), without LaTeX commands or math delimiters.

The RE-CAM image is Figure 1 (conceptual readout enhancement), rendered from
the author's original `Figure/teaser.pdf` at 1600 × 966 pixels.
The RETENTION image comes from Figure 2 of the author's `TCAD2025/graph.pdf`.
The CAIMS image is Figure 3 (overview of CAIMS) from
the [CAIMS paper](https://arxiv.org/abs/2611.25141), rendered from the original
`Arxiv/Figures/Overview.pdf` at 1600 × 817 pixels with its crop box and colors
preserved.

## Posts

1. Write a Markdown file directly in `posts/`.
2. Add an entry to `posts.json` with `id`, `title`, `date`, `description`, and
   `file`, using an existing entry as a template.
3. Match `file` to the Markdown filename. `id` determines the URL
   `/posts/<id>/`; keep existing IDs to preserve links.

Headings generate the table of contents. New posts are included in the static
build and sitemap automatically.

## Assets and logos

Replace `public/assets/CV.pdf` or `public/assets/me.jpg` to update them without
changing links. If you choose new filenames, update `cv` or `headshot` in
`profile.json`. The headshot also supplies the favicon and social preview image.

Files inside `public/` keep URLs relative to the website root: for example,
`public/assets/CV.pdf` is served at `/assets/CV.pdf`, not `/content/public/…`.

To add an institution logo, place it in `public/logos/` and add an entry to
`institutions.json`. Its key must exactly match the institution or organization
name in your profile. Each entry has `logo` and `initials`; the optional `color`
sets the fallback background if the logo cannot load. Unlisted institutions
use their first letter on the theme's primary color.

Keep Google's verification file and its contents unchanged. It continues to
be served at `/google8053d0725209f494.html`; the generated sitemap remains at
`/sitemap.xml`. Both are included in every production build.
