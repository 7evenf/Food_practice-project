'use strict';
import tabs from './modules/tabs';
import modal from './modules/modal';
import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import slider from './modules/slider';
import timer from './modules/timer';
import { showModal } from './modules/modal';


window.addEventListener('DOMContentLoaded', () => {
	const modalTimerId = setTimeout(() => showModal('.modal', modalTimerId), 10000);
	

	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	modal('[data-modal]', '.modal', modalTimerId);
	calc();
	cards();
	forms('form', modalTimerId);
	slider({
		container: '.offer__slider',
		slide: '.offer__slide',
		prevArrow: '.offer__slider-prev',
		nextArrov: '.offer__slider-next',
		totalCount: '#total',
		currentCount: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner'
	});
	timer('.timer', '2023-01-01');
});