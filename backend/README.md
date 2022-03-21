# Toy WebApp Backend

## Prerequisite

You need [sqlite3]() installed, then create the database:

```sh
$ squite3 mydatabase.db
SQLite version 3.36.0 2021-10-26 10:02:50
Enter ".help" for usage hints.
sqlite> .databases
main: current_working_directory/toy-webapp/backend/mydatabase.db r/w
sqlite> 
```

Then `Ctrl-D` to leave.

## Install

To install, run:

```sh
npm instal
```

## Launch

To launch the backend, run:

```sh
npm run start
```

You can make some request on `http://localhost:3000`

You can also open your browser and go to `http://localhost:3000/api` to see the OpenAPI interface.
