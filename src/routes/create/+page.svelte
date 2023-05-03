<script lang="ts">
	import type { ActionData } from "./$types";
	export let form: ActionData;
</script>

<template lang="pug">
div.px-8.py-8.bg-primary.min-h-screen.text-white
	form(method="post")
		h1.mb-4.text-24 Create Todo
		+if('form?.missing')
			p.error Missing field required!
		.flex.items-center
			//- next
			.flex.items-center.mr-8
				input#next.mr-2(
					value!="{form?.next ?? false}"
					type="checkbox"
					placeholder="Next"
					name="next"
					)
				label.mb-2.leading-none.flex.items-center(for="next") Next
				//- today
			.flex.items-center
				input#today.mr-2(
					value!="{form?.next ?? false}"
					type="checkbox"
					name="today"
					)
				label.mb-2.leading-none.flex.items-center(for="today") Today
		div
			.flex
				//- order
				.flex.items-center
					input.mr-2.w-20#order(
						value!="{form?.order ?? null}"
						type="number"
						min="-1"
						name="order"
						required
					)
				//- priority
				.flex.items-center
					input.mr-2.w-20#priority(
						value!="{form?.priority ?? ''}"
						type="number"
						placeholder="+ p"
						min="0"
						max="3"
						name="priority"
					)
					//-label.mb-2.leading-none.flex.items-center(for="priority") Priority

				//- friction
				.flex.items-center
					input.mr-2.w-20#friction(
						value!="{form?.fiction ?? ''}"
						type="number"
						placeholder="; f"
						min="0"
						max="3"
						name="friction"
					)
					//-label.mb-2.leading-none.flex.items-center(for="friction") Friction

				//- joy
				.flex.items-center
					input.mr-2.w-20#joy(
						value!="{form?.joy ?? ''}"
						type="number"
						placeholder="~ j"
						min="0"
						max="3"
						name="joy"
					)
					//-label.mb-2.leading-none.flex.items-center(for="joy") Joy
		//- description
		input.w-96(
			value!="{form?.description ?? ''}"
			type="text"
			placeholder="description"
			name="description"
			required
			)
		//- tags
		input.w-96(
			class="!mb-6"
			value!="{form?.tags ?? ``}"
			type="text"
			placeholder="tags"
			name="tags"
			)

		//- due
		label.mb-2.leading-none.flex.items-center(for="dueAt") Due on
		input#dueAt.w-96(
				class="!mb-6"
				value!="{form?.dueAt ?? null}"
				type="datetime-local"
				default="now"
				name="dueAt"
				)
		.flex.gap-x-4
			//- Scheduled to start at
			div
				label.mb-2.leading-none.flex.items-center(for="scheduledToStartAt") Scheduled - Starting at:
				input#scheduledToStartAt.w-48(
						value!="{form?.scheduledToStartAt ?? null}"
						class="!mb-6"
						type="datetime-local"
						default="now"
						name="scheduledToStartAt"
						)
			//- Scheduled to finish at
			div
				label.mb-2.leading-none.flex.items-center(for="scheduledToEndAt") Scheduled - Finishing at
				input#scheduledToEndAt.w-48(
						value!="{form?.scheduledToEndAt ?? null}"
						class="!mb-6"
						type="datetime-local"
						default="now"
						name="scheduledToEndAt"
						)
		//- completedAt
		label.mb-2.leading-none.flex.items-center(for="completedAt") Was Completed At
		input#completedAt.w-96(
				class="!mb-6"
				value!="{form?.completedAt ?? null}"
				type="datetime-local"
				default="now"
				name="completedAt"
				)
		button.mr-4.px-2.py-2.outline-white.outline.rounded(type="submit") Create
		a.back.underline.underline-offset-4(href="/") or Cancel


	</template>

	<style>
	input {
		@apply mb-2 text-primary block;
	}
	</style>