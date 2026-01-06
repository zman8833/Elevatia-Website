import { NextRequest, NextResponse } from 'next/server';

const KIT_FORM_ID = '8945617';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append('email_address', email);

    const response = await fetch(
      `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      console.error('Kit subscription error:', response.status);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

