import { buildProfileRegions } from '@/features/profil/profile-regions';
import { loadWilayahFile } from '@/server/data';

export async function GET() {
  try {
    const file = await loadWilayahFile();
    return Response.json(buildProfileRegions(file.wilayah), {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
    });
  } catch {
    return Response.json({ error: 'wilayah-unavailable' }, { status: 500 });
  }
}
