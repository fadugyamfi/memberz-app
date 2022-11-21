import { Events } from '../traits/events.js';

export class SearchBar {

  constructor(selector, config) {
    this.config = config;
    this.selector = selector;
    this.element = document.querySelector(this.selector);

    Object.assign(this, Events);
  }

  render() {
    const template = `
      <form action="" method="post" onsubmit='return false;'>
        <div class="row mb-4">
          <div class="col-sm-4 offset-sm-2">
              <input type="search" class="form-control js-name-search mb-3" placeholder="Enter Name or Membership No" />
          </div>

          <div class="col-sm-4">
              <select class='form-select js-category-select mb-3'>
                <option value=''>Select Category</option>
              </select>
          </div>
        </div>
      </form>
    `;

    this.element.innerHTML = template;

    document.querySelector(`${this.selector} .js-name-search`).addEventListener('change', (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('search', event.target.value);
    });

    document.querySelector(`${this.selector} .js-category-select`).addEventListener('change', (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('category-select', event.target.value);
    })

    this.fetchCategories();
    this.trigger('render');
  }

  fetchCategories() {
    const url = `${this.config.base_url}/api/organisations/${this.config.tenant_slug}/membership_categories?` + new URLSearchParams({
      sort: 'name:asc'
    });

    const headers = { 'X-Tenant-Id': this.config.tenant_id };

    fetch(url, { headers })
      .then(response => response.json())
      .then(json => {
        const categorySelect = document.querySelector(`${this.selector} .js-category-select`);
        categorySelect.options.length = 1;

        json.data.forEach(category => {
          categorySelect.options.add( new Option(category.name, category.id) );
        })
      })
      .catch(error => {
        console.log(error);
      })
  }
}
