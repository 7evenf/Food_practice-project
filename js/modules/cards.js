import { getResource } from '../services/services';

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

	getResource('http://localhost:3000/menu')
		.then(res => {
			res.forEach(structure => {
				new Cards(structure, '.menu .container').render();
			});
		});	
}


export default cards;