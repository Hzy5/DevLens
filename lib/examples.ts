import type { Analysis, InputMode } from "@/types/analysis";

export type ExampleCard = {
  id: string;
  title: string;
  preview: string;
  mode: InputMode;
  input: string;
};

export const EXAMPLE_CARDS: ExampleCard[] = [
  {
    id: "swift-crash",
    title: "Swift Crash",
    preview: "Fatal error: Unexpectedly found nil...",
    mode: "crash",
    input: `Thread 1: Fatal error: Unexpectedly found nil while implicitly unwrapping an Optional value

#0  0x0000000184e0d2e0 in _swift_runtime_on_report ()
#1  0x0000000184e0d2c4 in _swift_stdlib_reportFatalErrorInFile ()
#2  ProfileView.swift:42
    let user = users.first!
    label.text = user.name`,
  },
  {
    id: "react-error",
    title: "React Error",
    preview: "Cannot read properties of undefined",
    mode: "error",
    input: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (UserList.tsx:14:18)
    at renderWithHooks (react-dom.development.js:15486:18)

  12 | function UserList({ users }) {
  13 |   return (
  14 |     <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>
  15 |   );
  16 | }`,
  },
  {
    id: "api-error",
    title: "API Error",
    preview: "HTTP 401 Unauthorized",
    mode: "api",
    input: `HTTP 401 Unauthorized

{
  "error": "invalid_token",
  "error_description": "The access token expired"
}

GET /v1/me
Authorization: Bearer eyJhbGciOi...`,
  },
  {
    id: "typescript",
    title: "TypeScript",
    preview: "Type 'string | undefined' is not assignable...",
    mode: "error",
    input: `error TS2322: Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.

  8 | function greet(name: string) {
  9 |   return \`Hello, \${name}\`;
 10 | }
 11 |
 12 | const value = params.get("name");
 13 | greet(value);`,
  },
];

export const EXAMPLE_ANALYSIS: Analysis = {
  type: "crash",
  technology: "Swift",
  title: "Force-unwrapped optional is nil",
  severity: "high",
  problem: "A value declared with `!` is nil at runtime.",
  cause: "The optional is being force-unwrapped before it contains a value.",
  causeCertainty: "confirmed",
  confidence: 91,
  evidence:
    "The crash message explicitly references an implicitly unwrapped optional, which strongly indicates a nil value was accessed.",
  fix: {
    summary: "Safely unwrap the optional before using it.",
    codeBefore: "let user = users.first!",
    codeAfter: "guard let user = users.first else {\n    return\n}",
    language: "swift",
  },
  checks: [
    "Verify where `users` is populated.",
    "Confirm the array isn't empty.",
    "Inspect the value immediately before the crash.",
  ],
  nextStep: "Inspect the value immediately before the crash.",
};
