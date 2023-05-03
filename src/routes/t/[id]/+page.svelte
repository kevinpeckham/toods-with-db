<script lang="ts">
	import type { ActionData } from "./$types";
	export let form: ActionData;
	export let data;


	type Response = typeof data.response;
	$:response = data.response as Response;

	$: today = response?.today ?? false;


	// completed at
	let completedAt: string | null;
	$: completedAt = response?.completedAt ?
		new Date(response?.completedAt).toISOString().split('.')[0] :
		null;

	// due at
	let dueAt: string | null;
	$: dueAt = response?.dueAt ?
		new Date(response?.dueAt).toISOString().split('.')[0] :
		null;

	$:console.log(dueAt)


</script>

<template lang="pug">
div.px-8.py-8.bg-primary.min-h-screen.text-white
	form(method="post" class="actions")
		h1.mb-4.text-24 Update Todo
		+if('form?.missing')
			p.error Missing field required!
		.flex.items-center
			//- next
			.flex.items-center.mr-8
				input#next.mr-2(
					value!="{response?.next ?? false}"
					checked!="{response?.next ?? false}"
					type="checkbox"
					placeholder="Next"
					name="next"
					)
				label.mb-2.leading-none.flex.items-center(for="next") Next
				//- today
			.flex.items-center
				input#today.mr-2(
					value!="{today ?? false}"
					checked!="{today ?? false}"
					type="checkbox"
					name="today"
					)
				label.mb-2.leading-none.flex.items-center(for="today") Today
		div
			//- userId
			.flex.items-center
				input.mr-2.w-96#id.form-input(
					value!="{response?.id ?? ''}"
					type="text"
					name="id"
					readonly
				)
			//- userId
			.flex.items-center
				input.mr-2.w-auto#userId.form-input(
					hidden
					value!="{response?.userId ?? ''}"
					type="text"
					name="userId"
					readonly
				)
			.flex
				//- order
				.flex.items-center
					input.mr-2.w-20#order(
						value!="{response?.order ?? 0}"
						type="number"
						min="-1"
						name="order"
						required
					)
				//- priority
				.flex.items-center
					input.mr-2.w-20#priority(
						value!="{response?.priority ?? ''}"
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
						value!="{response?.fiction ?? ''}"
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
						value!="{response?.joy ?? ''}"
						type="number"
						placeholder="~ j"
						min="0"
						max="3"
						name="joy"
					)
					//-label.mb-2.leading-none.flex.items-center(for="joy") Joy
		//- description
		input.w-96.block(
			value!="{response?.description ?? ''}"
			type="text"
			placeholder="description"
			name="description"
			required
			)
		//- tags
		input.w-96.block(
			class="!mb-6"
			value!="{response?.tags ?? ``}"
			type="text"
			placeholder="tags"
			name="tags"
			)
		//- due
		label.mb-2.leading-none.flex.items-center(for="dueAt") Due on
		input#dueAt.w-96(
				class="!mb-6"
				value!="{dueAt}"
				type="datetime-local"
				default="now"
				name="dueAt"
				)
		//- completedAt
		label.mb-2.leading-none.flex.items-center(for="completedAt") Was Completed At
		input#completedAt.w-96(
				value!="{completedAt}"
				class="!mb-6"
				type="datetime-local"
				default="now"
				name="completedAt"
				)
		div.mt-8
			flex: button.mr-4.px-2.py-2.outline-white.outline.rounded(formaction="?/updateTodo" type="submit") Update
			a.back.underline.underline-offset-4(href="/") or Cancel


	</template>

<style>
	input {
		@apply mb-2 text-primary;
	}
</style>