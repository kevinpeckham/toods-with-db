<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	export let name = "Stranger";

	const date = new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", hour: undefined, minute: undefined, hour12: undefined, timeZone: "America/New_York", timeZoneName: undefined})
</script>

<template lang="pug">
	.relative.grid.h-auto.bg-primary.p-4.text-white.px-8.pt-8.w-full
		.w-full
			//- welcome message
			.flex.justify-between
				div.flex
					div.mb-4 {date}
					div.px-4 /
					a.inline-block.mb-4.mr-4(
						class="pointer:cursor hover:underline underline-offset-4 hover:text-accent",
						href="/"
					) Welcome, { name }!



				div: a.text-13(
					class="inline-block py-2 px-2 rounded outline-white outline leading-none",
					href="/create"
				) + Create Todo
</template>
