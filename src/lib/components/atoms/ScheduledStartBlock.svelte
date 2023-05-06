<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// props
	export let start: Date | null = null;

	// utils
	import { justDate, isToday, isTomorrow, isYesterday, getDayOfWeek } from "$utils/dateUtils";
</script>

<template lang="pug">
	+if('start')
		.flex
			+if('isToday(start)')
				.opacity-80.italic(class="text-[0.8em]") today
				+elseif('isTomorrow(start)')
					.opacity-80.italic(class="text-[0.8em]") tomorrow
				+elseif('isYesterday(start)')
					.opacity-80.italic(class="text-[0.8em]") yesterday

				+else
					.opacity-80(class="text-[0.8em]") {getDayOfWeek(start)}, { start ? justDate(start, true) : "" }
</template>
