const pptxgen = require("pptxgenjs");

const INK = "395970";
const INK_SOFT = "7D94A4";
const SAGE = "D5E3D6";
const LIGHT = "EDF4EF";
const CLAY = "E18D56";
const PEACH = "FCE3D2";

const HEAD = "Poetsen One";
const BRAND = "Chewy";
const BODY = "Inter";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.author = "Binice";
pres.title = "Binice mall";

/* ---------- Slide 1: Titel ---------- */
let s = pres.addSlide();
s.background = { color: "FFFFFF" };
// Mjuk våg-band upptill
s.addShape(pres.shapes.OVAL, {
  x: -1.6, y: -3.7, w: 13.2, h: 6.0,
  fill: { color: SAGE },
});
s.addText("Binice", {
  x: 0, y: 1.85, w: 10, h: 1.3,
  fontFace: BRAND, fontSize: 60, color: INK,
  align: "center", valign: "middle",
});
s.addText("Rubrik", {
  x: 1, y: 3.15, w: 8, h: 0.6,
  fontFace: HEAD, fontSize: 24, color: INK_SOFT,
  align: "center",
});
s.addText("Brödtext här", {
  x: 2, y: 3.85, w: 6, h: 0.5,
  fontFace: BODY, fontSize: 14, color: INK,
  align: "center",
});

/* ---------- Slide 2: Sektionsavdelare ---------- */
s = pres.addSlide();
s.background = { color: LIGHT };
s.addShape(pres.shapes.OVAL, {
  x: 7.4, y: 3.9, w: 6.5, h: 4.5,
  fill: { color: SAGE, transparency: 45 },
});
s.addText("Rubrik", {
  x: 0.8, y: 1.9, w: 8.4, h: 1.7,
  fontFace: HEAD, fontSize: 52, color: INK,
  align: "center", valign: "middle",
});
s.addText("Binice", {
  x: 0.6, y: 4.7, w: 3, h: 0.6,
  fontFace: BRAND, fontSize: 22, color: INK_SOFT,
  align: "left",
});

/* ---------- Slide 3: Innehåll ---------- */
s = pres.addSlide();
s.background = { color: "FFFFFF" };
s.addText("Rubrik", {
  x: 0.7, y: 0.55, w: 6, h: 0.9,
  fontFace: HEAD, fontSize: 34, color: INK,
  align: "left", valign: "middle", margin: 0,
});
s.addText(
  [
    { text: "Brödtext här", options: { bullet: true, breakLine: true } },
    { text: "Brödtext här", options: { bullet: true, breakLine: true } },
    { text: "Brödtext här", options: { bullet: true } },
  ],
  {
    x: 0.7, y: 1.6, w: 5.3, h: 3.2,
    fontFace: BODY, fontSize: 16, color: INK,
    align: "left", valign: "top", lineSpacingMultiple: 1.3,
  }
);
s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 6.35, y: 1.0, w: 3.05, h: 3.7,
  rectRadius: 0.16, fill: { color: SAGE },
  shadow: { type: "outer", color: "395970", blur: 8, offset: 3, angle: 135, opacity: 0.18 },
});
s.addText("Brödtext här", {
  x: 6.55, y: 1.25, w: 2.65, h: 3.2,
  fontFace: BODY, fontSize: 13, color: INK,
  align: "left", valign: "top",
});

/* ---------- Slide 4: Jämförelse (två kolumner) ---------- */
s = pres.addSlide();
s.background = { color: "FFFFFF" };
s.addText("Rubrik", {
  x: 0.5, y: 0.45, w: 9, h: 0.8,
  fontFace: HEAD, fontSize: 32, color: INK,
  align: "center", valign: "middle",
});
// Vänster kort
s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.7, y: 1.5, w: 4.0, h: 3.4,
  rectRadius: 0.16, fill: { color: PEACH },
  shadow: { type: "outer", color: "395970", blur: 8, offset: 3, angle: 135, opacity: 0.15 },
});
s.addText("Tidig skiss", {
  x: 0.95, y: 1.75, w: 3.5, h: 0.45,
  fontFace: BODY, fontSize: 12, bold: true, color: CLAY,
  align: "left", charSpacing: 1,
});
s.addText("Brödtext här", {
  x: 0.95, y: 2.25, w: 3.5, h: 2.4,
  fontFace: BODY, fontSize: 14, color: INK,
  align: "left", valign: "top",
});
// Höger kort
s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 5.3, y: 1.5, w: 4.0, h: 3.4,
  rectRadius: 0.16, fill: { color: SAGE },
  shadow: { type: "outer", color: "395970", blur: 8, offset: 3, angle: 135, opacity: 0.15 },
});
s.addText("Idag", {
  x: 5.55, y: 1.75, w: 3.5, h: 0.45,
  fontFace: BODY, fontSize: 12, bold: true, color: CLAY,
  align: "left", charSpacing: 1,
});
s.addText("Brödtext här", {
  x: 5.55, y: 2.25, w: 3.5, h: 2.4,
  fontFace: BODY, fontSize: 14, color: INK,
  align: "left", valign: "top",
});

/* ---------- Slide 5: Avslutning ---------- */
s = pres.addSlide();
s.background = { color: "FFFFFF" };
s.addShape(pres.shapes.OVAL, {
  x: -1.6, y: 3.3, w: 13.2, h: 6.0,
  fill: { color: SAGE },
});
s.addText("Binice", {
  x: 0, y: 1.7, w: 10, h: 1.4,
  fontFace: BRAND, fontSize: 64, color: INK,
  align: "center", valign: "middle",
});
s.addText("Tack", {
  x: 1, y: 3.0, w: 8, h: 0.6,
  fontFace: HEAD, fontSize: 24, color: INK_SOFT,
  align: "center",
});

pres.writeFile({ fileName: "binice-mall.pptx" }).then(() => {
  console.log("Skrev binice-mall.pptx");
});
