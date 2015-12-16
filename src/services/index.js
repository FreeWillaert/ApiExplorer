'use strict';

require('angular').module('capi-ui')
.constant('CapiBaseDomain', require('./capiBaseDomain'))
.service('CredentialSvc', require('./credentials'))
.service('FieldMetaSvc', require('./fieldMeta'))
.service('FieldSvc', require('./fields'))
.service('FlowSvc', require('./flows'))
.service('FormSvc', require('./forms'))
.service('HttpSvc', require('./http'))
.service('LocaleSvc', require('./locales'))
.service('SchemaSvc', require('./schemas'))
.service('TranslationSvc', require('./translations'))
.service('UtilsSvc', require('./utils'))
