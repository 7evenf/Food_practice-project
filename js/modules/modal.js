export function closeModal(modalSelector) {
	const modal = document.querySelector(modalSelector);

	modal.style.display = 'none';
	document.body.style.overflow = '';
}

export function showModal(modalSelector, modalTimerId) {
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


export default modal;