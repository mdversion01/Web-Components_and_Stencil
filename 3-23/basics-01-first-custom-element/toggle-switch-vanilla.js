// toggle-switch.js

let lastInteractionWasKeyboard = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") lastInteractionWasKeyboard = true;
});
document.addEventListener("mousedown", () => (lastInteractionWasKeyboard = false));
document.addEventListener("touchstart", () => (lastInteractionWasKeyboard = false));

class ToggleSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      checked: false,
      switches: false,
      switchesArray: [],
      newToggleTxt: { on: "On", off: "Off" },
      toggleTxt: false,
      noLabel: false,
      inline: false,
      inputId: "",
      labelTxt: "",
      disabled: false,
      required: false,
      size: "",
      value: "",
      validation: false,
      validationMessage: "",
      focusedSwitchId: null,
      formLayout: "",
      noPadFormGroup: false,
    };
  }

  connectedCallback() {
    const props = [
      "checked", "disabled", "inline", "noLabel", "required", "toggleTxt",
      "validation", "noPadFormGroup", "size", "value", "inputId", "labelTxt"
    ];
    props.forEach(prop => {
      const val = this.getAttribute(prop);
      if (val !== null) {
        this.state[prop] = val === "" || val === "true";
        if (!isNaN(val)) this.state[prop] = val;
      }
    });

    const formComponent = this.closest("form-component");
    if (formComponent) {
      this.state.formLayout = formComponent.getAttribute("formLayout") || "";
    }

    this.render();
  }

  toggleChecked(id) {
    if (this.state.switches) {
      const idx = this.state.switchesArray.findIndex(s => s.id === id);
      if (idx !== -1) {
        this.state.switchesArray[idx].checked = !this.state.switchesArray[idx].checked;
        this.render();
      }
    } else {
      this.state.checked = !this.state.checked;
      this.dispatchEvent(new CustomEvent("checked-changed", {
        detail: { checked: this.state.checked },
        bubbles: true,
        composed: true,
      }));
      this.render();
    }
  }

  handleFocus(id) {
    if (lastInteractionWasKeyboard) {
      this.state.focusedSwitchId = id;
      this.render();
    }
  }

  handleBlur() {
    this.state.focusedSwitchId = null;
    this.render();
  }

  renderSwitch(switchData, parentId) {
    const switchId = this.state.switches ? `${parentId}_option_${switchData.id}` : parentId;
    const checked = !!switchData.checked;
    const disabled = this.state.disabled || !!switchData.disabled;
    const required = this.state.required || !!switchData.required;
    const toggleTxt = switchData.toggleTxt ?? this.state.toggleTxt;
    const txt = checked ? (switchData.newToggleTxt?.on || this.state.newToggleTxt.on) : (switchData.newToggleTxt?.off || this.state.newToggleTxt.off);
    const validation = switchData.validation && !checked;

    return `
      <div class="custom-control custom-switch ${switchData.size ? `custom-control-${switchData.size}` : ""} ${this.state.inline ? "custom-control-inline" : ""}">
        <input type="checkbox"
               class="custom-control-input"
               id="${switchId}"
               ${checked ? "checked" : ""}
               ${disabled ? "disabled" : ""}
               ${required ? "required" : ""}
               value="${switchData.value || ""}"
               aria-checked="${checked}"
               aria-disabled="${disabled}"
               role="switch"
               aria-labelledby="${switchData.label ? switchId + "_label" : ""}"
               aria-describedby="${validation ? switchId + "_validation_msg" : ""}"
        />
        <label class="custom-control-label${validation ? " invalid" : ""}"
               id="${switchId}_label"
               for="${switchId}">
          ${switchData.label || ""}
          ${toggleTxt ? `<span class="toggleTxt-bold">${txt}</span>` : ""}
          ${required ? `<span class="required"></span>` : ""}
        </label>
        ${validation ? `<div class="invalid-feedback">${switchData.validationMessage || this.state.validationMessage}</div>` : ""}
      </div>
    `;
  }

  render() {
    const parentId = this.state.inputId + "_PLMG";
    const wrapperClass = `form-group${this.state.formLayout === "inline" ? " form-toggle-inline" : ""}${this.state.noPadFormGroup ? " no-pad" : ""}`;

    let content = "";
    if (this.state.switches && this.state.switchesArray.length > 0) {
      content = `
        <div class="${wrapperClass}">
          <div role="group" tabindex="-1" class="no-focus-ring ${this.state.focusedSwitchId ? "keyboard-focused" : ""}" id="${parentId}">
            ${this.state.switchesArray.map(s => this.renderSwitch(s, parentId)).join("")}
          </div>
        </div>`;
    } else {
      const switchData = {
        id: this.state.inputId,
        checked: this.state.checked,
        label: this.state.labelTxt,
        disabled: this.state.disabled,
        required: this.state.required,
        size: this.state.size,
        value: this.state.value,
        validation: this.state.validation,
        validationMessage: this.state.validationMessage,
        toggleTxt: this.state.toggleTxt
      };
      content = `
        <div class="${wrapperClass}">
          <div class="${this.state.focusedSwitchId ? "keyboard-focused" : ""}">
            ${this.renderSwitch(switchData, parentId)}
          </div>
        </div>`;
    }

    this.shadowRoot.innerHTML = `<style>${this.getStyle()}</style>${content}`;

    this.shadowRoot.querySelectorAll("input[type=checkbox]").forEach((input) => {
      input.addEventListener("change", () => this.toggleChecked(input.id.split("_option_")[1] || this.state.inputId));
      input.addEventListener("focus", () => this.handleFocus(input.id));
      input.addEventListener("blur", () => this.handleBlur());
    });
  }

  getStyle() {
    return `/* Paste your CSS from toggle-switch-styles.js + formStyles here */
    *,
  :after,
  :before {
    box-sizing: border-box;
  }

   form {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  legend {
    padding: 0 10px;
  }

  legend.left {
    text-align: left;
  }
  legend.right {
    text-align: right;
  }
  legend.center {
    text-align: center;
  }

  fieldset {
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .custom-control {
    position: relative;
    z-index: 1;
    display: block;
    min-height: 1.5rem;
    padding-left: 1.5rem;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  .custom-switch {
    padding-left: 2.25rem;
  }

  .custom-control-inline {
    align-items: center;
    display: inline-flex;
    margin-right: 1rem;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button,
  input {
    overflow: visible;
  }

  .custom-control-input {
    position: absolute;
    left: 0;
    z-index: -1;
    width: 1rem;
    height: 1.25rem;
    opacity: 0;
  }

  input[type="checkbox"],
  input[type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }

  label {
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  .custom-control-label {
    position: relative;
    margin-bottom: 0;
    vertical-align: top;
  }

  .custom-control-label:before {
    pointer-events: none;
    background-color: #fff;
    border: 1px solid #adb5bd;
  }

  .custom-control-label:after,
  .custom-control-label:before {
    position: absolute;
    top: 0.25rem;
    left: -1.5rem;
    display: block;
    width: 1rem;
    height: 1rem;
    content: "";
  }

  .custom-control-label:before,
  .custom-file-label,
  .custom-select {
    transition: background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .custom-switch .custom-control-label:before {
    left: -2.25rem;
    width: 1.75rem;
    pointer-events: all;
    border-radius: 0.5rem;
  }

  .custom-control-label:after,
  .custom-control-label:before {
    position: absolute;
    top: 0;
    left: -1.5rem;
    display: block;
    width: 1rem;
    height: 1rem;
    content: "";
  }

  .custom-control-label:after {
    background: 50%/50% 50% no-repeat;
  }

  .custom-control-label .toggleTxt-bold {
    font-weight: bold;
  }

  .custom-switch .custom-control-label:after {
    // top: calc(0.25rem + 2px);
    top: 2px;
    left: calc(-2.25rem + 2px);
    width: calc(1rem - 4px);
    height: calc(1rem - 4px);
    background-color: #adb5bd;
    border-radius: 0.5rem;
    transition: background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
      -webkit-transform 0.15s ease-in-out;
    transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
      -webkit-transform 0.15s ease-in-out;
  }

  .custom-control-input:checked ~ .custom-control-label:before {
    color: #fff;
    border-color: #007bff;
    background-color: #007bff;
  }

  .custom-switch .custom-control-input:checked ~ .custom-control-label:after {
    background-color: #fff;
    -webkit-transform: translateX(0.75rem);
    transform: translateX(0.75rem);
  }

  .custom-control-input:disabled ~ .custom-control-label:before,
  .custom-control-input[disabled] ~ .custom-control-label:before {
    background-color: #cacaca;
  }

  .custom-control-input:disabled:checked ~ .custom-control-label::before {
    background-color: rgba(38, 128, 235, 0.5);
  }

  .custom-control-input:disabled:checked ~ .custom-control-label::before {
    border: 1px solid #8e8e8e;
  }

  .custom-control-input:disabled:checked ~ .custom-control-label::after,
  .custom-control-input:disabled ~ .custom-control-label::after {
    background-color: #8e8e8e;
  }

  .custom-control-sm {
    padding-left: 1.96875rem;
  }

  .custom-control-sm .custom-control-label,
  .input-group-sm .custom-switch .custom-control-label {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .custom-control-sm .custom-control-label:before,
  .input-group-sm .custom-switch .custom-control-label:before {
    top: 0.21875rem;
    left: -1.96875rem;
    width: 1.53125rem;
    height: 0.875rem;
    border-radius: 0.4375rem;
  }

  .custom-control-sm .custom-control-label:after,
  .input-group-sm .custom-switch .custom-control-label:after {
    top: calc(0.21875rem + 2px);
    left: calc(-1.96875rem + 2px);
    width: calc(0.875rem - 4px);
    height: calc(0.875rem - 4px);
    border-radius: 0.4375rem;
    background-size: 50% 50%;
  }

  .custom-control-lg,
  .input-group-lg .custom-switch {
    padding-left: 2.8125rem;
  }

  .custom-control-lg .custom-control-label,
  .input-group-lg .custom-switch .custom-control-label {
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .custom-control-lg .custom-control-label:before,
  .input-group-lg .custom-switch .custom-control-label:before {
    top: 0.3125rem;
    height: 1.25rem;
    left: -2.8125rem;
    width: 2.1875rem;
    border-radius: 0.625rem;
  }

  .custom-control-lg
    .custom-control-input:checked
    ~ .custom-control-label::after {
    background-color: rgb(255, 255, 255);
    transform: translateX(0.95rem);
  }

  .custom-control-lg .custom-control-label:after,
  .input-group-lg .custom-switch .custom-control-label:after {
    top: calc(0.3125rem + 2px);
    // left: calc(-2.8125rem + 2px);
    left: calc(-2.8rem + 2px);
    width: calc(1.25rem - 4px);
    height: calc(1.25rem - 4px);
    border-radius: 0.625rem;
    background-size: 50% 50%;
  }

  // Plumage custom styles

  .pl-custom-control-label::after,
  .pl-custom-control-label::before {
    position: absolute;
    top: 0.0625rem;
    left: -1.5rem;
    display: block;
    width: 1rem;
    height: 0.75rem;
    content: "";
  }

  .pl-custom-control-input:checked ~ .pl-custom-control-label::before {
    color: rgb(255, 255, 255);
    border-color: #323232;
    background-color: #2680eb;
  }

  .pl-custom-switch .pl-custom-control-label::after {
    top: calc(0.025 rem + 1 px);
    left: calc(-2.25 rem + 2 px);
    width: calc(1 rem - 4 px);
    height: calc(1 rem - 4 px);
    background-color: rgb(173, 181, 189);
    border-radius: 0.5 rem;
    transition: transform 0.15s ease-in-out 0s,
      background-color 0.15s ease-in-out 0s, border-color 0.15s ease-in-out 0s,
      box-shadow 0.15s ease-in-out 0s, -webkit-transform 0.15s ease-in-out 0s;
  }

  .pl-custom-control-input:disabled ~ .pl-custom-control-label:before,
  .pl-custom-control-input[disabled] ~ .pl-custom-control-label:before {
    background-color: #cacaca;
    border: 1px solid #8e8e8e;
  }

  .pl-custom-control-input:disabled ~ .pl-custom-control-label:after,
  .pl-custom-control-input[disabled] ~ .pl-custom-control-label:after {
    background-color: #8e8e8e;
  }

  .custom-switch .invalid-feedback {
    color: #b30009;
    /* display: none; */
    margin-top: 0.15rem;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }

  .custom-switch .invalid {
    color: #b30009;
  }

  .custom-switch .invalid.custom-control-label:before {
    border-color: #b30009;
  }

  .no-focus-ring:focus {
    outline: none;
  }

  [tabindex="-1"]:focus:not(:focus-visible) {
    outline: 0 !important;
  }

  /* .custom-control-input:focus + .custom-control-label {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  } */

  .keyboard-focused .custom-control-input:focus + .custom-control-label {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Example focus style */
  }
    `;
  }

  clearSelections() {
    this.state.checked = false;
    if (this.state.switches) {
      this.state.switchesArray.forEach(s => s.checked = false);
    }
    this.render();
  }
}

customElements.define("toggle-switch", ToggleSwitch);
