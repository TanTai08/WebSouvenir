export function createApi(onUnauthorized) {
  return async function api(endpoint, method = 'GET', data, options = {}) {
    const response = await fetch('/api/' + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
      ...(options.signal ? { signal: options.signal } : {}),
    });
    const body = await response.json();
    if (!response.ok) {
      if (response.status === 401 && endpoint !== 'login') onUnauthorized();
      throw Object.assign(new Error(body.error || 'Yêu cầu thất bại'), {
        status: response.status,
        code: body.code,
      });
    }
    return body;
  };
}
