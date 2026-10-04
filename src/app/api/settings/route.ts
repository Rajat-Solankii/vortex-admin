import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const setting = db.prepare("SELECT value FROM settings WHERE key = 'maintenance_mode'").get() as { value: string } | undefined;
    const isMaintenanceMode = setting?.value === 'true';
    return NextResponse.json({ maintenance_mode: isMaintenanceMode });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (key !== 'maintenance_mode') {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    const result = stmt.run(value, key);
    
    // If no rows were changed, it might mean the key doesn't exist yet, so we insert it
    if (result.changes === 0) {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, value);
    }

    try {
      // Notify the main app to broadcast the change instantly via SSE
      await fetch("http://localhost:3000/api/settings/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: value }) // value should be "true" or "false"
      });
    } catch (err) {
      console.error("Failed to notify main app", err);
    }

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
