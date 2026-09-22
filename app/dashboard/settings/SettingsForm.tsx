'use client';

import { FormEvent, useState } from 'react';

type SettingsUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  business: {
    id: number;
    name: string;
  } | null;
};

export default function SettingsForm({
  user,
}: {
  user: SettingsUser;
}) {
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(
    user.business?.name ?? ''
  );

  const [profileMessage, setProfileMessage] = useState('');
  const [businessMessage, setBusinessMessage] = useState('');

  const [profileError, setProfileError] = useState('');
  const [businessError, setBusinessError] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setProfileMessage('');
    setProfileError('');
    setSavingProfile(true);

    try {
      const response = await fetch(
        '/api/user/profile',
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setProfileError(
          data.message ||
            data.errors?.name?.[0] ||
            'Unable to update your profile.'
        );

        return;
      }

      setProfileMessage(
        data.message ||
          'Profile updated successfully.'
      );
    } catch {
      setProfileError(
        'Unable to update your profile. Please try again.'
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleBusinessSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setBusinessMessage('');
    setBusinessError('');
    setSavingBusiness(true);

    try {
      const response = await fetch(
        '/api/business',
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: businessName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setBusinessError(
          data.message ||
            data.errors?.name?.[0] ||
            'Unable to update the business name.'
        );

        return;
      }

      setBusinessMessage(
        data.message ||
          'Business name updated successfully.'
      );
    } catch {
      setBusinessError(
        'Unable to update the business name. Please try again.'
      );
    } finally {
      setSavingBusiness(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            My Profile
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Update the name displayed across your workspace.
          </p>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="space-y-5 px-6 py-6"
        >
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={255}
              required
              disabled={savingProfile}
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 shadow-sm outline-none"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Your login email cannot be changed from this page.
            </p>
          </div>

          {profileError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {profileError}
              </p>
            </div>
          )}

          {profileMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-700">
                {profileMessage}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingProfile
              ? 'Saving changes...'
              : 'Save profile'}
          </button>
        </form>
      </section>

      {user.role === 'admin' && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-900">
              Business Settings
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Update the name of your inventory workspace.
            </p>
          </div>

          <form
            onSubmit={handleBusinessSubmit}
            className="space-y-5 px-6 py-6"
          >
            <div>
              <label
                htmlFor="business-name"
                className="block text-sm font-medium text-slate-700"
              >
                Business name
              </label>

              <input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
                maxLength={255}
                required
                disabled={savingBusiness}
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                This name appears in your dashboard workspace
                branding.
              </p>
            </div>

            {businessError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {businessError}
                </p>
              </div>
            )}

            {businessMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-medium text-emerald-700">
                  {businessMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={savingBusiness}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingBusiness
                ? 'Saving changes...'
                : 'Save business name'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}