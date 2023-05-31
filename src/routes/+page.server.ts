/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x",
};

// import prisma
import prisma from "$lib/prisma";

// import nanoid for generating unique ids
import { nanoid } from "nanoid";

// store functions
import { get } from "svelte/store";

// import functions from sveltekit
import { fail, redirect } from "@sveltejs/kit";

// types
import type { Actions, PageServerLoad } from "./$types";

// utils
import { add24Hours } from "$utils/dateUtils";

// user data from store
import { activeUserId } from "$stores/activeUser";
const userId = get(activeUserId);

export const load = (async () => {
	const response = await prisma.user.findUnique({
		where: { id: userId },
		include: { todos: true },
	});
	console.log("response", response);
	return { feed: response };
}) satisfies PageServerLoad;

export const actions = {
	//- delete to do
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

	//- complete to do
	completeTodo: async ({ request }) => {
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

		await prisma.todo.update({
			where: { id: id },
			data: {
				next: false,
				order: -1,
				completedAt: new Date().toISOString(),
			},
		});

		throw redirect(303, `/`);
	},
	//- move to today
	moveToToday: async ({ request }) => {
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

		await prisma.todo.update({
			where: { id: id },
			data: {
				scheduledToStartAt: new Date().toISOString(),
			},
		});

		throw redirect(303, `/`);
	},
	//- move to next day
	moveToNextDay: async ({ request }) => {
		const data = await request.formData();

		const id = data.get("id") ? data.get("id") : null;
		console.log("id", id);
		const currentStartDate = data.get("scheduledToStartAt")
			? data.get("scheduledToStartAt")
			: null;

		console.log("st", currentStartDate);

		// make sure required fields are present
		if (!id || !currentStartDate) {
			return fail(400, { id, missing: true });
		}

		// make sure fields are the right type
		if (typeof id != "string" || typeof currentStartDate != "string") {
			return fail(400, { incorrect: true });
		}

		await prisma.todo.update({
			where: { id: id },
			data: {
				scheduledToStartAt: add24Hours(
					new Date(currentStartDate),
				).toISOString(),
			},
		});

		throw redirect(303, `/`);
	},
	// unschedule todo
	unscheduleTodo: async ({ request }) => {
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

		await prisma.todo.update({
			where: { id: id },
			data: {
				scheduledToStartAt: null,
			},
		});

		throw redirect(303, `/`);
	},
	makeTodoFromTemplate: async ({ request }) => {
		const data = await request.formData();
		const description = data.get("description") ? data.get("description") : "";
		const id = nanoid();

		// make sure required fields are present
		if (!id) {
			return fail(400, { id, missing: true });
		}

		// make sure fields are the right type
		if (
			typeof id != "string" ||
			typeof userId != "string" ||
			typeof description != "string"
		) {
			return fail(400, { incorrect: true });
		}

		const newTodo = await prisma.todo.create({
			data: {
				id: id,
				description: description,
				userId: userId,
				next: false,
				order: 0,
				scheduledToStartAt: new Date().toISOString(),
			},
		});
	},
	// create new todo
	createNewTodoForToday: async ({ request }) => {
		const data = await request.formData();
		const next = data.get("next") ? true : false;
		const today = data.get("today") ? true : false;
		const order = data.get("order") ? Number(data.get("order")) : 0;
		const priority = data.get("priority") ? Number(data.get("priority")) : 0;
		const friction = data.get("friction") ? Number(data.get("friction")) : 0;
		const joy = data.get("joy") ? Number(data.get("joy")) : 0;
		const description = data.get("description") ? data.get("description") : "";
		const tags = data.get("tags") ? data.get("tags") : "";
		// const completedAt = completedAtFieldValue(data);
		// const dueAt = dueAtFieldValue(data);
		const scheduledToStartAt = new Date().toISOString();
		// const scheduledToEndAt = scheduledToEndAtFieldValue(data);

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
			// completedAt: completedAt,
			// dueAt: dueAt,
			next: next,
			today: today,
			// order: -1,
			priority: priority,
			friction: friction,
			joy: joy,
			description: description,
			scheduledToStartAt: scheduledToStartAt,
			// scheduledToEndAt: scheduledToEndAt,
			tags: tags,
			user: { connect: { id: userId } },
		};

		await prisma.todo.create({
			data: datum,
		});

		//5.
		throw redirect(303, `/`);
	},
} satisfies Actions;
