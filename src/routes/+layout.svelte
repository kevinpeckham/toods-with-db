<script lang="ts">
	import "/src/app.css";

	// import child page data
	import { page } from "$app/stores";

	// components
	import Header from "$components/organisms/Header.svelte";
</script>

<template lang="pug">
	//- head metadata
	svelte:head
		title { $page.data.metaTitle ?? "Sage Energy" }
		+if('$page.data.metaDescription')
			meta(
				content!="{ $page.data.metaDescription }",
				name="description"
			)
	Header
	slot
</template>
