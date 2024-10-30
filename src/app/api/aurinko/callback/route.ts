import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { waitUntil } from "@vercel/functions";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = auth();

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");

  if (status !== "success")
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 },
    );

  //get the code in exchange for the token
  const code = params.get("code");

  if (!code)
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 },
    );

  const token = await exchangeCodeForAccessToken(code);

  if (!token) {
    return NextResponse.json(
      { message: "Failed to exchange code for token." },
      { status: 400 },
    );
  }

  const accountDetails = await getAccountDetails(token.accessToken);

  if (!accountDetails) {
    return NextResponse.json(
      { message: "Account details missing" },
      { status: 400 },
    );
  }

  //so that we can't link the same account again
  const existingAccount = await db.account.findUnique({
    where: {
      emailAddress: accountDetails.email,
    },
  });

  if (existingAccount) {
    return NextResponse.json(
      {
        message: "Can't link an existing account.",
      },
      {
        status: 409,
      },
    );
  }

  //create account in db
  const account = await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      //if token exists then update to latest access token from the callback
      accessToken: token.accessToken,
    },
    create: {
      //else create a new account
      id: token.accountId.toString(),
      userId,
      accessToken: token.accessToken,
      name: accountDetails.name,
      emailAddress: accountDetails.email,
    },
  });

  //trigger initial sync endpoint
  //run async code while there is a response from our endpoint

  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((response) => {
        console.log("Initial sync triggered", response.data);
      })
      .catch((error) => console.log("Failed to trigger intial sync", error)),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
