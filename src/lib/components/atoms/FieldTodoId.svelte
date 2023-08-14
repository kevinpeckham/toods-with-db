<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { nanoid } from "nanoid";
	const genId = nanoid();
	export let hidden = false;
	export let value = "";
</script>

<template lang="pug">
	div
		+if('hidden == false')
			label.block(for="id-{genId}") Todo ID
		input.block.text-primary.text-13(
			class="inline-block.mr-2",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="id-{genId}",
			name!="id",
			type="hidden",
			value!="{ value }"
		)
</template>
