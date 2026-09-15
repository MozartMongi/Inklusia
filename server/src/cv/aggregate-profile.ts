import { findProfileById } from "../profiles/profiles.repository.js";
import { markCvGenerated } from "./cv-preferences.repository.js";
import { buildGeneratedCv, type GeneratedCv } from "./generated-cv.js";

export async function aggregateProfileForCv(
  profileId: string,
): Promise<GeneratedCv | null> {
  const profile = await findProfileById(profileId);
  if (!profile) {
    return null;
  }

  const generatedAt = new Date();
  await markCvGenerated(profile.id, generatedAt);
  return buildGeneratedCv(profile, generatedAt.toISOString());
}
