import { showModal, closeModal } from './modal';
import { postData } from '../services/services';

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
		showModal('.modal', modalTimerId);
        
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
			closeModal('.modal');
		}, 3000);
	}
}


export default forms;