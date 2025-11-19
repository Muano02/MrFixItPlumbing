document.addEventListener('DOMContentLoaded', function () {
    // Services search/filter
    const serviceSearch = document.getElementById('serviceSearch');
    if (serviceSearch) {
        const cards = Array.from(document.querySelectorAll('.service-card'));
        serviceSearch.addEventListener('input', function (e) {
            const q = e.target.value.trim().toLowerCase();
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }

    // FAQ Accordion toggles
    const accordionButtons = document.querySelectorAll('.accordion-header');
    accordionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            // Close others
            accordionButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
            // Toggle current
            btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
    });

    // Simple lightbox for images with class in service cards and team cards
    const lightboxImages = document.querySelectorAll('.service-card img, .team-card img');
    if (lightboxImages.length > 0) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:none;align-items:center;justify-content:center;z-index:2000;padding:20px;';
        const img = document.createElement('img');
        img.style.cssText = 'max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.6);';
        overlay.appendChild(img);
        overlay.addEventListener('click', () => overlay.style.display = 'none');
        document.body.appendChild(overlay);
        lightboxImages.forEach(el => {
            el.style.cursor = 'zoom-in';
            el.addEventListener('click', () => {
                img.src = el.src;
                img.alt = el.alt || '';
                overlay.style.display = 'flex';
            });
        });
    }

    // Dynamic testimonials rendering
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (testimonialGrid) {
        const testimonials = [
            { text: 'Mr FixIT came quickly and saved us from a burst geyser! Highly recommend.', name: 'Thandiwe N., Midrand' },
            { text: 'Professional and affordable service. They fixed our blocked drains in no time.', name: 'Kabelo S., Midrand' },
            { text: 'Affordable, honest, and professional – the best plumbing service in town.', name: 'John M., Midrand' },
            { text: 'Quick response and thorough work. Our blocked drains are completely cleared.', name: 'Thabo M., Midrand' },
            { text: 'Courteous staff and high-quality service. Highly recommend.', name: 'Themba N., Pretoria' },
            { text: 'The team was punctual and skilled. Our geyser installation was flawless.', name: 'Ruan J., Sandton' }
        ];
        testimonialGrid.innerHTML = '';
        testimonials.forEach(t => {
            const p = document.createElement('p');
            p.innerHTML = `"${t.text}"</br> <span class="testimonial-name">${t.name}</span>`;
            testimonialGrid.appendChild(p);
        });
    }

    // Enquiry form validation and faux estimate response
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        const feedback = document.getElementById('enquiryFeedback');
        const enquiryFields = document.getElementById('enquiryFields');
        const enquiryReset = document.getElementById('enquiryReset');

        if (enquiryReset) {
            enquiryReset.addEventListener('click', function () {
                enquiryForm.reset();
                feedback.textContent = '';
                feedback.style.color = '';
                enquiryFields.style.display = '';
                enquiryReset.hidden = true;
                const firstInput = enquiryFields.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            });
        }

        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!enquiryForm.checkValidity()) {
                feedback.textContent = 'Please correct the highlighted fields.';
                feedback.style.color = '#b00020';
                enquiryForm.reportValidity();
                enquiryFields.style.display = '';
                if (enquiryReset) {
                    enquiryReset.hidden = true;
                }
                return;
            }
            const type = enquiryForm.type.value;
            const preferredDate = enquiryForm.preferredDate.value;
            // Simple heuristic estimate
            const estimateMap = {
                'leak-repairs': 'R450 - R900',
                'geyser-installation': 'R3,500 - R7,500',
                'blocked-drains': 'R650 - R1,200',
                'pipe-replacement': 'R1,500 - R4,000',
                'other': 'R500+'
            };
            const estimate = estimateMap[type] || 'R500+';
            feedback.style.color = '#0a7a2f';
            feedback.innerHTML = `Thank you! Estimated cost: <strong>${estimate}</strong>${preferredDate ? ` • Earliest availability near ${preferredDate}` : ''}. We’ll confirm via email shortly.`;
             enquiryFields.style.display = 'none';
             if (enquiryReset) {
                 enquiryReset.hidden = false;
                 enquiryReset.focus();
             }
            enquiryForm.reset();
        });
    }

    // Contact form validation and mailto composition
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const feedback = document.getElementById('contactFeedback');
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                feedback.textContent = 'Please fill in all required fields with valid details.';
                feedback.style.color = '#b00020';
                contactForm.reportValidity();
                return;
            }
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const phone = contactForm.phone.value.trim();
            const topic = contactForm.topic.value;
            const message = contactForm.message.value.trim();
            const subject = encodeURIComponent(`[${topic.toUpperCase()}] Message from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nTopic: ${topic}\n\nMessage:\n${message}`
            );
            const mailto = `mailto:info@mrfixitplumbing.co.za?subject=${subject}&body=${body}`;
            // Provide UX feedback and open mail client in new tab
            feedback.style.color = '#0a7a2f';
            feedback.textContent = 'Opening your email client...';
            window.open(mailto, '_blank');
        });
    }

    // Leaflet map initialization
    const mapEl = document.getElementById('leafletMap');
    if (mapEl && typeof L !== 'undefined') {
        const map = L.map('leafletMap').setView([-25.9971, 28.1263], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([-25.9971, 28.1263]).addTo(map)
            .bindPopup('Mr FixIT Plumbing Service Area<br>Midrand')
            .openPopup();
    }
});

