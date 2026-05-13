# IDM Unlocker Web

A static browser app for patching IDM binaries locally in the browser.

Live demo: https://dev.th3.ovh/idm-unlock-web/

## How it works

- Open the page in your browser.
- Upload an IDM executable file (`.exe`).
- The app applies the same byte-pattern patch rules used by the original IDM patcher.
- Download the patched executable directly from the browser.

## Features

- Local in-browser patching
- No server backend required
- No external dependencies
- Wildcard byte pattern matching
- Dry-run preview
- Optional overwrite output filename

## Usage

1. Upload the IDM binary file.
2. Enter an output filename or leave it blank.
3. Enable `Dry run` to preview patch counts without modifying the file.
4. Enable `Overwrite filename` to keep the original filename instead of appending `.xex`.
5. Click `Patch file` and download the patched binary.

## Notes

- This project is designed as a static GitHub Pages / browser-hosted app.
- All patching is performed locally in the browser.
- The code is intentionally minimal and dependency-free.
