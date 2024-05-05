// app/api/plan.js
import { daysUntilExpiration, isExpiringInDays } from "@/app/functions";
import { ObjectId } from "mongodb";

import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  try {
    const { name, address, mobileNumber, gymId, planId } = await req.json();

    if (!name || !address || !mobileNumber || !gymId || !planId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const db = await connectDB(req);

    // Add member to the database with default membershipStatus as "No Membership"
    const result = await db.collection("members").insertOne({
      name,
      address,
      mobileNumber,
      gymId,
      planId,
      latestPayment: null,
    });

    const memberId = result.insertedId;

    return NextResponse.json(
      { message: "Member added successfully", memberId },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error adding member:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req, res) {
  try {
    const gymId = new URL(req.url)?.searchParams?.get("gymId");
    const isActive = new URL(req.url)?.searchParams?.get("isActive");
    const startRange = new URL(req.url)?.searchParams?.get("startRange");
    const endRange = new URL(req.url)?.searchParams?.get("endRange");
    console.log("uytdfghjk", isActive);
    if (!gymId) {
      return NextResponse.json(
        { message: "Missing required field: gymId" },
        { status: 400 }
      );
    }

    const db = await connectDB(req);
    // Fetch all members of the specified gym from the database
    const members = await db.collection("members").find({ gymId }).toArray();
    let activeMembers = [];
    let expiredMembers = [];
    console.log("8765r8888888888fghj", startRange, endRange);
    if (startRange && endRange && startRange !== "null") {
      activeMembers = members?.filter((member) => {
        return daysUntilExpiration(member?.latestPayment?.endDate) >= 0;
      });
      const expiringInDays = activeMembers?.filter((member) =>
        isExpiringInDays(member?.latestPayment?.endDate, startRange, endRange)
      );
      console.log("8765redfghjk", expiringInDays);
      return NextResponse.json({ members: expiringInDays }, { status: 200 });
    } else if (isActive === true || isActive === "true") {
      activeMembers = members?.filter((member) => {
        return daysUntilExpiration(member?.latestPayment?.endDate) >= 0;
      });
      return NextResponse.json({ members: activeMembers }, { status: 200 });
    } else if (isActive === false || isActive === "false") {
      expiredMembers = members?.filter((member) => {
        return (
          daysUntilExpiration(member?.latestPayment?.endDate) < 0 ||
          !member?.latestPayment
        );
      });
      console.log("76redfghj", expiredMembers);
      return NextResponse.json({ members: expiredMembers }, { status: 200 });
    } else {
      const members = await db.collection("members").find({ gymId }).toArray();
      return NextResponse.json({ members }, { status: 200 });
    }
  } catch (error) {
    console.log("Error fetching members:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  try {
    // Extract the updated member details from the request body
    const { memberId, name, address, mobileNumber, planId } = await req.json();

    // Check if memberId is provided
    if (!memberId) {
      return NextResponse.json(
        { message: "Missing required field: memberId" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Check if the member exists
    const existingMember = await db
      .collection("members")
      .findOne({ _id: new ObjectId(memberId) });
    if (!existingMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    // Prepare the update object with the new member details
    const updateObj = {
      $set: {
        name,
        address,
        mobileNumber,
        planId,
      },
    };

    // Update the member document in the database
    await db
      .collection("members")
      .updateOne({ _id: new ObjectId(memberId) }, updateObj);

    return NextResponse.json(
      { message: "Member updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating member:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, res) {
  try {
    // Extract the member ID from the request body
    const { memberId } = await req.json();

    // Check if memberId is provided
    if (!memberId) {
      return NextResponse.json(
        { message: "Missing required field: memberId" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // Check if the member exists
    const existingMember = await db
      .collection("members")
      .findOne({ _id: new ObjectId(memberId) });
    if (!existingMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    // Delete the member document from the database

    await db.collection("payments").deleteMany({ memberId: memberId });

    await db.collection("members").deleteOne({ _id: new ObjectId(memberId) });

    return NextResponse.json(
      { message: "Member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting member:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
