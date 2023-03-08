'use strict';

window.addEventListener('DOMContentLoaded', () => {
	// Tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		  contents = document.querySelectorAll('.tabcontent'),
		  parentTabs = document.querySelector('.tabheader__items');

	function hideTabContent() {
		contents.forEach(item => item.style.display = 'none');

		tabs.forEach(item => item.classList.remove('tabheader__item_active'));
	}

	function showTabContent(i = 0) {
		hideTabContent();
		contents[i].style.display = 'block';

		tabs[i].classList.add('tabheader__item_active');
	}

	showTabContent();

	parentTabs.addEventListener('click', (e) => {
		if (e.target && e.target.classList == 'tabheader__item') {
			tabs.forEach((item, i) => {
				if (item === e.target) {

					showTabContent(i);
				}
			});
		}
	});


	// Timer

    
	const deadline = '2023-02-27';

	function getTimeRemaining(endtime) {
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((t / (1000 * 60)) % 60),
			seconds = Math.floor((t / 1000) % 60);
		}

		return {
			total: t,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		};
	}

	function getZero(num) {
		if (num > 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function getTimerElements(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(setClock, 1000);

		setClock();

		function setClock() {
			const t = getTimeRemaining(endtime);

			days.textContent = getZero(t.days);
			hours.textContent = getZero(t.hours);
			minutes.textContent = getZero(t.minutes);
			seconds.textContent = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
    
	getTimerElements('.timer', deadline);


	// Modal


	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

    
	function showModal() {
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden';

		clearInterval(modalTimerId);
	}


	modalTrigger.forEach(btn => {
		btn.addEventListener('click', showModal); 
	});


	function closeModal() {
		modal.style.display = 'none';
		document.body.style.overflow = '';
	}



	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});


	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && window.getComputedStyle(modal).display === 'block') {
			closeModal();
		}
	});


	const modalTimerId = setTimeout(showModal, 20000);

    
	const showModalByScroll = function() {
		if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			showModal();

			window.removeEventListener('scroll', showModalByScroll);
		};
	};

	window.addEventListener('scroll', showModalByScroll);


	// menu cards

	class Cards {
		constructor(structure, parentSelector) {
			this.img = structure.img;
			this.altimg = structure.altimg;
			this.title = structure.title;
			this.descr = structure.descr;
			this.price = structure.price;
			this.usdprice = 4;
			this.parent = document.querySelector(parentSelector);
			this.exchangeUsd();
		}
		
		exchangeUsd() {
			this.price = (this.price / this.usdprice).toFixed();
		}

		render() {
			const card = document.createElement('div');
			card.classList.add('menu__item');
			card.innerHTML = `
				<img src=${this.img} alt=${this.altimg}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> $/день
				</div>
			`;
			this.parent.append(card);
		}
	}

	const getResource = async (url) => {
		const res = await fetch(url);
		
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}
		
		return await res.json();
	};

	getResource('http://localhost:3000/menu')
		.then(res => {
			res.forEach(structure => {
				new Cards(structure, '.menu .container').render();
			});
		});	


	// Forms


	const forms = document.querySelectorAll('form');

	forms.forEach(form => bindPostData(form));

	const patternAlerts = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		error: 'Извините, что-то пошло не так!'
	};

	const postData = async (url, body) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body
		});

		return await res.json();
	};
	
	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			
			const statusLoading = document.createElement('img');
			statusLoading.src = patternAlerts.loading;
			statusLoading.style.cssText = `
                display: block; 
                margin: 0 auto;
            `;
			form.insertAdjacentElement('afterend', statusLoading);

			const formData = new FormData(form);
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showModalAfterSending(patternAlerts.success);
					statusLoading.remove();
				})
				.catch((error) => console.log(error))
				.finally(() => form.reset());
		});
	}

	function showModalAfterSending(textallert) {
		const previosModal = document.querySelector('.modal__dialog');
		previosModal.style.display = 'none';
		showModal();
        
		const currentModal = document.createElement('div');
		currentModal.classList.add('modal__dialog');
		currentModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">×</div>
                <div class="modal__title">${textallert}</div>
            </div>
        `;
		document.querySelector('.modal').append(currentModal);

		setTimeout(() => {
			previosModal.style.display = 'block';
			currentModal.remove();
			closeModal();
		}, 3000);
	}


	// Slider

	const slides = document.querySelectorAll('.offer__slide'),
		  prevArrow = document.querySelector('.offer__slider-prev'),
		  nextArrow = document.querySelector('.offer__slider-next'),
		  total = document.querySelector('#total'),
		  current = document.querySelector('#current'),
		  sliderWrapper = document.querySelector('.offer__slider-wrapper'),
		  sliderInner = document.querySelector('.offer__slider-inner'),
		  width = window.getComputedStyle(sliderWrapper).width,
		  slider = document.querySelector('.offer__slider'),
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


	nextArrow.addEventListener('click', () => {
		if (offset == +width.slice(0, -2) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += +width.slice(0, -2);
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

	prevArrow.addEventListener('click', () => {
		if (offset == 0) {
			offset = +width.slice(0, -2) * (slides.length - 1);
		} else {
			offset -= +width.slice(0, -2);
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
			offset = +width.slice(0, -2) * (slideTo - 1);
			sliderInner.style.transform = `translateX(-${offset}px)`;

			refreshCurrentCount();
			setCurrentDot();
		});
	});

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
	
	
});