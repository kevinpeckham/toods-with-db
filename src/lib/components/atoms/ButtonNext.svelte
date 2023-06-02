<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	export let next = false;
</script>

<template lang="pug">
	button.inline-block.back.underline.underline-offset-4.leading-none.flex.items-center.group(
		class="hover:text-accent opacity-80 hover:opacity-100",
		aria-label="toggle next",
		formaction="?/toggleNext",
		title="toggle next",
		type="submit"
	) Next
</template>
