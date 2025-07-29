import express from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & { username: string }
    }
  }
}

const SECRET_KEY = 'DpMH-k81-zDc-4PZ-LTx-qq4-SL6-GKT'

// Auth Middleware
export const authenticateJwt = expressjwt({
  secret: SECRET_KEY,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.token,
})

const router = express.Router()

router.post('/signin', (req, res) => {
  const { username } = req.body

  if (username.trim().length > 0) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '7days' })

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 604800000, // 7 days
    })

    res.json({ user: { username } })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

// Get Current Session
router.get('/api/me', authenticateJwt, (req, res) => {
  res.json({
    user: {
      username: req?.auth?.username,
    },
  })
})

router.post('/signout', (req, res) => {
  res.clearCookie('token')
  res.json()
})

export default router
