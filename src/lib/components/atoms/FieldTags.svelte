<!--
@component
Form field for tags data point of single todo.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// utils
	import { scrubTagString } from "$utils/scrubUtils";
	import {
		adjustInputWidth,
		waitForInputValue,
		splitInputValueAtCursor,
	} from "$utils/formUtils";

	// types
	import type { Todo } from "@prisma/client";

	// settings
	import { settings } from "$lib/settings/general";
	const maxTags = settings.tags.maxTagsPerTodo; // 3
	const maxTagLength = settings.tags.maxTagLength; // 16
	const maxTagStringLength = settings.tags.maxTagStringLength(); // 50

	// get todo from context api
	const todo = getContext("todo") as Todo;
	const todoId = todo?.id ?? "";

	// get next from context api
	const next = getContext("next") as boolean;
	$: nextStyle = next ? "border-primary" : "border-neutral-200";

	// refs
	export let tagsField: HTMLInputElement;
	export let button: HTMLButtonElement;
	export let tagsContainer: HTMLDivElement;
	export let newTagInput: HTMLInputElement;

	// variables

	// get current value from database
	$: tagsFieldLastDbValue = todo?.tags ?? "";

	// derive current tags value
	$: tags = tagsFieldLastDbValue.split(",") ?? [];

	// is bound to the new tag input field
	let newTagInputValue: string;
	$: newTagInputValue = "+";

	// is bound to the disabled attribute of the new tag input field
	let newTagInputDisabled: boolean;
	$: newTagInputDisabled = tags.length >= maxTags;

	// when tags change, update tags field value
	let tagsFieldValue = tagsFieldLastDbValue;
	$: tagsFieldValue = tags.join(",");

	// variables used in template
	let tag: string;

	// functions - tag values
	function addNewValueToTags(value: string) {
		if (!value || value == "+") return;
		tags = [...new Set([...tags, value])];
		tags = tags.filter((value) => value != "");
	}
	function updateTags(): string[] {
		// get array of tag input field containers
		const children = tagsContainer?.children ?? null;
		const inputs = children
			? (Array.from(tagsContainer?.children) as HTMLInputElement[])
			: [];

		// get updates values
		const updatedTagValues = inputs.map((input) => input.value ?? "");

		// remove empty values
		const filteredTagValues = updatedTagValues.filter((value) => value != "");

		// remove duplicates
		const uniqueTagValues = [...new Set(filteredTagValues)];

		// update tags
		tags = uniqueTagValues;

		return uniqueTagValues;
	}
	function updateThisTagInTagsArray(existingValue: string, newValue: string) {
		const index = tags.indexOf(existingValue);
		if (index === -1) return;
		tags[index] = newValue;
		return tags;
	}
	function getInputs() {
		const children = tagsContainer?.children ?? null;
		const array = children
			? (Array.from(tagsContainer?.children) as HTMLInputElement[])
			: [];
		return array;
	}
	function updateInputBasedOnTagValue(value: string) {
		const index = tags.indexOf(value);
		setTimeout(() => {
			const inputs = getInputs();
			const input = inputs[index] ? inputs[index] : null;
			if (input) input.value = value;
			if (input) inputs.forEach((input) => adjustInputWidth(input));
		}, 2);
	}
	function getInputByValue(value: string) {
		let input: HTMLInputElement | undefined = undefined;
		setTimeout((input: HTMLInputElement | undefined) => {
			const inputs = getInputs();
			input = inputs.find((input) => input.value === value);
		}, 2);
		return input;
	}

	function clickSubmitButton() {
		if (!button) return;
		button.disabled = false;
		button.click();
		button.disabled = true;
	}
	function revertNewTagInputValue() {
		newTagInput.value = "+";
	}
	function revertNewTagInputWidth() {
		adjustInputWidth(newTagInput, "+");
	}
	function updateDbIfExpectedValue(expectedValue: string) {
		// wait for tagsField value to be updated in the DOM
		if (expectedValue === tagsFieldLastDbValue) return;
		else {
			waitForInputValue(tagsField, expectedValue, clickSubmitButton, 1, 20);
			tagsFieldLastDbValue = expectedValue ?? "";
		}
	}
	function setInputWidth(value: string) {
		return `width: ${value.length + 2.25}ch`;
	}

	// add new tag button functions
	function onTagFocus(event: FocusEvent) {
		const input = event.target as HTMLInputElement;
		const value = input.value;

		// if is an existing tag return
		if (input !== newTagInput) {
			return;
		}

		// if new tag (implicit) && the maximum number of tags are already populated then blur and return
		else if (tags.length >= maxTags) {
			input.blur();
			return;
		}

		// if new tag (implicit) && the only text in the tag is "+", replace it with an empty string
		else if (value === "+") {
			input.value = "";
		}
	}

	// this function will watch to make sure you only type allowed characters
	// it will also translate uppercase characters to lower-case
	// and it will create a new tag when you type a comma
	function onTagKeydown(event: KeyboardEvent) {
		const input = event.target as HTMLInputElement;
		const children = tagsContainer?.children;
		const inputs =
			children && children.length >= 1
				? (Array.from(children) as HTMLInputElement[]) ?? []
				: [];
		const lastInput = inputs[0] ? inputs[inputs.length - 1] : null;
		const isNewTagInput = input === newTagInput;
		const value = input.value;
		const key = event.key;

		// helpers
		const blur = () => input.blur();
		const preventDefault = () => event.preventDefault();
		const undoTagEdit = () => (tags = tagsFieldLastDbValue.split(","));
		const previousInput = () =>
			(input.previousElementSibling as HTMLInputElement) ?? null;

		// Case 1: Enter or Space
		if (key === "Enter" || key === " ") {
			preventDefault();
			if (!isNewTagInput) {
				updateTags();
			}
			blur();
			return;
		}

		// Case 2: Escape
		else if (key === "Escape") {
			if (isNewTagInput) {
				// if new tag, reset the value and width and blur
				revertNewTagInputValue();
				revertNewTagInputWidth();
				blur();
			} else {
				// if existing tag, undo changes to tag and then blur
				undoTagEdit();
				blur();
			}
			return;
		}

		// Case 3: Backspace
		else if (key === "Backspace") {
			// if is new input and value has only one character,
			// then revert the value and width
			// then if it exist, place focus on last existing tag input field
			// otherwise blur
			if (isNewTagInput && value.length === 0) {
				preventDefault();
				lastInput ? lastInput.focus() : blur();
				revertNewTagInputValue();
				revertNewTagInputWidth();
			} else if (!isNewTagInput && value.length === 1) {
				// if is existing tag and value has only one character,
				// then prevent default
				// then clear the value from the input field
				// note: we will keep a single character in the corresponding value in the tags array
				preventDefault();
				event.stopImmediatePropagation();
				input.value = "";

				adjustInputWidth(input, "");
			} else if (!isNewTagInput && value.length === 0) {
				// if is existing tag and value is empty, then prevent default
				// then blur
				preventDefault();
				blur();
				return;
			}
		}

		// Case 4: Uppercase Letter -> Lowercase Letter
		else if (key.length === 1 && key?.match(/[A-Z]/)) {
			// prevent default, input equivalent lowercase letter, and adjust width
			preventDefault();
			input.value = value + key.toLowerCase();
			adjustInputWidth(input);
			return;
		}

		// Case 5: Comma -> New Tag
		else if (key == ",") {
			preventDefault();

			// if we've already reached the max number of tags then return
			if (tags.length >= maxTags) return;

			// get text before and after cursor
			const [textBefore, textAfter] = splitInputValueAtCursor(input);

			// if this input is the add-new-tag input
			// then create a new tag and keep focus here
			if (isNewTagInput) {
				// update this input with value after comma and adjust width
				input.value = textAfter;
				adjustInputWidth(input, textAfter);

				// create a new tag with value before comma
				addNewValueToTags(textBefore);
			}

			// if this input is an existing tag input
			else {
				// update this input with value before comma and adjust width
				// also update the tags array to replace existing value with new value
				// note: soft-update so the input fields don't re-render
				input.value = textBefore;
				adjustInputWidth(input, textBefore);
				tags[tags.indexOf(value)] = textBefore;

				// update new tag input with value after comma and adjust width
				// then focus on new tag input
				newTagInput.value = textAfter;
				adjustInputWidth(newTagInput, textAfter);
				newTagInput.focus();
			}

			return;
		}

		// Case 6: Invalid Character
		// only a-z and '-' and ':' are allowed
		else if (key.length === 1 && key?.match(/[^a-z-:]/g)) {
			preventDefault();
			return;
		}

		// Case 6: All Else
		else return;
	}

	// function that is called when the contents of a single tag input field is changed
	function onTagInput(event: InputEvent) {
		const input = event.target as HTMLInputElement;
		const isNewTagInput = input === newTagInput;
		const previousInput =
			(input.previousElementSibling as HTMLInputElement) ?? null;
		const nextInput = input.nextElementSibling as HTMLInputElement;
		const value = input.value;

		// scrub value
		const scrubbed = input.value ? scrubTagString(value) : "";

		// if there is no value and this is not the add-new-tag input
		// update tags
		// then shift focus to the previous
		// then return
		if (!scrubbed && !newTagInput) {
			input.value = "";
			previousInput ? previousInput?.focus() : blur();
			updateTags();
			return;
		}

		// update input value if necessary after scrubbing
		if (value != scrubbed) input.value = scrubbed;

		// update tags
		// will also update the shim
		// will also update the tags field value
		if (input != newTagInput) updateTags();

		// adjust input width
		adjustInputWidth(input, scrubbed);

		return;
	}

	function onTagBlur(event: FocusEvent) {
		const input = event.target as HTMLInputElement;
		const inputs = getInputs();
		const previousInput =
			(input.previousElementSibling as HTMLInputElement) ?? null;
		const value = input.value;

		if (value == "" && input != newTagInput) {
			updateTags();
			if (previousInput) previousInput.focus();
		}

		// if the input is the add-new-tag input
		// then add the new tag to the tags array
		else if (input === newTagInput) {
			addNewValueToTags(value);
			revertNewTagInputValue();
			revertNewTagInputWidth();
			updateInputBasedOnTagValue(value);
		} else updateTags();

		// get expected tags field value
		const expectedValue = tags.join(",");

		// wait for tagsField value to be updated in the DOM
		if (expectedValue === tagsFieldLastDbValue) return;
		// if the tagsField value is empty, don't update the database yet or we'll lose focus which
		// we've direct to the previous input (if it exists)
		else if (value != "") {
			waitForInputValue(tagsField, expectedValue, clickSubmitButton, 1, 20);
			tagsFieldLastDbValue = expectedValue ?? "";
		}
	}
</script>

<template lang="pug">
	//- outer container
	.relative.pl-2.h-full.items-center.gap-2.flex.justify-end.w-full.overflow-x-scroll(
		class="group/tags text-[0.75em]"
	)
		//- hidden input field
		//- the update action will pull the value from this field
		input(
			bind:this!="{ tagsField }",
			bind:value!="{ tagsFieldValue }",
			id!="tags-{todoId}",
			maxLength="123",
			name!="tags",
			readonly="readonly",
			type="hidden"
		)

		//- tags container
		.items-center.gap-2.flex.justify-end.max-w-full(bind:this!="{ tagsContainer }")
			//- iterate individual tags
			+each('tags as tag, index')
				//- individual tag input field
				+if('tag')
					input(
						class=`
								bg-transparent
								border
								border-[1px]
								border-current
								cursor-pointer
								focus:cursor-text
								focus:opacity-100
								focus:text-accent
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
								text-center
								truncate
								whitespace-nowrap
								`,
						autocomplete="off",
						data-tag!="{ true }",
						maxlength!="{ maxTagLength }",
						name!="tag-{ index }",
						on:blur!="{ onTagBlur }",
						on:focus!="{ onTagFocus }",
						on:input!="{ onTagInput }",
						on:keydown!="{ onTagKeydown }",
						style!="{ setInputWidth(tag) }",
						title!="tag: { tag } - focus to edit",
						type="text",
						value!="{ tag }"
					)

		//- input for adding new tag // becomes new tag
		input#add-new-tag(
			class=`
				bg-transparent
				border
				border-[1px]
				border-current
				cursor-pointer
				disabled:!hidden
				focus:cursor-text
				focus:opacity-100
				focus:text-accent
				group-hover/form:flex
				group-focus-within/form:flex
				//hidden
				flex
				h-[3.25ex]
				max-h-[1.85em]
				hover:opacity-100
				//hover:text-accent
				items-center
				justify-center
				leading-none
				min-w-[4ch]
				opacity-60
				py-1
				!outline-none
				relative
				rounded
				text-center
				w-[4ch]
				whitespace-nowrap
				`,
			autocomplete="off",
			bind:this!="{ newTagInput }",
			bind:value!="{ newTagInputValue }",
			disabled!="{ newTagInputDisabled }",
			maxlength!="{ maxTagLength }",
			name!="add-new-tag",
			on:blur!="{ onTagBlur }",
			on:focus!="{ onTagFocus }",
			on:input!="{ onTagInput }",
			on:keydown!="{ onTagKeydown }",
			title="Add new tag: letters, hyphens, + colon only, max 16 chars.",
			type="text"
		)

		//- submit button
		button.hidden(
			bind:this!="{ button }",
			disabled!="{ true }",
			formaction!="?/editTodoTags",
			type="submit"
		) Submit
</template>
