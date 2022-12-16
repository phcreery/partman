import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
	easing: "ease", // Animation method
	speed: 500, // Incremental progress bar speed
	showSpinner: true, // Whether to show loadingico
	trickleSpeed: 200, // Auto-increment interval
	minimum: 0.3 // Minimum percentage at initialization
});
export default NProgress;
