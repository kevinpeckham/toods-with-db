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
		input.text-primary.border-0.text-white.px-0.py-0.inline-block(
			class=" {classes}",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="description-{genId}",
			name!="description",
			placeholder!="{ placeholder }",
			type="text",
			value!="{ value }"
		)
</template>