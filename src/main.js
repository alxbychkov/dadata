import fields from '../assets/fields.json' assert { type: 'json' };
import styles from '../components/ToolkitWidget/styles.css' assert {type: 'css'};
import TooltipWidgetElement from '../components/ToolkitWidget/ToolkitWidget.js';

class TooltipWidget extends HTMLElement {
  constructor() {
    super();

    this.container = new TooltipWidgetElement(fields);
    this.html = this.container.render();
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  disconnectedCallback() {
    this.container.destroy();
  }

  render() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [styles];
    shadow.append(this.html);
  }
}

export default function init() {
    customElements.define('tooltip-widget', TooltipWidget);
}