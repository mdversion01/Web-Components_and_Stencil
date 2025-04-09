class ToggleSwitch extends HTMLElement {
    constructor() {
      super();
      this.state = {
        switches: true,
        switchesArray: [],
        inputId: '',
        inline: false,
        toggleTxt: true,
        newToggleTxt: { on: 'On', off: 'Off' },
      };
      this.container = document.createElement('div');
    }
  
    connectedCallback() {
      this.appendChild(this.container);
      this.state.inputId = this.getAttribute('inputId') || 'switch';
      this.state.inline = this.hasAttribute('inline');
      this.state.toggleTxt = this.hasAttribute('toggleTxt');
  
      try {
        const switchesAttr = this.getAttribute('switchesArray');
        if (switchesAttr) {
          this.state.switchesArray = JSON.parse(switchesAttr);
        }
      } catch (e) {
        console.error('Invalid JSON in switchesArray attribute');
      }
  
      this.render();
    }
  
    toggleChecked(index) {
      this.state.switchesArray[index].checked = !this.state.switchesArray[index].checked;
      this.render();
    }
  
    render() {
      const { switchesArray, inputId, inline, toggleTxt, newToggleTxt } = this.state;
  
      const html = switchesArray
        .map((item, index) => {
          const id = `${inputId}_${item.id}`;
          const txt = item.checked ? (item.newToggleTxt?.on || newToggleTxt.on) : (item.newToggleTxt?.off || newToggleTxt.off);
          const toggleLabel = toggleTxt ? `<span class="toggleTxt-bold">${txt}</span>` : '';
  
          return `
            <div class="custom-control custom-switch ${inline ? 'custom-control-inline' : ''}">
              <input type="checkbox" class="custom-control-input" id="${id}" ${item.checked ? 'checked' : ''}>
              <label class="custom-control-label" for="${id}">
                ${item.label || ''} ${toggleLabel}
              </label>
            </div>
          `;
        })
        .join('');
  
      this.container.innerHTML = html;
  
      // re-bind listeners to new inputs
      this.container.querySelectorAll('input[type="checkbox"]').forEach((input, i) => {
        input.addEventListener('change', () => this.toggleChecked(i));
      });
    }
  }
  
  customElements.define('toggle-switch', ToggleSwitch);
  