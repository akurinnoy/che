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

import { GetStartedNextController } from './get-started.controller';
import { GetStartedNextConfigService } from './get-started-config.service';

/**
 * @name getStarted:GetStartedConfig
 * @description This class is used for configuring all get started devfiles.
 * @author Oleksii Orel
 */
export class GetStartedNextConfig {

  constructor(register: che.IRegisterService) {
    register.controller('GetStartedNextController', GetStartedNextController);

    register.service('getStartedNextConfigService', GetStartedNextConfigService);

    // config routes
    register.app.config(['$routeProvider', ($routeProvider: any) => {
      $routeProvider.accessWhen('/getstarted-next', {
        title: 'Get Started',
        templateUrl: 'app/get-started-next/get-started.html',
        controller: 'GetStartedNextController',
        controllerAs: 'getStartedNextController',
        // resolve: {
        //   initData: ['$q', 'getStartedNextConfigService, userDashboardConfig',
        //     ($q: ng.IQService, svc: GetStartedNextConfigService, userDashboardConfig) => {
        //       if (userDashboardConfig.developmentMode) {
        //         return svc.allowGetStartedRoutes();
        //       }
        //       return $q.reject();
        //     }]
        // }
      });
    }]);
  }
}
