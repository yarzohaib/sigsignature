import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getTemplatePhotoShape } from "../src/lib/templates/designs/shared";

test("Template Photo Crop Modal Shape & Fidelity", async (t) => {
  await t.test("getTemplatePhotoShape accurately returns rect with 8px radius for split-banner", () => {
    const shape = getTemplatePhotoShape("split-banner");
    assert.equal(shape.cropShape, "rect");
    assert.equal(shape.borderRadius, "8px");
    assert.equal(shape.isCircular, false);
  });

  await t.test("getTemplatePhotoShape returns rect for square/rounded-corner templates", () => {
    const minimalClean = getTemplatePhotoShape("minimal-clean");
    assert.equal(minimalClean.cropShape, "rect");
    assert.equal(minimalClean.borderRadius, "10px");
    assert.equal(minimalClean.isCircular, false);

    const boardroom = getTemplatePhotoShape("boardroom-corporate");
    assert.equal(boardroom.cropShape, "rect");
    assert.equal(boardroom.borderRadius, "4px");
    assert.equal(boardroom.isCircular, false);

    const boldBlock = getTemplatePhotoShape("bold-block");
    assert.equal(boldBlock.cropShape, "rect");
    assert.equal(boldBlock.borderRadius, "6px");
    assert.equal(boldBlock.isCircular, false);
  });

  await t.test("getTemplatePhotoShape returns round for circular templates", () => {
    const modernDark = getTemplatePhotoShape("modern-dark");
    assert.equal(modernDark.cropShape, "round");
    assert.equal(modernDark.borderRadius, "50%");
    assert.equal(modernDark.isCircular, true);

    const photoPop = getTemplatePhotoShape("photo-pop");
    assert.equal(photoPop.cropShape, "round");
    assert.equal(photoPop.isCircular, true);

    const centeredMinimal = getTemplatePhotoShape("centered-minimal");
    assert.equal(centeredMinimal.cropShape, "round");
    assert.equal(centeredMinimal.isCircular, true);
  });

  await t.test("ImageCropModal accepts cropAreaBorderRadius and passes custom cropAreaStyle to Cropper", () => {
    const modalFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/common/ImageCropModal.tsx"),
      "utf8"
    );
    assert.match(
      modalFile,
      /cropAreaBorderRadius\?: string;/,
      "ImageCropModalProps must include cropAreaBorderRadius"
    );
    assert.match(
      modalFile,
      /style=\{effectiveCropAreaStyle \? \{ cropAreaStyle: effectiveCropAreaStyle \} : undefined\}/,
      "Cropper must receive cropAreaStyle when cropAreaBorderRadius is supplied"
    );
  });

  await t.test("TemplateEditor wires templatePhotoShape to avatar ImageCropModal", () => {
    const editorFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/templates/TemplateEditor.tsx"),
      "utf8"
    );
    assert.match(
      editorFile,
      /cropShape=\{templatePhotoShape\.cropShape\}/,
      "TemplateEditor must supply dynamic cropShape to avatar ImageCropModal"
    );
    assert.match(
      editorFile,
      /cropAreaBorderRadius=\{templatePhotoShape\.borderRadius\}/,
      "TemplateEditor must supply dynamic cropAreaBorderRadius to avatar ImageCropModal"
    );
  });
});
