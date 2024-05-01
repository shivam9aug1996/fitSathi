import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function GET(req, res) {
  try {
    // Extract user ID and gym ID from the query parameters
    const gymId = new URL(req.url)?.searchParams?.get("gymId");
    const userId = new URL(req.url)?.searchParams?.get("userId");

    // Connect to MongoDB
    const db = await connectDB(req);

    // Fetch all members associated with the gym
    const members = await db.collection("members").find({ gymId }).toArray();

    // Initialize counts for plans, active members, and expired members
    let numPlans = 0;
    let numActiveMembers = 0;
    let numExpiredMembers = 0;

    const plans = await db.collection("plans").find({ gymId: gymId }).toArray();

    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Process each member to determine membership status
    for (const member of members) {
      // Increment the number of plans
      numPlans++;

      if (member.latestPayment) {
        const endDate = new Date(member.latestPayment.endDate);

        if (currentDate <= endDate) {
          // Increment the number of active members
          numActiveMembers++;
        } else {
          // Increment the number of expired members
          numExpiredMembers++;
        }
      } else {
        // Increment the number of expired members if no latest payment
        numExpiredMembers++;
      }
    }

    // Return the counts of plans, active members, and expired members
    return NextResponse.json(
      {
        numPlans: plans?.length || 0,
        numActiveMembers,
        numExpiredMembers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching members:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
