import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { ip, reason } = await req.json();

    if (!ip) {
      return NextResponse.json({ error: "IP is required" }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO banned_ips (ip, reason) VALUES (?, ?) ON CONFLICT(ip) DO NOTHING');
    stmt.run(ip, reason || "Banned by admin");

    // Notify the main app to auto-reload all clients so the banned user is instantly kicked
    fetch("http://localhost:3000/api/settings/notify", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reload" })
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to ban IP:", error);
    return NextResponse.json({ error: "Failed to ban IP" }, { status: 500 });
  }
}
