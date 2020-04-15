# Inject html/css partials with Gulp and Browsersync

After you clone this project you may try to install all dependencies using

    yarn

Before you start the server, you need to install gulp globally.

    yarn gulp -g

Then run the command below:

### 1. Config new script to create and run subproject:

    "init:[_subproject_]": "PROJECT=[_subproject_] gulp create-subproject"  // create subproject
    "run:[_subproject_]": "PROJECT=[_subproject_] gulp"                     // convert sass to css, inject content html and hot reload browser

Browsersync should automatically open a browser on port 3000

Example:

`"init:helloworld": "PROJECT=helloworld gulp create-subproject"`

`"run:helloworld": "PROJECT=helloworld gulp"`

### 2. Your subproject will compile in `.dist/[_subproject_]`

> **WARNING <img class="emoji" alt="tada" height="20" width="20" src="https://github.githubassets.com/images/icons/emoji/unicode/1f389.png">: Don't delete `.engine` directory.**
