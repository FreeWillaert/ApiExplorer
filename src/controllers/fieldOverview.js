'use strict';
var pluck = require('lodash/collection/pluck');
var map = require('lodash/collection/map');
var assign = require('lodash/object/assign');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var forOwn = require('lodash/object/forOwn');
var has = require('lodash/object/has');
var partial = require('lodash/function/partial');
var first = require('lodash/array/first');

function isReference(item) {
  return has(item, '_self');
}

function unpackTranslations(locale, field) {
  var copy = assign({}, field);
  forOwn(copy, function(v, k) {
    if (isObject(v) && isReference(v)) {
      copy[k] = v.values[locale];
    }
    if (isArray(v)) {
      copy[k] = map(v, partial(unpackTranslations, locale))
    }
  });
  return copy;
}

module.exports = function($scope, $stateParams, $timeout, FieldSvc, LocaleSvc) {
  var flow = $stateParams.flow
  var field = $stateParams.field
  // I should get the schema attributes as well, then schema attrs should just
  // be a dropdown. Advanced mode: Disable the options that are taken by other
  // fields.
  LocaleSvc
    .getAll(flow)
    .then(function(resp) {
      $scope.locales = pluck(resp.data, 'name')
    });
  FieldSvc
    .get(flow, field)
    .then(function(resp) {
      $scope.field = resp.data
    });

  $scope.emptyValue = ""
  $scope.locales = ['en-US']
  $scope.selectedLocale = first($scope.locales)
  $scope.errors = {}

  function idleSaveButton() {
    $scope.saveButtonText = "Save Field"
    $scope.saveButtonDisabled = false;
    $scope.saveButtonClasses = [
      'btn',
      'btn-primary',
      'btn-lg'
    ]
  }

  function workingSaveButton() {
    $scope.saveButtonText = "Saving..."
    $scope.saveButtonDisabled = true;
    $scope.saveButtonClasses = [
      'btn',
      'btn-primary',
      'btn-lg'
    ]
  }

  function successSaveButton() {
    $scope.saveButtonText = "Success!"
    $scope.saveButtonDisabled = false;
    $scope.saveButtonClasses = [
      'btn',
      'btn-success',
      'btn-lg'
    ]
    $timeout(idleSaveButton, 2000);
  }

  $scope.save = function() {
    $scope.errors = {};
    workingSaveButton();
    FieldSvc
      .saveLocalized(
        flow,
        $scope.selectedLocale,
        field,
        unpackTranslations($scope.selectedLocale, $scope.field))
      .then(successSaveButton)
      .catch(function(resp) {
        // There's much that can be done with these :)
        $scope.errors = resp.data.errors;
        idleSaveButton();
      });
  }

  idleSaveButton();
}
