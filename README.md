**Structural Improvements**

- Using project structure with layers vs keeping everything in one index.ts file for ease of maintenance and potential modification/expansion
- Added env variables for values hard-coded in the original, with a logic to fall back to hard-coded constants in case none are provided in the env

  **Logic improvements**

- If userId is missing from the incoming request, generate a temporary one using a "GUEST" prefix
- Expand lat & lon parameter validation to check if they are in a valid coordinates range
