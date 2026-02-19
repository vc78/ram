export async function GET() {
  const realAIEnabled = process.env.ENABLE_REAL_AI === "true"
  return Response.json({ realAIEnabled })
}
