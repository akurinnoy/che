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

import { CheHttpBackend } from '../../api/test/che-http-backend';
import { IChePfInputDirectiveBindings } from './che-pf-input.directive';

interface ITestScope extends ng.IScope {
  model?: IChePfInputDirectiveBindings;
}

fdescribe(`chePfInput >`, () => {

  let $scope: ITestScope;
  let $compile: ng.ICompileService;
  let $timeout: ng.ITimeoutService;
  let compiledDirective;

  /**
   *  setup module
   */
  beforeEach(angular.mock.module('userDashboard'));

  beforeEach(inject((
    _$compile_: ng.ICompileService,
    _$timeout_: ng.ITimeoutService,
    _$rootScope_: ng.IRootScopeService,
    _cheHttpBackend_: CheHttpBackend,
  ) => {
    $scope = _$rootScope_.$new() as ITestScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    const $httpBackend = _cheHttpBackend_.getHttpBackend();
    // avoid tracking requests from branding controller
    $httpBackend.whenGET(/.*/).respond(200, '');
    $httpBackend.when('OPTIONS', '/api/').respond({});
  }));

  afterEach(() => {
    $timeout.verifyNoPendingTasks();
  });

  function compile(): void {
    let buttonDropdownTemplate = `<div>
      <che-pf-input ng-model="model.ngModel"
        config="model.config"
        ng-change="model.ngChange($value)"></che-pf-input>
    </div>`;

    compiledDirective = $compile(angular.element(buttonDropdownTemplate))($scope);
    $timeout.flush();
    $scope.$digest();
  }

  it(`should be compiled >`, () => {

    const name = 'testInputName';
    let ngModel;
    $scope.model = {
      config: {
        name
      },
      ngModel,
      ngChange: () => { }
    };

    compile();

    expect(compiledDirective.find(`input`).length).toEqual(1);
  });

  it(`should have provided "name" attribute value >`, () => {

    const name = 'testInputName';
    let ngModel;
    $scope.model = {
      config: {
        name
      },
      ngModel,
      ngChange: () => { }
    };

    compile();

    expect(compiledDirective.find(`input[name="${name}"]`).length).toEqual(1);
  });

  it(`should have provided "id" attribute value >`, () => {

    const name = 'testInputName';
    const id = 'testInputId';
    let ngModel;
    $scope.model = {
      config: {
        name,
        id
      },
      ngModel,
      ngChange: () => { }
    };

    compile();

    expect(compiledDirective.find(`input[id="${id}"]`).length).toEqual(1);

  });

  it(`should have generated "id" attribute value if not provided >`, () => {

    const name = 'testInputName';
    let ngModel;
    $scope.model = {
      config: {
        name,
      },
      ngModel,
      ngChange: () => { }
    };

    compile();

    expect(compiledDirective.find(`input[id^="${name}"]`).length).toEqual(1);

  });

  it(`should have provided "pattern" attribute value >`, () => {

    const name = 'testInputName';
    const pattern = 'pattern';
    let ngModel;
    $scope.model = {
      config: {
        name,
        pattern
      },
      ngModel,
      ngChange: () => { }
    };

    compile();

    expect(compiledDirective.find(`input[pattern="${pattern}"]`).length).toEqual(1);
  });

  it(`should have provided "placeholder" attribute value >`, () => {

    const name = 'testInputName';
    const placeHolder = 'placeholder';
    let ngModel;
    $scope.model = {
      config: {
        name,
        placeHolder
      },
      ngModel,
      ngChange: () => { }
    };

    compile();

    expect(compiledDirective.find(`input[placeholder="${placeHolder}"]`).length).toEqual(1);
  });

  describe('ngModel >', () => {

    it('should correctly provide an empty value > ', () => {

      const name = 'testInputName';
      let ngModel;
      $scope.model = {
        config: {
          name,
        },
        ngModel,
        ngChange: () => { }
      };

      compile();

      expect(compiledDirective.find('input').val()).toEqual('');
    });

    it('should correctly provide not empty value > ', () => {

      const name = 'testInputName';
      let ngModel = 'initial value';
      $scope.model = {
        config: {
          name,
        },
        ngModel,
        ngChange: () => { }
      };

      compile();

      expect(compiledDirective.find('input').val()).toEqual(ngModel);
    });

  });

  describe('ngChange > ', () => {

    xit('should be called on ngModel changes > ', () => {

      const name = 'testInputName';
      let ngModel;
      let test = {
        onChange: () => { console.log('>>>>>>>>><<<<<<<<<'); }
      }
      $scope.model = {
        config: {
          name,
        },
        ngModel,
        ngChange: test.onChange
      };

      spyOn($scope.model, 'ngChange');
      compile();

      $scope.model.ngModel = 'new value';
      $scope.$digest();

      expect($scope.model.ngChange).toHaveBeenCalled();
    });
  });

  describe('Input Label > ', () => {

    it('should be hidden initially > ', () => {

      const name = 'testInputName';
      let ngModel;
      $scope.model = {
        config: {
          name,
        },
        ngModel,
        ngChange: () => { }
      };

      compile();

      expect(compiledDirective.find(`label`).length).toEqual(0);
    });

    describe('when provided', () => {

      const id = 'testInputId';
      const name = 'testInputName';
      const labelName = 'Input Test Label';
      let labelEl;

      beforeEach(() => {
        let ngModel;
        $scope.model = {
          config: {
            id,
            name,
            labelName
          },
          ngModel,
          ngChange: () => { }
        };

        compile();

        labelEl = compiledDirective.find(`label`);
      });

      it(`should be shown if provided >`, () => {
        expect(labelEl.length).toEqual(1);
      });

      it(`should have provided label name content >`, () => {
        expect(labelEl.text().trim()).toEqual(labelName);
      });

      it(`should have 'for' attribute value to equal input's 'id' attribute value >`, () => {
        expect(labelEl.attr('for')).toEqual(id);
      });

    });

  });

});
