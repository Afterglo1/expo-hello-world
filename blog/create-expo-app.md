## Creating app using Expo

#### Prerequisites

1. Expo Go Application installed on a device (For checking live developments on the screen)
2. Nodejs (LTS version) installed. Recommended install using [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) as it helps in installing and using different versions of Nodejs.
3. VS Code or any code editor

## Initializing a new Expo App

 ```sh
 npx create-expo-app@latest expo-app-demo 
 cd expo-app-demo
```
This will create a new project directory in the name `expo-app-demo` with boilerplate code. We are going to build the app from scratch. So lets reset the project using `reset-project` script.

```sh
npm run reset-project
```
All the existing code except default bolierplate code will be moved to `app-example` folder.

## Run the app

In the project directory run the following code to start the app
```sh
npm run start
```

After running the above command:

1. The development server will start, and you'll see a QR code inside the terminal window.
2. Scan that QR code to open the app on the device. On Android, use the Expo Go > Scan QR code option. On iOS, use the default camera app.


### Edit the index screen

The `app/index.tsx` is the entrypoint of the our app. Edit the text inside `<Text>`. Change `Edit app/index.tsx to edit this screen` to `Hello world`. The application ui in the mobile device will auto reload and show the updated changes.  