'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: number) {
  try {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
    revalidatePath('/users');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function saveSettings(settings: { key: string; value: string }[]) {
  try {
    const stmtUpdate = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    const stmtInsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    
    db.transaction(() => {
      for (const setting of settings) {
        const result = stmtUpdate.run(setting.value, setting.key);
        if (result.changes === 0) {
          stmtInsert.run(setting.key, setting.value);
        }
      }
    })();
    
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
