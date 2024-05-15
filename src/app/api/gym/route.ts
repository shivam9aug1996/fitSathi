import { ObjectId } from "mongodb";
import { NextResponse } from "../../../../node_modules/next/server";
import { connectDB } from "../lib/dbconnection";
import base64url from "base64url";

const shortenId = (id) => base64url.encode(id.toString()).slice(0, 4);

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const { name, location, userId } = await req.json();

    if (!name || !location || !userId) {
      return NextResponse.json(
        { message: "Missing required field" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Check if there's already a primary gym for the user
    const primaryGym = await db
      .collection("gyms")
      .findOne({ userId, isPrimary: true });

    // Insert new gym into database
    const result = await db.collection("gyms").insertOne({
      name,
      location,
      userId,
      isPrimary: true, // Set isPrimary to true if no primary gym exists for the user
    });

    const shortId = shortenId(result.insertedId);

    // // Generate unique URL for the gym
    // const hostname = req.headers.get("host");
    // console.log("iuytfghjk", hostname, req);
    // const gymUrl = `https://${hostname}/gym/attendance/${result.insertedId}`;

    // // const gymUrl = `/gym/${shortId}`;
    // await db
    //   .collection("gyms")
    //   .updateOne({ _id: result.insertedId }, { $set: { gymUrl } });

    // If there's already a primary gym, update its isPrimary field to false
    if (primaryGym) {
      await db
        .collection("gyms")
        .updateOne({ _id: primaryGym._id }, { $set: { isPrimary: false } });
    }

    return NextResponse.json(
      {
        message: "Gym created successfully",
        gymData: {
          _id: result.insertedId,
          name,
          location,
          userId,
          isPrimary: true, // Set the new gym as primary
          //gymUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating gym:", error);
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

    const userId = new URL(req.url)?.searchParams?.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "Missing required field: userId" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Fetch gyms created by the specified user
    const gyms = await db.collection("gyms").find({ userId }).toArray();

    return NextResponse.json({ gyms });
  } catch (error) {
    console.log("Error fetching gyms:", error);
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

    const { id, name, location, isPrimary, userId } = await req.json();

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
    if (location) {
      updateFields.location = location;
    }
    if (isPrimary) {
      updateFields.isPrimary = isPrimary;
    }

    // Update the gym

    if (isPrimary) {
      console.log("kjhgfdfghj");
      const primaryGym = await db
        .collection("gyms")
        .findOne({ userId, isPrimary: true });
      if (primaryGym) {
        await db
          .collection("gyms")
          .updateOne({ _id: primaryGym._id }, { $set: { isPrimary: false } });
      }
    }
    const result = await db
      .collection("gyms")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No gym found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gym updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating gym:", error);
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

    const { id, userId } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing required field: id" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);
    // Find the gym to be deleted
    const gymToDelete = await db
      .collection("gyms")
      .findOne({ _id: new ObjectId(id) });

    if (!gymToDelete) {
      return NextResponse.json(
        { message: "No gym found to delete" },
        { status: 404 }
      );
    }

    // Delete all payments associated with the members of the gym
    const memberIds = (
      await db.collection("members").find({ gymId: id }, { _id: 1 }).toArray()
    ).map((member) => member?._id?.toString());
    console.log("iuytresdfghj", memberIds);
    await db
      .collection("payments")
      .deleteMany({ memberId: { $in: memberIds } });

    // Find and delete all plans associated with the gym
    await db.collection("plans").deleteMany({ gymId: id });

    // Delete all members associated with the gym
    await db.collection("members").deleteMany({ gymId: id });

    // Delete the gym
    const result = await db
      .collection("gyms")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No gym found to delete" },
        { status: 404 }
      );
    }
    // If the deleted gym was primary, set another gym as primary
    if (gymToDelete.isPrimary === true) {
      const otherGyms = await db
        .collection("gyms")
        .find({ userId, _id: { $ne: new ObjectId(id) } })
        .toArray();
      if (otherGyms?.length > 0) {
        // Set the first gym from the list as primary
        await db
          .collection("gyms")
          .updateOne({ _id: otherGyms[0]?._id }, { $set: { isPrimary: true } });
      }
    }

    return NextResponse.json(
      { message: "Gym deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting gym:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
