<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
</script>

<template lang="pug">
	button.inline-block.back.underline.text-13.leading-none.flex.items-center.group(
		class="hover:text-accent opacity-80 hover:opacity-100",
		aria-label="Mark todo as completed",
		formaction="?/completeTodo",
		title="Mark todo as completed",
		type="submit"
	)
		.w-3.h-3.bg-white.flex.overflow-hidden(
			class="items-center justify-center group-hover:bg-accent opacity-90 hover:opacity-100"
		)
			.text-primary.opacity-0.select-none.pointer-events-none.leading-none.text-12(
				class="group-hover:opacity-100"
			) x
</template>
