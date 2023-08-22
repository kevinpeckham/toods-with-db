export function scrubDescriptionString(str: string) {
	// limit tag length to 80 characters
	const limited = str?.slice(0, 80) ?? "";

	// replace any invalid characters
	// allow only a-z, hyphen, and colon
	const replaced = limited.replace(/[^a-z1-9-:.,;?/() ]/gi, "");

	// return
	return replaced;
}

export function scrubTagString(str: string) {
	// limit tag length to 20 characters
	const limited = str?.slice(0, 20) ?? "";

	// make lowercase
	const lowercased = limited?.toLowerCase();

	// replace any invalid characters
	// allow only a-z, hyphen, and colon
	const replaced = lowercased.replace(/[^a-z-:]/gi, "");

	// return
	return replaced;
}

export function scrubTagsString(str: string) {
	//- limit of five tags = 124 max characters, counting commas between tags
	const limited = str.slice(0, 124) ?? "";

	// make lowercase
	const lowercased = limited.toLowerCase() ?? "";

	// replace any invalid characters
	// allow only a-z, hyphen, comma, and colon
	const invalidReplaced = lowercased.replace(/[^a-z,-:]/g, "") ?? "";

	// remove any double commas
	const noRepeatCommas = invalidReplaced.replace(/,,/g, ",") ?? "";

	// remove initial comma
	const noInitialComma = noRepeatCommas.replace(/^,/, "") ?? "";

	// remove final comma
	const noFinalComma = noInitialComma.replace(/,$/, "") ?? "";

	return noFinalComma;
}
