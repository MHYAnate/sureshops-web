// src/lib/extract-id.ts
/**
 * Safely extract a plain string ID from any reference format:
 * - Plain string: "507f1f77bcf86cd799439011"
 * - Populated object: { id: "507f...", _id: "507f...", name: "Lagos" }
 * - ObjectId instance: ObjectId("507f...")
 */
export function extractId(ref: any): string {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  if (typeof ref === "object") {
    // Try .id first (our API transforms _id → id)
    if (ref.id && typeof ref.id === "string") return ref.id;
    // Try ._id (raw MongoDB)
    if (ref._id) {
      return typeof ref._id === "string"
        ? ref._id
        : ref._id.toString?.() || "";
    }
    // Last resort
    return ref.toString?.() || "";
  }
  return String(ref);
}

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}