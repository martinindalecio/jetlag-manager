import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Tell us about your sleep schedule
        </h1>
        <p className="text-sm text-slate-600 sm:text-base">
          We use a couple of simple time questions — no wearables or sign-up required — to figure
          out your natural circadian rhythm and build jetlag adaptation plans around it.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
