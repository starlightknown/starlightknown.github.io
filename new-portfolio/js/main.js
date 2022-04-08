/*---------------------------Navigation Menu---------------------- */

(() => {

    const hamburgerBtn = document.querySelector(".hamburger-btn"),
        navMenu = document.querySelector(".nav-menu"),
        closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu() {
        navMenu.classList.add("open");
        bodyscrollingToggle();

    }

    function hideNavMenu() {
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyscrollingToggle();
    }

    function fadeOutEffect() {
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() => {

            document.querySelector(".fade-out-effect").classList.remove("active");

        }, 300)
    }
    // atteched an event handeler  to document

    document.addEventListener("click", (event) => {

        if (event.target.classList.contains("link-item")) {
            /* make sure event.target.hash has a value before overriding  default behavior */
            if (event.target.hash !== "") {
                /* prevent default anchor behavior*/
                event.preventDefault();

                const hash = event.target.hash;
                // console.log(hash);

                // DeActivate existing  active 'section'

                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");

                // activate new 'section'
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");

                // deActivate existing active navigation menu 'link-item'

                navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active", "inner-shadow");
                /* If clicked 'link-item' is contained within the navigation menu */
                if (navMenu.classList.contains("open")) {
                    // activate new navigation menu 'link-item'
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");

                    //hide navigation menu 
                    hideNavMenu();
                    
                }
                else{
                   let navItems = navMenu.querySelectorAll(".link-item");
                   navItems.forEach((item)=>{
                       if(hash === item.hash){

                           //activate  new navigation menu 'limk-item'
                           item.classList.add("active", "inner-shadow");
                           item.classList.remove("outer-shadow", "hover-in-shadow");


                       }
                   })
                   fadeOutEffect();
                }
                //add hash(#) to URL
                window.location.hash = hash;


            }

        }

    })

})();

/* -------------------- about section tabs-----------------------*/
(() => {

    const aboutSection = document.querySelector(".about-section"),
        tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) => {
        /*  if event.target contain 'tab-item' class and not contain
         'active' class */

        if (event.target.classList.contains("tabs-item") &&
            !event.target.classList.contains("active")) {

            const target = event.target.getAttribute("data-target");
            // dectivate existing active ' tab-items

            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");

            //active new tabs-item
            event.target.classList.add("active", "outer-shadow");

            //deactivate existing tab-contain

            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            // activate new tab-container
            aboutSection.querySelector(target).classList.add("active");

        }

    })

})();

function bodyscrollingToggle() {
    document.body.classList.toggle("hidden-scrolling");
}

/* -------------------Portfolio filter and pop up ----------------*/

(() => {
    const filterContainer = document.querySelector(".portfolio-filter"),
        portfolioItemsContainer = document.querySelector(".portfolio-items"),
        portfolioItems = document.querySelectorAll(".portfolio-item"),
        popup = document.querySelector(".portfolio-popup"),
        prevBtn = popup.querySelector(".pp-prev"),
        nextBtn = popup.querySelector(".pp-next"),
        closeBtn = popup.querySelector(".pp-close"),
        projectDetailsContainer = popup.querySelector(".pp-details "),
        projectDetailsBtn = popup.querySelector(".pp-project-details-btn");

    let itemIndex, slideIndex, screenshots;

    /*--------------------------------Filter Portfolio Items-------------------------------------*/


    filterContainer.addEventListener("click", (event) => {

        if (event.target.classList.contains("filter-item") && !event.target.classList.contains("active")) {

            // deactivate existing active 'filter item'
            filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");

            // activate new filter-item
            event.target.classList.add("active", "outer-shadow");
            const target = event.target.getAttribute("data-target");
            console.log(target);
            portfolioItems.forEach((item) => {
                // console.log(item.getAttribute("data-category"));
                if (target === item.getAttribute("data-category") || target === 'all') {
                    item.classList.remove("hide");
                    item.classList.add("show");
                } else {
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event) => {
        // console.log(event.target.closest(".portfolio-item-inner"));

        if (event.target.closest(".portfolio-item-inner")) {
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
            // console.log(portfolioItem);
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            // console.log(itemIndex);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screnshots");

            // conver screenshots into array
            screenshots = screenshots.split(",");
            if (screenshots.length === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";

            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block"
            }
            // console.log(screenshots);
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })
    closeBtn.addEventListener("click", () => {
        popupToggle();
        if (projectDetailsContainer.classList.contains("active")) {

            popupDetailsToggle();
        }

    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyscrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        // console.log(imgSrc);
        const popupImg = popup.querySelector(".pp-img");
        /* Activate loader until the popup Image loaded */
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () => {
            // deactivate loader after popupImg images
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
    }
    //Next slide
    nextBtn.addEventListener("click", () => {
            if (slideIndex === screenshots.length - 1) {
                slideIndex = 0;

            } else {
                slideIndex++;
            }
            popupSlideshow();
            // console.log("slidIndex:" + slideIndex);

        })
        //prev slide 
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1;

        } else {
            slideIndex--;
        }
        popupSlideshow();
        // console.log("slidIndex:" + slideIndex);

    })

    function popupDetails() {
        // portfolio-item-details is not exists
        if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
            projectDetailsBtn.style.display = "none";
            return /* end function execustion*/
        }
        projectDetailsBtn.style.display = "block";
        // get the project Details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        // set the roject details
        popup.querySelector(".pp-project-details").innerHTML = details;
        //get the project title 
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        //set the project title
        popup.querySelector(".pp-title h2").innerHTML = title;
        //get the project category 
        const category = portfolioItems[itemIndex].getAttribute("data-category");
        // console.log(category);
        // set the project category
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");



    }
    projectDetailsBtn.addEventListener("click", () => {
        popupDetailsToggle();

    })

    function popupDetailsToggle() {

        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");

            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";

        } else {
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }

    }

})();


/*-----------------------------Testimonial SLider-------------------------------------------*/

(() => {

    const sliderContainer = document.querySelector(".testi-slider-container"),
        slides = sliderContainer.querySelectorAll(".testi-item"),
        slideWidth = sliderContainer.offsetWidth,
        activeSlide = sliderContainer.querySelector(".testi-item.active"),
        prevBtn = document.querySelector(".testi-slider-nav .prev"),
        nextBtn = document.querySelector(".testi-slider-nav .next");
    // console.log(slides);
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);
    // console.log(slideIndex);
    // set wisdth of all sildes

    slides.forEach((slide) => {
            // console.log(slides);
            slide.style.width = slideWidth + "px";
        })
        // set width of slideContainer 

    sliderContainer.style.width = slideWidth * slides.length + "px";
    nextBtn.addEventListener("click", () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        slider();
    })
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex.length - 1;
        } else {
            slideIndex--;
        }
        slider();
    })

    function slider() {
        // Deactivating existing  slides
        sliderContainer.querySelector(".testi-item.active").classList.remove("active");
        // Activate new slide
        slides[slideIndex].classList.add("active");
        sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + "px";
    }
    slider();

})();

/*-------------------------hide all sections except active------------------------------------ */


(() => {

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        if (!section.classList.contains("active")) {
            section.classList.add("hide");

        }
    })



})();