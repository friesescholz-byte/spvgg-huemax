/* ==========================================================================
   SpVgg Hüddessum/Machtsum e.V. von 1920 - Core JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scrolled State
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Mobile Menu Toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu on document click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // 3. Mobile Dropdown Toggle (Accordion style for mobile layout)
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (link && dropdown) {
            link.addEventListener('click', (e) => {
                // Only toggle dropdown on mobile views
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isAlreadyActive = item.classList.contains('active-dropdown');
                    
                    // Close all other dropdowns
                    navItems.forEach(otherItem => {
                        otherItem.classList.remove('active-dropdown');
                    });
                    
                    if (!isAlreadyActive) {
                        item.classList.add('active-dropdown');
                    }
                }
            });
        }
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealItems = document.querySelectorAll('.reveal-item');
    
    if ('IntersectionObserver' in window && revealItems.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    } else {
        // Fallback if IntersectionObserver is not supported
        revealItems.forEach(item => {
            item.classList.add('revealed');
        });
    }

    // 5. Active Link Highlighting based on current filename
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    
    const menuLinks = document.querySelectorAll('.nav-menu a');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile) {
            const dropdownItem = link.closest('.dropdown-item');
            const parentNavItem = link.closest('.nav-item');
            
        }
    });
    // 6. Interactive Birthday & Anniversary Calendar
    const monthlyEventsContainer = document.getElementById('monthly-events-container');
    const homepageEventsList = document.getElementById('homepage-events-list');

    if (monthlyEventsContainer || homepageEventsList) {
        let currentYear = 2026;
        let currentMonth = 6; // July (0-indexed)

        const monthNames = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];

        let calendarData = [
            { day: 1, month: 0, type: 'birthday', label: 'Marius Thalmann', detail: 'Wurde 22 (Geburtstag)' },
            { day: 1, month: 0, type: 'birthday', label: 'Josef Aue', detail: '75 Jahre Vereinsjubiläum' },
            { day: 1, month: 0, type: 'birthday', label: 'Hermann Brönneke', detail: '75 Jahre Vereinsjubiläum' },
            { day: 3, month: 0, type: 'birthday', label: 'Marlis Brönneke', detail: 'Wurde 79 (Geburtstag)' },
            { day: 3, month: 0, type: 'birthday', label: 'Marlis Hartmann', detail: 'Wurde 71 (Geburtstag)' },
            { day: 3, month: 0, type: 'birthday', label: 'Raoul Sophia Thomas', detail: 'Wurde 21 (Geburtstag)' },
            { day: 8, month: 0, type: 'birthday', label: 'Christopher Missel', detail: 'Wurde 45 (Geburtstag)' },
            { day: 8, month: 0, type: 'birthday', label: 'Melanie Oppermann', detail: 'Wurde 53 (Geburtstag)' },
            { day: 8, month: 0, type: 'birthday', label: 'Siegfried Stasche', detail: 'Wurde 87 (Geburtstag)' },
            { day: 9, month: 0, type: 'birthday', label: 'Hans-Dieter Koge', detail: 'Wurde 60 (Geburtstag)' },
            { day: 9, month: 0, type: 'birthday', label: 'Lotta Schmidt', detail: 'Wurde 11 (Geburtstag)' },
            { day: 9, month: 0, type: 'birthday', label: 'Christian Schuh', detail: 'Wurde 37 (Geburtstag)' },
            { day: 10, month: 0, type: 'birthday', label: 'Jonas Bruns', detail: 'Wurde 19 (Geburtstag)' },
            { day: 10, month: 0, type: 'birthday', label: 'Josephine Hellberg', detail: 'Wurde 28 (Geburtstag)' },
            { day: 10, month: 0, type: 'birthday', label: 'Felix-Henry Zuba', detail: 'Wurde 29 (Geburtstag)' },
            { day: 11, month: 0, type: 'birthday', label: 'Matthias Pretor', detail: 'Wurde 68 (Geburtstag)' },
            { day: 13, month: 0, type: 'birthday', label: 'Charlotte Alpers', detail: 'Wurde 14 (Geburtstag)' },
            { day: 15, month: 0, type: 'birthday', label: 'Johann Friedrich Wawrzoch', detail: 'Wurde 15 (Geburtstag)' },
            { day: 15, month: 0, type: 'birthday', label: 'Phil Pissis', detail: 'Wurde 17 (Geburtstag)' },
            { day: 16, month: 0, type: 'birthday', label: 'Heiko Ernst', detail: 'Wurde 58 (Geburtstag)' },
            { day: 14, month: 1, type: 'birthday', label: 'Frank Müller', detail: 'Wurde 42 (Geburtstag)' },
            { day: 20, month: 1, type: 'birthday', label: 'Christian Hartmann', detail: 'Wurde 36 (Geburtstag)' },
            { day: 5, month: 2, type: 'birthday', label: 'Tim Ostrowski', detail: 'Wurde 29 (Geburtstag)' },
            { day: 18, month: 2, type: 'birthday', label: 'Steven Smout', detail: 'Wurde 33 (Geburtstag)' },
            { day: 12, month: 3, type: 'birthday', label: 'Christopher Köditz', detail: 'Wurde 41 (Geburtstag)' },
            { day: 25, month: 3, type: 'birthday', label: 'Jessica Kiene', detail: 'Wurde 30 (Geburtstag)' },
            { day: 8, month: 4, type: 'birthday', label: 'Marius Hartmann', detail: 'Wurde 31 (Geburtstag)' },
            { day: 30, month: 4, type: 'birthday', label: 'Marten Schildhammer', detail: 'Wurde 35 (Geburtstag)' },
            { day: 15, month: 5, type: 'birthday', label: 'Kevin Bastian', detail: 'Wurde 28 (Geburtstag)' },
            { day: 22, month: 5, type: 'birthday', label: 'Max Dettmar', detail: 'Wurde 32 (Geburtstag)' },
            { day: 21, month: 6, type: 'birthday', label: 'Frank Müller', detail: '10 Jahre Vereinsjubiläum' },
            { day: 15, month: 7, type: 'birthday', label: 'Philipp Metzner', detail: '10 Jahre Vereinsjubiläum' },
            { day: 16, month: 7, type: 'birthday', label: 'Christian Hartmann', detail: '10 Jahre Vereinsjubiläum' },
            { day: 20, month: 7, type: 'birthday', label: 'David Meyerhöfer', detail: '10 Jahre Vereinsjubiläum' },
            { day: 10, month: 8, type: 'birthday', label: 'Marius Thalmann', detail: 'Wurde 23 (Geburtstag)' },
            { day: 5, month: 9, type: 'birthday', label: 'Christopher Köditz', detail: 'Wurde 42 (Geburtstag)' },
            { day: 12, month: 10, type: 'birthday', label: 'Tim Ostrowski', detail: 'Wurde 30 (Geburtstag)' },
            { day: 19, month: 11, type: 'birthday', label: 'Marius Hartmann', detail: 'Wurde 32 (Geburtstag)' }
        ];

        const formatDetail = (detail) => {
            if (!detail) return '';
            let str = detail.trim();
            if (str.startsWith('Wurde ')) {
                str = str.replace(/^Wurde\s+/, '');
            }
            if (/^\d+$/.test(str)) {
                str += ' (Geburtstag)';
            }
            return str;
        };

        const renderBirthdays = () => {
            if (!monthlyEventsContainer) return;
            const monthYearLabel = document.getElementById('month-year-label');
            const searchEl = document.getElementById('calendar-search');
            const searchQuery = searchEl ? searchEl.value.toLowerCase().trim() : '';

            monthlyEventsContainer.innerHTML = '';

            if (searchQuery !== '') {
                // Search mode: across all months
                monthYearLabel.textContent = `Suchergebnisse für "${searchQuery}"`;
                
                const filteredEvents = calendarData.filter(item => {
                    return (item.label || '').toLowerCase().includes(searchQuery);
                }).sort((a, b) => {
                    if (a.month !== b.month) return a.month - b.month;
                    return a.day - b.day;
                });

                if (filteredEvents.length === 0) {
                    monthlyEventsContainer.innerHTML = `
                        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
                            <i class="fas fa-search" style="font-size: 3.5rem; opacity: 0.25; margin-bottom: 1.25rem; display: block; color: var(--primary-color);"></i>
                            <span style="font-weight: 500; font-size: 1.05rem;">Keine passenden Mitglieder gefunden.</span>
                        </div>
                    `;
                    return;
                }

                filteredEvents.forEach(e => {
                    const li = document.createElement('li');
                    li.className = 'birthday-item';
                    
                    const dayString = e.day < 10 ? `0${e.day}` : e.day;
                    const monthString = monthNames[e.month] ? monthNames[e.month].substring(0, 3) : '';
                    const isJubilaeum = (e.detail || '').toLowerCase().includes('jubiläum');
                    const iconClass = isJubilaeum ? 'fas fa-award' : 'fas fa-gift';

                    li.innerHTML = `
                        <div class="birthday-date-badge" style="${isJubilaeum ? 'background-color: rgba(229,179,82,0.15); color: #b8860b;' : ''}">
                            <span class="birthday-date-day" style="${isJubilaeum ? 'color: #b8860b;' : ''}">${dayString}</span>
                            <span class="birthday-date-month">${monthString}</span>
                        </div>
                        <div class="birthday-content">
                            <h4 class="birthday-name">${e.label}</h4>
                            <p class="birthday-desc">${formatDetail(e.detail)}</p>
                        </div>
                        <div class="birthday-icon-wrapper" title="${isJubilaeum ? 'Vereinsjubiläum' : 'Geburtstag'}">
                            <i class="${iconClass}"></i>
                        </div>
                    `;
                    monthlyEventsContainer.appendChild(li);
                });
            } else {
                // Standard mode: show selected month
                monthYearLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;

                const monthlyEvents = calendarData.filter(item => {
                    return item.month === currentMonth;
                }).sort((a, b) => a.day - b.day);

                if (monthlyEvents.length === 0) {
                    monthlyEventsContainer.innerHTML = `
                        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
                            <i class="fas fa-birthday-cake" style="font-size: 3.5rem; opacity: 0.25; margin-bottom: 1.25rem; display: block; color: var(--primary-color);"></i>
                            <span style="font-weight: 500; font-size: 1.05rem;">Keine Geburtstage oder Jubiläen in diesem Monat.</span>
                        </div>
                    `;
                } else {
                    monthlyEvents.forEach(e => {
                        const li = document.createElement('li');
                        li.className = 'birthday-item';
                        
                        const dayString = e.day < 10 ? `0${e.day}` : e.day;
                        const monthString = monthNames[currentMonth].substring(0, 3);
                        const isJubilaeum = (e.detail || '').toLowerCase().includes('jubiläum');
                        const iconClass = isJubilaeum ? 'fas fa-award' : 'fas fa-gift';

                        li.innerHTML = `
                            <div class="birthday-date-badge" style="${isJubilaeum ? 'background-color: rgba(229,179,82,0.15); color: #b8860b;' : ''}">
                                <span class="birthday-date-day" style="${isJubilaeum ? 'color: #b8860b;' : ''}">${dayString}</span>
                                <span class="birthday-date-month">${monthString}</span>
                            </div>
                            <div class="birthday-content">
                                <h4 class="birthday-name">${e.label}</h4>
                                <p class="birthday-desc">${formatDetail(e.detail)}</p>
                            </div>
                            <div class="birthday-icon-wrapper" title="${isJubilaeum ? 'Vereinsjubiläum' : 'Geburtstag'}">
                                <i class="${iconClass}"></i>
                            </div>
                        `;
                        monthlyEventsContainer.appendChild(li);
                    });
                }
            }
        };

        const renderHomepageBirthdays = () => {
            if (!homepageEventsList) return;

            const today = new Date();
            const year = today.getFullYear();

            const mapped = calendarData.map(e => {
                let eventYear = year;
                if (e.month < today.getMonth() || (e.month === today.getMonth() && e.day < today.getDate())) {
                    eventYear = year + 1;
                }
                const targetDate = new Date(eventYear, e.month, e.day);
                return { ...e, targetDate };
            });

            mapped.sort((a, b) => a.targetDate - b.targetDate);
            const next5 = mapped.slice(0, 5);

            homepageEventsList.innerHTML = '';
            const monthsShort = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

            next5.forEach(e => {
                const isJubilaeum = (e.detail || '').toLowerCase().includes('jubiläum');
                const iconClass = isJubilaeum ? 'fas fa-award' : 'fas fa-gift';

                const div = document.createElement('div');
                div.className = 'event-item';
                div.innerHTML = `
                    <div class="event-date" style="background-color: rgba(229, 179, 82, 0.1); color: var(--accent-color);">
                        <span class="event-day" style="color: var(--accent-color); font-weight: 800; display: block; text-align: center; font-size: 1.2rem; line-height: 1.1;">${e.day}</span>
                        <span class="event-month" style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block; text-align: center;">${monthsShort[e.month]}</span>
                    </div>
                    <div class="event-info">
                        <h4 class="event-title" style="font-weight: 700; color: var(--primary-dark); font-size: 1.05rem;">${e.label}</h4>
                        <span class="event-time" style="color: var(--text-muted); font-weight: 500;">
                            <i class="${iconClass}"></i> ${e.detail}
                        </span>
                    </div>
                `;
                homepageEventsList.appendChild(div);
            });
        };

        // Event listeners
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        if (prevMonthBtn && nextMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderBirthdays();
            });

            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderBirthdays();
            });
        }

        const calendarSearchInput = document.getElementById('calendar-search');
        if (calendarSearchInput) {
            calendarSearchInput.addEventListener('input', renderBirthdays);
        }

        // Render initial data immediately
        renderBirthdays();
        renderHomepageBirthdays();

        // Fetch live birthdays from Worker API in the background
        fetch('https://huemax-news-api.friese-scholz.workers.dev/api/birthdays')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    calendarData = data;
                    renderBirthdays();
                    renderHomepageBirthdays();
                }
            })
            .catch(err => {
                console.error('Error fetching live birthdays:', err);
            });
    }
    // Helper to open News Modal
    const openNewsModal = (art) => {
        let overlay = document.getElementById('news-modal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'news-modal';
            overlay.className = 'news-modal-overlay';
            overlay.innerHTML = `
                <div class="news-modal-window">
                    <button class="news-modal-close" aria-label="Schließen"><i class="fas fa-times"></i></button>
                    <div class="news-modal-hero" id="news-modal-hero-container">
                        <img id="news-modal-bg" class="news-modal-hero-bg" src="" alt="">
                        <img id="news-modal-img" class="news-modal-fg" src="" alt="">
                    </div>
                    <div class="news-modal-body">
                        <div class="news-modal-meta">
                            <span id="news-modal-date"></span> | <span id="news-modal-category"></span>
                        </div>
                        <h2 id="news-modal-title" class="news-modal-title"></h2>
                        <div id="news-modal-text" class="news-modal-text"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Close listeners
            overlay.querySelector('.news-modal-close').addEventListener('click', () => {
                overlay.classList.remove('active');
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        }

        // Fill contents
        const heroContainer = overlay.querySelector('#news-modal-hero-container');
        
        // Check if there are multiple images for a slider
        if (art.images && Array.isArray(art.images) && art.images.length > 1) {
            heroContainer.innerHTML = `
                <div class="news-modal-slider" style="position: relative; width: 100%; height: 100%; overflow: hidden; background-color: #0d0f14;">
                    <img id="news-slider-img" class="news-modal-fg" src="${art.images[0]}" alt="${art.title}" style="width: 100%; height: 100%; object-fit: contain; transition: opacity 0.25s ease;">
                    
                    <!-- Subtle navigation arrows -->
                    <button class="slider-btn prev-btn" aria-label="Vorheriges Bild" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: none; width: 44px; height: 44px; border-radius: 50%; color: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s; opacity: 0.8; z-index: 10; font-size: 1.1rem;"><i class="fas fa-chevron-left"></i></button>
                    <button class="slider-btn next-btn" aria-label="Nächstes Bild" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: none; width: 44px; height: 44px; border-radius: 50%; color: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s; opacity: 0.8; z-index: 10; font-size: 1.1rem;"><i class="fas fa-chevron-right"></i></button>
                    
                    <!-- Slide indicators / dots -->
                    <div class="slider-dots" style="position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; z-index: 10;">
                        ${art.images.map((_, idx) => `
                            <span class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" style="width: 8px; height: 8px; border-radius: 50%; background-color: ${idx === 0 ? 'var(--accent-color)' : 'rgba(255,255,255,0.4)'}; cursor: pointer; transition: background-color 0.2s;"></span>
                        `).join('')}
                    </div>
                </div>
            `;

            let activeSlideIndex = 0;
            const sliderImg = heroContainer.querySelector('#news-slider-img');
            const dots = heroContainer.querySelectorAll('.slider-dot');
            
            const updateSlide = (newIndex) => {
                activeSlideIndex = (newIndex + art.images.length) % art.images.length;
                sliderImg.style.opacity = 0;
                setTimeout(() => {
                    sliderImg.src = art.images[activeSlideIndex];
                    sliderImg.style.opacity = 1;
                }, 120);
                
                dots.forEach((dot, idx) => {
                    dot.style.backgroundColor = idx === activeSlideIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.4)';
                });
            };

            heroContainer.querySelector('.prev-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                updateSlide(activeSlideIndex - 1);
            });

            heroContainer.querySelector('.next-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                updateSlide(activeSlideIndex + 1);
            });

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(dot.getAttribute('data-index'));
                    updateSlide(idx);
                });
            });

        } else {
            // Static single image layout fallback
            heroContainer.innerHTML = `
                <img id="news-modal-bg" class="news-modal-hero-bg" src="${art.image}" alt="${art.title}">
                <img id="news-modal-img" class="news-modal-fg" src="${art.image}" alt="${art.title}">
            `;

            const modalBg = heroContainer.querySelector('#news-modal-bg');
            const modalImg = heroContainer.querySelector('#news-modal-img');
            const isLogo = art.image.includes('id=1000054') || art.image.includes('id=1000037') || art.image.includes('logo') || art.category.toLowerCase().includes('sponsoring') || art.category.toLowerCase().includes('webdesign') || art.image.startsWith('data:image/svg+xml') || (art.image.startsWith('data:image/') && art.image.length < 50000);
            
            if (isLogo) {
                modalBg.style.display = 'none';
                modalImg.style.padding = '2rem';
                modalImg.style.backgroundColor = '#f8f9fa';
            } else {
                modalBg.style.display = 'block';
                modalImg.style.padding = '0';
                modalImg.style.backgroundColor = 'transparent';
            }
        }

        const parseMarkdown = (text) => {
            if (!text) return '';
            let html = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--primary-color); font-weight: 700; text-decoration: underline;">$1</a>');
            html = html.split('\n').map(line => {
                if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
                    return `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem; list-style-type: disc;">${line.replace(/^[•*]\s*/, '')}</li>`;
                }
                return line;
            }).join('\n');
            return html;
        };

        overlay.querySelector('#news-modal-date').textContent = art.date;
        overlay.querySelector('#news-modal-category').textContent = art.category;
        overlay.querySelector('#news-modal-title').textContent = art.title;
        
        let filesHtml = '';
        if (art.files && Array.isArray(art.files) && art.files.length > 0) {
            filesHtml = `
                <div class="news-modal-attachments" style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <h4 style="color: var(--primary-dark); font-weight: 800; font-size: 1.15rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-paperclip" style="color: var(--accent-color);"></i> Dokumente & Anhänge:</h4>
                    <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.6rem;">
                        ${art.files.map(file => `
                            <li style="display: flex; align-items: center; gap: 0.6rem;">
                                <i class="far fa-file-pdf" style="color: #dc3545; font-size: 1.25rem;"></i>
                                <a href="${file.data}" download="${file.name}" style="color: var(--primary-color); font-weight: 700; text-decoration: underline; font-size: 0.95rem; transition: var(--transition-fast);">${file.name}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        overlay.querySelector('#news-modal-text').innerHTML = parseMarkdown(art.excerpt) + filesHtml;

        // Open modal
        overlay.classList.add('active');
    };

    // 7. Dynamic News Section (aktuelles.html)
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        const defaultArticles = [
            {
                id: 1,
                date: 'August 2025',
                category: 'Vereinsprojekt',
                title: 'August 2025: Anschaffung Materialcontainer',
                excerpt: 'weitere Infos folgen...',
                image: 'news-materialcontainer.jpg'
            },
            {
                id: 2,
                date: 'Februar 2025',
                category: 'Vereinsnews',
                title: 'Februar 2025: Braunkohlwanderung der Spielvereinigung',
                excerpt: '60 Teilnehmer haben viel Spaß bei der Braunkohlwanderung.',
                image: 'news-braunkohl.jpg'
            },
            {
                id: 3,
                date: 'März 2023',
                category: 'Flutlicht',
                title: 'März 2023 - 2026 Projekt Flutlichtanlage',
                excerpt: 'Wir haben uns dazu entschlossen unsere Flutlichtanlage auf LED Technik umzustellen. Bitte nutzt die folgenden Links und Downloads um euch über den aktuellen Projektstatus zu informieren:\n\n• [Projekt Flutlichtanlage aktueller Status (PDF)](pdf/projekt-flutlicht-aktueller-status.pdf)\n• [Projekt Flutlichtanlage NKI Schild (PDF)](pdf/projekt-flutlicht-nki-schild.pdf)\n• [Projekt Flutlichtanlage Förderung durch ZUG (PDF)](pdf/projekt-flutlicht-foerderung-durch-zug.pdf)',
                image: 'news-flutlicht.jpg'
            },
            {
                id: 4,
                date: 'Januar 2023',
                category: 'Ausflug',
                title: 'Januar 2023: Stadionbesuch in Hannover',
                excerpt: 'Mit rund 40 Teilnehmern haben wir das Zweitligaspiel zwischen Hannover 96 und dem 1. FC Kaiserslautern besucht.',
                image: 'news-hannover.jpg'
            }
        ];



        const renderNews = (articlesList) => {
            newsContainer.innerHTML = '';
            if (!articlesList || articlesList.length === 0) {
                newsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">Keine Beiträge vorhanden.</p>';
                return;
            }
            articlesList.forEach(art => {
                const isLogo = art.image.includes('id=1000054') || art.image.includes('id=1000037') || art.image.includes('logo') || art.category.toLowerCase().includes('sponsoring') || art.category.toLowerCase().includes('webdesign');
                const imgStyle = isLogo ? 'style="object-fit: contain; padding: 1.25rem; background-color: #f8f9fa;"' : '';

                const card = document.createElement('div');
                card.className = 'news-card reveal-item revealed';
                card.innerHTML = `
                    <div class="news-img" style="background-color: #f8f9fa;">
                        <img src="${art.image}" alt="${art.title}" ${imgStyle}>
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span><i class="far fa-calendar-alt"></i> ${art.date}</span>
                            <span><i class="far fa-user"></i> ${art.category}</span>
                        </div>
                        <h3 class="news-title">${art.title}</h3>
                        <p class="news-excerpt">${art.excerpt}</p>
                        <a href="#" data-id="${art.id}" class="btn-text-premium" style="padding-left: 0; align-self: flex-start;">Weiterlesen <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                newsContainer.appendChild(card);
            });

            // Set up click delegator for modal open
            newsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-text-premium');
                if (btn) {
                    e.preventDefault();
                    const id = parseInt(btn.getAttribute('data-id'));
                    const art = articlesList.find(a => a.id === id);
                    if (art) {
                        openNewsModal(art);
                    }
                }
            });
        };

        // Render default news immediately on load for instant feel
        renderNews(defaultArticles);

        // Fetch live news asynchronously from Cloudflare Worker API in the background
        fetch('https://huemax-news-api.friese-scholz.workers.dev/api/news')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    renderNews(data); // Refresh with live database entries
                }
            })
            .catch(err => {
                console.error('Error fetching live news:', err);
            });
    }

    // 8. Homepage Dynamic News (index.html)
    const homepageNewsContainer = document.getElementById('homepage-news-container');
    if (homepageNewsContainer) {
        const defaultArticles = [
            {
                id: 1,
                date: 'August 2025',
                category: 'Vereinsprojekt',
                title: 'August 2025: Anschaffung Materialcontainer',
                excerpt: 'weitere Infos folgen...',
                image: 'news-materialcontainer.jpg'
            },
            {
                id: 2,
                date: 'Februar 2025',
                category: 'Vereinsnews',
                title: 'Februar 2025: Braunkohlwanderung der Spielvereinigung',
                excerpt: '60 Teilnehmer haben viel Spaß bei der Braunkohlwanderung.',
                image: 'news-braunkohl.jpg'
            },
            {
                id: 3,
                date: 'März 2023',
                category: 'Flutlicht',
                title: 'März 2023 - 2026 Projekt Flutlichtanlage',
                excerpt: 'Wir haben uns dazu entschlossen unsere Flutlichtanlage auf LED Technik umzustellen. Bitte nutzt die folgenden Links und Downloads um euch über den aktuellen Projektstatus zu informieren:\n\n• [Projekt Flutlichtanlage aktueller Status (PDF)](pdf/projekt-flutlicht-aktueller-status.pdf)\n• [Projekt Flutlichtanlage NKI Schild (PDF)](pdf/projekt-flutlicht-nki-schild.pdf)\n• [Projekt Flutlichtanlage Förderung durch ZUG (PDF)](pdf/projekt-flutlicht-foerderung-durch-zug.pdf)',
                image: 'news-flutlicht.jpg'
            },
            {
                id: 4,
                date: 'Januar 2023',
                category: 'Ausflug',
                title: 'Januar 2023: Stadionbesuch in Hannover',
                excerpt: 'Mit rund 40 Teilnehmern haben wir das Zweitligaspiel zwischen Hannover 96 und dem 1. FC Kaiserslautern besucht.',
                image: 'news-hannover.jpg'
            }
        ];

        const renderHomepageNews = (articlesList) => {
            homepageNewsContainer.innerHTML = '';
            const latest3 = articlesList.slice(0, 3);
            if (latest3.length === 0) {
                homepageNewsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem 0; grid-column: span 3;">Keine Beiträge vorhanden.</p>';
                return;
            }
            latest3.forEach(art => {
                const isLogo = art.image.includes('id=1000054') || art.image.includes('id=1000037') || art.image.includes('logo') || art.category.toLowerCase().includes('sponsoring') || art.category.toLowerCase().includes('webdesign');
                const imgStyle = isLogo ? 'style="object-fit: contain; padding: 1.25rem; background-color: #f8f9fa;"' : '';

                const card = document.createElement('div');
                card.className = 'showcase-card reveal-item revealed';
                card.innerHTML = `
                    <div class="showcase-img" style="background-color: #f8f9fa;">
                        <img src="${art.image}" alt="${art.title}" ${imgStyle}>
                    </div>
                    <div class="showcase-content">
                        <div style="font-size: 0.8rem; color: var(--accent-color); margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                            <span><i class="far fa-calendar-alt"></i> ${art.date}</span> | <span>${art.category}</span>
                        </div>
                        <h3 class="showcase-title" style="font-size: 1.15rem; line-height: 1.4; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${art.title}</h3>
                        <p class="showcase-desc" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.92rem; margin-bottom: 1.25rem;">${art.excerpt}</p>
                        <a href="#" data-id="${art.id}" class="btn-text-premium" style="padding-left:0; align-self: flex-start; margin-top: auto;">Weiterlesen <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                homepageNewsContainer.appendChild(card);
            });

            // Set up click delegator for modal open on homepage
            homepageNewsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-text-premium');
                if (btn) {
                    e.preventDefault();
                    const id = parseInt(btn.getAttribute('data-id'));
                    const art = articlesList.find(a => a.id === id);
                    if (art) {
                        openNewsModal(art);
                    }
                }
            });
        };

        // Render default news immediately on load for instant feel
        renderHomepageNews(defaultArticles);

        // Fetch live news asynchronously from Cloudflare Worker API in the background
        fetch('https://huemax-news-api.friese-scholz.workers.dev/api/news')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    renderHomepageNews(data); // Refresh with live database entries
                }
            })
            .catch(err => {
                console.error('Error fetching live news for homepage:', err);
            });
    }

    // 9. Calendar Subscription Modal Interceptor
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('a[href*="subscribe=true"]');
        if (btn) {
            e.preventDefault();
            
            // Extract feed credentials from the link href
            const urlObj = new URL(btn.href);
            const blockId = urlObj.searchParams.get('b') || '1000209';
            const signature = urlObj.searchParams.get('s') || 'djEtbebMwMZ-YG_q4zbEp6CgNwjRvWDGw3gzQCpbFo8q0cE=';
            
            // Construct the standard feeds
            const feedHttps = `https://huemax1920.clubdesk.com/clubdesk/feed?b=${blockId}&s=${signature}`;
            const feedWebcal = `webcal://huemax1920.clubdesk.com/clubdesk/feed?b=${blockId}&s=${signature}`;
            const googleCalUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(feedHttps)}`;

            // Create/Retrieve calendar subscription modal
            let overlay = document.getElementById('calendar-subscribe-modal');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'calendar-subscribe-modal';
                overlay.className = 'calendar-modal-overlay';
                overlay.innerHTML = `
                    <div class="calendar-modal-window">
                        <button class="calendar-modal-close" aria-label="Schließen"><i class="fas fa-times"></i></button>
                        <h3 class="calendar-modal-title"><i class="far fa-calendar-check" style="color: var(--accent-color); margin-right: 0.5rem;"></i> Kalender abonnieren</h3>
                        <p class="calendar-modal-desc">Wähle dein Kalenderprogramm aus, um Geburtstage und Termine der SpVgg HüMax zu synchronisieren.</p>
                        
                        <div class="calendar-options-grid">
                            <a href="${feedWebcal}" class="calendar-option-btn">
                                <i class="fab fa-apple"></i>
                                <span>Apple Kalender / iPhone</span>
                            </a>
                            <a href="${googleCalUrl}" target="_blank" class="calendar-option-btn">
                                <i class="fab fa-google"></i>
                                <span>Google Kalender</span>
                            </a>
                            <a href="${feedWebcal}" class="calendar-option-btn">
                                <i class="fab fa-windows"></i>
                                <span>Outlook / Microsoft Calendar</span>
                            </a>
                            <div class="calendar-option-btn copy-btn" id="calendar-copy-link-btn">
                                <i class="fas fa-link"></i>
                                <span id="calendar-copy-btn-text">Manuell einrichten (Link kopieren)</span>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);

                // Close events
                overlay.querySelector('.calendar-modal-close').addEventListener('click', () => {
                    overlay.classList.remove('active');
                });
                overlay.addEventListener('click', (ev) => {
                    if (ev.target === overlay) {
                        overlay.classList.remove('active');
                    }
                });

                // Copy Link click listener
                const copyBtn = overlay.querySelector('#calendar-copy-link-btn');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(feedHttps).then(() => {
                        copyBtn.classList.add('copied');
                        const textSpan = copyBtn.querySelector('#calendar-copy-btn-text');
                        const iconEl = copyBtn.querySelector('i');
                        
                        textSpan.textContent = 'Link in Zwischenablage kopiert!';
                        iconEl.className = 'fas fa-check';
                        
                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                            textSpan.textContent = 'Manuell einrichten (Link kopieren)';
                            iconEl.className = 'fas fa-link';
                        }, 2500);
                    }).catch(err => {
                        console.error('Copy failed:', err);
                    });
                });
            }

            // Open modal
            overlay.classList.add('active');
        }
    });

    // 10. Hero Fixed Parallax Background with Fallback
    const hero = document.querySelector('.hero');
    if (hero) {
        const img = new Image();
        const r2Url = 'https://pub-b33108412309406a9a941ddc51e9a5b9.r2.dev/spvgg-huemax/hero-bg.jpg';
        img.src = r2Url;
        
        const setBg = (url) => {
            // Lighter overlay opacities (0.58 and 0.38) to make the image stand out even more vividly
            hero.style.backgroundImage = `linear-gradient(135deg, rgba(10, 28, 1, 0.58) 0%, rgba(21, 62, 2, 0.38) 100%), url('${url}')`;
            hero.style.backgroundAttachment = 'fixed';
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        };

        img.onload = () => setBg(r2Url);
        img.onerror = () => setBg('hero-bg.jpg');
    }

    // 11. Interactive Contact Form Handler with Success Toast
    const contactForm = document.querySelector('.form-card form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            // Show loading spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
            
            setTimeout(() => {
                // Create animated toast notification
                const toast = document.createElement('div');
                toast.style.cssText = `
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: var(--primary-color);
                    color: white;
                    padding: 1.25rem 2rem;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border: 1px solid rgba(255,255,255,0.15);
                    animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    font-family: var(--font-body);
                `;
                
                if (!document.getElementById('toast-style-animation')) {
                    const style = document.createElement('style');
                    style.id = 'toast-style-animation';
                    style.textContent = `
                        @keyframes slideIn {
                            from { transform: translateY(50px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                        @keyframes fadeOut {
                            to { transform: translateY(30px); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                toast.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--accent-color); font-size: 1.4rem;"></i>
                    <div>
                        <strong style="display: block; font-size: 0.95rem;">Erfolgreich gesendet!</strong>
                        <span style="font-size: 0.85rem; opacity: 0.9;">Vielen Dank. Wir melden uns in Kürze bei dir.</span>
                    </div>
                `;
                document.body.appendChild(toast);
                
                // Reset form state
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                // Dismiss after 4 seconds
                setTimeout(() => {
                    toast.style.animation = 'fadeOut 0.5s ease forwards';
                    setTimeout(() => {
                        toast.remove();
                    }, 500);
                }, 4000);
                
            }, 1200);
        });
    }
});
