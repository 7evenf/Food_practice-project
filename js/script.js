'use strict';

window.addEventListener('DOMContentLoaded', () => {


    // Tabs


    const tabs = document.querySelectorAll('.tabheader__item'),
          contents = document.querySelectorAll('.tabcontent'),
          parentTabs = document.querySelector('.tabheader__items');

    function hideTabContent() {
        contents.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        contents[i].style.display = 'block';

        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    parentTabs.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {

                    hideTabContent();
                    showTabContent(i);
                }
            }) 
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
    }

    window.addEventListener('scroll', showModalByScroll);


    // menu cards

    class Cards {
        constructor(src, alt, descr, text, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.descr = descr;
            this.text = text;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const card = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                card.classList.add(this.classes);
            } else {
                this.classes.forEach(className => card.classList.add(className));
            }

            card.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.descr}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            
            this.parent.append(card);
        }
    }

    new Cards(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container",
        'menu__item',
    ).render();

    new Cards(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container",
        'menu__item',
    ).render();

    new Cards(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container",
        'menu__item',
    ).render();


    // Forms


    const forms = document.querySelectorAll('form');
    forms.forEach(form => postData(form));
    const patternAlerts = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        error: 'Извините, что-то пошло не так!'
    }


    function postData(form) {
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
            const obj = {};
            formData.forEach((key, i) => {
                obj[i] = key;
            });


            fetch('server.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(obj)
                
            })
            .then((data) => data.text())
            .then((data) => {
                console.log(data)
                showModalAfterSending(patternAlerts.success);
                statusLoading.remove();
            })
            .catch((error) => console.log(error))
            .finally(() => form.reset())
        })
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
        `
        document.querySelector('.modal').append(currentModal);

        setTimeout(() => {
            previosModal.style.display = 'block';
            currentModal.remove();
            closeModal();
        }, 3000)
    }


});