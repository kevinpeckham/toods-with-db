export function justDate(date: Date, twoDigitYear?: boolean) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const fullYear = date.getFullYear();
	const mil = fullYear.toString().slice(2, 4);
	if (twoDigitYear) return month + "." + day + "." + mil;
	else return month + "." + day + "." + fullYear;
}

export function getTomorrowDate() {
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
	return new Date(`${justDate(date)} 00:00:00`);
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

export function add24Hours(date: Date) {
	return new Date(date.getTime() + 86400000);
}

export function getDayOfWeek(date: Date) {
	const day = date.getDay();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days[day];
}

export function daysFromToday(date: Date) {
	const today = new Date();
	const diffTime = date.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export function dayAndDateString(date: Date) {
	const dayOfWeek = getDayOfWeek(date);
	const formattedDate = date.toLocaleDateString().replace(/\//g, ".");
	return `${dayOfWeek}, ${formattedDate}`;
}

export function newDayFromToday(days: number) {
	const today = new Date();
	return new Date(today.getTime() + 86400000 * days);
}

export function getDateXDaysFromDate(date: Date, days: number) {
	const startOfGivenDay = startOfDay(date);
	return new Date(startOfGivenDay.getTime() + 86400000 * days);
}
