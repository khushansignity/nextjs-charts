import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import { auth_users, balances } from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/session";

export async function getChartData() {
    return await db.select().from(balances).orderBy(asc(balances.date));
}

export async function getUser() {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
  
    const sessionData = await verifyToken(sessionCookie.value);
    if (
      !sessionData ||
      !sessionData.user ||
      typeof sessionData.user.id !== 'number'
    ) {
      return null;
    }
  
    if (new Date(sessionData.expires) < new Date()) {
      return null;
    }
  
    const user = await db
      .select()
      .from(auth_users)
      .where(and(eq(auth_users.id, sessionData.user.id), isNull(auth_users.deletedAt)))
      .limit(1);
  
    if (user.length === 0) {
      return null;
    }
  
    return user[0];
  }