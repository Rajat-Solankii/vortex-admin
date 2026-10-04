import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json({ error: "IP is required" }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM banned_ips WHERE ip = ?');
    stmt.run(ip);

    // Notify the main app to auto-reload all clients so the unbanned user is instantly allowed back in
    fetch("http://localhost:3000/api/settings/notify", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reload" })
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to unban IP:", error);
    return NextResponse.json({ error: "Failed to unban IP" }, { status: 500 });
  }
}
