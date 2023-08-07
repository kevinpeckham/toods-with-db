<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// store api
	import { writable } from "svelte/store";

	// context api
	import { getContext, setContext } from "svelte";

	// components
	import ButtonComplete from "$atoms/ButtonComplete.svelte";
	import TagsBlock from "$atoms/TagsBlock.svelte";
	import TodoMenuItem from "$atoms/TodoMenuItem.svelte";

	// Field Components
	import FieldNext from "$atoms/FieldNext.svelte";
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import FieldScheduledToStartAt from "$atoms/FieldScheduledToStart.svelte";
	import FieldDescription from "$atoms/FieldDescription.svelte";
	import ScheduledStartBlock from "$atoms/ScheduledStartBlock.svelte";

	// utils
	import { isToday } from "$utils/dateUtils";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// props
	export let todo: Todo;

	// variables
	$: hideStartValue = getContext("hideStartValue") as boolean;
	$: hideOrderValue = getContext("hideOrderValue") as boolean;
	$: next = todo.next ? "" : null;
	$: contextMenuOpen = false;

	// context
	$: setContext("todo", todo);
	$: setContext("todoId", todo.id);


</script>

<template lang="pug">
	form.flex.justify-start.items-center.gap-2.px-2.rounded-md.py-1.w-full.relative(
		data-next!="{ todo.next ? '' : null }"
		class!="data-next:bg-accent data-next:text-primary bg-neutral-50/5 hover:bg-neutral-50/10 lg:px-2 group/form",
		method="post"
	)
		//- draggable cover
		//-.absolute.inset-0.bg-red-500

		//- hidden fields
		.absolute
			//- id: hidden field
			FieldTodoId(
				hidden!="{ true }",
				value!="{ todo.id }"
			)

			FieldNext(hidden!="{ true }")

			//- start: hidden field
			FieldScheduledToStartAt(
				hidden!="{ true }",
				value!="{ todo.scheduledToStartAt }"
			)

		//- .flex.items-center.justify-start.gap-2.w-full.bg-red-500
		//- .flex.items-center.gap-4
		+if('!todo.completedAt && !todo.template')
			ButtonComplete

		//- format description
		.flex-grow(class="sm:w-1/2")
			+if('!todo.completedAt')
				FieldDescription(
					classes!="bg-transparent inline-block lg:w-auto lg:min-w-[380px]",
					value!="{ todo.description}"
				)
				+else
					.whitespace-nowrap.line-through { todo.description }

		//- tags
		.hidden(class="sm:flex sm:flex-none")
			TagsBlock(tags!="{ todo.tags.split(',') }")

		//- scheduled to start
		+if('todo.scheduledToStartAt && !hideStartValue')
			ScheduledStartBlock(start!="{ todo.scheduledToStartAt }")

		//- context menu -- uses details / summary to trigger
		details.flex.h-full(class="group/context-menu")
			//- button to trigger context menu
			summary(
				class=`
				cursor-pointer
				bg-primary/60
				grid
				grid-cols-1
				group/summary
				group-open/context-menu:bg-transparent
				group-open/context-menu:z-20
				group-open/context-menu:w-5
				h-full
				hover:text-accent
				hover:bg-primary/90
				list-none
				peer
				place-content-center
				place-items-center
				px-[3px]
				rounded
				select-none
				w-4
				`
			)
				//- three dot icon -> close icon
				.relative.grid.grid-cols-1.h-full.w-full.gap-1.place-items-center.px-0.pointer-events-none
					+each('["group-open/context-menu:rotate-45","group-open/context-menu:-rotate-45"] as rotate')
						hr.border-current.bg-current.inset-0.border-1(
							class=`
								{rotate}
								rounded-full
								h-[4px]
								w-[4px]
								opacity-90
								group-open/context-menu:border-primary
								group-open/context-menu:group-hover/summary:opacity-100
								group-open/context-menu:absolute
								group-open/context-menu:rounded
								group-open/context-menu:h-[0px]
								group-open/context-menu:border-y-[1px]
								group-open/context-menu:w-full
								transition-all
								`
						)

			//- todo context menu
			.absolute.right-1.top-1.rounded.flex.w-40.z-10.pointer-events-auto.bg-slate-300.rounded.pl-2.pr-4.pt-2.pb-4.shadow-xl.text-primary(
				class=`
				hover:shadow-xl
				text-[.85em]`
			)
				//- menu items
				.pointer-events-auto.flex-grow.grid.grid-cols-1.gap-2.place-items-start.py-2(class="lg:text-[1.2em]")
					//- edit
					+if('!todo.template')
						TodoMenuItem(
							href="/t/{todo.id}",
							title="edit todo") edit
					//- delete
					+if('!todo.template')
						TodoMenuItem(
							formaction="?/deleteTodo",
							tag="button"
							title="delete todo"
							type="submit"
							) delete
					//- move to today
					+if('(!todo.scheduledToStartAt || !isToday(todo.scheduledToStartAt)) && !todo.template')
						TodoMenuItem(
								formaction="?/moveToToday",
								tag="button"
								title="schedule todo to start today"
								type="submit"
								) move to today

					//- push back 24 hours
					+if('todo.scheduledToStartAt && !todo.template')
						TodoMenuItem(
								formaction="?/moveToNextDay",
								tag="button"
								title="Reschedule todo to 24 hours later"
								type="submit"
								) push ( +1 day )

					//- unschedule
					+if('todo.scheduledToStartAt')
						TodoMenuItem(
								formaction="?/unscheduleTodo",
								tag="button"
								title="unschedule todo"
								type="submit"
								) unschedule

					//- toggle next
					+if('!todo.completed')
						TodoMenuItem(
							formaction="?/toggleNext",
							tag="button"
							title="toggle next"
							type="submit"
							) { todo.next ? "undo next" : "make next" }


</template>
