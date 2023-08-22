<!-- Perhaps the load function on this page should only load incomplete todos ??-->
<script lang="ts">
	// components
	import EditLink from "$atoms/EditLink.svelte";
	import Header from "$organisms/Header.svelte";
	import TagsBlock from "$atoms/TagsBlock.svelte";
	import DeleteButton from "$atoms/ButtonDelete.svelte";
	import CompleteButton from "$atoms/ButtonComplete.svelte";
	import FieldTodoId from "$atoms/FieldTodoId.svelte";
	import TodosList from "$molecules/TodosList.svelte";
	import TodoListItem from "$atoms/TodoListItem.svelte";
	import DayAndDateBlock from "$atoms/DayAndDateBlock.svelte";

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

	const today = new Date();

	let todo: Todo;

	type Tag = string;
	let tag: Tag;

	let date: string;
	let time: string;

	let name = "test";
	$: name = data.feed?.name ? data.feed.name : "test";
</script>

<template lang="pug">
	//- body
	main.relative.grid.bg-primary.pt-4.pb-48.px-4.max-w-screen.overflow-x-hidden(
		class="lg:px-8",
		style="min-height: calc(100vh - 4rem)"
	)
		//- body
		.grid.grid-cols-1.w-full.gap-8(class="lg:grid-cols-2")
			//- column 1
			div(data-column)
				//- scheduled for today
				.mb-8
					.mb-6
						TodosList(
							hideStartValue!="{ true }",
							showDivider!="{ false }",
							showOnlyScheduledToStartOn!="{ today }",
							todos!="{ todos }"
						)
							//- header
							svelte:fragment(slot="header")
								a.inline-block.opacity-80(
									href!="/day/{justDate(today).replace(/\\./g,'-')}"
								) Today
								DayAndDateBlock(date!="{ today }")

					//- form: add a new to do to today
					.hidden(class="lg:block")
						//-.px-2.mb-2.opacity-80(class="text-[0.85rem]") Add Todo to Today
						//- FormCompactCreateNewTodo(action!="?/createTodoToday")
						TodoListItem(isNewTodo!="{ true }")
							svelte:fragment(slot="header")
								| Add a new to do to today
								DayAndDateBlock(date!="{ today }")

				//- completed today
				.mb-8.hidden(class="sm:block")
					TodosList(
						hideStartValue!="{ true }",
						showCompleted!="{ true }",
						showDivider!="{ false }",
						showHeader!="{ false }",
						showIncomplete!="{ false }",
						showOnlyScheduledToStartOn!="{ today }",
						todos!="{ todos }"
					)

				//- scheduled for tomorrow
				.mb-8
					TodosList(
						hideStartValue!="{ true }",
						showOnlyScheduledToStartOn!="{ getTomorrowDate() }",
						todos!="{ todos }"
					)
						svelte:fragment(slot="header")
							a.inline-block(
								href!="/day/{today.getMonth()+1}-{today.getDate()+1}-{today.getFullYear()}"
							) Tomorrow
							DayAndDateBlock(date!="{ getTomorrowDate() }")

				//- scheduled for the future
				TodosList(
					showScheduledInFuture!="{ true }",
					showScheduledInPast!="{ false }",
					showScheduledToday!="{ false }",
					showScheduledTomorrow!="{ false }",
					showUnscheduled!="{ false }",
					todos!="{ todos }"
				)
					svelte:fragment(slot="header")
						| Scheduled for beyond tomorrow
						DayAndDateBlock(date!="{ newDayFromToday(2) }")
						span.opacity-80.leading-none &nbsp;+

			//- column 2
			div(data-column)
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
					svelte:fragment(slot="header")
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
					svelte:fragment(slot="header")
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
					svelte:fragment(slot="header")
						| Unscheduled
</template>
