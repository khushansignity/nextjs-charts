"use server"

import { validatedAction } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { auth_users, NewUser } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const signUp = validatedAction(signUpSchema, async (data) => {
    const { email, password, } = data;

    if (!email || !password) {
        return { error: "Invalid Data" }
    }

    const existingUser = await db
        .select()
        .from(auth_users)
        .where(eq(auth_users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return {
            error: 'Failed to create user. Please try again.',
            email,
            password,
        };
    }

    const passwordHash = await hashPassword(password);

    const newUser: NewUser = {
        email,
        passwordHash,
        role: 'owner',
    };

    const [createdUser] = await db.insert(auth_users).values(newUser).returning();

    if (!createdUser) {
        return {
            error: 'Failed to create user. Please try again.',
            email,
            password,
        };
    }

    redirect("/charts");
})