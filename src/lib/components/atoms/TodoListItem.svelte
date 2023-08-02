<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// context api
	import { getContext, setContext } from "svelte";

	// components
	import ButtonComplete from "$atoms/ButtonComplete.svelte";
	import ButtonDelete from "$atoms/ButtonDelete.svelte";
	import ButtonMoveToNextDay from "./ButtonMoveToNextDay.svelte";
	import ButtonMoveToToday from "./ButtonMoveToToday.svelte";
	import ButtonNext from "$atoms/ButtonNext.svelte";
	import ButtonUnschedule from "./ButtonUnschedule.svelte";
	import TagsBlock from "$atoms/TagsBlock.svelte";
	import EditLink from "$atoms/EditLink.svelte";

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
	$: next = todo.next as boolean;
	$: contextMenuOpen = false;

	// context
	$: setContext("next", next);

	// constants
	const nextStyle = "bg-accent text-primary";
</script>

<template lang="pug">
	form.flex.justify-start.items-center.gap-2.px-2.rounded-md.py-1.w-full.relative(
		class!="bg-neutral-50/5 hover:bg-neutral-50/10 lg:px-2 {next ? nextStyle : ''} group/form",
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

			//- next: hidden field
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
					value!="{ todo.description }"
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

			//- context menu
			.absolute.right-1.top-1.rounded.flex.w-40.z-10.pointer-events-auto.bg-slate-400.rounded.pl-2.pr-4.pt-1.pb-4.shadow-xl.text-primary(
				class=`
				hover:shadow-xl
				text-[.85em]`
			)
				//- menu items
				.pointer-events-auto.flex-grow.grid.grid-cols-1.gap-1
					+if('!todo.template')
						div
							EditLink(todoId!="{ todo.id }")
					+if('!todo.template')
						div
							ButtonDelete
					+if('(!todo.scheduledToStartAt || !isToday(todo.scheduledToStartAt)) && !todo.template')
						div
							ButtonMoveToToday
					+if('todo.scheduledToStartAt && !todo.template')
						div
							ButtonMoveToNextDay
					+if('todo.scheduledToStartAt')
						div
							ButtonUnschedule
					+if('!todo.completed')
						div
							ButtonNext(next!="{ next }")

				//- button container
				//- .pointer-events-none.flex.flex-col.justify-between.select-none.opacity-0
				//- 	button.block.top-0.right-0.cursor-pointer.text-right.h-6(
				//- 		class="text-base"
				//- 	)
				//- 		span.inline-block.px-2.rounded.pointer-events-none(class="hover:bg-slate-50/10") x
				//- 	//- click blocker -- prevents click from triggering the next menu below
				//- 	.flex-grow.pointer-events-auto
</template>
