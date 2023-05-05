
// Serverless Functions
/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x'
};

// src/routes/create/+page.server.ts

// import prisma
import prisma from "$lib/prisma";

// import nanoid for generating unique ids
import { nanoid } from "nanoid";

// import functions from sveltekit
import { fail, redirect } from "@sveltejs/kit";

// types
import type { Actions, PageServerLoad } from "./$types";
import type { PageParentData } from "./$types";

// store functions
import { writable, get } from "svelte/store";

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

let id: string;

// load
export const load: PageServerLoad = async ({ params: { id } }) => {
	const response = await prisma.todo.findUnique({
		where: { id: id },
	});
	return { response };
};

export const actions = {
	updateTodo: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id") ? data.get("id") : null;
		const userId = data.get("userId") ? data.get("userId") : null;
		const description = data.get("description")
			? data.get("description")
			: null;
		const order = data.get("order") ? Number(data.get("order")) : 0;
		const tags = data.get("tags") ? data.get("tags") : "";
		const next = data.get("next") ? true : false;
		const priority = data.get("priority") ? Number(data.get("priority")) : 0;
		const friction = data.get("friction") ? Number(data.get("friction")) : 0;
		const joy = data.get("joy") ? Number(data.get("joy")) : 0;
		const completedAt = completedAtFieldValue(data);
		const dueAt = dueAtFieldValue(data);
		const scheduledToStartAt = scheduledToStartAtFieldValue(data);
		const scheduledToEndAt = scheduledToEndAtFieldValue(data);

		console.log({
			order,
			description,
			userId,
			tags,
			next,
			priority,
			friction,
			joy,
		});

		// make sure required fields are present
		if (!id || !order || !description || !userId) {
			return fail(400, { order, description, userId, missing: true });
		}

		// make sure fields are the right type
		if (
			typeof id != "string" ||
			typeof order != "number" ||
			typeof description != "string" ||
			description.length > 300 ||
			typeof userId != "string" ||
			typeof tags != "string"
		) {
			return fail(400, { incorrect: true });
		}

		const datum = {
			completedAt: completedAt,
			dueAt: dueAt,
			next: next,
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

		//
		await prisma.todo.update({
			where: { id: id },
			data: {
				completedAt: completedAt,
				dueAt: dueAt,
				next: next,
				order: order,
				priority: priority,
				friction: friction,
				joy: joy,
				description: description,
				scheduledToStartAt: scheduledToStartAt,
				scheduledToEndAt: scheduledToEndAt,
				tags: tags,
				// user: { connect: { id: userId } }
			},
		});

		// redirect to home page
		throw redirect(303, `/`);
	},
	deleteTodo: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id") ? data.get("id") : null;

		// make sure required fields are present
		if (!id) {
			return fail(400, { id, missing: true });
		}

		// make sure fields are the right type
		if (typeof id != "string") {
			return fail(400, { incorrect: true });
		}

		await prisma.todo.delete({
			where: { id: id },
		});

		throw redirect(303, `/`);
	},
} satisfies Actions;
