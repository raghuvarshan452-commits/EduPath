import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { useEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Scholarships from "@/pages/scholarships";
import MyScholarships from "@/pages/my-scholarships";
import Exams from "@/pages/exams";
import Resources from "@/pages/resources";
import Mentors from "@/pages/mentors";
import Layout from "@/components/layout";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#2563EB",
    colorForeground: "#F8FAFC",
    colorMutedForeground: "#CBD5E1",
    colorDanger: "#ef4444",
    colorBackground: "#1E293B",
    colorInput: "#0F172A",
    colorInputForeground: "#F8FAFC",
    colorNeutral: "#334155",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !rounded-none",
    footer: "!shadow-none !border-0 !rounded-none",
    headerTitle: "text-2xl font-bold text-white",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButtonText: "font-medium no-underline",
    socialButtonsBlockButtonArrow: "hidden",
    formFieldLabel: "text-sm font-medium text-slate-300",
    footerActionLink: "font-semibold",
    footerActionText: "text-slate-400",
    dividerText: "text-slate-500 text-xs",
    identityPreviewEditButton: "text-blue-400",
    formFieldSuccessText: "text-emerald-400",
    alertText: "text-red-400",
    logoBox: "mb-6 flex justify-center",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "!rounded-xl !shadow-none !no-underline",
    formButtonPrimary: "font-bold !rounded-xl",
    formFieldInput: "!rounded-xl",
    footerAction: "mt-6",
    dividerLine: "!h-px",
    dividerRow: "!my-4",
    alert: "!rounded-xl",
    otpCodeFieldInput: "!rounded-xl",
    formFieldRow: "mb-4",
    main: "w-full",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Landing />
      </Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: any }) {
  return (
    <>
      <Show when="signed-in">
        <Layout>
          <Component />
        </Layout>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: { title: "Welcome back", subtitle: "Sign in to access your account" },
        },
        signUp: {
          start: { title: "Create your account", subtitle: "Get started today" },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
          <Route path="/profile"><ProtectedRoute component={Profile} /></Route>
          <Route path="/scholarships"><ProtectedRoute component={Scholarships} /></Route>
          <Route path="/my-scholarships"><ProtectedRoute component={MyScholarships} /></Route>
          <Route path="/exams"><ProtectedRoute component={Exams} /></Route>
          <Route path="/resources"><ProtectedRoute component={Resources} /></Route>
          <Route path="/mentors"><ProtectedRoute component={Mentors} /></Route>
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
