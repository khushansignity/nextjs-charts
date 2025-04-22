import { db } from "./drizzle";
import { balances } from "./schema";

export async function getChartData() {
    return await db.select().from(balances);
}