// tooltip-vanilla.js
class TooltipComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.visible = false;
      this.tooltipId = `tooltip_${Math.random().toString(36).substr(2, 9)}`;
      this.handleScroll = this.handleScroll.bind(this);
      this.showTooltip = this.showTooltip.bind(this);
      this.hideTooltip = this.hideTooltip.bind(this);
      this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }
  
    connectedCallback() {
      this.message = this.getAttribute('message') || '';
      this.position = this.getAttribute('data-placement') || this.position;
      this.htmlContent = this.hasAttribute('data-html');
      this.title = this.getAttribute('title') || this.getAttribute('data-original-title') || this.message;
      this.trigger = this.getAttribute('data-trigger') || 'hover focus';
      this.animation = this.hasAttribute('data-animation')
        ? this.getAttribute('data-animation') !== 'false'
        : true;
      this.container = this.getAttribute('data-container') || null;
      this.customClass = this.getAttribute('data-custom-class') || '';
      this.variant = this.getAttribute('data-variant') || '';
  
      window.addEventListener('scroll', this.handleScroll, true);
  
      if (!document.getElementById('tooltip-styles')) {
        const style = document.createElement('style');
        style.id = 'tooltip-styles';
        style.textContent = `/* placeholder for injected tooltip-styles.js */`;
        document.head.appendChild(style);
      }
  
      this.shadowRoot.innerHTML = `<slot></slot>`;
      this.applyTriggers();
    }
  
    disconnectedCallback() {
      window.removeEventListener('scroll', this.handleScroll, true);
      this.removeTooltipElement();
    }
  
    applyTriggers() {
      const triggers = this.trigger.split(' ');
      const slotElement = this.shadowRoot.querySelector('slot');
  
      const addListeners = (elements) => {
        const triggerEl = elements[0];
        if (!triggerEl) return;
  
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('data-toggle', 'tooltip');
        triggerEl.setAttribute('data-placement', this.position);
        triggerEl.setAttribute('aria-describedby', this.tooltipId);
  
        if (triggers.includes('click')) {
          triggerEl.addEventListener('click', this.showTooltip);
          document.addEventListener('click', this.handleOutsideClick, true);
        }
        if (triggers.includes('hover')) {
          triggerEl.addEventListener('mouseenter', this.showTooltip);
          triggerEl.addEventListener('mouseleave', this.hideTooltip);
        }
        if (triggers.includes('focus')) {
          triggerEl.addEventListener('focus', this.showTooltip);
          triggerEl.addEventListener('blur', this.hideTooltip);
        }
      };
  
      addListeners(slotElement.assignedElements());
      slotElement.addEventListener('slotchange', () => {
        addListeners(slotElement.assignedElements());
      });
    }
  
    handleScroll() {
      if (this.trigger.includes('click') && this.visible) this.hideTooltip();
    }
  
    handleOutsideClick(event) {
      const triggerEl = this.shadowRoot.querySelector('slot').assignedElements()[0];
      if (this.visible && !this.tooltipElement?.contains(event.target) && !triggerEl.contains(event.target)) {
        this.hideTooltip();
      }
    }
  
    showTooltip(event) {
      if (this.trigger.includes('manual')) return;
      const triggerEl = this.shadowRoot.querySelector('slot').assignedElements()[0];
      if (event && event.target !== triggerEl) return;
      this.visible = true;
      this.createTooltipElement();
      requestAnimationFrame(() => this.adjustTooltipPosition());
    }
  
    hideTooltip() {
      if (this.trigger.includes('manual')) return;
      this.visible = false;
      this.removeTooltipElement();
    }
  
    createTooltipElement() {
      if (this.tooltipElement) return;
  
      const triggerEl = this.shadowRoot.querySelector('slot').assignedElements()[0];
      this.tooltipElement = document.createElement('div');
      this.tooltipElement.id = this.tooltipId;
      this.tooltipElement.className = `tooltip tooltip-${this.position} fade show ${this.animation ? 'animated' : ''} ${this.customClass} ${this.variant}`.trim();
      this.tooltipElement.setAttribute('role', 'tooltip');
      this.tooltipElement.setAttribute('aria-live', 'assertive');
  
      const content = this.htmlContent ? this.title : this.escapeHTML(this.title);
      this.tooltipElement.innerHTML = `
        <div class="tooltip-arrow ${this.variant}"></div>
        <div class="tooltip-inner ${this.variant}" id="${this.tooltipId}-content">${content}</div>
      `;
      document.body.appendChild(this.tooltipElement);
    }
  
    removeTooltipElement() {
      if (this.tooltipElement) {
        document.body.removeChild(this.tooltipElement);
        this.tooltipElement = null;
      }
    }
  
    adjustTooltipPosition() {
      const triggerEl = this.shadowRoot.querySelector('slot').assignedElements()[0];
      if (!triggerEl || !this.tooltipElement) return;
    
      const offset = 10;
      const rect = triggerEl.getBoundingClientRect();
      const tipRect = this.tooltipElement.getBoundingClientRect();
    
      let top = 0, left = 0;
      let pos = this.getAttribute('data-placement') || this.position;
    
      const space = {
        top: rect.top,
        bottom: window.innerHeight - rect.bottom,
        left: rect.left,
        right: window.innerWidth - rect.right,
      };
    
      if (pos === 'auto') {
        const maxSide = Object.entries(space).sort((a, b) => b[1] - a[1])[0][0];
        pos = maxSide;
      }
    
      if ((pos === 'top' && tipRect.height + offset > space.top) ||
          (pos === 'bottom' && tipRect.height + offset > space.bottom)) {
        pos = space.bottom > space.top ? 'bottom' : 'top';
      }
    
      switch (pos) {
        case 'top':
          top = rect.top - tipRect.height - offset;
          left = rect.left + rect.width / 2 - tipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - tipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tipRect.height / 2;
          left = rect.left - tipRect.width - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tipRect.height / 2;
          left = rect.right + offset;
          break;
      }
    
      this.tooltipElement.style.top = `${top + window.scrollY}px`;
      this.tooltipElement.style.left = `${left + window.scrollX}px`;
    
      this.tooltipElement.classList.remove('tooltip-top', 'tooltip-bottom', 'tooltip-left', 'tooltip-right');
      this.tooltipElement.classList.add(`tooltip-${pos}`);
    
      const arrow = this.tooltipElement.querySelector('.tooltip-arrow');
      if (arrow) {
        arrow.classList.remove('tooltip-top', 'tooltip-bottom', 'tooltip-left', 'tooltip-right');
        arrow.classList.add(`tooltip-${pos}`);
      }
    }
    
  
    escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }
  
  customElements.define('tooltip-component', TooltipComponent);
  