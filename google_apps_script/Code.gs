const SPREADSHEET_ID = "1mauymVAVl_yXgMwyOmb4EyKq-WdvtMIfHR6-bDwk-rE";
const SHEET_NAME = "Responses";
const DRIVE_FOLDER_ID = "1-ZvL59ABxHQI3R6qJKWjq8BrLq4w_SFJ?hl=vi";
const START_CODE = 1;
const END_CODE = 200;
const CODE_WIDTH = 3;
const TIME_ZONE = "Asia/Ho_Chi_Minh";

const FORM_MODEL = "Mẫu số 02";
const WARD_NAME = "UBND phường Phú Lương";
const SURVEY_TITLE = "MẪU PHIẾU KHẢO SÁT";
const SURVEY_SUBTITLE = "Khảo sát đo lường mức độ hài lòng đối với các phòng chuyên môn thuộc UBND phường";
const PLAN_LINE = "(Kèm theo Kế hoạch ...... /KH-UBND ngày ...... tháng ...... năm 2026 của UBND phường Phú Lương)";
const PURPOSE_TEXT = "Để giúp UBND phường triển khai đo lường sự hài lòng của tổ chức, cá nhân đối với sự phục vụ của các phòng chuyên môn thuộc UBND phường. Kính mong Ông (bà) cung cấp thông tin đầy đủ, chính xác, khách quan đối với việc thực hiện một số nội dung của chính quyền đối với ông (bà).";
const INSTRUCTION_TEXT = "Xin Ông/Bà chọn một trong các chữ số 1, 2, 3, 4, 5 đối với từng nhận định; trong đó 5 = Rất hài lòng, 4 = Hài lòng, 3 = Bình thường, 2 = Không hài lòng và 1 = Rất không hài lòng.";

const HEADERS = [
  "MaPhieu",
  "ThoiGianGui",
  "LinhVuc",
  "q_1",
  "q_2",
  "q_3",
  "q_4",
  "q_5",
  "q_6",
  "q_7",
  "q_8",
  "q_9",
  "GioiTinh",
  "DoTuoi",
  "TrinhDo",
  "FileUrl"
];

const SURVEY_SECTIONS = [
  {
    title: "I. CÔNG CHỨC TRỰC TIẾP GIẢI QUYẾT CÔNG VIỆC",
    questions: [
      "Công chức có thái độ giao tiếp lịch sự.",
      "Công chức trả lời, giải thích, hướng dẫn kê khai hồ sơ tận tình, chu đáo, dễ hiểu.",
      "Công chức tuân thủ đúng quy định trong giải quyết công việc."
    ]
  },
  {
    title: "II. KẾT QUẢ CUNG ỨNG DỊCH VỤ HÀNH CHÍNH CÔNG",
    questions: [
      "Kết quả mà Ông/Bà nhận được là đúng quy định (Kết quả có thể là được cấp giấy tờ hoặc bị từ chối cấp giấy tờ).",
      "Kết quả mà Ông/Bà nhận được có thông tin đầy đủ, chính xác."
    ]
  },
  {
    title: "III. TIẾP NHẬN, XỬ LÝ CÁC Ý KIẾN GÓP Ý, PHẢN ÁNH, KIẾN NGHỊ",
    questions: [
      "Cơ quan có bố trí hình thức tiếp nhận góp ý, phản ánh, kiến nghị của người dân, tổ chức.",
      "Ông/Bà dễ dàng thực hiện góp ý, phản ánh, kiến nghị.",
      "Cơ quan tiếp nhận và xử lý tích cực các góp ý, phản ánh, kiến nghị của Ông/Bà.",
      "Cơ quan thông báo kịp thời kết quả xử lý các ý kiến góp ý, phản ánh, kiến nghị cho Ông/Bà."
    ]
  }
];

const RATING_HEADERS = [
  "Rất hài lòng",
  "Hài lòng",
  "Bình thường",
  "Không hài lòng",
  "Rất không hài lòng"
];

const ALLOWED_VALUES = {
  gioiTinh: ["Nam", "Nữ"],
  doTuoi: [
    "Từ 18 - 24 tuổi",
    "Từ 25-34 tuổi",
    "Từ 35-49 tuổi",
    "Từ 50-60 tuổi",
    "Trên 60 tuổi"
  ],
  trinhDo: [
    "Tiểu học",
    "Trung học cơ sở (Cấp II)",
    "Trung học phổ thông (Cấp 3)",
    "Đại học",
    "Dạy nghề, Trung cấp, Cao đẳng",
    "Sau Đại học"
  ]
};

function setupProject() {
  validateConfiguration_();
  const sheet = getResponseSheet_();
  ensureHeaders_(sheet);
  sheet.getRange("A:A").setNumberFormat("@");
  DriveApp.getFolderById(DRIVE_FOLDER_ID).getName();
  return "Thiết lập hoàn tất. Mã tiếp theo: " + formatCode_(getNextSurveyCode_(sheet)) + ".";
}

function testCreateSamplePdf() {
  validateConfiguration_();
  const sampleData = {
    linhVuc: "Đăng ký khai sinh (dữ liệu kiểm tra)",
    gioiTinh: "Nam",
    doTuoi: "Từ 35-49 tuổi",
    trinhDo: "Đại học"
  };

  for (let index = 1; index <= 9; index += 1) {
    sampleData["q_" + index] = String(5 - ((index - 1) % 5));
  }

  const file = createSurveyPdf_(sampleData, formatCode_(START_CODE), new Date(), true);
  return "Đã tạo PDF mẫu, không ghi Sheet và không tăng mã phiếu: " + file.getUrl();
}

function doGet() {
  return jsonResponse_({
    success: true,
    message: "Google Apps Script Web App khảo sát Phú Lương đang hoạt động."
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let pdfFile = null;
  let responseCommitted = false;

  try {
    validateConfiguration_();
    const data = parseRequest_(e);
    validatePayload_(data);

    lock.waitLock(30000);

    const sheet = getResponseSheet_();
    ensureHeaders_(sheet);
    const codeNumber = getNextSurveyCode_(sheet);
    const code = formatCode_(codeNumber);
    const submittedAt = new Date();

    pdfFile = createSurveyPdf_(data, code, submittedAt, false);
    appendResponse_(sheet, data, code, submittedAt, pdfFile.getUrl());
    SpreadsheetApp.flush();
    responseCommitted = true;

    return jsonResponse_({
      success: true,
      message: "Hệ thống đã ghi nhận phiếu khảo sát số " + code + ".",
      code: code,
      fileUrl: pdfFile.getUrl()
    });
  } catch (error) {
    if (pdfFile && !responseCommitted) {
      try {
        pdfFile.setTrashed(true);
      } catch (cleanupError) {
        console.error("Không thể xóa PDF sau lỗi: " + cleanupError.message);
      }
    }

    console.error(error.stack || error.message || error);
    return jsonResponse_({
      success: false,
      message: getPublicErrorMessage_(error)
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function parseRequest_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Dữ liệu gửi lên không hợp lệ.");
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error("Dữ liệu JSON không hợp lệ.");
  }
}

function validatePayload_(data) {
  const requiredFields = ["linhVuc"];
  for (let index = 1; index <= 9; index += 1) requiredFields.push("q_" + index);
  requiredFields.push("gioiTinh", "doTuoi", "trinhDo");

  const missingFields = requiredFields.filter(function (field) {
    return String(data[field] || "").trim() === "";
  });
  if (missingFields.length > 0) {
    throw new Error("Vui lòng trả lời đầy đủ tất cả nội dung bắt buộc.");
  }

  const linhVuc = String(data.linhVuc || "").trim();
  if (!linhVuc) {
    throw new Error("Vui lòng nhập lĩnh vực/thủ tục hành chính đã giải quyết.");
  }
  if (linhVuc.length > 500) {
    throw new Error("Nội dung lĩnh vực/thủ tục hành chính quá dài.");
  }

  for (let index = 1; index <= 9; index += 1) {
    if (["1", "2", "3", "4", "5"].indexOf(String(data["q_" + index])) === -1) {
      throw new Error("Điểm đánh giá không hợp lệ.");
    }
  }

  const hasInvalidProfileValue = Object.keys(ALLOWED_VALUES).some(function (field) {
    return ALLOWED_VALUES[field].indexOf(String(data[field])) === -1;
  });
  if (hasInvalidProfileValue) {
    throw new Error("Thông tin người trả lời không hợp lệ.");
  }
}

function validateConfiguration_() {
  if (SPREADSHEET_ID.indexOf("DÁN_ID_") === 0 || DRIVE_FOLDER_ID.indexOf("DÁN_ID_") === 0) {
    throw new Error("Ứng dụng chưa được cấu hình ID Google Sheet hoặc thư mục Drive.");
  }

  const googleIdPattern = /^[a-zA-Z0-9_-]+$/;
  if (!googleIdPattern.test(SPREADSHEET_ID) || !googleIdPattern.test(DRIVE_FOLDER_ID)) {
    throw new Error("ID Google Sheet hoặc thư mục Drive không hợp lệ. Chỉ dán ID, không dán URL hoặc phần ?hl=vi.");
  }
}

function getResponseSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasAnyHeader = currentHeaders.some(function (value) {
    return String(value).trim() !== "";
  });

  if (!hasAnyHeader) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#ccfbf1")
      .setWrap(true);
    sheet.getRange("A:A").setNumberFormat("@");
    return;
  }

  const headersMatch = HEADERS.every(function (header, index) {
    return currentHeaders[index] === header;
  });
  if (!headersMatch || sheet.getLastColumn() > HEADERS.length) {
    throw new Error("Header của sheet Responses không đúng cấu trúc yêu cầu.");
  }

  sheet.setFrozenRows(1);
  sheet.getRange("A:A").setNumberFormat("@");
}

function getNextSurveyCode_(sheet) {
  const lastCode = getLastCodeFromSheet_(sheet);
  const nextCode = lastCode === null ? START_CODE : lastCode + 1;

  if (nextCode > END_CODE) {
    throw new Error("Đã đủ số lượng phiếu khảo sát.");
  }
  return nextCode;
}

function getLastCodeFromSheet_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const dataRows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues()
    .filter(function (row) {
      return row.some(function (value) { return String(value).trim() !== ""; });
    });
  if (!dataRows.length) return null;

  const hasRowWithoutCode = dataRows.some(function (row) {
    return String(row[0]).trim() === "";
  });
  if (hasRowWithoutCode) {
    throw new Error("Sheet còn dữ liệu bên dưới header nhưng có dòng thiếu MaPhieu. Vui lòng kiểm tra hoặc xóa toàn bộ dữ liệu trước khi reset.");
  }

  const codes = dataRows.map(function (row) {
    return parseCode_(row[0]);
  });
  const uniqueCodes = Array.from(new Set(codes));
  const lastCode = Math.max.apply(null, uniqueCodes);
  const expectedCodeCount = lastCode - START_CODE + 1;

  if (uniqueCodes.length !== codes.length || uniqueCodes.length !== expectedCodeCount) {
    throw new Error("Cột MaPhieu đang có mã trùng hoặc bị thiếu giữa dãy. Vui lòng kiểm tra Sheet trước khi nhận thêm phiếu.");
  }

  return lastCode;
}

function parseCode_(value) {
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) {
    throw new Error("Cột MaPhieu có giá trị không hợp lệ. Vui lòng chỉ giữ các mã số từ 001 đến 200.");
  }

  const code = Number(text);
  if (!Number.isInteger(code) || code < START_CODE || code > END_CODE) {
    throw new Error("Cột MaPhieu có giá trị không hợp lệ. Vui lòng chỉ giữ các mã số từ 001 đến 200.");
  }
  return code;
}

function formatCode_(code) {
  return String(code).padStart(CODE_WIDTH, "0");
}

function createSurveyPdf_(data, code, submittedAt, isSample) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const document = DocumentApp.create("Phieu_khao_sat_Phu_Luong_" + code + "_tam");
  const documentFile = DriveApp.getFileById(document.getId());

  try {
    const body = document.getBody();
    configureDocumentBody_(body);
    appendSurveyHeader_(body, code, submittedAt);
    appendFormIntro_(body, data);
    appendRatingTable_(body, data);
    appendRespondentInformation_(body, data);

    appendCenteredParagraph_(body, "Trân trọng cảm ơn ông/bà!", 11, true);

    document.saveAndClose();
    Utilities.sleep(500);

    const suffix = isSample ? "_sample.pdf" : ".pdf";
    const pdfBlob = documentFile
      .getAs(MimeType.PDF)
      .setName("Phieu_khao_sat_Phu_Luong_" + code + suffix);
    return folder.createFile(pdfBlob);
  } finally {
    documentFile.setTrashed(true);
  }
}

function configureDocumentBody_(body) {
  body.setPageWidth(595.28)
    .setPageHeight(841.89)
    .setMarginTop(36)
    .setMarginBottom(36)
    .setMarginLeft(36)
    .setMarginRight(36);
  body.setAttributes({
    [DocumentApp.Attribute.FONT_FAMILY]: "Arial",
    [DocumentApp.Attribute.FONT_SIZE]: 10
  });
}

function appendSurveyHeader_(body, code, submittedAt) {
  const table = body.appendTable([
    [FORM_MODEL + "\n" + WARD_NAME, "MÃ SỐ PHIẾU: " + code + "\nTHỜI GIAN GỬI: " + formatDate_(submittedAt)]
  ]);
  table.setBorderWidth(0);
  table.setColumnWidth(0, 250);
  table.setColumnWidth(1, 270);

  for (let column = 0; column < 2; column += 1) {
    const cell = table.getCell(0, column);
    cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
    styleCellText_(cell, column === 0 ? 11 : 9, true, DocumentApp.HorizontalAlignment.CENTER);
  }

  appendCenteredParagraph_(body, SURVEY_TITLE, 15, true);
  appendCenteredParagraph_(body, SURVEY_SUBTITLE, 11, true);
  appendCenteredParagraph_(body, PLAN_LINE, 9, false, true);
}

function appendFormIntro_(body, data) {
  appendSectionTitle_(body, "I. THÔNG TIN CHUNG");
  appendBoldLabelParagraph_(body, "1. Mục đích khảo sát", PURPOSE_TEXT);
  appendBoldLabelParagraph_(body, "2. Hướng dẫn trả lời", INSTRUCTION_TEXT + " Ô được đánh dấu X là phương án đã chọn.");
  appendBoldLabelParagraph_(body, "Lĩnh vực/thủ tục hành chính đã giải quyết:", data.linhVuc);
}

function appendRatingTable_(body, data) {
  appendSectionTitle_(body, "II. NỘI DUNG KHẢO SÁT");
  const rows = [buildRatingHeaderRow_()];
  let questionNumber = 1;

  SURVEY_SECTIONS.forEach(function (section) {
    rows.push([section.title, "", "", "", "", ""]);
    section.questions.forEach(function (question) {
      rows.push(buildRatingRow_(questionNumber + ". " + question, data["q_" + questionNumber]));
      questionNumber += 1;
    });
  });

  const table = body.appendTable(rows);
  styleRatingTable_(table, SURVEY_SECTIONS.map(function (section) {
    return section.title;
  }));
}

function buildRatingHeaderRow_() {
  return ["Nhận định"].concat(RATING_HEADERS.map(function (label, index) {
    return (5 - index) + "\n" + label;
  }));
}

function buildRatingRow_(question, selectedValue) {
  const row = [question];
  for (let score = 5; score >= 1; score -= 1) {
    row.push(String(selectedValue) === String(score) ? "X" : "");
  }
  return row;
}

function styleRatingTable_(table, sectionTitles) {
  table.setBorderWidth(1);
  table.setColumnWidth(0, 310);
  for (let column = 1; column <= 5; column += 1) {
    table.setColumnWidth(column, 42);
  }

  for (let rowIndex = 0; rowIndex < table.getNumRows(); rowIndex += 1) {
    const row = table.getRow(rowIndex);
    const isHeader = rowIndex === 0;
    const isSection = sectionTitles.indexOf(row.getCell(0).getText()) !== -1;

    for (let column = 0; column < 6; column += 1) {
      const cell = row.getCell(column);
      cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER)
        .setPaddingTop(2)
        .setPaddingBottom(2)
        .setPaddingLeft(3)
        .setPaddingRight(3);

      if (isHeader) {
        cell.setBackgroundColor("#ccfbf1");
        styleCellText_(cell, column === 0 ? 8 : 7, true, DocumentApp.HorizontalAlignment.CENTER);
      } else if (isSection) {
        cell.setBackgroundColor("#e0f2fe");
        styleCellText_(cell, 8, true, column === 0
          ? DocumentApp.HorizontalAlignment.LEFT
          : DocumentApp.HorizontalAlignment.CENTER);
      } else {
        styleCellText_(cell, column === 0 ? 8 : 10, column > 0, column === 0
          ? DocumentApp.HorizontalAlignment.LEFT
          : DocumentApp.HorizontalAlignment.CENTER);
      }
    }
  }
}

function appendRespondentInformation_(body, data) {
  appendSectionTitle_(body, "THÔNG TIN NGƯỜI TRẢ LỜI");
  const rows = [
    ["Giới tính", buildChoiceLine_(ALLOWED_VALUES.gioiTinh, data.gioiTinh)],
    ["Độ tuổi", buildChoiceLine_(ALLOWED_VALUES.doTuoi, data.doTuoi)],
    ["Trình độ", buildChoiceLine_(ALLOWED_VALUES.trinhDo, data.trinhDo)]
  ];
  const table = body.appendTable(rows);
  table.setBorderWidth(1);
  table.setColumnWidth(0, 100);
  table.setColumnWidth(1, 420);

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    table.getCell(rowIndex, 0).setBackgroundColor("#ccfbf1");
    styleCellText_(table.getCell(rowIndex, 0), 9, true, DocumentApp.HorizontalAlignment.LEFT);
    styleCellText_(table.getCell(rowIndex, 1), 9, false, DocumentApp.HorizontalAlignment.LEFT);
  }
}

function buildChoiceLine_(choices, selectedValue) {
  return choices.map(function (choice, index) {
    const marker = String(choice) === String(selectedValue) ? "[X]" : "[ ]";
    return marker + " " + (index + 1) + ". " + choice;
  }).join("    ");
}

function appendResponse_(sheet, data, code, submittedAt, fileUrl) {
  const row = [code, formatDate_(submittedAt), sanitizeCell_(data.linhVuc)];
  for (let index = 1; index <= 9; index += 1) {
    row.push(Number(data["q_" + index]));
  }
  row.push(
    sanitizeCell_(data.gioiTinh),
    sanitizeCell_(data.doTuoi),
    sanitizeCell_(data.trinhDo),
    fileUrl
  );

  sheet.appendRow(row);
}

function appendCenteredParagraph_(body, text, fontSize, bold, italic) {
  const paragraph = body.appendParagraph(text);
  paragraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(2);
  paragraph.editAsText().setBold(Boolean(bold)).setItalic(Boolean(italic)).setFontSize(fontSize);
}

function appendSectionTitle_(body, text) {
  const paragraph = body.appendParagraph(text);
  paragraph.setSpacingBefore(8).setSpacingAfter(4);
  paragraph.editAsText().setBold(true).setFontSize(11).setForegroundColor("#0f766e");
}

function appendBoldLabelParagraph_(body, label, value) {
  const paragraph = body.appendParagraph(label + " " + value);
  paragraph.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY)
    .setLineSpacing(1.05)
    .setSpacingAfter(4);
  const text = paragraph.editAsText().setFontSize(10);
  text.setBold(0, label.length - 1, true);
}

function styleCellText_(cell, fontSize, bold, alignment) {
  for (let index = 0; index < cell.getNumChildren(); index += 1) {
    const child = cell.getChild(index);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      const paragraph = child.asParagraph();
      paragraph.setAlignment(alignment).setSpacingAfter(0).setSpacingBefore(0);
      const text = paragraph.editAsText();
      text.setFontSize(fontSize).setBold(bold);
    }
  }
}

function sanitizeCell_(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function formatDate_(date) {
  return Utilities.formatDate(date, TIME_ZONE, "dd/MM/yyyy HH:mm:ss");
}

function getPublicErrorMessage_(error) {
  const message = String(error && error.message ? error.message : error);
  const publicMessages = [
    "Đã đủ số lượng phiếu khảo sát.",
    "Vui lòng trả lời đầy đủ tất cả nội dung bắt buộc.",
    "Vui lòng nhập lĩnh vực/thủ tục hành chính đã giải quyết.",
    "Điểm đánh giá không hợp lệ.",
    "Thông tin người trả lời không hợp lệ.",
    "Nội dung lĩnh vực/thủ tục hành chính quá dài.",
    "Dữ liệu gửi lên không hợp lệ.",
    "Dữ liệu JSON không hợp lệ.",
    "Ứng dụng chưa được cấu hình ID Google Sheet hoặc thư mục Drive.",
    "ID Google Sheet hoặc thư mục Drive không hợp lệ. Chỉ dán ID, không dán URL hoặc phần ?hl=vi.",
    "Header của sheet Responses không đúng cấu trúc yêu cầu.",
    "Sheet còn dữ liệu bên dưới header nhưng có dòng thiếu MaPhieu. Vui lòng kiểm tra hoặc xóa toàn bộ dữ liệu trước khi reset.",
    "Cột MaPhieu có giá trị không hợp lệ. Vui lòng chỉ giữ các mã số từ 001 đến 200.",
    "Cột MaPhieu đang có mã trùng hoặc bị thiếu giữa dãy. Vui lòng kiểm tra Sheet trước khi nhận thêm phiếu."
  ];

  return publicMessages.indexOf(message) !== -1
    ? message
    : "Hệ thống chưa thể lưu phiếu. Vui lòng thử lại hoặc liên hệ cán bộ phụ trách.";
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
