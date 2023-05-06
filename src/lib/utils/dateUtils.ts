export function justDate(date: Date, twoDigitYear?: boolean) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const fullYear = date.getFullYear();
	const mil = fullYear.toString().slice(2, 4);
	if (twoDigitYear) return month + "." + day + "." + mil;
	else return month + "." + day + "." + fullYear;
}

export function getTomorrowDate()	{
	const tomorrow = new Date(Date.now() + 86400000);
	return tomorrow;
}

export function isToday(date: Date) {
	const today = justDate(new Date());
	const formattedDate = justDate(date);
	return today == formattedDate;
}

export function endOfDay(date: Date) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		23,
		59,
		59,
		999,
	);
}
export function startOfDay(date: Date) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		0,
		0,
		0,
		0,
	);
}



export function isTomorrow(date: Date) {
	const tomorrow = justDate(new Date(Date.now() + 86400000));
	const formattedDate = justDate(date);
	return tomorrow == formattedDate;
}

export function isYesterday(date: Date) {
	const yesterday = justDate(new Date(Date.now() - 86400000));
	const formattedDate = justDate(date);
	return yesterday == formattedDate;
}

export function getDayOfWeek(date: Date) {
	const day = date.getDay();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	// 	case 0:
	// 		return "Sunday";
	// 	case 1:
	// 		return "Monday";
	// 	case 2:
	// 		return "Tuesday";
	// 	case 3:
	// 		return "Wednesday";
	// 	case 4:
	// 		return "Thursday";
	// 	case 5:
	// 		return "Friday";
	// 	case 6:
	// 		return "Saturday";
	// }
	return days[day];
}