// import prisma
import prisma from "$lib/prisma";

// store functions
import { get } from "svelte/store";

// import functions from sveltekit
import { fail, redirect } from "@sveltejs/kit";

// types
import type { Actions, PageServerLoad } from "./$types";

// user data from store
import { activeUserId } from "$stores/activeUser";
const userId = get(activeUserId);

export const load = (async () => {
	const response = await prisma.user.findUnique({
		where: { id: userId },
		include: { todos: true },
	});

	return { feed: response };
}) satisfies PageServerLoad;

export const actions = {
	deleteTodo: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id") ? data.get("id") : null;

		console.log(id);

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
