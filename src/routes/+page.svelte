<!-- Perhaps the load function on this page should only load incomplete todos ??-->
<script lang="ts">
	// import nanoid for generating unique ids
	//import { nanoid } from "nanoid";

	// broswer (for local storaget)
	// import { browser } from "$app/environment";

	// components
	import EditLink from "$atoms/EditLink.svelte";
	import Header from "$organisms/Header.svelte";
	import TagsBlock from "$atoms/TagsBlock.svelte";
	import DeleteButton from "$atoms/ButtonDelete.svelte";
	import CompleteButton from "$atoms/ButtonComplete.svelte";
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import TodosList from "$molecules/TodosList.svelte";
	import DayAndDateBlock from "$atoms/DayAndDateBlock.svelte";
	import CreateNewTodo from "$atoms/ButtonCreateNewTodo.svelte";

	// types
	import type { PageData } from "./$types";
	import type { Todo } from "@prisma/client";
	export let data: PageData;

	// utils
	import {
		justDate,
		getTomorrowDate,
		getDayOfWeek,
		dayAndDateString,
		newDayFromToday,
		isToday,
	} from "$utils/dateUtils";

	// variables
	let todos: Todo[];

	// reactive
	$: todos = data?.feed?.todos ?? [];
	$: incomplete = todos.filter((todo) => todo.completedAt == null);
	$: completed = todos.filter((todo) => todo.completedAt != null);

	// backup todos to local storage
	// if (browser) {
	// 	localStorage.setItem("todos", JSON.stringify(todos));
	// }

	const today = new Date();

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
	// function displayDate(date: Date) {
	// 	const dateString = date.toLocaleString(); // e.g. 9/19/2021, 10:00:00 AM
	// 	const dateOnly = dateString.split(",")[0]; // e.g. 9/19/2021
	// 	const timeString = dateString.split(",")[1].trim(); // e.g. 10:00:00 AM
	// 	const timeOnly = timeString.split(" ")[0]; // e.g. 10:00:00
	// 	const timeNoSeconds = timeString.split(":").slice(0, 2).join(":"); // e.g. 10:00
	// 	const amPm = timeString.split(" ")[1]; // e.g. AM

	// 	return [dateOnly, timeNoSeconds, amPm] as string[];
	// }
</script>

<template lang="pug">
	//- head
	svelte:head
		title toods
		meta(
			content="",
			name=""
		)

	//- body
	Header(message!="It's time to get your shit together.")
	main.relative.grid.bg-primary.pt-4.pb-48.px-3.max-w-screen.overflow-x-hidden(
		class="text-18 lg:text-16 lg:px-8"
		style="min-height: calc(100vh - 4rem)"
	)
		//- body
		.grid.grid-cols-1.w-full.gap-8(lg:grid-cols-2)
			//- column 1
			div
				//- scheduled for today
				.mb-8
					TodosList(
						hideStartValue!="{ true }",
						showDivider!="{ false }",
						showOnlyScheduledToStartOn!="{ today }",
						todos!="{ todos }"
					)
						svelte:fragment
							a.inline-block.underline.underline-offset-8(
								href!="/day/{justDate(today).replace(/\\./g,'-')}"
							) Today
							DayAndDateBlock(date!="{ today }")
					.hidden.div(class="lg:block")
						CreateNewTodo

				//- completed today
				.mb-8
					TodosList(
						hideStartValue!="{ true }",
						showCompleted!="{ true }",
						showDivider!="{ false }",
						showHeader!="{ false }",
						showIncomplete!="{ false }",
						showOnlyScheduledToStartOn!="{ today }",
						todos!="{ todos }"
					)
						svelte:fragment
							DayAndDateBlock(date!="{ today }")

				//- scheduled for tomorrow
				.mb-8
					TodosList(
						hideStartValue!="{ true }",
						showOnlyScheduledToStartOn!="{ getTomorrowDate() }",
						todos!="{ todos }"
					)
						svelte:fragment
							a.inline-block.ml-2.underline.underline-offset-4(
								href!="/day/{today.getMonth()+1}-{today.getDate()+1}-{today.getFullYear()}"
							) Tomorrow
							DayAndDateBlock(date!="{ getTomorrowDate() }")

				//- scheduled for the future
				TodosList(
					showScheduledInPast!="{ false }",
					showScheduledToStartAfter!="{ getTomorrowDate() }",
					showScheduledToday!="{ false }",
					showScheduledTomorrow!="{ false }",
					showUnscheduled!="{ false }",
					todos!="{ todos }"
				)
					svelte:fragment
						| Scheduled for beyond tomorrow
						DayAndDateBlock(date!="{ newDayFromToday(2) }")
						span.opacity-80.leading-none &nbsp;+

			//- column 2
			div
				//- scheduled for the past
				TodosList(
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showDivider!="{ false }",
					showScheduled!="{ true }",
					showScheduledInFuture!="{ false }",
					showScheduledInPast!="{ true }",
					showScheduledToday!="{ false }",
					showUnscheduled!="{ false }",
					todos!="{ todos }"
				)
					svelte:fragment
						| Scheduled for
						a.inline-block.ml-2.underline.underline-offset-4(href="/") the past
				//- templates
				TodosList(
					showArchived!="{ false }",
					showDivider!="{ false }",
					showOnlyTemplates!="{ true }",
					showTemplates!="{ true }",
					todos!="{ todos }"
				)
					svelte:fragment
						| Templates

				//- unscheduled
				TodosList(
					showArchived!="{ false }",
					showCompleted!="{ false }",
					showScheduled!="{ false }",
					showTemplates!="{ false }",
					showUnscheduled!="{ true }",
					todos!="{ todos }"
				)
					svelte:fragment
						| Unscheduled
</template>
