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

1. Confirm all package versions are synchronized.

   ```bash
   pnpm sync:version
   ```

2. Run the local validation suite before cutting a release.

   ```bash
   pnpm install --frozen-lockfile
   pnpm build
   pnpm typecheck
   pnpm test
   ```

3. Create the GitHub release and tag.

   ```bash
   pnpm release:dry
   pnpm release
   ```

4. Run the registry publishing workflows from GitHub Actions.

   - `Publish npm package`
   - `Publish Python package`
   - `Publish Maven package`

5. Verify the published packages.

   ```bash
   npm view @neosapience/typecast-autotag version
   python -m pip index versions typecast-autotag
   mvn --batch-mode --no-transfer-progress dependency:get \
     -Dartifact=com.neosapience:typecast-autotag:$(node -p "require('./package.json').version") \
     -Dtransitive=false
   ```

## Notes

- npm package name is scoped: `@neosapience/typecast-autotag`.
- PyPI package name is unscoped because PyPI project names do not use npm-style scopes.
- Maven artifact group is `com.neosapience`; the Java package namespace remains `ai.typecast.autotag`.
- C/C++ consumers should continue to use GitHub Release native binaries or build from source.
