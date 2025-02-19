// It uses `window.matchMedia` instead of `window.addEventListener('resize')` because `matchMedia` performs better by not changing its value with every screen resize.
const mobileScreen = window.matchMedia("(max-width: 1110px)");
let isSmallScreen = mobileScreen?.matches;

mobileScreen?.addEventListener("change", (event) => {
	isSmallScreen = event.matches

  if (!isSmallScreen) {
		document.body.classList.remove("no-scroll")
	}
});

// Desktop Menu

const itemsMenu = document.querySelectorAll(".submenu");
const navDrawers = document.querySelectorAll('#navmenu > li')
let activeDrawer
// Desktop Menu


for (const el of itemsMenu) {
	el.addEventListener("click", () => {
		if (isSmallScreen || 'ontouchstart' in document.documentElement) {
      // if none set page is set by markup logic on load
      if (!activeDrawer) {
        // remove default active link
        removeAllActiveDrawer(navDrawers)
        // set new active drawer to clicked
        activeDrawer = el
		// add active class
		addActiveToDrawer(el)
      } else if (activeDrawer.id !== el.id) {
        activeDrawer.querySelector('a').classList.remove('active')
        addActiveToDrawer(el)
        activeDrawer = el
      }

			for (const item of itemsMenu) {
        // close any open drawers on click next drawer
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
// Mobile Menu

const linkItemsMenu = document.querySelectorAll(".submenu > a");
const menu = document.querySelector("#navmenu");
const overlay = document.querySelector("#overlay");

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

document.querySelector("#nav-button")?.addEventListener("click", () => {
	menu?.classList.toggle("opens");
	overlay?.classList.toggle("blurs");
	document.body.classList.toggle("no-scroll")
});

// close mobile menu
overlay?.addEventListener("click", () => {
	menu?.classList.remove("opens");
	overlay?.classList.remove("blurs");
	document.body.classList.remove("no-scroll")
});

// hilight the menu item of the current page
document
	.querySelector(`.submenu-content a[href="{document.location.pathname}"]`)
	?.classList.add("current");

function removeAllActiveDrawer(navDrawers) {
  for (const item of navDrawers) {
    item.querySelector('a').classList.remove('active')
  }
}
function addActiveToDrawer(drawer) {
	drawer.querySelector('a').classList.add('active')
}
