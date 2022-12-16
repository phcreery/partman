import { ref } from "vue";

/**
 * @description Get local time
 */
export const useTime = () => {
	const year = ref(0); // Year
	const month = ref(0); // Month
	const week = ref(""); // Day of the week
	const day = ref(0); // Number of days
	const hour = ref<number | string>(0); // Hours
	const minute = ref<number | string>(0); // Minutes
	const second = ref<number | string>(0); // seconds
	const nowTime = ref<string>(""); // Current Time

	// Update time
	const updateTime = () => {
		const date = new Date();
		year.value = date.getFullYear();
		month.value = date.getMonth() + 1;
		week.value = "Day 1, 2, 3, 4, 5, 6".charAt(date.getDay());
		day.value = date.getDate();
		hour.value =
			(date.getHours() + "")?.padStart(2, "0") ||
			new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(date.getHours());
		minute.value =
			(date.getMinutes() + "")?.padStart(2, "0") ||
			new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(date.getMinutes());
		second.value =
			(date.getSeconds() + "")?.padStart(2, "0") ||
			new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(date.getSeconds());
		nowTime.value = `${year.value}Year${month.value}Month${day.value} ${hour.value}:${minute.value}:${second.value}`;
	};

	updateTime();

	return { year, month, day, hour, minute, second, week, nowTime };
};
