import {html, css, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

@customElement('semicircle-shape')
export class SemicircleShape extends LitElement {
	//height adjustment
	@state() dh: number = 0;
	@state() ds: number = 0;

	static styles = css`
    #semicircle {
      position: relative;
      left: 200px;
      top: 200px;
      width: 150px;
      height: 80px;
      border-top-left-radius: 100px;
      border-top-right-radius: 100px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      background-color: orange;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .face {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      width: 120px;
      height: 40px;
    }
  `;

	render() {
		return html`
      <div id="semicircle">
        <div class="face">
          <moving-eye></moving-eye>
          <moving-eye></moving-eye>
        </div>
        <div style="width:120px;display:flex;align-items: center; justify-content: center">
          <moving-mouse></moving-mouse>
        </div>

      </div>`;
	}
}

@customElement('moving-eye')
export class MovingEye extends LitElement {
  //displacement of eye position
  @state() dx: number = 0;
  @state() dy: number = 0;


  static styles = css`
    .eye {
      position: absolute;
      background-color: black;
      width: 8px;
      height: 8px;
      border-radius: 5px;
    }`;

  constructor() {
    super();
    //enable the mouse detection in entire webpage instead of this shadow dom
    document.addEventListener('mousemove', event => this.moveEye(event));
  }

  //lifecycle: manually remove external event listener
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('mousemove', this.moveEye);
  }

  render() {
    return html`
      <div class="eye"
           style="transform: translate(${this.dx}px, ${this.dy}px)">

      </div>`;
  }

  moveEye(event: MouseEvent): void {
    const eye: Element | null | undefined = this.shadowRoot?.querySelector('.eye');
    if (eye) {
      const eyePosition = eye.getBoundingClientRect();
      const distance = Math.sqrt((event.clientX - eyePosition.x) ** 2 + (event.clientY - eyePosition.y) ** 2);
      //look at mouse
      if (distance > 5) {
        this.dx = (event.clientX - eyePosition.x) * (8 / distance);
        this.dy = (event.clientY - eyePosition.y) * (8 / distance);
      }
      //back to origin
      else {
        this.dx = 0;
        this.dy = 0;
      }
    }
  }
}

@customElement('moving-mouse')
export class MovingMouse extends LitElement {

  @state() dx: number = 0;
  @state() dy: number = 0;

  constructor() {
    super();
    document.addEventListener('mousemove', event => this.moveMouse(event));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('mousemove', this.moveMouse);
  }

  static styles = css`
    #mouse {
      position: relative;
      background-color: black;
      width: 12px;
      height: 5px;
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
    }`;

  render() {
    return html`
      <div id='mouse' style="transform: translate(${this.dx}px, ${this.dy}px)"></div>
    `;
  }

  moveMouse(event: MouseEvent): void {
    const mouse: Element | null | undefined = this.shadowRoot?.querySelector('#mouse');
    if (mouse) {
      const mousePosition = mouse.getBoundingClientRect();
      const distance = Math.sqrt((event.clientX - mousePosition.x) ** 2 + (event.clientY - mousePosition.y) ** 2);
      //look at mouse
      if (distance > 5) {
        this.dx = (event.clientX - mousePosition.x) * (8 / distance);
        this.dy = Math.min(0, (event.clientY - mousePosition.y) * (8 / distance));
      }
      //back to origin
      else {
        this.dx = 0;
        this.dy = 0;
      }
    }
  }
}



