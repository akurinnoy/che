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
import { AbstrChePfInputDirective } from '../input/che-pf-input.directive';

export interface IChePfSwitchBindings {
  config: {
    id?: string;
    name: string;
    messageOn?: string;
    messageOff?: string;
  };
  myModel?: any;
  onChange: ($value: boolean) => void;
}

type IChePfSwitchDirectiveScope = { [key in keyof IChePfSwitchBindings]: string };

export class ChePfSwitchDirective extends AbstrChePfInputDirective {

  static $inject = [
    '$document',
    'randomSvc',
  ];

  restrict = 'E';
  replace = true;
  transclude = true;

  // we require ngModel as we want to use it inside our directive
  require = '?ngModel';

  templateUrl = 'components/che-pf-widget/switch/che-pf-switch.html';
  scope: IChePfSwitchDirectiveScope;

  constructor(
    $document: ng.IDocumentService,
    randomSvc: RandomSvc,
  ) {
    super(
      $document,
      randomSvc,
    );

    this.scope = {
      config: '=',
      myModel: '=?',
      onChange: '&?'
    };
  }

}
