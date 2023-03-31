import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MetamaskProvider } from "../../context/MetamaskContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <Component {...pageProps} />
    </MetamaskProvider>
  );
}
