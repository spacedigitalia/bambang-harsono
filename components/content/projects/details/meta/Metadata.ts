import { Metadata } from "next";

const API_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`;

export async function getProducts(
  slug: string
): Promise<ProjectDetails | null> {
  try {
    const response = await fetch(`${API_URL}/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const project = await response.json();
    return project;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const project = await getProducts(resolvedParams.slug);
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
        openGraph: {
          title: "Project Not Found",
          description: "The requested project could not be found.",
          images: [],
        },
      };
    }

    const imageUrl = project.imageUrl?.[0] || project.thumbnail;
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${BASE_URL}${imageUrl}`;

    return {
      title: `${project.title} | Projects`,
      description: project.description,
      openGraph: {
        title: `${project.title} | Projects`,
        description: project.description,
        type: "article",
        url: `${BASE_URL}/${project.slug}`,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
        siteName: "Rizki Ramadhan",
        locale: "id_ID",
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title} | Projects`,
        description: project.description,
        images: [fullImageUrl],
        creator: "@codingwithrizki",
        site: "@codingwithrizki",
      },
      alternates: {
        canonical: `${BASE_URL}/${project.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
      openGraph: {
        title: "Project Not Found",
        description: "The requested project could not be found.",
        images: [],
      },
    };
  }
}
