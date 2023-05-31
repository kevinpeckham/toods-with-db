<!-- Example Svelte Page / Starter Web Page-->
<script lang="ts">
	// components
	import Header from "$organisms/Header.svelte";
	import TodosList from "$molecules/TodosList.svelte";
	import DayAndDateBlock from "$atoms/DayAndDateBlock.svelte";

	// types
	import type { PageData } from "./$types";
	import type { Todo } from "@prisma/client";

	// utils
	import {
		justDate,
		isToday,
		isTomorrow,
		daysFromToday,
		getDateXDaysFromDate,
	} from "$utils/dateUtils";

	// props
	export let data: PageData;

	// variable declarations
	let todos: Todo[] = [];
	let date = ""; // e.g. "2021-01-01"
	let dateDisplay: string[] = [];
	let dateObj: Date;

	// reactive variables
	$: todos = data.feed ? data.feed : [];
	$: date = data.date ? data.date : "";

	// date display
	$: {
		if (date) {
			dateObj = new Date(date);
			dateDisplay = dayLabel(dateObj);
		}
	}

	$: nextLink = dateObj ? linkToXDaysFromDate(1) : "";
	$: prevLink = dateObj ? linkToXDaysFromDate(-1) : "";

	// constants
	const today = new Date();

	// functions
	function dayLabel(date: Date) {
		const days = daysFromToday(date);
		const formattedDate = date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
		if (isToday(date)) return ["Today", formattedDate];
		else if (isTomorrow(date)) return ["Tomorrow", formattedDate];
		else {
			const symbol = days > 0 ? "+" : "";
			return [symbol + days + " Days", formattedDate];
		}
	}
	function linkToXDaysFromDate(days: number) {
		const nextDate = getDateXDaysFromDate(dateObj, days);
		const year = nextDate.getFullYear();
		const month = nextDate.getMonth() + 1;
		const day = nextDate.getDate();
		const dateString = `${month}-${day}-${year}`;
		return `/day/${dateString}`;
	}
</script>

<template lang="pug">
	Header(
		message!="Welcome, Stranger!",
		showDate!="{ false }"
	)
	main.relative.bg-primary.p-4.pb-48.px-8(
		style="min-height: calc(100vh - 4rem)"
	)
		.mb-2.text-14 /day
		.flex.justify-between.items-center.mb-6
			//- Date
			.flex.items-end
				.text-24.leading-none { dateDisplay[0] ? dateDisplay[0] : "+/- x days" }
				.text-14.ml-4.leading-none.opacity-80 { dateDisplay[1] }
			//- Links to Adjacent Days
			.flex.gap-4
				a.block.opacity-80(
					class="text-[.85em] hover:underline hover:accent underline-offset-4",
					href!="{ prevLink }"
				) ← Prev
				a.block.opacity-80(
					class="text-[.85em] hover:underline hover:accent underline-offset-4",
					href!="{ nextLink }"
				) Next →
		.grid.grid-cols-2.w-full.gap-8
			div
				//- scheduled for today
				TodosList(
					hideStartValue!="{ true }",
					showHeader!="{ false }",
					showOnlyScheduledToStartOn!="{ today }",
					todos!="{ todos }"
				)
					//-svelte:fragment
						a.inline-block.ml-2.underline-offset-4(class="hover:underline" href="/today") Today
						DayAndDateBlock(date!="{ today }")

				//- completed today
				TodosList(
					hideStartValue!="{ true }",
					showCompleted!="{ true }",
					showDivider!="{ false }",
					showHeader!="{ false }",
					showIncomplete!="{ false }",
					showOnlyScheduledToStartOn!="{ today }",
					todos!="{ todos }"
				)
					//-svelte:fragment
						DayAndDateBlock(date!="{ today }")
</template>
