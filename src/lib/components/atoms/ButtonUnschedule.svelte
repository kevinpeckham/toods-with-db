<!--
@component
Button to unschedule a todo.
-->

<script lang="ts">
</script>

<template lang="pug">
	button.inline-block.back.underline.underline-offset-4.leading-none.flex.items-center.group(
		class="hover:text-accent opacity-80 hover:opacity-100",
		aria-label="Mark todo as completed",
		formaction="?/unscheduleTodo",
		title="unschedule todo",
		type="submit"
	) unsched
</template>
