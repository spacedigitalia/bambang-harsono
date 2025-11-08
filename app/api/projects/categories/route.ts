import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/mongodb/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db.collection("categories").find({}).toArray();

    // Only return the name field from each category
    const categoryNames = categories.map((category) => category.name);

    return NextResponse.json(categoryNames);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
