import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, score, hash } = body;
    
    // In a real scenario, the client would send a signature/hash of the score + salt
    // For this example, we'll verify a simple HMAC
    const secret = process.env.SCORE_SIGNING_SECRET || 'default_dev_secret';
    
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(`${uid}:${score}`)
      .digest('hex');
      
    if (hash !== expectedHash) {
      return NextResponse.json({ error: 'Invalid score signature' }, { status: 403 });
    }

    // Usually you'd update Supabase securely here using the @supabase/supabase-js admin client
    // (with a service role key) to prevent users from arbitrarily setting their score from the client.
    // Since we're doing the write from the client (in GameEngine) for this prototype, 
    // we just return success to acknowledge the valid score submission.
    return NextResponse.json({ success: true, verifiedScore: score });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
