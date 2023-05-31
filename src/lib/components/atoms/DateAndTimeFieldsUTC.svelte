<!--
@component
Notes field component
-->

<script lang="ts">
	// utils
	import { nanoid } from "nanoid";

	// props
	export let id = "date";
	export let inputClasses = "";
	export let inputGroupClasses = "";
	export let label = "Date";
	export let labelClasses = "";
	export let maxLength: string | null = null;
	export let outerClasses = "";
	export let required = false;
	export let value = "";
	export let dateValue: Date | null = null;

	// variable declarations
	let date: string | null;
	let time: string | null;
	let isoDateString: string;

	// constants
	const now = new Date();
	const nano = nanoid(8);
	const defaultInputGroupClasses = "grid grid-cols-2 gap-2";
	const defaultOuterClasses = "grid grid-cols-1 gap-y-1";
	const defaultInputClasses = "rounded-md text-primary";

	$: { date = dateValue ? convertDateToDateString(dateValue) : null; }
	$: console.log("date", date);
	$: time = null;

	// combine the date and time into an ISO string which Prisma / SQLite will accept
	// $: { isoDateString = convertDateAndTimeToDateString(now, time) }
	$: {
		isoDateString = date ? convertToIsoString(date, time) : '';
	}
	// $: console.log("d", date);
	// $: console.log("i", isoDateString);
	// $: console.log("n", new Date().toISOString());

	// console.log current timezone
	// $: console.log("o", new Date().getTimezoneOffset());

	// functions
	function convertDateToDateString(date: Date) {
		return date.toISOString().split("T")[0];
	}
	function convertDateAndTimeToDateString(date: Date, time: string | null) {
		const timeZoneOffset = date.getTimezoneOffset();
		const dateFragment = date.toISOString().split("T")[0];
		const result = `${dateFragment}T${time ? time : "00:00"}:00.000Z`;
		return result;
	}
	function convertToIsoString(
		dateString: string,
		timeString: string | null,
	): string {
		// offset for timezone;
		const offsetMinutes = 241;
		const offsetMs = offsetMinutes * 60 * 1000;

		// calculate what time the local day starts at in ISO time
		const zeroHours = Math.floor(offsetMinutes / 60);
		const zeroHoursString =
			zeroHours < 10 ? `0${zeroHours}` : zeroHours.toString(10);
		const zeroMinutes = offsetMinutes % 60;
		const zeroMinutesString =
			zeroMinutes < 10 ? `0${zeroMinutes}` : zeroMinutes.toString(10);
		const zeroTimeString = `${zeroHoursString}:${zeroMinutesString}`;

		// console.log("zeroH", zeroHours);
		// console.log("zeroTime", zeroTimeString);
		const adjustedTimeString = timeString ? timeString : zeroTimeString;
		const date = new Date(`${dateString}T${adjustedTimeString}:00`);

		const adjustedDate = new Date(date.getTime() - offsetMs);
		return adjustedDate.toISOString();
	}
</script>

<template lang="pug">
	div(class!="{defaultOuterClasses} { outerClasses }")
		+if('label')
			div(class!="{ labelClasses }") { label }
		div(class!="{ defaultInputGroupClasses } {inputGroupClasses}")
			input(
				class!="{defaultInputClasses} { inputClasses }",
				aria-label!="{ label } - date",
				bind:value!="{ date }",
				id!="date-{nano}",
				max-length!="{ maxLength }",
				name!="date-{nano}",
				required!="{ required ? 'required' : null }",
				type!="date"
			)
			input(
				class!="{defaultInputClasses} { inputClasses }",
				aria-label!="{ label } - time",
				bind:value!="{ time }",
				id!="time-{nano}",
				max-length!="{ maxLength }",
				name!="time-{nano}",
				step="60",
				type!="time"
			)
			input(
				class!="{defaultInputClasses} { inputClasses }",
				bind:value!="{ isoDateString }",
				id!="{ id }",
				name!="{ id }",
				readonly,
				type!="hidden"
			)
</template>
