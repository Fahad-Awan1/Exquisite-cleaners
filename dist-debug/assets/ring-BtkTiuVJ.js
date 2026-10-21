import { n as gsapWithCSS, t as ScrollTrigger } from "./main-DDIyI8Bh.js";
//#region src/js/modules/ring.js
function initRing(ring, reduceMotion) {
	const spinner = ring.querySelector(".ring__spinner");
	const spokes = ring.querySelector(".ring__spokes");
	const all = Array.from(spinner.children);
	const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	const cruise = reduceMotion ? 0 : -.12;
	const state = {
		angle: 0,
		velocity: cruise
	};
	let items = all;
	let n = all.length;
	let step = 360 / n;
	let radius = 0;
	let visible = false;
	let hovering = false;
	let tween = null;
	const layout = () => {
		items = all.filter((el) => getComputedStyle(el).display !== "none");
		n = items.length;
		step = 360 / n;
		const w = items[0].offsetWidth;
		const h = items[0].offsetHeight;
		const maxX = ring.clientWidth / 2 - w * .42;
		const maxY = ring.clientHeight / 2 - h / 2 - 6;
		radius = Math.max(60, Math.min(maxX, maxY));
		ring.style.setProperty("--r", `${radius}px`);
		spokes.setAttribute("viewBox", `${-radius} ${-radius} ${radius * 2} ${radius * 2}`);
		spokes.style.width = spokes.style.height = `${radius * 2}px`;
		spokes.innerHTML = items.map((_, i) => {
			const a = i * step * Math.PI / 180;
			return `<line x1="0" y1="0" x2="${(Math.sin(a) * radius).toFixed(1)}" y2="${(Math.cos(a) * radius).toFixed(1)}"/>`;
		}).join("") + `<circle cx="0" cy="0" r="${(radius - 1).toFixed(1)}"/>`;
		render();
	};
	const render = () => {
		for (let i = 0; i < n; i++) {
			const a = (i * step + state.angle) * Math.PI / 180;
			const x = Math.sin(a) * radius;
			const y = Math.cos(a) * radius;
			const front = (Math.cos(a) + 1) / 2;
			const scale = .55 + .45 * front ** 1.2;
			const el = items[i];
			el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
			el.style.zIndex = String(Math.round(front * 100));
			el.style.opacity = (.45 + .55 * front ** 1.4).toFixed(3);
			el.classList.toggle("is-front", front > .985);
		}
		spokes.style.transform = `rotate(${-state.angle}deg)`;
	};
	gsapWithCSS.ticker.add(() => {
		if (!visible || tween) return;
		const target = hovering ? cruise * .25 : cruise;
		state.velocity += (target - state.velocity) * .04;
		if (Math.abs(state.velocity) < 5e-4 && !cruise) return;
		state.angle += state.velocity;
		render();
	});
	new IntersectionObserver(([e]) => visible = e.isIntersecting, { rootMargin: "100px" }).observe(ring);
	if (!reduceMotion) {
		gsapWithCSS.set(ring, { opacity: 0 });
		const io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			io.disconnect();
			state.velocity = -3;
			gsapWithCSS.fromTo(ring, {
				scale: .6,
				opacity: 0
			}, {
				scale: 1,
				opacity: 1,
				duration: 1.6,
				ease: "expo.out"
			});
		}, { rootMargin: "0px 0px -20% 0px" });
		io.observe(ring);
		ScrollTrigger.create({
			trigger: ring,
			start: "top bottom",
			end: "bottom top",
			onUpdate: (self) => {
				const v = self.getVelocity();
				if (Math.abs(v) > 300 && !tween) state.velocity = Math.max(-4, Math.min(4, -v / 700));
			}
		});
	}
	let dragX = null;
	let lastX = 0;
	let moved = 0;
	ring.addEventListener("pointerdown", (e) => {
		if (e.button !== 0) return;
		tween?.kill();
		tween = null;
		dragX = lastX = e.clientX;
		moved = 0;
	});
	window.addEventListener("pointermove", (e) => {
		if (dragX === null) return;
		const dx = e.clientX - lastX;
		lastX = e.clientX;
		moved += Math.abs(dx);
		if (moved > 6) ring.classList.add("is-dragging");
		state.angle -= dx * .35;
		state.velocity = -dx * .35;
		render();
	});
	const endDrag = () => {
		if (dragX === null) return;
		dragX = null;
		ring.classList.remove("is-dragging");
	};
	window.addEventListener("pointerup", endDrag);
	window.addEventListener("pointercancel", endDrag);
	ring.addEventListener("click", (e) => {
		if (moved > 6) {
			e.stopPropagation();
			e.preventDefault();
			moved = 0;
		}
	}, true);
	if (finePointer) {
		ring.addEventListener("pointerenter", () => hovering = true);
		ring.addEventListener("pointerleave", () => hovering = false);
	}
	const goTo = (i) => {
		let target = -i * step;
		target += Math.round((state.angle - target) / 360) * 360;
		tween?.kill();
		state.velocity = 0;
		tween = gsapWithCSS.to(state, {
			angle: target,
			duration: reduceMotion ? .01 : .9,
			ease: "expo.out",
			onUpdate: render,
			onComplete: () => {
				tween = null;
				state.velocity = 0;
			}
		});
	};
	const current = () => (Math.round(-state.angle / step) % n + n) % n;
	document.querySelector("[data-ring-prev]")?.addEventListener("click", () => goTo(current() - 1));
	document.querySelector("[data-ring-next]")?.addEventListener("click", () => goTo(current() + 1));
	all.forEach((item) => item.addEventListener("focus", () => {
		const i = items.indexOf(item);
		if (i >= 0 && item.matches(":focus-visible")) goTo(i);
	}));
	layout();
	new ResizeObserver(layout).observe(ring);
}
//#endregion
export { initRing };
