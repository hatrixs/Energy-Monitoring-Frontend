import { NextResponse, type NextRequest } from "next/server";

// Rutas de autenticación que están disponibles públicamente
const AUTH_PATHS = ["/auth/login", "/auth/register"];
// Rutas públicas adicionales que no requieren autenticación
const PUBLIC_PATHS = [...AUTH_PATHS];

// Función para verificar si hay token en las cookies
function getToken(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value;
  return token || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta de autenticación
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));
  
  // Obtener el token de autenticación
  const token = getToken(request);
  
  // Si el usuario está autenticado y trata de acceder a una página de autenticación,
  // lo redirigimos a la página principal
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Verificar si es una ruta pública que no requiere autenticación
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  
  // Si el usuario no está autenticado y trata de acceder a una ruta protegida,
  // lo redirigimos a la página de login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 