<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { nanoid } from "nanoid";
	const genId = () => nanoid(8);
	export let hidden = false;
	export let value = "";
</script>

<template lang="pug">
	div
		+if('hidden == false')
			label.block(for="id-{genId}") Schedule To Start At
		input.block.text-primary.text-13(
			class="inline-block.mr-2",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="scheduledToStartAt-{genId}",
			name!="scheduledToStartAt",
			type="hidden",
			value!="{ value }"
		)
</template>
