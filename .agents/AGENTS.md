# Authentication & User Account Rules

## 1. Strict Server-Side Authentication (No Client Fallbacks)
- **No Client-Side Bypasses**: Never use demo fallbacks, arbitrary length checks (e.g., `if (otp.length >= 4)`), or mock token generation in frontend authentication modals.
- **Strict Response Validation**: Authentication, login, and OTP verification flows must strictly require a valid HTTP `200 OK` or `201 Created` response from the backend server before authenticating the user or issuing tokens.
- **Error Handling**: When the backend returns an error status (e.g., `400 Bad Request`, `401 Unauthorized`), the frontend must display the server's error message directly to the user and halt the auth flow.

## 2. One User per Email & Phone Number (Case-Insensitive Uniqueness)
- **Case-Insensitive Email Verification**: When querying or validating existing users by email in Django, always use case-insensitive lookups (`email__iexact=email.strip().lower()`) at both the serializer and view layers.
- **Phone Number Uniqueness**: Always strip whitespace and validate uniqueness for mobile numbers (`mobile_number=mobile_number.strip()`).
- **Clear User-Facing Error Messages**: When a duplicate account is found, APIs must immediately return clear, actionable error strings in the `error` field (e.g., `"An account with this email address already exists. Please sign in instead."`) rather than generic serializer error structures.

## 3. UI Aesthetics & Iconography
- **No Emojis in Frontend**: Never use emojis in frontend components, buttons, notifications, or modal text. Use clean typography or standard SVG icons (Lucide React) instead.

## 4. React Refactoring: Scope and Imports
- **Verify Variable Scope**: Before adding an event handler (e.g., `onClick={logout}`) or referencing a variable, explicitly check if that function/variable is defined in the current file scope.
- **Check Hooks and Context**: If the function belongs to a context or hook (like `useApp()`), ensure it is properly destructured at the top of the component (e.g., `const { user, setPortal, logout } = useApp();`).
- **Check Imports**: If the function is a utility or icon, ensure the `import` statement exists at the top of the file.
