import SettingsForm from './SettingsForm';
import { getCurrentUser } from '@/lib/auth';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Settings
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Workspace settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your profile and workspace information.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}