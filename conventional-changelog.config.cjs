"use strict";
const angular = require("conventional-changelog-angular");

const newHeader = `
{{#if isPatch~}}
 ##
{{~else~}}
 #
{{~/if}} {{#if @root.linkCompare~}}
 [{{version}}](
 {{~#if @root.repository~}}
   {{~#if @root.host}}
     {{~@root.host}}/
   {{~/if}}
   {{~#if @root.owner}}
     {{~@root.owner}}/
   {{~/if}}
   {{~@root.repository}}
 {{~else}}
   {{~@root.repoUrl}}
 {{~/if~}}
 /compare/diff?targetBranch=refs%2Ftags%2F{{previousTag}}&sourceBranch=refs%2Ftags%2F{{currentTag}})
{{~else}}
 {{~version}}
{{~/if}}
{{~#if title}} "{{title}}"
{{~/if}}
{{~#if date}} ({{date}})
{{/if}}
`;

module.exports = angular.then((option) => {
  option.writerOpts.headerPartial = newHeader;
  return option;
});
