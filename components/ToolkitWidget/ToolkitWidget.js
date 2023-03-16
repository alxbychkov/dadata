import getTooltipsFromAPI from '../../api/getTooltipsFromAPI.js';
import { IsJsonString, debounce } from '../../scripts/functions.js';

class TooltipWidgetElement {
  constructor(items) {
    this.container = this.createContainer();
    this.fields = items;
    this.findElements = [];
    this.query = '';
    this.QUERY_COUNT = 5;

    this.searchHandler = debounce(this.search.bind(this), 600);
    this.fillHandler = this.fill.bind(this);

    this.init();
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'tooltip-widget';

    return container;
  }

  createItem(item) {
    const id = item.id || '';
    const title = item.name || '';
    const placeholder = item.placeholder || '';

    const div = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');

    div.className = 'widget-input';

    label.className = 'input-label';
    label.setAttribute('for', id);
    label.innerHTML = title;

    input.type = id === 'type' ? 'hidden' : 'text';
    input.name = id;
    input.id = id;
    input.placeholder = placeholder;

    if (id === 'name') {
      input.addEventListener('input', this.searchHandler);

      const values = document.createElement('div');

      values.className = 'widget-input-values';

      div.insertAdjacentElement('beforeend', values);

      values.addEventListener('click', this.fillHandler);
    }

    div.insertAdjacentElement('afterbegin', input);
    div.insertAdjacentElement('afterbegin', label);

    return div;
  }

  init() {
    if (this.fields && IsJsonString(this.fields) && this.fields.length) {
      for (const field of this.fields) {
        this.container.appendChild(this.createItem(field));
      }
    }
  }

  async search(event) {
    this.query = event.target.value || '';
    const json = await getTooltipsFromAPI(this.query, this.QUERY_COUNT);

    this.findElements = [];

    if (json.suggestions && json.suggestions.length) {
      json.suggestions.forEach((el) => {
        const { inn, kpp, type } = { ...el.data };
        const { full_with_opf: fullName, short_with_opf: shortName } = {
          ...el.data.name,
        };
        const { unrestricted_value: address } = { ...el.data.address };

        this.findElements.push({
          innKpp: `${inn} / ${kpp}`,
          type,
          fullName,
          shortName,
          address,
        });
      });
    }

    this.showVariants();
  }

  fill(e) {
    const parent = e.target ? e.target.closest('div[data-id]') : undefined;

    if (parent) {
      const id = parent.dataset.id;
      const obj = this.findElements[id];

      Object.keys(obj).forEach((key) => {
        if (obj[key]) {
          const input = this.container.querySelector(`#${key}`);

          if (input) input.value = obj[key];
          if (
            key === 'type' &&
            input.previousSibling &&
            input.previousSibling.tagName === 'LABEL'
          )
            input.previousSibling.innerHTML = `Организация (${obj[key]})`;
        }
      });

      parent.parentNode.classList.remove('active');
      parent.parentNode.innerHTML = '';
      this.findElements = [];
      this.query = '';
    }
  }

  clear() {
    const items = this.container.childNodes;

    if (items.length) {
      items.forEach((i) => {
        const input = i.querySelector('input');
        const label = i.querySelector('label[for="type"]');

        if (label) label.innerHTML = '';
        if (input) input.value = '';
      });
    }
  }

  showVariants() {
    const values = this.container.querySelector('.widget-input-values');
    values.innerHTML = '';

    if (values) {
      const title = `<p class="values-title">Выберете вариант для продолжения ввода</p>`;
      values.insertAdjacentHTML('afterbegin', title);

      if (this.findElements.length) {
        this.findElements.forEach((v, i) => {
          const html = `
                        <div data-id="${i}">
                            <p><b>${v.shortName}</b></p>
                            <p>${v.address}</p>
                        </div>
                    `;

          values.insertAdjacentHTML('beforeend', html);
        });
      }

      if (this.query) {
        values.classList.add('active')
      } else {
        values.classList.remove('active');
        this.clear();
      }
    }
  }

  render() {
    return this.container;
  }

  destroy() {
    const input = this.container.querySelector('input[name="name"]');
    const values = this.container.querySelector('.widget-input-values');

    input && input.removeEventListener('input', this.debounceSearch);
    values && values.removeEventListener('click', this.fillHandler);
  }
}

export default TooltipWidgetElement;
