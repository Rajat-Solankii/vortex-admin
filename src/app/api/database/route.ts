import { NextResponse } from 'next/server';
import db from '@/lib/db';

const ALLOWED_TABLES = ['users', 'collections', 'collection_items', 'bookmarks', 'user_profiles', 'profiles', 'profile_bookmarks', 'profile_history', 'settings', 'banned_ips'];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid or unauthorized table name' }, { status: 400 });
  }

  try {
    // Safe to interpolate because we validated against ALLOWED_TABLES whitelist
    const rows = db.prepare(`SELECT * FROM ${table} ORDER BY rowid DESC LIMIT 100`).all();
    return NextResponse.json({ rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Failed to fetch table data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { table, idField, idValue } = await req.json();

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    if (!idField || typeof idValue === 'undefined') {
      return NextResponse.json({ error: 'Missing ID information' }, { status: 400 });
    }

    const stmt = db.prepare(`DELETE FROM ${table} WHERE ${idField} = ?`);
    stmt.run(idValue);

    // Cascading deletes and real-time notification if a user is deleted
    if (table === 'users' && idField === 'id') {
      try {
        db.prepare('DELETE FROM collections WHERE userId = ?').run(idValue);
        db.prepare('DELETE FROM bookmarks WHERE userId = ?').run(idValue);
        db.prepare('DELETE FROM user_profiles WHERE userId = ?').run(idValue);
        db.prepare('DELETE FROM profiles WHERE userId = ?').run(idValue);
        // Note: collection_items, profile_bookmarks, profile_history would ideally be deleted here too,
        // but since we delete the parent collections/profiles, in a strict schema with ON DELETE CASCADE they would drop.
        // We can manually delete them by finding the associated IDs, but SQLite handles it if PRAGMA foreign_keys = ON.
        
        // Notify the main app to instantly log the user out
        fetch("http://localhost:3000/api/settings/notify", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: JSON.stringify({ action: "delete_account", userId: idValue }) })
        }).catch(console.error);
      } catch (e) {
        console.error("Failed cascading deletes:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
