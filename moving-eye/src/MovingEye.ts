import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {animate} from '@lit-labs/motion';

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

@customElement('semi-circle')
export class SemiCircle extends LitElement {
	//height adjustment
	@state() dh: number = 0;

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
        justify-content: center;
        //transform: skewX(-10deg);
      }

      #face {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        width: 120px;
        height: 60px;
      }
	`;

	constructor() {
		super();
		document.addEventListener('mousemove', event => this.moveBody(event));
	}

	render() {
		return html`
            <div id="semicircle">
                <div id="face">
                    <moving-eye></moving-eye>
                    <moving-eye></moving-eye>
                </div>
            </div>`;
	}

	moveBody(event: MouseEvent): void {
		const body: Element | null | undefined = this.shadowRoot?.querySelector('#semi-circle');
		if (body) {
			const bodyPosition = body.getBoundingClientRect();
			//mouse is above the body
			if (event.clientY < bodyPosition.y) {
				this.dh = (bodyPosition.y - event.clientY) / 20;
			}else{
				this.dh = 0
			}
		}
	}
}
