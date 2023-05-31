<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { getContext } from "svelte";

	// components

	import ButtonComplete from "$atoms/ButtonComplete.svelte";
	import ButtonDelete from "$atoms/ButtonDelete.svelte";
	import ButtonMoveToNextDay from "./ButtonMoveToNextDay.svelte";
	import ButtonMoveToToday from "./ButtonMoveToToday.svelte";
	import ButtonUnschedule from "./ButtonUnschedule.svelte";

	import TagsBlock from "$atoms/TagsBlock.svelte";
	import EditLink from "$atoms/EditLink.svelte";

	// Field Components
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import FieldScheduledToStartAt from "$atoms/FieldScheduledToStart.svelte";
	import FieldDescription from "$atoms/FieldDescription.svelte";

	import ScheduledStartBlock from "$atoms/ScheduledStartBlock.svelte";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// props
	export let todo: Todo;

	// variables
	$: hideStartValue = getContext("hideStartValue") as boolean;
	$: hideOrderValue = getContext("hideOrderValue") as boolean;

	// utils
	import { isToday } from "$utils/dateUtils";
</script>

<template lang="pug">
	form(class=" group/form actions", method="post")
		FieldTodoId(
			hidden!="{ true }",
			value!="{ todo.id }"
		)
		FieldScheduledToStartAt(
			hidden!="{ true }",
			value!="{ todo.scheduledToStartAt }"
		)
		.flex.items-center.gap-4
			+if('!todo.completedAt && !todo.template')
				ButtonComplete

			//- number & description
			.flex.items-center.gap-2
				//- show number only if not completed
				+if('!todo.completedAt && !hideOrderValue')
					.inline-block { todo.order }.

				//- format description
				div(class="")
					+if('!todo.completedAt')
						FieldDescription(
							classes!="bg-transparent inline-block min-w-[380px]",
							value!="{ todo.description }"
						)
						//input.whitespace-nowrap.bg-primary(readonly value!="{ todo.description }")
						+else
							.whitespace-nowrap.line-through { todo.description }

			//- tags
			TagsBlock(tags!="{ todo.tags.split(',') }")

			//- scheduled to start
			+if('todo.scheduledToStartAt && !hideStartValue')
				ScheduledStartBlock(start!="{ todo.scheduledToStartAt }")

			//- styled as links
			.flex.gap-2.items-center.text-13(class="opacity-0 group-hover/form:opacity-100")
				+if('!todo.template')
					EditLink(todoId!="{ todo.id }")
				+if('!todo.template')
					ButtonDelete
				+if('(!todo.scheduledToStartAt || !isToday(todo.scheduledToStartAt)) && !todo.template')
					ButtonMoveToToday
				+if('todo.scheduledToStartAt && !todo.template')
					ButtonMoveToNextDay
				+if('todo.scheduledToStartAt')
					ButtonUnschedule
</template>
