# Enhanced Playwright JUnit XML reporter compatible with Xray

[![npm version](https://img.shields.io/npm/v/@xray-app/playwright-junit-reporter.svg?style=flat-square)](https://www.npmjs.com/package/@xray-app/playwright-junit-reporter)
[![build workflow](https://github.com/Xray-App/playwright-junit-reporter/actions/workflows/build.yml/badge.svg)](https://github.com/Xray-App/playwright-junit-reporter/actions/workflows/build.yml)
[![license](https://img.shields.io/badge/License-Apache%202-green.svg)](https://opensource.org/license/apache-2-0/)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/Xray-App/community)
[![npm downloads](https://img.shields.io/npm/dm/@xray-app/playwright-junit-reporter.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@xray-app/playwright-junit-reporter)

This enhanced JUnit reporter produces a JUnit-style XML report, supported by [Xray](https://www.getxray.app).
Until Playwright v1.33, Playwright's built-in `junit` reporter provided support for Xray enhancements; as of v1.34 that support is removed from the Playwright project itself and is supported through this project, having the same set of features.

## Installation

Run the following commands:

### npm

`npm install @xray-app/playwright-junit-reporter --save-dev`

### yarn

`yarn add @xray-app/playwright-junit-reporter --dev`

## Usage

Most likely you want to write the report to an xml file. When running with `--reporter=@xray-app/playwright-junit-reporter`, use `PLAYWRIGHT_JUNIT_OUTPUT_NAME` environment variable:

```bash tab=bash-bash
PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml npx playwright test --reporter=@xray-app/playwright-junit-reporter
```

```batch tab=bash-batch
set PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml
npx playwright test --reporter=@xray-app/playwright-junit-reporter
```

```powershell tab=bash-powershell
$env:PLAYWRIGHT_JUNIT_OUTPUT_NAME="results.xml"
npx playwright test --reporter=@xray-app/playwright-junit-reporter
```

In configuration file, pass options directly:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['@xray-app/playwright-junit-reporter', { outputFile: 'results.xml' }]],
});
```

The JUnit reporter provides support for embedding additional information on the `testcase` elements using inner `properties`. This is based on an [evolved JUnit XML format](https://docs.getxray.app/display/XRAYCLOUD/Taking+advantage+of+JUnit+XML+reports) from Xray Test Management, but can also be used by other tools if they support this way of embedding additional information for test results; please check it first.

In configuration file, a set of options can be used to configure this behavior. A full example, in this case for Xray, follows ahead.

```js
import { defineConfig } from '@playwright/test';

// JUnit reporter config for Xray
const xrayOptions = {
  // Whether to add <properties> with all annotations; default is false
  embedAnnotationsAsProperties: true,

  // By default, annotation is reported as <property name='' value=''>.
  // These annotations are reported as <property name=''>value</property>.
  textContentAnnotations: ['test_description'],

  // This will create a "testrun_evidence" property that contains all attachments. Each attachment is added as an inner <item> element.
  // Disables [[ATTACHMENT|path]] in the <system-out>.
  embedAttachmentsAsProperty: 'testrun_evidence',

  // Where to put the report.
  outputFile: './xray-report.xml'
};

export default defineConfig({
  reporter: [['@xray-app/playwright-junit-reporter', xrayOptions]]
});
```

In the previous configuration sample, all annotations will be added as `<property>` elements on the JUnit XML report. The annotation type is mapped to the `name` attribute of the `<property>`, and the annotation description will be added as a `value` attribute. In this case, the exception will be the annotation type `testrun_evidence` whose description will be added as inner content on the respective `<property>`.
Annotations can be used to, for example, link a Playwright test with an existing Test in Xray or to link a test with an existing story/requirement in Jira (i.e., "cover" it).

```js
// example.spec.ts/js
import { test } from '@playwright/test';

test('using specific annotations for passing test metadata to Xray', async ({}, testInfo) => {
  testInfo.annotations.push({ type: 'test_id', description: '1234' });
  testInfo.annotations.push({ type: 'test_key', description: 'CALC-2' });
  testInfo.annotations.push({ type: 'test_summary', description: 'sample summary' });
  testInfo.annotations.push({ type: 'requirements', description: 'CALC-5,CALC-6' });
  testInfo.annotations.push({ type: 'test_description', description: 'sample description' });
});
```

Please note that the semantics of these properties will depend on the tool that will process this evolved report format; there are no standard property names/annotations.

If the configuration option `embedAttachmentsAsProperty` is defined, then a `property` with its name is created. Attachments, including their contents, will be embedded on the JUnit XML report inside `<item>` elements under this `property`. Attachments are obtained from the `TestInfo` object, using either a path or a body, and are added as base64 encoded content.
Embedding attachments can be used to attach screenshots or any other relevant evidence; nevertheless, use it wisely as it affects the report size.

The following configuration sample enables embedding attachments by using the `testrun_evidence` element on the JUnit XML report:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['@xray-app/playwright-junit-reporter', { embedAttachmentsAsProperty: 'testrun_evidence', outputFile: 'results.xml' }]],
});
```

The following test adds attachments:

```js
// example.spec.ts/js
import { test } from '@playwright/test';

test('embed attachments, including its content, on the JUnit report', async ({}, testInfo) => {
  const file = testInfo.outputPath('evidence1.txt');
  require('fs').writeFileSync(file, 'hello', 'utf8');
  await testInfo.attach('evidence1.txt', { path: file, contentType: 'text/plain' });
  await testInfo.attach('evidence2.txt', { body: Buffer.from('world'), contentType: 'text/plain' });
});
```

## TO DOs

- implement code coverage
- address issues in the upstream Playwright project
- integrate with @xray-app/xray-automation-js to upload results
- cleanup

## Contact

You may find me on [Twitter](https://twitter.com/darktelecom).
Any questions related with this code, please raise issues in this GitHub project. Feel free to contribute and submit PR's.
For Xray specific questions, please contact [Xray's support team](https://jira.getxray.app/servicedesk/customer/portal/2).

## References

- [How Xray processes JUnit XML reports](https://docs.getxray.app/display/XRAYCLOUD/Taking+advantage+of+JUnit+XML+reports)

## LICENSE

Based on code from [Playwright](https://github.com/microsoft/playwright/) project.

[Apache License v2.0](LICENSE)
