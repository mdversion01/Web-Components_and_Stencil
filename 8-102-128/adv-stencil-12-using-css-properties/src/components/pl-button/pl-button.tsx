import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'pl-button',
  styleUrl: 'pl-button.css', // Replace with the correct stylesheet file
  // shadow: true, // Use Shadow DOM
})
export class PlButton {
  // Define all properties
  @Prop() absolute: boolean = false;
  @Prop() ariaLabel: string = '';
  @Prop() block: boolean = false;
  @Prop() bottom: string = '';
  @Prop() btnIcon: boolean = false;
  @Prop() btnText: string = '';
  @Prop() classNames: string = '';
  @Prop() disabled: boolean = false;
  @Prop() end: boolean = false;
  @Prop() fixed: boolean = false;
  @Prop() groupBtn: boolean = false;
  @Prop() iconBtn: boolean = false;
  @Prop() slotLeft: boolean = false;
  @Prop() slotRight: boolean = false;
  @Prop() styles: string = '';
  @Prop() left: string = '';
  @Prop() link: boolean = false;
  @Prop() outlined: boolean = false;
  @Prop() pressed: boolean | string = false;
  @Prop() right: string = '';
  @Prop() ripple: boolean = false;
  @Prop() shape: string = '';
  @Prop() size: string = '';
  @Prop() start: boolean = false;
  @Prop() text: boolean = false;
  @Prop() textBtn: boolean = false;
  @Prop() title: string = '';
  @Prop() top: string = '';
  @Prop() url: string = '';
  @Prop() variant: string = '';
  @Prop() vertical: boolean = false;
  @Prop() zIndex: string = '';

  @Prop() isOpen: boolean = false;
  @Prop() targetId: string = '';
  @Prop() accordion: boolean = false;

  // Define events
  @Event() customClick: EventEmitter;

  private handleClick() {
    this.customClick.emit();
  }

  // private getDynamicStyles(): string {
  //   return [
  //     this.absolute && 'position: absolute;',
  //     this.left && `left: ${this.left}px;`,
  //     this.right && `right: ${this.right}px;`,
  //     this.top && `top: ${this.top}px;`,
  //     this.bottom && `bottom: ${this.bottom}px;`,
  //     this.fixed && 'position: fixed;',
  //     this.zIndex && `z-index: ${this.zIndex};`,
  //   ]
  //     .filter(Boolean)
  //     .join(' ');
  // }

  private getDynamicStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.absolute) styles.position = 'absolute';
    if (this.fixed) styles.position = 'fixed';
    if (this.left) styles.left = `${this.left}px`;
    if (this.right) styles.right = `${this.right}px`;
    if (this.top) styles.top = `${this.top}px`;
    if (this.bottom) styles.bottom = `${this.bottom}px`;
    if (this.zIndex) styles['z-index'] = this.zIndex;

    return styles;
  }


  private renderButtonContent() {
    return this.iconBtn || this.btnIcon ? (
      <slot></slot>
    ) : (
      [
        this.slotLeft && <slot name="left"></slot>,
        <span class="pl-btn__content">
          {this.btnText}
          <slot></slot>
        </span>,
        this.slotRight && <slot name="right"></slot>
      ]
    );
  }


  render() {
    // const dynamicStyles = `${this.styles} ${this.getDynamicStyles()}`.trim();
    const dynamicStyles = this.getDynamicStyles(); // now an object

    const classList = [
      'pl-btn',
      this.classNames,
      this.outlined ? 'pl-btn--outlined' : '',
      this.block ? 'pl-btn--block' : '',
      this.variant,
      this.size,
      this.shape,
      this.groupBtn ? (this.vertical ? 'pl-btn-group-vertical' : 'pl-btn-group') : '',
      this.ripple ? 'pl-btn-ripple' : '',
    ]
      .filter(Boolean)
      .join(' ');

    // const buttonProps = {
    //   'aria-pressed': this.pressed === 'true' || this.pressed === 'false' ? this.pressed : undefined,
    //   'aria-label': this.ariaLabel || this.btnText || 'Button',
    //   style: dynamicStyles,
    //   class: classList,
    //   disabled: this.disabled,
    //   onClick: () => this.handleClick(),
    // };

    const buttonProps = {
      'aria-pressed': this.pressed === 'true' || this.pressed === 'false' ? this.pressed : undefined,
      'aria-label': this.ariaLabel || this.btnText || 'Button',
      style: dynamicStyles,
      class: classList,
      disabled: this.disabled,
      onClick: () => this.handleClick(),
    };


    return this.link ? (
      <a {...buttonProps} href={this.url || '#'}>
        {this.renderButtonContent()}
      </a>
    ) : (
      <button {...buttonProps} title={this.title}>
        {this.renderButtonContent()}
      </button>
    );
  }
}
