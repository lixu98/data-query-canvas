/* eslint-disable max-len */
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
/* 指定要測試的資料夾及檔案 */
const tests = [];
tests.push(require.context('./app/showcase/programs/demo1/account-info', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/asis', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/document-order', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/dynamic-listwin', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/gridster', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/group', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/order', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/tree', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo1/tree-menu', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/ag-grid', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/dw-custom-table-display', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/dw-demo-image-viewer', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/extra-fields/order', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/extra-fields/repository', true, /(\.spec\.ts$)/));
// // tests.push(require.context('./app/showcase/programs/demo2/extra-fields', true, /(extra-fields-routing\.module\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/extra-fields/document', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/form-items', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/input-listwin', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/job-schedule', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/messages', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/mock-demo', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/organize-tree', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/pagination', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/repository/testing', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/programs/demo2/update-password', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/shared/select-modal', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/shared/dynamic-modal/sbep-query', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/auth/forget', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/auth/login', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/home', true, /(\.spec\.ts$)/));
tests.push(require.context('./app/showcase/layout', true, /(\.spec\.ts$)/));
tests.forEach(t => t.keys().map(t));
