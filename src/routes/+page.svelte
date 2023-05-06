<!-- Perhaps the load function on this page should only load incomplete todos ??-->
<script lang="ts">
	// components
	import EditLink from "$atoms/EditLink.svelte";
	import Header from "$organisms/Header.svelte";
	import TagsBlock from "$atoms/TagsBlock.svelte";
	import DeleteButton from "$atoms/DeleteButton.svelte";
	import CompleteButton from "$atoms/CompleteButton.svelte";
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import TodosList from "$molecules/TodosList.svelte";

	// types
	import type { PageData } from "./$types";
	import type { Todo } from "@prisma/client";
	export let data: PageData;

	// utils
	import { getTomorrowDate } from "$utils/dateUtils";

	let todos: Todo[];
	$: todos = data?.feed?.todos ?? [];
	$: incomplete = todos.filter((todo) => todo.completedAt == null);
	$: completed = todos.filter((todo) => todo.completedAt != null);

	//- sort by order
	// $: todos.sort((a, b) => {
	// 	if (a.order > b.order) return 1;
	// 	if (a.order < b.order) return -1;
	// 	return 0;
	// });


	let todo: Todo;

	type Tag = string;
	let tag: Tag;

	let date: string;
	let time: string;

	let name = "test";
	$: name = data.feed?.name ? data.feed.name : "test";

	// functions
	function displayDate(date: Date) {
		const dateString = date.toLocaleString(); // e.g. 9/19/2021, 10:00:00 AM
		const dateOnly = dateString.split(",")[0]; // e.g. 9/19/2021
		const timeString = dateString.split(",")[1].trim(); // e.g. 10:00:00 AM
		const timeOnly = timeString.split(" ")[0]; // e.g. 10:00:00
		const timeNoSeconds = timeString.split(":").slice(0, 2).join(":"); // e.g. 10:00
		const amPm = timeString.split(" ")[1]; // e.g. AM

		return [dateOnly, timeNoSeconds, amPm] as string[];
	}

</script>

<template lang="pug">
	//- head
	svelte:head
		title toods + sqlite
		meta(
			content="",
			name=""
		)

	//- body
	Header(name!="{ name }")
	main.relative.grid.bg-primary.p-4.pb-48.text-white.px-8(
		style="min-height: calc(100vh - 4rem)"
	)
		//- body
		.grid.grid-cols-2.w-full.gap-8
			div
				//- scheduled for today
				TodosList(
					hideScheduledToStartAt!="{ true }",
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showScheduled!="{ true }",
					showScheduledToStartOn!="{ new Date() }",
					todos!="{ todos }"
					)
					.flex.mb-2 Scheduled for
						a.inline-block.ml-2.underline.underline-offset-4(href="/today") today

				//- scheduled for tomorrow
				TodosList(
					hideScheduledToStartAt!="{ true }",
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showScheduled!="{ true }",
					showScheduledToStartOn!="{ getTomorrowDate() }",
					todos!="{ todos }"
					)
					.flex.mb-2 Scheduled for tomorrow

				//- scheduled for the future
				TodosList(
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showScheduledInFuture!="{ true }",
					showScheduledInPast!="{ false }",
					showScheduledToday!="{ false }",
					showScheduledTomorrow!="{ false }",
					showUnscheduled!="{ false }",
					todos!="{ todos }"
				)
					.flex.mb-2 Scheduled for
						a.inline-block.ml-2.underline.underline-offset-4(href="/") beyond tomorrow

			//- column 2
			div
				//- scheduled for the past
				TodosList(
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showScheduled!="{ true }",
					showScheduledInFuture!="{ false }",
					showScheduledInPast!="{ true }",
					showScheduledToday!="{ false }",
					showUnscheduled!="{ false }",
					todos!="{ todos }"
					)
					.flex.mb-2 Scheduled for
						a.inline-block.ml-2.underline.underline-offset-4(href="/") the past

				//- unscheduled
				TodosList(
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showScheduled!="{ false }",
					todos!="{ todos }"
					)
					.flex.mb-2 Unscheduled


</template>
