# Project Good Practices

These practices are based on the current Neural Studio implementation. Keep this guide aligned with the code whenever its architecture or development workflow changes.

## Backend and ML

- Keep the inference input contract stable: one grayscale image, 28 × 28 pixels, normalized to floating-point values in the 0–1 range, with a batch dimension for prediction.
- Keep drawing preprocessing in `backend/app/ml/preprocess.py`. If crop, threshold, scaling, centering, or normalization changes, verify the result against the model's MNIST input expectations and update the UI's pipeline description if needed.
- Keep model construction in `backend/app/ml/model.py`. When layers or model metadata change, update the `/api/model` description and any UI that displays the architecture.
- Validate uploaded file type and size before decoding. Convert expected client and artifact errors into clear HTTP responses; do not expose tracebacks as API details.
- Load the model through `backend/app/services/prediction_service.py` so inference shares one cached model instance. A missing model is a supported state: preserve the actionable 503 response rather than making the API impossible to start.
- Keep training, validation, and held-out test data distinct. Record metrics from the actual training and evaluation run; never substitute placeholder values for missing artifacts.
- Treat the model file and training history as generated artifacts. Do not commit a newly generated model binary; update the setup instructions when artifact generation or locations change.
- If an API response changes, update its route, frontend type in `frontend/src/types.ts`, API client use, and any affected views together.

## Frontend

- Keep HTTP requests and API error translation in `frontend/src/services/api.ts`; avoid duplicating request configuration across pages and components.
- Keep API response shapes in `frontend/src/types.ts` aligned with the backend. Prefer typed response data over `any` or unchecked casts.
- Represent loading, unavailable, error, and successful states explicitly. Do not fabricate metrics or prediction results when the backend has no data.
- Keep page-level workflows in `frontend/src/pages/` and reusable visualizations or controls in `frontend/src/components/`.
- Preserve strict TypeScript checks. Resolve unused variables and type errors instead of weakening `strict`, `noUnusedLocals`, or `noUnusedParameters` to make a build pass.
- Run `npm run lint` and `npm run format:check` from `frontend` before opening a pull request. The Husky pre-commit hook runs Prettier and ESLint on staged frontend files.
- Keep shared visual tokens and responsive rules in `frontend/src/index.css`. Use semantic elements, accessible names for interactive controls, and responsive layouts when adding UI.
- Keep local configuration in environment files. Use `frontend/.env.example` as the shareable template; do not commit `frontend/.env` or secrets.

## Changes and Validation

- Make focused changes and update `README.md` when setup, commands, API behavior, or generated artifacts change.
- Before opening a pull request, run the checks currently provided by the project:

  ```powershell
  Set-Location frontend
  npm run build

  Set-Location ..
  python -m compileall -q backend\app
  ```

- Smoke-test behavior affected by a change. For backend API changes, check the relevant route and its error states; for frontend changes, verify the corresponding screen with both available and unavailable backend data when practical.
- The repository has no automated test suite yet. Add focused tests when introducing behavior that can regress, and document any new test commands here and in the README.
- Use the checklist in `.github/pull_request_template.md` to record self-review, documentation, warning, test, and downstream-change status accurately.

## Repository Hygiene

- Keep virtual environments, dependency installs, build output, local environment files, and generated model binaries out of commits; `.gitignore` already covers these paths.
- Pin backend dependencies in `backend/requirements.txt` and use the frontend lockfile when installing dependencies.
- Avoid unrelated formatting or cleanup in behavior-focused changes so reviews stay easy to evaluate.
