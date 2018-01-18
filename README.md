# React Food Store with live search

This is a store search/store locator, built in React. It is using [postcodes.io](http://postcodes.io) for all postcode queries and is similar to what you would expect to find on a retailer website to help you locate your nearest store. It will list all stores alphabetically on load and you can search by partial/full postcode, getting suggestions as you type. This project started as a test, but i feel it might help people who want to built something similar or see how they can use Ramda with React perhaps along some api calls.

The project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).<br />
A change worthy of note is that react-scripts have been swapped with custom-react-scripts, so SASS/LESS (among other tools) can be enabled. (additional options stored in .env file)

It is only using Ramda as a dependency for some functional programming, but you can easily substitute Ramda with Lodash, Underscore or plain js functions to filter, map, flatten etc, up to you!

It is also split in external components for ease of expansion and keeping the code as lean as possible in each component.

## What it will do:

1. It will fetch a list of stores (stored in stores.json) and sort them alphabetically before rendering.
2. It allows the user to type in partial/full postcodes into a live search box and get suggestions for matching results
3. Upon selecing an available postcode or typing an unavailable in full, it will show the nearest ones that match the postcodes.io results using the "Nearest outward code for outward code" endpoint, sorted by proximity

All postcode queries are using [postcode.io](http://postcodes.io/)

## How to run

npm install will take care of all dependencies. In windows, you might have to run `npm install -g node-gup` too, if you encounter errors. After this, you have the following choices:

  - `npm start` will start the project
  - `npm run build` to build for production (in the build folder)
  - `npm run eject` to remove the build tool and configuration choice and will expose Webpack, Babel, ESLint, etc configuration - Warning - one way operation, cannot be reversed!

You can also use Yarn instead of npm. (yarn start, yarn build)

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Linting errors will show up in the console and the page will reload when making edits.

## What can be done better/differently

1. Upon entering part of a postcode, mark that part of a postcode in suggestions in *bold*. This is really easy and trivial to add, but for the purpose of this test it is a little too much, probably needed for a production version though.
2. Migrate the data transformation functionality to a helpers library so they can be abstracted from the components/main app.
3. The whole project is using the front end only to render and transform data. This can be heavy, depending on the load. Server-side rendering and/or data transformation on the server would be preferable - no reason why the api response needs to be unsorted or missing key parts of the view data such as lat & long, it could be done in the api side each time there is a new store added or by a Lambda function triggered by data storage. This would remove a good chunk of processing from the browser.
4. It can also look for your location using HTML5 and suggest closest stores.

Have fun!