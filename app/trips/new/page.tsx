import { TripForm } from "@/components/TripForm";

export default function NewTripPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Plan a new trip</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Tell us where you&apos;re headed and when you land, and we&apos;ll build a light-exposure
          and sleep schedule to help your body clock catch up.
        </p>
      </div>
      <TripForm />
    </main>
  );
}
