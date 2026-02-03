export function initScrollToTop() {
    const scrollToTopButton = document.getElementById("scroll-to-top-button");
    if (!scrollToTopButton) return;

    const updateVisibility = () => {
        const y = window.scrollY;
        if (y > 0) {
            scrollToTopButton.className = "visible";
        } else {
            scrollToTopButton.className = "hidden";
        }
    };

    window.addEventListener("scroll", updateVisibility);
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    updateVisibility();
}
