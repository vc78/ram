import { NextResponse } from "next/server"
import { trainModel } from "@/lib/ml-trainer"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const updatedWeights = await trainModel();
    
    // In Next.js dev mode, this will trigger a hot reload if we write to the file
    const filePath = path.join(process.cwd(), "lib", "ml-weights.ts");
    const fileContent = `export const ML_MODEL_WEIGHTS = ${JSON.stringify(updatedWeights, null, 2)};`;
    
    fs.writeFileSync(filePath, fileContent);

    return NextResponse.json({ 
      success: true, 
      message: "ML Model trained successfully with real-time dataset",
      new_version: updatedWeights.version,
      last_trained: updatedWeights.last_trained,
      metrics: updatedWeights.metrics
    })
  } catch (error: any) {
    console.error("Training Error:", error);
    return NextResponse.json({ error: "ML Training failed: " + error.message }, { status: 500 })
  }
}
