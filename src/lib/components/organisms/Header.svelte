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
	.flex.justify-between.items-center.px-8.py-4.border-b(
		class=" sm:relative border-b-neutral-100/20"
	)
		//- branding
		.flex.items-center
			.mr-2: a.tracking-widest.leading-none.underline-offset-4.text-accent(
				class="pointer:cursor",
				href="/"
			) TOODS

		//- action button
		.flex-grow.flex.justify-end(class="sm:relative")
			a.text-13(
				class="inline-block py-2 px-2 rounded outline-white outline leading-none",
				href="/create"
			) + Create Todo
</template>
