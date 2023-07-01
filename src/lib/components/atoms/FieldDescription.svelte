<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { nanoid } from "nanoid";
	const genId = () => nanoid(8);
	export let classes = "";
	export let hidden = false;
	export let value = "";
	export let placeholder: string | null = null;
</script>

<template lang="pug">
	div
		+if('hidden == false')
			//-label.block(for="id-{genId}") Description
		input.border-0.px-0.py-0.inline-block.text-18.w-full.block(
			class!="lg:text-16 lg:w-auto lg:inline-block {classes}",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="description-{genId}",
			name!="description",
			placeholder!="{ placeholder }",
			type="text",
			value!="{ value }"
		)
</template>
