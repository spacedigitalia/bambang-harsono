const API_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`;

export const fetchProjects = async (): Promise<projects[]> => {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching projects:", error);
    }
    return [] as unknown as projects[];
  }
};

export const fetchProjectBySlug = async (
  slug: string
): Promise<ProjectDetails | null> => {
  try {
    const response = await fetch(`${API_URL}/${slug}`, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch projects Details: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching projects details:", error);
    }
    return null;
  }
};
