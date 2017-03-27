# Simple Chat app

## Api Server

Full API documentation can be found in docs/API.md

## Running the server

### Bootstrap the server

    cd server/chat/
    virtualenv env -p python3
    source env/bin/activate
    pip install -r requirements.txt
    ./manage.py migrate

### Run the server

    ./manage.py runserver

### Running tests

I have set up a simple `tox.ini` to test the server against python 2.7
and 3.5. If you don't have one of those environments, you will need to
edit `tox.ini` to match your environment.

Run all environments

    tox

or just one

    tox -e py27

Note: I would usually set up tox to test all supported environments
(and versions of Django) and a "canary" build that tests unpinned
dependencies to get a heads up when things will break.

### Main Technologies

* Python 3
* Django 1.10
* Django Rest Framework



## Web Client

As one of my first non-tutorial React apps, I learned a lot developing
this page and there are a few things I would change if I was doing it again.

The `Login` and `Register` components submit handlers rely on the form
being on the page. I would change these to be more like the
`createMessage` method and take the relevant fields, instead of
processing the form. This would make the methods more reusable and
make testing easier (no having to create a dummy form);

I would like to use Redux for better state management and React Router
for URL handling. I tried a quick experiment with React Router, but
had trouble with it not rendering the correct component when the route
was change programatically (it was fine when changed via the URL or
event handlers).

I would consider using PropTypes for type checking. Coming from a
dynamic language perspective, I am happy that if it walks like a duck
and quacks like a duck I'm not too concerned if it is a
goose. However, type checking can catch issues early that may be
otherwise missed. I think it would depend on the scope of the project
and the robustness required whether or not I would implement type
checking.

I have had a quick look at optimising the rendering, (either through
`shouldUpdate` or pure components), but feel that an app of this scope
is small enough that I would be optimising prematurely.

## Running the dev server

To simplify development, the dev server proxies the Django dev servers
default host and port (http://127.0.0.1:8000). If you are running the
Django server on another machine or in a different configuration you
will need to change the "proxy" setting in `package.json` to proxy
your API server.

In production, you can set the environment variable
`REACT_APP_SERVER` to the location of the server. Please note, you
will have to set the `Access-Control-Allow-Origin` header to allow the
web client to access the API.

### Bootstrap the server

    cd web-client/chat/
    npm install

### Run the server

    npm start

### Running tests

    npm test

### Main Technologies

* ES6
* React (via create-react-app)
* Sass
