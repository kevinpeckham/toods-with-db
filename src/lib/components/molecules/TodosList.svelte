<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	import { setContext } from "svelte";

	// components
	import TodoListItem from "$atoms/TodoListItem.svelte";
	import { todosStore } from "$stores/todosStore";

	// types from the Prisma schema
	import type { Todo } from "@prisma/client";

	// props
	export let todos: Todo[] = [];

	//-- hide certain todo values
	export let hideScheduledToStartAt = false;

	//-- show / hide todos that fit certain criteria
	export let showArchived = false;
	export let showCompleted = false;
	export let showCompletedOn: Date | null = null;
	export let showScheduled = true;
	export let showUnscheduled = true;
	export let showScheduledToStartOn: Date | null = null;
	export let showScheduledInPast = true;
	export let showScheduledToday = true;
	export let showScheduledTomorrow = true;
	export let showScheduledInFuture = true;
	export let notScheduledToStartOn: Date | null = null;

	// constants
	const today = new Date();
	const startOfDayToday = startOfDay(today);
	const endOfDayToday = endOfDay(today);

	// utils
	import { justDate, endOfDay, startOfDay } from "$utils/dateUtils";

	// functions
	function isScheduledToStart(todo: Todo, date: Date | null) {
		if (!date) return true;
		const formattedDate = date?.toLocaleString().split(",")[0];
		const scheduled = todo?.scheduledToStartAt?.toLocaleString().split(",")[0];
		if (scheduled == formattedDate) return true;
		else return false;
	}
	function isNotScheduledToStart(todo: Todo, date: Date | null) {
		if (!date) return true;
		const formattedDate = date?.toLocaleString().split(",")[0];
		const scheduled = todo?.scheduledToStartAt?.toLocaleString().split(",")[0];
		if (scheduled != formattedDate) return true;
		else return false;
	}
	function wasCompletedOn(todo: Todo, date: Date | null) {
		if (!date) return true;
		const formattedDate = date?.toLocaleString().split(",")[0];
		const completed = todo?.completedAt?.toLocaleString().split(",")[0];
		if (completed == formattedDate) return true;
		else return false;
	}
	function showTodo(todo: Todo) {
		let show = true;
		// show archived
		if (showArchived != todo.archived) return false;
		// show completed
		else if (showCompleted == false && todo.completedAt != null) return false;
		// was completed on specific day
		//-else if (showCompletedOn && wasCompletedOn(todo, showCompletedOn)) return false;
		// do not render if scheduled to start on specific day & showScheduled == false
		else if (showScheduled == false && todo.scheduledToStartAt != null)
			return false;
		// do not render if not scheduled and showUnscheduled == false
		else if (showUnscheduled == false && todo.scheduledToStartAt == null)
			return false;
		//do not render if scheduled for past and showScheduledInPast == false
		else if (
			showScheduledInPast == false &&
			todo.scheduledToStartAt != null &&
			todo.scheduledToStartAt < startOfDay(new Date())
		)
			return false;
		// do not render if scheduled for today and showScheduledToday == false
		else if (
			showScheduledToday == false &&
			todo.scheduledToStartAt != null &&
			new Date(todo.scheduledToStartAt).toLocaleString().split(",")[0] ==
				new Date().toLocaleString().split(",")[0]
		)
			return false;
		// do not render if scheduled for tomorrow and showScheduledTomorrow == false
		else if (
			showScheduledTomorrow == false &&
			todo.scheduledToStartAt != null &&
			new Date(todo.scheduledToStartAt).toLocaleString().split(",")[0] ==
				new Date(new Date().setDate(new Date().getDate() + 1))
					.toLocaleString()
					.split(",")[0]
		)
			return false;
		// hide if scheduled for future and showScheduledInFuture == false
		else if (
			showScheduledInFuture == false &&
			todo.scheduledToStartAt != null &&
			todo.scheduledToStartAt > endOfDay(new Date())
		)
			return false;
		// is scheduled to start on specific day
		else if (
			showScheduledToStartOn &&
			!isScheduledToStart(todo, showScheduledToStartOn)
		)
			return false;
		// is scheduled to start on any day except specific day
		else if (
			notScheduledToStartOn &&
			isScheduledToStart(todo, notScheduledToStartOn)
		)
			return false;
		else return true;
	}

	// filter todos with showTodo function
	let filtered_todos: Todo[];
	$:filtered_todos = todos.filter((todo) => showTodo(todo));

	// set context
	setContext("hideScheduledToStartAt", hideScheduledToStartAt);
</script>

<template lang="pug">
	+if('filtered_todos.length == 0')
		+else
			.mb-8.border-t.border-white.border-opacity-40.mt-0.pt-8
				slot
				+each('filtered_todos as todo, index (todo.id)')
					+const('tags = todo.tags ? todo.tags.split(",") : []')
					div
						TodoListItem(todo!="{ todo }")
	</template>
