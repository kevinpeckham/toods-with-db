<!--
@component
Display tags in a row.
-->

<script lang="ts">
	export let tags: string[] = [];
</script>

<template lang="pug">
	+if('tags.length > 0 && tags[0] != ""')
		.flex.items-center.gap-2
			+each('tags as tag')
				span.inline-block.py-1.px-2.rounded.border-white.border.leading-none(
					class="border-[1px] text-[.75em]"
				) { tag }
</template>
