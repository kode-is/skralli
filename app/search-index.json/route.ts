// Static site-search index (components/search/SearchDialog.tsx fetches this
// once, the first time search is opened). `dynamic = "force-static"` makes
// Next.js render this route once at build time — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md's
// "Segment Config Options" — so `buildIndex()` (which reads docs/scrape/*.json
// off disk) only runs during `next build`, never per-request.
import { buildIndex } from "@/lib/search/build-index";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(buildIndex(), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
