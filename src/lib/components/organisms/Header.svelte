<!--
@component
Here's some documentation for this component.
-->

<script lang='ts'>
export let name= 'Stranger';
</script>

<template lang='pug'>
.relative.grid.h-auto.bg-primary.p-4.text-white.px-8.pt-8.w-full
  .w-full
    //- welcome message
    .flex.justify-between
      a.inline-block.mb-4(class="pointer:cursor hover:underline underline-offset-4 hover:text-accent" href="/") Howdy, {name}!
      div: a.text-13(href="/create" class="inline-block py-2 px-2 rounded outline-white outline leading-none") + Create Todo
</template>