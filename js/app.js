let catalog = [];

let searchEl, btnSearchEl, listEl;

document.addEventListener("DOMContentLoaded", async () => {
  searchEl = document.getElementById('inputBuscar');
  btnSearchEl = document.getElementById('btnBuscar');
  listEl = document.getElementById('lista');

  try {
    const raw = await fetchMovies();
    catalog = buildCatalog(raw);
    btnSearchEl.disabled = false;
  } catch (error) {
    console.error("Error en el DOMListener", error); 
  }

  btnSearchEl.addEventListener('click', onSearch);

  listEl.addEventListener('click', (e) => { 
    const li = e.target.closest('li[data-id]');
    if (!li) return;

    const id = Number(li.dataset.id);
    const item = catalog.find(x => x.id === id);
    if (item) openDetail(item, li);
  });
});


function onSearch() {
  const consult = searchEl.value.trim().toLowerCase();
  if (consult === "") {
    listEl.innerHTML = "";
    return;
  }

  const filtered = (catalog || []).filter(f =>
    f.searchable.includes(consult) || f.genresLower.some(g => g.includes(consult))
  );

  if (filtered.length === 0) {
    listEl.innerHTML = `<li class="list-group-item text-center text-muted">Sin resultados</li>`;
    return;
  }

  renderList(filtered);
}

function renderList(items) {
  const element = items.map(m => {
    return `
      <li class="list-group-item d-flex justify-content-between align-items-start"
          role="button" tabindex="0" data-id="${m.id}"
          aria-label="Ver detalles de ${m.title}">
        <div class="pe-3">
          <div class="fw-bold">${m.title}</div>
          ${m.hasTagline ? `<div class="text-muted">${m.tagline}</div>` : ""}
        </div>
        <div>${renderStars(m.stars)}</div>
      </li>
    `;
  }).join("");

  listEl.innerHTML = element;
}

function renderStars(number) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= number) {
      stars += `<i class="fa-solid fa-star text-warning me-1"></i>`;
    } else {
      stars += `<i class="fa-regular fa-star text-warning me-1"></i>`;
    }
  }
  return stars;
}

function openDetail(item, originEl) {
  document.getElementById('movieDetailLabel').textContent = item.title || "—";
  document.getElementById('md-genres').textContent = item.genresText || "—";
  document.getElementById('md-overview').textContent = item.overview || "—";

  document.getElementById('md-year').textContent = `Year: ${item.year ?? "—"}`;
  document.getElementById('md-runtime').textContent = `Runtime: ${item.runtime ? item.runtime + " mins" : "—"}`;
  document.getElementById('md-budget').textContent = `Budget: ${formatPrice(item.budget)}`;
  document.getElementById('md-revenue').textContent = `Revenue: ${formatPrice(item.revenue)}`;

  const el = document.getElementById('movieDetail');
  const oc = bootstrap.Offcanvas.getOrCreateInstance(el, { backdrop: true, scroll: true });
  oc.show();

  el.addEventListener('hidden.bs.offcanvas', () => {
    if (originEl) originEl.focus();
  }, { once: true });
}

function formatPrice(n) {
  if (!n) return "—";
  return "$ " + Number(n).toLocaleString("en-US");
}
