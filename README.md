# Youfoodz.com

## Installation

1. `npm install -g gulp bower webpack webpack-cli`
2. Install [Shopify theme kit](https://shopify.github.io/themekit/)
3. Install [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) to run tests
4. Set up *Theme Kit* config in `/theme/config.yml`:

    ```yaml
    development:
      password: e1e9fd10176e709ac803afcdd4de2129
      theme_id: "your-theme-id"
      store: development-site.myshopify.com
    ```
5. `gulp download` to download theme
6. `gulp init` to move files to dev folder
7. `npm install` in `/dev` folder

## Running locally

Running locally will automatically update your development store theme specified in the *Shopify Theme Kit* config. 

Your theme can be previewed at https://development-site.myshopify.com/?preview_theme_id=*your-theme-id*
 
```
cd dev
gulp
```

This will open two separate terminal windows. One is the `theme_watch` process. It will notify you when a file upload
 has started and whether it's completed successfully or errored.
 
The second window is the `reactJs` process. This will compile your react files and styles, and will notify you of any
 linting or compilation errors.
 
### Upload errors

Occasionally when switching branches, the `theme_watch` process will run into a `Status: 409 Conflict` error, which 
happens when the version of the file you're uploading on the server is newer (has a more recent timestamp) then the 
version you are trying to upload. 

To force an overwrite, you will need to run the following commands (from the project root folder):

```
cd theme
theme force --upload
```

You can specify a specific file pathname if it's a single file causing the error. e.g. to force upload
only the `theme.js` file in the `theme/assets` folder:

```
theme force assets/theme.js --upload
```

## Testing

### E2E Tests

The end-to-end tests use [Nightwatch.js](http://nightwatchjs.org/guide). Test reports can be found in `/reports`

```
cd dev
npm test
```

To test against a specific theme id:

```
npm test -- --themeId [your-theme-id]
```

## React

### Styling

Styling is done in SASS which is then compiled during the webpack process within gulp. 

### Testing

1. `npm install -g jest`

The react tests use [Jest](https://jestjs.io).

```
cd dev
jest
```

To run the tests and include line coverage reports.

```
jest --coverage
```

Tests can be found in the `dev/jest` folder and should follow the format `[TargetComponent].test.tsx`. Tests will only be run on files that contain `.test` before the file extension.