<!-- Example Svelte Page / Starter Web Page-->
<script lang="ts">
import type { PageData } from "./$types";

//- store
import { todosStore, orderCount } from "$stores/todosStore";

//$:console.log($todosStore)

//- catch data from server / load function
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

// sync todos to store
$: { if (todos[0]) todosStore.set(todos) };

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
				.div
					.mb-4 Welcome, {name}!

				//- todos
				//- incomplete
				.border-t.border-white.border-opacity-40.mt-8.pt-8
					.flex.mb-8.justify-between
						div.font-semibold to do today
						a.text-13(href="/create" class="inline-block py-2 px-2 rounded outline-white outline leading-none") + Create Todo
					+each('incomplete as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						div
							+if('!todo.archived && todo.today')
								.mb-4
									.inline-block.mr-2 {todo.order}.
									.inline-block.mr-2 {todo.description}
									+each('tags as tag')
										span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}
				div.border-t.border-white.border-opacity-40.mt-8.pt-8
					div.mb-8.font-semibold completed today
					+each('completed as todo, index (todo.id)')
						+const('tags = todo.tags ? todo.tags.split(",") : []')
						+if('todo.archived != true && new Date(todo.completedAt).toDateString() == new Date().toDateString()')
							.mb-4
								.inline-block.mr-2.line-through {todo.description}
								+each('tags as tag')
									span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 {tag}



</template>
