// It uses `window.matchMedia` instead of `window.addEventListener('resize')` because `matchMedia` performs better by not changing its value with every screen resize.
const mobileScreen = window.matchMedia("(max-width: 1110px)");
let isSmallScreen = mobileScreen?.matches;
const tocScreen = window.matchMedia("(max-width: 800px)");
let isTocScreen = tocScreen.matches;

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
const toggleBtn = document.getElementById("menu-toggle");
const tocList = document.getElementById("menu");

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
	const isTocOpen = tocList?.classList.contains("open");

	if (isLanguageMenuOpen) {
		languagePickerMenu?.classList.remove("opens");
		menu?.classList.toggle("opens");
	} else if (isTocOpen) {
		tocList?.classList.remove("open");
		menu?.classList.toggle("opens");
	} else {
		menu?.classList.toggle("opens");
		overlay?.classList.toggle("blurs");
		document.body.classList.toggle("no-scroll");
		tocScreen && !menu?.classList.contains("opens") ? toggleBtn?.classList.add("show") : toggleBtn?.classList.remove("show");
	}
});

languagePickerButton?.addEventListener("click", () => {
	const isMenuOpen = menu?.classList.contains("opens");
	const isTocOpen = tocList?.classList.contains("open");

	if (isMenuOpen) {
		menu?.classList.remove("opens");
		languagePickerMenu?.classList.toggle("opens");
	} else if (isTocOpen) {
		tocList?.classList.remove("open");
		languagePickerMenu?.classList.toggle("opens");
	} else {
		languagePickerMenu?.classList.toggle("opens");
		overlay?.classList.toggle("blurs");
		document.body.classList.toggle("no-scroll");
		tocScreen && !languagePickerMenu?.classList.contains("opens") ? toggleBtn?.classList.add("show") : toggleBtn?.classList.remove("show");
	}
});

overlay?.addEventListener("click", () => {
	const isTocOpen = tocList?.classList.contains("open");
	if (menu?.classList.contains("opens")) {
		menu.classList.remove("opens");
	}
	if (languagePickerMenu?.classList.contains("opens")) {
		languagePickerMenu.classList.remove("opens");
	}
	if(isTocOpen) {
		tocList?.classList.remove("open");
	}
	tocScreen && toggleBtn?.classList.add("show");
	overlay.classList.remove("blurs");
	document.body.classList.remove("no-scroll");
});

document
	.querySelector(`.submenu-content a[href="${document.location.pathname}"]`)
	?.classList.add("current");

// TOC
// ! important note add scroll observer element common to all pages that include TOC component 👇🏻 remove id to "scroll-observer"
const tocSubMenu = document.querySelectorAll("#menu > li > ul");
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

// Update toc button visibility based on screen size
function updateTocVisibility() {
	if (isTocScreen) {
	  overlay?.classList.remove("blurs")
	  tocList?.classList.remove("open");
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

// Show toc button on page load
updateTocVisibility();

// Listen for changes in screen size
tocScreen.addEventListener("change", (event) => {
  isTocScreen = event.matches;
  updateTocVisibility();
});

// Toggle toc menu on button click
toggleBtn?.addEventListener("click", () => {
  tocList?.classList.toggle("open");
  overlay?.classList.toggle("blurs");
  document.body.classList.toggle("no-scroll");
  toggleBtn?.classList.remove("show");
});

// Close menu on link click
document.querySelectorAll("#menu > li > ul a").forEach((link) => {
  link.addEventListener("click", function () {
   if(isTocScreen) {
		tocList?.classList.remove("open");
		overlay?.classList.remove("blurs");
		document.body.classList.remove("no-scroll");
		toggleBtn?.classList.add("show");
   }
  });
});

// open sub toc content on click
document.querySelectorAll("#menu > li > a").forEach((link) => {
	link.addEventListener("click", function () {
		  tocSubMenu.forEach((subMenu) => {
			!link?.classList.contains("active") && subMenu?.classList.remove("active");
		  });
		  const closestLiParent = link.closest("li");
		  const childUlSubMenu = closestLiParent.children[1];
		  childUlSubMenu?.classList.toggle("active");
	});
});