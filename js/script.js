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
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

    
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


    modalCloseBtn.addEventListener('click', closeModal);


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && window.getComputedStyle(modal).display === 'block') {
            closeModal();
        }
    });


    // const modalTimerId = setTimeout(showModal, 2000);

    
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
    const pattern = {
        process: 'Processing',
        success: 'Success',
        fail: 'Fail, please wait'
    }


    forms.forEach(item => {
        postData(item);
    });
    
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const box = document.createElement('div');
            form.append(box);
            box.textContent = pattern.process;

            const request = new XMLHttpRequest();  
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json');

            const formData = new FormData(form);
            const obj = {};
            formData.forEach((item, i) => {
                obj[i] = item;
            });

            request.send(JSON.stringify(obj));

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    form.reset();
                    box.textContent = pattern.success;
                    setTimeout(() => box.textContent = '', 2000)
                } else {
                    box.textContent = pattern.fail;
                }
            });
        });

    }

});
