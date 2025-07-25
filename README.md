# eSIM Travel App

A React Native mobile application for purchasing and managing eSIMs for international travel. Built with TypeScript, Firebase, and modern mobile development practices.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/signup with Firebase Auth
- **Country Exploration**: Browse available countries and regions
- **eSIM Plans**: View and purchase data plans for different countries
- **Payment Integration**: Apple Pay and Google Pay support
- **eSIM Management**: Track active eSIMs, data usage, and expiry dates
- **QR Code Generation**: Easy eSIM activation with QR codes
- **Real-time Updates**: Live data usage and plan status updates

### Technical Features
- **Cross-platform**: iOS and Android support
- **TypeScript**: Full type safety and better development experience
- **Firebase Backend**: Authentication, Firestore database, and storage
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Offline Support**: Basic functionality without internet connection
- **Push Notifications**: Plan expiry and usage alerts

## 📱 Screenshots

*Screenshots will be added once the app is running*

## 🛠 Tech Stack

- **Frontend**: React Native 0.80.2
- **Language**: TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Navigation**: React Navigation v6
- **UI Components**: Custom components with React Native Vector Icons
- **State Management**: React Hooks and Context API
- **Payment**: Apple Pay & Google Pay (planned)
- **Styling**: StyleSheet with custom design system

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)
- **Firebase Account** (for backend services)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ESIMTravelApp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Download your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files
6. Place them in the appropriate directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/ESIMTravelApp/GoogleService-Info.plist`

### 4. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 5. Run the App

#### For iOS:
```bash
npx react-native run-ios
```

#### For Android:
```bash
npx react-native run-android
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── screens/            # App screens
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ExploreScreen.tsx
│   └── ...
├── services/           # API and external services
│   └── firebase.ts
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── utils/              # Utility functions
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── constants/          # App constants and configuration
│   └── index.ts
└── assets/             # Images, fonts, etc.
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# App Configuration
APP_NAME=eSIM Travel
APP_VERSION=1.0.0
```

### Firebase Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public data
    match /countries/{countryId} {
      allow read: if true;
    }
    
    match /plans/{planId} {
      allow read: if true;
    }
    
    // User eSIMs
    match /user_esims/{esimId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Payments
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🎨 Design System

The app uses a consistent design system with:

- **Colors**: Primary blue, secondary green, accent orange
- **Typography**: Custom font sizes and weights
- **Spacing**: Consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px)
- **Shadows**: Subtle elevation effects
- **Border Radius**: Consistent rounded corners

## 🔐 Security

- Firebase Authentication for user management
- Secure Firestore rules
- Input validation and sanitization
- Secure payment processing (planned)
- Data encryption in transit and at rest

## 📊 Performance

- Lazy loading of screens and components
- Image optimization
- Efficient state management
- Minimal bundle size
- Fast app startup

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Building for Production

### iOS
```bash
cd ios
xcodebuild -workspace ESIMTravelApp.xcworkspace -scheme ESIMTravelApp -configuration Release -destination generic/platform=iOS -archivePath ESIMTravelApp.xcarchive archive
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## 🚀 Deployment

### App Store (iOS)
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Submit for review

### Google Play Store (Android)
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Submit for review

## 🔄 Next Steps

### Phase 1: Core Features (Current)
- [x] Project setup and structure
- [x] Authentication system
- [x] Basic UI components
- [x] Navigation setup
- [x] Home screen with mock data

### Phase 2: eSIM Integration
- [ ] Integrate with eSIM provider APIs (Airalo, Truphone, etc.)
- [ ] Real eSIM purchase flow
- [ ] QR code generation
- [ ] eSIM activation process
- [ ] Data usage tracking

### Phase 3: Payment Integration
- [ ] Apple Pay integration
- [ ] Google Pay integration
- [ ] Payment processing
- [ ] Receipt generation
- [ ] Refund handling

### Phase 4: Advanced Features
- [ ] Push notifications
- [ ] Offline mode
- [ ] Analytics and tracking
- [ ] Multi-language support
- [ ] Dark mode

### Phase 5: Polish & Launch
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] App store optimization
- [ ] Marketing materials
- [ ] Launch preparation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@esimtravel.com
- Documentation: [docs.esimtravel.com](https://docs.esimtravel.com)

## 🙏 Acknowledgments

- React Native community
- Firebase team
- All contributors and beta testers

---

**Note**: This is a development version. Some features are placeholder implementations and will be replaced with real eSIM provider integrations and payment processing.