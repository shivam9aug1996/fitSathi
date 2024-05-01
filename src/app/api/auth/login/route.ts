import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";
import { secretKey } from "../../lib/keys";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    let userAgentHeader = req.headers.get("user-agent");
    let userFingerprint = req.headers.get("user-fingerprint");

    let { mobileNumber, password } = await req.json();
    const db = await connectDB(req);

    if (!mobileNumber || !password) {
      return NextResponse.json(
        { message: "Missing mobile number, or password" },
        { status: 400 }
      );
    }
    mobileNumber = mobileNumber?.toString();
    password = password?.toString();

    // const user = await db.collection("users").findOne({ mobileNumber });
    // if (!user) {
    //   return NextResponse.json(
    //     { message: "Mobile number not exists" },
    //     { status: 401 }
    //   );
    // }

    const user = await db.collection("users").findOne({ mobileNumber });
    if (!user) {
      return NextResponse.json(
        { message: "Mobile number not exists" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Password incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id }, secretKey);
    let now = new Date();
    let expirationDate = new Date(now.getTime() + 1 * 60 * 60 * 1000);

    cookies().set("gym_app_user_token", token, {
      //  expires: expirationDate,
      // httpOnly: true,
      // secure: true,
    });
    cookies().set(
      "gym_app_user_data",
      JSON.stringify({
        mobileNumber,
        userId: user?._id,
        name: user?.name,
      }),
      {
        //expires: expirationDate,
        // httpOnly: true,
        // secure: true,
      }
    );

    return NextResponse.json(
      {
        userData: {
          mobileNumber,
          userId: user?._id,
          name: user?.name,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
