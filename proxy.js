import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req){
    const session = await auth();
    const {pathname} = req.nextUrl;
    const pub = ['/login','/signup'];
    const priv = ['/dashboard']
    const isPrivate = priv.some(item=>pathname.startsWith(item));
    const isPublic = pub.includes(pathname);
    if(isPrivate&&!session){
        return NextResponse.redirect(new URL('/login',req.url));
    }
    if(isPublic&&session){
        return NextResponse.redirect(new URL('/dashboard',req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher:[
        '/dashboard/:path*',
        '/login',
        '/signup'
    ]
}