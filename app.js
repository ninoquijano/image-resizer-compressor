const state = {
  items: [],
  nextId: 1,
  firstAspectRatio: 1,
  processing: false,
};

const videoState = {
  file: null,
  originalUrl: "",
  outputUrl: "",
  blob: null,
  width: 0,
  height: 0,
  duration: 0,
  processing: false,
};

const pdfState = {
  file: null,
  document: null,
  pageThumbUrls: [],
  pdfBlob: null,
  pdfUrl: "",
  imageEntries: [],
  processing: false,
  pdfjsLib: null,
};

const pdfCombineState = {
  items: [],
  nextId: 1,
  outputBlob: null,
  outputUrl: "",
  processing: false,
};

const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

const elements = {
  fileInput: document.getElementById("fileInput"),
  dropZone: document.getElementById("dropZone"),
  fileSummary: document.getElementById("fileSummary"),
  formatSelect: document.getElementById("formatSelect"),
  widthInput: document.getElementById("widthInput"),
  heightInput: document.getElementById("heightInput"),
  lockAspect: document.getElementById("lockAspect"),
  qualityInput: document.getElementById("qualityInput"),
  qualityValue: document.getElementById("qualityValue"),
  processButton: document.getElementById("processButton"),
  resetButton: document.getElementById("resetButton"),
  imageCount: document.getElementById("imageCount"),
  originalSize: document.getElementById("originalSize"),
  savingsValue: document.getElementById("savingsValue"),
  downloadAllButton: document.getElementById("downloadAllButton"),
  queueList: document.getElementById("queueList"),
  queueStatus: document.getElementById("queueStatus"),
  presetButtons: Array.from(document.querySelectorAll(".preset-button")),
};

const videoElements = {
  input: document.getElementById("videoInput"),
  dropZone: document.getElementById("videoDropZone"),
  summary: document.getElementById("videoSummary"),
  resolutionSelect: document.getElementById("videoResolutionSelect"),
  bitrateInput: document.getElementById("videoBitrateInput"),
  bitrateValue: document.getElementById("videoBitrateValue"),
  frameRateSelect: document.getElementById("videoFrameRateSelect"),
  formatSelect: document.getElementById("videoFormatSelect"),
  audioCheck: document.getElementById("videoAudioCheck"),
  processButton: document.getElementById("videoProcessButton"),
  resetButton: document.getElementById("videoResetButton"),
  originalPreview: document.getElementById("videoOriginalPreview"),
  outputPreview: document.getElementById("videoOutputPreview"),
  originalMeta: document.getElementById("videoOriginalMeta"),
  outputMeta: document.getElementById("videoOutputMeta"),
  originalSize: document.getElementById("videoOriginalSize"),
  outputSize: document.getElementById("videoOutputSize"),
  savingsValue: document.getElementById("videoSavingsValue"),
  downloadLink: document.getElementById("videoDownloadLink"),
  progressWrap: document.getElementById("videoProgressWrap"),
  progressBar: document.getElementById("videoProgressBar"),
  status: document.getElementById("videoStatus"),
};

const pdfElements = {
  input: document.getElementById("pdfInput"),
  dropZone: document.getElementById("pdfDropZone"),
  summary: document.getElementById("pdfSummary"),
  scaleSelect: document.getElementById("pdfScaleSelect"),
  imageFormatSelect: document.getElementById("pdfImageFormatSelect"),
  qualityInput: document.getElementById("pdfQualityInput"),
  qualityValue: document.getElementById("pdfQualityValue"),
  compressButton: document.getElementById("pdfCompressButton"),
  exportImagesButton: document.getElementById("pdfExportImagesButton"),
  resetButton: document.getElementById("pdfResetButton"),
  pageCount: document.getElementById("pdfPageCount"),
  originalSize: document.getElementById("pdfOriginalSize"),
  savingsValue: document.getElementById("pdfSavingsValue"),
  downloadLink: document.getElementById("pdfDownloadLink"),
  pagesList: document.getElementById("pdfPagesList"),
  status: document.getElementById("pdfStatus"),
  imageCount: document.getElementById("pdfImageCount"),
  imagesSize: document.getElementById("pdfImagesSize"),
  imagesFormat: document.getElementById("pdfImagesFormat"),
  imagesDownloadButton: document.getElementById("pdfImagesDownloadButton"),
  progressWrap: document.getElementById("pdfProgressWrap"),
  progressBar: document.getElementById("pdfProgressBar"),
};

const pdfCombineElements = {
  input: document.getElementById("pdfCombineInput"),
  dropZone: document.getElementById("pdfCombineDropZone"),
  summary: document.getElementById("pdfCombineSummary"),
  scaleSelect: document.getElementById("pdfCombineScaleSelect"),
  qualityInput: document.getElementById("pdfCombineQualityInput"),
  combineButton: document.getElementById("pdfCombineButton"),
  resetButton: document.getElementById("pdfCombineResetButton"),
  list: document.getElementById("pdfCombineList"),
  status: document.getElementById("pdfCombineStatus"),
  count: document.getElementById("pdfCombineCount"),
  pages: document.getElementById("pdfCombinePages"),
  originalSize: document.getElementById("pdfCombineOriginalSize"),
  outputSize: document.getElementById("pdfCombineOutputSize"),
  downloadLink: document.getElementById("pdfCombineDownloadLink"),
  progressWrap: document.getElementById("pdfCombineProgressWrap"),
  progressBar: document.getElementById("pdfCombineProgressBar"),
};

const enabledControls = [
  elements.formatSelect,
  elements.widthInput,
  elements.heightInput,
  elements.lockAspect,
  elements.qualityInput,
  elements.processButton,
  elements.resetButton,
  ...elements.presetButtons,
];

const videoEnabledControls = [
  videoElements.resolutionSelect,
  videoElements.bitrateInput,
  videoElements.frameRateSelect,
  videoElements.formatSelect,
  videoElements.audioCheck,
  videoElements.processButton,
  videoElements.resetButton,
];

const pdfEnabledControls = [
  pdfElements.scaleSelect,
  pdfElements.imageFormatSelect,
  pdfElements.qualityInput,
  pdfElements.compressButton,
  pdfElements.exportImagesButton,
  pdfElements.resetButton,
];

const pdfCombineEnabledControls = [
  pdfCombineElements.scaleSelect,
  pdfCombineElements.qualityInput,
  pdfCombineElements.combineButton,
  pdfCombineElements.resetButton,
];

elements.fileInput.addEventListener("change", (event) => {
  addFiles(event.target.files);
});

videoElements.input.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) {
    loadVideoFile(file);
  }
});

pdfElements.input.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) {
    loadPdfFile(file);
  }
});

pdfCombineElements.input.addEventListener("change", (event) => {
  addPdfCombineFiles(event.target.files);
});

["dragenter", "dragover"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("drag-over");
  });
});

elements.dropZone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

["dragenter", "dragover"].forEach((eventName) => {
  videoElements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    videoElements.dropZone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  videoElements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    videoElements.dropZone.classList.remove("drag-over");
  });
});

videoElements.dropZone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;
  if (file) {
    loadVideoFile(file);
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  pdfElements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    pdfElements.dropZone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  pdfElements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    pdfElements.dropZone.classList.remove("drag-over");
  });
});

pdfElements.dropZone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;
  if (file) {
    loadPdfFile(file);
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  pdfCombineElements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    pdfCombineElements.dropZone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  pdfCombineElements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    pdfCombineElements.dropZone.classList.remove("drag-over");
  });
});

pdfCombineElements.dropZone.addEventListener("drop", (event) => {
  addPdfCombineFiles(event.dataTransfer.files);
});

elements.widthInput.addEventListener("input", () => {
  if (elements.lockAspect.checked && state.firstAspectRatio) {
    elements.heightInput.value = Math.max(1, Math.round(Number(elements.widthInput.value) / state.firstAspectRatio));
  }
  clearBatchResults();
});

elements.heightInput.addEventListener("input", () => {
  if (elements.lockAspect.checked && state.firstAspectRatio) {
    elements.widthInput.value = Math.max(1, Math.round(Number(elements.heightInput.value) * state.firstAspectRatio));
  }
  clearBatchResults();
});

elements.qualityInput.addEventListener("input", () => {
  elements.qualityValue.value = `${elements.qualityInput.value}%`;
  clearBatchResults();
});

elements.formatSelect.addEventListener("change", () => {
  updateQualityControl();
  clearBatchResults();
});

elements.presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const firstItem = state.items[0];
    if (!firstItem) {
      return;
    }
    const scale = Number(button.dataset.scale);
    elements.widthInput.value = Math.max(1, Math.round(firstItem.originalWidth * scale));
    elements.heightInput.value = Math.max(1, Math.round(firstItem.originalHeight * scale));
    clearBatchResults();
  });
});

elements.processButton.addEventListener("click", processBatch);
elements.resetButton.addEventListener("click", resetApp);
elements.downloadAllButton.addEventListener("click", downloadAllAsZip);

videoElements.bitrateInput.addEventListener("input", () => {
  videoElements.bitrateValue.value = `${Number(videoElements.bitrateInput.value).toFixed(2).replace(/\.00$/, "")} Mbps`;
  clearVideoOutput();
});

pdfElements.qualityInput.addEventListener("input", () => {
  pdfElements.qualityValue.value = `${pdfElements.qualityInput.value}%`;
  clearPdfOutputs();
});

[pdfElements.scaleSelect, pdfElements.imageFormatSelect].forEach((control) => {
  control.addEventListener("change", clearPdfOutputs);
});

[pdfCombineElements.scaleSelect, pdfCombineElements.qualityInput].forEach((control) => {
  control.addEventListener("change", clearPdfCombineOutput);
});

[
  videoElements.resolutionSelect,
  videoElements.frameRateSelect,
  videoElements.formatSelect,
  videoElements.audioCheck,
].forEach((control) => {
  control.addEventListener("change", clearVideoOutput);
});

videoElements.processButton.addEventListener("click", optimizeVideo);
videoElements.resetButton.addEventListener("click", resetVideo);
initializeVideoFormatOptions();
pdfElements.compressButton.addEventListener("click", compressPdf);
pdfElements.exportImagesButton.addEventListener("click", exportPdfImages);
pdfElements.resetButton.addEventListener("click", resetPdf);
pdfElements.imagesDownloadButton.addEventListener("click", downloadPdfImagesZip);
pdfCombineElements.combineButton.addEventListener("click", combinePdfs);
pdfCombineElements.resetButton.addEventListener("click", resetPdfCombine);

async function addFiles(fileList) {
  const files = Array.from(fileList || []);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (imageFiles.length === 0) {
    showFileWarning("Please choose one or more image files.");
    return;
  }

  const startCount = state.items.length;
  showQueueStatus("Loading images...");

  for (const file of imageFiles) {
    await addImageFile(file);
  }

  if (state.items.length > startCount) {
    initializeControlsFromFirstImage();
    setControlsEnabled(true);
    updateQualityControl();
  }

  updateBatchSummary();
  renderQueue();
}

async function addImageFile(file) {
  const originalUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(originalUrl);
    state.items.push({
      id: state.nextId,
      file,
      image,
      originalUrl,
      compressedUrl: "",
      blob: null,
      status: "Ready",
      originalWidth: image.naturalWidth,
      originalHeight: image.naturalHeight,
      outputWidth: 0,
      outputHeight: 0,
    });
    state.nextId += 1;
  } catch (error) {
    revokeUrl(originalUrl);
    showFileWarning(`${file.name} could not be opened.`);
  }
}

function initializeControlsFromFirstImage() {
  const firstItem = state.items[0];
  if (!firstItem) {
    return;
  }

  state.firstAspectRatio = firstItem.originalWidth / firstItem.originalHeight;

  if (!elements.widthInput.value || !elements.heightInput.value) {
    elements.widthInput.value = firstItem.originalWidth;
    elements.heightInput.value = firstItem.originalHeight;
  }

  if (state.items.length === 1) {
    elements.formatSelect.value = firstItem.file.type === "image/png" ? "image/png" : "image/jpeg";
  }
}

async function processBatch() {
  if (state.items.length === 0 || state.processing) {
    return;
  }

  state.processing = true;
  setControlsEnabled(false);
  elements.processButton.disabled = true;
  elements.downloadAllButton.disabled = true;
  elements.downloadAllButton.classList.add("disabled");

  const format = elements.formatSelect.value;
  const quality = Number(elements.qualityInput.value) / 100;

  for (let index = 0; index < state.items.length; index += 1) {
    const item = state.items[index];
    item.status = "Processing";
    renderQueueItem(item);
    showQueueStatus(`Processing ${index + 1} of ${state.items.length}`);

    try {
      const { width, height } = getOutputDimensions(item);
      const blob = await renderImageBlob(item.image, width, height, format, quality);

      revokeUrl(item.compressedUrl);
      item.blob = blob;
      item.compressedUrl = URL.createObjectURL(blob);
      item.status = "Done";
      item.outputWidth = width;
      item.outputHeight = height;
    } catch (error) {
      item.blob = null;
      item.status = "Failed";
    }

    renderQueueItem(item);
    updateBatchSummary();
  }

  state.processing = false;
  setControlsEnabled(true);
  updateQualityControl();
  updateBatchSummary();
  showQueueStatus(`${getCompletedItems().length} of ${state.items.length} images processed`);
}

function getOutputDimensions(item) {
  const requestedWidth = clampDimension(elements.widthInput.value, item.originalWidth);
  const requestedHeight = clampDimension(elements.heightInput.value, item.originalHeight);

  if (!elements.lockAspect.checked) {
    return {
      width: requestedWidth,
      height: requestedHeight,
    };
  }

  const scale = Math.min(requestedWidth / item.originalWidth, requestedHeight / item.originalHeight);
  return {
    width: Math.max(1, Math.round(item.originalWidth * scale)),
    height: Math.max(1, Math.round(item.originalHeight * scale)),
  };
}

function renderImageBlob(image, width, height, format, quality) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: format === "image/png" || format === "image/webp" });
  if (format === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas export failed"));
        }
      },
      format,
      format === "image/png" ? undefined : quality
    );
  });
}

function renderQueue() {
  if (state.items.length === 0) {
    elements.queueList.className = "queue-list empty";
    elements.queueList.innerHTML = '<span class="placeholder">Selected images will appear here</span>';
    return;
  }

  elements.queueList.className = "queue-list";
  elements.queueList.innerHTML = state.items.map(getQueueItemMarkup).join("");
  elements.queueList.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => removeItem(Number(button.dataset.removeId)));
  });
  elements.queueList.querySelectorAll("[data-download-id]").forEach((button) => {
    button.addEventListener("click", () => downloadItem(Number(button.dataset.downloadId)));
  });
}

function renderQueueItem(item) {
  const existing = elements.queueList.querySelector(`[data-item-id="${item.id}"]`);
  if (!existing) {
    renderQueue();
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = getQueueItemMarkup(item).trim();
  existing.replaceWith(template.content.firstElementChild);

  const refreshed = elements.queueList.querySelector(`[data-item-id="${item.id}"]`);
  refreshed.querySelector("[data-remove-id]").addEventListener("click", () => removeItem(item.id));
  const downloadButton = refreshed.querySelector("[data-download-id]");
  if (downloadButton) {
    downloadButton.addEventListener("click", () => downloadItem(item.id));
  }
}

function getQueueItemMarkup(item) {
  const hasOutput = Boolean(item.blob && item.compressedUrl);
  const statusClass = item.status.toLowerCase();
  const outputText = hasOutput
    ? `${formatBytes(item.blob.size)} | ${item.outputWidth} x ${item.outputHeight}px`
    : item.status;
  const savingsText = hasOutput ? getSavingsText(item.file.size, item.blob.size) : "-";

  return `
    <article class="queue-item" data-item-id="${item.id}">
      <img class="queue-thumb" src="${item.originalUrl}" alt="${escapeHtml(item.file.name)}">
      <div class="queue-details">
        <div class="queue-title">
          <strong>${escapeHtml(item.file.name)}</strong>
          <span class="status-pill ${statusClass}">${item.status}</span>
        </div>
        <div class="queue-meta">
          <span>${item.originalWidth} x ${item.originalHeight}px</span>
          <span>${formatBytes(item.file.size)}</span>
          <span>${outputText}</span>
          <span>${savingsText}</span>
        </div>
      </div>
      <div class="queue-actions">
        <button type="button" class="icon-button" data-remove-id="${item.id}" aria-label="Remove ${escapeHtml(item.file.name)}">x</button>
        <button type="button" class="small-button" data-download-id="${item.id}" ${hasOutput ? "" : "disabled"}>Download</button>
      </div>
    </article>
  `;
}

function removeItem(id) {
  const index = state.items.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  const [item] = state.items.splice(index, 1);
  revokeUrl(item.originalUrl);
  revokeUrl(item.compressedUrl);

  if (state.items.length === 0) {
    resetApp();
    return;
  }

  initializeControlsFromFirstImage();
  updateBatchSummary();
  renderQueue();
}

function downloadItem(id) {
  const item = state.items.find((currentItem) => currentItem.id === id);
  if (!item || !item.compressedUrl) {
    return;
  }

  triggerDownload(item.compressedUrl, getOutputFileName(item));
}

async function downloadAllAsZip() {
  const completedItems = getCompletedItems();
  if (completedItems.length === 0) {
    return;
  }

  elements.downloadAllButton.disabled = true;
  elements.downloadAllButton.textContent = "Preparing...";

  try {
    const zipBlob = await createZipBlob(completedItems);
    const zipUrl = URL.createObjectURL(zipBlob);
    triggerDownload(zipUrl, "compressed-images.zip");
    window.setTimeout(() => revokeUrl(zipUrl), 1000);
  } finally {
    elements.downloadAllButton.disabled = false;
    elements.downloadAllButton.textContent = "Download ZIP";
  }
}

function triggerDownload(url, fileName) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function updateBatchSummary() {
  const totalOriginal = state.items.reduce((sum, item) => sum + item.file.size, 0);
  const completedItems = getCompletedItems();
  const completedOriginal = completedItems.reduce((sum, item) => sum + item.file.size, 0);
  const totalCompressed = completedItems.reduce((sum, item) => sum + item.blob.size, 0);
  const completedCount = completedItems.length;

  elements.imageCount.textContent = state.items.length ? `${completedCount}/${state.items.length}` : "-";
  elements.originalSize.textContent = state.items.length ? formatBytes(totalOriginal) : "-";
  elements.savingsValue.textContent = completedCount ? getSavingsText(completedOriginal, totalCompressed) : "-";

  const hasDownloads = completedCount > 0;
  elements.downloadAllButton.disabled = !hasDownloads;
  elements.downloadAllButton.classList.toggle("disabled", !hasDownloads);

  if (state.items.length === 0) {
    elements.fileSummary.className = "file-summary empty";
    elements.fileSummary.innerHTML = "<span>No images loaded</span>";
    showQueueStatus("Waiting for images");
  } else {
    elements.fileSummary.className = "file-summary";
    elements.fileSummary.innerHTML = `
      <span>${state.items.length} image${state.items.length === 1 ? "" : "s"} selected</span>
      <strong>${formatBytes(totalOriginal)}</strong>
    `;
    if (!state.processing) {
      showQueueStatus(`${state.items.length} image${state.items.length === 1 ? "" : "s"} ready`);
    }
  }
}

function clearBatchResults() {
  if (state.processing) {
    return;
  }

  state.items.forEach((item) => {
    revokeUrl(item.compressedUrl);
    item.compressedUrl = "";
    item.blob = null;
    item.status = "Ready";
    item.outputWidth = 0;
    item.outputHeight = 0;
  });
  updateBatchSummary();
  renderQueue();
}

function resetApp() {
  state.items.forEach((item) => {
    revokeUrl(item.originalUrl);
    revokeUrl(item.compressedUrl);
  });

  state.items = [];
  state.nextId = 1;
  state.firstAspectRatio = 1;
  state.processing = false;

  elements.fileInput.value = "";
  elements.widthInput.value = "";
  elements.heightInput.value = "";
  elements.qualityInput.value = 82;
  elements.qualityValue.value = "82%";
  elements.downloadAllButton.disabled = true;
  elements.downloadAllButton.classList.add("disabled");
  setControlsEnabled(false);
  updateBatchSummary();
  renderQueue();
}

async function loadVideoFile(file) {
  if (!file.type.startsWith("video/")) {
    showVideoWarning("Please choose a video file.");
    return;
  }

  resetVideo();
  videoState.file = file;
  videoState.originalUrl = URL.createObjectURL(file);

  const metadataVideo = document.createElement("video");
  metadataVideo.preload = "metadata";
  metadataVideo.src = videoState.originalUrl;

  try {
    await loadVideoMetadata(metadataVideo);
    videoState.width = metadataVideo.videoWidth;
    videoState.height = metadataVideo.videoHeight;
    videoState.duration = Number.isFinite(metadataVideo.duration) ? metadataVideo.duration : 0;

    videoElements.originalPreview.src = videoState.originalUrl;
    videoElements.originalMeta.textContent = `${videoState.width} x ${videoState.height}px`;
    videoElements.originalSize.textContent = formatBytes(file.size);
    videoElements.summary.className = "file-summary";
    videoElements.summary.innerHTML = `
      <span>${escapeHtml(file.name)}</span>
      <strong>${formatBytes(file.size)}</strong>
    `;

    setVideoControlsEnabled(true);
    setVideoStatus("Ready to optimize");
  } catch (error) {
    resetVideo();
    showVideoWarning("This video could not be opened in the browser.");
  }
}

async function optimizeVideo() {
  if (!videoState.file || videoState.processing) {
    return;
  }

  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    showVideoWarning("This browser does not support in-browser video compression.");
    return;
  }

  const outputFormat = videoElements.formatSelect.value;
  const mimeType = getSupportedVideoMimeType(outputFormat);
  if (!mimeType) {
    showVideoWarning(`This browser cannot export ${getVideoFormatLabel(outputFormat)} video.`);
    return;
  }

  clearVideoOutput();
  videoState.processing = true;
  setVideoControlsEnabled(false);
  setVideoProgress(0);
  videoElements.progressWrap.setAttribute("aria-hidden", "false");
  setVideoStatus("Preparing video...");

  let audioContext = null;
  let sourceVideo = null;

  try {
    const { width, height } = getVideoOutputDimensions();
    const frameRate = Number(videoElements.frameRateSelect.value);
    const bitrate = Number(videoElements.bitrateInput.value) * 1000000;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    sourceVideo = document.createElement("video");
    sourceVideo.src = videoState.originalUrl;
    sourceVideo.playsInline = true;
    sourceVideo.preload = "auto";
    sourceVideo.muted = !videoElements.audioCheck.checked;
    sourceVideo.currentTime = 0;

    await loadVideoMetadata(sourceVideo);

    const outputStream = canvas.captureStream(frameRate);
    if (videoElements.audioCheck.checked) {
      try {
        audioContext = new AudioContext();
        await audioContext.resume();
        const audioSource = audioContext.createMediaElementSource(sourceVideo);
        const audioDestination = audioContext.createMediaStreamDestination();
        audioSource.connect(audioDestination);
        audioDestination.stream.getAudioTracks().forEach((track) => outputStream.addTrack(track));
      } catch (error) {
        sourceVideo.muted = true;
      }
    }

    const chunks = [];
    const recorder = new MediaRecorder(outputStream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    });

    const recordingStopped = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size) {
          chunks.push(event.data);
        }
      };
      recorder.onerror = () => reject(new Error("Video recording failed"));
      recorder.onstop = () => resolve(new Blob(chunks, { type: outputFormat }));
    });

    let drawing = true;
    const drawFrame = () => {
      if (!drawing) {
        return;
      }
      context.drawImage(sourceVideo, 0, 0, width, height);
      if (!sourceVideo.ended && !sourceVideo.paused) {
        requestAnimationFrame(drawFrame);
      }
    };

    sourceVideo.addEventListener("timeupdate", () => {
      if (videoState.duration) {
        const percent = Math.min(99, Math.round((sourceVideo.currentTime / videoState.duration) * 100));
        setVideoProgress(percent);
        setVideoStatus(`Optimizing ${percent}%`);
      }
    });

    recorder.start(250);
    await sourceVideo.play();
    drawFrame();

    await new Promise((resolve) => {
      sourceVideo.onended = resolve;
    });

    drawing = false;
    setVideoStatus("Finalizing video...");
    recorder.stop();

    const blob = await recordingStopped;
    revokeUrl(videoState.outputUrl);
    videoState.blob = blob;
    videoState.outputUrl = URL.createObjectURL(blob);

    videoElements.outputPreview.src = videoState.outputUrl;
    videoElements.outputMeta.textContent = `${width} x ${height}px | ${getVideoFormatLabel(outputFormat)}`;
    videoElements.outputSize.textContent = formatBytes(blob.size);
    videoElements.savingsValue.textContent = getSavingsText(videoState.file.size, blob.size);
    videoElements.downloadLink.href = videoState.outputUrl;
    videoElements.downloadLink.download = `${videoState.file.name.replace(/\.[^.]+$/, "")}-optimized.${getVideoExtension(outputFormat)}`;
    videoElements.downloadLink.classList.remove("disabled");
    setVideoProgress(100);
    setVideoStatus("Video optimized");
  } catch (error) {
    showVideoWarning("Video optimization failed. Try a shorter clip, lower resolution, or another browser.");
  } finally {
    if (sourceVideo) {
      sourceVideo.pause();
      sourceVideo.removeAttribute("src");
      sourceVideo.load();
    }
    if (audioContext) {
      audioContext.close();
    }
    videoState.processing = false;
    if (videoState.blob) {
      setVideoProgress(100);
      setVideoStatus("Video optimized");
    }
    setVideoControlsEnabled(Boolean(videoState.file));
  }
}

function clearVideoOutput() {
  if (videoState.processing) {
    return;
  }

  revokeUrl(videoState.outputUrl);
  videoState.outputUrl = "";
  videoState.blob = null;
  videoElements.outputPreview.removeAttribute("src");
  videoElements.outputMeta.textContent = "-";
  videoElements.outputSize.textContent = "-";
  videoElements.savingsValue.textContent = "-";
  videoElements.downloadLink.removeAttribute("href");
  videoElements.downloadLink.removeAttribute("download");
  videoElements.downloadLink.classList.add("disabled");
  videoElements.progressWrap.setAttribute("aria-hidden", "true");
  setVideoProgress(0);
  if (videoState.file) {
    setVideoStatus("Ready to optimize");
  }
}

function resetVideo() {
  revokeUrl(videoState.originalUrl);
  revokeUrl(videoState.outputUrl);

  videoState.file = null;
  videoState.originalUrl = "";
  videoState.outputUrl = "";
  videoState.blob = null;
  videoState.width = 0;
  videoState.height = 0;
  videoState.duration = 0;
  videoState.processing = false;

  videoElements.input.value = "";
  videoElements.originalPreview.removeAttribute("src");
  videoElements.outputPreview.removeAttribute("src");
  videoElements.originalMeta.textContent = "-";
  videoElements.outputMeta.textContent = "-";
  videoElements.originalSize.textContent = "-";
  videoElements.outputSize.textContent = "-";
  videoElements.savingsValue.textContent = "-";
  videoElements.downloadLink.removeAttribute("href");
  videoElements.downloadLink.removeAttribute("download");
  videoElements.downloadLink.classList.add("disabled");
  videoElements.summary.className = "file-summary empty";
  videoElements.summary.innerHTML = "<span>No video loaded</span>";
  videoElements.progressWrap.setAttribute("aria-hidden", "true");
  setVideoProgress(0);
  setVideoStatus("Waiting for video");
  setVideoControlsEnabled(false);
}

function setVideoControlsEnabled(isEnabled) {
  videoEnabledControls.forEach((control) => {
    control.disabled = !isEnabled;
  });
  updateVideoFormatAvailability();
}

function getVideoOutputDimensions() {
  if (videoElements.resolutionSelect.value === "original") {
    return {
      width: videoState.width,
      height: videoState.height,
    };
  }

  const maxSide = Number(videoElements.resolutionSelect.value);
  const scale = Math.min(1, maxSide / Math.max(videoState.width, videoState.height));
  return {
    width: Math.max(2, Math.round((videoState.width * scale) / 2) * 2),
    height: Math.max(2, Math.round((videoState.height * scale) / 2) * 2),
  };
}

function initializeVideoFormatOptions() {
  updateVideoFormatAvailability();
}

function updateVideoFormatAvailability() {
  if (!window.MediaRecorder) {
    return;
  }

  Array.from(videoElements.formatSelect.options).forEach((option) => {
    const isSupported = Boolean(getSupportedVideoMimeType(option.value));
    option.disabled = !isSupported;
    option.textContent = isSupported
      ? getVideoFormatLabel(option.value)
      : `${getVideoFormatLabel(option.value)} unsupported`;
  });

  if (!getSupportedVideoMimeType(videoElements.formatSelect.value)) {
    const supportedOption = Array.from(videoElements.formatSelect.options).find((option) => !option.disabled);
    if (supportedOption) {
      videoElements.formatSelect.value = supportedOption.value;
    }
  }
}

function getSupportedVideoMimeType(format) {
  const mimeTypes = {
    "video/webm": [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ],
    "video/mp4": [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4;codecs=avc1.42E01E",
      "video/mp4;codecs=h264,aac",
      "video/mp4",
    ],
  }[format] || [];

  return mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
}

function getVideoFormatLabel(format) {
  return {
    "video/webm": "WebM",
    "video/mp4": "MP4",
  }[format] || "Video";
}

function getVideoExtension(format) {
  return {
    "video/webm": "webm",
    "video/mp4": "mp4",
  }[format] || "webm";
}

function loadVideoMetadata(video) {
  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => resolve(video);
    video.onerror = reject;
  });
}

function setVideoProgress(percent) {
  videoElements.progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function setVideoStatus(message) {
  videoElements.status.className = "file-summary empty video-status";
  videoElements.status.innerHTML = `<span>${escapeHtml(message)}</span>`;
}

function showVideoWarning(message) {
  videoElements.status.className = "file-summary empty video-status warning-text";
  videoElements.status.innerHTML = `<span>${escapeHtml(message)}</span>`;
}

async function loadPdfFile(file) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showPdfWarning("Please choose a PDF file.");
    return;
  }

  resetPdf();
  pdfState.file = file;
  setPdfStatus("Loading PDF...");

  try {
    const pdfjsLib = await ensurePdfJs();
    const data = await file.arrayBuffer();
    pdfState.document = await pdfjsLib.getDocument({ data }).promise;

    pdfElements.summary.className = "file-summary";
    pdfElements.summary.innerHTML = `
      <span>${escapeHtml(file.name)}</span>
      <strong>${formatBytes(file.size)}</strong>
    `;
    pdfElements.pageCount.textContent = String(pdfState.document.numPages);
    pdfElements.originalSize.textContent = formatBytes(file.size);
    setPdfControlsEnabled(true);
    setPdfStatus(`${pdfState.document.numPages} page${pdfState.document.numPages === 1 ? "" : "s"} ready`);
  } catch (error) {
    resetPdf();
    showPdfWarning("This PDF could not be opened in the browser.");
  }
}

async function compressPdf() {
  if (!pdfState.document || pdfState.processing) {
    return;
  }

  pdfState.processing = true;
  setPdfControlsEnabled(false);
  clearPdfOutputs();
  setPdfProgress(0);
  pdfElements.progressWrap.setAttribute("aria-hidden", "false");

  try {
    const pages = await renderPdfPages("image/jpeg");
    const pdfBlob = await buildImagePdf(pages);
    revokeUrl(pdfState.pdfUrl);
    pdfState.pdfBlob = pdfBlob;
    pdfState.pdfUrl = URL.createObjectURL(pdfBlob);

    const baseName = pdfState.file.name.replace(/\.[^.]+$/, "");
    pdfElements.downloadLink.href = pdfState.pdfUrl;
    pdfElements.downloadLink.download = `${baseName}-compressed.pdf`;
    pdfElements.downloadLink.classList.remove("disabled");
    pdfElements.savingsValue.textContent = getSavingsText(pdfState.file.size, pdfBlob.size);
    renderPdfPagesList(pages);
    setPdfStatus("Compressed PDF ready");
    setPdfProgress(100);
  } catch (error) {
    showPdfWarning("PDF compression failed. Try a smaller PDF or lower render size.");
  } finally {
    pdfState.processing = false;
    setPdfControlsEnabled(Boolean(pdfState.document));
  }
}

async function exportPdfImages() {
  if (!pdfState.document || pdfState.processing) {
    return;
  }

  pdfState.processing = true;
  setPdfControlsEnabled(false);
  clearPdfImageOutputs();
  setPdfProgress(0);
  pdfElements.progressWrap.setAttribute("aria-hidden", "false");

  try {
    const format = pdfElements.imageFormatSelect.value;
    const pages = await renderPdfPages(format);
    const extension = getImageExtension(format);
    const baseName = pdfState.file.name.replace(/\.[^.]+$/, "");
    pdfState.imageEntries = pages.map((page) => ({
      fileName: `${baseName}-page-${String(page.number).padStart(3, "0")}.${extension}`,
      blob: page.blob,
    }));

    renderPdfPagesList(pages);
    updatePdfImageSummary();
    setPdfStatus("Page images ready");
    setPdfProgress(100);
  } catch (error) {
    showPdfWarning("PDF image export failed. Try a smaller PDF or lower render size.");
  } finally {
    pdfState.processing = false;
    setPdfControlsEnabled(Boolean(pdfState.document));
  }
}

async function renderPdfPages(format) {
  const pages = [];
  const scale = Number(pdfElements.scaleSelect.value);
  const quality = Number(pdfElements.qualityInput.value) / 100;
  const pageCount = pdfState.document.numPages;

  clearPdfThumbs();
  setPdfStatus(`Rendering 1 of ${pageCount}`);

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdfState.document.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));

    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);
    const thumbUrl = URL.createObjectURL(blob);
    pdfState.pageThumbUrls.push(thumbUrl);
    pages.push({
      number: pageNumber,
      blob,
      thumbUrl,
      width: canvas.width,
      height: canvas.height,
      pageWidth: baseViewport.width,
      pageHeight: baseViewport.height,
      format,
    });

    const percent = Math.round((pageNumber / pageCount) * 100);
    setPdfProgress(percent);
    setPdfStatus(`Rendering ${Math.min(pageNumber + 1, pageCount)} of ${pageCount}`);
  }

  return pages;
}

function renderPdfPagesList(pages) {
  if (!pages.length) {
    pdfElements.pagesList.className = "pdf-pages-list empty";
    pdfElements.pagesList.innerHTML = '<span class="placeholder">Rendered pages will appear here</span>';
    return;
  }

  pdfElements.pagesList.className = "pdf-pages-list";
  pdfElements.pagesList.innerHTML = pages.map((page) => `
    <article class="pdf-page-card">
      <img src="${page.thumbUrl}" alt="PDF page ${page.number}">
      <strong>Page ${page.number}</strong>
      <span>${page.width} x ${page.height}px | ${formatBytes(page.blob.size)}</span>
    </article>
  `).join("");
}

async function buildImagePdf(pages) {
  const objects = [];
  const rootId = addPdfObject(objects, "<< /Type /Catalog /Pages 2 0 R >>");
  const pageKids = pages.map((_, index) => `${3 + index * 3} 0 R`).join(" ");
  addPdfObject(objects, `<< /Type /Pages /Kids [${pageKids}] /Count ${pages.length} >>`);

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const pageId = 3 + index * 3;
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    const safePageWidth = numberForPdf(page.pageWidth);
    const safePageHeight = numberForPdf(page.pageHeight);
    const content = `q\n${safePageWidth} 0 0 ${safePageHeight} 0 0 cm\n/Im${index + 1} Do\nQ\n`;

    addPdfObject(
      objects,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${safePageWidth} ${safePageHeight}] /Resources << /XObject << /Im${index + 1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    addPdfObject(objects, `<< /Length ${content.length} >>\nstream\n${content}endstream`);

    const imageBytes = new Uint8Array(await page.blob.arrayBuffer());
    addPdfObject(
      objects,
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.byteLength} >>\nstream\n`,
      imageBytes,
      "\nendstream"
    );
  }

  return createPdfBlob(objects, rootId);
}

function addPdfObject(objects, header, binary = null, footer = "") {
  objects.push({ header, binary, footer });
  return objects.length;
}

function createPdfBlob(objects, rootId) {
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let offset = 0;

  function pushPart(part) {
    parts.push(part);
    offset += typeof part === "string" ? encoder.encode(part).byteLength : part.byteLength;
  }

  pushPart("%PDF-1.4\n% generated\n");

  objects.forEach((object, index) => {
    offsets[index + 1] = offset;
    pushPart(`${index + 1} 0 obj\n`);
    pushPart(object.header);
    if (object.binary) {
      pushPart(object.binary);
    }
    if (object.footer) {
      pushPart(object.footer);
    }
    pushPart("\nendobj\n");
  });

  const xrefOffset = offset;
  pushPart(`xref\n0 ${objects.length + 1}\n`);
  pushPart("0000000000 65535 f \n");
  offsets.slice(1).forEach((objectOffset) => {
    pushPart(`${String(objectOffset).padStart(10, "0")} 00000 n \n`);
  });
  pushPart(`trailer\n<< /Size ${objects.length + 1} /Root ${rootId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(parts, { type: "application/pdf" });
}

function clearPdfOutputs() {
  if (pdfState.processing) {
    return;
  }
  revokeUrl(pdfState.pdfUrl);
  pdfState.pdfBlob = null;
  pdfState.pdfUrl = "";
  pdfElements.downloadLink.removeAttribute("href");
  pdfElements.downloadLink.removeAttribute("download");
  pdfElements.downloadLink.classList.add("disabled");
  pdfElements.savingsValue.textContent = "-";
  clearPdfImageOutputs();
  clearPdfThumbs();
  renderPdfPagesList([]);
  if (pdfState.document) {
    setPdfStatus(`${pdfState.document.numPages} page${pdfState.document.numPages === 1 ? "" : "s"} ready`);
  }
}

function clearPdfImageOutputs() {
  pdfState.imageEntries = [];
  pdfElements.imageCount.textContent = "-";
  pdfElements.imagesSize.textContent = "-";
  pdfElements.imagesFormat.textContent = "-";
  pdfElements.imagesDownloadButton.disabled = true;
  pdfElements.imagesDownloadButton.classList.add("disabled");
}

function resetPdf() {
  revokeUrl(pdfState.pdfUrl);
  clearPdfThumbs();
  pdfState.file = null;
  pdfState.document = null;
  pdfState.pdfBlob = null;
  pdfState.pdfUrl = "";
  pdfState.imageEntries = [];
  pdfState.processing = false;

  pdfElements.input.value = "";
  pdfElements.summary.className = "file-summary empty";
  pdfElements.summary.innerHTML = "<span>No PDF loaded</span>";
  pdfElements.pageCount.textContent = "-";
  pdfElements.originalSize.textContent = "-";
  pdfElements.savingsValue.textContent = "-";
  pdfElements.downloadLink.removeAttribute("href");
  pdfElements.downloadLink.removeAttribute("download");
  pdfElements.downloadLink.classList.add("disabled");
  pdfElements.progressWrap.setAttribute("aria-hidden", "true");
  setPdfProgress(0);
  clearPdfImageOutputs();
  renderPdfPagesList([]);
  setPdfStatus("Waiting for PDF");
  setPdfControlsEnabled(false);
}

function clearPdfThumbs() {
  pdfState.pageThumbUrls.forEach(revokeUrl);
  pdfState.pageThumbUrls = [];
}

function updatePdfImageSummary() {
  const totalSize = pdfState.imageEntries.reduce((sum, entry) => sum + entry.blob.size, 0);
  pdfElements.imageCount.textContent = String(pdfState.imageEntries.length);
  pdfElements.imagesSize.textContent = formatBytes(totalSize);
  pdfElements.imagesFormat.textContent = getImageExtension(pdfElements.imageFormatSelect.value).toUpperCase();
  pdfElements.imagesDownloadButton.disabled = pdfState.imageEntries.length === 0;
  pdfElements.imagesDownloadButton.classList.toggle("disabled", pdfState.imageEntries.length === 0);
}

async function downloadPdfImagesZip() {
  if (pdfState.imageEntries.length === 0) {
    return;
  }

  pdfElements.imagesDownloadButton.disabled = true;
  pdfElements.imagesDownloadButton.textContent = "Preparing...";

  try {
    const zipBlob = await createZipFromEntries(pdfState.imageEntries);
    const zipUrl = URL.createObjectURL(zipBlob);
    triggerDownload(zipUrl, `${pdfState.file.name.replace(/\.[^.]+$/, "")}-pages.zip`);
    window.setTimeout(() => revokeUrl(zipUrl), 1000);
  } finally {
    pdfElements.imagesDownloadButton.disabled = false;
    pdfElements.imagesDownloadButton.textContent = "Download Images ZIP";
  }
}

async function addPdfCombineFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  });

  if (files.length === 0) {
    showPdfCombineWarning("Please choose one or more PDF files.");
    return;
  }

  clearPdfCombineOutput();
  setPdfCombineStatus("Loading PDFs...");

  try {
    const pdfjsLib = await ensurePdfJs();
    for (const file of files) {
      const data = await file.arrayBuffer();
      const document = await pdfjsLib.getDocument({ data }).promise;
      pdfCombineState.items.push({
        id: pdfCombineState.nextId,
        file,
        document,
        pages: document.numPages,
      });
      pdfCombineState.nextId += 1;
    }

    pdfCombineElements.input.value = "";
    setPdfCombineControlsEnabled(true);
    updatePdfCombineSummary();
    renderPdfCombineList();
  } catch (error) {
    showPdfCombineWarning("One of these PDFs could not be opened in the browser.");
    updatePdfCombineSummary();
    renderPdfCombineList();
  }
}

async function combinePdfs() {
  if (pdfCombineState.items.length === 0 || pdfCombineState.processing) {
    return;
  }

  clearPdfCombineOutput();
  pdfCombineState.processing = true;
  setPdfCombineControlsEnabled(false);
  setPdfCombineProgress(0);
  pdfCombineElements.progressWrap.setAttribute("aria-hidden", "false");

  try {
    const scale = Number(pdfCombineElements.scaleSelect.value);
    const quality = clampQuality(pdfCombineElements.qualityInput.value) / 100;
    const pages = [];
    const totalPages = pdfCombineState.items.reduce((sum, item) => sum + item.pages, 0);
    let renderedPages = 0;

    for (const item of pdfCombineState.items) {
      for (let pageNumber = 1; pageNumber <= item.pages; pageNumber += 1) {
        setPdfCombineStatus(`Rendering ${renderedPages + 1} of ${totalPages}`);
        const page = await item.document.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(viewport.width));
        canvas.height = Math.max(1, Math.round(viewport.height));
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport }).promise;

        const blob = await canvasToBlob(canvas, "image/jpeg", quality);
        pages.push({
          number: pages.length + 1,
          blob,
          width: canvas.width,
          height: canvas.height,
          pageWidth: baseViewport.width,
          pageHeight: baseViewport.height,
          format: "image/jpeg",
        });
        renderedPages += 1;
        setPdfCombineProgress(Math.round((renderedPages / totalPages) * 100));
      }
    }

    const outputBlob = await buildImagePdf(pages);
    revokeUrl(pdfCombineState.outputUrl);
    pdfCombineState.outputBlob = outputBlob;
    pdfCombineState.outputUrl = URL.createObjectURL(outputBlob);
    pdfCombineElements.downloadLink.href = pdfCombineState.outputUrl;
    pdfCombineElements.downloadLink.download = "combined.pdf";
    pdfCombineElements.downloadLink.classList.remove("disabled");
    pdfCombineElements.outputSize.textContent = formatBytes(outputBlob.size);
    setPdfCombineProgress(100);
    setPdfCombineStatus("Combined PDF ready");
  } catch (error) {
    showPdfCombineWarning("PDF combine failed. Try fewer files or a lower render size.");
  } finally {
    pdfCombineState.processing = false;
    setPdfCombineControlsEnabled(pdfCombineState.items.length > 0);
  }
}

function renderPdfCombineList() {
  if (pdfCombineState.items.length === 0) {
    pdfCombineElements.list.className = "queue-list empty";
    pdfCombineElements.list.innerHTML = '<span class="placeholder">PDFs will appear here in merge order</span>';
    return;
  }

  pdfCombineElements.list.className = "queue-list";
  pdfCombineElements.list.innerHTML = pdfCombineState.items.map((item, index) => `
    <article class="queue-item pdf-combine-item" data-combine-id="${item.id}">
      <div class="queue-order">${index + 1}</div>
      <div class="queue-details">
        <div class="queue-title">
          <strong>${escapeHtml(item.file.name)}</strong>
          <span class="status-pill done">${item.pages} page${item.pages === 1 ? "" : "s"}</span>
        </div>
        <div class="queue-meta">
          <span>${formatBytes(item.file.size)}</span>
          <span>PDF</span>
          <span>${index === 0 ? "First" : `After ${index}`}</span>
          <span>Ready</span>
        </div>
      </div>
      <div class="queue-actions">
        <button type="button" class="icon-button" data-combine-up="${item.id}" ${index === 0 ? "disabled" : ""} aria-label="Move ${escapeHtml(item.file.name)} up">^</button>
        <button type="button" class="icon-button" data-combine-down="${item.id}" ${index === pdfCombineState.items.length - 1 ? "disabled" : ""} aria-label="Move ${escapeHtml(item.file.name)} down">v</button>
        <button type="button" class="icon-button" data-combine-remove="${item.id}" aria-label="Remove ${escapeHtml(item.file.name)}">x</button>
      </div>
    </article>
  `).join("");

  pdfCombineElements.list.querySelectorAll("[data-combine-up]").forEach((button) => {
    button.addEventListener("click", () => movePdfCombineItem(Number(button.dataset.combineUp), -1));
  });
  pdfCombineElements.list.querySelectorAll("[data-combine-down]").forEach((button) => {
    button.addEventListener("click", () => movePdfCombineItem(Number(button.dataset.combineDown), 1));
  });
  pdfCombineElements.list.querySelectorAll("[data-combine-remove]").forEach((button) => {
    button.addEventListener("click", () => removePdfCombineItem(Number(button.dataset.combineRemove)));
  });
}

function movePdfCombineItem(id, direction) {
  const index = pdfCombineState.items.findIndex((item) => item.id === id);
  const targetIndex = index + direction;
  if (index === -1 || targetIndex < 0 || targetIndex >= pdfCombineState.items.length) {
    return;
  }
  const [item] = pdfCombineState.items.splice(index, 1);
  pdfCombineState.items.splice(targetIndex, 0, item);
  clearPdfCombineOutput();
  updatePdfCombineSummary();
  renderPdfCombineList();
}

function removePdfCombineItem(id) {
  const index = pdfCombineState.items.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }
  pdfCombineState.items.splice(index, 1);
  clearPdfCombineOutput();
  updatePdfCombineSummary();
  renderPdfCombineList();
  setPdfCombineControlsEnabled(pdfCombineState.items.length > 0);
}

function clearPdfCombineOutput() {
  if (pdfCombineState.processing) {
    return;
  }
  revokeUrl(pdfCombineState.outputUrl);
  pdfCombineState.outputBlob = null;
  pdfCombineState.outputUrl = "";
  pdfCombineElements.downloadLink.removeAttribute("href");
  pdfCombineElements.downloadLink.removeAttribute("download");
  pdfCombineElements.downloadLink.classList.add("disabled");
  pdfCombineElements.outputSize.textContent = "-";
  pdfCombineElements.progressWrap.setAttribute("aria-hidden", "true");
  setPdfCombineProgress(0);
  if (pdfCombineState.items.length > 0) {
    setPdfCombineStatus(`${pdfCombineState.items.length} PDF${pdfCombineState.items.length === 1 ? "" : "s"} ready`);
  }
}

function resetPdfCombine() {
  revokeUrl(pdfCombineState.outputUrl);
  pdfCombineState.items = [];
  pdfCombineState.nextId = 1;
  pdfCombineState.outputBlob = null;
  pdfCombineState.outputUrl = "";
  pdfCombineState.processing = false;

  pdfCombineElements.input.value = "";
  pdfCombineElements.summary.className = "file-summary empty";
  pdfCombineElements.summary.innerHTML = "<span>No PDFs loaded</span>";
  pdfCombineElements.count.textContent = "-";
  pdfCombineElements.pages.textContent = "-";
  pdfCombineElements.originalSize.textContent = "-";
  pdfCombineElements.outputSize.textContent = "-";
  pdfCombineElements.downloadLink.removeAttribute("href");
  pdfCombineElements.downloadLink.removeAttribute("download");
  pdfCombineElements.downloadLink.classList.add("disabled");
  pdfCombineElements.progressWrap.setAttribute("aria-hidden", "true");
  setPdfCombineProgress(0);
  setPdfCombineStatus("Waiting for PDFs");
  renderPdfCombineList();
  setPdfCombineControlsEnabled(false);
}

function updatePdfCombineSummary() {
  const totalPages = pdfCombineState.items.reduce((sum, item) => sum + item.pages, 0);
  const totalSize = pdfCombineState.items.reduce((sum, item) => sum + item.file.size, 0);
  const count = pdfCombineState.items.length;

  pdfCombineElements.count.textContent = count ? String(count) : "-";
  pdfCombineElements.pages.textContent = count ? String(totalPages) : "-";
  pdfCombineElements.originalSize.textContent = count ? formatBytes(totalSize) : "-";

  if (count === 0) {
    pdfCombineElements.summary.className = "file-summary empty";
    pdfCombineElements.summary.innerHTML = "<span>No PDFs loaded</span>";
    setPdfCombineStatus("Waiting for PDFs");
  } else {
    pdfCombineElements.summary.className = "file-summary";
    pdfCombineElements.summary.innerHTML = `
      <span>${count} PDF${count === 1 ? "" : "s"} selected</span>
      <strong>${formatBytes(totalSize)}</strong>
    `;
    setPdfCombineStatus(`${count} PDF${count === 1 ? "" : "s"} ready`);
  }
}

function setPdfCombineControlsEnabled(isEnabled) {
  pdfCombineEnabledControls.forEach((control) => {
    control.disabled = !isEnabled;
  });
}

function setPdfCombineProgress(percent) {
  pdfCombineElements.progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function setPdfCombineStatus(message) {
  pdfCombineElements.status.textContent = message;
  pdfCombineElements.status.classList.remove("warning-text");
}

function showPdfCombineWarning(message) {
  pdfCombineElements.status.textContent = message;
  pdfCombineElements.status.classList.add("warning-text");
}

function clampQuality(value) {
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed)) {
    return 72;
  }
  return Math.max(35, Math.min(95, parsed));
}

async function ensurePdfJs() {
  if (!pdfState.pdfjsLib) {
    pdfState.pdfjsLib = await import(PDFJS_URL);
    pdfState.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  }
  return pdfState.pdfjsLib;
}

function setPdfControlsEnabled(isEnabled) {
  pdfEnabledControls.forEach((control) => {
    control.disabled = !isEnabled;
  });
}

function setPdfProgress(percent) {
  pdfElements.progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function setPdfStatus(message) {
  pdfElements.status.textContent = message;
  pdfElements.status.classList.remove("warning-text");
}

function showPdfWarning(message) {
  pdfElements.status.textContent = message;
  pdfElements.status.classList.add("warning-text");
}

function canvasToBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas export failed"));
      }
    }, format, quality);
  });
}

function numberForPdf(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function getImageExtension(format) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
  }[format] || "jpg";
}

function setControlsEnabled(isEnabled) {
  enabledControls.forEach((control) => {
    control.disabled = !isEnabled;
  });
  updateQualityControl();
}

function updateQualityControl() {
  const isPng = elements.formatSelect.value === "image/png";
  elements.qualityInput.disabled = isPng || state.items.length === 0 || state.processing;
  elements.qualityValue.value = isPng ? "Lossless" : `${elements.qualityInput.value}%`;
}

function getCompletedItems() {
  return state.items.filter((item) => item.blob && item.compressedUrl);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function showFileWarning(message) {
  elements.fileSummary.className = "file-summary empty warning-text";
  elements.fileSummary.innerHTML = `<span>${escapeHtml(message)}</span>`;
}

function showQueueStatus(message) {
  elements.queueStatus.textContent = message;
}

function clampDimension(value, fallback) {
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, 12000);
}

function formatBytes(bytes) {
  if (!bytes) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function getSavingsText(originalBytes, compressedBytes) {
  const difference = originalBytes - compressedBytes;
  const percentage = Math.abs(difference / originalBytes) * 100;
  if (difference > 0) {
    return `${percentage.toFixed(1)}% smaller`;
  }
  if (difference < 0) {
    return `${percentage.toFixed(1)}% larger`;
  }
  return "No change";
}

function getOutputFileName(item) {
  const baseName = item.file.name.replace(/\.[^.]+$/, "");
  return `${baseName}-compressed.${getExtension(elements.formatSelect.value)}`;
}

async function createZipBlob(items) {
  const fileParts = [];
  const centralDirectory = [];
  const encoder = new TextEncoder();
  const usedNames = new Map();
  let offset = 0;
  const { dosTime, dosDate } = getDosTimestamp(new Date());

  for (const item of items) {
    const fileName = getUniqueZipName(getOutputFileName(item), usedNames);
    const nameBytes = encoder.encode(fileName);
    const data = new Uint8Array(await item.blob.arrayBuffer());
    const crc = getCrc32(data);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, data.byteLength, true);
    localView.setUint32(22, data.byteLength, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.byteLength, true);
    centralView.setUint32(24, data.byteLength, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    fileParts.push(localHeader, data);
    centralDirectory.push(centralHeader);
    offset += localHeader.byteLength + data.byteLength;
  }

  const centralOffset = offset;
  const centralSize = centralDirectory.reduce((sum, part) => sum + part.byteLength, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, items.length, true);
  endView.setUint16(10, items.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...fileParts, ...centralDirectory, endRecord], { type: "application/zip" });
}

async function createZipFromEntries(entries) {
  const fileParts = [];
  const centralDirectory = [];
  const encoder = new TextEncoder();
  const usedNames = new Map();
  let offset = 0;
  const { dosTime, dosDate } = getDosTimestamp(new Date());

  for (const entry of entries) {
    const fileName = getUniqueZipName(entry.fileName, usedNames);
    const nameBytes = encoder.encode(fileName);
    const data = new Uint8Array(await entry.blob.arrayBuffer());
    const crc = getCrc32(data);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, data.byteLength, true);
    localView.setUint32(22, data.byteLength, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.byteLength, true);
    centralView.setUint32(24, data.byteLength, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    fileParts.push(localHeader, data);
    centralDirectory.push(centralHeader);
    offset += localHeader.byteLength + data.byteLength;
  }

  const centralOffset = offset;
  const centralSize = centralDirectory.reduce((sum, part) => sum + part.byteLength, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...fileParts, ...centralDirectory, endRecord], { type: "application/zip" });
}

function getUniqueZipName(fileName, usedNames) {
  const count = usedNames.get(fileName) || 0;
  usedNames.set(fileName, count + 1);

  if (count === 0) {
    return fileName;
  }

  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) {
    return `${fileName}-${count + 1}`;
  }
  return `${fileName.slice(0, dotIndex)}-${count + 1}${fileName.slice(dotIndex)}`;
}

function getDosTimestamp(date) {
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function getCrc32(data) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[index]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function getExtension(format) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[format] || "jpg";
}

function revokeUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
