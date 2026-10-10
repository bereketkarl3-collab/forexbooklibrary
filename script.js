'use strict';

const books = [
  {title:'SMART MONEY CONCEPT',price:150,image:'smcbible.jpg',category:'SMC & ICT',description:'A study guide to smart money concepts and market structure.'},
  {title:'SUPPLY & DEMAND CONCEPT',price:100,image:'sup.jpg',category:'Other',description:'Study supply and demand zones and how traders use them.'},
  {title:'ALCHEMIST',price:100,image:'al01.jpg',category:'Other',description:'A trading study resource from the library collection.'},
  {title:'ICT TIME & PRICE',price:50,image:'ittmp.jpg',category:'SMC & ICT',description:'Study the relationship between time, price, and ICT concepts.'},
  {title:'MSNR FULL GUIDE',price:100,image:'msnrb.jpg',category:'MSNR',description:'A guide to the MSNR trading framework.'},
  {title:'THE DISCIPLINE TRADER',price:100,image:'tdt.jpg',category:'Psychology',description:'A resource focused on trading discipline and habits.'},
  {title:'MSNR 2',price:100,image:'msnr2.jpg',category:'MSNR',description:'The second MSNR guide in the collection.'},
  {title:'MSNR በ አማርኛ',price:150,image:'msnram.jpg',category:'MSNR',description:'MSNR study material in Amharic.'},
  {title:'THE CANDLE STICKS BIBLE',price:150,image:'thc.jpg',category:'Price Action',description:'Learn about candlestick patterns and their interpretation.'},
  {title:'PRICE ACTION',price:150,image:'Pcr.jpg',category:'Price Action',description:'A price action trading study guide.'},
  {title:'CRT & TS',price:150,image:'crt.jpg',category:'SMC & ICT',description:'Study CRT and TS trading concepts.'},
  {title:'SMC FULL COURSE',price:150,image:'smcq.jpg',category:'SMC & ICT',description:'A broad smart money concepts learning resource.'},
  {title:'ሀበሻ ICT',price:150,image:'ubsha.jpg',category:'SMC & ICT',description:'ICT trading study material.'},
  {title:'MSNR x SMC x LIT x ICT',price:150,image:'msnr23.jpg',category:'MSNR',description:'A combined study resource covering multiple trading frameworks.'},
  {title:'THE ICT BIBLE',price:100,image:'ictk.jpg',category:'SMC & ICT',description:'A collection guide for ICT concepts.'},
  {title:'SIMPLE',price:150,image:'sim.jpg',category:'Other',description:'A simple trading study resource.'},
  {title:'TRADING PSYCHOLOGY በ አማርኛ',price:100,image:'ts.jpg',category:'Psychology',description:'Trading psychology study material in Amharic.'},
  {title:'MSNR 3',price:150,image:'msnrf.jpg',category:'MSNR',description:'The third MSNR guide in the collection.'},
  {title:'TRADING IN THE ZONE',price:100,image:'tgy.jpg',category:'Psychology',description:'A classic trading psychology resource.'},
  {title:'MSNR BIBLE',price:150,image:'msb.jpg',category:'MSNR',description:'A comprehensive MSNR study guide.'},
  {title:'UNDERSTANDING LIQUIDITY',price:100,image:'la1.jpg',category:'SMC & ICT',description:'Learn core ideas about liquidity in the market.'},
  {title:'THE MARKET PROFILING GUIDE',price:120,image:'mlq.jpg',category:'Other',description:'A guide to market profiling concepts.'},
  {title:'SUPPORT & RESISTANCE',price:150,image:'sp6.jpg',category:'Price Action',description:'Study support and resistance levels.'},
  {title:'PRICE ACTION BREAK DOWN',price:150,image:'lk1.jpg',category:'Price Action',description:'A breakdown of price action trading ideas.'},
  {title:'MMXM MARKET MAKER MODEL',price:140,image:'mla.jpg',category:'SMC & ICT',description:'A study guide to the MMXM market maker model.'},
  {title:'ERL & IRL LIQUIDITY',price:100,image:'l3.jpg',category:'SMC & ICT',description:'Study ERL and IRL liquidity concepts.'},
  {title:'ALL ICT FOREX TRADING STRATEGY',price:250,image:'ic6.jpg',category:'SMC & ICT',description:'A collection of ICT forex trading strategy material.'},
  {title:'FORVI SUPPLY & DEMAND 7 PART',price:200,image:'fo.jpg',category:'Other',description:'A seven-part supply and demand learning resource.'},
  {title:'THE ULTIMATE PRICE PATTERN በ አማርኛ',price:170,image:'pc.jpg',category:'Price Action',description:'Price pattern study material in Amharic.'},
  {title:'FOREX TRADING MONEY MANAGEMENT SYSTEM',price:130,image:'mg.jpg',category:'Other',description:'Study risk and money management principles.'},
  {title:'THE ULTIMATE PRICE ACTION STRATEGY',price:180,image:'bte.jpg',category:'Price Action',description:'A price action strategy study resource.'},
  {title:'FOREX GOD FATHER',price:120,image:'fd.jpg',category:'Other',description:'A trading study resource from the library collection.'},
  {title:'DAILY BAIS በ አማርኛ',price:110,image:'dv.jpg',category:'SMC & ICT',description:'Daily bias study material in Amharic.'},
  {title:'WHAT IS FOREX በ አማርኛ',price:120,image:'ab1.jpg',category:'Other',description:'An introduction to forex in Amharic.'},
  {title:'ALCHEMIST WHITE',price:140,image:'alw.jpg',category:'Other',description:'A trading study resource from the library collection.'}
];

const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('paymentModal');
const overlay = document.getElementById('modalOverlay');

let activeCategory = 'All';

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function(char) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char];
  });
}

function renderBooks() {
  const term = searchInput.value.trim().toLowerCase();

  let visible = books
    .map(function(book, index) {
      return {...book, index};
    })
    .filter(function(book) {
      const text = (
        book.title + ' ' +
        book.category + ' ' +
        book.description
      ).toLowerCase();

      const matchesTerm = text.includes(term);

      const matchesCategory =
        activeCategory === 'All' ||
        book.category === activeCategory;

      return matchesTerm && matchesCategory;
    });

  const sort = sortSelect.value;

  if (sort === 'low') {
    visible.sort((a, b) => a.price - b.price);
  }

  if (sort === 'high') {
    visible.sort((a, b) => b.price - a.price);
  }

  if (sort === 'az') {
    visible.sort((a, b) => a.title.localeCompare(b.title));
  }

  resultCount.textContent =
    `Showing ${visible.length} of ${books.length} resources`;

  emptyState.hidden = visible.length !== 0;

  gallery.innerHTML = visible.map(function(book) {
    return `
      <article class="book-card">

        <div class="cover">
          <div class="cover-fallback">
            <small>FOREX PDF LIBRARY</small>
            <strong>${escapeHTML(book.title)}</strong>
            <em>TRADING STUDY GUIDE</em>
          </div>

          <img
            src="${escapeHTML(book.image)}"
            alt="${escapeHTML(book.title)} cover"
            loading="lazy"
            onerror="this.style.display='none'">
        </div>

        <div class="book-info">
          <span class="category-tag">
            ${escapeHTML(book.category)}
          </span>

          <h3>${escapeHTML(book.title)}</h3>

          <p>${escapeHTML(book.description)}</p>

          <div class="book-bottom">
            <span class="price">
              ${book.price} <small>ETB</small>
            </span>

            <button
              class="details-btn"
              type="button"
              data-book-index="${book.index}">
              View details ↗
            </button>
          </div>
        </div>

      </article>
    `;
  }).join('');
}

function openBook(index) {
  const book = books[index];

  if (!book) return;

  document.getElementById('modalTitle').textContent = book.title;
  document.getElementById('modalPrice').textContent =
    `${book.price} ETB`;

  document.getElementById('modalDescription').textContent =
    book.description;

  modal.hidden = false;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('closeModal').focus();
}

function closeBookModal() {
  modal.hidden = true;
  overlay.hidden = true;
  document.body.style.overflow = '';
}

gallery.addEventListener('click', function(event) {
  const button = event.target.closest('[data-book-index]');

  if (button) {
    openBook(Number(button.dataset.bookIndex));
  }
});

searchInput.addEventListener('input', renderBooks);
sortSelect.addEventListener('change', renderBooks);

document.getElementById('filters').addEventListener('click', function(event) {
  const button = event.target.closest('[data-category]');

  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll('.filter').forEach(function(item) {
    item.classList.toggle('active', item === button);
  });

  renderBooks();
});

document.getElementById('closeModal')
  .addEventListener('click', closeBookModal);

overlay.addEventListener('click', closeBookModal);

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && !modal.hidden) {
    closeBookModal();
  }
});

document.getElementById('year').textContent =
  new Date().getFullYear();

renderBooks();