<script lang="ts">
	// components
	import DateAndTimeFields from "$atoms/DateAndTimeFields.svelte";

	import type { ActionData } from "./$types";
	export let form: ActionData;
</script>

<template lang="pug">
	.px-8.py-8.bg-primary.min-h-screen.text-white
		form(class="min-w-[400px] max-w-md", method="post")
			h1.mb-4.text-24 Create Todo
			+if('form?.missing')
				p.error Missing field required!

			//- fields grid
			.grid.grid-cols-4.gap-x-2.gap-y-4.w-full.mb-8
				//- next
				.flex.items-center.mr-8
					input#next.mr-2(
						name="next",
						placeholder="Next",
						type="checkbox",
						value!="{ form?.next ? form.next : false }"
					)
					label.mb-2.leading-none.flex.items-center(for="next") Next
					//- today

				.flex.items-center
					input#today.mr-2(
						name="today",
						type="checkbox",
						value!="{ form?.next ? form.next : false }"
					)
					label.mb-2.leading-none.flex.items-center(for="today") Today

				//- grid spacer
				.col-span-2 &nbsp;

				//- order
				.grid.grid-cols-1.gap-y-1
					label(for="order") Order
					input#order.w-full.rounded-md.text-primary(
						min="-1",
						name="order",
						required,
						type="number",
						value!="{ form?.order ? form.order : 1 }"
					)
				//- priority
				.grid.grid-cols-1.gap-y-1
					label(for="priority") Priority
					input#priority.w-full.rounded-md.text-primary(
						max="3",
						min="0",
						name="priority",
						placeholder="+ p",
						type="number",
						value!="{ form?.priority ? form.priority : '' }"
					)
				//- friction
				.grid.grid-cols-1.gap-y-1
					label(for="friction") Friction
					input#friction.w-full.rounded-md.text-primary(
						max="3",
						min="0",
						name="friction",
						placeholder="; f",
						type="number",
						value!="{ form?.fiction ? form.fiction : '' }"
					)
				//- joy
				.grid.grid-cols-1.gap-y-1
					label(for="joy") Joy
					input#joy.w-full.rounded-md.text-primary(
						max="3",
						min="0",
						name="joy",
						placeholder="~ j",
						type="number",
						value!="{ form?.joy ? form.joy : '' }"
					)
				//- description
				.col-span-4.grid.grid-cols-1.gap-y-1
					label(for="description") Description
					input.w-full.rounded-md.text-primary(
						name="description",
						placeholder="description",
						required,
						type="text",
						value!="{ form?.description ? form.description : '' }"
					)
				//- tags
				.col-span-4.grid.grid-cols-1.gap-y-1
					label(for="tags") Tags
					input.w-full.rounded-md.text-primary(
						class="",
						name="tags",
						placeholder="tags",
						type="text",
						value!="{ form?.tags ? form.tags : '' }"
					)

				//- due
				.col-span-4.grid.grid-cols-1.gap-y-1
					label(for="dueAt") Due on
					input#dueAt.w-full.rounded-md.text-primary(
						default="now",
						name="dueAt",
						type="datetime-local",
						value!="{ form?.dueAt ? form.dueAt : null }"
					)
				//- scheduled to start at
				.col-span-4
					DateAndTimeFields(
						dateValue!="{ new Date() }",
						id="scheduledToStartAt",
						label="Scheduled to start at"
					)

				//- scheduled to end at
				.col-span-4
					DateAndTimeFields(id="scheduledToEndAt", label="Scheduled to end at")

				//- completed at
				.col-span-4
					DateAndTimeFields(id="completedAt", label="Completed at")

				//- //- completedAt
				//- .col-span-4.grid.grid-cols-1.gap-y-1
				//- 	label(for="completedAt") Completed At
				//- 	input#completedAt.w-full.rounded-md.text-primary(
				//- 		class="!mb-6",
				//- 		default="now",
				//- 		name="completedAt",
				//- 		type="datetime-local",
				//- 		value!="{ form?.completedAt ? form.completedAt : null }"
				//- 	)
			button.mr-4.px-2.py-2.outline-white.outline.rounded(type="submit") Create
			a.back.underline.underline-offset-4(href="/") or Cancel
</template>

<style>
	input {
		@apply text-primary;
	}
</style>
