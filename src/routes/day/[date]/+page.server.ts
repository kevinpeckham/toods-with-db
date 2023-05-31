// Serverless Functions
/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x",
};

// import prisma
import prisma from "$lib/prisma";

// store functions
import { get } from "svelte/store";

// types
import type { PageServerLoad } from "./$types";

// user data from store
import { activeUserId } from "$stores/activeUser";
const userId = get(activeUserId);

// utils
import { startOfDay, endOfDay } from "$utils/dateUtils";

let date: string;

//- load todos for a specific day
export const load = async ({ params: { date } }) => {
	// 1.
	const response = await prisma.todo.findMany({
		where: {
			userId: userId,
			scheduledToStartAt: {
				gte: startOfDay(new Date(date)).toISOString(),
				lte: endOfDay(new Date(date)).toISOString(),
			},
		},
	});
	return { feed: response, date: date };
};
