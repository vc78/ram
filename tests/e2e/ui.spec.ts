import { test, expect } from '@playwright/test'

const FRONTEND = process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:3000'

test('signup -> auto-login -> logout -> login (UI flow)', async ({ page }) => {
    // Capture client console logs for debugging flaky failures
    page.on('console', (msg) => console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`))
    // Log network requests and responses for auth and proxy endpoints
    page.on('request', (req) => {
        if (req.url().includes('/auth') || req.url().includes('/api/backend-proxy')) console.log(`[REQ] ${req.method()} ${req.url()}`)
    })
    page.on('response', async (resp) => {
        if (resp.url().includes('/auth') || resp.url().includes('/api/backend-proxy')) {
            const body = await resp.text().catch(() => '<no-body>')
            console.log(`[RESP] ${resp.status()} ${resp.url()} BODY=${body.slice(0, 500)}`)
        }
    })
    const email = `e2e-ui-${Date.now()}@example.com`
    console.log(`[TEST] using email=${email}`)
    const password = 'Password123'

    // Signup
    await page.goto(`${FRONTEND}/signup`)
    await page.fill('input[name="name"]', 'E2E User')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.fill('input[name="confirmPassword"]', password)
    // Click create and wait for backend signup + login to complete
    // Click to submit the signup form
    await page.click('button:has-text("Create Account")')

    // Prefer waiting for an explicit login response, but fall back to waiting for the dashboard route
    try {
        await page.waitForResponse(resp => (resp.url().includes('/auth/login') || resp.url().includes('/api/backend-proxy/auth/login')) && resp.status() >= 200 && resp.status() < 300, { timeout: 30000 })
    } catch (e) {
        // Fallback: wait for dashboard cue if login response was not captured
        console.log('[TEST] login response not captured; falling back to DOM check')
        try {
            await page.waitForSelector('text=Dashboard', { timeout: 30000 })
        } catch (e2) {
            const screenshotPath = `test-results/failure-signup-${Date.now()}.png`
            await page.screenshot({ path: screenshotPath })
            console.log(`[TEST] captured screenshot ${screenshotPath}`)
            throw e2
        }
    }

    // After signup the app logs the user in; wait for dashboard cue
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 })

    // Logout and wait for home page with signup CTA
    await Promise.all([
        page.locator('header').getByRole('button', { name: 'Logout' }).click(),
        page.waitForURL('**/'),
    ])
    // Homepage uses 'Get Started' call to action
    await page.waitForSelector('text=Get Started', { timeout: 20000 })

    // Login
    await page.goto(`${FRONTEND}/login`)
    await page.fill('#email', email)
    await page.fill('#password', password)
    // Click sign in, then wait for either the login response or the dashboard navigation (resilient to races)
    await page.click('button:has-text("Sign In")')
    try {
        await page.waitForResponse(resp => (resp.url().includes('/auth/login') || resp.url().includes('/api/backend-proxy/auth/login')) && resp.status() >= 200 && resp.status() < 300, { timeout: 15000 })
    } catch (e) {
        // Fallback: wait for dashboard cue if we didn't capture the response
        console.log('[TEST] login response not captured (login step); falling back to DOM check')
        try {
            await page.waitForSelector('text=Dashboard', { timeout: 20000 })
        } catch (e2) {
            const screenshotPath = `test-results/failure-login-${Date.now()}.png`
            await page.screenshot({ path: screenshotPath })
            console.log(`[TEST] captured screenshot ${screenshotPath}`)
            throw e2
        }
    }

    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 })
})