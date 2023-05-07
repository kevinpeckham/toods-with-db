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
	export let hideStartValue = false;

	//-- show / hide all todos that fit certain criteria
	export let showArchived = false;
	export let showCompleted = false;
	export let showIncomplete = true;
	export let showTemplates = false;
	export let showScheduled = true;
	export let showUnscheduled = true;
	export let showScheduledInPast = true;
	export let showScheduledToday = true;
	export let showScheduledTomorrow = true;
	export let showScheduledInFuture = true;

	//-- show only those todos that fit certain criteria
	export let showOnlyScheduledToStartOn: Date | null = null;
	export let notScheduledToStartOn: Date | null = null;

	//-- show / hide the header
	export let showHeader = true;
	export let showDivider = true;

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
	function isTemplate(todo: Todo) {
		if (todo?.template == true) return true;
		else return false;
	}
	function showTodo(todo: Todo) {
		let show = true;

		// do not render if howArchived == false and todo has been archived
		if (showArchived === false && todo.archived === true) { return false; }

		// do not render if showCompleted	== false and todo has been completed
		else if (showCompleted == false && todo.completedAt != null) { return false; }

		// do not render if showIncomplete == false and todo has not been completed
		else if (showIncomplete == false && todo.completedAt == null) { return false; }

		// do not render if showTemplates == false and todo is a template
		else if (showTemplates == false && todo.template == true) { return false; }

		// do not render if showScheduled == false and todo is scheduled
		else if (showScheduled == false && todo.scheduledToStartAt != null) { return false; }

		// do not render showUnscheduled == false and todo is not scheduled
		else if (showUnscheduled == false && todo.scheduledToStartAt == null) { return false; }

		//do not render if showScheduledInPast == false and todo is scheduled for past start date
		else if (
			showScheduledInPast == false &&
			todo.scheduledToStartAt != null &&
			todo.scheduledToStartAt < startOfDay(new Date())
		) { return false; }

		// do not render if showScheduledToday == false and todo is scheduled for today
		else if (
			showScheduledToday == false &&
			todo.scheduledToStartAt != null &&
			new Date(todo.scheduledToStartAt).toLocaleString().split(",")[0] ==
			new Date().toLocaleString().split(",")[0]
		) { return false; }

		// do not render if showScheduledTomorrow == false and todo is scheduled for tomorrow
		else if (
			showScheduledTomorrow == false &&
			todo.scheduledToStartAt != null &&
			new Date(todo.scheduledToStartAt).toLocaleString().split(",")[0] ==
				new Date(new Date().setDate(new Date().getDate() + 1))
					.toLocaleString()
					.split(",")[0]
		)	{ return false; }

		// do not render if showScheduledInFuture == false and todo is scheduled for future start date (after today)
		else if (
			showScheduledInFuture == false &&
			todo.scheduledToStartAt != null &&
			todo.scheduledToStartAt > endOfDay(new Date())
		)
		{ return false; }

		// is scheduled to start on specific day
		else if (
			showOnlyScheduledToStartOn &&
			!isScheduledToStart(todo, showOnlyScheduledToStartOn)
		)
		{ return false; }

			// is scheduled to start on any day except specific day
		else if (
			notScheduledToStartOn &&
			isScheduledToStart(todo, notScheduledToStartOn)
		)
		{ return false; }

		else { return true; };

	}

	// filter todos with showTodo function
	let filtered_todos: Todo[];
	$:filtered_todos = todos.filter((todo) => showTodo(todo));

	// set context
	setContext("hideStartValue", hideStartValue);
</script>

<template lang="pug">
	+if('filtered_todos.length == 0')
		// do nothing
		+else
			.mb-8.border-white.border-opacity-40.mt-0(
				class!="{(showDivider) ? 'pt-8 border-t' : '-mt-4'}"
			)
				+if('showHeader')
					.flex.mb-2
						slot
				+each('filtered_todos as todo, index (todo.id)')
					div
						TodoListItem(todo!="{ todo }")
	</template>
