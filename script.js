document.addEventListener('DOMContentLoaded', () => {

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-header').forEach(el => revealObserver.observe(el));

    document.querySelectorAll('.tile-wrapper').forEach(el => revealObserver.observe(el));

    document.querySelectorAll('.current-item').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
        revealObserver.observe(el);
    });

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', (e) => {

            if (e.target.closest('.accordion-link-icon')) return;

            const item = header.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const icon = header.querySelector('.accordion-icon');
            const isOpen = header.getAttribute('aria-expanded') === 'true';

            if (isOpen) {

                content.style.height = content.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    content.style.height = '0';
                });
                header.setAttribute('aria-expanded', 'false');
                icon.classList.remove('rotated');
            } else {

                const container = item.closest('.accordion-container');
                container.querySelectorAll('.accordion-item').forEach(other => {
                    if (other !== item) {
                        const otherContent = other.querySelector('.accordion-content');
                        const otherIcon = other.querySelector('.accordion-icon');
                        const otherHeader = other.querySelector('.accordion-header');
                        if (otherHeader.getAttribute('aria-expanded') === 'true') {
                            otherContent.style.height = otherContent.scrollHeight + 'px';
                            requestAnimationFrame(() => {
                                otherContent.style.height = '0';
                            });
                            otherHeader.setAttribute('aria-expanded', 'false');
                            otherIcon.classList.remove('rotated');
                        }
                    }
                });

                content.style.height = content.scrollHeight + 'px';
                header.setAttribute('aria-expanded', 'true');
                icon.classList.add('rotated');

                content.addEventListener('transitionend', function handler() {
                    if (header.getAttribute('aria-expanded') === 'true') {
                        content.style.height = 'auto';
                    }
                    content.removeEventListener('transitionend', handler);
                });
            }
        });
    });

    const viewMoreBtn = document.getElementById('view-more-projects');
    let projectsExpanded = false;

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            const extras = document.querySelectorAll('.extra-project');
            projectsExpanded = !projectsExpanded;

            extras.forEach((item, i) => {
                if (projectsExpanded) {
                    item.style.display = '';

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 80);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            viewMoreBtn.innerHTML = projectsExpanded
                ? 'Show Less <i class="fa-solid fa-chevron-up"></i>'
                : 'View More <i class="fa-solid fa-chevron-down"></i>';
        });

        document.querySelectorAll('.extra-project').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);

    let toastTimeout;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const value = btn.dataset.copy;
            if (!value) return;

            if (value === 'resume') {
                const link = document.createElement('a');
                link.href = 'cv.pdf';
                link.download = 'Anzar_Ali_Khan_Resume.pdf';
                link.click();
                showToast('Downloading resume...');
                return;
            }

            try {
                await navigator.clipboard.writeText(value);
                showToast('Copied to clipboard!');

                const icon = btn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                }, 1500);
            } catch (err) {

                const textarea = document.createElement('textarea');
                textarea.value = value;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('Copied to clipboard!');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {

            document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(header => {
                header.click();
            });
        }
    });
});

