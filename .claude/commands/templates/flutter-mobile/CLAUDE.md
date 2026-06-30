# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [DESCRIPTION]. Target: Japanese market.

## Repository Structure

```
project/
├── lib/
│   ├── main.dart                   # Entry point, MaterialApp + GoRouter
│   ├── app/
│   │   ├── router.dart             # GoRouter config with ShellRoute
│   │   └── theme.dart              # Material 3 theme (brand colors)
│   ├── features/                   # Feature-first organization
│   │   ├── auth/
│   │   │   ├── screens/            # LoginScreen, RegisterScreen
│   │   │   ├── providers/          # AuthProvider / AuthNotifier
│   │   │   ├── services/           # AuthService (API calls)
│   │   │   └── models/             # User model
│   │   ├── home/
│   │   │   ├── screens/
│   │   │   └── widgets/
│   │   └── [feature]/
│   │       ├── screens/
│   │       ├── providers/
│   │       ├── services/
│   │       ├── models/
│   │       └── widgets/
│   ├── core/
│   │   ├── api/
│   │   │   ├── api_client.dart     # Dio HTTP client + interceptors
│   │   │   └── api_endpoints.dart  # Endpoint constants
│   │   ├── models/                 # Shared data models
│   │   ├── providers/              # App-level providers
│   │   ├── services/               # Shared services
│   │   ├── utils/                  # Helpers, formatters
│   │   └── widgets/                # Shared UI widgets
│   └── l10n/                       # Localization
│       ├── app_ja.arb              # Japanese strings
│       └── app_vi.arb              # Vietnamese strings
├── test/                           # Unit + widget tests
├── assets/                         # Images, fonts
├── pubspec.yaml
└── CLAUDE.md
```

### Multi-App Monorepo Variant (if needed)
```
project/
├── apps/
│   ├── [app1]/                     # First app
│   └── [app2]/                     # Second app
├── packages/
│   ├── core/                       # Shared models + mock data
│   └── shared_ui/                  # Design system, shared widgets
└── CLAUDE.md
```

## Development Commands

```bash
flutter pub get                     # Install dependencies
flutter analyze                     # Lint
flutter test                        # Run tests
flutter run                         # Run on device/emulator
flutter build apk --debug          # Build Android debug APK
flutter build apk --release        # Build Android release APK
flutter build ios --release         # Build iOS release
```

## Architecture

- **Framework**: Flutter 3.x / Dart 3.x
- **State Management**: Riverpod 2 (recommended) or Provider
- **Navigation**: go_router with ShellRoute (bottom nav persistence)
- **HTTP**: Dio with interceptors (auth token, error handling)
- **Local Storage**: SharedPreferences (simple) or Hive (structured)
- **Design**: Material 3 with custom theme

### Design System
- Primary color: [BRAND_COLOR]
- Typography: Noto Sans JP via google_fonts package
- Spacing: 8px grid system
- Bottom navigation: 4-5 tabs with ShellRoute

### State Pattern
```dart
// Riverpod provider example
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AsyncValue<User?> build() => const AsyncValue.data(null);

  Future<void> login(String email, String password) async { ... }
  Future<void> logout() async { ... }
}
```

### API Client Pattern
```dart
class ApiClient {
  final Dio _dio;

  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: dotenv.env['API_URL'] ?? 'http://localhost:8080/api/v1',
    contentType: 'application/json',
  )) {
    _dio.interceptors.add(AuthInterceptor());
  }
}
```

## Key Conventions

- Feature-first directory structure
- Screens are full pages, Widgets are reusable components
- Models use `freezed` + `json_serializable` for immutability + JSON
- All strings externalized in .arb files for i18n
- Japanese-specific: support furigana display, JPY formatting
- Dark mode: follow system setting, with manual toggle option
