<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// types
	import type { Todo } from "@prisma/client";

	// variables from context api
	$: todo = getContext("todo") as Todo;

	// props
	export let hidden = false;


</script>

<template lang="pug">
	div
		+if('hidden == false')
			label.block(for="id-{todo.id}") { todo.next }
		input.block.text-primary.text-13(
			class="inline-block.mr-2",
			hidden!="{ hidden ? 'hidden' : 'hidden' }",
			id!="id-{todo.id}",
			name!="next",
			type="hidden",
			value!="{ todo.next ? 'next' : null }"
		)
</template>
