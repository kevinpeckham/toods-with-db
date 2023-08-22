/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: "nodejs18.x",
};

// import prisma
import prisma from "$lib/prisma";

// import nanoid for generating unique ids
import { nanoid } from "nanoid";

// import functions from sveltekit
import { fail, redirect } from "@sveltejs/kit";

// store functions
import { get } from "svelte/store";

// settings
import { settings } from "$lib/settings/general";

// utils
import { scrubTagsString } from "$utils/scrubUtils";

// user data from store
import { activeUserId } from "$stores/activeUser";
const userId = get(activeUserId);

// types
import type { Actions, PageServerLoad } from "./$types";

// utils
import { add24Hours } from "$utils/dateUtils";

// load function
// TODO: add pagination / pull in a limited number of todos from limited start dates
export const load = (async () => {
	const response = await prisma.user.findUnique({
		where: { id: userId },
		include: { todos: true },
	});

	// set page metadata
	const metaDescription = `Toods is a simple to do list app that helps you get your sh*t together. It's free and open source.`;
	const metaTitle = `Toods | Get Your Sh*t Together`;

	return { feed: response, metaDescription, metaTitle };
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
	editTodoDescription: async ({ request }) => {
		// get data from form
		const data = await request.formData();

		// get field values from data and prove types
		const todoId = (data.get("id") as string) ?? "";
		const description = (data.get("description") as string) ?? "";

		// check for existence of required values
		if (!description || !todoId || !userId) {
			return fail(400, { description, userId, missing: true });
		}

		// check types
		if (
			typeof description != "string" ||
			typeof userId != "string" ||
			typeof todoId != "string"
		) {
			return fail(400, { incorrect: true });
		}

		//  validate values
		if (
			description.length < 2 ||
			description.length > 300 ||
			userId.length != 16 ||
			todoId.length != 21
		) {
			return fail(400, { incorrect: true });
		}

		// type for datum
		interface Datum {
			todoId: string;
			description: string;
			user: { connect: { id: string } };
		}

		await prisma.todo.update({
			where: { id: todoId },
			data: {
				description: description,
				user: { connect: { id: userId } },
			},
		});

		// redirect back to home page
		throw redirect(303, `/`);
	},
	editTodoTags: async ({ request }) => {
		// get data from form
		const data = await request.formData();

		// get field values from data and prove types
		const todoId = (data.get("id") as string) ?? "";
		const tagsRaw = (data.get("tags") as string) ?? "";

		// scrub tags string
		const tagsScrubbed = scrubTagsString(tagsRaw) ?? "";

		const tagsArray = tagsScrubbed.split(",");
		const tagsSorted = tagsArray.sort().join(",");
		const tags = tagsSorted;

		// check for existence of required values
		// note: tags could be an empty string and thus falsy,
		if (!todoId || !userId) {
			return fail(400, { tags, userId, missing: true });
		}

		// check types
		if (
			typeof tags != "string" ||
			typeof userId != "string" ||
			typeof todoId != "string"
		) {
			return fail(400, { incorrect: true });
		}

		const maxTagStringLength = settings.tags.maxTagStringLength(); // 50
		//  validate values
		if (
			tags.length > maxTagStringLength ||
			userId.length != 16 ||
			todoId.length != 21
		) {
			return fail(400, { incorrect: true });
		}

		// type for datum
		interface Datum {
			todoId: string;
			tags: string;
			user: { connect: { id: string } };
		}

		await prisma.todo.update({
			where: { id: todoId },
			data: {
				tags: tags,
				user: { connect: { id: userId } },
			},
		});

		// redirect back to home page
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
	// - toggle next
	toggleNext: async ({ request }) => {
		//- get form data
		const data = await request.formData();

		//- get field values from form data and prove types
		const id = (data.get("id") as string) ?? "";
		const next = data.get("next") ? true : false;
		const toggledNext = !next;

		// make sure required fields are present
		if (!id) {
			return fail(400, { id, missing: true });
		}

		// make sure fields are the right type
		if (typeof id != "string" || typeof next != "boolean") {
			return fail(400, { incorrect: true });
		}

		//- update todo in database
		await prisma.todo.update({
			where: { id: id },
			data: {
				next: toggledNext,
				order: toggledNext ? 1 : -1,
			},
		});

		//- redirect to home
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
		const currentStartDate = data.get("scheduledToStartAt")
			? data.get("scheduledToStartAt")
			: null;

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
	// create new todo today
	createTodoToday: async ({ request }) => {
		// get data from form
		const data = await request.formData();

		// get field values from data and prove types
		const description = (data.get("description") as string) ?? "";
		const tags = (data.get("tags") as string) ?? "";

		// generate ISO date / time for scheduledToStartAt
		const scheduledToStartAt = new Date().toISOString();

		// generate new Todo id
		const todoId = nanoid();

		// check for existence of required values
		if (!description || !scheduledToStartAt || !todoId || !userId) {
			return fail(400, { description, userId, missing: true });
		}

		// check types
		if (
			typeof description != "string" ||
			typeof scheduledToStartAt != "string" ||
			typeof userId != "string" ||
			typeof tags != "string" ||
			typeof todoId != "string"
		) {
			return fail(400, { incorrect: true });
		}

		//  validate values
		if (
			description.length < 2 ||
			description.length > 300 ||
			userId.length != 16 ||
			scheduledToStartAt.length != 24 ||
			todoId.length != 21
		) {
			return fail(400, { incorrect: true });
		}

		// type for datum
		interface Datum {
			id: string;
			description: string;
			scheduledToStartAt: string;
			user: { connect: { id: string } };
			tags?: string;
		}

		const datum: Datum = {
			id: todoId,
			description: description,
			scheduledToStartAt: scheduledToStartAt,
			user: { connect: { id: userId } },
		};

		// if tags are present add them to the datum
		if (tags) datum.tags = tags;

		await prisma.todo.create({
			data: datum,
		});

		// redirect back to home page
		throw redirect(303, `/`);
	},
} satisfies Actions;
