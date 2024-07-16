// middleware.js
import { jwtVerify, importSPKI } from "jose"
import { JWTExpired } from "jose/errors";
import { NextRequest, NextResponse } from 'next/server';

const pubKey: string = process.env.JWT_PUBLIC_KEY!

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get('access_token')
  if (!tokenCookie)
    return NextResponse.redirect(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL!)
  try {
    const token = tokenCookie.value
    // Verify JWT token
    const data = await jwtVerify(token, await importSPKI(pubKey, 'RS256'), {
      algorithms: ['RS256']
    });
    if(!data.payload.userId) throw 'No User Id'
    return NextResponse.next()
  } catch (err) {
    const refreshTokenCookie = req.cookies.get('refresh_token')
    if(err instanceof JWTExpired && refreshTokenCookie?.value)
    {
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh`, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            Authorization: `Bearer ${refreshTokenCookie.value}`,
            getSetCookie: ''
          }
        })
        const data = await res.json()
        console.log(data)
        if(res.status == 200){
          if(data.status == 'ok' && data.accessToken && data.refreshToken){
            const nextRes = NextResponse.next()
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 6);
            const { accessToken, refreshToken } = data
            nextRes.cookies.set('access_token', accessToken, {
              sameSite: 'strict',
              path: '/',
              httpOnly: true,
              secure: true,
              expires: expirationDate
            })
            nextRes.cookies.set('refresh_token', refreshToken, {
              sameSite: 'strict',
              path: '/',
              httpOnly: true,
              secure: true,
              expires: expirationDate
            })
            return nextRes
          }
        }
      }catch(err){
        console.log(err)
      }
    }
    // return NextResponse.redirect(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL!)
  }
}

export const config = {
  matcher: '/player/:id*',
}