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
			//-label.block(for="id-{genId}") Description
		input.block.text-primary.border-0.text-white.px-0.py-0(
			class="bg-transparent inline-block.mr-2",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="description-{genId}",
			name!="description",
			type="text",
			value!="{ value }"
		)
</template>
