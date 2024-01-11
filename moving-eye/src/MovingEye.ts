import {html, css, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {animate} from '@lit-labs/motion';

@customElement('moving-eye')
export class MovingEye extends LitElement {
  //displacement of eye position
  @state() dx = 0;
  @state() dy = 0;

  static styles = css`
    #eye {
      position: absolute;
      left: 200px;
      top: 200px;
      background-color: black;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      //transform: translate(-50%, -50%);
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
      <div id="eye" style="transform: translate(${this.dx}px, ${this.dy}px)" ></div>`;
  }

  moveEye(event: MouseEvent) {
    const pupil: Element | null | undefined = this.shadowRoot?.querySelector('#eye');
    if (pupil) {
      const pupilPosition = pupil.getBoundingClientRect();
      const distance = Math.sqrt((event.clientX - pupilPosition.x) ** 2 + (event.clientY - pupilPosition.y) ** 2);
      //look at mouse
      if (distance > 50) {
        this.dx = (event.clientX - pupilPosition.x) * (50 / distance);
        this.dy = (event.clientY - pupilPosition.y) * (50 / distance);
      }
      //back to origin
      else{
        this.dx = 0;
        this.dy = 0;
      }
    }
  }


}
