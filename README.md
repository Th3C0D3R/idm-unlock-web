# IDM Patcher Web Version

This folder contains a serverless Node.js API route for applying the IDM patcher patterns to a binary file.

## Vercel Usage

Deploy this folder as a Vercel project, or use the `webVersion/` folder as the entry point.

### API Endpoint

`POST /api/patch`

### Request Body

```json
{
  "fileName": "IDMan.exe",
  "fileBase64": "<base64-encoded-binary>",
  "dryRun": false,
  "overwrite": false
}
```

- `fileName` - optional, used to build the output filename.
- `fileBase64` - required, the executable file encoded as Base64.
- `dryRun` - optional boolean. When `true`, the API returns patch counts without modifying the file.
- `overwrite` - optional boolean. When `true`, the output keeps the original filename instead of appending `.xex`.

### Response

```json
{
  "success": true,
  "dryRun": false,
  "totalMatches": 5,
  "patchResults": [
    { "patch": 1, "count": 1 },
    { "patch": 2, "count": 0 }
  ],
  "outputFileName": "IDMan.xex",
  "fileBase64": "<patched-file-base64>"
}
```

If `dryRun` is enabled, the response includes counts only and omits `fileBase64`.

## Notes

- The implementation is intentionally minimal and dependency-free for Vercel serverless.
- It uses exact-byte pattern scanning with wildcard support, matching the original Python patcher behavior.
- The handler is optimized for fast execution and small memory overhead.
