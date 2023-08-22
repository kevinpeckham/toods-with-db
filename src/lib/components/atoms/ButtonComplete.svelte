<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// variables
	$: next = getContext("next") as boolean;
	$: nextStyle = next
		? "text-neutral-100 bg-primary/80 group-hover:bg-primary"
		: "bg-neutral-200 text-primary group-hover:bg-accent";

	// props
	export let disabled = false;
</script>

<template lang="pug">
	button.inline-block.underline.leading-none.flex.items-center.group.w-3.h-3(
		class!="opacity-80 hover:opacity-100",
		aria-label="Mark todo as completed",
		disabled!="{ disabled ? true : null }",
		formaction="?/completeTodo",
		title="Mark todo as completed",
		type="submit"
	)
		.w-3.h-3.flex.overflow-hidden.rounded-sm(
			class!="{nextStyle} items-center justify-center opacity-90 hover:opacity-100"
		)
			.opacity-0.select-none.pointer-events-none.leading-none.text-12(
				class="group-hover:opacity-100"
			) x
</template>
