<script lang="ts">
	import type { ActionData } from "./$types";
	export let form: ActionData;
	export let data;

	type Response = typeof data.response;
	$: response = data.response as Response;

	$: today = response?.today ?? false;

	// completed at
	let completedAt: string | null;
	$: completedAt = response?.completedAt
		? new Date(response?.completedAt).toISOString().split(".")[0]
		: null;

	// due at
	let dueAt: string | null;
	$: dueAt = response?.dueAt
		? new Date(response?.dueAt).toISOString().split(".")[0]
		: null;

	// scheduled to start at
	let scheduledToStartAt: string | null;
	$: scheduledToStartAt = response?.scheduledToStartAt
		? new Date(response?.scheduledToStartAt).toISOString().split(".")[0]
		: null;

	// scheduled to end at
	let scheduledToEndAt: string | null;
	$: scheduledToEndAt = response?.scheduledToEndAt
		? new Date(response?.scheduledToEndAt).toISOString().split(".")[0]
		: null;
</script>

<template lang="pug">
	.px-8.py-8.bg-primary.min-h-screen.text-white
		form(class="actions", method="post")
			h1.mb-4.text-24 Update Todo
			+if('form?.missing')
				p.error Missing field required!
			.flex.items-center
				//- next
				.flex.items-center.mr-8
					input#next.mr-2(
						checked!="{ response?.next ? response.next : false }",
						name="next",
						placeholder="Next",
						type="checkbox",
						value!="{ response?.next ? response?.next : false }"
					)
					label.mb-2.leading-none.flex.items-center(for="next") Next
					//- today
				.flex.items-center
					input#today.mr-2(
						checked!="{ today ? today : false }",
						name="today",
						type="checkbox",
						value!="{ today ? today : false }"
					)
					label.mb-2.leading-none.flex.items-center(for="today") Today
			div
				//- userId
				.flex.items-center
					input#id.mr-2.w-96.form-input(
						name="id",
						readonly,
						type="text",
						value!="{ response?.id ? response.id : '' }"
					)
				//- userId
				.flex.items-center
					input#userId.mr-2.w-auto.form-input(
						hidden,
						name="userId",
						readonly,
						type="text",
						value!="{ response?.userId ? response.userId : '' }"
					)
				.flex
					//- order
					.flex.items-center
						input#order.mr-2.w-20(
							min="-1",
							name="order",
							required,
							type="number",
							value!="{ response?.order ? response.order : 0 }"
						)
					//- priority
					.flex.items-center
						input#priority.mr-2.w-20(
							max="3",
							min="0",
							name="priority",
							placeholder="+ p",
							type="number",
							value!="{ response?.priority ? response.priority : '' }"
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
							value!="{ response?.fiction ? response.fiction : '' }"
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
							value!="{ response?.joy ? response.joy : '' }"
						)
						//-label.mb-2.leading-none.flex.items-center(for="joy") Joy
			//- description
			input.w-96.block(
				name="description",
				placeholder="description",
				required,
				type="text",
				value!="{ response?.description ? response.description : '' }"
			)
			//- tags
			input.w-96.block(
				class="!mb-6",
				name="tags",
				placeholder="tags",
				type="text",
				value!="{ response?.tags ? response.tags : '' }"
			)
			//- due
			label.mb-2.leading-none.flex.items-center(for="dueAt") Due on
			input#dueAt.w-96(
				class="!mb-6",
				default="now",
				name="dueAt",
				type="datetime-local",
				value!="{ dueAt }"
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
						value!="{ scheduledToStartAt }"
					)
				div
					//- Scheduled to start at
					label.mb-2.leading-none.flex.items-center(for="scheduledToEndAt") Scheduled - Finishing at
					input#scheduledToEndAt.w-48(
						class="!mb-6",
						default="now",
						name="scheduledToEndAt",
						type="datetime-local",
						value!="{ scheduledToEndAt }"
					)
			//- completedAt
			label.mb-2.leading-none.flex.items-center(for="completedAt") Was Completed At
			input#completedAt.w-96(
				class="!mb-6",
				default="now",
				name="completedAt",
				type="datetime-local",
				value!="{ completedAt }"
			)
			.mt-8
				.flex.items-center
					button.mr-4.px-2.py-2.outline-white.outline.rounded(
						formaction="?/updateTodo",
						type="submit"
					) Update
					a.inline-block.mr-4.back.underline.underline-offset-4(href="/") cancel
					button.inline-block.back.underline.underline-offset-4(
						formaction="?/deleteTodo",
						type="submit"
					) delete
</template>

<style>
	input {
		@apply mb-2 text-primary;
	}
</style>
