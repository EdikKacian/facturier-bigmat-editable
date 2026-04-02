const STORAGE_KEY = "bigmat-invoice-tool-v4";
const LAYOUT_VERSION = 4;
const LEGACY_INSURANCE_NOTE =
  "Paiement par virement avec la référence indiquée ci-contre. En cas de doute OCR, corrigez manuellement les champs avant impression.";
const CLEAN_INSURANCE_NOTE = "Paiement par virement à réception de facture.";
const defaultImageSources = {
  logoFrame: "assets/bigmat-logo.svg",
  bannerFrame: "assets/bigmat-categories-banner.svg",
  watermarkFrame: "assets/bigmat-logo.svg",
};
const defaultImageFrameSizes = {
  logoFrame: { width: 236, height: 108 },
  bannerFrame: { width: 250, height: 88 },
  watermarkFrame: { width: 352, height: 164 },
};
const imageFrameLimits = {
  logoFrame: { minWidth: 120, minHeight: 56, maxWidth: 420, maxHeight: 220 },
  bannerFrame: { minWidth: 150, minHeight: 56, maxWidth: 420, maxHeight: 220 },
  watermarkFrame: { minWidth: 180, minHeight: 80, maxWidth: 620, maxHeight: 320 },
};

const lineTemplates = [
  {
    reference: "PSE-TH31-100",
    label: "Panneau isolant PSE TH31 facade 100mm 1200x600",
    quantity: 214,
    unit: "PC",
    unitPrice: 14.5,
    discount: 0,
  },
  {
    reference: "ITE-CHEV-120",
    label: "Cheville composite a frapper ITE Ø10x120 mm",
    quantity: 1284,
    unit: "PC",
    unitPrice: 0.18,
    discount: 0,
  },
  {
    reference: "ALU-DEP-100",
    label: "Profil de depart aluminium ITE 100 mm L. 3 m",
    quantity: 30,
    unit: "ML",
    unitPrice: 6.8,
    discount: 0,
  },
  {
    reference: "ALU-FIN-COUV",
    label: "Profil finition aluminium / couvertine facade",
    quantity: 20,
    unit: "ML",
    unitPrice: 9.5,
    discount: 0,
  },
  {
    reference: "VPI-COL-25",
    label: "Mortier-colle facade VPI sac 25 kg",
    quantity: 40,
    unit: "PC",
    unitPrice: 22,
    discount: 0,
  },
];

const defaultLayoutOffsets = {
  logoFrame: { x: 0, y: 0 },
  sellerBox: { x: 0, y: 0 },
  sellerText: { x: 0, y: 0 },
  bannerFrame: { x: 0, y: 0 },
  clientBox: { x: 0, y: 0 },
  clientText: { x: 0, y: 0 },
  categoriesText: { x: 0, y: 0 },
  coreBox: { x: 0, y: 0 },
  docLeftText: { x: 0, y: 0 },
  docCenterText: { x: 0, y: 0 },
  docRightText: { x: 0, y: 0 },
  deliveryText: { x: 0, y: 0 },
  totalsText: { x: 0, y: 0 },
  watermarkFrame: { x: 0, y: 0 },
  signatureBox: { x: 0, y: 0 },
  dueDateText: { x: 0, y: 0 },
  footerText: { x: 0, y: 0 },
  legalText: { x: 0, y: 0 },
};

const defaultState = {
  layoutVersion: LAYOUT_VERSION,
  documentType: "Facture",
  invoiceNumber: "20/283647",
  invoiceDate: "2025-07-10",
  dueDate: "2025-07-18",
  internalReference: "19352",
  deliveryReference: "",
  communication: "",
  vatRate: "20",
  deposit: "0",
  sellerBranch: "SAINT-MARCEL",
  sellerCategories:
    "Gros oeuvre · Bricolage · Bois · Peinture · Parquet · Carrelage · Électricité · Sanitaire",
  sellerLegal: "BigMat BMC",
  sellerAddressLine1: "25 rue Louis Alphonse Poitevin",
  sellerAddressLine2: "71380 Saint-Marcel, France",
  sellerIdentityLine: "Tél. 03 71 41 02 00",
  sellerBank1: "",
  sellerBank2: "",
  recipientName: "KACIAN ROSTAM",
  recipientStreet: "6 rue Jacques Copeau",
  recipientPostalCode: "71100",
  recipientCity: "Chalon-sur-Saône",
  recipientPhone: "",
  deliveryNote: "Le 10/07/25 enlèvement dépôt Saint-Marcel",
  paymentNote:
    "TVA sur les débits. Paiement par virement à réception de facture. En cas de retard, des pénalités pourront être appliquées selon les conditions générales de vente.",
  insuranceNote: CLEAN_INSURANCE_NOTE,
  imageSources: cloneImageSources(defaultImageSources),
  imageFrameSizes: cloneImageFrameSizes(defaultImageFrameSizes),
  layoutOffsets: cloneLayoutOffsets(defaultLayoutOffsets),
  ocrRawText: "",
  lines: lineTemplates.map(createLine),
};

const fieldNames = [
  "documentType",
  "invoiceNumber",
  "invoiceDate",
  "dueDate",
  "internalReference",
  "deliveryReference",
  "vatRate",
  "deposit",
  "sellerBranch",
  "sellerCategories",
  "sellerLegal",
  "sellerAddressLine1",
  "sellerAddressLine2",
  "sellerIdentityLine",
  "sellerBank1",
  "sellerBank2",
  "recipientName",
  "recipientStreet",
  "recipientPostalCode",
  "recipientCity",
  "recipientPhone",
  "deliveryNote",
  "paymentNote",
  "insuranceNote",
];

const elements = {
  inputs: Object.fromEntries(
    fieldNames.map((name) => [name, document.querySelector(`[data-field="${name}"]`)]),
  ),
  imageInputs: {
    logoFrame: document.querySelector("#logoImageInput"),
    bannerFrame: document.querySelector("#bannerImageInput"),
    watermarkFrame: document.querySelector("#watermarkImageInput"),
  },
  imageResetButtons: [...document.querySelectorAll("[data-reset-image]")],
  lineEditor: document.querySelector("#lineEditor"),
  addLineButton: document.querySelector("#addLineButton"),
  printButton: document.querySelector("#printButton"),
  resetButton: document.querySelector("#resetButton"),
  prefillDemoButton: document.querySelector("#prefillDemoButton"),
  runOcrButton: document.querySelector("#runOcrButton"),
  ocrInput: document.querySelector("#ocrInput"),
  ocrRawText: document.querySelector("#ocrRawText"),
  ocrStatus: document.querySelector("#ocrStatus"),
  toggleLayoutButton: document.querySelector("#toggleLayoutButton"),
  resetLayoutButton: document.querySelector("#resetLayoutButton"),
  invoiceSheet: document.querySelector("#invoiceSheet"),
  headlineTotal: document.querySelector("#headlineTotal"),
  previewBankLines: document.querySelector(".bank-lines"),
  previewLogoImage: document.querySelector("#previewLogoImage"),
  previewBannerImage: document.querySelector("#previewBannerImage"),
  previewWatermarkImage: document.querySelector("#previewWatermarkImage"),
  previewSellerBranch: document.querySelector("#previewSellerBranch"),
  previewSellerCategories: document.querySelector("#previewSellerCategories"),
  previewSellerLegal: document.querySelector("#previewSellerLegal"),
  previewSellerAddressLine1: document.querySelector("#previewSellerAddressLine1"),
  previewSellerAddressLine2: document.querySelector("#previewSellerAddressLine2"),
  previewSellerIdentityLine: document.querySelector("#previewSellerIdentityLine"),
  previewSellerBank1: document.querySelector("#previewSellerBank1"),
  previewSellerBank2: document.querySelector("#previewSellerBank2"),
  previewRecipientName: document.querySelector("#previewRecipientName"),
  previewRecipientStreet: document.querySelector("#previewRecipientStreet"),
  previewRecipientPostalCode: document.querySelector("#previewRecipientPostalCode"),
  previewRecipientCity: document.querySelector("#previewRecipientCity"),
  previewRecipientPhone: document.querySelector("#previewRecipientPhone"),
  previewDocumentType: document.querySelector("#previewDocumentType"),
  previewInvoiceNumber: document.querySelector("#previewInvoiceNumber"),
  previewInvoiceDate: document.querySelector("#previewInvoiceDate"),
  previewInternalReference: document.querySelector("#previewInternalReference"),
  previewDeliveryReference: document.querySelector("#previewDeliveryReference"),
  previewReferenceLine: document.querySelector("#previewReferenceLine"),
  previewLineBody: document.querySelector("#previewLineBody"),
  previewDeliveryNote: document.querySelector("#previewDeliveryNote"),
  previewDueDateInline: document.querySelector("#previewDueDateInline"),
  previewLineCount: document.querySelector("#previewLineCount"),
  previewSubtotal: document.querySelector("#previewSubtotal"),
  previewTaxBase: document.querySelector("#previewTaxBase"),
  previewVatRate: document.querySelector("#previewVatRate"),
  previewVatAmount: document.querySelector("#previewVatAmount"),
  previewGrandTotal: document.querySelector("#previewGrandTotal"),
  previewDeposit: document.querySelector("#previewDeposit"),
  previewBalanceDue: document.querySelector("#previewBalanceDue"),
  previewDueDate: document.querySelector("#previewDueDate"),
  previewInsuranceNote: document.querySelector("#previewInsuranceNote"),
  previewPaymentNote: document.querySelector("#previewPaymentNote"),
  movableBoxes: [...document.querySelectorAll("[data-movable-id]")],
  imageFrames: [...document.querySelectorAll("[data-image-frame-id]")],
};

elements.movableBoxMap = Object.fromEntries(
  elements.movableBoxes.map((node) => [node.dataset.movableId, node]),
);
elements.imageFrameMap = Object.fromEntries(
  elements.imageFrames.map((node) => [node.dataset.imageFrameId, node]),
);

let state = loadState();
let layoutEditMode = false;
let activeMovableId = null;
let dragState = null;
let resizeState = null;

bindFieldInputs();
bindImageInputs();
bindActions();
renderAll();

function bindFieldInputs() {
  fieldNames.forEach((name) => {
    const node = elements.inputs[name];

    if (!node) {
      return;
    }

    const eventName = node.tagName === "SELECT" ? "change" : "input";
    node.addEventListener(eventName, (event) => {
      state[name] = event.target.value;
      renderAll();
    });

    if (eventName !== "input") {
      node.addEventListener("input", (event) => {
        state[name] = event.target.value;
        renderAll();
      });
    }
  });

  elements.ocrRawText.addEventListener("input", (event) => {
    state.ocrRawText = event.target.value;
    saveState();
  });
}

function bindImageInputs() {
  Object.entries(elements.imageInputs).forEach(([frameId, input]) => {
    if (!input) {
      return;
    }

    input.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const imageSource = await readImageSource(file);
        state.imageSources[frameId] = imageSource;
        renderAll();
      } catch (error) {
        console.error(error);
        window.alert("Impossible de charger cette image.");
      } finally {
        event.target.value = "";
      }
    });
  });

  elements.imageResetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const frameId = button.dataset.resetImage;
      if (!frameId || !defaultImageSources[frameId]) {
        return;
      }

      state.imageSources[frameId] = defaultImageSources[frameId];
      renderAll();
    });
  });
}

function bindActions() {
  elements.addLineButton.addEventListener("click", () => {
    state.lines.push(createLine());
    renderAll();
  });

  elements.printButton.addEventListener("click", () => {
    window.print();
  });

  elements.resetButton.addEventListener("click", () => {
    if (!window.confirm("Réinitialiser la facture vers le modèle de base ?")) {
      return;
    }

    state = cloneState(defaultState);
    renderAll();
  });

  elements.prefillDemoButton.addEventListener("click", () => {
    state = cloneState(defaultState);
    renderAll();
  });

  elements.runOcrButton.addEventListener("click", () => {
    runOcrImport();
  });

  elements.toggleLayoutButton.addEventListener("click", () => {
    layoutEditMode = !layoutEditMode;
    if (!layoutEditMode) {
      dragState = null;
      resizeState = null;
      activeMovableId = null;
    }
    renderLayoutEditor();
  });

  elements.resetLayoutButton.addEventListener("click", () => {
    state.layoutOffsets = cloneLayoutOffsets(defaultLayoutOffsets);
    state.imageFrameSizes = cloneImageFrameSizes(defaultImageFrameSizes);
    activeMovableId = null;
    renderLayoutEditor();
    saveState();
  });

  elements.lineEditor.addEventListener("input", (event) => {
    const target = event.target.closest("[data-line-id]");
    if (!target) {
      return;
    }

    const line = state.lines.find((entry) => entry.id === target.dataset.lineId);
    if (!line) {
      return;
    }

    const field = target.dataset.lineField;
    line[field] = field === "label" || field === "reference" || field === "unit"
      ? target.value
      : sanitizeNumericInput(target.value);
    renderAll();
  });

  elements.lineEditor.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-line]");
    if (removeButton) {
      state.lines = state.lines.filter((entry) => entry.id !== removeButton.dataset.removeLine);
      renderAll();
      return;
    }

    const duplicateButton = event.target.closest("[data-duplicate-line]");
    if (duplicateButton) {
      const source = state.lines.find((entry) => entry.id === duplicateButton.dataset.duplicateLine);
      if (source) {
        const { id, ...rest } = source;
        state.lines.push(createLine(rest));
        renderAll();
      }
    }
  });

  elements.invoiceSheet.addEventListener("pointerdown", handleMovablePointerDown);
  window.addEventListener("pointermove", handleMovablePointerMove);
  window.addEventListener("pointerup", handleMovablePointerUp);
  window.addEventListener("pointercancel", handleMovablePointerUp);
}

function renderAll() {
  syncInputs();
  renderLineEditor();
  renderPreview();
  renderLayoutEditor();
  saveState();
}

function syncInputs() {
  fieldNames.forEach((name) => {
    const node = elements.inputs[name];
    const value = String(state[name] ?? "");

    if (node && node.value !== value) {
      node.value = value;
    }
  });

  if (elements.ocrRawText.value !== state.ocrRawText) {
    elements.ocrRawText.value = state.ocrRawText;
  }
}

function renderLineEditor() {
  elements.lineEditor.innerHTML = "";

  if (state.lines.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-lines";
    empty.textContent = "Aucune ligne. Cliquez sur Ajouter pour créer une position de facture.";
    elements.lineEditor.appendChild(empty);
    return;
  }

  state.lines.forEach((line, index) => {
    const computed = computeLine(line);
    const article = document.createElement("article");
    article.className = "line-card";
    article.innerHTML = `
      <div class="line-card-head">
        <div>
          <strong>Ligne ${index + 1}</strong>
          <div class="line-card-meta">
            <span>Net: ${formatAmount(computed.netUnitPrice, 3)} €</span>
            <span>Total: ${formatCurrency(computed.lineTotal)}</span>
          </div>
        </div>
        <div class="button-row">
          <button class="line-action" type="button" data-duplicate-line="${line.id}">Dupliquer</button>
          <button class="line-action" type="button" data-remove-line="${line.id}">Supprimer</button>
        </div>
      </div>

      <div class="line-grid">
        <label>
          <span>Référence</span>
          <input type="text" value="${escapeAttribute(line.reference)}" data-line-id="${line.id}" data-line-field="reference" />
        </label>
        <label class="wide-cell">
          <span>Libellé</span>
          <input type="text" value="${escapeAttribute(line.label)}" data-line-id="${line.id}" data-line-field="label" />
        </label>
        <label>
          <span>Qté</span>
          <input type="number" min="0" step="0.01" value="${escapeAttribute(line.quantity)}" data-line-id="${line.id}" data-line-field="quantity" />
        </label>
        <label>
          <span>UV</span>
          <input type="text" value="${escapeAttribute(line.unit)}" data-line-id="${line.id}" data-line-field="unit" />
        </label>
        <label>
          <span>PV brut</span>
          <input type="number" min="0" step="0.001" value="${escapeAttribute(line.unitPrice)}" data-line-id="${line.id}" data-line-field="unitPrice" />
        </label>
        <label>
          <span>Remise %</span>
          <input type="number" min="0" step="0.01" value="${escapeAttribute(line.discount)}" data-line-id="${line.id}" data-line-field="discount" />
        </label>
      </div>
    `;
    elements.lineEditor.appendChild(article);
  });
}

function renderPreview() {
  ensureImageSources();
  ensureImageFrameSizes();

  const computedLines = state.lines.map((line) => computeLine(line));
  const subtotal = roundTo(computedLines.reduce((sum, line) => sum + line.lineTotal, 0), 2);
  const vatRate = sanitizeNumber(state.vatRate);
  const vatAmount = roundTo(subtotal * (vatRate / 100), 2);
  const grandTotal = roundTo(subtotal + vatAmount, 2);
  const deposit = sanitizeNumber(state.deposit);
  const balanceDue = roundTo(grandTotal - deposit, 2);

  elements.headlineTotal.textContent = formatCurrency(grandTotal);
  elements.previewLogoImage.src = state.imageSources.logoFrame || defaultImageSources.logoFrame;
  elements.previewBannerImage.src = state.imageSources.bannerFrame || defaultImageSources.bannerFrame;
  elements.previewWatermarkImage.src =
    state.imageSources.watermarkFrame || defaultImageSources.watermarkFrame;
  elements.previewLogoImage.alt = `Logo ${state.sellerLegal || "BigMat"}`;
  elements.previewBannerImage.alt = state.sellerCategories || "Bandeau catégories";
  elements.previewWatermarkImage.alt = "Visuel central";

  elements.previewSellerBranch.textContent = state.sellerBranch || "SAINT-MARCEL";
  elements.previewSellerCategories.setAttribute(
    "title",
    state.sellerCategories || "Gros oeuvre · Bricolage · Bois · Peinture",
  );
  elements.previewSellerLegal.textContent = state.sellerLegal || "BigMat BMC";
  elements.previewSellerAddressLine1.textContent =
    state.sellerAddressLine1 || "25 rue Louis Alphonse Poitevin";
  elements.previewSellerAddressLine2.textContent =
    state.sellerAddressLine2 || "71380 Saint-Marcel, France";
  elements.previewSellerIdentityLine.textContent =
    state.sellerIdentityLine || "Tél. 03 71 41 02 00";
  elements.previewSellerBank1.textContent = state.sellerBank1 || "";
  elements.previewSellerBank2.textContent = state.sellerBank2 || "";
  elements.previewBankLines.hidden = !(state.sellerBank1.trim() || state.sellerBank2.trim());

  elements.previewRecipientName.textContent = state.recipientName || "NOM CLIENT";
  elements.previewRecipientStreet.textContent = state.recipientStreet || "RUE CLIENT";
  elements.previewRecipientPostalCode.textContent = state.recipientPostalCode || "71100";
  elements.previewRecipientCity.textContent = state.recipientCity || "VILLE";
  elements.previewRecipientPhone.textContent = state.recipientPhone || "";
  elements.previewRecipientPhone.hidden = !state.recipientPhone.trim();

  elements.previewDocumentType.textContent = (state.documentType || "Facture").toUpperCase();
  elements.previewInvoiceNumber.textContent = state.invoiceNumber || "-";
  elements.previewInvoiceDate.textContent = formatDate(state.invoiceDate);
  elements.previewInternalReference.textContent = state.internalReference || "-";
  elements.previewDeliveryReference.textContent = state.deliveryReference || "-";
  elements.previewReferenceLine.textContent = state.internalReference || "-";
  elements.previewDeliveryNote.textContent = state.deliveryNote || "";
  elements.previewDueDateInline.textContent = formatDate(state.dueDate);
  elements.previewLineCount.textContent = String(computedLines.length);
  elements.previewSubtotal.textContent = formatAmount(subtotal);
  elements.previewTaxBase.textContent = formatAmount(subtotal);
  elements.previewVatRate.textContent = formatFlexible(vatRate);
  elements.previewVatAmount.textContent = formatAmount(vatAmount);
  elements.previewGrandTotal.textContent = formatAmount(grandTotal);
  elements.previewDeposit.textContent = formatAmount(deposit);
  elements.previewBalanceDue.textContent = formatAmount(balanceDue);
  elements.previewDueDate.textContent = formatDate(state.dueDate);
  elements.previewInsuranceNote.textContent = state.insuranceNote || "";
  elements.previewPaymentNote.textContent = state.paymentNote || "";

  renderPreviewLines(computedLines);
}

function renderLayoutEditor() {
  ensureLayoutOffsets();
  ensureImageFrameSizes();

  elements.invoiceSheet.classList.toggle("is-layout-editing", layoutEditMode);
  elements.toggleLayoutButton.textContent = layoutEditMode
    ? "Terminer le placement"
    : "Déplacer / redimensionner";

  Object.entries(elements.movableBoxMap).forEach(([id, node]) => {
    const offset = state.layoutOffsets[id] || { x: 0, y: 0 };
    node.style.setProperty("--move-x", `${offset.x}px`);
    node.style.setProperty("--move-y", `${offset.y}px`);
    node.classList.toggle("is-selected", layoutEditMode && activeMovableId === id);
  });

  Object.keys(elements.imageFrameMap).forEach(applyImageFrameSize);
}

function handleMovablePointerDown(event) {
  if (!layoutEditMode) {
    return;
  }

  const resizeHandle = event.target.closest("[data-resize-handle]");
  if (resizeHandle) {
    const frame = resizeHandle.closest("[data-resizable-id]");
    if (frame && elements.invoiceSheet.contains(frame)) {
      event.preventDefault();

      const frameId = frame.dataset.resizableId;
      const currentSize = state.imageFrameSizes[frameId] || defaultImageFrameSizes[frameId];

      activeMovableId = frameId;
      dragState = null;
      resizeState = {
        frameId,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originWidth: currentSize.width,
        originHeight: currentSize.height,
        limits: imageFrameLimits[frameId] || {
          minWidth: 80,
          minHeight: 40,
          maxWidth: 640,
          maxHeight: 360,
        },
      };

      frame.setPointerCapture?.(event.pointerId);
      renderLayoutEditor();
      return;
    }
  }

  const movable = event.target.closest("[data-movable-id]");
  if (!movable || !elements.invoiceSheet.contains(movable)) {
    return;
  }

  event.preventDefault();

  const movableId = movable.dataset.movableId;
  const origin = state.layoutOffsets[movableId] || { x: 0, y: 0 };

  activeMovableId = movableId;
  dragState = {
    movableId,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: origin.x,
    originY: origin.y,
    bounds: getMovableBounds(movable, origin),
  };

  movable.setPointerCapture?.(event.pointerId);
  renderLayoutEditor();
}

function handleMovablePointerMove(event) {
  if (resizeState && event.pointerId === resizeState.pointerId) {
    const nextWidth = clamp(
      Math.round(resizeState.originWidth + (event.clientX - resizeState.startX)),
      resizeState.limits.minWidth,
      resizeState.limits.maxWidth,
    );
    const nextHeight = clamp(
      Math.round(resizeState.originHeight + (event.clientY - resizeState.startY)),
      resizeState.limits.minHeight,
      resizeState.limits.maxHeight,
    );

    state.imageFrameSizes[resizeState.frameId] = {
      width: nextWidth,
      height: nextHeight,
    };
    applyImageFrameSize(resizeState.frameId);
    return;
  }

  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const rawX = Math.round(dragState.originX + (event.clientX - dragState.startX));
  const rawY = Math.round(dragState.originY + (event.clientY - dragState.startY));
  const nextX = clamp(rawX, dragState.bounds.minX, dragState.bounds.maxX);
  const nextY = clamp(rawY, dragState.bounds.minY, dragState.bounds.maxY);

  state.layoutOffsets[dragState.movableId] = { x: nextX, y: nextY };
  applyMovableOffset(dragState.movableId);
}

function handleMovablePointerUp(event) {
  if (resizeState && event.pointerId === resizeState.pointerId) {
    const frame = elements.imageFrameMap[resizeState.frameId];
    frame?.releasePointerCapture?.(event.pointerId);
    resizeState = null;
    saveState();
    return;
  }

  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const movable = elements.movableBoxMap[dragState.movableId];
  movable?.releasePointerCapture?.(event.pointerId);
  dragState = null;
  saveState();
}

function applyMovableOffset(movableId) {
  const node = elements.movableBoxMap[movableId];
  if (!node) {
    return;
  }

  const offset = state.layoutOffsets[movableId] || { x: 0, y: 0 };
  node.style.setProperty("--move-x", `${offset.x}px`);
  node.style.setProperty("--move-y", `${offset.y}px`);
}

function applyImageFrameSize(frameId) {
  const node = elements.imageFrameMap[frameId];
  if (!node) {
    return;
  }

  const size = state.imageFrameSizes[frameId] || defaultImageFrameSizes[frameId];
  node.style.setProperty("--frame-width", `${size.width}px`);
  node.style.setProperty("--frame-height", `${size.height}px`);
}

function renderPreviewLines(lines) {
  elements.previewLineBody.innerHTML = "";

  if (lines.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    row.innerHTML = '<td colspan="8">Ajoutez des lignes dans le panneau de gauche.</td>';
    elements.previewLineBody.appendChild(row);
    return;
  }

  lines.forEach((line) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(line.reference || "-")}</td>
      <td>${escapeHtml(line.label || "Ligne sans libellé")}</td>
      <td>${formatQuantity(line.quantity)}</td>
      <td>${escapeHtml(line.unit || "-")}</td>
      <td>${formatAmount(line.unitPrice, 3)}</td>
      <td>${formatFlexible(line.discount)}</td>
      <td>${formatAmount(line.netUnitPrice, 3)}</td>
      <td>${formatAmount(line.lineTotal)}</td>
    `;
    elements.previewLineBody.appendChild(row);
  });
}

function computeLine(line) {
  const quantity = sanitizeNumber(line.quantity);
  const unitPrice = sanitizeNumber(line.unitPrice);
  const discount = clamp(sanitizeNumber(line.discount), 0, 100);
  const netUnitPrice = roundTo(unitPrice * (1 - discount / 100), 3);
  const lineTotal = roundTo(quantity * netUnitPrice, 2);

  return {
    ...line,
    quantity,
    unitPrice,
    discount,
    netUnitPrice,
    lineTotal,
  };
}

function createLine(overrides = {}) {
  return {
    id: `line-${crypto.randomUUID()}`,
    reference: "",
    label: "",
    quantity: 1,
    unit: "PC",
    unitPrice: 0,
    discount: 0,
    ...overrides,
  };
}

async function runOcrImport() {
  const file = elements.ocrInput.files?.[0];

  if (!file) {
    window.alert("Choisissez d’abord une image de facture.");
    return;
  }

  setOcrStatus("Chargement");
  elements.runOcrButton.disabled = true;

  try {
    const Tesseract = await loadTesseractScript();
    const worker = await Tesseract.createWorker("fra");
    const result = await worker.recognize(file);
    await worker.terminate();

    state.ocrRawText = result.data.text.trim();
    const extracted = extractInvoiceData(state.ocrRawText);
    applyOcrExtraction(extracted);
    setOcrStatus(extracted.matchCount > 0 ? "Données trouvées" : "Texte extrait");
    renderAll();
  } catch (error) {
    console.error(error);
    setOcrStatus("Échec OCR");
    window.alert("L’analyse OCR a échoué. Vérifiez la connexion puis réessayez.");
  } finally {
    elements.runOcrButton.disabled = false;
  }
}

let tesseractPromise;

function loadTesseractScript() {
  if (window.Tesseract) {
    return Promise.resolve(window.Tesseract);
  }

  if (!tesseractPromise) {
    tesseractPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      script.onload = () => resolve(window.Tesseract);
      script.onerror = () => reject(new Error("Impossible de charger Tesseract.js."));
      document.head.appendChild(script);
    });
  }

  return tesseractPromise;
}

function extractInvoiceData(rawText) {
  const lines = rawText
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => normalizeLine(line))
    .filter(Boolean);
  const joined = lines.join("\n");
  const result = { matchCount: 0 };

  assignMatch(result, "invoiceNumber", joined.match(/FACTURE\s*(?:N[O°º])?\s*([A-Z0-9/-]{4,})/i));
  assignMatch(
    result,
    "internalReference",
    joined.match(/(?:NO-?CI|REF\.?\s*INT(?:ERNE)?\.?)\s*([A-Z0-9/-]+)/i),
  );
  assignMatch(
    result,
    "deliveryReference",
    joined.match(/(?:NO-?DVA|BL|DOSSIER)\s*([A-Z0-9/-]+)/i),
  );

  const invoiceDate = findDateNearKeyword(lines, /(?:^|\s)LE\b|DATE/i);
  if (invoiceDate) {
    result.invoiceDate = invoiceDate;
    result.matchCount += 1;
  }

  const dueDate = findDateNearKeyword(lines, /ECHEANCE|ÉCHÉANCE/i);
  if (dueDate) {
    result.dueDate = dueDate;
    result.matchCount += 1;
  }

  const recipient = extractRecipientBlock(lines);
  Object.entries(recipient).forEach(([key, value]) => {
    if (value) {
      result[key] = value;
      result.matchCount += 1;
    }
  });

  const parsedLines = extractInvoiceLines(lines);
  if (parsedLines.length > 0) {
    result.lines = parsedLines;
    result.matchCount += parsedLines.length;
  }

  return result;
}

function extractRecipientBlock(lines) {
  const invoiceIndex = lines.findIndex((line) => /FACTURE/i.test(line));

  for (let index = 0; index < Math.max(invoiceIndex, 0); index += 1) {
    const line = lines[index];
    const next = lines[index + 1] || "";
    const postalLine = lines[index + 2] || "";
    const phoneLine = lines[index + 3] || "";

    if (!looksLikeRecipientName(line)) {
      continue;
    }

    if (!looksLikeStreet(next) && !looksLikePostal(postalLine)) {
      continue;
    }

    return {
      recipientName: line,
      recipientStreet: next,
      recipientPostalCode: extractPostalCode(postalLine),
      recipientCity: extractCity(postalLine),
      recipientPhone: /TEL|T[ÉE]L|GSM|PHONE/i.test(phoneLine) ? phoneLine : "",
    };
  }

  return {};
}

function extractInvoiceLines(lines) {
  const startIndex = lines.findIndex(
    (line) => /LIBELL|QT[ÉE]|PV-?BRUT|REMISE/i.test(line),
  );

  if (startIndex === -1) {
    return [];
  }

  const collected = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (/DATE D['’]ECHEANCE|ÉCHÉANCE|ACOMPTE|COMMUNICATION|ATRADIUS|CONDITIONS/i.test(line)) {
      break;
    }

    const item = parseOcrLine(line);
    if (item) {
      collected.push(item);
    }

    if (collected.length >= 18) {
      break;
    }
  }

  return collected;
}

function parseOcrLine(line) {
  if (!/^\d{4,}/.test(line)) {
    return null;
  }

  const tokens = line
    .split(/\s+/)
    .map((token) => cleanOcrToken(token))
    .filter(Boolean);

  if (tokens.length < 6) {
    return null;
  }

  let quantityIndex = -1;

  for (let index = 1; index < tokens.length - 2; index += 1) {
    if (isNumberToken(tokens[index]) && isUnitToken(tokens[index + 1])) {
      quantityIndex = index;
      break;
    }
  }

  if (quantityIndex === -1) {
    return null;
  }

  const reference = tokens[0];
  const label = tokens.slice(1, quantityIndex).join(" ").trim();
  const quantity = sanitizeNumber(tokens[quantityIndex]);
  const unit = tokens[quantityIndex + 1];
  const numericTail = tokens
    .slice(quantityIndex + 2)
    .filter((token) => isNumberToken(token))
    .map((token) => sanitizeNumber(token));

  let unitPrice = numericTail[0] || 0;
  let discount = 0;

  if (numericTail.length >= 4) {
    discount = Math.abs(numericTail[1]);
  } else if (numericTail.length >= 2 && unitPrice > 0) {
    discount = roundTo((1 - numericTail[1] / unitPrice) * 100, 2);
  }

  return createLine({
    reference,
    label,
    quantity: quantity || 1,
    unit,
    unitPrice: roundTo(unitPrice, 3),
    discount: clamp(discount, 0, 100),
  });
}

function applyOcrExtraction(extracted) {
  const simpleFields = [
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
    "internalReference",
    "deliveryReference",
    "recipientName",
    "recipientStreet",
    "recipientPostalCode",
    "recipientCity",
    "recipientPhone",
  ];

  simpleFields.forEach((field) => {
    if (extracted[field]) {
      state[field] = extracted[field];
    }
  });

  if (Array.isArray(extracted.lines) && extracted.lines.length > 0) {
    state.lines = extracted.lines;
  }
}

function assignMatch(result, field, match) {
  if (match?.[1]) {
    result[field] = match[1];
    result.matchCount += 1;
  }
}

function findDateNearKeyword(lines, keywordPattern) {
  const directMatch = lines.find((line) => keywordPattern.test(line) && extractDateValue(line));
  if (directMatch) {
    return extractDateValue(directMatch);
  }

  const genericMatch = lines.map(extractDateValue).find(Boolean);
  return genericMatch || "";
}

function extractDateValue(line) {
  const match = line.match(/(\d{1,2}[/. -]\d{1,2}[/. -]\d{2,4})/);
  return match ? convertTextDateToInput(match[1]) : "";
}

function normalizeLine(line) {
  return line
    .replace(/[|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeRecipientName(value) {
  if (!value) {
    return false;
  }

  if (/BIGMAT|SAINT-MARCEL|TVA|FACTURE|TOTAL|REGLEMENT|RÈGLEMENT|PAIEMENT|SIRET/i.test(value)) {
    return false;
  }

  const words = value.split(" ");
  return words.length <= 4 && /[A-Z]{2,}/.test(value);
}

function looksLikeStreet(value) {
  return /\b(RUE|AVENUE|CHAUSS[ÉE]E|BOULEVARD|STRAAT|STREET|ROAD)\b/i.test(value);
}

function looksLikePostal(value) {
  return /\b(?:[A-Z]-)?\d{4,5}\b/.test(value);
}

function extractPostalCode(value) {
  const match = value.match(/((?:[A-Z]-)?\d{4,5})/);
  return match ? match[1] : "";
}

function extractCity(value) {
  const postal = extractPostalCode(value);
  if (!postal) {
    return value;
  }

  return value.replace(postal, "").trim().replace(/^[-, ]+/, "");
}

function cleanOcrToken(token) {
  return token
    .replace(/[^\p{L}\p{N}.,/%+-]/gu, "")
    .replace(/^%$/, "")
    .trim();
}

function isNumberToken(value) {
  return /^-?\d+(?:[.,]\d+)?$/.test(value);
}

function isUnitToken(value) {
  return /^[A-Z]{1,4}$/.test(value);
}

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return cloneState(defaultState);
    }

    const parsed = JSON.parse(stored);
    const nextState = {
      ...cloneState(defaultState),
      ...parsed,
      imageSources: cloneImageSources(parsed.imageSources),
      imageFrameSizes: cloneImageFrameSizes(parsed.imageFrameSizes),
      layoutOffsets: cloneLayoutOffsets(parsed.layoutOffsets),
      lines: Array.isArray(parsed.lines) && parsed.lines.length > 0
        ? parsed.lines.map((line) => createLine(line))
        : cloneState(defaultState).lines,
    };

    if (parsed.layoutVersion !== LAYOUT_VERSION) {
      nextState.layoutVersion = LAYOUT_VERSION;
      nextState.layoutOffsets = cloneLayoutOffsets(defaultLayoutOffsets);
      nextState.imageFrameSizes = cloneImageFrameSizes(defaultImageFrameSizes);
    }

    if (nextState.insuranceNote === LEGACY_INSURANCE_NOTE) {
      nextState.insuranceNote = CLEAN_INSURANCE_NOTE;
    }

    return nextState;
  } catch (error) {
    console.error(error);
    return cloneState(defaultState);
  }
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}

function cloneState(source) {
  return {
    ...source,
    imageSources: cloneImageSources(source.imageSources),
    imageFrameSizes: cloneImageFrameSizes(source.imageFrameSizes),
    layoutOffsets: cloneLayoutOffsets(source.layoutOffsets),
    lines: source.lines.map((line) => createLine(line)),
  };
}

function getMovableBounds(node, origin) {
  const parent = node.parentElement;
  if (!parent) {
    return { minX: -600, maxX: 600, minY: -600, maxY: 600 };
  }

  const parentRect = parent.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  const baseLeft = rect.left - origin.x;
  const baseTop = rect.top - origin.y;

  return {
    minX: Math.round(parentRect.left - baseLeft),
    maxX: Math.round(parentRect.right - (baseLeft + rect.width)),
    minY: Math.round(parentRect.top - baseTop),
    maxY: Math.round(parentRect.bottom - (baseTop + rect.height)),
  };
}

function cloneLayoutOffsets(source = defaultLayoutOffsets) {
  return Object.fromEntries(
    Object.entries(defaultLayoutOffsets).map(([id, fallback]) => [
      id,
      { ...(source?.[id] || fallback) },
    ]),
  );
}

function cloneImageSources(source = defaultImageSources) {
  return {
    ...defaultImageSources,
    ...(source || {}),
  };
}

function cloneImageFrameSizes(source = defaultImageFrameSizes) {
  return Object.fromEntries(
    Object.entries(defaultImageFrameSizes).map(([id, fallback]) => {
      const size = source?.[id] || fallback;
      return [
        id,
        {
          width: sanitizeSizeValue(size.width, fallback.width),
          height: sanitizeSizeValue(size.height, fallback.height),
        },
      ];
    }),
  );
}

function ensureLayoutOffsets() {
  if (!state.layoutOffsets) {
    state.layoutOffsets = cloneLayoutOffsets(defaultLayoutOffsets);
    return;
  }

  state.layoutOffsets = cloneLayoutOffsets(state.layoutOffsets);
}

function ensureImageSources() {
  state.imageSources = cloneImageSources(state.imageSources);
}

function ensureImageFrameSizes() {
  state.imageFrameSizes = cloneImageFrameSizes(state.imageFrameSizes);
}

function sanitizeNumericInput(value) {
  return value === "" ? "" : String(value).replace(",", ".");
}

function sanitizeNumber(value) {
  const normalized = typeof value === "string" ? value.replace(",", ".") : value;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeSizeValue(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function roundTo(value, precision) {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return `${formatAmount(value)} €`;
}

function formatAmount(value, decimals = 2) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(sanitizeNumber(value));
}

function formatFlexible(value) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: Number.isInteger(sanitizeNumber(value)) ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(sanitizeNumber(value));
}

function formatQuantity(value) {
  const numeric = sanitizeNumber(value);
  return Number.isInteger(numeric) ? String(numeric) : formatFlexible(numeric);
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function convertTextDateToInput(value) {
  const sanitized = value.replace(/[. ]/g, "/");
  const parts = sanitized.split("/");

  if (parts.length !== 3) {
    return "";
  }

  let [day, month, year] = parts;
  if (year.length === 2) {
    year = Number.parseInt(year, 10) > 50 ? `19${year}` : `20${year}`;
  }

  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

async function readImageSource(file) {
  const directSource = await readFileAsDataUrl(file);

  if (file.type === "image/svg+xml" || directSource.length < 900000) {
    return directSource;
  }

  const image = await loadImageElement(directSource);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, 1400 / Math.max(longestSide, 1));

  if (scale === 1) {
    return directSource;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");

  if (!context) {
    return directSource;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.92);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Lecture de fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Chargement image impossible."));
    image.src = source;
  });
}


function setOcrStatus(label) {
  elements.ocrStatus.textContent = label;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}
