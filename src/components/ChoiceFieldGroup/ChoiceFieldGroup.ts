// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../RadioButton/RadioButton.ts"/>
"use strict";

namespace fabric {
  /**
   * ChoiceFieldGroup Plugin
   *
   * Adds basic demonstration functionality to .ms-ChoiceFieldGroup components.
   *
  */
  export class ChoiceFieldGroup extends CheckBox {

    private _choiceFieldGroup: HTMLElement;
    private _choiceFieldComponents: RadioButton[];

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of ChoiceFieldGroup
     * @constructor
     */
    constructor(container: HTMLElement) {
      super(container);

      this._choiceFieldGroup = <HTMLElement>document.querySelector(".ms-ChoiceFieldGroup");
      this._choiceFieldComponents = [];
      this._initalSetup();
      this._addListeners();
    }

    public removeListeners(): void {
      this._choiceFieldGroup.removeEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this));
      super.removeListeners();
      this._choiceField.removeEventListener("click", this._RadioClickHandler.bind(this));
      this._choiceField.addEventListener("keydown", this._RadioKeydownHandler.bind(this));
    }

    protected _addListeners(): void {
      document.addEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this), false);
      super._addListeners({ignore: ["keydown", "click"]});
      this._choiceField.addEventListener("click", this._RadioClickHandler.bind(this), false);
      this._choiceField.addEventListener("keydown", this._RadioKeydownHandler.bind(this), false);
    }

    private _RadioClickHandler(event: MouseEvent): void {
      event.stopPropagation();
      event.preventDefault();
      this._dispatchSelectEvent();
    }

    private _dispatchSelectEvent(): void {
      let objDict = {
        bubbles : true,
        cancelable : true,
        detail : {
          name: this._choiceField.getAttribute("name"),
          item: this
        }
      };
      this._choiceField.dispatchEvent(new CustomEvent("msChoicefield", objDict));
    }

    private _RadioKeydownHandler(event: KeyboardEvent): void {
      if (event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._choiceField.classList.contains("is-disabled")) {
            this._dispatchSelectEvent();
        }
      }
    }

    private _initalSetup(): void {
        let choiceFieldElements: NodeListOf<Element> = this._choiceFieldGroup.querySelectorAll(".ms-ChoiceField");
        for (let i: number = 0; i < choiceFieldElements.length; i++) {
            this._choiceFieldComponents[i] =  new fabric.RadioButton(<HTMLElement>choiceFieldElements[i]);
        }
    }

    private _ChoiceFieldHandler(event: CustomEvent): void {
        let name: string = event.detail.name;
        let selectedChoice: RadioButton = <RadioButton>event.detail.item;
        if ( this._choiceFieldGroup.id === name) {
            for (let i: number = 0; i < this._choiceFieldComponents.length; i++) {
                this._choiceFieldComponents[i].unCheck();
            }
            selectedChoice.check();
        }
    }
  }
}
