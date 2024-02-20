import { client as dbClient } from '@/utils/db';
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from '@coinbase/onchainkit';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const body: FrameRequest = await request.json();

  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: 'NEYNAR_ONCHAIN_KIT',
  });

  if (!isValid) {
    return new Response('Invalid Frame Request', { status: 400 });
  }

  try {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Visit Website',
            action: 'link',
            target: 'https://myriad-zk.vercel.app',
          },
        ],
        image: `${process.env.HOST_URL}/result?id=${id}`,
        postUrl: `${process.env.HOST_URL}/${id}`,
      })
    );
  } catch (e: any) {
    return new Response(e, { status: 500 });
  }
}
