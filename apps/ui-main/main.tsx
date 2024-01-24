import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { AppProvider } from "@butlerhospitality/ui-sdk";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryConfig } from "@butlerhospitality/shared";
import { HelmetProvider } from "react-helmet-async";

import App from "./app";

const queryClient = new QueryClient({
  defaultOptions: { queries: queryConfig },
});

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient} contextSharing>
      <HelmetProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById("root")
);
