import { createI18n } from "vue-i18n";
import zh from "./modules/zh";
import en from "./modules/en";

const i18n = createI18n({
	locale: "en",
	messages: {
		zh,
		en
	}
});

export default i18n;
