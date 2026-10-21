//#region src/js/modules/globe.js
var ACCRA = {
	name: "Accra",
	lat: 5.6,
	lon: -.19
};
var CITIES = [
	{
		name: "London",
		lat: 51.5,
		lon: -.13,
		dx: 10,
		dy: 16
	},
	{
		name: "New York",
		lat: 40.7,
		lon: -74,
		dx: 10,
		dy: 14
	},
	{
		name: "Toronto",
		lat: 43.65,
		lon: -79.38,
		dx: -8,
		dy: -10,
		align: "right"
	},
	{
		name: "Berlin",
		lat: 52.5,
		lon: 13.4,
		dx: 10,
		dy: -8
	},
	{
		name: "Houston",
		lat: 29.76,
		lon: -95.37,
		dx: -8,
		dy: 4,
		align: "right"
	}
];
var rad = (d) => d * Math.PI / 180;
var toVec = (lat, lon) => {
	const p = rad(lat), l = rad(lon);
	return [
		Math.cos(p) * Math.sin(l),
		Math.sin(p),
		Math.cos(p) * Math.cos(l)
	];
};
var slerp = (a, b, t) => {
	const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
	const om = Math.acos(dot);
	if (om < 1e-4) return a;
	const s = Math.sin(om);
	const k1 = Math.sin((1 - t) * om) / s, k2 = Math.sin(t * om) / s;
	return [
		a[0] * k1 + b[0] * k2,
		a[1] * k1 + b[1] * k2,
		a[2] * k1 + b[2] * k2
	];
};
function initGlobe(el, reduceMotion) {
	let config = {};
	try {
		config = JSON.parse(el.dataset.globeConfig || "{}");
	} catch (e) {}
	const cities = config.cities || CITIES;
	const [viewLon, viewLat] = config.view || [-28, 22];
	const canvas = document.createElement("canvas");
	canvas.setAttribute("role", "img");
	canvas.setAttribute("aria-label", `Globe with routes from ${cities.map((c) => c.name).join(", ")} to Accra, Ghana`);
	el.appendChild(canvas);
	const ctx = canvas.getContext("2d");
	const N = window.innerWidth < 700 ? 650 : 1100;
	const dots = [];
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let i = 0; i < N; i++) {
		const y = 1 - i / (N - 1) * 2;
		const r = Math.sqrt(1 - y * y);
		dots.push([
			Math.cos(golden * i) * r,
			y,
			Math.sin(golden * i) * r
		]);
	}
	const accra = toVec(ACCRA.lat, ACCRA.lon);
	const routes = cities.map((c, i) => ({
		...c,
		v: toVec(c.lat, c.lon),
		offset: i * .22
	}));
	let W = 0, H = 0, R = 0, dpr = 1;
	const resize = () => {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		W = el.clientWidth;
		H = el.clientHeight;
		canvas.width = W * dpr;
		canvas.height = H * dpr;
		canvas.style.width = W + "px";
		canvas.style.height = H + "px";
		R = Math.min(W, H) * .4;
	};
	resize();
	new ResizeObserver(resize).observe(el);
	let rotY = rad(viewLon);
	const tilt = rad(viewLat);
	let drag = null, velocity = 0;
	const project = (v) => {
		const cy = Math.cos(rotY), sy = Math.sin(rotY);
		let x = v[0] * cy - v[2] * sy;
		let z = v[0] * sy + v[2] * cy;
		let y = v[1];
		const ct = Math.cos(tilt), st = Math.sin(tilt);
		const y2 = y * ct - z * st;
		const z2 = y * st + z * ct;
		return [
			W / 2 + x * R,
			H / 2 - y2 * R,
			z2
		];
	};
	const buckets = [
		[],
		[],
		[],
		[],
		[]
	];
	const draw = (t) => {
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		const glow = ctx.createRadialGradient(W / 2, H / 2, R * .85, W / 2, H / 2, R * 1.25);
		glow.addColorStop(0, "rgba(243,217,139,.10)");
		glow.addColorStop(1, "rgba(243,217,139,0)");
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(W / 2, H / 2, R * 1.25, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "rgba(243,217,139,.25)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(W / 2, H / 2, R, 0, Math.PI * 2);
		ctx.stroke();
		for (let b = 0; b < 5; b++) buckets[b].length = 0;
		for (const d of dots) {
			const [x, y, z] = project(d);
			if (z < 0) continue;
			buckets[Math.min(4, z * 5 | 0)].push(x, y);
		}
		for (let b = 0; b < 5; b++) {
			const pts = buckets[b];
			if (!pts.length) continue;
			const z = (b + .5) / 5;
			const sz = .9 + z * 1.4;
			ctx.fillStyle = `rgba(233,201,122,${.18 + z * .65})`;
			ctx.beginPath();
			for (let i = 0; i < pts.length; i += 2) ctx.rect(pts[i] - sz / 2, pts[i + 1] - sz / 2, sz, sz);
			ctx.fill();
		}
		const [ax, ay, az] = project(accra);
		routes.forEach((r) => {
			const steps = 60;
			const pts = [];
			for (let i = 0; i <= steps; i++) {
				const k = i / steps;
				const v = slerp(r.v, accra, k);
				const lift = 1 + Math.sin(Math.PI * k) * .22;
				pts.push(project([
					v[0] * lift,
					v[1] * lift,
					v[2] * lift
				]));
			}
			ctx.lineWidth = 1.4;
			ctx.strokeStyle = "rgba(243,217,139,.28)";
			ctx.beginPath();
			pts.forEach(([x, y, z], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
			ctx.stroke();
			const prog = (t * 18e-5 + r.offset) % 1;
			const head = Math.floor(prog * steps);
			ctx.lineWidth = 2.4;
			ctx.lineCap = "round";
			for (let i = Math.max(1, head - 14); i <= head; i++) {
				const a = (i - (head - 14)) / 14;
				ctx.strokeStyle = `rgba(255,236,180,${a})`;
				ctx.beginPath();
				ctx.moveTo(pts[i - 1][0], pts[i - 1][1]);
				ctx.lineTo(pts[i][0], pts[i][1]);
				ctx.stroke();
			}
			const [cx, cy, cz] = pts[0];
			if (cz > -.2) {
				ctx.fillStyle = "#ffffff";
				ctx.beginPath();
				ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
				ctx.fill();
				ctx.font = "500 12px Montserrat, sans-serif";
				ctx.fillStyle = "rgba(232,236,244,.9)";
				ctx.textAlign = r.align || "left";
				ctx.fillText(r.name, cx + r.dx, cy + r.dy);
				ctx.textAlign = "left";
			}
		});
		if (az > 0) {
			const pulse = t * .0012 % 1;
			ctx.strokeStyle = `rgba(243,217,139,${1 - pulse})`;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(ax, ay, 6 + pulse * 22, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fillStyle = "#f3d98b";
			ctx.beginPath();
			ctx.arc(ax, ay, 6, 0, Math.PI * 2);
			ctx.fill();
			ctx.font = "600 17px \"Cormorant Garamond\", serif";
			ctx.fillStyle = "#f3d98b";
			ctx.fillText("Accra, Ghana", ax + 12, ay + 20);
		}
	};
	canvas.style.touchAction = "pan-y";
	canvas.addEventListener("pointerdown", (e) => {
		drag = e.clientX;
		velocity = 0;
	});
	window.addEventListener("pointermove", (e) => {
		if (drag === null) return;
		const dx = e.clientX - drag;
		drag = e.clientX;
		velocity = dx * .005;
		rotY += velocity;
	});
	window.addEventListener("pointerup", () => drag = null);
	window.addEventListener("pointercancel", () => drag = null);
	let visible = false;
	new IntersectionObserver(([e]) => visible = e.isIntersecting, { rootMargin: "100px" }).observe(el);
	const base = rad(viewLon);
	let lastFrame = 0;
	const loop = (t) => {
		requestAnimationFrame(loop);
		if (!visible || document.hidden) return;
		if (t - lastFrame < 1e3 / 31) return;
		lastFrame = t;
		if (drag === null && !reduceMotion) {
			velocity *= .95;
			rotY += velocity;
			rotY += (base + Math.sin(t * 25e-5) * .5 - rotY) * .01;
		}
		draw(t);
	};
	requestAnimationFrame(loop);
}
//#endregion
export { initGlobe };
