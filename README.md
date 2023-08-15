# clean-liquibase-migrations

clean liquibase migrations for recreated drop/create unique constraints

## Usage

When using maven liquibase plugin to generate migration, it will generate duplciate drop/create unique constraints changes. Since I didn't find any way to configure liquibase to not generate these changes, I wrote this script to clean them.

This script assume you have node and pnpm installed.

Once you ran the maven liquibase plugin, you can run this script to clean the generated changes:

```sh
pnpx @jeremiec/clean-liquibase-migrations src/main/resources/db/changelog/changes/20210923154900.yaml
```

To automate this, for example using a task runner, like Taskfile.yml, you can use the following task:

```yml
tasks:
  db:generate_migration:
    desc: generate db migration according to database/entity
    vars:
      DATE_WITH_TIME:
        sh: /bin/date "+%Y%m%d%H%M%S"
    cmds:
      - mvn liquibase:diff -Dliquibase.diffChangeLogFile="src/main/resources/db/changelog/changes/{{.DATE_WITH_TIME}}.yaml"
      - pnpx @jeremiec/clean-liquibase-migrations src/main/resources/db/changelog/changes/{{.DATE_WITH_TIME}}.yaml
      - echo "  - include:" >> src/main/resources/db/changelog/db.changelog-master.yaml
      - |
        echo "      file: db/changelog/changes/{{.DATE_WITH_TIME}}.yaml" >> src/main/resources/db/changelog/db.changelog-master.yaml
        echo ""
        echo "MIGRATION FILE GENERATED {{.DATE_WITH_TIME}}.yaml"
        echo "CHECK IF IT IS CORRECT AND SUITS YOUR NEEDS"
        echo "RESTART THE APP TO APPLY THE MIGRATION"
```

## Dev

[Install node](https://github.com/Schniz/fnm#installation) and [install pnpm](https://pnpm.io/installation).

Then install the dependencies:

```sh
fnm use || nvm use
pnpm i
```

You can run tests with:

```sh
pnpm test
```
