"use server"

import { validatedAction } from '@/lib/auth/middleware';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { auth_users, NewUser } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signInSchema = z.object({
    email: z.string().email().min(3).max(255),
    password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data) => {
    const { email, password } = data;

    const users = await db
        .select()
        .from(auth_users)
        .where(eq(auth_users.email, email))
        .limit(1);

    if (users.length === 0) {
        return {
            error: 'Invalid email or password. Please try again.',
            email,
            password
        };
    }

    const user = users[0];

    const isPasswordValid = await comparePasswords(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        return {
            error: 'Invalid email or password. Please try again.',
            email,
            password
        };
    }

    await setSession(user)

    // const redirectTo = formData.get('redirect') as string | null;
    // if (redirectTo === 'checkout') {
    //     const priceId = formData.get('priceId') as string;
    //     return createCheckoutSession({ team: foundTeam, priceId });
    // }

    redirect('/charts');
});

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