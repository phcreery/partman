import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
	easing: "ease", // Animation
	speed: 500, // The speed of the incremental degrade bar
	showSpinner: false, // Whether to display loading ico
	trickleSpeed: 200, // Automatic increasing interval
	minimum: 0.3 // The minimum percentage of initialization
});
export default NProgress;
