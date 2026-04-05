// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isPublicPath } from "../auth-guard";

describe("isPublicPath", () => {
  it("treats /login as public", () => {
    expect(isPublicPath("/login")).toBe(true);
  });

  it("treats /register as public", () => {
    expect(isPublicPath("/register")).toBe(true);
  });

  it("treats locale-prefixed /login as public", () => {
    expect(isPublicPath("/fr/login")).toBe(true);
    expect(isPublicPath("/de/login")).toBe(true);
    expect(isPublicPath("/en/login")).toBe(true);
  });

  it("treats locale-prefixed /register as public", () => {
    expect(isPublicPath("/fr/register")).toBe(true);
    expect(isPublicPath("/de/register")).toBe(true);
    expect(isPublicPath("/en/register")).toBe(true);
  });

  it("treats root path as protected", () => {
    expect(isPublicPath("/")).toBe(false);
  });

  it("treats locale root as protected", () => {
    expect(isPublicPath("/fr")).toBe(false);
    expect(isPublicPath("/de")).toBe(false);
    expect(isPublicPath("/en")).toBe(false);
  });

  it("treats game routes as protected", () => {
    expect(isPublicPath("/fr/scenarios")).toBe(false);
    expect(isPublicPath("/en/results")).toBe(false);
    expect(isPublicPath("/de/profile")).toBe(false);
  });

  it("treats career routes as protected", () => {
    expect(isPublicPath("/fr/careers")).toBe(false);
    expect(isPublicPath("/en/career/abc123")).toBe(false);
  });

  it("does not match partial path names like /login-help", () => {
    expect(isPublicPath("/fr/login-help")).toBe(false);
    expect(isPublicPath("/register-now")).toBe(false);
  });
});
