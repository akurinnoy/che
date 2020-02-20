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

export interface IChePfSecondaryButtonBindings {
  title: string;
  onClick: () => void;
}

type IChePfSecondaryButtonDirectiveScope = { [key in keyof IChePfSecondaryButtonBindings]: string };

export class ChePfSecondaryButtonDirective implements ng.IDirective {

  restrict = 'E';
  replace = true;
  templateUrl = 'components/che-pf-widget/button/che-pf-secondary-button.html';

  scope: IChePfSecondaryButtonDirectiveScope;

  constructor() {
    this.scope = {
      title: '@',
      onClick: '&'
    };
  }

}
