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

</script>

<template lang="pug">
	a.inline-block.leading-none(
		class=" hover:text-slate-800 hover:underline underline-offset-4 opacity-80 hover:opacity-100",
		href="/t/{todo.id}",
		title="edit todo"
	) edit
</template>
