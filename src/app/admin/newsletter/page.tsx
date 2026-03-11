import { getSubscribers } from '@/lib/storage';
import { SubscriberActions } from './SubscriberActions';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Newsletter</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Liste des abonnés à la newsletter
      </p>

      <div className="mt-12">
        {subscribers.length === 0 ? (
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-12 text-center text-[var(--muted-foreground)]">
            Aucun abonné pour le moment
          </div>
        ) : (
          <>
            {/* Mobile: cartes */}
            <div className="space-y-4 md:hidden">
              {subscribers.map((sub) => (
                <div
                  key={sub.email}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{sub.email}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <SubscriberActions subscriber={sub} />
                </div>
              ))}
            </div>
            {/* Desktop: tableau */}
            <div className="hidden overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--glass-border)]">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date d&apos;inscription</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr
                      key={sub.email}
                      className="border-b border-[var(--glass-border)] last:border-0"
                    >
                      <td className="px-6 py-4 font-medium">{sub.email}</td>
                      <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                        {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <SubscriberActions subscriber={sub} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
