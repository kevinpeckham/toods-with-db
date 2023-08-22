<!--
@component
Form field for description data point of single todo.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// utils
	import { scrubDescriptionString } from "$utils/scrubUtils";

	// types
	import type { Todo } from "@prisma/client";
	import type { Writable } from "svelte/store";

	// get todo from context api
	const todo = getContext("todo") as Todo;
	const todoId = todo?.id ?? "";

	// refs
	export let button: HTMLButtonElement;

	// props
	export let classes = "";
	export let hidden = false;
	export let isNewTodo = false;
	export let value = todo.description ?? "";
	export let placeholder: string | null = null;

	// get todoDescriptionStore from context api
	const todoDescriptionStore = getContext(
		"todoDescriptionStore",
	) as Writable<string>;

	// when value changes update store
	$: $todoDescriptionStore = value;

	// if new todo
	$: if (isNewTodo) {
		// set placeholder
		placeholder = "Add a new todo...";
	}

	// handle keydown event
	// if enter key is pressed, submit form
	function handleKeyDown(event: KeyboardEvent) {
		const input = event.target as HTMLInputElement;
		const key = event.key;
		const value = input.value;
		const preventDefault = () => event.preventDefault();

		if (key === "Enter") {
			// if not new todo, submit button for updating description
			if (!isNewTodo) {
				event.preventDefault();
				button.disabled = false;
				button.click();
			}

			// if new todo, submit button for creating todo
			else {
				const target = event.target as HTMLInputElement;
				const form = target?.parentElement?.parentElement as HTMLFormElement;
				const submitButton = form?.lastElementChild as HTMLButtonElement;

				// submit button
				submitButton.click();

				// clear description field
				target.value = "";

				// clear tag fields
				const tagFields = Array.from(
					form.querySelectorAll("input[data-tag]"),
				) as HTMLInputElement[];
				tagFields.forEach((tagField) => {
					tagField.focus();
					tagField.value = "";
				});

				// revert focus to description field
				target.focus();
			}
		}
		// if invalid character
		else if (key.length === 1 && key?.match(/[^a-z1-9-:.,;?/() ]/gi)) {
			preventDefault();
			return;
		} else return;
	}
	function onInput(event: InputEvent) {
		const input = event.target as HTMLInputElement;

		// scrub input
		const scrubbed = input.value ? scrubDescriptionString(input.value) : "";

		// update input value if necessary after scrubbing
		if (value != scrubbed) input.value = scrubbed;
	}
</script>

<template lang="pug">
	input.border-0.px-0.py-0.block.rounded-md(
		class!="lg:w-full truncate placeholder-current/80 {classes}",
		bind:value!="{ value }",
		hidden!="{ hidden ? 'hidden' : 'hidden' }",
		id!="description-{todo?.id}",
		name!="description",
		on:input!="{ onInput }",
		on:keydown!="{ handleKeyDown }",
		placeholder!="{ placeholder }",
		type="text"
	)
	+if('!isNewTodo')
		button.hidden(
			bind:this!="{ button }",
			disabled!="{ true }",
			formaction!="?/editTodoDescription",
			type="submit"
		) Submit
</template>
