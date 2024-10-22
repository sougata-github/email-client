import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { data } = await req.json();

  const emailAddress = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;

  const id = data.id;

  //create the user when he signs up
  const user = await db.user.create({
    data: {
      id,
      emailAddress,
      firstName,
      lastName,
      imageUrl,
    },
  });

  console.log("User created", user);

  return NextResponse.json("Webhook received", { status: 200 });
};
