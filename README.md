# Welcome to Crowd sourced security

## Project info

**URL**: https://lovable.dev/projects/d782a8dd-718d-48d9-9b90-3da99b6628fe

## Running the code locally on the web

### Requirements

- Nodejs ^20

Follow these steps:

### Steps

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

# Building the app to apk

## Requirements

- **Node.js and npm (or yarn):** For JavaScript dependencies.
- **Android Studio and SDK:** For Android development, including APK building and signing. Ensure necessary Android SDK platforms and build tools are installed.
- **Java Development Kit (JDK):** For Android development. Often bundled with Android Studio.
- **Capacitor CLI:** `npm install -g @capacitor/cli` or `yarn global add @capacitor/cli`
- **A Code Editor:** VS Code, Sublime Text, Atom, etc.
- **An Android Device or Emulator:** For testing.

## Steps

1. **Build your React Application:** `npm run build` or `yarn build` (creates the production-ready build, usually in a `build` folder).

2. **Initialize Capacitor:** `npx cap init` or `yarn cap init` (answer the prompts for app name and ID).

3. **Add the Android Platform:** `npx cap add android` or `yarn cap add android`.

4. **Copy the Web Build to Capacitor:** `npx cap copy` or `yarn cap copy` (copies the contents of your `build` directory to the Android project).

5. **Open the Android Project in Android Studio:** `npx cap open android` or `yarn cap open android`.

6. **Build and Run the APK (in Android Studio):**

   - _Build_ -> _Build Bundle(s) / APK(s)_ -> _Build APK(s)_.
   - Connect your Android device or start an emulator.
   - Click the Run button (green play icon) and choose your device.

7. **(Optional) Sign the APK (for release):** _Build_ -> _Build Bundle(s) / APK(s)_ -> _Generate Signed Bundle / APK_ (requires a keystore).

8. **(Optional) Configure `capacitor.config.json`:** Customize app name, ID, icons, splash screens, `webDir` (should point to your build directory), and other settings. Example:

```json
{
  "appId": "com.example.myapp",
  "appName": "My React App",
  "webDir": "build",
  "bundledWebRuntime": false
}

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor
```
