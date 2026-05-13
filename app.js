const form = document.getElementById("patch-form");
const fileInput = document.getElementById("file-input");
const filenameInput = document.getElementById("filename-input");
const dryRunInput = document.getElementById("dry-run");
const overwriteInput = document.getElementById("overwrite");
const statusCard = document.getElementById("status");
const statusMessage = document.getElementById("status-message");
const patchList = document.getElementById("patch-list");
const downloadLink = document.getElementById("download-link");

const PATCHES = [
	[
		"50 8b 0d ?? ?? ?? ?? 51 ff 15 ?? ?? ?? ?? 85 c0 ?? ?? ?? ?? ?? ?? c6 85 4f f5 ff ff 01",
		"50 8b 0d ?? ?? ?? ?? 51 ff 15 ?? ?? ?? ?? 33 c0 ?? ?? ?? ?? ?? ?? c6 85 4f f5 ff ff 01",
	],
	[
		"89 5D D4 89 5D FC A1 ?? ?? ?? ?? F7 D8 1B C0 83 E0 0F 83 C0 0F",
		"89 5D D4 89 5D FC A1 ?? ?? ?? ?? F7 D8 1B C0 b8 ff ff ff f7 90",
	],
	[
		"C6 45 FC 03 39 1D ?? ?? ?? ?? 74 ?? 8B 0D ?? ?? ?? ?? 51",
		"C6 45 FC 03 39 1D ?? ?? ?? ?? EB ?? 8B 0D ?? ?? ?? ?? 51",
	],
	[
		"8D ?? ?? ?? E8 ?? ?? ?? ?? 84 C0 74 ?? 80 7C 24 07 00 75 ?? C7 44 24 14 FF FF FF FF 8D",
		"8D ?? ?? ?? E8 ?? ?? ?? ?? 84 C0 EB ?? 80 7C 24 07 00 75 ?? C7 44 24 14 FF FF FF FF 8D",
	],
	[
		"?? FF 68 ?? ?? ?? ?? 64 A1 00 00 00 00 50 81 EC 64 01 00 00 A1 ?? ?? ?? ?? 33 C4 89 84 24 60 01 00 00 53 56",
		"C3 FF 68 ?? ?? ?? ?? 64 A1 00 00 00 00 50 81 EC 64 01 00 00 A1 ?? ?? ?? ?? 33 C4 89 84 24 60 01 00 00 53 56",
	],
	[
		"?? FF 68 ?? ?? ?? ?? 64 A1 00 00 00 00 50 81 EC C4 01 00 00 A1 ?? ?? ?? ?? 33 C4 89 84 24 ?? 01 00 00 53 55 56",
		"C3 90 68 ?? ?? ?? ?? 64 A1 00 00 00 00 50 81 EC C4 01 00 00 A1 ?? ?? ?? ?? 33 C4 89 84 24 ?? 01 00 00 53 55 56",
	],
	[
		"55 8B EC 83 E4 F8 6A FF 68 ?? ?? ?? ?? 64 A1 00 00 00 00 50 81 EC CC 01 00 00",
		"C3 8B EC 83 E4 F8 6A FF 68 ?? ?? ?? ?? 64 A1 00 00 00 00 50 81 EC CC 01 00 00",
	],
	[
		"40 84 C9 75 ?? 2B C2 83 F8 02 0F 85 ?? ?? ?? ?? ?? ?? ?? ?? ?? 85 C0",
		"40 84 C9 75 ?? 2B C2 83 F8 02 90 E9 ?? ?? ?? ?? ?? ?? ?? ?? ?? 85 C0",
	],
	[
		"C6 44 24 0F 00 E8 ?? ?? ?? ?? 84 C0 74 ?? 80 7C ?? ?? ??",
		"C6 44 24 0F 00 E8 ?? ?? ?? ?? 84 C0 EB ?? 80 7C ?? ?? ??",
	],
	[
		"CC CC 6A FF 68 ?? ?? ?? ?? ?? A1 00 00 00 00 50 83 EC ?? A1 ?? ?? ?? ?? 33 C4 89 44 ?? ?? 53 56 57 A1 ?? ?? ?? ?? 33 C4 50 8D 44 ?? ?? ?? A3 00 00 00 00 8B ?? E8 ?? ?? ?? ?? 8B",
		"CC CC 90 C3 68 ?? ?? ?? ?? ?? A1 00 00 00 00 50 83 EC ?? A1 ?? ?? ?? ?? 33 C4 89 44 ?? ?? 53 56 57 A1 ?? ?? ?? ?? 33 C4 50 8D 44 ?? ?? ?? A3 00 00 00 00 8B ?? E8 ?? ?? ?? ?? 8B",
	],
	[
		"01 00 00 00 01 00 00 00 1E 00 00 00",
		"01 00 00 00 00 00 00 00 FF FF FF 7F",
	],
	[
		"?? ?? ?? ?? 75 54 C7 05 ?? ?? 75 00 ?? 00 00 00 8D 95 EC 03 00 00",
		"?? ?? ?? ?? 90 90 C7 05 ?? ?? 75 00 01 00 00 00 8D 95 EC 03 00 00",
	],
	[
		"53 8D 8D ?? FC FF FF E8 ?? ?? 0C 00 C6 45 FC ??",
		"53 8D 8D ?? FC FF FF 90 90 90 90 90 C6 45 FC ??",
	],
	[
		"8D 4C 24 18 E8 ?? ?? ?? ?? 3B EB 74 09 8B 4C 24 34 E8 F4 F1 FF FF 8B 8C 24 DC 00 00 00 64 89 0D 00 00 00 00 59 5F 5E 5D 5B 8B 8C 24 C4 00 00 00 33 CC E8 ?? ?? ?? ?? 81 C4 D4 00 00 00 C3",
		"8D 4C 24 18 E8 ?? ?? ?? ?? 3B EB 74 09 90 90 90 90 90 90 90 90 90 8B 8C 24 DC 00 00 00 64 89 0D 00 00 00 00 59 5F 5E 5D 5B 8B 8C 24 C4 00 00 00 33 CC E8 ?? ?? ?? ?? 81 C4 D4 00 00 00 C3",
	],
	[
		"50 8B 0D ?? ?? ?? 00 51 FF 15 ?? ?? ?? 00 85 C0 74 0C 8B CB E8 ?? ?? FF FF E9 BD 00 00 00 89 7D DC 8D 55 DC 52",
		"50 8B 0D ?? ?? ?? 00 51 FF 15 ?? ?? ?? 00 85 C0 EB 0C 90 90 90 90 90 90 90 E9 BD 00 00 00 89 7D DC 8D 55 DC 52",
	],
];

function parsePattern(pattern) {
	const bytes = [];
	const mask = [];

	for (const token of pattern.split(/\s+/)) {
		if (token === "??") {
			bytes.push(0);
			mask.push(0);
		} else {
			bytes.push(Number.parseInt(token, 16));
			mask.push(1);
		}
	}

	return { bytes: Uint8Array.from(bytes), mask: Uint8Array.from(mask) };
}

function scanPattern(data, searchBytes, searchMask) {
	const patLen = searchBytes.length;
	let count = 0;
	const limit = data.length - patLen + 1;

	for (let i = 0; i < limit; i += 1) {
		let matched = true;

		for (let j = 0; j < patLen; j += 1) {
			if (searchMask[j] && data[i + j] !== searchBytes[j]) {
				matched = false;
				break;
			}
		}

		if (matched) count += 1;
	}

	return count;
}

function applyPatch(data, searchBytes, searchMask, replaceBytes, replaceMask) {
	const patched = new Uint8Array(data);
	const patLen = searchBytes.length;
	let count = 0;
	const limit = patched.length - patLen + 1;

	for (let i = 0; i < limit; i += 1) {
		let matched = true;

		for (let j = 0; j < patLen; j += 1) {
			if (searchMask[j] && patched[i + j] !== searchBytes[j]) {
				matched = false;
				break;
			}
		}

		if (!matched) continue;

		for (let j = 0; j < patLen; j += 1) {
			if (replaceMask[j]) patched[i + j] = replaceBytes[j];
		}

		count += 1;
	}

	return { data: patched, count };
}

function buildPatchMap() {
	return PATCHES.map(([search, replace]) => ({
		search: parsePattern(search),
		replace: parsePattern(replace),
	}));
}

const PATCH_MAP = buildPatchMap();

function runPatch(arrayBuffer, dryRun = false) {
	let totalMatches = 0;
	const patchResults = [];
	let output = new Uint8Array(arrayBuffer);

	for (let idx = 0; idx < PATCH_MAP.length; idx += 1) {
		const { search, replace } = PATCH_MAP[idx];

		if (search.bytes.length !== replace.bytes.length) {
			throw new Error(`Patch ${idx + 1} pattern length mismatch`);
		}

		if (dryRun) {
			const count = scanPattern(output, search.bytes, search.mask);
			patchResults.push({ patch: idx + 1, count });
			totalMatches += count;
			continue;
		}

		const { data: patched, count } = applyPatch(
			output,
			search.bytes,
			search.mask,
			replace.bytes,
			replace.mask,
		);

		output = patched;
		patchResults.push({ patch: idx + 1, count });
		totalMatches += count;
	}

	return { output, patchResults, totalMatches };
}

function setStatus(text, isError = false) {
	statusMessage.textContent = text;
	statusMessage.style.color = isError ? "#fca5a5" : "#cbd5e1";
	statusCard.classList.remove("hidden");
}

function clearResults() {
	patchList.innerHTML = "";
	downloadLink.classList.add("hidden");
}

function renderResults(response) {
	clearResults();

	if (!response.success) {
		setStatus(response.error || "Unexpected error", true);
		return;
	}

	const summary = response.dryRun
		? `Dry run finished. ${response.totalMatches} total match(es) found.`
		: `Patched successfully. ${response.totalMatches} change(s) applied.`;

	setStatus(summary);

	response.patchResults.forEach((item) => {
		const row = document.createElement("div");
		row.className = "patch-item";
		row.innerHTML = `<span>Patch ${item.patch}</span><strong>${item.count} match(s)</strong>`;
		patchList.appendChild(row);
	});

	if (!response.dryRun && response.fileBase64) {
		const outputName = response.outputFileName || "patched.xex";
		const blob = b64ToBlob(response.fileBase64, "application/octet-stream");
		const url = URL.createObjectURL(blob);
		downloadLink.href = url;
		downloadLink.textContent = `Download ${outputName}`;
		downloadLink.download = outputName;
		downloadLink.classList.remove("hidden");
	}
}

function b64ToBlob(base64, mime) {
	const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	return new Blob([bytes], { type: mime });
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	const file = fileInput.files[0];

	if (!file) {
		setStatus("Choose an executable to patch.", true);
		return;
	}

	const fileName = filenameInput.value.trim() || file.name;
	if (!fileName) {
		setStatus("A valid file name is required.", true);
		return;
	}

	setStatus("Patching locally in the browser...");
	clearResults();

	try {
		const arrayBuffer = await file.arrayBuffer();
		const { output, patchResults, totalMatches } = runPatch(arrayBuffer, dryRunInput.checked);
		const outputFileName = fileName
			? overwriteInput.checked
				? fileName
				: `${fileName.replace(/\.[^/.]+$/, "")}.xex`
			: "patched.xex";

		const response = {
			success: true,
			dryRun: Boolean(dryRunInput.checked),
			totalMatches,
			patchResults,
			outputFileName,
		};

		if (!dryRunInput.checked) {
			response.fileBase64 = arrayBufferToBase64(output.buffer);
		}

		renderResults(response);
	} catch (error) {
		setStatus(error.message || "Patch failed.", true);
	}
});

function arrayBufferToBase64(buffer) {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;

	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}

	return btoa(binary);
}

fileInput.addEventListener("change", () => {
	const file = fileInput.files[0];
	if (file) {
		filenameInput.value = file.name;
		setStatus(`Ready to patch ${file.name}`);
	}
});
