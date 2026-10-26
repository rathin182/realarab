import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { Building2, ChartNoAxesColumn, ClipboardList, LayoutDashboard, Users } from "lucide-react";

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight && value > 0 ? "border-amber-400 bg-amber-50" : ""}`}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
    const session = await requireAdmin();

    const [totalUsers, byStatus, enquiries, topProperties, recentUsers] =
    await Promise.all([
        prisma.user.count(),
        prisma.listing.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.enquiry.count(),
        prisma.listing.findMany({
            where: { status: "LIVE" },
            orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
            take: 7,
            select: { id: true, slug: true, title: true, city: true, price: true, viewCount: true },
        }),
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
    ]);

    const status = Object.fromEntries(byStatus.map((r) => [r.status, r._count._all]));
    const fmt = (d: Date) => d.toLocaleDateString("en-IN");

    return (
        <main className="min-h-screen bg-[#f3f1eb] text-[#24231f] md:grid md:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="flex flex-col border-r border-[#e3dfd5] bg-[#faf9f5] p-4 md:min-h-screen">
                <Link href="/admin" className="mb-8 flex items-center gap-3 px-2 py-3 font-serif text-xl">
                    <Building2 className="h-6 w-6 text-[#8f7654]" /> NAJAM Admin
                </Link>
                <nav aria-label="Admin sections" className="space-y-1 text-sm">
                    <a href="#dashboard" className="flex items-center gap-3 rounded-md bg-[#eee8dc] px-3 py-2.5"><LayoutDashboard className="h-4 w-4" />Dashboard</a>
                    <a href="#users" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><Users className="h-4 w-4" />Users</a>
                    <Link href="/admin/properties" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><Building2 className="h-4 w-4" />Properties</Link>
                    <Link href="/admin/review" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><ClipboardList className="h-4 w-4" />Requests</Link>
                    <a href="#analytics" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><ChartNoAxesColumn className="h-4 w-4" />Analytics</a>
                </nav>
                <div className="mt-auto border-t border-[#e3dfd5] pt-4">
                    <form action={logoutAction}>
                        <button className="w-full rounded-md border border-[#e3dfd5] px-3 py-2 text-left text-sm text-neutral-600">Log out</button>
                    </form>
                </div>
            </aside>

            <div className="min-w-0 space-y-5 p-4 sm:p-6 lg:p-8">
                <header id="dashboard" className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-serif text-3xl">Dashboard</h1>
                        <p className="mt-1 text-sm text-neutral-500">Signed in as {session.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/properties/new" className="rounded-md bg-[#292820] px-4 py-2.5 text-sm text-white hover:bg-[#454337]">Add property</Link>
                        <Link href="/admin/review" className="rounded-md border border-[#d8d3c8] bg-white px-4 py-2.5 text-sm">Review requests</Link>
                    </div>
                </header>

                <section id="analytics" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <Stat label="Total properties" value={Object.values(status).reduce((sum, count) => sum + count, 0)} />
                    <Stat label="Live properties" value={status.LIVE ?? 0} />
                    <Stat label="New users" value={totalUsers} />
                    <Stat label="Inquiry requests" value={enquiries} />
                </section>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                    <section id="properties" className="overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e4db] px-5 py-4">
                            <div>
                                <h2 className="font-serif text-xl">Most viewed properties</h2>
                                <p className="mt-1 text-xs text-neutral-500">Live listings ranked by visits</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/admin/properties" className="text-sm text-neutral-600 hover:underline">Manage properties</Link>
                                <Link href="/admin/properties/new" className="text-sm font-medium text-[#755e3e] hover:underline">+ Add property</Link>
                            </div>
                        </div>
                        {topProperties.length === 0 ? (
                            <div className="px-5 py-12 text-center text-sm text-neutral-500">No live properties yet. Add a property to publish it on the website.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[560px] text-left text-sm">
                                    <thead className="bg-[#f4f1ea] text-xs text-neutral-500"><tr><th className="px-5 py-3 font-medium">Property</th><th className="px-3 py-3 font-medium">Location</th><th className="px-3 py-3 text-right font-medium">Price (SAR)</th><th className="px-5 py-3 text-right font-medium">Views</th></tr></thead>
                                    <tbody>{topProperties.map((property) => <tr key={property.id} className="border-t border-[#e8e4db]"><td className="px-5 py-3"><Link href={`/properties/${property.slug}`} className="font-medium hover:underline">{property.title}</Link></td><td className="px-3 py-3 text-neutral-600">{property.city}</td><td className="px-3 py-3 text-right tabular-nums">{Number(property.price).toLocaleString("en-US")}</td><td className="px-5 py-3 text-right tabular-nums">{property.viewCount.toLocaleString("en-US")}</td></tr>)}</tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section aria-label="Admin chat overview" className="min-h-64 rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
                        <div className="border-b border-[#e8e4db] px-5 py-4"><h2 className="font-serif text-xl">Admin chat overview</h2></div>
                    </section>
                </div>

                <section id="users" className="overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
                    <div className="border-b border-[#e8e4db] px-5 py-4"><h2 className="font-serif text-xl">Recent users</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-sm">
                            <thead className="bg-[#f4f1ea] text-xs text-neutral-500"><tr><th className="px-5 py-3 font-medium">Name</th><th className="px-3 py-3 font-medium">Email</th><th className="px-3 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Joined</th></tr></thead>
                            <tbody>{recentUsers.map((user) => <tr key={user.id} className="border-t border-[#e8e4db]"><td className="px-5 py-3">{user.name ?? "—"}</td><td className="px-3 py-3">{user.email}</td><td className="px-3 py-3">{user.role}</td><td className="px-5 py-3">{fmt(user.createdAt)}</td></tr>)}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}