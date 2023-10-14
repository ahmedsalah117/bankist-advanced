'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('header');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('nav');
const logoImg = document.querySelector('.nav__logo');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
header.prepend(message); // prepend will insert it as the first child of the header.
// header.append(message); // append will insert it as the last child of the header.

//please note that this message element is unique therefore the append will override the prepend here as the unique element cannot exist in two places at the same time in the dom. It is like no human can exist in two places at the same moment , but you can clone it if needed.

// header.append(message.cloneNode(true)); //setting it to true means that it would include all child nodes

// Btn scrolling to section 1
btnScroll.addEventListener('click', e => {
  const section1Coords = section1.getBoundingClientRect(); // This provides the coordinates of the selected element with respect to the top & side of the viewport itself not the top of the html page.
  // console.log(section1Coords);

  // // printing the scroll location.
  // console.log(window.scrollX, window.scrollY); // This is the distance from the top of the html page itself to where the scroll is .

  // scrolling the window
  // window.scrollTo({
  //   left: window.scrollX + section1Coords.x,

  //   top: window.scrollY + section1Coords.y,
  //   behavior: 'smooth',
  // });

  // There is a new easier method for handling the scrolling which is....

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Nav scrolling. (implementing event delegation)

document.querySelector('.nav__links').addEventListener('click', e => {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    const targetedSection = document.querySelector(id);
    //scrolling to the section.....
    targetedSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// Nav menu navigation......

function hoverHandler(e) {
  const link = e.target;
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');

  siblings.forEach(ele => {
    if (ele !== link) {
      ele.style.opacity = this;
    }
  });

  logoImg.style.opacity = this;
}
nav.addEventListener('mouseover', hoverHandler.bind(0.5));

nav.addEventListener('mouseout', hoverHandler.bind(1));

//Sticky navigation......

// const sec1coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', () => {
//   if (window.scrollY > sec1coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Doing the sticky navigation in a better way.....
// This is way better when it comes to performance than the scroll event which fires with every single little scroll.
const navHeight = nav.getBoundingClientRect().height;

function headerObs(entries, observer) {
  // console.log(entries);
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const observer = new IntersectionObserver(headerObs, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});

observer.observe(header);

// Revealing Sections....

const allSections = document.querySelectorAll('.section');

function sectionReveal(entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const secObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.15,
});

// Turning the observer on and hiding the sections once the page is loaded for the first time.
allSections.forEach(sec => {
  secObserver.observe(sec);
  sec.classList.add('section--hidden');
});

// Images lazy-loading.......

const lazyLoadedImgs = document.querySelectorAll('img[data-src]');

function loading(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  // rootMargin: '200px',
});

lazyLoadedImgs.forEach(img => imgObserver.observe(img));

//Implementing  the slider...

function slide() {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dots = document.querySelector('.dots');
  let currSlide = 0;
  const maxSlide = slides.length;

  //functions....
  function createDots() {
    slides.forEach((_, i) => {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
      );
    });
  }

  function activateDots(slide) {
    dots
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    dots
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  function init() {
    createDots();
    goToSlide(0);
    activateDots(0);
  }
  init();

  function nextSlide() {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDots(currSlide);
  }

  function prevSlide() {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activateDots(currSlide);
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = ` translateX(${100 * (i - slide)}%)`;
    });
  }

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
}
slide();

// Important Events.....

document.addEventListener('DOMContentLoaded', e => {
  // console.log(
  //   e,
  //   'this is only loaded after the html is parsed and the JS code is fully loaded and the DOM tree is built. This event does not wait for images or outer resources to load'
  // );
});

window.addEventListener('load', e => {
  // console.log(
  //   e,
  //   'This is loaded after everything is loaded including the images and outer resources '
  // );
});

window.addEventListener('beforeunload', e => {
  // Some browsers require you to use the preventDefault method in order for this event to fire
  e.preventDefault();
  // console.log(
  //   e,
  //   'This one is fired right before the page is removed or the user leaving the window. You can use it to ask the user if they really want to leave the page.'
  // );

  e.returnValue = ''; //This will prompt a message asking the user if they really want to leave the page. In the past, You had the option to put your own message, but due to abusive developers, This is not an option anymore and the browser adds a default message that cannot be changed. YOU HAVE TO LEAVE IT AS AN EMPTY STRING
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// Lecture explanation & experimentation
//Styles

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.width); // This only gets the inline styles as the style property only sets inline styles.

// //if you wanna get all the styles of an element , you use the getComputedStyle() fn.

// console.log(getComputedStyle(message).height); //It returns the value as a string

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// // controlling the values of the css variables... "we usually define them in the root element"

// const root = document.documentElement;
// root.style.setProperty('--color-primary', 'orangered');
// const navLogo = document.querySelector('.nav__logo');
// console.log(navLogo.dataset.designerName);

// navLogo.classList.add('a');
// navLogo.classList.remove('a');
// navLogo.classList.toggle('a');
// navLogo.classList.contains('a');

// // DONOT USE this one as it will override all existing classes with the current one you entered here.
// navLogo.className = 'a';

// Smooth scroll

//Handling events

// const h1 = document.querySelector('h1');

// function alertH1() {
//   alert('Thank you for reading !');
//   h1.removeEventListener('mouseenter', alertH1);
//   // Or you can use a setTimeOut to remove the event
// }

// h1.addEventListener('mouseenter', alertH1); // The mouseenter is almost the hover event . It basically means that the mouse as enterd the element.

// The old way of listening to an event was ....

// h1.onmouseenter = function(){

// }

// Event Propagation ( capturing phase - target phase - bubbling phase).

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1 + min);

// const randomColor = () => {
//   return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)} ,${randomInt(
//     0,
//     255
//   )})`;
// };

// document.querySelector('.nav__link').addEventListener('click', e => {
//   console.log('Link', e.target, e.currentTarget);

//   // e.stopPropagation();
//   e.currentTarget.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener(
//   'click',
//   e => {
//     console.log('NavLinks', e.target, e.currentTarget);
//     e.currentTarget.style.backgroundColor = randomColor();
//   },
//   true
// );
// document.querySelector('.nav').addEventListener(
//   'click',
//   e => {
//     console.log('Nav', e.target, e.currentTarget);

//     e.currentTarget.style.backgroundColor = randomColor();
//   },
//   true
// );

// If you set the 3rd argument to true this means that you allow the events to be listened to during the capture phase instead of the bubbling phase , which means that the event will be fired on the parent elements before the child elements

// DOM Traversing.....

const h1 = document.querySelector('h1');

// Going downwards: child....

// console.log(h1.querySelectorAll('.highlight'));
// // Query selector also works on any element and in that example it is selecting all the children that has the class "highlight" no matter how deep they are.
// console.log(h1.childNodes); //this selects all the direct child nodes " all node types"
// // console.log(h1.children); //this selects all the direct children elements of the h1 element.
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// Going upwords: parents.

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('header').style.background = 'var(--gradient-secondary)'; // This selects the closest parent to the h1 element. Note: its like the querySelector ,so you use the same as css selectors.

//Please note that for querySelector .. it selects the children of an element no matter how deep they are. Here also the closest method selects the parents of an element no matter how deep or close they are.

// h1.closest('h1').style.background = 'green'; // This will select the same element.

// Going Sideways....: Siblings

// console.log(h1.previousElementSibling); // This returns an element "tag"
// console.log(h1.nextElementSibling); // This returns an element "tag"
// console.log(h1.previousSibling); // This is a node .
// console.log(h1.nextSibling); // This is a node .

// if you want to select all the siblings in one selection , so you will have to go upward to the parent and then select the children.

// const kids = h1.parentElement.children;

// [...kids].forEach(ele => {
//   if (ele !== h1) ele.style.transform = 'scale(1.5)';
// });

// performing the tabbed component....

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // operations__tab--active
  if (!clicked) return;
  //Activating the tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activating the content.
  const contentNumber = clicked.dataset.tab; // Accessing the data-tab attribute which we used to know which content number to show.
  tabContents.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${contentNumber}`)
    .classList.add('operations__content--active');
});
