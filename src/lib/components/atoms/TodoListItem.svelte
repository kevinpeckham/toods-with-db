<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { getContext } from "svelte";

	// components
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import CompleteButton from "$atoms/CompleteButton.svelte";
	import TagsBlock from "$atoms/TagsBlock.svelte";
	import EditLink from "$atoms/EditLink.svelte";
	import DeleteButton from "$atoms/DeleteButton.svelte";
	import ScheduledStartBlock from "$atoms/ScheduledStartBlock.svelte";
	import MoveToTodayButton from "./MoveToTodayButton.svelte";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// props
	export let todo: Todo;

	// variables
	$: hideScheduledToStartAt = getContext("hideScheduledToStartAt") as boolean;

	// utils
	import { isToday } from "$utils/dateUtils";
</script>

<template lang="pug">
	form.py-2.overflow-hidden.rounded.px-2(
		class="hover:bg-white/10 group/form actions",
		method="post"
	)
		FieldTodoId(
			hidden!="{ true }",
			value!="{ todo.id }"
		)
		.flex.items-center.gap-4
			CompleteButton

			//- number & description
			.flex.items-center.gap-2
				.inline-block { todo.order }.
				.whitespace-nowrap { todo.description }

			//- tags
			TagsBlock(tags!="{ todo.tags.split(',') }")

			//- scheduled to start
			+if('todo.scheduledToStartAt && !hideScheduledToStartAt')
				ScheduledStartBlock(start!="{ todo.scheduledToStartAt }")

			//- styled as links
			.flex.gap-2.items-center.text-13(class="opacity-0 group-hover/form:opacity-100")
				EditLink(todoId!="{ todo.id }")
				DeleteButton
				+if('!todo.scheduledToStartAt || !isToday(todo.scheduledToStartAt)')
					MoveToTodayButton
</template>
