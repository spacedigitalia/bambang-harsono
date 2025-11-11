const API_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/skills`;

export const fetchTechSkillsContents = async (): Promise<TechSkill[]> => {
  try {
    const response = await fetch(`${API_URL}/tech`, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch skills contents: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching skills contents:", error);
    }
    return [] as unknown as TechSkill[];
  }
};

export const fetchSkillsContents = async (): Promise<SkillContent[]> => {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch skills contents: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching skills contents:", error);
    }
    return [] as unknown as SkillContent[];
  }
};
