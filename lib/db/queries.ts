import { asc } from "drizzle-orm";
import { db } from "./drizzle";
import { balances } from "./schema";

export async function getChartData() {
    return await db.select().from(balances).orderBy(asc(balances.date));
}