export function adjustInputWidth(
	input: HTMLInputElement,
	value?: string,
	padding?: number,
) {
	value = value ?? input.value;
	padding = padding ?? 2.25;
	input.style.width = (value.length + padding).toString() + "ch";
}

export function waitForInputValue(
	inputField: HTMLInputElement,
	desiredValue: string,
	callback: () => void,
	interval?: number,
	maxTries?: number,
) {
	// if interval is not provided, set it to 10
	const wait: number = interval ?? 10;

	// if maxTries is not provided, set it to 10
	const max: number = maxTries ?? 10;

	let tries = 0;

	const checkValue = () => {
		if (inputField.value === desiredValue) {
			callback();
		} else if (tries < max) {
			tries++;
			setTimeout(checkValue, wait);
		}
	};

	checkValue();
}

export function splitInputValueAtCursor(input: HTMLInputElement) {
	const selectionStart = input.selectionStart ?? 0;
	const textBeforeCursor = input.value.slice(0, selectionStart);
	const textAfterCursor = input.value.replace(textBeforeCursor, "");
	return [textBeforeCursor, textAfterCursor];
}
