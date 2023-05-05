<!--
@component
Display tags in a row.
-->

<script lang="ts">
	export let tags: string[] = [];
</script>

<template lang="pug">
	.inline-block.mr-4
		+each('tags as tag')
			span.inline-block.py-1.px-2.rounded.border-white.border.leading-none.ml-3.text-12(
				class="border-[1px]"
			) { tag }
</template>
