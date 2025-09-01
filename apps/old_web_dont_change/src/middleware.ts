import acceptLanguage from "accept-language";
import { type NextRequest, NextResponse } from "next/server";
import { cookieName, fallbackLng, languages } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export function middleware(req: NextRequest) {
	if (req.method === "GET") {
		const wwwRedirectResponse = redirectFromWWWtoNonWWW(req);
		if (wwwRedirectResponse) return wwwRedirectResponse;

		const lng = getLanguage(req);

		const redirectResponse = handleLanguageRedirect(req, lng);
		if (redirectResponse) return redirectResponse;

		//i dont know why this is needed at all
		const refererResponse = handleReferer(req);
		if (refererResponse) return refererResponse;

		return NextResponse.next();
	}

	return validateOrigin(req);
}

// this gets the language from the cookie or the accept-language header
function getLanguage(req: NextRequest): string {
	let lng;
	if (req.cookies.has(cookieName)) {
		const cookie = req.cookies.get(cookieName);
		if (cookie) {
			lng = acceptLanguage.get(cookie.value);
		}
	}
	if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
	if (!lng) lng = fallbackLng;
	return lng;
}

function handleLanguageRedirect(req: NextRequest, lng: string) {
	if (!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))) {
		// add the language prefix to the pathname and redirect the user to the new path
		const newUrl = new URL(
			`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`,
			req.url,
		);
		return NextResponse.redirect(newUrl);
	}
	return null;
}

// this handles the referer header to set the cookie to the language of the page the user was on before they came to our site
function handleReferer(req: NextRequest) {
	if (req.headers.has("referer")) {
		const referer = req.headers.get("referer");
		if (referer) {
			const refererUrl = new URL(referer);
			const lngInReferer = languages.find((l) =>
				refererUrl.pathname.startsWith(`/${l}`),
			); // find if the referer url has a language prefix
			const response = NextResponse.next();
			if (lngInReferer) response.cookies.set(cookieName, lngInReferer); // if it does, set the cookie to that language
			return response;
		}
	}
	return null;
}

function validateOrigin(request: NextRequest): NextResponse {
	const originHeader = request.headers.get("Origin");
	// NOTE: we may need to use `X-Forwarded-Host` instead
	const hostHeader = request.headers.get("Host");

	if (originHeader === null || hostHeader === null) {
		return new NextResponse(null, { status: 403 });
	}

	let origin: URL;
	try {
		origin = new URL(originHeader);
	} catch {
		return new NextResponse(null, { status: 403 });
	}

	if (origin.host !== hostHeader) {
		return new NextResponse(null, { status: 403 });
	}

	return NextResponse.next();
}

// Redirect from www to non-www, considering the X-Forwarded-Host header
function redirectFromWWWtoNonWWW(req: NextRequest) {
	const host =
		req.headers.get("X-Forwarded-Host") ||
		req.headers.get("Host") ||
		req.nextUrl.host;

	if (host.startsWith("www.")) {
		const newHost = host.slice(4);
		const protocol =
			req.headers.get("X-Forwarded-Proto") || req.nextUrl.protocol;
		const newUrl = new URL(
			`${protocol}://${newHost}${req.nextUrl.pathname}${req.nextUrl.search}`,
		);
		return NextResponse.redirect(newUrl);
	}
	return null;
}

// the matcher is a regex pattern that matches all paths except the ones that we dont want to add the language prefix to
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|sitemaps|maps-styles).*)",
	],
};
