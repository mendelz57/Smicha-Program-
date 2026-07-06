import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#162B22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        <span
          style={{
            color: '#C4912A',
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'serif',
            lineHeight: 1,
          }}
        >
          ס
        </span>
      </div>
    ),
    { ...size }
  );
}
