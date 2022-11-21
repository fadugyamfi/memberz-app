import { SearchBar } from "./components/search-bar.js";
import { Events } from "./traits/events.js";

export class MembershipDirectory {

  constructor(appKey, options = {}) {
    this.tenantId = appKey;
    this.tenantSlug = options.slug || 'cbctaifa';
    this.pageLimit = options.pageLimit || 50;
    this.title = options.title || 'Membership Directory';
    this.subtitle = options.subtitle || '';

    this.directorySelector = '.mbz-container #directory';
    this.paginationSelector = '.mbz-container #pagination';

    this.apiBaseURL = 'https://api-beta.memberz.org';
    this.apiBaseURL = 'http://api.memberz.test';

    this.config = {
      base_url: this.apiBaseURL,
      tenant_slug: this.tenantSlug,
      tenant_id: this.tenantId
    }

    Object.assign( this, Events );
  }

  importStylesheets() {
    const moduleUrl = new URL('./', import.meta.url);
    const url = `${moduleUrl.href}/directory.css`;
    document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${url}>`;
  }

  render(selector) {
    this.selector = selector;
    this.importStylesheets();

    document.querySelector(selector).innerHTML = `
      <div class="mbz-container">
        <header class='py-4 text-center'>
          <h2>${this.title}</h2>
          <h4>${this.subtitle}</h4>
        </header>

        <main>
          <div id="search-bar"></div>
          <div id="directory"></div>
        </main>

        <footer>
          <div id="pagination" class="d-flex justify-content-center py-4"></div>
        </footer>
      </div>
      `;

    this.renderSearchBar();
    this.trigger('render');

    this.fetchMemberships({}, 1, this.pageLimit);
  }

  renderSearchBar() {
    const searchBar = new SearchBar(`${this.selector} #search-bar`, this.config);

    searchBar.on('search', (name) => {
      this.fetchMemberships({ term: name }, 1, this.pageLimit);
    });

    searchBar.on('category-select', (value) => {
      this.fetchMemberships({ organisation_member_category_id: value }, 1, this.pageLimit);
    });

    searchBar.render();
  }

  renderDirectoryList(json) {
    let ul = document.createElement('div');
    ul.classList.add(['row'])

    json.data.forEach(membership => {
      let li = document.createElement('div');
      li.classList.add(['col-md-3']);
      li.innerHTML = `
          <div class='card mb-3'>
              <img
                src="${membership.member?.profile_photo?.url}"
                loading="lazy"
                onerror="this.src = 'https://via.placeholder.com/300/F9F9F9?text=No+Image'"
              />

              <main>
                  <p class='name'>
                      ${membership.member.title.toLowerCase()} ${membership.member.first_name.toLowerCase()} ${membership.member.last_name.toLowerCase()}
                  </p>
                  <p class='category'>${membership.organisation_member_category?.name}</p>
                  <p class='membership_no'># ${membership.organisation_no}</p>
              </main>
          </div>
      `;

      ul.appendChild(li);
    });

    document.querySelector(this.directorySelector).innerHTML = ``;
    document.querySelector(this.directorySelector).appendChild(ul);
  }

  renderPagination(json) {

    const list = document.createElement('ul');
    list.classList.add(['pagination']);

    json.meta.links.forEach(link => {
      let item = document.createElement('li');
      item.classList.add(['page-item']);

      let linkTag = document.createElement('a');
      linkTag.setAttribute('href', link.url);
      linkTag.setAttribute('disabled', link.active);
      linkTag.classList.add(['page-link'])
      linkTag.innerHTML = link.label;
      linkTag.addEventListener('click', (event) => {
        event.preventDefault();
        this.fetchMemberships(link.label);
      });

      item.appendChild(linkTag);
      list.appendChild(item);
    });

    document.querySelector(this.paginationSelector).innerHTML = '';
    document.querySelector(this.paginationSelector).append(list);
  }

  fetchMemberships(options = {}, page = 1, limit = 10) {

    const url = `${this.apiBaseURL}/api/organisations/${this.tenantSlug}/organisation_members?` + new URLSearchParams({
      sort: 'first_name:asc',
      page,
      limit,
      ...options
    });

    const headers = { 'X-Tenant-Id': this.tenantId };

    document.querySelector(this.directorySelector).innerHTML = `<div class='text-center p-5 h4'>Loading ....</div>`;

    fetch(url, { headers })
      .then(response => response.json())
      .then(json => {
        this.renderDirectoryList(json);
        this.renderPagination(json);
      })
      .catch(error => {
        console.log(error);
      })
  }

}

function titlecase(str) {
  if (!str || str == 'null') {
    return '';
  }

  const firstLetter = str.substring(0, 1);
  const remaining = str.substring(1);
  return firstLetter ? firstLetter.toUpperCase() + remaining : '';
}
