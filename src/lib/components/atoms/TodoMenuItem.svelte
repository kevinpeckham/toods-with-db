<!--
@component
Link to bring user to the edit page for a todo.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// get todo from context api
	const todo = getContext("todo") as Todo;

	// props
	export let classes = "";
	export let href: string | null = null;
	export let formaction: string | null = null;
	export let tag = "a";
	export let title = "";
	export let type: string | null = null;

</script>

<template lang="pug">
	svelte:element.inline-block.leading-none.border-b.pb-2.w-full.text-left(
		class!=" border-slate-800/10 hover:text-slate-800 hover:underline underline-offset-4 opacity-80 hover:opacity-100 {classes}",
		formaction!="{formaction}",
		href!="{href}",
		this!="{tag}"
		title!="{title}"
		type!="{type}"
	)
		slot
</template>
