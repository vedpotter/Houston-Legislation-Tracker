# Houston Legislation Tracker: your guide

This is the guide for running your website. You never need to touch the code to add legislation, timeline events, or articles. You only edit text files in the **content** folder.

---

## 1. Before you publish: a checklist

1. **Check the facts.** The three real laws in the site (SB 10, SB 11, HB 1481) were researched from official and news sources, but you are the publisher. Click every source link and confirm the details you plan to publish. Two things to double-check on the Texas Legislature Online (capitol.texas.gov) history pages: the exact date SB 11 was signed (reports differ between June 20 and June 21, 2025), and the sponsors listed for each bill.
2. **Delete the demo.** Delete `content/legislation/demo-student-voter-registration.md`. It is a made-up example, and it is labeled as demo content on the site.
3. **Set your social links and site address.** Open `content/site.json` and replace the `YOUR_HANDLE` placeholders. After you deploy (section 6), set `"url"` to your real web address and add a `"contactEmail"` if you want one shown on the About page.
4. **Change the dates on the sample articles** to the day you actually publish them. They are set to September 20, 2026.

---

## 2. What is where

```
content/                      <- YOU WORK HERE
  site.json                   Site name, tagline, social links, topic list
  legislation/                One .md file per law
  articles/                   One .md file per article
  _templates/                 Blank copies to duplicate (files starting with _ are ignored)
public/images/                Put photos here
src/                          The website's code. Ignore unless you want to redesign.
  app/page.tsx                The homepage layout
  app/about/page.tsx          The About page text
```

A `.md` file is a plain text file with two parts. The top part, between two lines of `---`, is a list of labeled fields (title, date, status). The bottom part is the writing.

---

## 3. Add a new piece of legislation

1. Go to your repository on GitHub (section 6), open **content → _templates**, and open `legislation.md`.
2. Click the **copy icon** to copy the text.
3. Go back to **content → legislation**. Click **Add file → Create new file**.
4. Type a file name in lowercase with dashes, ending in `.md`, for example `school-lunch-funding.md`. **This becomes the web address**: `/legislation/school-lunch-funding`.
5. Paste the template. Fill in every field. The notes that start with `#` explain each one.
6. Write the four sections at the bottom (What is this? / Why does it matter? / What does the law actually say? / How could this affect students?).
7. Click **Commit changes**. In about a minute the site updates.

**Rules that keep you out of trouble**

- Put text in quote marks. If your text contains a colon, it must be in quotes.
- `category` must be one of the topic names listed in the template.
- `status` must be exactly one of the listed statuses.
- Use real bill numbers and real links. If you need a stand-in link, add `placeholder: true` to that source and the site will label it.
- If you make a mistake, the site will not publish the broken version. Vercel shows an error that names the file and the field, and your live site stays as it was.

---

## 4. Add an update (the thing you will do most)

An update is a new **article** connected to an existing law.

1. Open **content → _templates → article.md** and copy it.
2. Go to **content → articles → Add file → Create new file**. Name it, for example, `sb-10-update-december.md`.
3. Paste it and fill in the fields. The important two:
   - `legislation: ten-commandments-in-classrooms` (the **file name** of the law, without `.md`)
   - `articleType: update`
4. Write the article under the second `---`.
5. Commit.

That is all. Automatically, the new article appears in the law's **All updates** list, becomes its **Latest update**, moves the law's **Last updated** date, and shows up on the homepage's **Latest updates**, the topic page, and search. The article also shows the earlier articles about that law under **Previous updates**.

### Add a timeline event

Timeline events live inside the law's own file. Open **content → legislation → the law's file**, click the pencil icon, and add a block under `timeline:`:

```yaml
  - date: 2026-11-05
    type: court
    title: "Supreme Court agrees to hear the case"
    description: "One or two factual sentences."
    source:
      label: "Name of source"
      url: "https://..."
```

Keep the two-space indentation the same as the events above it. The newest event is marked "Latest" automatically. If the status changed, also update `status` and `statusNote` at the top of the file.

### Other everyday edits

| I want to... | Do this |
|---|---|
| Edit a law or article | Open the file on GitHub, click the pencil icon, edit, commit |
| Update an article's date | Add or change `updatedDate: 2026-10-05` in the article's top section |
| Add a source | Add another block under `sources:` |
| Add an image | See below |
| Feature a law on the homepage | Add `featured: true` to the law's file |
| Change the tagline or social links | Edit `content/site.json` |
| Add a new topic | Add a block to `topics` in `content/site.json` |

**Adding an image to an article:** in GitHub open **public → images**, click **Add file → Upload files**, and upload the picture. Then in the article's top section add:

```yaml
heroImage: /images/your-file-name.jpg
heroImageAlt: "Describe the picture for people who cannot see it"
heroImageCredit: "Photo: Name, Source"
```

Use pictures you own or have permission to use.

---

## 5. Change the homepage

- **Featured legislation, Latest updates, Topics, and the "Now tracking" box** are built from your content. To change what appears, change the content (for example `featured: true`, or publish a new article).
- **Hero text (title and description)**: the tagline and description come from `content/site.json`.
- **Other homepage wording** ("Why this exists", section headings): open `src/app/page.tsx` on GitHub, click the pencil, and edit the words between the tags. Do not change anything inside `{ }` or `< >` unless you know what it does.
- **About page wording**: `src/app/about/page.tsx`, same way.

---

## 6. Publish the site (one time)

You need two free accounts: **GitHub** (stores your files) and **Vercel** (puts the site on the internet).

1. **Create a GitHub account** at github.com.
2. **Create a repository:** click **+ → New repository**. Name it `houston-legislation-tracker`. Leave it public or private (either works). Click **Create repository**.
3. **Upload the project:** unzip the project folder on your computer. On the new repository page, click **uploading an existing file**. Drag in everything from *inside* the folder (the `content`, `public`, and `src` folders and the loose files). Do not upload a `node_modules` folder if you ever have one. Scroll down and click **Commit changes**. (The project is 57 files, under GitHub's 100-file limit for browser uploads. If you have trouble, install the free GitHub Desktop app and drag the folder in.)
4. **Create a Vercel account** at vercel.com and choose **Continue with GitHub**.
5. Click **Add New → Project**, pick your repository, and click **Deploy**. Leave every setting as it is. In about a minute you get a web address like `houston-legislation-tracker.vercel.app`.
6. **Set the address in the site:** edit `content/site.json` on GitHub and change `"url"` to that address. Commit. (This makes share links and search-engine tags correct.)
7. **Optional, later:** buy a custom domain and connect it in Vercel under **Settings → Domains**.

### How updates go live

Every time you commit a change on GitHub, Vercel automatically rebuilds and republishes the site, usually in about a minute. You can watch progress in the Vercel dashboard. If a build fails (for example a typo in a file), Vercel keeps the old version live and shows an error that names the file and field.

---

## 7. Running it on your own computer (optional)

You do not need this to publish. If you want to preview changes before publishing:

1. Install Node.js (the LTS version) from nodejs.org.
2. In a terminal, open the project folder and run `npm install` once.
3. Run `npm run dev` and open http://localhost:3000.

---

## 8. What each technology does

- **Website / HTML / CSS:** the pages you see in a browser.
- **React:** a toolkit for building pages out of reusable pieces, like a "legislation card" that is designed once and used everywhere.
- **Next.js:** builds on React. It turns your files into fast pages, creates clean web addresses like `/legislation/school-phone-ban`, and makes the pages easy for Google to read.
- **TypeScript:** JavaScript with spell-check. It catches mistakes in the code before the site goes live.
- **Tailwind CSS:** the way the site is styled. Short labels in the code, like `text-xl font-bold`, control size, weight, and color.
- **Markdown (.md):** a simple way to write text with a little formatting. `## Heading` makes a heading and `**bold**` makes bold text.
- **CMS (content management system):** a login page with forms for adding content. This project does not use one yet. Your content files do the job. If you later want forms, a tool such as Keystatic can be added without redoing your content.
- **GitHub:** a website that stores your files and remembers every change ever made, so you can undo a mistake.
- **Vercel:** the company that hosts your site. It watches GitHub and republishes automatically.

---

## 9. How the pieces connect

```
Legislation file  ---- timeline (inside the file)
      |
      +---- Articles that name it in "legislation:"  ----> All updates, Latest update, Last updated
      |
      +---- Sources (inside the file)
```

Topic pages, search, the homepage, and the sitemap are all generated from these files.

---

## 10. Later ideas (not built yet, so the first version stays simple)

Email newsletter, "follow this law" alerts, RSS feed, legislator profiles, bill comparison, a legislative calendar, dark mode.
