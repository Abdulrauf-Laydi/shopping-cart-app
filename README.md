# React Native Shopping Cart App (Expo Go)

This is a simple e-commerce shopping cart application built with React Native and Expo, developed as part of a course project.

## Features

*   Browse product listings (fetched from Firebase Realtime Database)
*   Search products by name or brand
*   Filter products by country of origin (Turkey, USA, Germany, Other)
*   Sort products by price (Low-High, High-Low) or default
*   View product details (fetched from Firebase Realtime Database)
*   Add/remove items from the shopping cart
*   Adjust item quantities in the cart
*   User authentication (Signup, Login, Logout) using Firebase Authentication
*   Simulated checkout process with form validation

## Prerequisites

Before running this project, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [Expo Go App](https://expo.dev/go) on your physical iOS or Android device (for testing on device)
*   (Optional) Xcode or Android Studio for simulators/emulators

## Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Abdulrauf-Laydi/shopping-cart-app.git
    cd shopping-cart-app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # OR if you use Yarn:
    # yarn install
    ```

3.  **Firebase Setup (CRITICAL):**
    This application uses Firebase for user authentication and product data storage (Realtime Database). You need to set up your own Firebase project to run it.

    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new Firebase project (or use an existing one).

    *   **Set up Authentication:**
        *   In your project, go to the **Authentication** section (under "Build").
        *   Click the "Get started" button.
        *   On the "Sign-in method" tab, enable the **Email/Password** provider.

    *   **Set up Realtime Database (for Product Data):**
        *   In the left menu (under "Build"), click on **Realtime Database**.
        *   Click **Create database**.
        *   Select a location for your database (choose the region closest to you).
        *   Select **Start in test mode** (allows read/write access during development - **remember to secure this with rules before production!**). Click **Enable**.
        *   Once the database is created, click the **three-dots menu (⋮)** next to your database URL (which looks like `https://your-project-id-default-rtdb...firebaseio.com`).
        *   Select **Import JSON**.
        *   Click **Browse** and select a JSON file containing the product data. You can create a file (e.g., `products.json`) with the following structure (using the data from `src/data/mockProducts.ts` as a base):
            ```json
            {
              "products": {
                "1": { "id": "1", "name": "Beko Refrigerator", "price": 15000, /* ... other fields ... */ },
                "2": { "id": "2", "name": "Vestel Smart TV", "price": 9500, /* ... other fields ... */ },
                "3": { "id": "3", "name": "Arcelik Washing Machine", "price": 12000, /* ... other fields ... */ },
                "4": { "id": "4", "name": "Sony Headphones", "price": 2500, /* ... other fields ... */ },
                "5": { "id": "5", "name": "Samsung Galaxy Phone", "price": 25000, /* ... other fields ... */ },
                "6": { "id": "6", "name": "Apple MacBook Pro", "price": 45000, /* ... other fields ... */ }
              }
            }
            ```
            *(Make sure to include all fields like `description`, `imageUrl`, `brand`, `countryOfOrigin` for each product, you can find them in the mockProducts.ts)*
        *   Click **Import**. This will create a `/products` node containing the sample product data.

    *   **Get Web App Configuration (for Auth &amp; DB):**
        *   Go back to your project's overview by clicking the **Project Overview** (gear icon) -> **Project settings**.
        *   Scroll down to the "Your apps" section. If you haven't added a web app yet, click the **Web** icon (`</>`) to add one.
        *   Give your app a nickname (e.g., "Shopping Cart Web SDK") and click "Register app".
        *   **Important:** Firebase will show you configuration keys (`firebaseConfig` object). Copy these keys.
        *   In the root directory of this project (`shopping-cart-app`), create a new file named `.env`.
        *   Paste your Firebase configuration keys into the `.env` file using the following structure (replace `YOUR_..._HERE` with your actual keys):

            ```dotenv
            # .env file - Firebase Configuration
            EXPO_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY_HERE"
            EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_HERE"
            EXPO_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_HERE"
            EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_HERE"
            EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_HERE"
            EXPO_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID_HERE"
            EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID_HERE" # Optional
            ```
        

## Running the App

1.  **Start the Development Server:**
    ```bash
    npx expo start
    ```
2.  **Open the App:**
    *   **On your phone:** Scan the QR code displayed in the terminal using the Expo Go app (Android) or the Camera app (iOS).
    *   **On Simulator/Emulator:** Press `i` to open in the iOS Simulator or `a` to open in an Android Emulator (requires Xcode/Android Studio setup).
    *   **On Web:** Press `w` to open in your web browser.

## Running Tests

To run the unit and component tests:

```bash
npm test
# OR
# yarn test