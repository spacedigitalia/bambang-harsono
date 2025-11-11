import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { connectToDatabase } from "@/utils/mongodb/mongodb";

import Projects from "@/models/Projects";

type DocumentSlug = {
  slug: string;
  updatedAt?: Date | string | number;
};

function formatDateToISO(date?: Date | string | number): string {
  try {
    if (!date) return new Date().toISOString();
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function buildUrl(baseUrl: string, path: string): string {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
}

function getBaseUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
  try {
    const baseUrl = getBaseUrl(req);

    await connectToDatabase();

    const projects = await Projects.find({}, { slug: 1, updatedAt: 1 }).lean<
      DocumentSlug[]
    >();

    const staticRoutes = [
      {
        loc: buildUrl(baseUrl, "/"),
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 1.0,
      },
    ];

    const projectRoutes = projects.map((p: DocumentSlug) => ({
      loc: buildUrl(baseUrl, `/${p.slug}`),
      lastmod: formatDateToISO(p.updatedAt),
      changefreq: "weekly",
      priority: 0.7,
    }));

    const urls = [...staticRoutes, ...projectRoutes];

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      urls
        .map(
          (u) =>
            `<url>` +
            `<loc>${u.loc}</loc>` +
            `<lastmod>${u.lastmod}</lastmod>` +
            `<changefreq>${u.changefreq}</changefreq>` +
            `<priority>${u.priority}</priority>` +
            `</url>`
        )
        .join("") +
      `</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, s-maxage=3600, max-age=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate sitemap";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
