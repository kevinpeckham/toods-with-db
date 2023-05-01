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

// variables



let name: string = 'test';
$: name = data.feed?.name ? data.feed.name : 'test';

// let todos: Todo[] (data.feed.todos) = [];
// $: todos = data.feed?.todos ? data.feed.todos : [];

// $:console.log(todos)


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
		div(class="sm:max-w-lg lg:max-w-xl xl:max-w-2xl")

			.text-center(class="sm:text-left")

				//- welcome message
				.mb-4 Welcome, {name}!

				//- todos
				//- incomplete
				.border-t.border-white.border-opacity-40.mt-8.pt-8
					div.mb-8.font-semibold to do today
					+each('incomplete as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						div
							+if('!todo.archived')
								.mb-4
									.inline-block.mr-2 {index + 1}.
									.inline-block.mr-2 {todo.description}
									+each('tags as tag')
										span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}
				div.border-t.border-white.border-opacity-40.mt-8.pt-8
					div.mb-8.font-semibold completed today
					+each('completed as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						+if('todo.archived != true')
							.mb-4
								.inline-block.mr-2.line-through {todo.description}
								+each('tags as tag')
									span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}



</template>
