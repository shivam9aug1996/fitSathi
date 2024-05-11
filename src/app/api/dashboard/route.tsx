import { daysUntilExpiration } from "@/app/functions";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

// export async function GET(req, res) {
//   try {
//     // Extract user ID and gym ID from the query parameters
//     const gymId = new URL(req.url)?.searchParams?.get("gymId");
//     const userId = new URL(req.url)?.searchParams?.get("userId");

//     // Connect to MongoDB
//     const db = await connectDB(req);

//     // Fetch all members associated with the gym
//     const members = await db.collection("members").find({ gymId }).toArray();

//     // Initialize counts for plans, active members, and expired members
//     let numPlans = 0;
//     let numActiveMembers = 0;
//     let numExpiredMembers = 0;
//     let numExpiring1to3Days = 0;
//     let numExpiring4to7Days = 0;
//     let numExpiring8to15Days = 0;

//     const plans = await db.collection("plans").find({ gymId: gymId }).toArray();

//     // Get the current date
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);

//     // Process each member to determine membership status
//     for (const member of members) {
//       // Increment the number of plans
//       numPlans++;

//       if (member.latestPayment) {
//         const endDate = new Date(member.latestPayment.endDate);

//         if (currentDate <= endDate) {
//           // Increment the number of active members
//           numActiveMembers++;
//         } else {
//           // Increment the number of expired members
//           numExpiredMembers++;
//         }
//       } else {
//         // Increment the number of expired members if no latest payment
//         numExpiredMembers++;
//       }
//     }

//     // Return the counts of plans, active members, and expired members
//     return NextResponse.json(
//       {
//         numPlans: plans?.length || 0,
//         numActiveMembers,
//         numExpiredMembers,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Error fetching members:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

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
    let numExpiring1to3Days = 0;
    let numExpiring4to7Days = 0;
    let numExpiring8to15Days = 0;
    let totalAmountPaid = 0;

    const plans = await db.collection("plans").find({ gymId: gymId }).toArray();

    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const payments = await db.collection("payments").find({ gymId }).toArray();
    totalAmountPaid = payments.reduce(
      (acc, payment) => acc + parseFloat(payment.amountPaid),
      0
    );
    // Process each member to determine membership status
    for (const member of members) {
      if (member.latestPayment) {
        const endDate = new Date(member.latestPayment.endDate);
        let diffDays = daysUntilExpiration(member.latestPayment.endDate);
        if (diffDays > 0) {
          // Increment the number of active members
          numActiveMembers++;

          // Calculate the difference in days between current date and end date
          // const diffTime = endDate - currentDate;
          // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Check the range and increment respective counters
          if (diffDays >= 1 && diffDays <= 3) {
            numExpiring1to3Days++;
          } else if (diffDays >= 4 && diffDays <= 7) {
            numExpiring4to7Days++;
          } else if (diffDays >= 8 && diffDays <= 15) {
            numExpiring8to15Days++;
          }
        } else {
          // Increment the number of expired members
          numExpiredMembers++;
        }
      } else {
        // Increment the number of expired members if no latest payment
        numExpiredMembers++;
      }
    }

    // Return the counts of plans, active members, expired members, and expiring members in different ranges
    return NextResponse.json(
      {
        numPlans: plans?.length || 0,
        numActiveMembers,
        numExpiredMembers,
        numExpiring1to3Days,
        numExpiring4to7Days,
        numExpiring8to15Days,
        totalAmountPaid,
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
