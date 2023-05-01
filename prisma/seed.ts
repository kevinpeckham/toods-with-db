import { PrismaClient } from '@prisma/client'
import userData from "../src/lib/data.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
	console.log(`Start seeding ...`)

	for (const p of userData) {
		const user = await prisma.user.create({
			data: {
				id: p.user.id,
				name: p.user.name,
				email: p.user.email,
				todos: {
					create: {
						// archived: p.archived,
						// completedAt: p.completedAt,
						// completedAt: p.completedAt,
						// createdAt: p.createdAt,
						description: p.description,
						// dueAt: p.dueAt,
						friction: p.friction,
						joy: p.joy,
						next: p.next,
						// order: p.order,
						priority: p.priority,
						tags: p.tags,
						// updatedAt: p.updatedAt,
					},
				},
			}
		})
		console.log(`Created user with id: ${user.id}`)
	}
	console.log(`Seeding finished.`)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})