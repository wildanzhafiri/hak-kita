import { profileCompleteness } from '@hakkita/domain';
import { PreferensiProfilSchema } from '@hakkita/schema';
import { FINDER_RESULT_LIMIT } from '@/features/cari-program/constants';
import { HOME_RECOMMENDATION_COUNT } from '@/features/profil/constants';
import { loadRecommendations } from '@/server/recommendations';
import { loadUserProfileServer } from '@/server/user-profile';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const preferences = PreferensiProfilSchema.safeParse(body);
  if (!preferences.success) {
    return Response.json({ recommendations: [] }, { status: 400, headers: NO_STORE });
  }

  try {
    const recommendations = await loadRecommendations(preferences.data);
    return Response.json(
      { recommendations: recommendations.slice(0, FINDER_RESULT_LIMIT) },
      { headers: NO_STORE },
    );
  } catch {
    return Response.json({ recommendations: [] }, { status: 500, headers: NO_STORE });
  }
}

export async function GET() {
  const profile = await loadUserProfileServer();
  if (profile.status !== 'ready' || profileCompleteness(profile.preferensi) !== 'cukup') {
    return Response.json({ programs: [] }, { headers: NO_STORE });
  }

  try {
    const recommendations = await loadRecommendations(profile.preferensi);
    const programs = recommendations
      .filter((recommendation) => recommendation.periodStatus !== 'ditutup')
      .slice(0, HOME_RECOMMENDATION_COUNT)
      .map((recommendation) => recommendation.program);
    return Response.json({ programs }, { headers: NO_STORE });
  } catch {
    return Response.json({ programs: [] }, { headers: NO_STORE });
  }
}
