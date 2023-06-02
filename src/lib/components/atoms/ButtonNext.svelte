<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// variables
	$: next = getContext("next") as boolean;
	$: dynamicClasses = next ? "" : "hover:text-accent";

	// constants
	const defaultClasses = `
	inline-block
	back
	underline
	underline-offset-4
	leading-none
	flex
	items-center
	group
	opacity-80
	hover:opacity-100`;
</script>

<template lang="pug">
	button(
		class!="{defaultClasses} {dynamicClasses}",
		aria-label="toggle next",
		formaction="?/toggleNext",
		title="toggle next",
		type="submit"
	)
		span.inline-block &nbsp;!&nbsp;
</template>
