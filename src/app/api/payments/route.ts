import { isDateInRange } from "@/app/functions";
import { ObjectId } from "mongodb";

import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  try {
    const { memberId, startDate, endDate, amountPaid, amountDue, paymentDate } =
      await req.json();

    if (
      !memberId ||
      !startDate ||
      !endDate ||
      !amountPaid ||
      !amountDue ||
      !paymentDate
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectDB(req);

    const result = await db.collection("payments").insertOne({
      memberId,
      startDate,
      endDate,
      amountPaid,
      amountDue,
      paymentDate,
    });
    const paymentId = result.insertedId;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (isDateInRange(startDate, endDate)) {
      // Update the member's latest payment details
      await db.collection("members").updateOne(
        { _id: new ObjectId(memberId) },
        {
          $set: {
            latestPayment: {
              paymentId: paymentId?.toString(),
              startDate,
              endDate,
              amountPaid,
              amountDue,
              paymentDate,
            },
          },
        }
      );
    }

    return NextResponse.json(
      { message: "payment added successfully", paymentId },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding payment:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  try {
    const {
      paymentId,
      memberId,
      startDate,
      endDate,
      amountPaid,
      amountDue,
      paymentDate,
    } = await req.json();

    if (
      !paymentId ||
      !memberId ||
      !startDate ||
      !endDate ||
      !amountPaid ||
      !amountDue ||
      !paymentDate
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectDB(req);

    const existingPayment = await db
      .collection("payments")
      .findOne({ _id: new ObjectId(paymentId) });
    if (!existingPayment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Update the payment record
    await db.collection("payments").updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          memberId,
          startDate,
          endDate,
          amountPaid,
          amountDue,
          paymentDate,
        },
      }
    );

    const member = await db
      .collection("members")
      .findOne({ _id: new ObjectId(memberId) });

    if (isDateInRange(startDate, endDate)) {
      // Update the member's latest payment details
      await db.collection("members").updateOne(
        { _id: new ObjectId(memberId) },
        {
          $set: {
            latestPayment: {
              paymentId,
              startDate,
              endDate,
              amountPaid,
              amountDue,
              paymentDate,
            },
          },
        }
      );
    } else {
      if (member?.latestPayment?.paymentId === paymentId) {
        await db.collection("members").updateOne(
          { _id: new ObjectId(memberId) },
          {
            $set: {
              latestPayment: null,
            },
          }
        );
      }
    }

    return NextResponse.json(
      { message: "Payment updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating payment:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req, res) {
  try {
    const memberId = new URL(req.url)?.searchParams?.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { message: "Missing required field: memberId" },
        { status: 400 }
      );
    }

    const db = await connectDB(req);

    const payments = await db
      .collection("payments")
      .find({ memberId: memberId })
      .toArray();

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.log("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// export async function DELETE(req, res) {
//   try {
//     const { paymentId } = await req.json();

//     if (!paymentId) {
//       return NextResponse.json(
//         { message: "Missing required field: paymentId" },
//         { status: 400 }
//       );
//     }

//     const db = await connectDB(req);

//     const result = await db
//       .collection("payments")
//       .deleteOne({ _id: new ObjectId(paymentId) });

//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { message: "Payment not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Payment deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Error deleting payment:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(req, res) {
  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { message: "Missing required field: paymentId" },
        { status: 400 }
      );
    }

    const db = await connectDB(req);

    // Fetch the payment being deleted
    const deletedPayment = await db
      .collection("payments")
      .findOne({ _id: new ObjectId(paymentId) });

    if (!deletedPayment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Delete the payment
    const result = await db
      .collection("payments")
      .deleteOne({ _id: new ObjectId(paymentId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDate = deletedPayment?.startDate;
    const memberId = deletedPayment?.memberId;
    const endDate = deletedPayment?.endDate;
    console.log(
      "jhgfdsdfghjk",
      deletedPayment,
      currentDate,
      startDate,
      endDate
    );

    const member = await db
      .collection("members")
      .findOne({ _id: new ObjectId(memberId) });

    if (member?.latestPayment?.paymentId === paymentId) {
      await db.collection("members").updateOne(
        { _id: new ObjectId(memberId) },
        {
          $set: {
            latestPayment: null,
          },
        }
      );
    }

    // if (isDateInRange(startDate, endDate)) {
    //   console.log("i765edfghjk");
    //   // Update the member's latest payment details
    //   await db.collection("members").updateOne(
    //     { _id: new ObjectId(memberId) },
    //     {
    //       $set: {
    //         latestPayment: null,
    //       },
    //     }
    //   );
    // }

    return NextResponse.json(
      { message: "Payment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
