export const settings = {
	tags: {
		maxTagsPerTodo: 3,
		maxTagLength: 16,
		maxTagStringLength() {
			return this.maxTagsPerTodo * this.maxTagLength + this.maxTagsPerTodo - 1;
		},
	},
};
