// Serverless Functions
/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x",
};

// src/routes/create/+page.server.ts

// import prisma
import prisma from "$lib/prisma";

// import nanoid for generating unique ids
import { nanoid } from "nanoid";

// import functions from sveltekit
import { fail, redirect } from "@sveltejs/kit";

// store functions
import { get } from "svelte/store";

// user data from store
import { activeUserId } from "$stores/activeUser";
const userId = get(activeUserId);

// types
import type { Actions } from "./$types";

// local functions
function convertDateInputToISOString(date: string) {
	return new Date(date).toISOString();
}
function completedAtFieldValue(data: FormData) {
	if (
		data.get("completedAt") == "null" ||
		data.get("completedAt") == "" ||
		data.get("completedAt") == undefined
	) {
		return null;
	} else {
		const value = data.get("completedAt");
		if (typeof value == "string") {
			const dateTime = convertDateInputToISOString(value);
			if (dateTime == "Invalid Date") {
				return null;
			} else return dateTime;
		} else return null;
	}
}

function dueAtFieldValue(data: FormData) {
	const value = data.get("dueAt");
	if (value == "null" || value == "" || value == undefined) {
		return null;
	} else {
		if (typeof value == "string") {
			const dateTime = convertDateInputToISOString(value);
			if (dateTime == "Invalid Date") {
				return null;
			} else return dateTime;
		} else return null;
	}
}

function scheduledToStartAtFieldValue(data: FormData) {
	const value = data.get("scheduledToStartAt");
	if (value == "null" || value == "" || value == undefined) {
		return null;
	} else {
		if (typeof value == "string") {
			const dateTime = convertDateInputToISOString(value);
			if (dateTime == "Invalid Date") {
				return null;
			} else return dateTime;
		} else return null;
	}
}

function scheduledToEndAtFieldValue(data: FormData) {
	const value = data.get("scheduledToEndAt");
	if (value == "null" || value == "" || value == undefined) {
		return null;
	} else {
		if (typeof value == "string") {
			const dateTime = convertDateInputToISOString(value);
			if (dateTime == "Invalid Date") {
				return null;
			} else return dateTime;
		} else return null;
	}
}

export const actions = {
	// 1.
	default: async ({ request }) => {
		const data = await request.formData();
		const next = data.get("next") ? true : false;
		const today = data.get("today") ? true : false;
		const order = data.get("order") ? Number(data.get("order")) : 0;
		const priority = data.get("priority") ? Number(data.get("priority")) : 0;
		const friction = data.get("friction") ? Number(data.get("friction")) : 0;
		const joy = data.get("joy") ? Number(data.get("joy")) : 0;
		const description = data.get("description");
		const tags = data.get("tags") ? data.get("tags") : "";
		const completedAt = completedAtFieldValue(data);
		const dueAt = dueAtFieldValue(data);
		const scheduledToStartAt = scheduledToStartAtFieldValue(data);
		const scheduledToEndAt = scheduledToEndAtFieldValue(data);

		// 2.
		if (!description || !userId) {
			return fail(400, { description, userId, missing: true });
		}

		// 3.
		if (
			typeof order != "number" ||
			typeof description != "string" ||
			description.length > 300 ||
			typeof userId != "string" ||
			typeof tags != "string" ||
			userId.length != 16
		) {
			return fail(400, { incorrect: true });
		}

		const datum = {
			id: nanoid(),
			completedAt: completedAt,
			dueAt: dueAt,
			next: next,
			today: today,
			order: completedAt ? -1 : order, // if completedAt is set, set order to -1
			priority: priority,
			friction: friction,
			joy: joy,
			description: description,
			scheduledToStartAt: scheduledToStartAt,
			scheduledToEndAt: scheduledToEndAt,
			tags: tags,
			user: { connect: { id: userId } },
		};

		console.log(datum);

		await prisma.todo.create({
			data: datum,
		});

		//5.
		throw redirect(303, `/today`);
	},
} satisfies Actions;
