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
const blogList = document.getElementById("blog-side-menu");

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
	const isBlogTocOpen = blogList?.classList.contains("open");
	if (isLanguageMenuOpen) {
		languagePickerMenu?.classList.remove("opens");
		menu?.classList.toggle("opens");
	} else if (isTocOpen || isBlogTocOpen) {
		tocList?.classList.remove("open");
		blogList?.classList.remove("open");
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
	const isBlogTocOpen = blogList?.classList.contains("open");
	if (isMenuOpen) {
		menu?.classList.remove("opens");
		languagePickerMenu?.classList.toggle("opens");
	} else if (isTocOpen || isBlogTocOpen) {
		tocList?.classList.remove("open");
		blogList?.classList.remove("open");
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
	const isBlogTocOpen = blogList?.classList.contains("open");
	if (menu?.classList.contains("opens")) {
		menu.classList.remove("opens");
	}
	if (languagePickerMenu?.classList.contains("opens")) {
		languagePickerMenu.classList.remove("opens");
	}
	if(isTocOpen || isBlogTocOpen) {
		tocList?.classList.remove("open");
		blogList?.classList.remove("open");
	}
	overlay.classList.remove("blurs");
	document.body.classList.remove("no-scroll");
});

document
	.querySelector(`.submenu-content a[href="${document.location.pathname}"]`)
	?.classList.add("current");

// TOC
const tocSubMenu = document.querySelectorAll("#menu > li > ul");

// TOC btn Visibility using scroll event
function updateTocVisibility() {
	if (isTocScreen) {
	  toggleBtn?.classList.add("show");
	} else {
	  toggleBtn?.classList.remove("show");
	}
  }

// Show toc button on page load
updateTocVisibility();

// Listen for changes in screen size
tocScreen.addEventListener("change", (event) => {
  isTocScreen = event.matches;
  updateTocVisibility();
});

// Toggle toc menu on button click
toggleBtn?.addEventListener("click", (e) => {
  blogList?.classList.toggle("open");
  tocList?.classList.toggle("open");
  overlay?.classList.toggle("blurs");
  document.body.classList.toggle("no-scroll");
});

// Close toc on link click on small screen
document.querySelectorAll("#menu > li > ul a").forEach((link) => {
  link.addEventListener("click", function () {
   if(isTocScreen) {
		tocList?.classList.remove("open");
		overlay?.classList.remove("blurs");
		document.body.classList.remove("no-scroll");
   }
  });
});

// Close TOC on small screens when a link is clicked
document.querySelectorAll("#menu > li > ul a").forEach((link) => {
	link.addEventListener("click", function () {
	  if (isTocScreen) {
		tocList?.classList.remove("open");
		overlay?.classList.remove("blurs");
		document.body.classList.remove("no-scroll");
	  }
	});
  });
  
  // Open/Close sub TOC content on click
  document.querySelectorAll("#menu > li > a").forEach((link) => {
	link.addEventListener("click", function (event) {
	  event.preventDefault(); // stop navigation to submenu
  
	  // Find the closest parent <li>
	  const closestLiParent = link.closest("li");
	  const childUlSubMenu = closestLiParent.children[1];
  
	  // If submenu is already active, remove "active" class (toggle behavior)
	  if (childUlSubMenu?.classList.contains("active")) {
		childUlSubMenu.classList.remove("active");
	  } else {
		// Remove "active" from all other submenus
		document.querySelectorAll("#menu > li > ul").forEach((subMenu) => {
		  subMenu.classList.remove("active");
		});
  
		// Add "active" to the clicked submenu
		childUlSubMenu?.classList.add("active");
	  }
	});
  });
  