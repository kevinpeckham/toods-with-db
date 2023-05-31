<!--
@component
Here's some documentation for this component.
-->

<script lang="ts">
	// environment & utils
	import { dev, version } from "$app/environment";

	// stores
	import { siteSettings } from "$stores/siteSettings";

	// constants
	const { siteName, siteAuthor } = $siteSettings;
	const author = $siteSettings.siteAuthor;

	// props
	export let googleAnalyticsOn;
	export let ogImage: string;
	export let ogImageUrl: string;
	export let ogImageWidth: string | number;
	export let ogImageHeight: string | number;
	export let ogImageMimeType = "image/jpg";
	export let pageDescription = "";
	export let pageKeywords: string[] = [""];
	export let pageSlug = "";
	// export let pageTitleFull: string | undefined = "";
	export let pageTitleShort = "";
	export let robotsFollow = true;

	const titleTagContent: string = pageKeywords.join(" | ");

	// process version into date
	//const parsed = JSON.parse(version);
	//const versionDate = new Date(JSON.parse(version));
</script>

<template lang="pug">
	svelte:head
		// title
		title
			| { titleTagContent }

		// description
		meta(
			content!="{ pageDescription }",
			name="description"
		)

		// canonical
		link(
			href!="{ pageSlug ? 'https://securelogix.com/' + pageSlug : 'https://securelogix.com' }",
			rel="canonical"
		)

		+if('robotsFollow')
			// robots
			meta(
				content="index, follow max-image-preview:large, max-snippet:-1, max-video-preview:-1 ",
				name="robots"
			)

		+if('ogImage')
			// open graph
			meta(
				content="en_US",
				property="og:locale"
			)
			meta(
				content="article",
				property="og:type"
			)
			meta(
				content!="{ pageTitleShort }",
				property="og:title"
			)
			meta(
				content!="https://securelogix.com/{pageSlug}",
				property="og:url"
			)
			meta(
				content!="{ siteName }",
				property="og:site_name"
			)
			meta(
				content!="{ version }",
				property="article:modified_time"
			)

		+if('ogImageUrl')
			//- open graph image
			meta(
				content!="{ ogImageUrl }",
				property="og:image"
			)
			+if('ogImageWidth')
				meta(
					content!="{ ogImageWidth.toString() }",
					property="og:image:width"
				)
			+if('ogImageHeight')
				meta(
					content!="{ ogImageHeight.toString() }",
					property="og:image:height"
				)
				meta(
					content!="{ ogImageMimeType} ",
					property="og:image:type"
				)

		// version
		meta#version(
			content!="{ version }",
			name="version"
		)
		//- meta(content!="{ versionDate }", name="updated")
		meta(
			content!="Lightning Jar",
			name="creator"
		)
		meta(
			content!="David Heard, SecureLogix",
			name="author"
		)

		+if('!dev && pardotTrackerOn')
			// pardot
			script(
				async="async",
				src="https://pi.pardot.com/pd.js",
				type="text/javascript"
			)

		+if('!dev && googleAnalyticsOn')
			// google tag manager
			script(
				async="",
				src="//www.googletagmanager.com/gtag/js?id=UA-70079803-1",
				type="text/javascript"
			)
</template>
