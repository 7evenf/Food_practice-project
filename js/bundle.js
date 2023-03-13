/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function calc() {
	const result = document.querySelector('.calculating__result span');
	let sex, height, weight, age, ratio;

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	} else {
		sex = 'woman';
		localStorage.setItem('sex', 'woman');
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	} else {
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375);
	}


	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '';
			return;
		} else {
			if (sex === 'woman') {
				result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
			} else {
				result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
			}
		}
	}
	
	calcTotal();


	function initLocalSettings(parentSelector, activeClass) {
		const divs = document.querySelectorAll(`${parentSelector} div`);

		divs.forEach(div => {
			div.classList.remove(activeClass);

			if (div.getAttribute('id') === sex) {
				div.classList.add(activeClass);
			}
			if (div.getAttribute('data-ratio') === ratio) {
				div.classList.add(activeClass);
			}
		});
	}
	
	initLocalSettings('#gender', 'calculating__choose-item_active');
	initLocalSettings('.calculating__choose_big', 'calculating__choose-item_active');

	function getStaticValue(parentSelector, activeClass) {
		const divs = document.querySelectorAll(`${parentSelector} div`);

		document.querySelector(parentSelector).addEventListener('click', (e) => {
			if (e.target && e.target.classList.contains('calculating__choose-item')) {
				if (e.target.getAttribute('data-ratio')) {
					ratio = +e.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
				} else {
					sex = e.target.getAttribute('id');
					localStorage.setItem('sex', e.target.getAttribute('id'));
				}



				divs.forEach(div => div.classList.remove(activeClass));
				e.target.classList.add(activeClass);
				calcTotal();
			}
		});
	}

	getStaticValue('#gender', 'calculating__choose-item_active');
	getStaticValue('.calculating__choose_big', 'calculating__choose-item_active');


	function getDynamicValue(inputSelector) {
		const input = document.querySelector(inputSelector);

		input.addEventListener('input', () => {
			if (input.value.match(/\D/g)){
				input.style.border = '1px solid red';
			} else {
				input.style.border = '';
			}

			switch(input.getAttribute('id')) {
			case 'height': 
				height = +input.value;
				break;
			case 'weight': 
				weight = +input.value;
				break;
			case 'age': 
				age = +input.value;
				break;
			}

			calcTotal();
		});
	}

	getDynamicValue('#height');
	getDynamicValue('#weight');
	getDynamicValue('#age');
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function cards() {
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

	(0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResource)('http://localhost:3000/menu')
		.then(res => {
			res.forEach(structure => {
				new Cards(structure, '.menu .container').render();
			});
		});	
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");



function forms(formSelector, modalTimerId) {
	const forms = document.querySelectorAll(formSelector);

	forms.forEach(form => bindPostData(form));

	const patternAlerts = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		error: 'Извините, что-то пошло не так!'
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

			(0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
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
		(0,_modal__WEBPACK_IMPORTED_MODULE_0__.showModal)('.modal', modalTimerId);
        
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
			(0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
		}, 3000);
	}
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "showModal": () => (/* binding */ showModal)
/* harmony export */ });
function closeModal(modalSelector) {
	const modal = document.querySelector(modalSelector);

	modal.style.display = 'none';
	document.body.style.overflow = '';
}

function showModal(modalSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector);	

	modal.style.display = 'block';
	document.body.style.overflow = 'hidden';

	if (modalTimerId) {
		clearInterval(modalTimerId);
	}
}

function modal(triggerSelector, modalSelector, modalTimerId) {
	const modalTrigger = document.querySelectorAll(triggerSelector),
		  modal = document.querySelector(modalSelector);

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', () => showModal(modalSelector, modalTimerId)); 
	});

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal(modalSelector);
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && window.getComputedStyle(modal).display === 'block') {
			closeModal(modalSelector);
		}
	});

	const showModalByScroll = function() {
		if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			showModal(modalSelector, modalTimerId);

			window.removeEventListener('scroll', showModalByScroll);
		};
	};

	window.addEventListener('scroll', showModalByScroll);
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);



/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs(tabsSelector, tebsContentSelector, tabsParentSelector, activeClass) {
	const tabs = document.querySelectorAll(tabsSelector),
	      contents = document.querySelectorAll(tebsContentSelector),
	      parentTabs = document.querySelector(tabsParentSelector);

	function hideTabContent() {
		contents.forEach(item => item.style.display = 'none');

		tabs.forEach(item => item.classList.remove(activeClass));
	}

	function showTabContent(i = 0) {
		hideTabContent();
		contents[i].style.display = 'block';

		tabs[i].classList.add(activeClass);
	}

	showTabContent();

	parentTabs.addEventListener('click', (e) => {
		if (e.target && e.target.classList.contains(tabsSelector.slice(1))) {
			tabs.forEach((item, i) => {
				if (item === e.target) {
					showTabContent(i);
				}
			});
		}
	});
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function timer(id, deadline) {
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
    
	getTimerElements(id, deadline);
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);

/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getResource": () => (/* binding */ getResource),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
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

const getResource = async (url) => {
	const res = await fetch(url);
	
	if (!res.ok) {
		throw new Error(`Could not fetch ${url}, status ${res.status}`);
	}
	
	return await res.json();
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");











window.addEventListener('DOMContentLoaded', () => {
	const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__.showModal)('.modal', modalTimerId), 10000);
	

	(0,_modules_tabs__WEBPACK_IMPORTED_MODULE_0__["default"])('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	(0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__["default"])('[data-modal]', '.modal', modalTimerId);
	(0,_modules_calc__WEBPACK_IMPORTED_MODULE_2__["default"])();
	(0,_modules_cards__WEBPACK_IMPORTED_MODULE_3__["default"])();
	(0,_modules_forms__WEBPACK_IMPORTED_MODULE_4__["default"])('form', modalTimerId);
	(0,_modules_slider__WEBPACK_IMPORTED_MODULE_5__["default"])({
		container: '.offer__slider',
		slide: '.offer__slide',
		prevArrow: '.offer__slider-prev',
		nextArrov: '.offer__slider-next',
		totalCount: '#total',
		currentCount: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner'
	});
	(0,_modules_timer__WEBPACK_IMPORTED_MODULE_6__["default"])('.timer', '2023-01-01');
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map