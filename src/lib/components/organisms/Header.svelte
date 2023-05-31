<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	export let message = "Welcome, Stranger!";
	export let showTodaysDate = true;

	const date = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		hour: undefined,
		minute: undefined,
		hour12: undefined,
		timeZone: "America/New_York",
		timeZoneName: undefined,
	});
</script>

<template lang="pug">
	.relative.flex.justify-between.items-center.px-8.pt-6.pb-2.border-b.mb-8(
		class="border-b-neutral-100/20"
	)
		//- message
		.flex.items-center
			.mr-2: a.tracking-widest.leading-none.underline-offset-4.text-accent(
				class="pointer:cursor",
				href="/"
			) TOODS
			//.mr-3.leading-none |
			//.italic.font-light.font-serif.leading-none.opacity-80 { message }

		div: a.text-13(
			class="inline-block py-2 px-2 rounded outline-white outline leading-none",
			href="/create"
		) + Create Todo
</template>
