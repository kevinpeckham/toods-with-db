<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// import context api functions
	import { setContext, getContext } from "svelte";

	// import nano id function for generating unique ids
	import { nanoid } from "nanoid";

	// import types from prisma
	import type { Todo } from "@prisma/client";

	// import components
	import FieldDescription from "$atoms/FieldDescription.svelte";
	import FieldTags from "$atoms/FieldTags.svelte";

	// generate new unique id for todo
	const todoId = nanoid();

	// pass todoId to children via context api
	setContext("todoId", todoId);

	// props
	export let action = "?/createTodoToday";
	// declare variables
	let value: string;

	$: description = "";
</script>

<template lang="pug">
	.px-2.mb-2.opacity-80(class="text-[0.85rem]") Add Todo to Today
	form(class="group/form text-[0.85rem]", id!="create-todo-form-{ todoId }", method="post")
		.grid.grid-cols-6.gap-x-2.items-center(class="")
			//- description field
			FieldDescription(
				classes="col-span-3 bg-white/5 px-2 py-1",
				bind:value!="{ description }",
				placeholder="description"
			)
			//- tags field
			FieldTags(
				classes="bg-white/5 px-2 py-1",
				placeholder="tags"
			)
			//- submit button
			.h-full
				button.bg-accent.text-primary.rounded.opacity-80.px-2.h-full(
					class!="text-[0.75rem] outline-neutral-100/60 {description ? 'inline-block' : 'hidden'}",
					formaction!="{ action }",
					type="submit"
				) Submit
</template>
