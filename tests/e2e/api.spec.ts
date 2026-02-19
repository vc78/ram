import { test, expect } from '@playwright/test'

test('signup -> login -> me (API smoke)', async ({ request }) => {
    const email = `e2e-${Date.now()}@example.com`
    const password = 'Password123'

    // Signup
    const signupRes = await request.post('/api/v1/auth/signup', { data: { name: 'E2E User', email, password } })
    expect(signupRes.ok()).toBeTruthy()
    const user = await signupRes.json()
    expect(user.email).toBe(email)

    // Login
    const loginRes = await request.post('/api/v1/auth/login', { data: { email, password } })
    expect(loginRes.ok()).toBeTruthy()
    const login = await loginRes.json()
    expect(login).toHaveProperty('access_token')
    const token = login.access_token

    // Me
    const meRes = await request.get('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    expect(meRes.ok()).toBeTruthy()
    const me = await meRes.json()
    expect(me.email).toBe(email)
})
