<!-- Example Svelte Page / Starter Web Page-->
<script lang="ts">
import type { PageData } from "./$types";
export let data: PageData;


type Feed = typeof data.feed;
$:feed = data.feed as Feed;


$:todos = feed?.todos ?? [];
$: incomplete = todos.filter(todo => todo.completedAt == null);
$: completed = todos.filter(todo => todo.completedAt != null);

//- sort by order
$: todos.sort((a, b) => {
	if (a.order > b.order) return 1;
	if (a.order < b.order) return -1;
	return 0;
});

type Todo = typeof todos[0];
let todo: Todo;

type Tag = string;
let tag: Tag;

let date: string;
let time: string;



let name: string = 'test';
$: name = data.feed?.name ? data.feed.name : 'test';

// functions
function displayDate(date: Date) {
	const dateString = date.toLocaleString(); // e.g. 9/19/2021, 10:00:00 AM
	const dateOnly = dateString.split(",")[0]; // e.g. 9/19/2021
	const timeString = dateString.split(",")[1].trim(); // e.g. 10:00:00 AM
	const timeOnly = timeString.split(" ")[0]; // e.g. 10:00:00
	const timeNoSeconds = timeString.split(":").slice(0, 2).join(":"); // e.g. 10:00
	const amPm = timeString.split(" ")[1]; // e.g. AM


	return [dateOnly, timeNoSeconds, amPm] as string[];
}
function isScheduledForToday(todo:Todo) {
	const today = new Date().toLocaleString().split(',')[0];
	const scheduled = todo?.scheduledToStartAt?.toLocaleString().split(',')[0];
	if (scheduled == today) return true;
	else return false;
}


</script>

<template lang="pug">
	//- head
	svelte:head
		title toods + sqlite
		meta(
			content="",
			name=""
		)

	//- body
	main.relative.grid.min-h-screen.bg-primary.p-4.pb-48.text-white.px-8.py-8
		div.w-full
			//- welcome message
			.flex.justify-between
				.mb-4 Welcome, {name}!
				div: a.text-13(href="/create" class="inline-block py-2 px-2 rounded outline-white outline leading-none") + Create Todo

			//- body
			.grid.grid-cols-2.w-full.gap-8
				//- incomplete - today
				.border-t.border-white.border-opacity-40.mt-8.pt-8
					.flex.mb-8.justify-between
						div.font-semibold to do -
							a.inline-block.ml-2.underline.underline-offset-4(href="/today") today

					+each('incomplete as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						div
							+if('!todo.archived && isScheduledForToday(todo)')
								form(method="post" class="actions").mb-4
									input.text-primary.text-13(
										class="inline-block.mr-2",
										name!="id",
										hidden
										id!="id-{todo.id}"
										type="text",
										value!="{todo.id}"
									)
									.inline-block.mr-2 {todo.order}.
									.inline-block.mr-2 {todo.description}
									//- tags
									.inline-block.mr-4
										+each('tags as tag')
											span.inline-block.py-1.px-2.rounded.border-white.border.leading-none.ml-3.text-12(class="border-[1px]") {tag}
									//- edit
									a.inline-block.py-1.px-2.leading-none.mr-2.text-13(class="hover:text-accent underline underline-offset-4 opacity-80 hover:opacity-100" href="/t/{todo.id}") edit
									//- delete
									button.inline-block.back.underline.underline-offset-4.text-13(class="hover:text-accent opacity-80 hover:opacity-100" formaction="?/deleteTodo" type="submit") delete

				//- completed today
				.border-t.border-white.border-opacity-40.mt-8.pt-8
					div.mb-8.font-semibold completed today
					+each('completed as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						+if('todo.archived != true && new Date(todo.completedAt).toDateString() == new Date().toDateString()')
							.mb-4
								.inline-block.mr-2.line-through {todo.description}
								+each('tags as tag')
									span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}

				//- todos
				//- incomplete  todos not assigned to today

				.w-full.border-t.border-white.border-opacity-40.mt-8.pt-8
					div.mb-8.font-semibold incomplete todos - not scheduled for today
					+each('incomplete as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						div
							+if('!todo.archived && !isScheduledForToday(todo)')
								.mb-4
									.inline-block.mr-2 {todo.order}.
									.inline-block.mr-2 {todo.description}
									+each('tags as tag')
										span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}
				.w-full.border-t.border-white.border-opacity-40.mt-8.pt-8
					div.mb-8.font-semibold recently completed
					+each('completed as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						+if('todo.archived != true')
							.mb-4
								.inline-block.mr-2.line-through {todo.description}
								//- tags
								+each('tags as tag')
									span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}
								//- completed date
								+if('todo.completedAt')
									+const('dateTime = displayDate(todo.completedAt)')
									+const('date = dateTime[0]')
									+const('time = dateTime[1]')
									+const('amPm = dateTime[2]')
									span.inline-block.py-1.px-2.rounded.leading-none.ml-3.text-13
										|	{date} {time} {amPm}



</template>
