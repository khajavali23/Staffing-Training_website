
/* ==========================================================
   DZAAAI — COMPLETE MAIN JAVASCRIPT
   Navigation + Premium Website Animations
   Vanilla JavaScript
========================================================== */

(() => {

    "use strict";


    /* ======================================================
       01. INITIALIZATION
    ====================================================== */

    document.documentElement.classList.add("js");

    const ready = callback => {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                callback,
                { once: true }
            );

        } else {

            callback();

        }

    };


    ready(() => {


        /* ==================================================
           02. GLOBAL SETTINGS
        ================================================== */

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const touchDevice = window.matchMedia(
            "(hover: none), (pointer: coarse)"
        ).matches;


        /* ==================================================
           03. MOBILE NAVIGATION
        ================================================== */

        const menuToggle = document.querySelector(".menu-toggle");

        const mainNav = document.querySelector(".main-nav");

        if (menuToggle && mainNav) {

            const menuIcon = menuToggle.querySelector("i");


            const closeMenu = () => {

                mainNav.classList.remove("show");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

                if (menuIcon) {

                    menuIcon.classList.remove("fa-xmark");

                    menuIcon.classList.add("fa-bars");

                }

            };


            const openMenu = () => {

                mainNav.classList.add("show");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Close navigation"
                );

                if (menuIcon) {

                    menuIcon.classList.remove("fa-bars");

                    menuIcon.classList.add("fa-xmark");

                }

            };


            menuToggle.addEventListener("click", () => {

                const isOpen =
                    mainNav.classList.contains("show");

                if (isOpen) {

                    closeMenu();

                } else {

                    openMenu();

                }

            });


            // Close after navigation.
            mainNav.querySelectorAll("a").forEach(link => {

                link.addEventListener("click", closeMenu);

            });


            // Close using Escape.
            document.addEventListener("keydown", event => {

                if (
                    event.key === "Escape" &&
                    mainNav.classList.contains("show")
                ) {

                    closeMenu();

                    menuToggle.focus();

                }

            });


            // Close when clicking outside.
            document.addEventListener("click", event => {

                if (
                    mainNav.classList.contains("show") &&
                    !mainNav.contains(event.target) &&
                    !menuToggle.contains(event.target)
                ) {

                    closeMenu();

                }

            });


            // Close if the screen becomes desktop-sized.
            const desktopQuery = window.matchMedia(
                "(min-width: 851px)"
            );

            desktopQuery.addEventListener("change", event => {

                if (event.matches) {

                    closeMenu();

                }

            });

        }


        /* ==================================================
           04. STICKY NAVBAR
        ================================================== */

        const header = document.querySelector(".site-header");

        if (header) {

            let scrollTicking = false;

            const updateHeader = () => {

                header.classList.toggle(
                    "is-scrolled",
                    window.scrollY > 40
                );

                scrollTicking = false;

            };


            window.addEventListener("scroll", () => {

                if (!scrollTicking) {

                    requestAnimationFrame(updateHeader);

                    scrollTicking = true;

                }

            }, { passive: true });


            updateHeader();

        }


        /* ==================================================
           05. REDUCED MOTION
        ================================================== */

        if (reducedMotion) {

            document.querySelectorAll(
                "[data-reveal], [data-stagger]"
            ).forEach(element => {

                element.classList.add("is-visible");

            });

            return;

        }


        /* ==================================================
           06. INTERSECTION OBSERVER
        ================================================== */

        const revealElements = document.querySelectorAll(
            "[data-reveal], [data-stagger]"
        );


        if ("IntersectionObserver" in window) {

            const revealObserver = new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {

                            return;

                        }

                        entry.target.classList.add("is-visible");

                        // Each element animates only once.
                        observer.unobserve(entry.target);

                    });

                },

                {

                    threshold: 0.12,

                    rootMargin: "0px 0px -45px 0px"

                }

            );


            revealElements.forEach(element => {

                revealObserver.observe(element);

            });


            // Support dynamically inserted content.
            window.DZAAAIAnimations = {

                observe(root = document) {

                    root.querySelectorAll(
                        "[data-reveal], [data-stagger]"
                    ).forEach(element => {

                        if (
                            !element.classList.contains("is-visible")
                        ) {

                            revealObserver.observe(element);

                        }

                    });

                }

            };


        } else {

            // Fallback for older browsers.
            revealElements.forEach(element => {

                element.classList.add("is-visible");

            });

        }


        /* ==================================================
           07. HERO IMAGE LOAD
        ================================================== */

        const heroImage = document.querySelector(
            ".hero-student-image"
        );

        if (heroImage) {

            const revealImage = () => {

                heroImage.classList.add("image-loaded");

            };


            if (heroImage.complete) {

                revealImage();

            } else {

                heroImage.addEventListener(
                    "load",
                    revealImage,
                    { once: true }
                );

                heroImage.addEventListener(
                    "error",
                    () => {

                        console.warn(
                            "DZAAAI: Hero image could not be loaded."
                        );

                    },
                    { once: true }
                );

            }

        }


        /* ==================================================
           08. DECORATIVE PARALLAX
        ================================================== */

        const decorations = document.querySelectorAll(
            ".hero-decoration[data-parallax]"
        );


        if (!touchDevice && decorations.length) {

            let pointerFrame = null;

            let pointerX = 0;

            let pointerY = 0;


            document.addEventListener("pointermove", event => {

                pointerX = (
                    event.clientX / window.innerWidth - 0.5
                ) * 2;

                pointerY = (
                    event.clientY / window.innerHeight - 0.5
                ) * 2;


                if (pointerFrame !== null) {

                    return;

                }


                pointerFrame = requestAnimationFrame(() => {

                    decorations.forEach(element => {

                        const strength = Math.min(

                            Math.max(

                                Number(element.dataset.parallax) || 5,

                                0

                            ),

                            15

                        );


                        element.style.setProperty(

                            "--parallax-x",

                            `${pointerX * strength}px`

                        );


                        element.style.setProperty(

                            "--parallax-y",

                            `${pointerY * strength}px`

                        );

                    });


                    pointerFrame = null;

                });

            }, { passive: true });


            // Reset decorative positions when pointer leaves.
            document.addEventListener("pointerleave", () => {

                decorations.forEach(element => {

                    element.style.setProperty(
                        "--parallax-x",
                        "0px"
                    );

                    element.style.setProperty(
                        "--parallax-y",
                        "0px"
                    );

                });

            });

        }


        /* ==================================================
           09. SMOOTH ANCHOR NAVIGATION
        ================================================== */

        document.querySelectorAll('a[href^="#"]').forEach(link => {

            link.addEventListener("click", event => {

                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {

                    return;

                }

                const target = document.querySelector(targetId);

                if (!target) {

                    return;

                }

                event.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            });

        });


        /* ==================================================
           10. INITIAL NAVBAR STATE
        ================================================== */

        if (header) {

            header.classList.toggle(
                "is-scrolled",
                window.scrollY > 40
            );

        }


        /* ==================================================
           11. DEBUGGING INFORMATION
        ================================================== */

        console.info(
            "DZAAAI animation system initialized successfully."
        );


    });

})();






