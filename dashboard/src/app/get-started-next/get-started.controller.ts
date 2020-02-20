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
import { CreateWorkspaceSvc } from '../workspaces/create-workspace/create-workspace.service';
import { CheWorkspace } from '../../components/api/workspace/che-workspace.factory';
import { DevfileRegistry, IDevfileMetaData } from '../../components/api/devfile-registry.factory';
import { CheNotification } from '../../components/notification/che-notification.factory';
import { IChePfInputDirectiveBindings } from '../../components/che-pf-widget/input/che-pf-input.directive';
import { IChePfSecondaryButtonBindings } from '../../components/che-pf-widget/button/che-pf-secondary-button.directive';
import { IChePfSwitchBindings } from '../../components/che-pf-widget/switch/che-pf-switch.directive';


/**
 * @ngdoc controller
 * @name get.started.controller:GetStartedController
 * @description This class is handling the controller for the Get Started page with template list
 * @author Oleksii Orel
 * @author Oleksii Kurinnyi
 */
export class GetStartedNextController {

  static $inject = [
    '$filter',
    '$log',
    '$q',
    'cheNotification',
    'cheWorkspace',
    'createWorkspaceSvc',
    'devfileRegistry',
  ];

  ephemeralMode: boolean;
  filterInput: IChePfInputDirectiveBindings;
  filterResultsCount: number;
  createButton: IChePfSecondaryButtonBindings;
  tmpStorage: IChePfSwitchBindings;

  $filter: ng.IFilterService;
  $log: ng.ILogService;
  $q: ng.IQService;
  cheNotification: CheNotification;
  createWorkspaceSvc: CreateWorkspaceSvc;
  devfileRegistry: DevfileRegistry;

  private isLoading: boolean = false;
  private isCreating: boolean = false;
  private devfileRegistryUrl: string;
  private selectedDevfile: IDevfileMetaData | undefined;

  private devfiles: Array<IDevfileMetaData> = [];
  private filteredDevfiles: Array<IDevfileMetaData> = [];

  /**
   * Default constructor that is using resource
   */
  constructor(
    $filter: ng.IFilterService,
    $log: ng.ILogService,
    $q: ng.IQService,
    cheNotification: CheNotification,
    cheWorkspace: CheWorkspace,
    createWorkspaceSvc: CreateWorkspaceSvc,
    devfileRegistry: DevfileRegistry,
  ) {
    this.$filter = $filter;
    this.$log = $log;
    this.$q = $q;
    this.cheNotification = cheNotification;
    this.createWorkspaceSvc = createWorkspaceSvc;
    this.devfileRegistry = devfileRegistry;

    cheWorkspace.fetchWorkspaceSettings().then(() => {
      const workspaceSettings = cheWorkspace.getWorkspaceSettings();
      this.devfileRegistryUrl = workspaceSettings && workspaceSettings.cheWorkspaceDevfileRegistryUrl;
      this.ephemeralMode = workspaceSettings['che.workspace.persist_volumes.default'] === 'false';
      this.init();
    });

    this.filterInput = {
      config: {
        name: 'filter-field',
        placeHolder: 'Filter by'
      },
      ngChange: filterBy => this.applyFilter(filterBy),
    };
    this.createButton = {
      title: 'Create a Custom Workspace',
      onClick: () => this.createWorkspace(),
    };

    this.tmpStorage = {
      config: {
        name: 'temporary-storage-switch',
        messageOn: 'Temporary Storage',
        messageOff: 'Temporary Storage',
      },
      onChange: ($value: boolean) => console.log('>>> switch was clicked, ', $value, this.ephemeralMode)
    };
  }

  onSelect(devfile: IDevfileMetaData): void {
    this.selectedDevfile = devfile;
  }

  isSelected(devfile: IDevfileMetaData): boolean {
    return this.selectedDevfile === devfile;
  }

  isCreateButtonDisabled(): boolean {
    return this.isCreating
      || !this.selectedDevfile
      || !this.selectedDevfile.links
      || !this.selectedDevfile.links.self;
  }

  private init(): void {
    if (!this.devfileRegistryUrl) {
      const message = 'Failed to load the devfile registry URL.';
      this.cheNotification.showError(message);
      this.$log.error(message);
      return;
    }
    this.isLoading = true;
    this.devfileRegistry.fetchDevfiles(this.devfileRegistryUrl).then((devfiles: Array<IDevfileMetaData>) => {
      this.devfiles = devfiles.map(devfile => {
        if (!devfile.icon.startsWith('http')) {
          devfile.icon = this.devfileRegistryUrl + devfile.icon;
        }
        return devfile;
      });
      this.applyFilter();
    }, (error: any) => {
      const message = 'Failed to load devfiles meta list.';
      this.cheNotification.showError(message);
      this.$log.error(message, error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  private createWorkspace(): ng.IPromise<void> {
    if (!this.selectedDevfile || !this.selectedDevfile.links || !this.selectedDevfile.links.self) {
      return this.$q.reject({ data: { message: 'There is no selected Template.' } });
    }
    this.isCreating = true;
    const selfLink = this.selectedDevfile.links.self;
    return this.devfileRegistry.fetchDevfile(this.devfileRegistryUrl, selfLink)
      .then(() => {
        const devfile = this.devfileRegistry.getDevfile(this.devfileRegistryUrl, selfLink);
        if (this.ephemeralMode) {
          if (!devfile.attributes) {
            devfile.attributes = {};
          }
          devfile.attributes.persistVolumes = 'false';
        }
        const attributes = { stackName: this.selectedDevfile.displayName };
        return this.createWorkspaceSvc.createWorkspaceFromDevfile(undefined, devfile, attributes, true);
      })
      .then(workspace => {
        return this.createWorkspaceSvc.redirectToIDE(workspace);
      })
      .finally(() => {
        this.isCreating = false;
      });
  }

  private applyFilter(filterBy?: string): void {
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
  }

}
