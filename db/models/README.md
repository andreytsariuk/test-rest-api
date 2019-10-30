# Bookshelf Models 

### Overview

This folder contains  *Bookshelf* models that describes DB tables and virtual methods that uses across the code.


### Folder Structure

* **[./accessToken.model.js](./accessToken.model.js)** - describes different types of tokens that created. For example: token that uses for password resetting;
* **[./invite.model.js](./invite.model.js)** - describes the invite entity. It contains roles and other instruction that uses during user creation;
* **[./notification.model.js](./notification.model.js)** - this is just notification history; 
* **[./profile.model.js](./profile.model.js)** - this is model that contains user personal information such as *bulling email*, *location*, *timezone*, etc;
* **[./role.model.js](./role.model.js)** - describes allow roles that are in the system;
* **[./user.model.js](./user.model.js)** - describes user jus like a object that uses during authorization and identification processes; 
* **[./userRole.model.js](./userRole.model.js)** - describes many-to-many relations between Users and Roles; 