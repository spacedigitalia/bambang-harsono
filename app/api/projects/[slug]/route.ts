import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/mongodb/mongodb";

import Projects from "@/models/Projects";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await connectToDatabase();

    const project = await Projects.findOne({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const relatedProjects = await Projects.find({
      category: project.category,
      slug: { $ne: slug },
    })
      .limit(4)
      .select("title slug description thumbnail category previewLink")
      .sort({ createdAt: -1 });

    let finalRelatedProjects = relatedProjects;
    if (relatedProjects.length === 0) {
      finalRelatedProjects = await Projects.find({
        slug: { $ne: slug },
      })
        .limit(3)
        .select("title slug description thumbnail category previewLink")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({
      ...project.toObject(),
      relatedProjects: finalRelatedProjects,
    });
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
