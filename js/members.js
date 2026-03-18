/* ============================================================
   CFA – Members Directory JavaScript
   Live search, category filter, alphabetical index
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('memberSearch');
  const alphaButtons = document.querySelectorAll('.alpha-btn');
  const filterTabs   = document.querySelectorAll('.filter-tab');
  const memberCards  = document.querySelectorAll('.member-card[data-name]');
  const countEl      = document.querySelector('.results-count strong');
  const noResults    = document.getElementById('noResults');

  let activeAlpha  = 'all';
  let activeFilter = 'all';
  let searchQuery  = '';

  function updateDisplay() {
    let visible = 0;
    memberCards.forEach(card => {
      const name    = (card.dataset.name  || '').toLowerCase();
      const cat     = (card.dataset.cat   || '').toLowerCase();
      const firstLetter = name.trim().charAt(0).toUpperCase();

      const matchSearch = name.includes(searchQuery);
      const matchAlpha  = activeAlpha === 'all' || firstLetter === activeAlpha;
      const matchCat    = activeFilter === 'all' || cat === activeFilter;

      const show = matchSearch && matchAlpha && matchCat;
      card.parentElement.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (countEl) countEl.textContent = visible;
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  /* Search */
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      activeAlpha = 'all'; // reset alpha on search
      alphaButtons.forEach(b => b.classList.remove('active'));
      document.querySelector('.alpha-btn[data-letter="all"]')?.classList.add('active');
      updateDisplay();
    });
  }

  /* Alpha Index */
  alphaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alphaButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAlpha = btn.dataset.letter;
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      updateDisplay();
    });
  });

  /* Category Filter Tabs */
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      updateDisplay();
    });
  });

  /* Initial render */
  updateDisplay();
});
