import Lenis from 'lenis';
import './style.css'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

document.addEventListener("DOMContentLoaded", () => {

    const mobileNavContainer = document.querySelector(".mobile-header-container") as HTMLDivElement
    const mobileNav = document.querySelector(".mobile-nav") as HTMLElement;
    const menuBar =  document.querySelector(".menu-button") as HTMLDivElement;

    

    menuBar.addEventListener("click", () => {
        if (menuBar.getAttribute("aria-expanded") == "false") { 
            openMenu();
        }else {
            closeMenu();
        }
        
    })

   


    // Initialize a new Lenis instance for smooth scrolling
    const lenis = new Lenis();

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    window.addEventListener("resize", () => {
        if (Math.floor(window.innerWidth) > 500 && (menuBar.getAttribute("aria-expanded") == "true")) {
            closeMenu();
        } 
    })

    let previousScrollY = 0;
    let intervalId: number;

    window.addEventListener("scroll", () => {
        const body = document.body;
        clearInterval(intervalId);

        if (window.scrollY === 0) {
            if (body.classList.contains("page-up")) {
                body.classList.remove("page-up");
            }

            return;
        }

        if (previousScrollY > window.scrollY) {
            if (!body.classList.contains("page-up")) {
                body.classList.add("page-up");
            }

            if (body.classList.contains("page-down")) {
                document.body.classList.remove("page-down");
            }
        } else {
            if (!body.classList.contains("page-down")) {
                body.classList.add("page-down");
            }

            if (body.classList.contains("page-up")) {
                document.body.classList.remove("page-up");
            }
        }

        previousScrollY = window.scrollY;
        intervalId = removeNavOnInterval(3000);
    })


    function removeNavOnInterval(interval: number): number {
        return setTimeout(() => {
            document.body.classList.add("page-down");
            document.body.classList.remove("page-up");
        }, interval);
    }

    function openMenu(): void {
            menuBar.setAttribute("aria-expanded", "true");
            mobileNav.setAttribute("inert", "");
            document.body.classList.remove("page-down");
            document.body.classList.remove("page-up");
            clearInterval(intervalId);

            gsap
            .to(mobileNavContainer, {
                x: 0,
                onStart: () => {
                    mobileNavContainer.style.visibility = "visible";
                    menuBar.setAttribute("inert", "");
                    lenis.stop();
                },
                onComplete: () => {
                    menuBar.removeAttribute("inert")
                },
            })


    }

    function closeMenu(): void {      
        menuBar.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("inert", ""); 
        document.body.classList.add("page-up");
        removeNavOnInterval(3000);
    
        gsap
        .to(mobileNavContainer, {
            x: "100%",
            onStart: () => {
                menuBar.setAttribute("inert", "");
                lenis.start();
            },
            onComplete: () => {
                mobileNavContainer.style.visibility = "hidden";
                menuBar.removeAttribute("inert");
            },
        })
    }

    
})


window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);

    if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        animatePage();
    }

   


    function animatePage(): void {
        gsap.from(".client", {
            opacity: 0,
            yPercent: 100,
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".client-gallery",
                start: "top 60%",
                end: "bottom 60%",
                scrub: true,
            }
        })



        const aboutUsIllustrations = gsap.utils.toArray<HTMLElement>(".illustration-container");

        aboutUsIllustrations.forEach(container => {
            const img = container.querySelector("img");
            gsap.from(img, {
                opacity: 0,
                scrollTrigger: {
                    trigger: container,
                    start: "top 40%",
                },
                duration: 0.5,
                ease: "power3.inOut"
            })
        })

        gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonial-content",
                start: "top 60%",
            }
        })
        .addLabel("start", 0)
            .from(".testimonial-content h2", {
                opacity: 0,
                duration: 0.5,
            })
            .from(".testimonial-content p", {
                opacity: 0,
            }, "start+=0.2")


        gsap.utils.toArray<HTMLElement>(".testimonial").forEach(container => {
            gsap.from(container, {
                opacity: 0,
                yPercent: 100,
                scrollTrigger: {
                    trigger: container,
                    start: "top+=20 70%",
                }
            })
        })


    }



})