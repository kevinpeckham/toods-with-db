// import prisma
import prisma from '$lib/prisma';

// store functions
import { get } from 'svelte/store';

// types
import type { PageServerLoad } from './$types';

// user data from store
import { activeUserId } from '$stores/activeUser';
const userId = get(activeUserId)

export const load = (async () => {
// 1.
const response = await prisma.user.findUnique({
    where: { id: userId },
    include: { todos: true },
});

// 2.
return { feed: response };
}) satisfies PageServerLoad;
