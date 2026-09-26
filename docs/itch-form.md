# itch.io project form, read verbatim 2026-09-26

Source: https://itch.io/game/new (form class `game_edit_form`), read only, nothing created or
uploaded. Account: dylanmerigaud (dylanmerigaud@gmail.com), email verified same session.

## Top of page

- Warning banner: "You don't have payment configured. If you set a minimum price above 0 no one
  will be able to download your project. Edit account"
- "Make sure everyone can find your page, review our quality guidelines before posting your
  project" (link to guidelines)

## Basics

- **Title** (text, required)
- **Project URL** (auto slug from title, editable): shown as `https://dylanmerigaud.itch.io/<slug>`
- **Short description or tagline** (text, optional): "Shown when we link to your project. Avoid
  duplicating your project's title"

## Classification

Label: "What are you uploading?" One choice, dropdown, default "Games".

1. Games, "A piece of software you can play"
2. Game assets, "Graphics, fonts, music, sounds one may combine into something else"
3. Game mods, "An alteration of the content of a game"
4. Physical games, "One you can play without devices (e.g. board game, print and play)"
5. Albums and soundtracks, "A collection of music"
6. Tools, "A software utility"
7. Comics, "A story told through drawings"
8. Books, "A story told through words"
9. Other

## Kind of project (embed options)

Label: "Kind of project". One choice, dropdown, default "Downloadable". Note under it: "You can
add additional downloadable files for any of the types above."

1. Downloadable, "You only have files to be downloaded"
2. HTML, "You have a ZIP or HTML file that will be played in the browser"
3. Flash, "You have an SWF that will be played in the browser"
4. Java applet, "You have a JAR that will be played in the browser"
5. Unity <= 5.3, "You have a Unity3d file that will be played in the browser"

For a browser playable web build (AURA's likely case), HTML is the option that turns on an embed
instead of a plain download.

## Release status

One choice, dropdown, default "Released".

1. Released, "Project is complete, but might receive some updates"
2. In development, "Project is in active development (or in early access)"
3. On hold, "Development is paused for now"
4. Canceled, "Development has stopped indefinitely"
5. Prototype, "An early prototype for testing an idea out, fate of project unknown"

## Pricing

Three buttons, default "$0 or donate" (active).

1. **$0 or donate**: "Someone downloading your project will be asked for a donation before
   getting access. They can skip to download for free." Shows a "Suggested donation, Default
   donation amount" price field.
2. **Paid**
3. **No payments**

No card, no payment account needed to keep the free/donate default; the banner at top says a
paid minimum price will not work until payment is configured.

## Uploads

- "Upload files" button, or "Choose from Dropbox", or "Add External file"
- "File size limit: 1 GB. Contact us if you need more space"
- "Use butler to upload files: it only uploads what's changed, generates patches for the itch.io
  app, and you can automate it. Get started!" (butler is itch.io's CLI uploader)

## Details

- **Description** (rich text editor, Redactor toolbar: HTML, format, bold, italic, strikethrough,
  lists, table, link, alignment). "This will make up the content of your game page."
- **Genre** (one choice, dropdown, default "No genre"). "Select the category that best describes
  your game. You can pick additional genres with tags below."
  Options: No genre, Action, Adventure, Card Game, Educational, Fighting, Interactive Fiction,
  Platformer, Puzzle, Racing, Rhythm, Role Playing, Shooter, Simulation, Sports, Strategy,
  Survival, Visual Novel, Other.
- **Tags** (multi value, type to filter or enter a custom tag). "Any other keywords someone might
  search to find your game. Max of 10. Avoid using the genre or platforms provided above."
- **AI generation disclosure** (radio, NEW, neither option checked by default). "Please disclose
  if this project contains content produced by generative AI tools such as LLMs, ChatGPT,
  Midjourney, Stable Diffusion, etc, even if you hand edited it."
  - Yes, "This project contains the output of Generative AI"
  - No, "This project does not contain the output of Generative AI"
- **App store links** ("If your project is available on any other stores we'll link to it."), one
  toggle button per store that reveals a URL field: Steam, Apple App Store, Google Play, Amazon
  App Store, Windows Store.
- **Custom noun** (text, optional). "You can change how itch.io refers to your project by
  providing a custom noun. Leave blank to default to: 'game'."

## Community

Radio, default "Comments" (checked). "Build a community for your project by letting people post
to your page."

1. Disabled
2. Comments, "Add a nested comment thread to the bottom of the project page" (default)
3. Discussion board, "Add a dedicated community page with categories, threads, replies and more"

## Visibility and access

Radio, default "Draft" (checked). "Use Draft to review your page before making it public."

1. Draft, "Only those who can edit the project can view the page" (default)
2. Restricted, "Only owners and authorized people can view the page"
3. Public, "Anyone can view the page, you can enable this after you've saved"

## Media

- **Cover image** (upload). "The cover image is used whenever itch.io wants to link to your
  project from another part of the site. Required (Minimum: 315x250, Recommended: 630x500)."
- **Gameplay video or trailer** (URL field). "Provide a link to YouTube or Vimeo."
- **Screenshots** (multi upload, "Add screenshots"). "Screenshots will appear on your game's
  page. Optional but highly recommended. Upload 3 to 5 for best results."

## Submit

Single button at the bottom: "Save & view page" (not clicked, this read stopped before it).
Saving creates the project in Draft visibility by default, so the page stays private until the
Visibility radio is changed to Public.

## Raw form field names (for anyone scripting the fill)

`game[title]`, `game[slug]`, `game[short_text]`, `game[user_classification]`, `game[type]`,
`game[release_status]`, `game[payment_mode]` (hidden, set by the pricing buttons),
`game[min_price]` (hidden), `game[suggested_price]`, `game[description]`, `game[genre]`,
`game[tags]`, `ai_disclosure[ai_generated]`, `game[steam_url]`, `game[app_store_url]`,
`game[google_play_url]`, `game[amazon_appstore_url]`, `game[windows_phone_url]`, `game[noun]`,
`game[instructions]`, `game[community_type]`, `game[published]`, `game[cover_image_id]` (hidden,
set by the upload), `game[video_url]`.
