
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







/* ==========================================
   DZAAAI — WORLD SELECTION ANIMATIONS
   GSAP + ScrollTrigger
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector("#dzWorlds");

    if (!section) return;

    const cards = section.querySelectorAll(".dz-world");
    const heading = section.querySelector(".dz-worlds-top");
    const signature = section.querySelector(".dz-worlds-signature");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Basic fallback if GSAP is unavailable
    if (typeof gsap === "undefined" || reducedMotion) {
        section.classList.add("dz-worlds-ready");
        return;
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ----------------------------------
       1. INITIAL STATES
    ---------------------------------- */

    gsap.set(heading.children, {
        opacity: 0,
        y: 35
    });

    gsap.set(cards, {
        opacity: 0,
        y: 75,
        scale: 0.96
    });

    gsap.set(signature, {
        opacity: 0,
        y: 20
    });

    /* ----------------------------------
       2. HEADING REVEAL
    ---------------------------------- */

    const intro = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true
        }
    });

    intro.to(heading.children, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power3.out"
    });

    /* ----------------------------------
       3. CINEMATIC CARD REVEAL
    ---------------------------------- */

    gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.25,
        stagger: 0.25,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".dz-worlds-grid",
            start: "top 82%",
            once: true
        },
        onComplete: () => {
            cards.forEach(card => {
                card.classList.add("dz-card-revealed");
            });
        }
    });

    /* ----------------------------------
       4. SIGNATURE REVEAL
    ---------------------------------- */

    gsap.to(signature, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: signature,
            start: "top 95%",
            once: true
        }
    });

    /* ----------------------------------
       5. GOLD GLOW ANIMATION
    ---------------------------------- */

    cards.forEach((card, index) => {

        const glow = card.querySelector(".dz-world-glow");

        if (!glow) return;

        gsap.to(glow, {
            x: index === 0 ? 35 : -35,
            y: 25,
            duration: 4 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    });

    /* ----------------------------------
       6. CARD HOVER + IMAGE PARALLAX
    ---------------------------------- */

    const desktop = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (desktop) {

        cards.forEach(card => {

            const image = card.querySelector(".dz-world-image");
            const content = card.querySelector(".dz-world-content");
            const action = card.querySelector(".dz-world-action");

            card.addEventListener("mousemove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 2.5;
                const rotateX = ((centerY - y) / centerY) * 2.5;

                gsap.to(card, {
                    rotateX,
                    rotateY,
                    duration: 0.5,
                    ease: "power2.out",
                    transformPerspective: 1200
                });

                gsap.to(image, {
                    x: ((x - centerX) / centerX) * -12,
                    y: ((y - centerY) / centerY) * -10,
                    duration: 0.7,
                    ease: "power2.out"
                });

                gsap.to(content, {
                    x: ((x - centerX) / centerX) * 5,
                    y: ((y - centerY) / centerY) * 3,
                    duration: 0.6,
                    ease: "power2.out"
                });

            });

            card.addEventListener("mouseleave", () => {

                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });

                gsap.to(image, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });

                gsap.to(content, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });

            });

            /* Magnetic CTA */

            card.addEventListener("mousemove", event => {

                if (!action) return;

                const rect = action.getBoundingClientRect();

                const dx = event.clientX - (rect.left + rect.width / 2);
                const dy = event.clientY - (rect.top + rect.height / 2);

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    gsap.to(action, {
                        x: dx * 0.10,
                        y: dy * 0.10,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    gsap.to(action, {
                        x: 0,
                        y: 0,
                        duration: 0.4
                    });
                }

            });

            card.addEventListener("mouseleave", () => {
                gsap.to(action, {
                    x: 0,
                    y: 0,
                    duration: 0.4
                });
            });

        });

    }

    /* ----------------------------------
       7. SMOOTH SIGNATURE LIGHT EFFECT
    ---------------------------------- */

    gsap.to(".dz-signature-dot", {
        opacity: 0.35,
        scale: 0.7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut"
    });

    /* ----------------------------------
       8. REFRESH SCROLL TRIGGER
    ---------------------------------- */

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }

});
