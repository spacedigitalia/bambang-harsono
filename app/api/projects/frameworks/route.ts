import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/mongodb/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const frameworks = await db
      .collection(process.env.NEXT_PUBLIC_FRAMEWORKS as string)
      .find({})
      .toArray();

    const frameworkData = frameworks.map((framework) => ({
      title: framework.title,
      imageUrl: framework.imageUrl,
    }));

    return NextResponse.json(frameworkData);
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch frameworks" },
      { status: 500 }
    );
  }
}
