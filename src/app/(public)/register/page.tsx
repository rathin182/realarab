
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf5] px-5 py-10 text-[#171714] sm:px-8 lg:px-14 lg:py-14">
      <div className="mx-auto w-full max-w-[1320px]">
        <header className="relative mb-10 min-h-[190px] overflow-hidden sm:mb-12 lg:min-h-[215px]">
          <div className="relative z-10 max-w-2xl pt-2">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-[#9a7950]">
              NAJAM BUYER
            </p>

            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Create your account
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#77746e] sm:text-lg">
              Create your buyer account to discover properties, manage your
              activity, and get started with NAJAM.
            </p>
          </div>

          {/* Decorative architectural illustration made with CSS */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 hidden h-[215px] w-[43%] overflow-hidden lg:block"
          >
            <div className="absolute bottom-5 left-[8%] h-24 w-[76%] border-b border-[#e8d8c0]" />
            <div className="absolute bottom-6 left-[30%] h-36 w-[39%] border border-[#e5d3b8] bg-[#f8f3e9]/40" />
            <div className="absolute bottom-6 left-[37%] h-28 w-[27%] border border-[#e5d3b8]" />
            <div className="absolute bottom-6 left-[45%] h-16 w-[12%] rounded-t-full border border-b-0 border-[#d9c4a4]" />
            <div className="absolute bottom-6 left-[17%] h-20 w-[17%] border border-[#eadbc5]" />
            <div className="absolute bottom-6 left-[21%] h-14 w-[9%] border border-[#eadbc5]" />
            <div className="absolute bottom-6 right-[9%] h-28 w-px bg-[#d8c4a6]" />
            <div className="absolute bottom-[125px] right-[3%] h-16 w-16 rounded-full border border-[#e6d6bf]" />
            <div className="absolute bottom-[120px] right-[6%] h-20 w-1 rotate-[25deg] bg-[#e0cfb5]" />
            <div className="absolute bottom-[125px] right-[1%] h-16 w-1 -rotate-[25deg] bg-[#e0cfb5]" />
          </div>
        </header>

        <RegisterForm />
      </div>
    </main>
  );
}
