<!--
@component
Display tags in a row.
-->

<script lang="ts">
	// context api
	import { getContext } from "svelte";

	// variables
	$: next = getContext("next") as boolean;
	$: nextStyle = next ? "border-primary" : "border-neutral-200";

	// props
	export let tags: string[] = [];
</script>

<template lang="pug">
	+if('tags.length > 0 && tags[0] != ""')
		.items-center.gap-2.flex
			+each('tags as tag')
				span.inline-block.py-1.px-2.rounded.border.leading-none(
					class!="{nextStyle} border-[1px] text-[.75em]"
				) { tag }
</template>
