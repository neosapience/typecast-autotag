# Publishing

This repository publishes Typecast Autotag to public package registries under Neosapience-owned package coordinates.

## Published Packages

| Ecosystem | Package | Workflow |
| --- | --- | --- |
| npm | `@neosapience/typecast-autotag` | `.github/workflows/publish-npm.yml` |
| PyPI | `typecast-autotag` | `.github/workflows/publish-pypi.yml` |
| Maven Central | `com.neosapience:typecast-autotag` | `.github/workflows/publish-maven.yml` |

## Required GitHub Secrets

Do not commit credential values. Configure these as repository secrets:

| Secret | Used by |
| --- | --- |
| `PYPI_API_TOKEN` | PyPI publish workflow |
| `CENTRAL_USERNAME` | Maven Central publish workflow |
| `CENTRAL_PASSWORD` | Maven Central publish workflow |
| `GPG_PRIVATE_KEY_BASE64` | Maven Central artifact signing |
| `GPG_PASSPHRASE` | Maven Central artifact signing |

npm uses GitHub Actions OIDC trusted publishing for `@neosapience/typecast-autotag`, so it does not require an npm token secret.

## Release Checklist

Packages have independent versions. An npm release must not change Python, Java, or the native library version.

1. Update only the package being released:
   - npm: `package.json` and `CHANGELOG.md`.
   - Python: `node scripts/sync-python-version.js <python-version>` updates both Python version fields.
   - Java: `java-binding/pom.xml`.
   - Native C library: `TYPECAST_VERSION` in `c-binding/include/typecast_autotag.h`; rebuild and test the native assets before distributing them.

2. Validate the affected package. For npm and the browser demo:

   ```bash
   pnpm install --frozen-lockfile
   pnpm typecheck
   pnpm lint
   pnpm test:coverage --runInBand
   pnpm build
   cd demo-html
   pnpm install --frozen-lockfile
   pnpm build
   pnpm test
   ```

   Native changes also require `pnpm test:e2e`, `pnpm test:python`, and `pnpm test:java` after rebuilding libraries. Packaging-only changes must test the installed artifact on its supported platforms.

3. Merge the reviewed version change, then run only the affected registry workflow from that commit. The npm workflow validates, publishes with provenance, and creates a GitHub Release named `npm vX.Y.Z` at that commit. It does not attach unrelated native binaries. `pnpm release:dry` / `pnpm release` remain available for preparing an npm version/tag with release-it; they neither create a GitHub Release nor synchronize other ecosystems. Before publishing, the workflow rejects an existing version tag that points to another commit; it checks the tag again before recording the release.

4. Verify each published registry version against its own manifest and source commit:

   ```bash
   npm view @neosapience/typecast-autotag version gitHead
   python -m pip index versions typecast-autotag
   mvn --batch-mode --no-transfer-progress -f java-binding/pom.xml help:evaluate \
     -Dexpression=project.version -q -DforceStdout
   ```

   For Maven artifact verification, use that Java version in `dependency:get -Dartifact=com.neosapience:typecast-autotag:<java-version> -Dtransitive=false`. Check the installed artifact as a consumer, not only the workflow status.

## Notes

- npm package name is scoped: `@neosapience/typecast-autotag`.
- PyPI package name is unscoped because PyPI project names do not use npm-style scopes.
- Maven artifact group is `com.neosapience`; the Java package namespace remains `ai.typecast.autotag`.
- C/C++ consumers should continue to use GitHub Release native binaries or build from source.
