import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/storage';

export async function GET() {
  const settings = await getSettings();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { adminPasswordHash, ...publicSettings } = settings;
  return NextResponse.json(publicSettings, {
    headers: {
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  });
}
