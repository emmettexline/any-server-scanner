import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { AppRouter } from './api/trpc/[trpc]';

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

function getBaseUrl() {
	if (typeof window !== 'undefined') {
		return '';
	}
	// Reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	// Assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		return {
			url: `${getBaseUrl()}/api/trpc`,
		};
	},
	ssr: true,
})(MyApp);
