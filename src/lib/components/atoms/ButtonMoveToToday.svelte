<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
</script>

<template lang="pug">
	button.whitespace-nowrap.inline-block.back.underline.underline-offset-4.leading-none.flex.items-center.group(
		class="hover:text-accent opacity-80 hover:opacity-100",
		aria-label="Add to today",
		formaction="?/moveToToday",
		title="Add to today",
		type="submit"
	) →&nbsp;today
</template>
