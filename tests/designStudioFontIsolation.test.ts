import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { studioReducer, INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import { FreeTextElement, FreeElement } from "../src/types/studio";

describe("Design Studio Font Isolation", () => {
  it("changing font on one selected text box via UPDATE_ELEMENT does not change other text boxes", () => {
    const text1: FreeTextElement = {
      id: "el_text_1",
      type: "text",
      text: "John Doe",
      size: "lg",
      bold: true,
      align: "left",
      fontFamily: "Inter",
      x: 0,
      y: 0,
      w: 200,
      h: 24,
    };

    const text2: FreeTextElement = {
      id: "el_text_2",
      type: "text",
      text: "Product Designer",
      size: "md",
      bold: false,
      align: "left",
      fontFamily: "Inter",
      x: 0,
      y: 30,
      w: 200,
      h: 20,
    };

    const state = {
      ...INITIAL_STUDIO_DATA,
      fontFamily: "Inter",
      elements: [text1, text2],
    };

    // Update text1 to "Georgia"
    const nextState = studioReducer(state, {
      type: "UPDATE_ELEMENT",
      payload: { id: "el_text_1", updates: { fontFamily: "Georgia" } },
    });

    const updatedText1 = nextState.elements?.find((el) => el.id === "el_text_1") as FreeTextElement;
    const unchangedText2 = nextState.elements?.find((el) => el.id === "el_text_2") as FreeTextElement;

    assert.equal(updatedText1.fontFamily, "Georgia");
    assert.equal(unchangedText2.fontFamily, "Inter");
    assert.equal(nextState.fontFamily, "Inter");
  });

  it("global SET_FONT updates signature default font", () => {
    const state = {
      ...INITIAL_STUDIO_DATA,
      fontFamily: "Inter",
      elements: [],
    };

    const nextState = studioReducer(state, {
      type: "SET_FONT",
      payload: "Roboto",
    });

    assert.equal(nextState.fontFamily, "Roboto");
  });
});
