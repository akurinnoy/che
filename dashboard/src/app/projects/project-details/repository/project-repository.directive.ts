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

import './project-repository.styl';

/**
 * Defines a directive for displaying project repository widget.
 * @author Oleksii Orel
 */
export class ProjectRepository {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor() {
    this.restrict = 'E';

    this.template = require('./project-repository.html');

    this.controller = 'ProjectRepositoryController';
    this.controllerAs = 'projectRepositoryController';

    this.bindToController = true;

    this.scope = true;

  }

}
