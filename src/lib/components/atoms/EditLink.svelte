<!--
@component
Link to bring user to the edit page for a todo.
-->

<script lang="ts">
	export let todoId: string;
</script>

<template lang="pug">
	a.inline-block.leading-none(
		class="hover:text-accent underline underline-offset-4 opacity-80 hover:opacity-100",
		href="/t/{todoId}",
		title="Edit todo"
	) edit
</template>
