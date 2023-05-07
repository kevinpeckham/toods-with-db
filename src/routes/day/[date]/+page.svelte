<!-- Example Svelte Page / Starter Web Page-->
<script lang="ts">

	// components
	import Header from "$organisms/Header.svelte";
	import TodosList from "$molecules/TodosList.svelte";
	import DayAndDateBlock from "$atoms/DayAndDateBlock.svelte";

	// types
	import type { PageData } from "./$types";
	import type { Todo } from "@prisma/client";

	// utils
	import { justDate, isToday } from "$utils/dateUtils";

	// props
	export let data: PageData;

	// variable declarations
	let todos: Todo[] = [];
	let date: string = ''; // e.g. "2021-01-01"
	let dateDisplay: string = '';

	// reactive variables
	$: todos = data.feed ? data.feed : [];
	$: date = data.date ? data.date : '';

	// date display
	$: {
		if (date) {
			const dateObj = new Date(date);
			dateDisplay = isToday(dateObj) ? "Today" : date;
		}
	}

</script>

<template lang="pug">
	Header(
		showDate!="{false}"
		message!="Welcome, Stranger!")
	main.relative.grid.bg-primary.p-4.pb-48.px-8(
		style="min-height: calc(100vh - 4rem)"
		)
		div Day View: {dateDisplay}
		.grid.grid-cols-2.w-full.gap-8
			div
				//- scheduled for today
				TodosList(
					hideStartValue!="{ true }",
					showOnlyScheduledToStartOn!="{ new Date() }",
					todos!="{ todos }"
					)
					svelte:fragment
						a.inline-block.ml-2.underline.underline-offset-4(href="/today") Today
						DayAndDateBlock(date!="{ new Date() }")

				//- completed today
				TodosList(
					hideStartValue!="{ true }",
					showCompleted!="{ true }",
					showHeader!="{ false }",
					showDivider!="{ false }",
					showIncomplete!="{ false }",
					showOnlyScheduledToStartOn!="{ new Date() }",
					todos!="{ todos }"
					)
					svelte:fragment
						DayAndDateBlock(date!="{ new Date() }")

	//-main.relative.grid.min-h-screen.bg-primary.p-4.pb-48.text-white.px-8.py-8
		div(class="sm:max-w-lg lg:max-w-xl xl:max-w-2xl")
			.text-center(class="sm:text-left")
				//- welcome message
				.div
					.mb-4 Welcome, !

				//- todos
				//- incomplete today
				//- .border-t.border-white.border-opacity-40.mt-8.pt-8
				//- 	.flex.mb-8.justify-between
				//- 		.font-semibold to do today
				//- 		a.text-13(
				//- 			class="inline-block py-2 px-2 rounded outline-white outline leading-none",
				//- 			href="/create"
				//- 		) + Create Todo
				//- 	+each('incomplete as todo, index (todo.id)')
				//- 		+const('tags = todo.tags ? todo.tags.split(",") : []')
				//- 		div
				//- 			+if('!todo.archived && isScheduledForToday(todo)')
				//- 				.mb-4
				//- 					.inline-block.mr-2 { todo.order }.
				//- 					.inline-block.mr-2 { todo.description }
				//- 					+each('tags as tag')
				//- 						span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 { tag }
				//- 					//- edit
				//- 					a.inline-block.py-1.px-2.leading-none.ml-3.text-13(
				//- 						class="hover:text-accent underline underline-offset-4",
				//- 						href="/t/{todo.id}"
				//- 					) edit
									//- test
				//- completed today
				//- .border-t.border-white.border-opacity-40.mt-8.pt-8
				//- 	.mb-8.font-semibold completed today
				//- 	+each('completed as todo, index (todo.id)')
				//- 		+const('tags = todo.tags ? todo.tags.split(",") : []')
				//- 		+if('todo.archived != true && new Date(todo.completedAt).toDateString() == new Date().toDateString()')
				//- 			.mb-4
				//- 				.inline-block.mr-2.line-through { todo.description }
				//- 				+each('tags as tag')
				//- 					span.inline-block.py-1.px-2.rounded.outline-white.outline.leading-none.ml-3.text-13 { tag }
</template>
