<!--
@component
Form field for description data point of single todo.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// types
	import type { Todo } from "@prisma/client";

	// get todo from context api
	const todo = getContext("todo") as Todo;
	const todoId = todo?.id ?? "";

	// refs
	export let button: HTMLButtonElement;

	// props
	export let classes = "";
	export let hidden = false;
	export let value = todo.description ?? "";
	export let placeholder: string | null = null;

	// handle keydown event
	// if enter key is pressed, submit form
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			//- prevent form default submit
			event.preventDefault();

			//- enable description edit button
			button.disabled = false;

			//- click description edit submit button
			button.click();
		}
	}
</script>

<template lang="pug">
	input.border-0.px-0.py-0.block.rounded-md(
		class!="lg:w-full truncate placeholder-current/80 {classes}",
		bind:value!="{ value }",
		hidden!="{ hidden ? 'hidden' : 'hidden' }",
		id!="description-{todo?.id}",
		name!="description",
		on:keydown!="{ handleKeyDown }",
		placeholder!="{ placeholder }",
		type="text"
	)
	button.hidden(
		bind:this!="{ button }",
		disabled!="{ true }",
		formaction!="?/editTodoDescription",
		type="submit"
	) Submit
</template>
