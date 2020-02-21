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

import { IDevfileMetaData } from '../../../components/api/devfile-registry.factory';
import { IChePfInputDirectiveBindings } from '../../../components/che-pf-widget/input/che-pf-input.directive';
import { IChePfSwitchBindings } from '../../../components/che-pf-widget/switch/che-pf-switch.directive';
import { IGetStartedToolbarInputBinding, IGetStartedToolbarBindings } from './get-started-toolbar.component';

type OnChangeObject = {
  [key in keyof IGetStartedToolbarInputBinding]: ng.IChangesObject<IGetStartedToolbarInputBinding[key]>;
};

export class GetStartedToolbarController implements IGetStartedToolbarBindings {

  static $inject = [
    '$filter'
  ];

  // component bindings
  ephemeralMode: boolean;
  devfiles: IDevfileMetaData[];
  onFilterChange: (eventObj: {$filtered: IDevfileMetaData[]}) => void;
  onEphemeralModeChange: (eventObj: {$ephemeralMode: boolean}) => void;

  filterInput: IChePfInputDirectiveBindings;
  filterResultsCount: number;
  tmpStorage: IChePfSwitchBindings;
  filteredDevfiles: Array<IDevfileMetaData> = [];
  selectedDevfile: IDevfileMetaData | undefined;

  // injected services
  private $filter: ng.IFilterService;

  constructor(
    $filter: ng.IFilterService,
  ) {
    this.$filter = $filter;

    this.filterInput = {
      config: {
        name: 'filter-field',
        placeHolder: 'Filter by'
      },
      ngChange: filterBy => this.filterDevfiles(filterBy),
    };

    this.tmpStorage = {
      config: {
        name: 'temporary-storage-switch',
        messageOn: 'Temporary Storage',
        messageOff: 'Temporary Storage',
      },
      onChange: mode => this.changeEphemeralMode(mode)

    };
  }

  $onChanges(onChangesObj: OnChangeObject): void {
    if (onChangesObj.devfiles && onChangesObj.devfiles.currentValue) {
      this.filterDevfiles();
    }
  }

  private filterDevfiles(filterBy?: string): void {
    if (!filterBy) {
      filterBy = '';
    }
    const value = filterBy.toLocaleLowerCase();
    this.filteredDevfiles = this.$filter('filter')(this.devfiles, devfile => {
      return devfile.displayName.toLowerCase().includes(value) || devfile.description.toLowerCase().includes(value);
    });
    if (this.filteredDevfiles.findIndex(devfile => devfile === this.selectedDevfile) === -1) {
      this.selectedDevfile = undefined;
    }
    this.filterResultsCount = this.filteredDevfiles.length;

    this.onFilterChange({$filtered: this.filteredDevfiles});
  }

  private changeEphemeralMode(mode: boolean): void {
    this.onEphemeralModeChange({ $ephemeralMode: mode });
  }

}
