# Signature assets — stable URLs, do not rename

These files are hot-linked from email signatures and other places outside
this repo. Their URLs are a public contract:

    https://skralli.is/signature/skralli-logo.png
    https://skralli.is/signature/fyrirmyndarfyrirtaeki.png

Rules:

- **Never rename, move or delete a file in this folder.** Every signature
  already sent out points at these exact paths; a rename 404s them in mail
  that was sent months ago, and there is no way to fix those retroactively.
- **To update artwork, overwrite the file in place.** The badge name is
  deliberately year-neutral for this reason: when the 2026-2027 award
  arrives, replace `fyrirmyndarfyrirtaeki.png` with the new image and every
  signature picks it up automatically.
- **Keep the pixel dimensions close to the current ones** so signatures that
  hardcode width/height do not distort. Current: logo 537x146,
  badge 378x268.
- These are intentionally separate copies from the ones the site renders
  (`/logos/`, `/images/footer/`). The site's copies go through next/image
  and can be renamed freely as the design changes; these cannot.

Anything under `public/` is served verbatim by Next.js at the matching path,
so these bypass the `/_next/image?url=...&w=...&q=...` optimizer entirely.
Do not use a `/_next/image` URL in a signature — that query contract is an
implementation detail and is not stable across deploys.
