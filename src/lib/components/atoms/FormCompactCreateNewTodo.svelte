<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { getContext } from "svelte";

	// nano id
	import { nanoid } from "nanoid";
	const formId = nanoid();

	// components

	import ButtonComplete from "$atoms/ButtonComplete.svelte";
	import ButtonDelete from "$atoms/ButtonDelete.svelte";
	// import ButtonMoveToNextDay from "./ButtonMoveToNextDay.svelte";
	// import ButtonMoveToToday from "./ButtonMoveToToday.svelte";
	// import ButtonUnschedule from "./ButtonUnschedule.svelte";

	// import TagsBlock from "$atoms/TagsBlock.svelte";
	// import EditLink from "$atoms/EditLink.svelte";

	// Field Components
	// import FieldTodoId from "$atoms/FieldTodoId.svelte";
	// import FieldScheduledToStartAt from "$atoms/FieldScheduledToStart.svelte";
	import FieldDescription from "$atoms/FieldDescription.svelte";
	import FieldTags from "$atoms/FieldTags.svelte";

	import ScheduledStartBlock from "$atoms/ScheduledStartBlock.svelte";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// props
	export let todo: Todo;

	// declare variables
	let hideStartValue: boolean;
	let hideOrderValue: boolean;
	let value: string;
	$: hideStartValue = getContext("hideStartValue") as boolean;
	$: hideOrderValue = getContext("hideOrderValue") as boolean;
	$: description = "";

	// utils
	import { isToday } from "$utils/dateUtils";
</script>

<template lang="pug">
	form(class="group/form text-[0.85rem]", id!="{ formId }", method="post")
		.grid.grid-cols-6.gap-x-2.items-center(class="")
			FieldDescription(
				classes="col-span-3 bg-white/5 px-2 py-1",
				bind:value!="{ description }",
				formId!="{ formId }",
				placeholder="add new"
			)
			FieldTags(
				classes="bg-white/5 px-2 py-1",
				formId!="{ formId }",
				placeholder="tags"
			)
			//- button
			div
				button.bg-accent.text-primary.rounded.opacity-80.px-2(
					class!="text-[0.75rem] outline-neutral-100/60 {description ? 'inline-block' : 'hidden'}",
					formaction="?/createTodo",
					type="submit"
				) Submit
</template>
