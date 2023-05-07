<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
</script>

<template lang="pug">
	button.inline-block.back.underline.underline-offset-4.leading-none.flex.items-center.group(
		class="hover:text-accent opacity-80 hover:opacity-100",
		aria-label="Add to today",
		formaction="?/moveToNextDay",
		title="Reschedule todo to 24 hours later",
		type="submit"
	) +24h
</template>
