import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
// 1.
const response = await prisma.user.findUnique({
    where: { id: "6CXZTWvc9X8Pzm0A" },
    include: { todos: true },
});

console.log(response);
// 2.
return { feed: response };
}) satisfies PageServerLoad;
