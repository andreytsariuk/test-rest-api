# DataBase folder

### Overview

This repository contains Bookshelf Models, seeds and migrations. 

### Dependencies

All **[Models](./models)** written based on **[Bookshelf ORM](https://bookshelfjs.org/)**. Migrations and Seeds uses **[knex](https://knexjs.org/)** query builder. Also knex is the basis of *Bookshelf*.

#### The list of dependencies:

* **[Bookshelf](https://bookshelfjs.org/)** : ^0.12.0
* **[knex](https://knexjs.org/)** : ^0.13.0



### Folder Structure

* **[./migrations](./models)** - this folder contains all migration that describes DB changes;
* **[./seeds](./models)** - the folder contains seeds. This is a data that needed to start an application. Also, there are data that uses for testing; 
* **[./models](./models)** - *Bookshelf* models that describes DB tables and virtual methods that uses across the code;


### Database structure
![alt text](./docs/db_er_diagram_v2.jpeg)
