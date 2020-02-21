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

import { GetStartedToolbarController } from './get-started-toolbar.controller';
import { IDevfileMetaData } from '../../../components/api/devfile-registry.factory';

export interface IGetStartedToolbarBindingProperties {
  devfiles: IDevfileMetaData[];
  ephemeralMode: boolean;
  onFilterChange: ($filtered: IDevfileMetaData[]) => void;
  onEphemeralModeChange: ($ephemeralMode: boolean) => void;
}

export interface IGetStartedToolbarInputBinding {
  devfiles: IDevfileMetaData[];
  ephemeralMode: boolean;
}
export interface IGetStartedToolbarBindings extends IGetStartedToolbarInputBinding {
  onFilterChange: (eventObj: { $filtered: IDevfileMetaData[] }) => void;
  onEphemeralModeChange: (eventObj: { $ephemeralMode: boolean }) => void;
}

interface IGetStartedToolbarScopeBindings {
  bindings: { [key in keyof IGetStartedToolbarBindings]: string };
}

export class GetStartedToolbar implements ng.IComponentOptions, IGetStartedToolbarScopeBindings {

  templateUrl = 'app/get-started-next/toolbar/get-started-toolbar.html';
  controller = GetStartedToolbarController;
  controllerAs = 'getStartedToolbarController';

  bindings = {
    devfiles: '<',
    ephemeralMode: '<',
    onFilterChange: '&',
    onEphemeralModeChange: '&'
  };

}
