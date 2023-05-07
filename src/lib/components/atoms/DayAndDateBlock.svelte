<!--
@component
Display the day of the week and the date in a small block.
e.g. "Sunday, 9/19/23"
-->

<script lang='ts'>

// props
export let date: Date = new Date();

// utils
import { dayAndDateString } from '$utils/dateUtils';
</script>

<template lang='pug'>
span.opacity-80.inline-block.whitespace-nowrap.tracking-wide(class="text-[.95em]")
  span.ml-2 -
  span.inline-block.ml-2 { dayAndDateString(date) }
</template>