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
                    showContent(i);
                }
            }) 
        }
    });


    // Timer

    const deadline = '2023-02-16';
    
    
    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / (1000 * 60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            sum: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        }
    }

    function fixTime(sum) {
        if (sum > 0 && sum < 10) {
            return `0${sum}`
        } else {
            return sum;
        }
    }

    function setClock(mainelem, endtime) {
        const time = document.querySelector(mainelem),
              days = time.querySelector('#days'),
              hours = time.querySelector('#hours'),
              minutes = time.querySelector('#minutes'),
              seconds = time.querySelector('#seconds'),
              timeInterval = setInterval(updateTime, 1000);


        updateTime();
        
        function updateTime() {
            const t = getTimeRemaining(endtime);

            days.textContent = fixTime(t.days);
            hours.textContent = fixTime(t.hours);
            minutes.textContent = fixTime(t.minutes);
            seconds.textContent = fixTime(t.seconds);

            if (t.sum < 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);
    
});
