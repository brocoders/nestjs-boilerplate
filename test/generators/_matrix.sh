#!/usr/bin/env bash
#
# Generator matrix shared by run-static.sh and run-crud-*.sh.
# Sourced — never run directly.

run_matrix() {
  local VARIANT="$1"
  local GEN_RES="generate:resource:${VARIANT}"
  local ADD_PROP="add:property:to-${VARIANT}"

  # Order matters: oneToMany on Article references Comment, so Comment must exist
  # before that property is added.
  npm run "$GEN_RES" -- --name Tag
  npm run "$GEN_RES" -- --name Comment
  npm run "$GEN_RES" -- --name Article

  npm run "$ADD_PROP" -- --name Tag --property name --kind primitive --type string --isAddToDto true --isOptional false --isNullable false

  npm run "$ADD_PROP" -- --name Comment --property text --kind primitive --type string --isAddToDto true --isOptional false --isNullable false

  npm run "$ADD_PROP" -- --name Article --property title       --kind primitive --type string  --isAddToDto true  --isOptional false --isNullable false
  npm run "$ADD_PROP" -- --name Article --property subtitle    --kind primitive --type string  --isAddToDto true  --isOptional true  --isNullable false
  npm run "$ADD_PROP" -- --name Article --property summary     --kind primitive --type string  --isAddToDto true  --isOptional true  --isNullable true
  npm run "$ADD_PROP" -- --name Article --property views       --kind primitive --type number  --isAddToDto true  --isOptional false --isNullable false
  npm run "$ADD_PROP" -- --name Article --property isPublished --kind primitive --type boolean --isAddToDto true  --isOptional false --isNullable false
  npm run "$ADD_PROP" -- --name Article --property publishedAt --kind primitive --type Date    --isAddToDto true  --isOptional true  --isNullable true
  npm run "$ADD_PROP" -- --name Article --property hireDate    --kind primitive --type Date    --isAddToDto true  --isOptional false --isNullable false

  npm run "$ADD_PROP" -- --name Article --property coverImage  --kind reference    --type File    --referenceType oneToOne   --isAddToDto true --isOptional true  --isNullable true
  npm run "$ADD_PROP" -- --name Article --property author      --kind reference    --type User    --referenceType manyToOne  --isAddToDto true --isOptional false --isNullable false
  npm run "$ADD_PROP" -- --name Article --property tags        --kind reference    --type Tag     --referenceType manyToMany --isAddToDto true --isOptional true  --isNullable false

  npm run "$ADD_PROP" -- --name Article --property comments    --kind reference    --type Comment --referenceType oneToMany  --propertyInReference article --isAddToDto false --isOptional true --isNullable false

  npm run "$ADD_PROP" -- --name Article --property denormalizedAuthor --kind denormalized --type User --referenceType manyToOne --isAddToDto true --isOptional false --isNullable false

  npm run "$ADD_PROP" -- --name Article --property editor --kind reference --type User --referenceType manyToOne --isAddToDto true --isOptional true --isNullable false --shouldAutoLoad false

  npm run "$ADD_PROP" -- --name Article --property internalNote --kind primitive --type string --isAddToDto false --isOptional true --isNullable true
}
