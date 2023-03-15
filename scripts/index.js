import fields from '../assets/fields.json' assert { type: 'json' };
import { IsJsonString } from './functions.js';
import getTooltips from './api.js';

class TooltipWidgetElement {
  constructor(items) {
    this.container = this.createContainer();
    this.fields = items;
    this.create();
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

    input.type = 'text';
    input.name = id;
    input.id = id;
    input.placeholder = placeholder;

    if (id === 'name') {
      input.addEventListener('change', e => this.search(e));
    }

    div.insertAdjacentElement('beforeend', label);
    div.insertAdjacentElement('beforeend', input);

    return div;
  }

  create() {
    if (this.fields && this.fields.length) {
      for (const field of fields) {
        this.container.appendChild(this.createItem(field));
      }
    }
  }

  async search(event) {
    const query = event.target.value || '';

    const json = await getTooltips(query);
    const response = json.suggestions[1];

    const { inn, kpp, type } = { ...response.data };
    const { full_with_opf: fullName, short_with_opf: shortName} = { ...response.data.name };
    const { unrestricted_value: address } = { ...response.data.address };

    const result = { innKpp: `${inn} / ${kpp}`, type, fullName, shortName, address };

    console.log(result['innKpp']);
  }

  render() {
    return this.container;
  }
}

class TooltipWidget extends HTMLElement {
  constructor() {
    super();

    this.html = new TooltipWidgetElement(fields).render();

    this.styles = `       
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            html, body {
                font-family: Arial, Helvetica, sans-serif;
            }

            .tooltip-widget {
                padding: 10px 15px;
                background-color: aliceblue;
                display: grid;
                grid-template-columns: 1fr;
                row-gap: 20px;
            }
            
            .widget-input {
                display: grid;
                grid-template-columns: 1fr;
                row-gap: 3px;
            }
            
            .widget-input input[type="text"] {
                height: 35px; 
                padding: 5px 10px;
                border-radius: 5px;
                border: 1px solid #000;
                font-size: 16px;
            }
            
            .widget-input:first-child .input-label {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 6px;
            }
            
            @media screen and (min-width: 768px) {
                .widget-input:not(:first-child) {
                    max-width: 65%;
                }
            }
        </style>
    `;
  }

  connectedCallback() {
    if (fields.length) {
      const shadow = this.attachShadow({ mode: 'open' });

      //   for (let field of fields) {
      //     const id = field.id || '';
      //     const title = field.name || '';
      //     const placeholder = field.placeholder || '';

      //     this.html += `
      //         <div class="widget-input">
      //             <label class="input-label" for="${id}">${title}</label>
      //             <input type="text" name="${id}" id="${id}" placeholder="${placeholder}">
      //         </div>
      //     `;
      //   }

      shadow.innerHTML = this.styles;
      shadow.append(this.html);

      //shadow.innerHTML = `${this.styles}<div class="tooltip-widget">${this.html}</div>`;
      //   shadow.querySelector('#name').addEventListener('click', () => {console.log('click')})
      //this.find('сбербанк');
    }
  }
}

customElements.define('tooltip-widget', TooltipWidget);
