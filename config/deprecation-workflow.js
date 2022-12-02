// @see https://github.com/mixonic/ember-cli-deprecation-workflow
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-global" },
    { handler: "silence", matchId: "ember-simple-auth.initializer.setup-session-restoration" },
    { handler: "silence", matchId: "deprecated-run-loop-and-computed-dot-access" },
    { handler: "silence", matchId: "ember-data:default-serializer" },
    { handler: "silence", matchId: "ember-data:deprecate-array-like" },
    { handler: "silence", matchId: "ember-data:deprecate-promise-many-array-behaviors"},
    { handler: "silence", matchId: "ember-data:deprecate-promise-proxies" },
  ]
};
