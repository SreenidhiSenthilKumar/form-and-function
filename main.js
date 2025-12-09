document.addEventListener('DOMContentLoaded', function () {
	const el = document.getElementById('typewriter');
	if (!el) return;

	const fullText = el.getAttribute('data-text') || el.textContent || '';
	el.textContent = '';

	const speed = 90;
	let i = 0;

	function typeNext() {
		if (i <= fullText.length) {
			el.textContent = fullText.slice(0, i);
			i++;
			const jitter = Math.random() * 40;
			setTimeout(typeNext, speed + jitter);
		}
	}

	typeNext();
});

