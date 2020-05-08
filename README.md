# Overview

to get started with this project, do the following

		nvm use 9.11.0
		yarn install
		yarn start

this app was created with [Create React Redux App](https://yingray.github.io/create-react-redux-app/)

### configuration

most of the othe documentation included below was generated by the create react app utility.  if you have the desire to override the configuratino, you may do so via creating ./config/app-config.js with the following:

	window.AimAppConfig = {
		"API_URL":"http://localhost:3005",
		"foo":"bar"
	}

this will make sure that the configuration is outside of the react build and distribution so that we can bundle this up outside of the tarball for automation and deployment

### unit test

to run all

		yarn install -g react-scripts jest-cli
		yarn install
		yarn test

or run one test

		jest src/__tests__/reducers/auth.spec.js

for expect syntax see https://facebook.github.io/jest/docs/en/expect.html

### integratino test

to run all

		yarn install -g react-scripts jest-cli
		yarn install
		yarn integration-test

or run one test

		jest src/__integrationtests___/actions/auth.spec.js

for expect syntax see https://facebook.github.io/jest/docs/en/expect.html

### Runs the app in development mode

```bash
nvm use 9.11.0
yarn start
```

Open `http://localhost:3000` to view it in the browser.


### run the app in build mode

```
nvm use 9.11
npm run build
```

now generate a new nginx/nginx.conf using sed replacing "\/Users\/andrewzuercher\/workspace\/aim-webapp" with the location of your project directory

```
cat ./nginx/nginx.conf.template | sed 's/\$PROJECT_DIR/\/Users\/andrewzuercher\/workspace\/aim-webapp/g' > ./nginx/nginx.conf
```


now install and run nginx (replace /Users/andrewzuercher/workspace/aim-webapp with your directory)

```
brew install nginx
mkdir /Users/andrewzuercher/workspace/aim-webapp/nginx/log
nginx -c /Users/andrewzuercher/workspace/aim-webapp/nginx/nginx.conf
```

open http://localhost:3000

# ubuntu

### setup ubuntu

first install yarn for ubuntu as specified in https://yarnpkg.com/lang/en/docs/install/#debian-stable.  run the following

	nvm use 9.11
	npm install -g babel-cli
	yarn install

now populate your src/app-config-override.json

	{
		"API_URL":"http://api.qa.aimrebates.com",
		"foo":"bar"
	}

now build

	rm -rf build
	npm run build


now make sure your nginx config points to <projectdir>/build.  Reference: https://github.com/facebookincubator/create-react-app
# Just a test line to be deleted later


### deploy ubuntu

setup ~/.ssh/config by looking at the entry "qa ssh config" in 1password, then just do the following:

	ssh aim-qa
	cd aim-webapp
	git pull
	nvm use 9.11
	npm install
	bin/set-version build -n 3333
	npm run build
	sudo service nginx restart
