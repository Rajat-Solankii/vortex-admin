'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

export async function loginAdmin(password: string) {
  const validPassword = process.env.ADMIN_PASSWORD || 'admin';
  if (password === validPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  revalidatePath('/');
  return { success: true };
}
