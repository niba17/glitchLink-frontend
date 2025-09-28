// frontend-final/src/features/links/utils/visitShortLink.ts
export async function visitShortLink(
  shortCode: string,
  showError: (msg: string) => void,
  showSuccess: (msg: string) => void
) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/links/validate/${shortCode}`
    );
    const data = await res.json();

    if (res.ok && data.status === "success") {
      showSuccess(data.message);
      window.open(`http://localhost:3000/${shortCode}`, "_blank");
      return;
    }

    showError(data.message || "Link tidak valid");
  } catch (err) {
    console.error("visit shortlink error:", err);
    showError("Something went wrong");
  }
}
