<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { nanoid } from "nanoid";
	export let formId = "";
	export let classes = "";
	export let value = "";
	export let placeholder: string | null = "tags";
</script>

<template lang="pug">
	input.border-0.block.rounded-md(
		class!="placeholder-current/80 {classes}",
		bind:value!="{ value }",
		id!="tags-{formId}",
		name!="tags",
		placeholder!="{ placeholder }",
		type="text"
	)
</template>
