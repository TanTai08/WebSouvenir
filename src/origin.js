// An explicit deployment origin handles reverse proxies without trusting forwarded headers.
export function configuredOrigin(value, secure) {
  if (!value) return undefined;
  const url = new URL(value);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.origin !== value ||
    (secure && url.protocol !== 'https:')
  )
    throw new Error(
      'APP_ORIGIN phải là origin chính xác, ví dụ https://example.com (không có / cuối).',
    );
  return url.origin;
}
