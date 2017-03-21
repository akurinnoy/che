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

import './navbar.html';
import './navbar.styl';

/**
 * Defines a directive for creating navbar.
 * @author Florent Benoit
 */
export class CheNavBar {
  private replace: boolean;
  private restrict: string;
  private template: string;
  private controller: string;
  private controllerAs: string;

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor () {
    this.restrict = 'E';
    this.replace = false;
    this.template = require('./navbar.html');
    this.controller = 'CheNavBarController';
    this.controllerAs = 'navbarCtrl';
  }

}
