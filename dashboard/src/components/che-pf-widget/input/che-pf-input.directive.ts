import { RandomSvc } from '../../utils/random.service';
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

export interface IChePfInputDirectiveBindings {
  // ngModel: ng.INgModelController;
  ngModel: any;
  form?: ng.IFormController;
  config: {
    id?: string;
    name: string;
    pattern?: string;
    placeHolder?: string;
    labelName?: string;
  };
  ngChange: (...attrs: any[]) => void;
}

interface IChePfInputDirectiveAttributes extends ng.IAttributes, IChePfInputDirectiveBindings {}

type IChePfInputDirectiveScope = { [key in keyof IChePfInputDirectiveBindings]: string };

interface IChePfInputDirectiveScopeBindings {
  scope: IChePfInputDirectiveScope;
}

export class ChePfInputDirective implements ng.IDirective, IChePfInputDirectiveScopeBindings {

  static $inject = [
    '$document',
    'randomSvc',
  ];

  restrict = 'E';
  replace = true;
  transclude = true;

  // we require ngModel as we want to use it inside our directive
  require = 'ngModel';

  scope: IChePfInputDirectiveScope;
  templateUrl = 'components/che-pf-widget/input/che-pf-input.html';

  private $document: ng.IDocumentService;
  private randomSvc: RandomSvc;

  constructor(
    $document: ng.IDocumentService,
    randomSvc: RandomSvc,
  ) {
    this.$document = $document;
    this.randomSvc = randomSvc;

    // scope values
    this.scope = {
      ngModel: '=ngModel',
      config: '=',
      form: '=?',
      ngChange: '&?',
    };
  }

  compile(element: ng.IAugmentedJQuery, attrs: IChePfInputDirectiveAttributes): ng.IDirectivePrePost {
    const avoidAttrs = ['ng-model', 'ng-change'];
    const keys = Object.keys(attrs.$attr);
    const inputEl = element.find('input');

    keys.forEach(key => {
      const attr = attrs.$attr[key];
      console.log('>>> attr', attr);
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
