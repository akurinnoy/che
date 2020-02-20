/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

import { RandomSvc } from '../../utils/random.service';

// todo
// rename ngChange -> onChange
// ngModel? value?
export interface IChePfInputDirectiveBindings {
  ngModel?: any;
  form?: ng.IFormController;
  config: {
    id?: string;
    name: string;
    pattern?: string;
    placeHolder?: string;
    labelName?: string;
  };
  ngChange: ($value: string) => void;
}

interface IChePfInputDirectiveAttributes extends ng.IAttributes, IChePfInputDirectiveBindings {}

type IChePfInputDirectiveScope = { [key in keyof IChePfInputDirectiveBindings]: string };

interface IChePfInputDirectiveScopeBindings {
  scope: IChePfInputDirectiveScope;
}

export abstract class AbstrChePfInputDirective implements ng.IDirective {

  private $document: ng.IDocumentService;
  private randomSvc: RandomSvc;

  constructor(
    $document: ng.IDocumentService,
    randomSvc: RandomSvc,
  ) {
    this.$document = $document;
    this.randomSvc = randomSvc;
  }

  compile(element: ng.IAugmentedJQuery, attrs: IChePfInputDirectiveAttributes): ng.IDirectivePrePost {
    const avoidAttrs = ['ng-model', 'ng-change'];
    const keys = Object.keys(attrs.$attr);
    const inputEl = element.find('input');

    keys.forEach(key => {
      const attr = attrs.$attr[key];
      if (!attr) {
        return;
      }
      if (avoidAttrs.indexOf(attr) !== -1) {
        return;
      }

      const value = attrs[key];
      inputEl.attr(attr, value);
      element.removeAttr(attr);
    });

    return;
  }

  /**
   * Keep reference to the model controller.
   * @param $scope {ICheInputScope}
   * @param element {ng.IAugmentedJQuery}
   * @param attrs {ng.IAttributes}
   */
  link($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
    const config = $scope.config;

    // ensure input ID
    if (!config.id) {
      let idIsUnique = false;
      let id: string;
      while (idIsUnique === false) {
        id = this.randomSvc.getRandString({prefix: config.name});
        idIsUnique = this.$document.find(`#${id}`).length === 0;
      }
      config.id = id;
    }

  }

}

export class ChePfInputDirective extends AbstrChePfInputDirective {

  static $inject = [
    '$document',
    'randomSvc',
  ];

  restrict = 'E';
  replace = true;
  transclude = true;

  // we require ngModel as we want to use it inside our directive
  require = '?ngModel';

  scope: IChePfInputDirectiveScope;
  templateUrl = 'components/che-pf-widget/input/che-pf-input.html';

  constructor(
    $document: ng.IDocumentService,
    randomSvc: RandomSvc,
  ) {
    super(
      $document,
      randomSvc,
    );

    // scope values
    this.scope = {
      ngModel: '=?',
      config: '=',
      form: '=?',
      ngChange: '&?',
    };
  }

}
