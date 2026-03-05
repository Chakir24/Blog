import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/storage';

export async function GET() {
  const settings = await getSettings();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { adminPasswordHash, ...publicSettings } = settings;
  return NextResponse.json(publicSettings, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
