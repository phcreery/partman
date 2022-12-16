import { createI18n } from "vue-i18n";
import zh from "./modules/zh";
import en from "./modules/en";

const i18n = createI18n({
	legacy: false, // If you want to support compositionAPI，This item must be set to false
	locale: "zh", // Set language type
	globalInjection: true, // Global Registration$tMethods
	messages: {
		zh,
		en
	}
});

export default i18n;
