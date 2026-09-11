const events = document.querySelector('#events');
const count = document.querySelector('#count');

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${dateString}T12:00:00`));
}

function renderRepository(repository, index) {
  const article = document.createElement('article');
  article.className = 'repo';
  article.style.animationDelay = `${index * 80}ms`;

  const tags = repository.topics
    .map((topic) => `<span class="tag">${topic}</span>`)
    .join('');

  article.innerHTML = `
    <div class="repo-date">
      <span class="meta">${repository.action}</span>
      <time datetime="${repository.starredAt}">${formatDate(repository.starredAt)}</time>
    </div>
    <div>
      <h2><a href="${repository.url}" target="_blank" rel="noreferrer">${repository.repo}</a></h2>
      <p class="repo-description">${repository.description}</p>
      <div class="repo-tags">${tags}</div>
    </div>
    <div class="repo-stats">
      <strong>★ ${repository.stars}</strong>
      ${repository.language}
    </div>
  `;

  return article;
}

async function loadEvents() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Could not load events (${response.status})`);
    }

    const repositories = await response.json();
    count.textContent = `${repositories.length} repositories`;
    events.replaceChildren(...repositories.map(renderRepository));
  } catch (error) {
    count.textContent = 'Unable to load';
    events.innerHTML = '<p class="status">The repository log could not be loaded. Try refreshing the page.</p>';
    console.error(error);
  }
}

loadEvents();
