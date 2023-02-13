import { SubmissionState } from "@prisma/client";
import { db } from "~/db.server";

export const loader = async () => {
  const now = new Date().toISOString();

  const rootUrl = "https://oslokokeboka.no";

  const recipeIds = await db.recipeSubmission.findMany({
    where: {
      state: SubmissionState.PROCESSED,
    },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const recipeUrls = recipeIds.map((val) => {
    return `
    <url>
      <loc>${rootUrl}/recipe/${val.id}}</loc>
      <lastmod>${val.updatedAt}</lastmod>
      <priority>0.90</priority>
      </url>
    `;
  });

  const content = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
    <loc>${rootUrl}</loc>
    <lastmod>${now}</lastmod>
    <priority>1.00</priority>
    </url>
    <url>
    <loc>${rootUrl}/recipes</loc>
    <lastmod>${now}</lastmod>
    <priority>0.90</priority>
    </url>
    <url>
    <loc>${rootUrl}/create-recipe/0</loc>
    <priority>0.80</priority>
    </url>
    ${recipeUrls.map((url) => url)}
  </urlset>
  `;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
