<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// context api
	$: next = getContext("next");

	// nanoid is a library that generates random strings
	import { nanoid } from "nanoid";
	import { getContext } from "svelte";

	// genId is a function that generates a random string
	const genId = () => nanoid(8);
	export let hidden = false;
	$: value = next ? "true" : "";
</script>

<template lang="pug">
	div
		+if('hidden == false')
			label.block(for="id-{genId}") Todo Next
		input.block.text-primary.text-13(
			class="inline-block.mr-2",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="id-{genId}",
			name!="next",
			type="hidden",
			value!="{ value }"
		)
</template>
