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


export default tabs;