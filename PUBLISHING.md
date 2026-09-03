# Publishing the fork

The `publish` branch releases temporary builds as `@rafaeltab/sandcastle`. It is intentionally separate from
`main`, which can continue to track the upstream repository and its `@ai-hero/sandcastle` release process.

This branch versions fork releases directly instead of adding a fork-specific Changeset. The workflow does not
run Changesets, and adding release-plumbing entries for `@ai-hero/sandcastle` would pollute changes intended for
upstream. Product changes brought onto this branch should still arrive with their normal upstream Changesets.

## Publish a build

1. Update `publish` with the source commits to release. Finish all merges and conflict resolution locally before
   pushing so the remote branch only sees the final release state.
2. Preserve the upstream package name in the source checkout. The templates use it for TypeScript package
   self-references; the workflow rewrites the package name and repository metadata only after verification.
3. Set a new prerelease version in both `package.json` and `package-lock.json`, for example:

   ```bash
   npm version 0.13.0-fork.2 --no-git-tag-version
   ```

4. Commit and push the completed release state to `publish`.
5. Review the `Publish fork` workflow results and approve its `npm-preview` environment deployment.

The workflow typechecks, builds, and tests under the upstream package name, then changes only the packed artifact
to `@rafaeltab/sandcastle`. It inspects that artifact before making it available to the publish job. It publishes
only explicit prerelease versions under the `preview` dist-tag and refuses to overwrite a version that already
exists.

Consumers should pin an exact version. To keep existing Sandcastle imports unchanged, use an npm alias:

```json
"@ai-hero/sandcastle": "npm:@rafaeltab/sandcastle@0.13.0-fork.1"
```

## Authentication

Publishing uses npm Trusted Publishing with GitHub Actions OIDC. The npm configuration must authorize the
`zero-two-rafaeltab/sandcastle` repository, the `publish-fork.yml` workflow, the `npm-preview` environment, and
the `npm publish` action. The workflow does not pass a write token to npm.

Any legacy `NPM_TOKEN` environment secret is unused and can be deleted after its corresponding npm token has
been revoked.
