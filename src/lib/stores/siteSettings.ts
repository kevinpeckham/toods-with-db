import { readable } from "svelte/store";

export const siteSettings = readable({
	siteName: "Verde Climate Solutions",
	siteAuthor: "Verde Marketing",
});
