// src/routes/create/+page.server.ts

import prisma from "$lib/prisma";
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const userId = "6CXZTWvc9X8Pzm0A"

export const actions = {
	// 1.
	default: async ({ request }) => {
		const data = await request.formData();
		const next = data.get("next") ? true : false;
		const order = data.get("order") ? Number(data.get("order")) : 0
		const priority = data.get("priority") ? Number(data.get("priority")) : 0
		const friction = data.get("friction") ? Number(data.get("friction")) : 0
		const joy = data.get("joy") ? Number(data.get("joy")) : 0
		const description = data.get("description")
		const tags = data.get("tags") ? data.get("tags") : ""


		// 2.
		if (!order || !description || !userId) {
			return fail(400, { order, description, userId, missing: true });
		}

		// 3.
		if (
			typeof order != "number" ||
			typeof description != "string" ||
			typeof userId != "string" ||
			typeof tags != "string" ||
			userId.length != 16) {
			return fail(400, { incorrect: true })
		}

		4.
		await prisma.todo.create({
			data: {
				next: next,
				order: order,
				priority: priority,
				friction: friction,
				joy: joy,
				description: description,
				tags: tags,
				user: { connect: { id: userId } }
			},
		});

		//5.
		throw redirect(303, `/`)
	}
} satisfies Actions;
