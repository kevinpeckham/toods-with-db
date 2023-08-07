<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
</script>

<template lang="pug">
	button.inline-block.underline.underline-offset-4.leading-none(
		class="hover:text-accent opacity-80 hover:opacity-100",
		formaction="?/deleteTodo",
		title="Delete todo",
		type="submit"
	) delete
</template>
