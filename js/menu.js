// It uses `window.matchMedia` instead of `window.addEventListener('resize')` because `matchMedia` performs better by not changing its value with every screen resize.
const mobileScreen = window.matchMedia("(max-width: 1110px)");
let isSmallScreen = mobileScreen?.matches;

mobileScreen?.addEventListener("change", (event) => {
	isSmallScreen = event.matches

	if (!event.matches) {
		document.body.classList.remove("no-scroll")
	}
});

// Desktop Menu

const itemsMenu = document.querySelectorAll(".submenu");

for (const el of itemsMenu) {
	el.addEventListener("click", () => {
		if (isSmallScreen || 'ontouchstart' in document.documentElement) {
			for (const item of itemsMenu) {
				if (item.id !== el.id) {
					item.classList.remove("open");
				}
			}
			el.classList.toggle("open");
		}
	});

	el.addEventListener("mouseenter", () => {
		if (!isSmallScreen) {
			el.classList.add("open");
		}
	});

	el.addEventListener("mouseleave", () => {
		if (!isSmallScreen) {
			el.classList.remove("open");
		}
	});
}

// Mobile Menu and Language Picker

const linkItemsMenu = document.querySelectorAll(".submenu > a");
const languageItems = document.querySelectorAll("#language-picker-menu > #navbar > #navmenu > .submenu > a");
const languagePickerMenu = document.querySelector("#language-picker-menu > #navbar > #navmenu");
const menu = document.querySelector("#navmenu");
const overlay = document.querySelector("#overlay");
const navButton = document.querySelector("#nav-button");
const languagePickerButton = document.querySelector("#language-picker-button");

for (const el of linkItemsMenu) {
	el.addEventListener("click", (e) => {
		if (el.classList.contains("open")) {
			el.classList.remove("open");
		}
		
		if (isSmallScreen || 'ontouchstart' in document.documentElement) {
			e.preventDefault();
		}
	});

}

for (const el of languageItems) {
	el.addEventListener("click", (e) => {
		const href = el.getAttribute("href");

		if (href && href !== "#") {
			languagePickerMenu?.classList.remove("opens");
			overlay?.classList.remove("blurs");
			document.body.classList.remove("no-scroll");

			window.location.href = href;
		}
	});
}

navButton?.addEventListener("click", () => {
	const isLanguageMenuOpen = languagePickerMenu?.classList.contains("opens");

	if (isLanguageMenuOpen) {
		languagePickerMenu?.classList.remove("opens");
		menu?.classList.toggle("opens");
	} else {
		menu?.classList.toggle("opens");
		overlay?.classList.toggle("blurs");
		document.body.classList.toggle("no-scroll");
	}
});

languagePickerButton?.addEventListener("click", () => {
	const isMenuOpen = menu?.classList.contains("opens");

	if (isMenuOpen) {
		menu?.classList.remove("opens");
		languagePickerMenu?.classList.toggle("opens");
	} else {
		languagePickerMenu?.classList.toggle("opens");
		overlay?.classList.toggle("blurs");
		document.body.classList.toggle("no-scroll");
	}
});

overlay?.addEventListener("click", () => {
	if (menu?.classList.contains("opens")) {
		menu.classList.remove("opens");
	}
	if (languagePickerMenu?.classList.contains("opens")) {
		languagePickerMenu.classList.remove("opens");
	}
	overlay.classList.remove("blurs");
	document.body.classList.remove("no-scroll");
});

document
	.querySelector(`.submenu-content a[href="${document.location.pathname}"]`)
	?.classList.add("current");

// TOC
const tocScreen = window.matchMedia("(max-width: 1440px)");
let isTocScreen = tocScreen.matches;
const toggleBtn = document.getElementById("menu-toggle");
const menuList = document.getElementById("menu");
// ! important note add scroll observer element common to all pages that include TOC component 👇🏻 remove id to "scroll-obsever"
const firstHeader = document.getElementById("express");
let observer;


// Scroll observer (perform better than window scroll event listener)
function createScrollObserver() {
  if (observer) observer.disconnect();

  let options = {
    root: null, // Observe relative to viewport
    rootMargin: "-57px 0px 0px 0px", // Slight offset to ensure intersection triggers correctly
    threshold: 0, // Trigger when the element is fully out of view (i.e. behind header)
  };

  observer = new IntersectionObserver(handleIntersect, options);
  // observe intersection of TOC btn with header bar
  observer.observe(firstHeader);
}

// Update button visibility based on screen size
function updateButtonVisibility() {
	if (isTocScreen) {
	  toggleBtn?.classList.add("show");
	  createScrollObserver();
	} else {
	  toggleBtn?.classList.remove("show");
	  if (observer) observer.disconnect();
	}
  }

function handleIntersect(entries) {
  const [entry] = entries
  const clientWidth = entry.boundingClientRect.width
  // first header in invisible then show floating TOC btn
  if(!entry.isIntersecting) {
		if(toggleBtn) {
			if(clientWidth >= 540) {
				toggleBtn.innerHTML = "&#x25BC"; 
			} else {
				toggleBtn.innerHTML = "Table of content &#x25BC";
			};
		}
		toggleBtn?.classList.add("position-fixed");
	};
  // first header is visible then show static TOC btn 
  if(entry.isIntersecting) {
		if(toggleBtn) toggleBtn.innerHTML = "Table of content &#x25BC";
		toggleBtn?.classList.remove("position-fixed");
  };
};

// Show button on page load
updateButtonVisibility();

// Listen for changes in screen size
tocScreen.addEventListener("change", (event) => {
  isTocScreen = event.matches;
  updateButtonVisibility();
});

// Toggle menu on button click
toggleBtn?.addEventListener("click", () => {
  menuList?.classList.toggle("open");
  overlay?.classList.toggle("blurs");
  document.body.classList.toggle("no-scroll");
  if (isTocScreen) {
    toggleBtn?.classList.remove("show");
  }
});

// Close menu on link click
document.querySelectorAll("#menu a").forEach((link) => {
  link.addEventListener("click", function () {
    menuList?.classList.remove("open");
    overlay?.classList.remove("blurs");
    document.body.classList.remove("no-scroll");
    if (isTocScreen) {
      toggleBtn?.classList.add("show");
    }
  });
});
