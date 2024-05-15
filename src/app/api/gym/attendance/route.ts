import { getCurrentDate } from "@/app/functions";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function GET(req, res) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const gymId = new URL(req.url)?.searchParams?.get("gymId");
    const mobileNumber = new URL(req.url)?.searchParams?.get("mobileNumber");

    if (!gymId) {
      return NextResponse.json(
        { message: "Missing required field: gymId" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    // const hostname = req.headers.get("host");

    // const gymUrl = `https://${hostname}/gym/attendance/${gymId}`;
    // console.log("iuytrdfghj", gymUrl);
    // // Fetch gyms created by the specified user
    // const gymData = await db.collection("gyms").find({ gymUrl })
    const gymData = await db
      .collection("gyms")
      .findOne({ _id: new ObjectId(gymId) });
    console.log("oi87tredfghjk", gymData);
    if (!gymData) {
      return NextResponse.json(
        {
          message: "Gym not exists",
        },
        { status: 404 }
      );
    }
    if (!mobileNumber && gymId) {
      return NextResponse.json({ gymData: gymData });
    } else if (mobileNumber && gymId) {
      const memberData = await db
        .collection("members")
        .findOne({ mobileNumber });
      if (!memberData) {
        return NextResponse.json(
          {
            message: "User not exists. Please join gym first.",
          },
          { status: 404 }
        );
      }
      console.log("irdfghjkl", memberData?.gymId, gymData?._id);
      if (memberData?.gymId === gymData?._id?.toString()) {
        const attendanceData = await db.collection("attendance").findOne({
          gymId: gymId,
          memberId: memberData?._id?.toString(),
          date: getCurrentDate(),
        });
        console.log("876rfghjk", attendanceData, {
          gymId: gymId,
          memberId: memberData?._id,
          date: getCurrentDate(),
        });
        if (attendanceData) {
          return NextResponse.json({ gymData, memberData, attendanceData });
        }
        return NextResponse.json({ gymData, memberData });
      } else {
        return NextResponse.json(
          {
            message: "User is not associated with this gym.",
          },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.log("Error", error);
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

    const { gymId, memberId, date } = await req.json();
    console.log("lkjhgf", gymId, memberId, date);

    if (!gymId || !memberId || !date) {
      return NextResponse.json(
        { message: "Missing required fields: gymId, memberId, date" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB(req);

    const gymData = await db
      .collection("gyms")
      .findOne({ _id: new ObjectId(gymId) });
    console.log("oi87tredfghjk", gymId);
    if (!gymData) {
      return NextResponse.json(
        {
          message: "Gym not exists",
        },
        { status: 404 }
      );
    }
    const memberData = await db
      .collection("members")
      .findOne({ _id: new ObjectId(memberId) });
    if (!memberData) {
      return NextResponse.json(
        {
          message: "User not exists. Please join gym first.",
        },
        { status: 404 }
      );
    }
    if (memberData?.gymId !== gymData?._id?.toString()) {
      return NextResponse.json(
        {
          message: "User is not associated with this gym.",
        },
        { status: 404 }
      );
    }
    // Check if an attendance record already exists for the specified gym, member ID, and date
    const existingAttendance = await db.collection("attendance").findOne({
      gymId: gymId,
      memberId: memberId,
      date: date,
    });

    // If attendance record already exists, return error message
    if (existingAttendance) {
      return NextResponse.json(
        { message: "Attendance already marked for this member on this date" },
        { status: 400 }
      );
    }

    // Create a new attendance record
    await db.collection("attendance").insertOne({
      gymId: gymId,
      memberId: memberId,
      date: date,
      attended: true, // Assuming attendance is marked automatically when an attendance record is created
    });

    return NextResponse.json(
      { message: "Attendance recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
