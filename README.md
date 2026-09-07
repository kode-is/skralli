# Skralli

Static Next.js recreation of skralli.is (Icelandic B2B site), using the NowAlt font
and a brand Tailwind theme.

## Development

```bash
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run test     # run vitest unit tests
npm run scrape   # scrape reference content/assets from the live site
npm run verify   # verify the built site against the reference
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

- `RESEND_API_KEY` — API key for sending contact-form email via Resend
- `EMAIL_FROM` — from address used for outgoing contact-form email
- `CONTACT_TO` — inbox that receives contact-form submissions
