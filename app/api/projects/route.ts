import { NextResponse } from "next/server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/utils/mongodb/mongodb";

import Projects from "@/models/Projects";

interface FrameworkData {
  title: string;
  imageUrl: string;
}

// GET all Projects content
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const projectsContent = await Projects.find()
      .select("-content")
      .sort({ createdAt: -1 });
    return NextResponse.json(projectsContent);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Projects content" },
      { status: 500 }
    );
  }
}

// POST new Projects content
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Validate frameworks data
    if (!Array.isArray(body.frameworks)) {
      return NextResponse.json(
        { error: "Frameworks must be an array" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProject = await Projects.findOne({ slug: body.slug });
    if (existingProject) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new Projects content with frameworks
    const projectsData = {
      title: body.title,
      description: body.description,
      content: body.content,
      category: body.category,
      thumbnail: body.thumbnail,
      slug: body.slug,
      imageUrl: body.imageUrl || [],
      previewLink: body.previewLink || "",
      frameworks: body.frameworks.map((framework: FrameworkData) => ({
        title: framework.title,
        imageUrl: framework.imageUrl,
      })),
    };

    // Create and save the document
    const newProjects = new Projects(projectsData);
    const savedProjects = await newProjects.save();
    revalidatePath("/api/sitemap");
    return NextResponse.json(savedProjects, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Projects content",
      },
      { status: 500 }
    );
  }
}

// PUT update Projects content
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // If slug is being updated, check for uniqueness
    if (updateData.slug) {
      const existingProject = await Projects.findOne({
        slug: updateData.slug,
        _id: { $ne: id }, // Exclude current project from check
      });

      if (existingProject) {
        return NextResponse.json(
          { error: "A project with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedProjects = await Projects.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProjects) {
      return NextResponse.json(
        { error: "Projects content not found" },
        { status: 404 }
      );
    }

    revalidatePath("/api/sitemap");
    return NextResponse.json(updatedProjects);
  } catch {
    return NextResponse.json(
      { error: "Failed to update Projects content" },
      { status: 500 }
    );
  }
}

// DELETE Projects content
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedProjects = await Projects.findByIdAndDelete(id);

    if (!deletedProjects) {
      return NextResponse.json(
        { error: "Projects content not found" },
        { status: 404 }
      );
    }

    revalidatePath("/api/sitemap");
    return NextResponse.json({
      message: "Projects content deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete Projects content" },
      { status: 500 }
    );
  }
}
