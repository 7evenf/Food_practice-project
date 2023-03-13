function slider({container, slide, prevArrow, nextArrov, totalCount, currentCount, wrapper, field}) {
	const slides = document.querySelectorAll(slide),
		  prev = document.querySelector(prevArrow),
		  next = document.querySelector(nextArrov),
		  total = document.querySelector(totalCount),
		  current = document.querySelector(currentCount),
		  sliderWrapper = document.querySelector(wrapper),
		  sliderInner = document.querySelector(field),
		  width = window.getComputedStyle(sliderWrapper).width,
		  slider = document.querySelector(container),
		  indicators = document.createElement('ol'),
		  dots = [];
		  

	let slideIndex = 1;
	let offset = 0;


	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	} else {
		total.textContent = slides.length;
	}

	current.textContent = `0${slideIndex}`;


	sliderInner.style.width = slides.length * 100 + '%';
	sliderInner.style.display = 'flex';
	sliderInner.style.transition = '0.6s all';

	sliderWrapper.style.overflow = 'hidden';

	slides.forEach(item => {
		item.style.width = width;
	});


	slider.style.position = 'relative';

	indicators.classList.add('carousel-indicators');
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.classList.add('dot');
		dot.setAttribute('data-slide-to', i + 1);
		if (i == 0) {
			dot.style.opacity = '1';
		}

		indicators.append(dot);
		dots.push(dot);
	}


	function refreshCurrentCount() {
		if (slideIndex < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	function setCurrentDot() {
		dots.forEach(item => item.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	}
	
	function cutStringToNumber(str) {
		return +str.replace(/\D/g, '');
	}


	next.addEventListener('click', () => {
		if (offset == cutStringToNumber(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += cutStringToNumber(width);
		}

		sliderInner.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		refreshCurrentCount();
		setCurrentDot();
	});

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = cutStringToNumber(width) * (slides.length - 1);
		} else {
			offset -= cutStringToNumber(width);
		}

		sliderInner.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		refreshCurrentCount();
		setCurrentDot();
	});

	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			
			slideIndex = slideTo;
			offset = cutStringToNumber(width) * (slideTo - 1);
			sliderInner.style.transform = `translateX(-${offset}px)`;

			refreshCurrentCount();
			setCurrentDot();
		});
	});
}


export default slider;

