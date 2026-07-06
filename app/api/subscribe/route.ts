import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const AUTHORIZE_NET_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.authorize.net/xml/v1/request.api'
  : 'https://apitest.authorize.net/xml/v1/request.api';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cardNumber, cardExpiry, cardCvv, plan } = await req.json();
  // plan: 'monthly' ($300/mo) or 'annual' ($2880 upfront)

  const amount = plan === 'annual' ? '2880.00' : '300.00';
  const description = plan === 'annual' ? 'Smicha Program - Annual (20% off)' : 'Smicha Program - Monthly';

  const payload = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: process.env.AUTHORIZE_NET_LOGIN_ID!,
        transactionKey: process.env.AUTHORIZE_NET_TRANSACTION_KEY!,
      },
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount,
        payment: {
          creditCard: {
            cardNumber,
            expirationDate: cardExpiry,
            cardCode: cardCvv,
          },
        },
        order: {
          description,
        },
      },
    },
  };

  const response = await fetch(AUTHORIZE_NET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const result = data.transactionResponse;

  if (result?.responseCode !== '1') {
    return NextResponse.json({ error: result?.errors?.[0]?.errorText || 'Payment failed' }, { status: 400 });
  }

  const now = new Date();
  const subscriptionEndsAt = plan === 'annual'
    ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  await db.update(users)
    .set({
      plan: plan === 'annual' ? 'annual' : 'monthly',
      subscriptionId: result.transId,
      subscriptionEndsAt,
    })
    .where(eq(users.id, parseInt(session.user.id)));

  return NextResponse.json({ success: true });
}
