/*
 * Copyright (c) 2015-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';

import './recent-workspaces.styl';

/**
 * @ngdoc directive
 * @name navbar.directive:NavbarRecentWorkspaces
 * @description This class is handling the directive of the listing recent opened workspaces in the navbar
 * @author Oleksii Kurinnyi
 */
export class NavbarRecentWorkspaces {
  restrict: string;
  template: string;
  controller: string;
  controllerAs: string;
  bindToController: boolean;

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor() {
    this.restrict = 'E';
    this.template = require('./recent-workspaces.html');

    this.controller = 'NavbarRecentWorkspacesController';
    this.controllerAs = 'navbarRecentWorkspacesController';
    this.bindToController = true;
  }

}
