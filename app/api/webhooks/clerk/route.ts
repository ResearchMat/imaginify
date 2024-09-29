/* eslint-disable camelcase */
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
console.log("route started sd")
export async function POST(req: Request) {
  // Get the Clerk webhook secret from the environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET in the environment variables.");
    return new Response("Webhook secret missing", { status: 500 });
  }

  // Get necessary Svix headers for verification
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If headers are missing, return an error response
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers in the request.");
    return new Response("Missing Svix headers", { status: 400 });
  }

  // Parse the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix webhook instance with the secret
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload with the headers and secret
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  // Get event data and type
  const { id } = evt.data;
  const eventType = evt.type;

  // Ensure that clerkId is not undefined by providing a fallback or error
  if (!id) {
    console.error("Missing Clerk user ID.");
    return new Response("Missing Clerk user ID", { status: 400 });
  }

  // Handle user.created event
  if (eventType === "user.created") {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id as string, // Ensure clerkId is always a string
      email: email_addresses?.[0]?.email_address || "",  // Default to empty string if undefined
      username: username || "",                        // Provide default empty string for undefined
      firstName: first_name || "",                     // Provide default empty string for undefined
      lastName: last_name || "",                       // Provide default empty string for undefined
      photo: image_url || "",                          // Provide default empty string for undefined
    };

    try {
      const newUser = await createUser(user);

      // Set public metadata on Clerk's side if the user was successfully created
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json({ message: "User created successfully", user: newUser });
    } catch (err) {
      console.error("Error creating user:", err);
      return new Response("Error creating user", { status: 500 });
    }
  }

  // Handle user.updated event
  if (eventType === "user.updated") {
    const { image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name || "",   // Provide default empty string for undefined
      lastName: last_name || "",     // Provide default empty string for undefined
      username: username || "",      // Provide default empty string for undefined
      photo: image_url || "",        // Provide default empty string for undefined
    };

    try {
      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Error updating user", { status: 500 });
    }
  }

  // Handle user.deleted event
  if (eventType === "user.deleted") {
    try {
      const deletedUser = await deleteUser(id);
      return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
      console.error("Error deleting user:", err);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  // Log and return a success response for any other event types
  console.log(`Unhandled event type: ${eventType}`);
  return new Response("Webhook event processed", { status: 200 });
}
