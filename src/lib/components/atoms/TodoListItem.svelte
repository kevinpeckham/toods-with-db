<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// import enhance
	import { enhance } from "$app/forms";

	// import nano
	import { nanoid } from "nanoid";

	// store api
	import { writable } from "svelte/store";

	// context api
	import { getContext, setContext } from "svelte";

	// components
	import ButtonComplete from "$atoms/ButtonComplete.svelte";
	import FieldDescription from "$atoms/FieldDescription.svelte";
	import FieldNext from "$atoms/FieldNext.svelte";
	import FieldScheduledToStartAt from "$atoms/FieldScheduledToStart.svelte";
	import FieldTags from "$atoms/FieldTags.svelte";
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import ScheduledStartBlock from "$atoms/ScheduledStartBlock.svelte";
	import TodoMenuItem from "$atoms/TodoMenuItem.svelte";

	// utils
	import { isToday } from "$utils/dateUtils";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// props
	export let isNewTodo = false;
	export let disableCompleteButton = false;
	export let hideMenu = false;
	export let todo: Todo;

	// local stores
	const todoDescriptionStore = writable(todo?.description ?? "");
	$: console.log($todoDescriptionStore);

	// variables
	$: hideStartValue = getContext("hideStartValue") as boolean;
	$: hideOrderValue = getContext("hideOrderValue") as boolean;
	$: next = todo.next ? "" : null;
	$: contextMenuOpen = false;

	// context
	$: setContext("todo", todo);
	$: setContext("todoId", todo.id);
	$: setContext("todoDescriptionStore", todoDescriptionStore);

	const newTodo: Todo = {
		id: "",
		archived: false,
		completedAt: null,
		createdAt: new Date(),
		description: "",
		dueAt: null,
		friction: 0,
		joy: 0,
		next: false,
		order: 0,
		priority: 0,
		scheduledToStartAt: new Date(),
		scheduledToEndAt: null,
		tags: "",
		template: false,
		today: true,
		updatedAt: new Date(),
		userId: "",
	};

	$: if (isNewTodo) {
		todo = newTodo;
		disableCompleteButton = true;
		hideMenu = true;
	}
</script>

<template lang="pug">
	form.flex.justify-start.items-center.gap-2.px-2.rounded-md.py-1.w-full.relative.max-w-full(
		class=`
			data-next:bg-accent
			data-next:text-primary
			bg-neutral-50/5
			hover:bg-neutral-50/10
			{todo.completedAt ? 'opacity-80 !bg-transparent !py-0': ''}
			lg:px-2 group/form`,
		data-next!="{ todo.next ? '' : null }",
		method="POST",
		use:enhance
	)
		//- hidden fields
		+if('!isNewTodo')
			.absolute
				//- id: hidden
				FieldTodoId(
					hidden!="{ true }",
					value!="{ todo.id }"
				)

				FieldNext(hidden!="{ true }")

				//- start:
				FieldScheduledToStartAt(
					hidden!="{ true }",
					value!="{ todo.scheduledToStartAt }"
				)

		//- complete button
		+if('!todo.completedAt && !todo.template && !isNewTodo')
			ButtonComplete

		//- format description
		.flex-grow(class="sm:w-1/2 ]")
			+if('!todo.completedAt')
				FieldDescription(
					classes!="bg-transparent inline-block lg:w-auto lg:min-w-[380px]",
					isNewTodo!="{ isNewTodo }"
				)
				+else
					.whitespace-nowrap.line-through { todo.description }

		//- tags
		+if('!todo.completedAt')
			.hidden.flex-shrink(class="max-w-[40%] sm:flex")
				FieldTags

		//- scheduled to start
		//- +if('todo.scheduledToStartAt && !hideStartValue')
		//- 	ScheduledStartBlock(start!="{ todo.scheduledToStartAt }")

		//- submit new todo button
		+if('isNewTodo && $todoDescriptionStore')
			button(
				class=`
					bg-accent
					border
					border-[1px]
					border-current
					cursor-pointer
					focus:cursor-text
					focus:opacity-100
					flex
					h-[3.25ex]
					hover:opacity-100
					items-center
					justify-center
					leading-none
					max-h-[1.85em]
					max-w-[6em]
					min-w-[3ch]
					opacity-60
					py-1
					px-2
					!outline-none
					relative
					rounded
					text-primary
					text-center
					text-[0.85em]
					truncate
					whitespace-nowrap`,
				aria-label="Create new Todo",
				disabled!="{ isNewTodo ? null : true }",
				formaction="?/createTodoToday",
				title="Create new todo",
				type="submit"
			) submit

		//- context menu -- uses details / summary to trigger
		+if('!hideMenu')
			details.flex.h-full.flex-none(class="group/context-menu")
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
					.pointer-events-auto.flex-grow.grid.grid-cols-1.gap-2.place-items-start.py-2(
						class="lg:text-[1.2em]"
					)
						//- edit
						+if('!todo.template')
							TodoMenuItem(
								href="/t/{todo.id}",
								title="edit todo"
							) edit
						//- delete
						+if('!todo.template')
							TodoMenuItem(
								formaction="?/deleteTodo",
								tag="button",
								title="delete todo",
								type="submit"
							) delete
						//- move to today
						+if('(!todo.scheduledToStartAt || !isToday(todo.scheduledToStartAt)) && !todo.template')
							TodoMenuItem(
								formaction="?/moveToToday",
								tag="button",
								title="schedule todo to start today",
								type="submit"
							) move to today

						//- push back 24 hours
						+if('todo.scheduledToStartAt && !todo.template')
							TodoMenuItem(
								formaction="?/moveToNextDay",
								tag="button",
								title="Reschedule todo to 24 hours later",
								type="submit"
							) push ( +1 day )

						//- unschedule
						+if('todo.scheduledToStartAt')
							TodoMenuItem(
								formaction="?/unscheduleTodo",
								tag="button",
								title="unschedule todo",
								type="submit"
							) unschedule

						//- toggle next
						+if('!todo.completed')
							TodoMenuItem(
								formaction="?/toggleNext",
								tag="button",
								title="toggle next",
								type="submit"
							) { todo.next ? "undo next" : "make next" }
</template>
