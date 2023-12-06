// MOBILE MENU
let toggleMobile = document.getElementById("mobile-logo");
let mobileMenu = document.getElementById("mobile-menu");
let h1 = document.querySelector("h1");
let footer = document.querySelector("footer");

function toggleMobileMenu()
{
  mobileMenu.classList.toggle("open-mobile-menu");
}

let mobileLogo = document.getElementById("mobile-logo");

function toggleBlur() {
  h1.classList.toggle('blur')
  mobileLogo.classList.toggle('blur')
  footer.classList.toggle('blur')
  if (document.getElementById("search-container")) {
    let searchContainer = document.getElementById("search-container");
    searchContainer.classList.toggle('blur')
  }
  if (document.getElementById("main")) {
    let main = document.getElementById("main");
    main.classList.toggle('blur')
  }
  if (document.getElementById("info-box")) {
    let infoBox = document.getElementById("info-box");
    infoBox.classList.toggle('blur')
  }
  if (document.getElementById("img-container-mobile")) {
    let imgContainerMobile = document.getElementById("img-container-mobile");
    imgContainerMobile.classList.toggle('blur')
  }
  
}

toggleMobile.addEventListener('click', () => {
  toggleMobileMenu();
  if (!detectMobile()) {
    toggleBlur();
  }
})

toggleMobile.addEventListener('touchstart', () => {
  if (!detectMobile()) {
    toggleBlur();
  }
})