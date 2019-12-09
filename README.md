# Awestome Table Technic Test

Answers to the google doc : https://docs.google.com/document/d/1VUifPuTLUcNkHLGjdpOY7rEJZgRcKSpBilTzvBdOjdI/edit?ts=5de13710

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## How it works

### Lazy fetching

![samplePic1](https://i.imgur.com/KMo90RU.png)
Posts are fetch only when it needs too.

## Alternative layout

![samplePic2](https://i.imgur.com/BNFpyKy.png)
A cool way to CSS the Card

## Problems

![samplePic3](https://i.imgur.com/5MFdDxq.png)
Sometimes API returns undefined. I was not able to correctly handle the error, even inside a Try Catch. As mentioned, error does not show up in production.
