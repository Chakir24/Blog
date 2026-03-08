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

      <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-[var(--muted-foreground)]">
            Aucun abonné pour le moment
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
