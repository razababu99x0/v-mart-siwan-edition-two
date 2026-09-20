export async function GET(request: Request) {
  const pin = new URL(request.url).searchParams.get("pin") ?? "";
  if (!/^[1-8]\d{5}$/.test(pin)) return Response.json({ error: "Enter a valid six-digit Indian PIN code." }, { status: 400 });
  const local = pin.startsWith("841");
  return Response.json({ serviceable: true, pin, local, estimate: local ? "2–4 working days" : "5–7 working days", message: local ? "Hello, Siwan! Estimated delivery in 2–4 working days." : "Estimated delivery in 5–7 working days.", prototype: true, note: "Illustrative availability only. No live delivery service is connected." });
}
