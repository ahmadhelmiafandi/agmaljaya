import { useEffect } from 'react';

/**
 * Hook to trigger scroll reveal animations.
 * It finds all elements with the 'reveal' class and adds 'active' when they enter the viewport.
 */
export const useScrollReveal = (): void => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const observeElements = () => {
            const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            reveals.forEach(el => observer.observe(el));
        };

        // Initial observation
        observeElements();

        // Watch for DOM changes to catch elements loaded from API
        const mutationObserver = new MutationObserver(() => {
            observeElements();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
};
