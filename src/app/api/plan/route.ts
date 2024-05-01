// app/api/plan.js
import { ObjectId } from "mongodb";

import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const { gymId, name, description, price, duration } = await req.json();

    if (!gymId || !name || !price || !duration) {
      return NextResponse.json(
        { message: "Missing required field" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    const gymExists = await db
      .collection("gyms")
      .findOne({ _id: new ObjectId(gymId) });
    if (!gymExists) {
      return NextResponse.json(
        { message: "Gym does not exist" },
        { status: 404 }
      );
    }

    // Insert new plan into database
    const result = await db.collection("plans").insertOne({
      gymId,
      name,
      description,
      price,
      duration,
    });

    return NextResponse.json(
      {
        message: "Plan created successfully",
        planData: {
          _id: result.insertedId,
          gymId,
          name,
          description,
          price,
          duration,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating plan:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req, res) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const gymId = new URL(req.url)?.searchParams?.get("gymId");

    if (!gymId) {
      return NextResponse.json(
        { message: "Missing required field: gymId" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Fetch plans based on gym ID
    const plans = await db.collection("plans").find({ gymId: gymId }).toArray();

    return NextResponse.json({ plans });
  } catch (error) {
    console.log("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  try {
    if (req.method !== "PUT") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const { id, name, description, price, duration } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing required field: id" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Construct update query based on provided fields
    const updateFields = {};
    if (name) {
      updateFields.name = name;
    }
    if (description) {
      updateFields.description = description;
    }
    if (price) {
      updateFields.price = price;
    }
    if (duration) {
      updateFields.duration = duration;
    }

    // Update the plan
    const result = await db
      .collection("plans")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No plan found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Plan updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating plan:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, res) {
  try {
    if (req.method !== "DELETE") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing required field: id" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Check if the plan ID exists in any member document
    const memberWithPlan = await db
      .collection("members")
      .findOne({ planId: id });

    if (memberWithPlan) {
      return NextResponse.json(
        { message: "Plan is associated with a member, cannot delete" },
        { status: 400 }
      );
    }

    // Delete the plan
    const result = await db
      .collection("plans")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No plan found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
