<script lang="ts">
	import type { ActionData } from "./$types";
	export let form: ActionData;
</script>

<template lang="pug">
	.px-8.py-8.bg-primary.min-h-screen.text-white
		form(method="post")
			h1.mb-4.text-24 Create Todo
			+if('form?.missing')
				p.error Missing field required!
			.flex.items-center
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
			div
				.flex
					//- order
					.flex.items-center
						input#order.mr-2.w-20(
							min="-1",
							name="order",
							required,
							type="number",
							value!="{ form?.order ? form.order : null }"
						)
					//- priority
					.flex.items-center
						input#priority.mr-2.w-20(
							max="3",
							min="0",
							name="priority",
							placeholder="+ p",
							type="number",
							value!="{ form?.priority ? form.priority : '' }"
						)
						//-label.mb-2.leading-none.flex.items-center(for="priority") Priority

					//- friction
					.flex.items-center
						input#friction.mr-2.w-20(
							max="3",
							min="0",
							name="friction",
							placeholder="; f",
							type="number",
							value!="{ form?.fiction ? form.fiction : '' }"
						)
						//-label.mb-2.leading-none.flex.items-center(for="friction") Friction

					//- joy
					.flex.items-center
						input#joy.mr-2.w-20(
							max="3",
							min="0",
							name="joy",
							placeholder="~ j",
							type="number",
							value!="{ form?.joy ? form.joy : '' }"
						)
						//-label.mb-2.leading-none.flex.items-center(for="joy") Joy
			//- description
			input.w-96(
				name="description",
				placeholder="description",
				required,
				type="text",
				value!="{ form?.description ? form.description : '' }"
			)
			//- tags
			input.w-96(
				class="!mb-6",
				name="tags",
				placeholder="tags",
				type="text",
				value!="{ form?.tags ? form.tags : '' }"
			)

			//- due
			label.mb-2.leading-none.flex.items-center(for="dueAt") Due on
			input#dueAt.w-96(
				class="!mb-6",
				default="now",
				name="dueAt",
				type="datetime-local",
				value!="{ form?.dueAt ? form.dueAt : null }"
			)
			.flex.gap-x-4
				//- Scheduled to start at
				div
					label.mb-2.leading-none.flex.items-center(for="scheduledToStartAt") Scheduled - Starting at:
					input#scheduledToStartAt.w-48(
						class="!mb-6",
						default="now",
						name="scheduledToStartAt",
						type="datetime-local",
						value!="{ form?.scheduledToStartAt ? form?.scheduledToStartAt : null }"
					)
				//- Scheduled to finish at
				div
					label.mb-2.leading-none.flex.items-center(for="scheduledToEndAt") Scheduled - Finishing at
					input#scheduledToEndAt.w-48(
						class="!mb-6",
						default="now",
						name="scheduledToEndAt",
						type="datetime-local",
						value!="{ form?.scheduledToEndAt ? form.scheduledToEndAt : null }"
					)
			//- completedAt
			label.mb-2.leading-none.flex.items-center(for="completedAt") Was Completed At
			input#completedAt.w-96(
				class="!mb-6",
				default="now",
				name="completedAt",
				type="datetime-local",
				value!="{ form?.completedAt ? form.completedAt : null }"
			)
			button.mr-4.px-2.py-2.outline-white.outline.rounded(type="submit") Create
			a.back.underline.underline-offset-4(href="/") or Cancel
</template>

<style>
	input {
		@apply mb-2 text-primary block;
	}
</style>
