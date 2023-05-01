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
		div
			//- next
			.flex.items-center
				input#next.mr-2(
					value!="{form?.next ?? false}"
					type="checkbox"
					placeholder="Next"
					name="next"
					)
				label.mb-2.leading-none.flex.items-center(for="next") Next

			.flex
				//- order
				.flex.items-center
					input.mr-2.w-20#order(
						value!="{form?.order ?? ''}"
						type="number"
						placeholder="order"
						min="0"
						name="order"
						required
					)
				//- priority
				.flex.items-center
					input.mr-2.w-20#priority(
						value!="{form?.priority ?? ''}"
						type="number"
						placeholder="+ p"
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
		button.mr-4.px-2.py-2.outline-white.outline.rounded(type="submit") Create
		a.back.underline.underline-offset-4(href="/") or Cancel


	</template>

	<style>
	input {
		@apply mb-2 text-primary block;
	}
	</style>