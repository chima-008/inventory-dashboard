'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)
            .flat()
            .find(
              (message): message is string =>
                typeof message === 'string'
            );

          setError(
            firstError || data.message || 'Unable to create account.'
          );
        } else {
          setError(data.message || 'Unable to create account.');
        }

        return;
      }

      router.replace('/login');
    } catch {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Brand panel */}
        <section className="hidden bg-slate-900 lg:flex lg:w-[44%] lg:flex-col lg:justify-between">
          <div className="p-8 xl:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                I
              </div>

              <div>
                <p className="text-sm font-semibold leading-none tracking-tight text-white">
                  Inventory
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Management
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-16 xl:px-10">
            <div className="max-w-md">
              <div className="mb-5 inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5">
                <span className="text-xs font-medium text-slate-300">
                  Inventory workspace
                </span>
              </div>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
                Start managing your inventory today.
              </h2>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                Create an account to manage products, monitor stock,
                organize categories, and keep your inventory under control.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Products
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    Organized
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Stock
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    Monitored
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Access
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    Controlled
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 xl:p-10">
            <p className="text-xs text-slate-500">
              Inventory Management System
            </p>
          </div>
        </section>

        {/* Registration section */}
        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-[420px]">

            {/* Mobile brand */}
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                  I
                </div>

                <div>
                  <p className="text-sm font-semibold leading-none tracking-tight text-slate-950">
                    Inventory
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Management
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <p className="text-sm font-semibold text-blue-600">
                Get started
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create an account to access the inventory dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm font-medium leading-5 text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  className="h-12 block w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 block w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    required
                    placeholder="Create a password"
                    className="h-12 block w-full rounded-lg border border-slate-200 bg-white px-4 pr-20 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="password_confirmation"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={
                      showPasswordConfirmation
                        ? 'text'
                        : 'password'
                    }
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                    className="h-12 block w-full rounded-lg border border-slate-200 bg-white px-4 pr-20 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordConfirmation(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPasswordConfirmation
                        ? 'Hide password confirmation'
                        : 'Show password confirmation'
                    }
                    className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    {showPasswordConfirmation ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}