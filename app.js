const form = document.getElementById("patch-form");
const fileInput = document.getElementById("file-input");
const filenameInput = document.getElementById("filename-input");
const dryRunInput = document.getElementById("dry-run");
const overwriteInput = document.getElementById("overwrite");
const statusCard = document.getElementById("status");
const statusMessage = document.getElementById("status-message");
const patchList = document.getElementById("patch-list");
const downloadLink = document.getElementById("download-link");

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

	setStatus("Preparing file and sending patch request...");
	clearResults();

	const arrayBuffer = await file.arrayBuffer();
	const base64 = arrayBufferToBase64(arrayBuffer);

	const payload = {
		fileName,
		fileBase64: base64,
		dryRun: dryRunInput.checked,
		overwrite: overwriteInput.checked,
	};

	try {
		const response = await fetch("/api/patch", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const result = await response.json();
		renderResults(result);
	} catch (error) {
		setStatus(error.message || "Unable to reach the patch API.", true);
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
