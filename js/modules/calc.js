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


export default calc;