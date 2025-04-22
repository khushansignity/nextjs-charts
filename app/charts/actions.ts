"use server"

import { db } from "@/lib/db/drizzle";
import { balances, NewTransaction } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type EntryPayload = {
    date: string;
    mainamount: string;
    stcamount: string;
}

export async function addNewEntry(payload: EntryPayload
) {
    const { date, mainamount, stcamount } = payload;

    const existingEntry = await db
        .select()
        .from(balances)
        .where(eq(balances.date, date))
        .limit(1);

    if (existingEntry.length > 0) {
        return {
            error: 'Entry already exists!'
        };
    }

    const newEntry: NewTransaction = { date, mainamount, stcamount };

    const [createdEntry] = await db.insert(balances).values(newEntry).returning();

    return { data: createdEntry };
}