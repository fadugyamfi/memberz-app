export class MembershipDirectory {

  constructor(appKey) {
      this.tenantId = appKey;
  }

  render(selector) {
      document.querySelector(selector).innerHTML = `
      <div class="container">
          <h2>Membership Directory</h2>
          <div id="directory"></div>
          <div id="pagination" class="d-flex justify-content-center py-4"></div>
      </div>
      `;

      this.fetchMemberships();
  }

  renderDirectoryList(json) {
      let ul = document.createElement('ul');
      ul.classList.add(['listing-group'])

      json.data.forEach(membership => {
          let li = document.createElement('li');
          li.classList.add(['listing-group-item']);
          li.innerHTML = `
          <div class='card'>
              <img src="${membership.member?.profile_photo?.url}" onerror="this.src = 'https://via.placeholder.com/300/F9F9F9?text=No+Image'" />
              <main>
                  <p class='name'>
                      ${titlecase(membership.member.title)} ${membership.member.first_name} ${membership.member.last_name}
                  </p>
                  <p class='category'>${membership.organisation_member_category?.name}</p>
                  <p class='membership_no'># ${membership.organisation_no}</p>
              </main>
          </div>
      `;

          ul.appendChild(li);
      });

      document.querySelector("#directory").innerHTML = ``;
      document.querySelector("#directory").appendChild(ul);
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

      document.querySelector("#pagination").innerHTML = '';
      document.querySelector("#pagination").append(list);
  }

  fetchMemberships(page = 1, limit = 10) {
      // const tenantId = 'e4e30d12-2b20-4bbe-a551-d774693db0ba';
      // const tenantId = 'c2a93251-672f-415d-8fb2-9c4f312b6bb0';
      const slug = 'ministers-conference-gbc';
      const url = `https://api-beta.memberz.org/api/organisations/${slug}/organisation_members?` + new URLSearchParams({
          sort: 'first_name:asc',
          page,
          limit
      });

      const headers = { 'X-Tenant-Id': this.tenantId };

      document.querySelector("#directory").innerHTML = `<div class='text-center p-5 h4'>Loading ....</div>`;

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
  return firstLetter ? firstLetter.toUpperCase() + remaining.toLowerCase() : '';
}
