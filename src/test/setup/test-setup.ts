import { beforeEach, vi } from "vitest";
import {
  mockEmailService,
  mockEmailTemplateService,
  mockAuthEmailService,
  mockEmailStorage,
} from "../utils/email-mocks";

// Mock email services at the module level to prevent actual email sending during tests
vi.mock("../../utils/email-service", () => ({
  emailService: mockEmailService,
}));

vi.mock("../../utils/email-template-service", () => ({
  emailTemplateService: mockEmailTemplateService,
}));

vi.mock("../../utils/auth-email-service", () => ({
  authEmailService: mockAuthEmailService,
}));

// This file runs before each test file
// Use it for app instantiation and per-file setup

beforeEach(async () => {
  // Clear mock email storage before each test
  mockEmailStorage.clear();

  // Optional: Clear specific tables before each test
  // You can customize this based on your needs
  // Example of clearing all data (uncomment if needed):
  // await db.delete(stock);
  // await db.delete(products);
  // await db.delete(categories);
  // await db.delete(betterAuthUsers);
});
