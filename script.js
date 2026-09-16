const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightbox.addEventListener('click', event => {
  if (event.target === lightbox || event.target === lightboxClose) {
    closeLightbox();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});

const inquiryForm = document.getElementById('inquiry-form');
const formStatus = document.getElementById('form-status');
const checkIn = document.getElementById('check-in');
const checkOut = document.getElementById('check-out');

if (inquiryForm) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  checkIn.min = localToday;
  checkOut.min = localToday;

  checkIn.addEventListener('change', () => {
    checkOut.min = checkIn.value || localToday;
    if (checkOut.value && checkOut.value <= checkIn.value) {
      checkOut.value = '';
    }
  });

  inquiryForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) return;
    if (checkIn.value && checkOut.value && checkOut.value <= checkIn.value) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Check-out must be after check-in.';
      checkOut.focus();
      return;
    }

    const submitButton = inquiryForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      const response = await fetch(inquiryForm.action, {
        method: 'POST',
        body: new FormData(inquiryForm)
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your inquiry.');
      }

      inquiryForm.reset();
      checkIn.min = localToday;
      checkOut.min = localToday;
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Thank you! Your inquiry was sent. We will be in touch soon.';
    } catch (error) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'We could not send your inquiry. Please email timeoutgrandisle@gmail.com instead.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Booking Inquiry';
    }
  });
}
